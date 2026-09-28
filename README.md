# Projetos — Portal independente

Portal de projetos de **mskpoeira**, publicado em https://projetos.mskpoeira.com.br.

## Isolamento obrigatório

Este repositório contém somente o **Portal de Projetos**.

- Repositório: `mskpoeira/projetos`
- Produção no VPS: `/app/projetos`
- Imagem Docker: `projetos-app:latest`
- Contêiner: `projetos-app`
- Alias de rede: `projetos`
- Domínio: `projetos.mskpoeira.com.br`
- Deploy: branch `main` → sincronizador próprio no VPS (`projetos-sync.timer`)
- AppDeploy: **não utilizado**
- RDC: **não utilizado**

Cada projeto listado permanece em seu próprio repositório, ambiente, contêiner/serviço, banco de dados e workflow. O portal apenas referencia os projetos e não incorpora código de outros sistemas.

## Atualização do catálogo

Edite `public/projects.json`. Pushes na branch `main` são validados pelo GitHub Actions e o VPS sincroniza automaticamente o commit mais recente pelo `projetos-sync.timer`.
