import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const datasetsRoot = path.join(root, "review-data", "datasets");
const resultsRoot = path.join(root, "review-data", "results");
const judgesRoot = path.join(root, "judges");
const outputRoot = path.join(root, "review-data", "judges");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function listJsonFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(dirPath, entry.name))
    .sort();
}

function parseJudge(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n?/);
  const fields = {};

  for (const line of frontmatterMatch?.[1]?.split("\n") ?? []) {
    const fieldMatch = line.match(/^([a-z-]+):\s*(.+?)\s*$/);
    if (!fieldMatch) {
      continue;
    }

    fields[fieldMatch[1]] = fieldMatch[2].replace(/^["']|["']$/g, "");
  }

  return {
    id: fields.id ?? path.basename(filePath, ".md"),
    criterion: fields.criterion ?? "",
    filePath
  };
}

function loadJudges() {
  if (!fs.existsSync(judgesRoot)) {
    return [];
  }

  return fs
    .readdirSync(judgesRoot, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".md") &&
        entry.name !== "README.md"
    )
    .map((entry) => parseJudge(path.join(judgesRoot, entry.name)))
    .sort((left, right) => left.id.localeCompare(right.id));
}

function loadDatasets() {
  const map = new Map();
  for (const filePath of listJsonFiles(datasetsRoot)) {
    const document = readJson(filePath);
    if (document.datasetId === "all-skills.synthetic") {
      continue;
    }
    map.set(document.datasetId, document);
  }
  return map;
}

function loadResults() {
  const map = new Map();
  for (const filePath of listJsonFiles(resultsRoot)) {
    const document = readJson(filePath);
    map.set(document.datasetId, document);
  }
  return map;
}

function isBinaryLabel(value) {
  return value === "Pass" || value === "Fail";
}

function buildPromptInputs(judgeId, item) {
  const base = {
    userRequest: item.userRequest,
    candidateOutput: item.candidateOutput?.content ?? "",
    taskContext: {
      repoPath: item.context?.repo_path ?? ".",
      notes: item.context?.notes ?? [],
      availableArtifacts: item.context?.available_artifacts ?? [],
      artifactRequirements: item.artifactRequirements ?? []
    }
  };

  if (judgeId === "scope-discipline") {
    return {
      ...base,
      scopeConstraints: item.context?.notes ?? []
    };
  }

  if (judgeId === "evidence-grounding") {
    return {
      ...base,
      evidence: {
        availableArtifacts: item.context?.available_artifacts ?? [],
        artifactRequirements: item.artifactRequirements ?? [],
        supportingArtifacts: item.artifacts ?? []
      }
    };
  }

  return base;
}

function buildSuggestedSplit(examples) {
  const byLabel = {
    Pass: examples.filter((example) => example.humanLabel === "Pass"),
    Fail: examples.filter((example) => example.humanLabel === "Fail")
  };

  if (byLabel.Pass.length < 5 || byLabel.Fail.length < 5) {
    return null;
  }

  const splitExamples = [];

  for (const label of ["Pass", "Fail"]) {
    const group = [...byLabel[label]].sort((left, right) => left.itemId.localeCompare(right.itemId));
    const total = group.length;
    const trainCount = Math.max(1, Math.round(total * 0.15));
    const devCount = Math.max(1, Math.round(total * 0.45));

    for (const [index, example] of group.entries()) {
      let split = "test";
      if (index < trainCount) {
        split = "train";
      } else if (index < trainCount + devCount) {
        split = "dev";
      }

      splitExamples.push({
        ...example,
        suggestedSplit: split
      });
    }
  }

  return splitExamples.sort((left, right) => left.itemId.localeCompare(right.itemId));
}

fs.mkdirSync(outputRoot, { recursive: true });

const judges = loadJudges();
const datasets = loadDatasets();
const results = loadResults();

let filesWritten = 0;

for (const judge of judges) {
  const examples = [];
  let eligibleItemCount = 0;

  for (const [datasetId, dataset] of datasets.entries()) {
    const reviewDocument = results.get(datasetId);
    if (!reviewDocument) {
      continue;
    }

    for (const item of dataset.items ?? []) {
      const isEligible = (item.sharedCriteria ?? []).some(
        (criterion) => criterion.id === judge.criterion
      );

      if (isEligible) {
        eligibleItemCount += 1;
      }

      const review = reviewDocument.reviews?.[item.itemId];
      const label = review?.criteria?.[judge.criterion];
      if (!isBinaryLabel(label)) {
        continue;
      }

      examples.push({
        exampleId: `${judge.id}:${item.itemId}`,
        judgeId: judge.id,
        criterion: judge.criterion,
        datasetId,
        itemId: item.itemId,
        skill: item.skill,
        caseId: item.caseId,
        title: item.title,
        variant: item.variant,
        humanLabel: label,
        reviewStatus: review?.status ?? "",
        reviewNotes: review?.notes ?? "",
        reviewedAt: review?.updatedAt ?? null,
        promptInputs: buildPromptInputs(judge.id, item),
        source: {
          datasetPath: path.relative(root, path.join(datasetsRoot, `${datasetId}.json`)),
          resultsPath: path.relative(root, path.join(resultsRoot, `${datasetId}.json`))
        }
      });
    }
  }

  const passCount = examples.filter((example) => example.humanLabel === "Pass").length;
  const failCount = examples.filter((example) => example.humanLabel === "Fail").length;
  const explicitCount = passCount + failCount;
  const suggestedExamples = buildSuggestedSplit(examples);

  const payload = {
    schemaVersion: 1,
    judgeId: judge.id,
    criterion: judge.criterion,
    generatedAt: new Date().toISOString(),
    counts: {
      pass: passCount,
      fail: failCount,
      explicit: explicitCount
    },
    calibrationReadiness: {
      ready: passCount >= 20 && failCount >= 20,
      note:
        passCount >= 20 && failCount >= 20
          ? "Enough explicit criterion labels for a real train/dev/test split."
          : eligibleItemCount < 40
            ? "Current corpus is too small for a 20 Pass / 20 Fail calibration target; add more eligible items first."
            : "Not enough explicit criterion labels yet for trusted calibration."
    },
    eligibleItemCount,
    suggestedSplitApplied: Boolean(suggestedExamples),
    examples: suggestedExamples ??
      examples.sort((left, right) => left.itemId.localeCompare(right.itemId))
  };

  fs.writeFileSync(
    path.join(outputRoot, `${judge.id}.json`),
    JSON.stringify(payload, null, 2)
  );
  filesWritten += 1;
}

console.log(
  `Wrote ${filesWritten} judge dataset files to ${path.relative(root, outputRoot)}.`
);
