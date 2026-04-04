import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const evalsRoot = path.join(root, "evals");
const datasetDir = path.join(root, "review-data", "datasets");
const criteria = JSON.parse(
  fs.readFileSync(path.join(evalsRoot, "shared", "criteria.json"), "utf8")
);

function slugToSkillName(slug) {
  return `swe:${slug}`;
}

function listEvalSlugs() {
  return fs
    .readdirSync(evalsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "shared")
    .map((entry) => entry.name)
    .sort();
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function parseRubricSections(markdown) {
  const sections = {};
  let current = null;
  let currentIndex = -1;

  for (const line of markdown.split("\n")) {
    const headingMatch = line.match(/^## (.+)$/);
    if (headingMatch) {
      current = headingMatch[1];
      sections[current] = [];
      currentIndex = -1;
      continue;
    }

    const bulletMatch = line.match(/^- (.+)$/);
    if (current && bulletMatch) {
      sections[current].push(bulletMatch[1].trim());
      currentIndex = sections[current].length - 1;
      continue;
    }

    if (
      current &&
      currentIndex >= 0 &&
      /^\s{2,}\S/.test(line)
    ) {
      sections[current][currentIndex] = `${sections[current][currentIndex]} ${line.trim()}`;
    }
  }

  return {
    passConditions: sections["Pass Conditions"] ?? [],
    failConditions: sections["Fail Conditions"] ?? [],
    commonFailureModes: sections["Common Failure Modes"] ?? []
  };
}

function buildCandidateOutput(slug, verdict, testCase) {
  const outputs = {
    "capture-knowledge": {
      pass: `## Existing guidance\n- README.md documents the install flow and current repo structure.\n- AGENTS.md defines the agent workflow and the \`swe:\` naming convention.\n\n## Missing guidance worth review\n1. Add a short note that generated review datasets and saved result JSON stay local under \`review-data/\`.\n   Evidence: the review workflow now depends on local dataset generation and browser review state.\n   Suggested destination: README.md\n2. Add guidance that draft judges in \`judges/\` are not validated and must not be treated as trusted evaluators.\n   Evidence: the repo includes draft judge assets plus a dedicated validator.\n   Suggested destination: README.md\n\n## Weak signals skipped\n- No evidence yet that this repo needs additional CI guidance beyond the current markdown and eval commands.\n\n## Review step\nThis is a draft review packet only. I am not writing back any guidance until the proposed entries are approved.`,
      fail: `This repo seems to need more documentation in general. I would add a lot more agent guidance everywhere, probably including detailed architecture notes and broad workflow rules, and then write those changes back immediately so future agents have more context.`
    },
    "merged-pr-monitoring": {
      pass: `## PR 101\n- Merge time: 2026-04-03 14:12 UTC\n- Deployment: confirmed in release log at 2026-04-03 14:28 UTC\n- Impact: no meaningful error-rate change in the 30 minute window after deploy; latency increased slightly but stayed within normal daily variance.\n\n## PR 102\n- Merge time: 2026-04-03 16:05 UTC\n- Deployment: confirmed in release log at 2026-04-03 16:24 UTC\n- Impact: trace sample shows a small drop in p95 latency for the touched endpoint, but no broader production shift is visible.\n\n## Conclusion\nBoth PRs reached production. Neither shows strong evidence of harmful production impact in the observed window.`,
      fail: `The last merged changes probably hit production and likely caused some latency issues. Since the service felt slower afterward, I suspect the newest PR is responsible even though I did not confirm the deploy records.`
    },
    "recent-commit-bug-hunt": {
      pass: `## Scope reviewed\n- Last 24 hours of commits by the requested author\n\n## Ranked findings\n1. Likely regression in review packet formatting\n   Evidence: the packet renderer originally truncated multi-line descriptions; the issue reproduced locally when rendering \`repo-introspection\`.\n   Minimal fix: adjust frontmatter parsing and re-run the packet command.\n   Validation: \`npm run evals:packet -- repo-introspection\`\n\n## Weak-signal findings skipped\n- A possible docs inconsistency in review-data guidance looked suspicious, but there is no failing example tied to a recent commit yet.\n\n## Proposed remediation session\n- Session name: fix review packet description parsing\n- Target surface: \`scripts/render-review-packet.mjs\`\n- Validation: rerender one packet and confirm the full description appears.`,
      fail: `You probably broke several things across the repo. I would start by cleaning up the scripts, refactoring the review app, and modernizing the docs because those areas often hide regressions.`
    },
    "refactor-opportunities": {
      pass: `1. Extract repeated frontmatter parsing helpers\n   Surface: \`scripts/validate-evals.mjs\`, \`scripts/validate-judges.mjs\`, \`scripts/render-review-packet.mjs\`\n   Why safe: all three scripts duplicate small parsing logic and can share one local utility without changing behavior.\n   Validation: rerun the existing npm validation commands.\n\n2. Normalize repeated path setup for review-data directories\n   Surface: \`scripts/build-review-dataset.mjs\`, \`scripts/review-server.mjs\`\n   Why safe: a tiny helper would reduce duplication without changing the public commands.\n   Validation: rebuild datasets and restart the local review server.`,
      fail: `A good refactor here would be to redesign the whole eval system around a richer web app and move all of the scripts into a new architecture. Another good idea is to rename most files for consistency.`
    },
    "repo-introspection": {
      pass: `## Repository summary\nThis repository stores Markdown-based \`swe:\` skill definitions and a lightweight local eval workflow.\n\n## Structure map\n- \`skills/\`: current skill definitions\n- \`evals/\`: per-skill cases and rubrics\n- \`judges/\`: draft subjective judge prompts\n- \`review-app/\`: zero-dependency browser review UI\n- \`scripts/\`: local Node utilities for validation, packet rendering, dataset generation, and the review server\n\n## Tooling and validation\n- \`package.json\` defines \`npm run lint:md\`, \`npm run evals:check\`, \`npm run judges:check\`, \`npm run review:build-dataset\`, and \`npm run review:serve\`.\n- The repo is docs-and-scripts oriented; no application runtime surface is visible.\n\n## Safe starting points\n- \`evals/<skill>/\` is a low-risk place to improve case coverage or rubrics.\n- \`judges/\` is safe for draft prompt iteration as long as the prompts remain marked unvalidated.\n\n## Unknowns or risks\n- I do not see a hidden service or backend runtime entry point in this repo; treating it as a documentation and tooling repo is an observation, not a full architectural claim.`,
      fail: `This appears to be a standard monorepo with multiple backend services and likely a primary application under src/. The safest place to start is probably the main runtime entrypoint, although I have not identified it directly.`
    },
    "security-audit": {
      pass: `## Audit units\n- Root Node package defined by \`package.json\` and \`package-lock.json\`\n\n## Checks run\n- \`npm audit\` or equivalent ecosystem-native dependency audit for the root package surface\n\n## Findings\n- No critical dependency findings were observed in the visible package surface.\n- Coverage note: this is a dependency and package-surface audit only, not a broad secure-code review.\n\n## Follow-up\n- Re-run the audit after dependency changes or if new package surfaces are added.`,
      fail: `The repository looks reasonably secure overall. I did not run a package-specific audit, but the code seems simple, so there are probably no meaningful security concerns.`
    }
  };

  const bySkill = outputs[slug];
  if (!bySkill) {
    return {
      format: "markdown",
      content: verdict === "pass"
        ? `Structured output for ${slugToSkillName(slug)} that stays within scope and cites visible repo evidence.`
        : `Generic unsupported output for ${slugToSkillName(slug)} with weak evidence and poor actionability.`
    };
  }

  return {
    format: "markdown",
    content: verdict === "pass" ? bySkill.pass : bySkill.fail
  };
}

function buildDataset(slug, allCriteria) {
  const evalDir = path.join(evalsRoot, slug);
  const casesDocument = JSON.parse(
    fs.readFileSync(path.join(evalDir, "cases.json"), "utf8")
  );
  const rubric = parseRubricSections(readText(path.join(evalDir, "rubric.md")));

  const items = [];
  for (const testCase of casesDocument.cases) {
    for (const verdict of ["pass", "fail"]) {
      const itemId = `${testCase.id}__synthetic-${verdict}`;
      items.push({
        itemId,
        skill: casesDocument.skill,
        caseId: testCase.id,
        title: `${testCase.title} (${verdict === "pass" ? "likely pass" : "likely fail"})`,
        variant: verdict === "pass" ? "likely-pass" : "likely-fail",
        userRequest: testCase.user_request,
        context: testCase.context,
        artifactRequirements: testCase.artifact_requirements,
        sharedCriteria: testCase.shared_criteria.map((criterionId) =>
          allCriteria.get(criterionId)
        ),
        reviewQuestions: testCase.review_questions,
        rubric,
        candidateOutput: buildCandidateOutput(slug, verdict, testCase),
        artifacts: [
          {
            title: "Static checks",
            kind: "list",
            content: testCase.static_checks ?? []
          },
          {
            title: "Available artifacts",
            kind: "list",
            content: testCase.context.available_artifacts ?? []
          }
        ],
        reference: {
          expectedOverall: verdict === "pass" ? "Pass" : "Fail",
          notes: verdict === "pass"
            ? "Synthetic seed output intended to satisfy most rubric expectations."
            : "Synthetic seed output intended to violate one or more core rubric expectations."
        }
      });
    }
  }

  return {
    schemaVersion: 1,
    datasetId: `${slug}.synthetic`,
    title: `${casesDocument.skill} Synthetic Review Dataset`,
    description: `Synthetic seed review items for ${casesDocument.skill}. Use these for UI smoke tests and rubric walk-throughs only.`,
    generatedAt: new Date().toISOString(),
    source: {
      kind: "synthetic-seed",
      evalDirectory: `evals/${slug}`
    },
    items
  };
}

fs.mkdirSync(datasetDir, { recursive: true });

const criteriaById = new Map(
  criteria.sharedCriteria.map((criterion) => [criterion.id, criterion])
);

const slugs = listEvalSlugs();
const datasets = [];
const aggregateItems = [];

for (const slug of slugs) {
  const dataset = buildDataset(slug, criteriaById);
  datasets.push(dataset);
  aggregateItems.push(...dataset.items);
  fs.writeFileSync(
    path.join(datasetDir, `${dataset.datasetId}.json`),
    JSON.stringify(dataset, null, 2)
  );
}

const allDataset = {
  schemaVersion: 1,
  datasetId: "all-skills.synthetic",
  title: "All SWE Skills Synthetic Review Dataset",
  description: "Synthetic seed review items across all current swe: skills.",
  generatedAt: new Date().toISOString(),
  source: {
    kind: "synthetic-seed",
    evalDirectories: slugs.map((slug) => `evals/${slug}`)
  },
  items: aggregateItems
};

fs.writeFileSync(
  path.join(datasetDir, `${allDataset.datasetId}.json`),
  JSON.stringify(allDataset, null, 2)
);

console.log(
  `Wrote ${datasets.length + 1} review dataset files to ${path.relative(root, datasetDir)}.`
);
