#!/usr/bin/env python3
import json
import sys
from pathlib import Path
from urllib.parse import urlparse

CATALOG = Path("public/projects.json")
ALLOWED_STATUS = {"produção", "homologação", "desenvolvimento"}
REQUIRED = {"name", "short", "description", "status", "environment", "repository"}


def fail(message: str) -> None:
    print(f"ERRO: {message}", file=sys.stderr)
    raise SystemExit(1)


def valid_https(value: str) -> bool:
    parsed = urlparse(value)
    return parsed.scheme == "https" and bool(parsed.netloc)


if not CATALOG.is_file():
    fail(f"{CATALOG} não encontrado")

try:
    data = json.loads(CATALOG.read_text(encoding="utf-8"))
except (OSError, json.JSONDecodeError) as exc:
    fail(f"catálogo inválido: {exc}")

projects = data.get("projects")
if not isinstance(projects, list) or not projects:
    fail("'projects' deve ser uma lista não vazia")

names = set()
shorts = set()
repositories = set()
sites = set()

for index, project in enumerate(projects, start=1):
    if not isinstance(project, dict):
        fail(f"projeto #{index} não é um objeto")

    missing = sorted(REQUIRED - project.keys())
    if missing:
        fail(f"projeto #{index} sem campos obrigatórios: {', '.join(missing)}")

    for field in REQUIRED:
        if not isinstance(project[field], str) or not project[field].strip():
            fail(f"projeto #{index}: '{field}' deve ser texto não vazio")

    status = project["status"]
    if status not in ALLOWED_STATUS:
        fail(f"{project['name']}: status inválido '{status}'")

    repo_url = project["repository"].rstrip("/")
    if not valid_https(repo_url):
        fail(f"{project['name']}: URL de repositório inválida")
    parsed_repo = urlparse(repo_url)
    if parsed_repo.netloc.lower() != "github.com":
        fail(f"{project['name']}: repositório deve estar no GitHub")
    if not parsed_repo.path.lower().startswith("/mskpoeira/"):
        fail(f"{project['name']}: repositório deve pertencer a mskpoeira")

    site = project.get("site")
    if site is not None:
        if not isinstance(site, str) or not valid_https(site):
            fail(f"{project['name']}: site deve ser HTTPS ou null")

    name_key = project["name"].strip().casefold()
    short_key = project["short"].strip().casefold()
    repo_key = repo_url.casefold()

    if name_key in names:
        fail(f"nome duplicado: {project['name']}")
    if short_key in shorts:
        fail(f"sigla duplicada: {project['short']}")
    if repo_key in repositories:
        fail(f"repositório duplicado: {repo_url}")

    names.add(name_key)
    shorts.add(short_key)
    repositories.add(repo_key)

    if site:
        site_key = site.rstrip("/").casefold()
        if site_key in sites:
            fail(f"site duplicado: {site}")
        sites.add(site_key)

print(f"Catálogo válido: {len(projects)} projetos.")
