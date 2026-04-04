const state = {
  datasets: [],
  dataset: null,
  results: { reviews: {} },
  currentIndex: 0,
  history: [],
  saveTimer: null
};

const elements = {
  datasetSelect: document.querySelector("#dataset-select"),
  saveStatus: document.querySelector("#save-status"),
  itemCounter: document.querySelector("#item-counter"),
  countPass: document.querySelector("#count-pass"),
  countFail: document.querySelector("#count-fail"),
  countDefer: document.querySelector("#count-defer"),
  countUnlabeled: document.querySelector("#count-unlabeled"),
  jumpInput: document.querySelector("#jump-input"),
  skillLabel: document.querySelector("#skill-label"),
  itemTitle: document.querySelector("#item-title"),
  variantPill: document.querySelector("#variant-pill"),
  casePill: document.querySelector("#case-pill"),
  userRequest: document.querySelector("#user-request"),
  repoPath: document.querySelector("#repo-path"),
  candidateFormat: document.querySelector("#candidate-format"),
  candidateOutput: document.querySelector("#candidate-output"),
  notes: document.querySelector("#review-notes"),
  criteriaList: document.querySelector("#criteria-list"),
  questionList: document.querySelector("#question-list"),
  contextList: document.querySelector("#context-list"),
  artifactList: document.querySelector("#artifact-list"),
  rubricPanel: document.querySelector("#rubric-panel"),
  referencePanel: document.querySelector("#reference-panel"),
  prevButton: document.querySelector("#prev-button"),
  nextButton: document.querySelector("#next-button"),
  decisionButtons: [...document.querySelectorAll(".decision-button")]
};

async function fetchJson(pathname, options) {
  const response = await fetch(pathname, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Request failed: ${response.status}`);
  }

  return response.json();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderMarkdown(markdown) {
  const escaped = escapeHtml(markdown);
  const lines = escaped.split("\n");
  const html = [];
  let inList = false;
  let inCode = false;

  function closeList() {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }

  for (const line of lines) {
    if (line.startsWith("```")) {
      closeList();
      if (!inCode) {
        html.push("<pre><code>");
      } else {
        html.push("</code></pre>");
      }
      inCode = !inCode;
      continue;
    }

    if (inCode) {
      html.push(`${line}\n`);
      continue;
    }

    const headingMatch = line.match(/^(#{1,3}) (.+)$/);
    if (headingMatch) {
      closeList();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${inlineMarkdown(headingMatch[2])}</h${level}>`);
      continue;
    }

    const bulletMatch = line.match(/^- (.+)$/);
    if (bulletMatch) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineMarkdown(bulletMatch[1])}</li>`);
      continue;
    }

    if (line.trim().length === 0) {
      closeList();
      continue;
    }

    closeList();
    html.push(`<p>${inlineMarkdown(line)}</p>`);
  }

  closeList();
  if (inCode) {
    html.push("</code></pre>");
  }

  return html.join("");
}

