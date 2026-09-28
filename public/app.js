const grid=document.querySelector("#projects");
const search=document.querySelector("#search");
const filter=document.querySelector("#filter");
const count=document.querySelector("#count");
const empty=document.querySelector("#empty");
let projects=[];

const esc=(v="")=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));

function render(){
  const q=search.value.trim().toLowerCase();
  const f=filter.value;
  const rows=projects.filter(p=>{
    const hay=[p.name,p.description,p.status,p.repository,p.domain].join(" ").toLowerCase();
    return (!q||hay.includes(q))&&(f==="all"||p.status===f);
  });
  count.textContent=projects.length;
  empty.hidden=rows.length!==0;
  grid.innerHTML=rows.map(p=>`
    <article class="card">
      <div class="top">
        <div class="icon">${esc(p.short||p.name.slice(0,2).toUpperCase())}</div>
        <span class="badge">${esc(p.status)}</span>
      </div>
      <h2>${esc(p.name)}</h2>
      <p>${esc(p.description)}</p>
      <div class="meta">${esc(p.environment||"Ambiente independente")}</div>
      <div class="actions">
        ${p.site?`<a class="primary" href="${esc(p.site)}" target="_blank" rel="noopener">Abrir site</a>`:""}
        ${p.repository?`<a href="${esc(p.repository)}" target="_blank" rel="noopener">GitHub</a>`:""}
      </div>
    </article>`).join("");
}
fetch("/projects.json",{cache:"no-store"})
  .then(r=>{if(!r.ok)throw new Error("Falha ao carregar catálogo");return r.json()})
  .then(data=>{projects=data.projects||[];render()})
  .catch(()=>{grid.innerHTML='<p class="empty">Não foi possível carregar o catálogo.</p>'});
search.addEventListener("input",render);
filter.addEventListener("change",render);
