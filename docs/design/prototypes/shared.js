const posts = [
  { id: 1, title: "Designing an idempotent payment API", slug: "idempotent-payment-api", status: "published", category: "System design", updated: "2 h ago", author: "Gokul" },
  { id: 2, title: "Kafka consumer lag: what the numbers mean", slug: "kafka-consumer-lag", status: "scheduled", category: "Backend", updated: "Today 09:40", author: "Gokul", when: "Fri 10:00" },
  { id: 3, title: "Spring Boot + Hibernate N+1, found and fixed", slug: "hibernate-n-plus-one", status: "review", category: "Backend", updated: "Yesterday", author: "Asha" },
  { id: 4, title: "A Razorpay-style checkout, end to end", slug: "checkout-end-to-end", status: "drafting", category: "Projects", updated: "Yesterday", author: "Gokul" },
  { id: 5, title: "Redis as a rate limiter (and when not to)", slug: "redis-rate-limiter", status: "idea", category: "Backend", updated: "3 d ago", author: "Gokul" },
  { id: 6, title: "Reading a flame graph in 10 minutes", slug: "flame-graph-basics", status: "published", category: "Performance", updated: "5 d ago", author: "Asha" },
  { id: 7, title: "Notes from building GSpace offline-first", slug: "gspace-offline-first", status: "drafting", category: "Projects", updated: "6 d ago", author: "Gokul" },
  { id: 8, title: "HLD: a booking system that survives peak sales", slug: "booking-system-hld", status: "idea", category: "System design", updated: "1 w ago", author: "Gokul" },
  { id: 9, title: "Postgres row level security, explained with one table", slug: "postgres-rls-one-table", status: "published", category: "Backend", updated: "2 w ago", author: "Gokul" },
];
const statusLabel = { idea: "Idea", drafting: "Drafting", review: "In review", scheduled: "Scheduled", published: "Published" };
const filters = ["all", "idea", "drafting", "review", "scheduled", "published"];

const state = { filter: "all", q: "", selected: new Set(), active: null };

function visible() {
  return posts.filter(p =>
    (state.filter === "all" || p.status === state.filter) &&
    (!state.q || p.title.toLowerCase().includes(state.q.toLowerCase())));
}

function statusCell(p) {
  const extra = p.status === "scheduled" ? ` <span class="muted">${p.when}</span>` : "";
  return `<span class="status" data-s="${p.status}">${statusLabel[p.status]}</span>${extra}`;
}

function render() {
  const rows = visible();
  const chips = document.querySelector("[data-chips]");
  if (chips) chips.innerHTML = filters.map(f => {
    const n = f === "all" ? posts.length : posts.filter(p => p.status === f).length;
    return `<button class="chip" aria-pressed="${state.filter === f}" data-f="${f}">${f === "all" ? "All" : statusLabel[f]} <span class="n">${n}</span></button>`;
  }).join("");
  const tbody = document.querySelector("[data-rows]");
  if (tbody) tbody.innerHTML = rows.map(p => `
    <tr aria-selected="${state.selected.has(p.id) || state.active === p.id}" data-id="${p.id}">
      <td><input type="checkbox" class="check" aria-label="Select ${p.title}" ${state.selected.has(p.id) ? "checked" : ""} data-sel="${p.id}"></td>
      <td><div class="title">${p.title}</div><div class="slug">/blog/${p.slug}</div></td>
      <td>${statusCell(p)}</td>
      <td class="hide-sm">${p.category}</td>
      <td class="hide-sm muted">${p.author}</td>
      <td class="muted">${p.updated}</td>
    </tr>`).join("") || `<tr><td colspan="6" class="muted" style="height:120px;text-align:center">No posts match. Clear the search or pick another status.</td></tr>`;
  const cards = document.querySelector("[data-cards]");
  if (cards) cards.innerHTML = rows.map(p => `
    <a class="card-row" href="#" data-id="${p.id}">
      <span class="title">${p.title}</span><span class="muted">${p.updated}</span>
      <span class="meta">${statusCell(p)} &nbsp; ${p.category}</span>
    </a>`).join("") || `<p class="muted" style="padding:24px 16px">No posts match.</p>`;
  const bar = document.querySelector("[data-bulk]");
  if (bar) {
    bar.classList.toggle("on", state.selected.size > 0);
    bar.querySelector("[data-count]").textContent = `${state.selected.size} selected`;
  }
  const all = document.querySelector("[data-all]");
  if (all) {
    all.checked = rows.length > 0 && rows.every(p => state.selected.has(p.id));
    all.indeterminate = !all.checked && rows.some(p => state.selected.has(p.id));
  }
  document.dispatchEvent(new CustomEvent("rendered"));
}

