from typing import Any
import time
import requests

from app.config import IBGE_LOCALIDADES_BASE_URL

BASE_URL = IBGE_LOCALIDADES_BASE_URL


def buscar_dados_ibge(path: str, params: dict[str, Any] | None = None, max_retries: int = 2) -> Any:
    url = f"{BASE_URL}/{path.lstrip('/')}"
    espera = 0.5

    for tentativa in range(max_retries + 1):
        try:
            response = requests.get(url, params=params or {}, timeout=(5, 20))

            if response.status_code in {429, 500, 502, 503, 504} and tentativa < max_retries:
                time.sleep(espera)
                espera *= 2
                continue

            response.raise_for_status()
            return response.json()
        except (requests.RequestException, ValueError):
            if tentativa == max_retries:
                return [] if path.endswith("/municipios") else {}

            time.sleep(espera)
            espera *= 2

    return [] if path.endswith("/municipios") else {}


def listar_municipios(uf: str = "CE") -> list[dict[str, Any]]:
    dados = buscar_dados_ibge(f"estados/{uf}/municipios", {"orderBy": "nome"})
    return dados if isinstance(dados, list) else []


def localizar_municipio(codigo_ibge: str | int, uf: str = "CE") -> dict[str, Any] | None:
    codigo = str(codigo_ibge)

    for municipio in listar_municipios(uf):
        if str(municipio.get("id")) == codigo:
            return municipio

    return None
