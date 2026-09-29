#!/usr/bin/env python3
import json
import sys
from pathlib import Path

CATALOG = Path("public/projects.json")
ALLOWED_STATUS = {"produção", "homologação", "desenvolvimento"}
REQUIRED = {"name", "short", "description", "status", "environment"}
FORBIDDEN_FIELDS = {"site", "repository", "url", "href", "link"}


def fail(message: str) -> None:
    print(f"ERRO: {message}", file=sys.stderr)
    raise SystemExit(1)


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

for index, project in enumerate(projects, start=1):
    if not isinstance(project, dict):
        fail(f"projeto #{index} não é um objeto")

    missing = sorted(REQUIRED - project.keys())
    if missing:
        fail(f"projeto #{index} sem campos obrigatórios: {', '.join(missing)}")

    forbidden = sorted(FORBIDDEN_FIELDS & project.keys())
    if forbidden:
        fail(f"projeto #{index} contém campos de link proibidos: {', '.join(forbidden)}")

    for field in REQUIRED:
        if not isinstance(project[field], str) or not project[field].strip():
            fail(f"projeto #{index}: '{field}' deve ser texto não vazio")
        if "http://" in project[field].lower() or "https://" in project[field].lower():
            fail(f"projeto #{index}: URLs não são permitidas no catálogo")

    if project["status"] not in ALLOWED_STATUS:
        fail(f"{project['name']}: status inválido '{project['status']}'")

    name_key = project["name"].strip().casefold()
    short_key = project["short"].strip().casefold()

    if name_key in names:
        fail(f"nome duplicado: {project['name']}")
    if short_key in shorts:
        fail(f"sigla duplicada: {project['short']}")

    names.add(name_key)
    shorts.add(short_key)

print(f"Catálogo válido e sem links: {len(projects)} projetos.")
