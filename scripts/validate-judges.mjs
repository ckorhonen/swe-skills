import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const judgesRoot = path.join(root, "judges");
const requiredSections = [
  "## Failure Mode",
  "## Inputs",
  "## Pass Definition",
  "## Fail Definition",
  "## Few-Shot Example Plan",
  "## Structured Output",
  "## Draft Prompt",
  "## Validation Status"
];

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseFrontmatter(filePath, content, errors) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    errors.push(`${relative(filePath)} is missing frontmatter`);
    return null;
  }

  const frontmatter = match[1];
  const fields = {};

  for (const line of frontmatter.split("\n")) {
    const fieldMatch = line.match(/^([a-z-]+):\s*(.+?)\s*$/);
    if (!fieldMatch) {
      continue;
    }

    fields[fieldMatch[1]] = fieldMatch[2].replace(/^["']|["']$/g, "");
  }

  return fields;
}

function relative(filePath) {
  return path.relative(root, filePath) || ".";
}

function ensure(condition, message, errors) {
  if (!condition) {
    errors.push(message);
  }
}

const errors = [];
const sharedSchema = path.join(judgesRoot, "shared", "judge-result.schema.json");

ensure(fs.existsSync(sharedSchema), `Missing ${relative(sharedSchema)}`, errors);

const judgeFiles = fs
  .readdirSync(judgesRoot, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isFile() &&
      entry.name.endsWith(".md") &&
      entry.name !== "README.md"
  )
  .map((entry) => path.join(judgesRoot, entry.name))
  .sort();

ensure(judgeFiles.length > 0, "No judge prompt files found", errors);

for (const judgeFile of judgeFiles) {
  const content = readText(judgeFile);
  const frontmatter = parseFrontmatter(judgeFile, content, errors);

  ensure(
    frontmatter?.status === "draft",
    `${relative(judgeFile)} must declare status: draft`,
    errors
  );
  ensure(
    frontmatter?.validated === "false",
    `${relative(judgeFile)} must declare validated: false`,
    errors
  );
  ensure(
    typeof frontmatter?.id === "string" && frontmatter.id.length > 0,
    `${relative(judgeFile)} is missing a frontmatter id`,
    errors
  );
  ensure(
    typeof frontmatter?.criterion === "string" && frontmatter.criterion.length > 0,
    `${relative(judgeFile)} is missing a frontmatter criterion`,
    errors
  );

  for (const section of requiredSections) {
    ensure(
      new RegExp(`^${escapeRegExp(section)}$`, "m").test(content),
      `${relative(judgeFile)} is missing required section "${section}"`,
      errors
    );
  }
}

if (errors.length > 0) {
  console.error("Judge validation failed:\n");
  for (const error of [...new Set(errors)]) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Validated ${judgeFiles.length} draft judges.`);
