const grid=document.querySelector("#projects");
const search=document.querySelector("#search");
const filter=document.querySelector("#filter");
const count=document.querySelector("#count");
const countProduction=document.querySelector("#count-production");
const countHomologation=document.querySelector("#count-homologation");
const countDevelopment=document.querySelector("#count-development");
const empty=document.querySelector("#empty");
let projects=[];

const esc=(v="")=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const statusOrder={"produção":0,"homologação":1,"desenvolvimento":2};
const statusClass=(value="")=>String(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g,"")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g,"-")
  .replace(/^-|-$/g,"");

function updateSummary(){
  count.textContent=projects.length;
  countProduction.textContent=projects.filter(p=>p.status==="produção").length;
  countHomologation.textContent=projects.filter(p=>p.status==="homologação").length;
  countDevelopment.textContent=projects.filter(p=>p.status==="desenvolvimento").length;
}

function render(){
  const q=search.value.trim().toLowerCase();
  const f=filter.value;
  const rows=[...projects]
    .sort((a,b)=>(statusOrder[a.status]??99)-(statusOrder[b.status]??99)||a.name.localeCompare(b.name,"pt-BR"))
    .filter(p=>{
      const hay=[p.name,p.description,p.status,p.environment,p.repository,p.site].join(" ").toLowerCase();
      return (!q||hay.includes(q))&&(f==="all"||p.status===f);
    });

  updateSummary();
  empty.hidden=rows.length!==0;

  grid.innerHTML=rows.map(p=>{
    const badgeClass="status-"+statusClass(p.status);
    return `
    <article class="card">
      <div class="top">
        <div class="icon" aria-hidden="true">${esc(p.short||p.name.slice(0,2).toUpperCase())}</div>
        <span class="badge ${badgeClass}">${esc(p.status)}</span>
      </div>
      <h2>${esc(p.name)}</h2>
      <p>${esc(p.description)}</p>
      <div class="meta">${esc(p.environment||"Ambiente independente")}</div>
      <div class="actions">
        ${p.site?`<a class="primary" href="${esc(p.site)}" target="_blank" rel="noopener noreferrer">Abrir site</a>`:""}
        ${p.repository?`<a href="${esc(p.repository)}" target="_blank" rel="noopener noreferrer">GitHub</a>`:""}
      </div>
    </article>`;
  }).join("");
}

fetch("/projects.json",{cache:"no-store"})
  .then(r=>{if(!r.ok)throw new Error("Falha ao carregar catálogo");return r.json()})
  .then(data=>{projects=Array.isArray(data.projects)?data.projects:[];render()})
  .catch(()=>{grid.innerHTML='<p class="empty">Não foi possível carregar o catálogo.</p>'});

search.addEventListener("input",render);
filter.addEventListener("change",render);
