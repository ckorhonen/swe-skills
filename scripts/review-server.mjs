import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import process from "node:process";
import url from "node:url";

const root = process.cwd();
const appRoot = path.join(root, "review-app");
const datasetsRoot = path.join(root, "review-data", "datasets");
const resultsRoot = path.join(root, "review-data", "results");
const port = Number(process.env.PORT || 4312);

fs.mkdirSync(datasetsRoot, { recursive: true });
fs.mkdirSync(resultsRoot, { recursive: true });

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload, null, 2));
}

function sendText(response, statusCode, body, contentType = "text/plain; charset=utf-8") {
  response.writeHead(statusCode, { "Content-Type": contentType });
  response.end(body);
}

function listDatasets() {
  const files = fs
    .readdirSync(datasetsRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(datasetsRoot, entry.name))
    .sort();

  return files.map((filePath) => {
    const dataset = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return {
      datasetId: dataset.datasetId,
      title: dataset.title,
      description: dataset.description,
      itemCount: Array.isArray(dataset.items) ? dataset.items.length : 0
    };
  });
}

function readDataset(datasetId) {
  const filePath = path.join(datasetsRoot, `${datasetId}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readResults(datasetId) {
  const filePath = path.join(resultsRoot, `${datasetId}.json`);
  if (!fs.existsSync(filePath)) {
    return {
      schemaVersion: 1,
      datasetId,
      savedAt: null,
      reviews: {}
    };
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeResults(datasetId, body) {
  const filePath = path.join(resultsRoot, `${datasetId}.json`);
  const payload = {
    ...body,
    schemaVersion: 1,
    datasetId,
    savedAt: new Date().toISOString()
  };
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
  return payload;
}

function getContentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  return "text/plain; charset=utf-8";
}

const server = http.createServer(async (request, response) => {
  const parsed = new url.URL(request.url, `http://127.0.0.1:${port}`);
  const pathname = parsed.pathname;

  if (pathname === "/api/datasets" && request.method === "GET") {
    return sendJson(response, 200, { datasets: listDatasets() });
  }

  const datasetMatch = pathname.match(/^\/api\/datasets\/([^/]+)$/);
  if (datasetMatch && request.method === "GET") {
    const dataset = readDataset(datasetMatch[1]);
    if (!dataset) {
      return sendJson(response, 404, { error: "Dataset not found" });
    }
    return sendJson(response, 200, dataset);
  }

  const resultsMatch = pathname.match(/^\/api\/results\/([^/]+)$/);
  if (resultsMatch && request.method === "GET") {
    return sendJson(response, 200, readResults(resultsMatch[1]));
  }

  if (resultsMatch && request.method === "POST") {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      try {
        const parsedBody = body.length > 0 ? JSON.parse(body) : {};
        const saved = writeResults(resultsMatch[1], parsedBody);
        sendJson(response, 200, saved);
      } catch (error) {
        sendJson(response, 400, { error: error.message });
      }
    });
    return;
  }

  const filePath = pathname === "/"
    ? path.join(appRoot, "index.html")
    : path.join(appRoot, pathname.replace(/^\//, ""));

  if (!filePath.startsWith(appRoot) || !fs.existsSync(filePath)) {
    return sendText(response, 404, "Not found");
  }

  sendText(response, 200, fs.readFileSync(filePath), getContentType(filePath));
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Review server running at http://127.0.0.1:${port}`);
});
