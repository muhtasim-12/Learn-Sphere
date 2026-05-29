const cards = document.getElementById("cards");
const graphArea = document.getElementById("graphArea");
const aiAnswer = document.getElementById("aiAnswer");
const requestList = document.getElementById("requestList");

document.getElementById("totalItems").textContent = catalog.length;

const categories = [...new Set(catalog.map(i => i.category))].sort();
const types = [...new Set(catalog.map(i => i.type))].sort();

const categoryButtons = document.getElementById("categoryButtons");
const categoryFilter = document.getElementById("categoryFilter");
const typeFilter = document.getElementById("typeFilter");

categories.forEach(cat => {
  const btn = document.createElement("button");
  btn.textContent = cat;
  btn.onclick = () => {
    categoryFilter.value = cat;
    searchCatalog();
  };
  categoryButtons.appendChild(btn);

  const opt = document.createElement("option");
  opt.value = cat;
  opt.textContent = cat;
  categoryFilter.appendChild(opt);
});

types.forEach(t => {
  const opt = document.createElement("option");
  opt.value = t;
  opt.textContent = t;
  typeFilter.appendChild(opt);
});

function searchCatalog() {
  const q = document.getElementById("searchInput").value.toLowerCase().trim();
  const cat = document.getElementById("categoryFilter").value;
  const type = document.getElementById("typeFilter").value;
  const access = document.getElementById("accessFilter").value.toLowerCase();
  const sort = document.getElementById("sortFilter").value;

  let list = catalog.filter(item => {
    const text = [
      item.title,
      item.subtitle,
      item.authors.join(" "),
      item.genres.join(" "),
      item.category,
      item.type,
      item.language,
      item.access_type,
      item.trust_level,
      item.description,
      item.tags.join(" "),
      item.sources.join(" "),
      item.related_topics.join(" ")
    ].join(" ").toLowerCase();

    return (!q || text.includes(q)) &&
           (!cat || item.category === cat) &&
           (!type || item.type === type) &&
           (!access || item.access_type.toLowerCase().includes(access) || item.sources.join(" ").toLowerCase().includes(access));
  });

  if (sort === "rating") list.sort((a,b)=>b.rating-a.rating);
  if (sort === "trending") list.sort((a,b)=>b.trending_score-a.trending_score);
  if (sort === "views") list.sort((a,b)=>b.views-a.views);
  if (sort === "title") list.sort((a,b)=>a.title.localeCompare(b.title));

  renderCatalog(list);
  generateAnswer(q || cat || type || "all knowledge", list);
  if (list[0]) showGraph(list[0]);
}

function renderCatalog(list) {
  cards.innerHTML = "";
  if (!list.length) {
    cards.innerHTML = `<div class="card"><h3>No exact result found</h3><p>Try broader tags, clear filters, or request it below.</p></div>`;
    return;
  }

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <span class="badge">${item.category}</span>
      <span class="badge">${item.type}</span>
      <span class="access">${item.access_type}</span>
      <h3>${item.title}</h3>
      <p><b>Author/source:</b> ${item.authors.join(", ")}</p>
      <p>${item.description}</p>
      <p><b>Trust:</b> ${item.trust_level}</p>
      <p><b>Sources:</b> ${item.sources.join(", ")}</p>
      <p>${item.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</p>
      <button onclick="selectItem('${esc(item.id)}')">AI + Graph</button>
    `;
    cards.appendChild(card);
  });
}

function esc(text){return text.replaceAll("'","\\'");}

function selectItem(id) {
  const item = catalog.find(i => i.id === id);
  if (!item) return;
  generateAnswer(item.title, [item]);
  showGraph(item);
  location.hash = "ai";
}

function generateAnswer(query, list) {
  if (!list.length) {
    aiAnswer.innerHTML = `<h3>No match for "${query}"</h3><p>The full product should query external APIs such as Wikipedia, Google Books, Open Library and Project Gutenberg, then show legal access options.</p>`;
    return;
  }

  const top = list[0];
  const similar = list.slice(0,5).map(i=>`<li><b>${i.title}</b> — ${i.category}, ${i.type}</li>`).join("");

  aiAnswer.innerHTML = `
    <h3>Best match for "${query}"</h3>
    <p><b>${top.title}</b> by/source <b>${top.authors.join(", ")}</b> is the strongest result.</p>
    <p>${top.description}</p>
    <p><b>Legal access:</b> ${top.access_type}. Try ${top.sources.join(", ")}.</p>
    <p><b>Why trust it:</b> ${top.trust_level}.</p>
    <p><b>Related topics:</b> ${top.related_topics.join(", ")}.</p>
    <h4>Explore next</h4>
    <ul>${similar}</ul>
  `;
}

function showGraph(item) {
  graphArea.innerHTML = "";
  const main = document.createElement("div");
  main.className = "node main";
  main.textContent = item.title;
  graphArea.appendChild(main);

  item.related_topics.forEach(topic => {
    const node = document.createElement("div");
    node.className = "node";
    node.textContent = topic;
    node.onclick = () => {
      document.getElementById("searchInput").value = topic;
      searchCatalog();
    };
    graphArea.appendChild(node);
  });
}

function renderRecommendations() {
  renderMini("trendingBox", [...catalog].sort((a,b)=>b.trending_score-a.trending_score).slice(0,5));
  renderMini("ratedBox", [...catalog].sort((a,b)=>b.rating-a.rating).slice(0,5));
  renderMini("freeBox", catalog.filter(i => 
    i.access_type.toLowerCase().includes("public domain") ||
    i.access_type.toLowerCase().includes("free")
  ).slice(0,5));
}

function renderMini(id, list) {
  const box = document.getElementById(id);
  box.innerHTML = list.map(item => `
    <div class="mini-item" onclick="selectItem('${esc(item.id)}')">
      <b>${item.title}</b>
      <span>${item.category} • Rating ${item.rating} • Views ${item.views}</span>
    </div>
  `).join("");
}

function saveRequest() {
  const title = document.getElementById("reqTitle").value.trim();
  const note = document.getElementById("reqNote").value.trim();
  if (!title) {
    alert("Please enter a title or topic.");
    return;
  }
  const requests = JSON.parse(localStorage.getItem("knowatlasV3Requests") || "[]");
  requests.push({title, note, date:new Date().toLocaleDateString()});
  localStorage.setItem("knowatlasV3Requests", JSON.stringify(requests));
  document.getElementById("reqTitle").value = "";
  document.getElementById("reqNote").value = "";
  renderRequests();
}

function renderRequests() {
  const requests = JSON.parse(localStorage.getItem("knowatlasV3Requests") || "[]");
  requestList.innerHTML = requests.map(r=>`<li>${r.title}${r.note ? " — " + r.note : ""} (${r.date})</li>`).join("");
}

renderCatalog(catalog);
generateAnswer("all knowledge", catalog);
showGraph(catalog[0]);
renderRecommendations();
renderRequests();
