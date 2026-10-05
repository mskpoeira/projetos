const grid=document.querySelector("#projects");
const search=document.querySelector("#search");
const filter=document.querySelector("#filter");
const count=document.querySelector("#count");
const countProduction=document.querySelector("#count-production");
const countHomologation=document.querySelector("#count-homologation");
const countDevelopment=document.querySelector("#count-development");
const empty=document.querySelector("#empty");
let projects=[];
let auditUpdatedAt="";

const esc=(v="")=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const statusOrder={"produção":0,"homologação":1,"desenvolvimento":2,"legado":3};
const statusClass=(value="")=>String(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

function updateSummary(){
  count.textContent=projects.length;
  countProduction.textContent=projects.filter(p=>p.status==="produção").length;
  countHomologation.textContent=projects.filter(p=>p.status==="homologação").length;
  countDevelopment.textContent=projects.filter(p=>p.status==="desenvolvimento").length;
  const ok=projects.filter(p=>p.audit?.health==="saudável").length;
  const attention=projects.filter(p=>p.audit?.health==="atenção").length;
  const legacy=projects.filter(p=>p.audit?.health==="legado").length;
  document.querySelector("#health-ok").textContent=ok;
  document.querySelector("#health-attention").textContent=attention;
  document.querySelector("#health-legacy").textContent=legacy;
  const base=Math.max(1,projects.length);
  document.querySelector("#health-ok-bar").style.width=(ok/base*100)+"%";
  document.querySelector("#health-attention-bar").style.width=(attention/base*100)+"%";
  document.querySelector("#health-legacy-bar").style.width=(legacy/base*100)+"%";
  document.querySelector("#audit-date").textContent=auditUpdatedAt?("Atualizado em "+auditUpdatedAt.split("-").reverse().join("/")):"";
}

function render(){
  const q=search.value.trim().toLowerCase(),f=filter.value;
  const rows=[...projects].sort((a,b)=>(statusOrder[a.status]??99)-(statusOrder[b.status]??99)||a.name.localeCompare(b.name,"pt-BR"))
    .filter(p=>{const hay=[p.name,p.repositoryName,p.description,p.status,p.environment,p.audit?.health,p.audit?.automation,p.audit?.dashboard,p.audit?.reports,p.audit?.note].join(" ").toLowerCase();return(!q||hay.includes(q))&&(f==="all"||p.status===f)});
  updateSummary(); empty.hidden=rows.length!==0;
  grid.innerHTML=rows.map(p=>{
    const badgeClass="status-"+statusClass(p.status),healthClass="health-"+statusClass(p.audit?.health||"");
    return `<article class="card">
      <div class="top"><div class="icon" aria-hidden="true">${esc(p.short||p.name.slice(0,2).toUpperCase())}</div><div class="badges"><span class="badge ${badgeClass}">${esc(p.status)}</span><span class="health-badge ${healthClass}">${esc(p.audit?.health||"sem auditoria")}</span></div></div>
      <h2>${esc(p.name)}</h2><p>${esc(p.description)}</p>
      <div class="audit-details">
        <div><span>Automação</span><b>${esc(p.audit?.automation||"—")}</b></div>
        <div><span>Dashboard</span><b>${esc(p.audit?.dashboard||"—")}</b></div>
        <div><span>Relatórios</span><b>${esc(p.audit?.reports||"—")}</b></div>
      </div>
      <div class="audit-callout">${esc(p.audit?.note||"")}</div>
      <div class="meta">${esc(p.environment||"Projeto independente")}</div>
      <div class="actions">${p.site?`<a class="primary" href="${esc(p.site)}" target="_blank" rel="noopener noreferrer">Abrir site</a>`:""}${p.repository?`<a href="${esc(p.repository)}" target="_blank" rel="noopener noreferrer">GitHub</a>`:""}</div>
    </article>`;
  }).join("");
}
fetch("/projects.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw new Error("Falha ao carregar catálogo");return r.json()}).then(data=>{projects=Array.isArray(data.projects)?data.projects:[];auditUpdatedAt=data.auditUpdatedAt||"";render()}).catch(()=>{grid.innerHTML='<p class="empty">Não foi possível carregar o catálogo.</p>'});
search.addEventListener("input",render);filter.addEventListener("change",render);