function inlineMarkdown(text) {
  return text
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function currentItem() {
  return state.dataset?.items?.[state.currentIndex] ?? null;
}

function currentReview(itemId = currentItem()?.itemId) {
  if (!itemId) return null;
  if (!state.results.reviews[itemId]) {
    state.results.reviews[itemId] = {
      status: "",
      notes: "",
      criteria: {},
      questions: {},
      updatedAt: null
    };
  }
  return state.results.reviews[itemId];
}

function cloneReviews() {
  return JSON.parse(JSON.stringify(state.results.reviews));
}

function pushHistory() {
  state.history.push(cloneReviews());
  if (state.history.length > 40) {
    state.history.shift();
  }
}

function setSaveStatus(message) {
  elements.saveStatus.textContent = message;
}

function queueSave() {
  clearTimeout(state.saveTimer);
  setSaveStatus("Saving…");
  state.saveTimer = setTimeout(async () => {
    try {
      await fetchJson(`/api/results/${state.dataset.datasetId}`, {
        method: "POST",
        body: JSON.stringify(state.results)
      });
      setSaveStatus(`Saved ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      setSaveStatus(`Save failed: ${error.message}`);
    }
  }, 150);
}

function updateCounts() {
  const reviews = Object.values(state.results.reviews);
  const counts = { Pass: 0, Fail: 0, Defer: 0, Unlabeled: 0 };

  for (const item of state.dataset.items) {
    const status = state.results.reviews[item.itemId]?.status || "Unlabeled";
    counts[status] += 1;
  }

  elements.countPass.textContent = String(counts.Pass);
  elements.countFail.textContent = String(counts.Fail);
  elements.countDefer.textContent = String(counts.Defer);
  elements.countUnlabeled.textContent = String(counts.Unlabeled);
  elements.itemCounter.textContent = `${state.currentIndex + 1} of ${state.dataset.items.length}`;
}

function renderChecklist(container, items, valueGetter, onChange) {
  container.innerHTML = "";
  for (const item of items) {
    const wrapper = document.createElement("div");
    wrapper.className = "checklist-item";

    const label = document.createElement("p");
    label.textContent = item.label;
    wrapper.append(label);

    const segmented = document.createElement("div");
    segmented.className = "segmented";

    for (const option of [
      { value: "", text: "Unset", className: "" },
      { value: "Pass", text: "Pass", className: "pass" },
      { value: "Fail", text: "Fail", className: "fail" }
    ]) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option.text;
      button.className = valueGetter(item) === option.value
        ? `active ${option.className}`.trim()
        : option.className;
      button.addEventListener("click", () => onChange(item, option.value));
      segmented.append(button);
    }

    wrapper.append(segmented);
    container.append(wrapper);
  }
}

function renderDetails(container, sections) {
  container.innerHTML = "";
  for (const section of sections) {
    if (!section || !section.content || section.content.length === 0) {
      continue;
    }

    const block = document.createElement("div");
    block.className = "detail-block";

    const title = document.createElement("strong");
    title.textContent = section.title;
    block.append(title);

    if (section.kind === "list") {
      const list = document.createElement("ul");
      for (const entry of section.content) {
        const item = document.createElement("li");
        item.textContent = entry;
        list.append(item);
      }
      block.append(list);
    } else if (section.kind === "json") {
      const pre = document.createElement("pre");
      pre.textContent = JSON.stringify(section.content, null, 2);
      block.append(pre);
    } else if (section.kind === "markdown") {
      const article = document.createElement("article");
      article.className = "markdown-body";
      article.innerHTML = renderMarkdown(section.content);
      block.append(article);
    } else {
      const paragraph = document.createElement("p");
      paragraph.textContent = section.content;
      block.append(paragraph);
    }

    container.append(block);
  }
}

function renderCurrentItem() {
  const item = currentItem();
  if (!item) {
    return;
  }

  const review = currentReview(item.itemId);
  elements.skillLabel.textContent = item.skill;
  elements.itemTitle.textContent = item.title;
  elements.variantPill.textContent = item.variant;
  elements.casePill.textContent = item.caseId;
  elements.userRequest.textContent = item.userRequest;
  elements.repoPath.textContent = item.context.repo_path;
  elements.candidateFormat.textContent = item.candidateOutput.format;
  elements.candidateOutput.innerHTML = item.candidateOutput.format === "markdown"
    ? renderMarkdown(item.candidateOutput.content)
    : `<pre>${escapeHtml(item.candidateOutput.content)}</pre>`;
  elements.notes.value = review.notes || "";

  for (const button of elements.decisionButtons) {
    button.classList.toggle("active", button.dataset.decision === review.status);
  }

  renderChecklist(
    elements.criteriaList,
    item.sharedCriteria.map((criterion) => ({
      key: criterion.id,
      label: `${criterion.title}: ${criterion.description}`
    })),
    (criterion) => review.criteria[criterion.key] || "",
    (criterion, value) => {
      pushHistory();
      review.criteria[criterion.key] = value;
      review.updatedAt = new Date().toISOString();
      renderCurrentItem();
      queueSave();
    }
  );

  renderChecklist(
    elements.questionList,
    item.reviewQuestions.map((question, index) => ({
      key: String(index),
      label: question
    })),
    (question) => review.questions[question.key] || "",
    (question, value) => {
      pushHistory();
      review.questions[question.key] = value;
      review.updatedAt = new Date().toISOString();
      renderCurrentItem();
      queueSave();
    }
  );

  renderDetails(elements.contextList, [
    { title: "Context notes", kind: "list", content: item.context.notes || [] },
    {
      title: "Artifact requirements",
      kind: "list",
      content: item.artifactRequirements || []
    }
  ]);

  renderDetails(elements.artifactList, item.artifacts || []);
  renderDetails(elements.rubricPanel, [
    {
      title: "Pass conditions",
      kind: "list",
      content: item.rubric.passConditions || []
    },
    {
      title: "Fail conditions",
      kind: "list",
      content: item.rubric.failConditions || []
    },
    {
      title: "Common failure modes",
      kind: "list",
      content: item.rubric.commonFailureModes || []
    }
  ]);
  renderDetails(elements.referencePanel, [
    {
      title: "Expected overall result",
      kind: "text",
      content: item.reference.expectedOverall
    },
    {
      title: "Reference notes",
      kind: "text",
      content: item.reference.notes
    }
  ]);

  updateCounts();
}

function move(delta) {
  if (!state.dataset) return;
  const nextIndex = Math.min(
    Math.max(state.currentIndex + delta, 0),
    state.dataset.items.length - 1
  );
  state.currentIndex = nextIndex;
  renderCurrentItem();
}

async function loadDataset(datasetId) {
  state.dataset = await fetchJson(`/api/datasets/${datasetId}`);
  state.results = await fetchJson(`/api/results/${datasetId}`);
  state.currentIndex = 0;
  state.history = [];
  renderCurrentItem();
}

async function initDatasets() {
  const payload = await fetchJson("/api/datasets");
  state.datasets = payload.datasets;
  elements.datasetSelect.innerHTML = "";

  for (const dataset of state.datasets) {
    const option = document.createElement("option");
    option.value = dataset.datasetId;
    option.textContent = `${dataset.title} (${dataset.itemCount})`;
    elements.datasetSelect.append(option);
  }

  const url = new URL(window.location.href);
  const requestedDataset = url.searchParams.get("dataset");
  const initialDataset = state.datasets.find((dataset) => dataset.datasetId === requestedDataset)
    ?? state.datasets[0];

  if (!initialDataset) {
    setSaveStatus("No datasets found");
    return;
  }

  elements.datasetSelect.value = initialDataset.datasetId;
  await loadDataset(initialDataset.datasetId);
}

function setDecision(decision) {
  const review = currentReview();
  if (!review) return;
  pushHistory();
  review.status = decision;
  review.updatedAt = new Date().toISOString();
  renderCurrentItem();
  queueSave();
}

function undo() {
  const previous = state.history.pop();
  if (!previous) {
    return;
  }
  state.results.reviews = previous;
  renderCurrentItem();
  queueSave();
}

elements.datasetSelect.addEventListener("change", async (event) => {
  await loadDataset(event.target.value);
});

elements.jumpInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || !state.dataset) {
    return;
  }
  const index = state.dataset.items.findIndex((item) => item.itemId === event.target.value.trim());
  if (index >= 0) {
    state.currentIndex = index;
    renderCurrentItem();
  }
});

elements.prevButton.addEventListener("click", () => move(-1));
elements.nextButton.addEventListener("click", () => move(1));

for (const button of elements.decisionButtons) {
  button.addEventListener("click", () => setDecision(button.dataset.decision));
}

elements.notes.addEventListener("input", () => {
  const review = currentReview();
  if (!review) return;
  review.notes = elements.notes.value;
  review.updatedAt = new Date().toISOString();
  queueSave();
});

window.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTyping =
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLSelectElement;

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    queueSave();
    return;
  }

  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    queueSave();
    move(1);
    return;
  }

  if (isTyping) {
    if (event.key.toLowerCase() === "u" && !event.metaKey && !event.ctrlKey) {
      return;
    }
    return;
  }

  if (event.key === "ArrowLeft") {
    move(-1);
  } else if (event.key === "ArrowRight") {
    move(1);
  } else if (event.key === "1") {
    setDecision("Pass");
  } else if (event.key === "2") {
    setDecision("Fail");
  } else if (event.key.toLowerCase() === "d") {
    setDecision("Defer");
  } else if (event.key.toLowerCase() === "u") {
    undo();
  }
});

initDatasets().catch((error) => {
  setSaveStatus(`Load failed: ${error.message}`);
});
