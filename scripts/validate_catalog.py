#!/usr/bin/env python3
import json
import sys
from pathlib import Path
from urllib.parse import urlparse

CATALOG = Path("public/projects.json")
ALLOWED_STATUS = {"produção", "homologação", "desenvolvimento"}
REQUIRED = {"repositoryName", "name", "short", "description", "status", "environment", "repository", "site"}

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

names=set()
shorts=set()
repo_names=set()
repositories=set()
sites=set()

for index, project in enumerate(projects, start=1):
    if not isinstance(project, dict):
        fail(f"projeto #{index} não é um objeto")

    missing=sorted(REQUIRED-project.keys())
    if missing:
        fail(f"projeto #{index} sem campos obrigatórios: {', '.join(missing)}")

    for field in REQUIRED-{"site"}:
        if not isinstance(project[field],str) or not project[field].strip():
            fail(f"projeto #{index}: '{field}' deve ser texto não vazio")

    if project["status"] not in ALLOWED_STATUS:
        fail(f"{project['name']}: status inválido '{project['status']}'")

    repo_url=project["repository"].rstrip("/")
    parsed_repo=urlparse(repo_url)
    if not valid_https(repo_url) or parsed_repo.netloc.lower()!="github.com":
        fail(f"{project['name']}: URL de repositório inválida")
    if parsed_repo.path.casefold()!=f"/mskpoeira/{project['repositoryName']}".casefold():
        fail(f"{project['name']}: repositoryName não corresponde ao repositório")

    site=project["site"]
    if site is not None and (not isinstance(site,str) or not valid_https(site)):
        fail(f"{project['name']}: site deve ser HTTPS ou null")

    checks=[
        ("nome",project["name"].strip().casefold(),names),
        ("sigla",project["short"].strip().casefold(),shorts),
        ("repositoryName",project["repositoryName"].strip().casefold(),repo_names),
        ("repositório",repo_url.casefold(),repositories),
    ]
    for label,key,bucket in checks:
        if key in bucket:
            fail(f"{label} duplicado: {key}")
        bucket.add(key)

    if site:
        site_key=site.rstrip("/").casefold()
        if site_key in sites:
            fail(f"site duplicado: {site}")
        sites.add(site_key)

print(f"Catálogo válido: {len(projects)} projetos.")
