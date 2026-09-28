# Identidade do projeto

**Projeto:** Portal de Projetos  
**Repositório:** mskpoeira/projetos  
**Domínio:** projetos.mskpoeira.com.br

## Regra de arquitetura

O Portal de Projetos é independente. Nenhum código de SGR, SIGDEC, Presença, Show de Prêmios, KaraokeStudio ou outro sistema deve ser incorporado neste repositório.

O portal pode exibir links e metadados públicos dos demais projetos, mas cada sistema deve manter:
- repositório próprio;
- deploy próprio;
- ambiente próprio;
- contêiner/serviço próprio;
- armazenamento e banco próprios quando aplicável.

O proxy reverso compartilhado pode apenas encaminhar o domínio para o serviço `projetos`.
