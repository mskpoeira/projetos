# Projetos — catálogo independente

Este repositório contém somente o catálogo informativo de projetos.

## Isolamento

O Portal não possui hyperlinks para os demais projetos e não carrega código, APIs, bancos, autenticação, arquivos, status remoto ou conteúdo de qualquer outro projeto.

Os itens são textos locais armazenados em `public/projects.json`.

## Runtime

- diretório: `/app/projetos`
- rede Docker: `projetos`
- contêiner: `projetos-app`
- bind HTTP padrão: `127.0.0.1:48080`

Nenhum proxy, rede, volume ou contêiner de outro projeto é utilizado.
