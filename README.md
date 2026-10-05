# Projetos — catálogo e painel unificado

Este repositório mantém o catálogo central dos projetos e uma visão consolidada de saúde, automação, dashboards e relatórios.

## Isolamento

O Portal pode conter **links e metadados** sobre os demais projetos, mas não compartilha código, banco, autenticação, volumes, redes Docker, proxy ou runtime com eles.

O painel não executa ações administrativas nos outros sistemas e não acessa dados operacionais ou pessoais. Os indicadores de auditoria são metadados locais armazenados em `public/projects.json`.

## Runtime

- diretório: `/app/projetos`
- rede Docker: `projetos`
- contêiner: `projetos-app`
- bind HTTP padrão: `127.0.0.1:48080`

A publicação é validada pelo GitHub Actions e sincronizada automaticamente no VPS.
