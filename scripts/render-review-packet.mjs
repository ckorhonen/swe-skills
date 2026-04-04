import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

function usage() {
  console.error(
    "Usage: node scripts/render-review-packet.mjs <skill-slug> [--out <path>]"
  );
  process.exit(1);
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new Error("Missing frontmatter");
  }

  const frontmatter = match[1];
  const name = readFrontmatterField(frontmatter, "name") ?? "<missing-name>";
  const description =
    readFrontmatterField(frontmatter, "description") ?? "<missing-description>";

  return { name, description };
}

function readFrontmatterField(frontmatter, key) {
  const lines = frontmatter.split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.startsWith(`${key}:`)) {
      continue;
    }

    const firstValue = line.slice(key.length + 1).trim();
    const continuation = [];

    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      if (/^[a-z-]+:\s*/.test(lines[cursor])) {
        break;
      }

      if (lines[cursor].trim().length === 0) {
        continue;
      }

      if (/^\s+/.test(lines[cursor])) {
        continuation.push(lines[cursor].trim());
        continue;
      }

      break;
    }

    if (firstValue === ">" || firstValue === ">-" || firstValue === "|" ||
      firstValue === "|-") {
      return continuation.join(" ").trim();
    }

    return [firstValue.replace(/^["']|["']$/g, ""), ...continuation]
      .join(" ")
      .trim();
  }

  return null;
}

function stripFirstHeading(markdown) {
  return markdown.replace(/^# .*\n\n?/, "").trim();
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
  usage();
}

let skillSlug = null;
let outputPath = null;

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === "--out") {
    outputPath = args[index + 1];
    index += 1;
    continue;
  }

  if (!skillSlug) {
    skillSlug = arg;
    continue;
  }

  usage();
}

if (!skillSlug) {
  usage();
}

const skillFile = path.join(root, "skills", skillSlug, "SKILL.md");
const rubricFile = path.join(root, "evals", skillSlug, "rubric.md");
const casesFile = path.join(root, "evals", skillSlug, "cases.json");
const criteriaFile = path.join(root, "evals", "shared", "criteria.json");

for (const filePath of [skillFile, rubricFile, casesFile, criteriaFile]) {
  if (!fs.existsSync(filePath)) {
    console.error(`Missing required file: ${path.relative(root, filePath)}`);
    process.exit(1);
  }
}

const skillContent = readText(skillFile);
const rubricContent = stripFirstHeading(readText(rubricFile));
const casesDocument = readJson(casesFile);
const criteriaDocument = readJson(criteriaFile);
const { name, description } = parseFrontmatter(skillContent);

const criteriaById = new Map(
  criteriaDocument.sharedCriteria.map((criterion) => [criterion.id, criterion])
);

const referencedCriteria = [
  ...new Set(casesDocument.cases.flatMap((testCase) => testCase.shared_criteria))
].map((criterionId) => criteriaById.get(criterionId));

const reviewTemplate = {
  schemaVersion: 1,
  reviewId: "replace-me",
  skill: name,
  caseId: "replace-me",
  reviewer: "replace-me",
  reviewedAt: "2026-04-04T00:00:00.000Z",
  result: "Pass",
  sharedCriteriaResults: [
    {
      criterionId: "scope-discipline",
      result: "Pass",
      notes: ""
    }
  ],
  caseQuestionResults: [
    {
      question: "replace-me",
      result: "Pass",
      notes: ""
    }
  ],
  summary: ""
};

const lines = [
  `# Review Packet: ${name}`,
  "",
  `Generated from \`skills/${skillSlug}/SKILL.md\` and \`evals/${skillSlug}/\`.`,
  "",
  "## Skill Summary",
  "",
  `- Skill: \`${name}\``,
  `- Slug: \`${skillSlug}\``,
  `- Description: ${description}`,
  "",
  "## Shared Criteria In Scope",
  ""
];

for (const criterion of referencedCriteria) {
  lines.push(`### ${criterion.title}`);
  lines.push("");
  lines.push(`- ID: \`${criterion.id}\``);
  lines.push(`- Description: ${criterion.description}`);
  lines.push(`- Pass: ${criterion.passCondition}`);
  lines.push(`- Fail: ${criterion.failCondition}`);
  lines.push("");
}

lines.push("## Skill Rubric");
lines.push("");
lines.push(rubricContent);
lines.push("");
lines.push("## Cases");
lines.push("");

for (const testCase of casesDocument.cases) {
  lines.push(`### ${testCase.title}`);
  lines.push("");
  lines.push(`- Case ID: \`${testCase.id}\``);
  lines.push(`- Tags: ${testCase.tags.map((tag) => `\`${tag}\``).join(", ")}`);
  lines.push(`- Repo Path: \`${testCase.context.repo_path}\``);
  lines.push("");
  lines.push("#### User Request");
  lines.push("");
  lines.push(testCase.user_request);
  lines.push("");

  if ((testCase.context.notes ?? []).length > 0) {
    lines.push("#### Context Notes");
    lines.push("");
    for (const note of testCase.context.notes) {
      lines.push(`- ${note}`);
    }
    lines.push("");
  }

  if ((testCase.context.available_artifacts ?? []).length > 0) {
    lines.push("#### Available Artifacts");
    lines.push("");
    for (const artifact of testCase.context.available_artifacts) {
      lines.push(`- ${artifact}`);
    }
    lines.push("");
  }

  lines.push("#### Required Artifacts To Inspect");
  lines.push("");
  for (const artifact of testCase.artifact_requirements) {
    lines.push(`- ${artifact}`);
  }
  lines.push("");

  if ((testCase.static_checks ?? []).length > 0) {
    lines.push("#### Static Checks");
    lines.push("");
    for (const check of testCase.static_checks) {
      lines.push(`- ${check}`);
    }
    lines.push("");
  }

  lines.push("#### Review Questions");
  lines.push("");
  for (const question of testCase.review_questions) {
    lines.push(`- ${question}`);
  }
  lines.push("");
}

lines.push("## Review Result Template");
lines.push("");
lines.push(
  "Use `evals/shared/review-result.schema.json` when saving labeled review results."
);
lines.push("");
lines.push("```json");
lines.push(JSON.stringify(reviewTemplate, null, 2));
lines.push("```");
lines.push("");

const output = lines.join("\n");

if (outputPath) {
  const resolvedOutput = path.resolve(root, outputPath);
  fs.mkdirSync(path.dirname(resolvedOutput), { recursive: true });
  fs.writeFileSync(resolvedOutput, output);
  console.log(`Wrote ${path.relative(root, resolvedOutput)}`);
} else {
  process.stdout.write(output);
}