document.addEventListener("click", e => {
  const f = e.target.closest("[data-f]");
  if (f) { state.filter = f.dataset.f; render(); return; }
  if (e.target.matches("[data-sel]")) {
    const id = +e.target.dataset.sel;
    state.selected.has(id) ? state.selected.delete(id) : state.selected.add(id);
    render(); return;
  }
  if (e.target.matches("[data-all]")) {
    const rows = visible();
    const allOn = rows.every(p => state.selected.has(p.id));
    rows.forEach(p => allOn ? state.selected.delete(p.id) : state.selected.add(p.id));
    render(); return;
  }
  if (e.target.closest("[data-clear]")) { state.selected.clear(); render(); return; }
  if (e.target.closest("[data-theme]")) { document.documentElement.classList.toggle("dark"); return; }
  if (e.target.closest("[data-open-palette]")) { openPalette(); return; }
  const row = e.target.closest("tr[data-id], .card-row");
  if (row) { e.preventDefault(); state.active = +row.dataset.id; render(); }
});
document.addEventListener("input", e => {
  if (e.target.matches("[data-search]")) { state.q = e.target.value; render(); }
});

const commands = [
  ["Go to", "portfolio", "Portfolio · Posts"], ["Go to", "portfolio", "Portfolio · Projects"],
  ["Go to", "portfolio", "Portfolio · Messages"], ["Go to", "hub", "Hub · Config"],
  ["Go to", "platform", "People and roles"], ["Go to", "platform", "Audit log"],
  ["Actions", "portfolio", "New post"], ["Actions", "platform", "Switch theme"],
  ...posts.slice(0, 4).map(p => ["Posts", "portfolio", p.title]),
];
function openPalette() {
  const bd = document.querySelector(".palette-backdrop");
  if (!bd) return;
  bd.classList.add("on");
  const input = bd.querySelector("input");
  input.value = "";
  drawPalette("");
  input.focus();
}
function drawPalette(q) {
  const list = document.querySelector(".palette ul");
  let group = "";
  list.innerHTML = commands.filter(c => c[2].toLowerCase().includes(q.toLowerCase())).map((c, i) => {
    const head = c[0] !== group ? `<div class="group">${(group = c[0])}</div>` : "";
    return `${head}<li aria-selected="${i === 0}"><span class="mark sm" data-app="${c[1]}">${c[1][0].toUpperCase()}</span>${c[2]}</li>`;
  }).join("") || `<div class="group">Nothing found for "${q}"</div>`;
}
document.addEventListener("keydown", e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); }
  if (e.key === "Escape") document.querySelector(".palette-backdrop")?.classList.remove("on");
});
document.addEventListener("input", e => { if (e.target.matches(".palette input")) drawPalette(e.target.value); });
document.addEventListener("click", e => { if (e.target.matches(".palette-backdrop")) e.target.classList.remove("on"); });

if (matchMedia("(prefers-color-scheme: dark)").matches) document.documentElement.classList.add("dark");
document.addEventListener("DOMContentLoaded", render);

const paletteHTML = `<div class="palette-backdrop" role="dialog" aria-label="Command palette"><div class="palette"><input placeholder="Search apps, sections, posts, actions" aria-label="Search"><ul></ul></div></div>`;
document.addEventListener("DOMContentLoaded", () => document.body.insertAdjacentHTML("beforeend", paletteHTML));
