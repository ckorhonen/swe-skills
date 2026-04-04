import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const skillsRoot = path.join(root, "skills");
const evalsRoot = path.join(root, "evals");

const requiredSkillSections = [
  "## What This Skill Does",
  "## When To Use",
  "## Do Not Use",
  "## Inputs To Confirm",
  "## Instructions",
  "## Output Requirements",
  "## Quality Bar"
];

const requiredEvalReadmeSections = [
  "## What This Covers",
  "## Case Mix",
  "## Review Workflow"
];

const requiredRubricSections = [
  "## Pass Conditions",
  "## Fail Conditions",
  "## Common Failure Modes"
];

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function ensure(condition, message, errors) {
  if (!condition) {
    errors.push(message);
  }
}

function parseFrontmatter(filePath, content, errors) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    errors.push(`${relative(filePath)} is missing frontmatter`);
    return null;
  }

  const frontmatter = match[1];
  const nameMatch = frontmatter.match(/^name:\s*["']?([^"'\n]+)["']?\s*$/m);

  ensure(
    Boolean(nameMatch?.[1]),
    `${relative(filePath)} is missing a frontmatter name`,
    errors
  );
  ensure(
    /^description:\s*/m.test(frontmatter),
    `${relative(filePath)} is missing a frontmatter description`,
    errors
  );
  ensure(
    /^compatibility:\s*/m.test(frontmatter),
    `${relative(filePath)} is missing a frontmatter compatibility field`,
    errors
  );
  ensure(
    /^metadata:\s*$/m.test(frontmatter) &&
      /^\s+short-description:\s*.+$/m.test(frontmatter),
    `${relative(filePath)} is missing metadata.short-description`,
    errors
  );

  return {
    name: nameMatch?.[1]?.trim() ?? null
  };
}

function validateSections(filePath, content, headings, errors) {
  for (const heading of headings) {
    ensure(
      new RegExp(`^${escapeRegExp(heading)}$`, "m").test(content),
      `${relative(filePath)} is missing required section "${heading}"`,
      errors
    );
  }
}

