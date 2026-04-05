import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const datasetsRoot = path.join(root, "review-data", "datasets");
const resultsRoot = path.join(root, "review-data", "results");
const judgesRoot = path.join(root, "judges");

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

function parseJudgeFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  const fields = {};

  for (const line of match?.[1]?.split("\n") ?? []) {
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

function loadDatasets() {
  return listJsonFiles(datasetsRoot)
    .map(readJson)
    .filter((dataset) => dataset.datasetId !== "all-skills.synthetic");
}

function loadResultsByDataset() {
  const entries = new Map();
  for (const filePath of listJsonFiles(resultsRoot)) {
    const document = readJson(filePath);
    entries.set(document.datasetId, document);
  }
  return entries;
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
    .map((entry) => parseJudgeFrontmatter(path.join(judgesRoot, entry.name)))
    .sort((left, right) => left.id.localeCompare(right.id));
}

function isBinaryLabel(value) {
  return value === "Pass" || value === "Fail";
}

function completionForItem(item, review) {
  const criteriaKeys = (item.sharedCriteria ?? []).map((criterion) => criterion.id);
  const questionKeys = (item.reviewQuestions ?? []).map((_, index) => String(index));
  const criteriaLabeled = criteriaKeys.filter((key) => isBinaryLabel(review?.criteria?.[key])).length;
  const questionsLabeled = questionKeys.filter((key) => isBinaryLabel(review?.questions?.[key])).length;
  const overallLabeled = typeof review?.status === "string" && review.status.length > 0;

  return {
    overallLabeled,
    criteriaLabeled,
    criteriaTotal: criteriaKeys.length,
    questionsLabeled,
    questionsTotal: questionKeys.length,
    needsDetail:
      !overallLabeled ||
      criteriaLabeled < criteriaKeys.length ||
      questionsLabeled < questionKeys.length
  };
}

function readinessStatus(passCount, failCount) {
  if (passCount >= 20 && failCount >= 20) {
    return {
      status: "ready",
      note: "Enough explicit labels for a real train/dev/test split."
    };
  }

  if (passCount >= 5 && failCount >= 5) {
    return {
      status: "bootstrap-only",
      note: "Enough for prompt iteration or smoke tests, but not for trusted calibration."
    };
  }

  return {
    status: "not-ready",
    note: "Need more explicit criterion labels before calibration is meaningful."
  };
}

const datasets = loadDatasets();
const resultsByDataset = loadResultsByDataset();
const judges = loadJudges();
const criterionCounts = new Map();
const eligibleItemCounts = new Map();
const datasetSummaries = [];
let totalItems = 0;
let totalNeedDetail = 0;

for (const dataset of datasets) {
  const results = resultsByDataset.get(dataset.datasetId) ?? { reviews: {} };
  let overallLabeled = 0;
  let criteriaLabeled = 0;
  let criteriaTotal = 0;
  let questionsLabeled = 0;
  let questionsTotal = 0;
  let needsDetail = 0;

  for (const item of dataset.items ?? []) {
    totalItems += 1;
    const review = results.reviews?.[item.itemId];
    const completion = completionForItem(item, review);

    if (completion.overallLabeled) {
      overallLabeled += 1;
    }

    criteriaLabeled += completion.criteriaLabeled;
    criteriaTotal += completion.criteriaTotal;
    questionsLabeled += completion.questionsLabeled;
    questionsTotal += completion.questionsTotal;

    if (completion.needsDetail) {
      needsDetail += 1;
      totalNeedDetail += 1;
    }

    for (const criterionId of (item.sharedCriteria ?? []).map((criterion) => criterion.id)) {
      eligibleItemCounts.set(criterionId, (eligibleItemCounts.get(criterionId) ?? 0) + 1);

      if (!criterionCounts.has(criterionId)) {
        criterionCounts.set(criterionId, { pass: 0, fail: 0 });
      }

      const label = review?.criteria?.[criterionId];
      if (label === "Pass") {
        criterionCounts.get(criterionId).pass += 1;
      } else if (label === "Fail") {
        criterionCounts.get(criterionId).fail += 1;
      }
    }
  }

  datasetSummaries.push({
    datasetId: dataset.datasetId,
    itemTotal: dataset.items?.length ?? 0,
    overallLabeled,
    criteriaLabeled,
    criteriaTotal,
    questionsLabeled,
    questionsTotal,
    needsDetail
  });
}

console.log("Review coverage\n");
for (const dataset of datasetSummaries) {
  console.log(
    `- ${dataset.datasetId}: overall ${dataset.overallLabeled}/${dataset.itemTotal}, ` +
      `criteria ${dataset.criteriaLabeled}/${dataset.criteriaTotal}, ` +
      `questions ${dataset.questionsLabeled}/${dataset.questionsTotal}, ` +
      `items needing detail ${dataset.needsDetail}`
  );
}

console.log("\nCriterion label coverage\n");
for (const [criterionId, counts] of [...criterionCounts.entries()].sort((left, right) =>
  String(left[0]).localeCompare(String(right[0]))
)) {
  console.log(
    `- ${criterionId}: Pass ${counts.pass}, Fail ${counts.fail}, explicit ${counts.pass + counts.fail}`
  );
}

console.log("\nJudge readiness\n");
for (const judge of judges) {
  const counts = criterionCounts.get(judge.criterion) ?? { pass: 0, fail: 0 };
  const readiness = readinessStatus(counts.pass, counts.fail);
  const eligibleItems = eligibleItemCounts.get(judge.criterion) ?? 0;
  console.log(
    `- ${judge.id}: criterion ${judge.criterion}, Pass ${counts.pass}, ` +
      `Fail ${counts.fail}, eligible items ${eligibleItems}, ` +
      `status ${readiness.status} (${readiness.note})`
  );
}

console.log("\nRecommended next step\n");
if (totalNeedDetail > 0) {
  console.log(
    `- ${totalNeedDetail} of ${totalItems} dataset items still need either an overall verdict, ` +
      "criterion labels, or review-question labels."
  );
}

for (const judge of judges) {
  const counts = criterionCounts.get(judge.criterion) ?? { pass: 0, fail: 0 };
  const missingPass = Math.max(0, 20 - counts.pass);
  const missingFail = Math.max(0, 20 - counts.fail);
  const eligibleItems = eligibleItemCounts.get(judge.criterion) ?? 0;

  if (eligibleItems < 40) {
    console.log(
      `- ${judge.id} appears on only ${eligibleItems} current items, so the corpus needs expansion before a 20 Pass / 20 Fail calibration target is even possible.`
    );
    continue;
  }

  if (missingPass > 0 || missingFail > 0) {
    console.log(
      `- ${judge.id} still needs ${missingPass} more Pass and ${missingFail} more Fail explicit criterion labels to reach the recommended minimum.`
    );
  }
}
