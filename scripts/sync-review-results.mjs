import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const datasetsRoot = path.join(root, "review-data", "datasets");
const resultsRoot = path.join(root, "review-data", "results");
const aggregateDatasetId = "all-skills.synthetic";
const aggregateResultsPath = path.join(resultsRoot, `${aggregateDatasetId}.json`);

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

function isBinaryLabel(value) {
  return value === "Pass" || value === "Fail";
}

function reviewScore(item, review) {
  if (!review) {
    return -1;
  }

  const criteriaKeys = (item.sharedCriteria ?? []).map((criterion) => criterion.id);
  const questionKeys = (item.reviewQuestions ?? []).map((_, index) => String(index));

  let score = 0;
  if (review.status === "Pass" || review.status === "Fail" || review.status === "Defer") {
    score += 1;
  }
  if (typeof review.notes === "string" && review.notes.trim().length > 0) {
    score += 1;
  }
  score += criteriaKeys.filter((key) => isBinaryLabel(review.criteria?.[key])).length;
  score += questionKeys.filter((key) => isBinaryLabel(review.questions?.[key])).length;
  return score;
}

function reviewTimestamp(review) {
  const millis = Date.parse(review?.updatedAt ?? "");
  return Number.isFinite(millis) ? millis : -1;
}

function chooseReview(item, existingReview, aggregateReview) {
  if (!existingReview) {
    return aggregateReview ?? null;
  }

  if (!aggregateReview) {
    return existingReview;
  }

  const existingScore = reviewScore(item, existingReview);
  const aggregateScore = reviewScore(item, aggregateReview);
  if (aggregateScore > existingScore) {
    return aggregateReview;
  }
  if (existingScore > aggregateScore) {
    return existingReview;
  }

  return reviewTimestamp(aggregateReview) >= reviewTimestamp(existingReview)
    ? aggregateReview
    : existingReview;
}

if (!fs.existsSync(aggregateResultsPath)) {
  console.error(
    `Missing aggregate results file at ${path.relative(root, aggregateResultsPath)}.`
  );
  process.exit(1);
}

fs.mkdirSync(resultsRoot, { recursive: true });

const aggregateResults = readJson(aggregateResultsPath);
const datasetFiles = listJsonFiles(datasetsRoot)
  .filter((filePath) => path.basename(filePath) !== `${aggregateDatasetId}.json`);

let filesWritten = 0;
let reviewsSynced = 0;

for (const datasetPath of datasetFiles) {
  const dataset = readJson(datasetPath);
  const resultsPath = path.join(resultsRoot, `${dataset.datasetId}.json`);
  const existingResults = fs.existsSync(resultsPath)
    ? readJson(resultsPath)
    : { schemaVersion: 1, datasetId: dataset.datasetId, reviews: {} };

  const output = {
    schemaVersion: 1,
    datasetId: dataset.datasetId,
    reviews: { ...(existingResults.reviews ?? {}) }
  };

  let touched = false;
  for (const item of dataset.items ?? []) {
    const mergedReview = chooseReview(
      item,
      existingResults.reviews?.[item.itemId],
      aggregateResults.reviews?.[item.itemId]
    );

    if (!mergedReview) {
      continue;
    }

    const previousSerialized = JSON.stringify(output.reviews[item.itemId] ?? null);
    const nextSerialized = JSON.stringify(mergedReview);
    if (previousSerialized !== nextSerialized) {
      touched = true;
      reviewsSynced += 1;
    }
    output.reviews[item.itemId] = mergedReview;
  }

  fs.writeFileSync(resultsPath, JSON.stringify(output, null, 2) + "\n");
  if (touched || !fs.existsSync(resultsPath)) {
    filesWritten += 1;
  }
}

console.log(
  `Synced ${reviewsSynced} review entries across ${datasetFiles.length} dataset result files.`
);