function relative(filePath) {
  return path.relative(root, filePath) || ".";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function unique(values) {
  return [...new Set(values)];
}

const errors = [];

const criteriaPath = path.join(evalsRoot, "shared", "criteria.json");
const criteria = readJson(criteriaPath);

ensure(
  criteria.schemaVersion === 1,
  `${relative(criteriaPath)} must use schemaVersion 1`,
  errors
);
ensure(
  Array.isArray(criteria.sharedCriteria) && criteria.sharedCriteria.length > 0,
  `${relative(criteriaPath)} must define at least one shared criterion`,
  errors
);

const criterionIds = new Set();
for (const criterion of criteria.sharedCriteria ?? []) {
  ensure(
    typeof criterion.id === "string" && criterion.id.length > 0,
    `${relative(criteriaPath)} contains a criterion with an invalid id`,
    errors
  );
  ensure(
    !criterionIds.has(criterion.id),
    `${relative(criteriaPath)} repeats criterion id "${criterion.id}"`,
    errors
  );
  criterionIds.add(criterion.id);
}

const skillEntries = fs
  .readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const globalCaseIds = new Set();
let totalCases = 0;

for (const slug of skillEntries) {
  const skillFile = path.join(skillsRoot, slug, "SKILL.md");
  const skillContent = readText(skillFile);
  const frontmatter = parseFrontmatter(skillFile, skillContent, errors);

  validateSections(skillFile, skillContent, requiredSkillSections, errors);

  ensure(
    frontmatter?.name?.startsWith("swe:"),
    `${relative(skillFile)} must use a name prefixed with "swe:"`,
    errors
  );

  const evalDir = path.join(evalsRoot, slug);
  ensure(
    fs.existsSync(evalDir),
    `Missing eval directory for ${slug}: ${relative(evalDir)}`,
    errors
  );

  if (!fs.existsSync(evalDir)) {
    continue;
  }

  const evalReadme = path.join(evalDir, "README.md");
  const rubricFile = path.join(evalDir, "rubric.md");
  const casesFile = path.join(evalDir, "cases.json");

  ensure(fs.existsSync(evalReadme), `Missing ${relative(evalReadme)}`, errors);
  ensure(fs.existsSync(rubricFile), `Missing ${relative(rubricFile)}`, errors);
  ensure(fs.existsSync(casesFile), `Missing ${relative(casesFile)}`, errors);

  if (!fs.existsSync(evalReadme) || !fs.existsSync(rubricFile) ||
    !fs.existsSync(casesFile)) {
    continue;
  }

  validateSections(
    evalReadme,
    readText(evalReadme),
    requiredEvalReadmeSections,
    errors
  );
  validateSections(
    rubricFile,
    readText(rubricFile),
    requiredRubricSections,
    errors
  );

  let casesDocument;
  try {
    casesDocument = readJson(casesFile);
  } catch (error) {
    errors.push(`${relative(casesFile)} is not valid JSON: ${error.message}`);
    continue;
  }

  ensure(
    casesDocument.schemaVersion === 1,
    `${relative(casesFile)} must use schemaVersion 1`,
    errors
  );
  ensure(
    casesDocument.skill === frontmatter?.name,
    `${relative(casesFile)} skill must match ${relative(skillFile)}`,
    errors
  );
  ensure(
    Array.isArray(casesDocument.cases) && casesDocument.cases.length >= 2,
    `${relative(casesFile)} must define at least two cases`,
    errors
  );

  const localCaseIds = new Set();

  for (const [index, testCase] of (casesDocument.cases ?? []).entries()) {
    const prefix = `${relative(casesFile)} case[${index}]`;
    const caseId = testCase?.id;

    ensure(
      typeof caseId === "string" && caseId.length > 0,
      `${prefix} is missing a non-empty id`,
      errors
    );

    if (typeof caseId === "string") {
      ensure(
        caseId.startsWith(`${slug}-`),
        `${prefix} id must start with "${slug}-"`,
        errors
      );
      ensure(!localCaseIds.has(caseId), `${prefix} repeats id "${caseId}"`, errors);
      ensure(
        !globalCaseIds.has(caseId),
        `${prefix} duplicates global case id "${caseId}"`,
        errors
      );
      localCaseIds.add(caseId);
      globalCaseIds.add(caseId);
    }

    ensure(
      typeof testCase?.title === "string" && testCase.title.length > 0,
      `${prefix} is missing a non-empty title`,
      errors
    );
    ensure(
      typeof testCase?.user_request === "string" &&
        testCase.user_request.length > 0,
      `${prefix} is missing a non-empty user_request`,
      errors
    );
    ensure(
      Array.isArray(testCase?.tags) && testCase.tags.length > 0,
      `${prefix} must define at least one tag`,
      errors
    );
    ensure(
      typeof testCase?.context === "object" &&
        typeof testCase?.context?.repo_path === "string" &&
        testCase.context.repo_path.length > 0,
      `${prefix} must define context.repo_path`,
      errors
    );
    ensure(
      Array.isArray(testCase?.artifact_requirements) &&
        testCase.artifact_requirements.length > 0,
      `${prefix} must define artifact_requirements`,
      errors
    );
    ensure(
      Array.isArray(testCase?.shared_criteria) &&
        testCase.shared_criteria.length > 0,
      `${prefix} must define shared_criteria`,
      errors
    );
    ensure(
      Array.isArray(testCase?.review_questions) &&
        testCase.review_questions.length >= 2,
      `${prefix} must define at least two review_questions`,
      errors
    );

    for (const criterionId of testCase?.shared_criteria ?? []) {
      ensure(
        criterionIds.has(criterionId),
        `${prefix} references unknown shared criterion "${criterionId}"`,
        errors
      );
    }

    totalCases += 1;
  }
}

if (errors.length > 0) {
  console.error("Eval validation failed:\n");
  for (const message of unique(errors)) {
    console.error(`- ${message}`);
  }
  process.exit(1);
}

console.log(
  `Validated ${skillEntries.length} skills, ${skillEntries.length} eval sets, and ${totalCases} cases.`
);
