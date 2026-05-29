const resultsBox = document.getElementById("results");
const graphBox = document.getElementById("graph");
const roadmapBox = document.getElementById("roadmap");

function renderResults(items) {
  resultsBox.innerHTML = "";

  if (items.length === 0) {
    resultsBox.innerHTML = "<p>No result found. You can add this as a requested book.</p>";
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <span class="badge">${item.type}</span>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      ${item.author ? `<p><b>Author:</b> ${item.author}</p>` : ""}
      ${item.source ? `<p><b>Available from:</b> ${item.source}</p>` : ""}
      <button onclick="showGraph('${item.title}')">Explore graph</button>
    `;
    resultsBox.appendChild(card);
  });
}

function searchKnowledge() {
  const q = document.getElementById("searchInput").value.toLowerCase();

  const found = knowledgeData.filter(item =>
    item.title.toLowerCase().includes(q) ||
    item.type.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q) ||
    (item.author && item.author.toLowerCase().includes(q)) ||
    item.related.some(r => r.toLowerCase().includes(q))
  );

  renderResults(found);

  if (found[0]) {
    showGraph(found[0].title);
    showRoadmap(found[0].title);
  }
}

function showGraph(title) {
  graphBox.innerHTML = "";
  const item = knowledgeData.find(x => x.title === title);
  if (!item) return;

  const main = document.createElement("div");
  main.className = "node main";
  main.textContent = item.title;
  graphBox.appendChild(main);

  item.related.forEach(r => {
    const node = document.createElement("div");
    node.className = "node";
    node.textContent = r;
    node.onclick = () => {
      document.getElementById("searchInput").value = r;
      searchKnowledge();
    };
    graphBox.appendChild(node);
  });
}

function showRoadmap(topic) {
  roadmapBox.innerHTML = `
    <div class="step">
      <h3>1. Understand the basic idea</h3>
      <p>Start with simple definitions and beginner-friendly explanations of <b>${topic}</b>.</p>
    </div>
    <div class="step">
      <h3>2. Choose one standard book</h3>
      <p>Read one reliable textbook or legal preview before jumping across many sources.</p>
    </div>
    <div class="step">
      <h3>3. Watch lectures</h3>
      <p>Use university lectures, NPTEL, MIT OCW, or similar legal learning platforms.</p>
    </div>
    <div class="step">
      <h3>4. Practice</h3>
      <p>Solve examples, numerical problems, viva questions or exercises.</p>
    </div>
    <div class="step">
      <h3>5. Explore connected topics</h3>
      <p>Use the knowledge graph to move to related books, papers, authors and concepts.</p>
    </div>
  `;
}

renderResults(knowledgeData);
showGraph("Modern Physics");
showRoadmap("Modern Physics");
