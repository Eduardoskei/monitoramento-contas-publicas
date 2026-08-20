from __future__ import annotations

from typing import Any
import time

import requests

from app.config import BRASILAPI_BASE_URL, OPENCNPJ_BASE_URL

BRASILAPI_URL = BRASILAPI_BASE_URL
OPENCNPJ_URL = OPENCNPJ_BASE_URL


def somente_digitos(valor: Any) -> str:
    return "".join(caractere for caractere in str(valor or "") if caractere.isdigit())


def _get_json(url: str, max_retries: int = 2) -> dict[str, Any]:
    espera = 0.5

    for tentativa in range(max_retries + 1):
        try:
            response = requests.get(url, timeout=(5, 25))

            if response.status_code == 404:
                return {}

            if response.status_code in {429, 500, 502, 503, 504} and tentativa < max_retries:
                time.sleep(espera)
                espera *= 2
                continue

            response.raise_for_status()
            dados = response.json()
            return dados if isinstance(dados, dict) else {}
        except (requests.RequestException, ValueError):
            if tentativa == max_retries:
                return {}

            time.sleep(espera)
            espera *= 2

    return {}


def buscar_brasilapi(cnpj: str) -> dict[str, Any]:
    cnpj_limpo = somente_digitos(cnpj)
    if len(cnpj_limpo) != 14:
        return {}

    return _get_json(f"{BRASILAPI_URL}/cnpj/v1/{cnpj_limpo}")


def buscar_opencnpj(cnpj: str) -> dict[str, Any]:
    cnpj_limpo = somente_digitos(cnpj)
    if len(cnpj_limpo) != 14:
        return {}

    dados = _get_json(f"{OPENCNPJ_URL}/cnpj/{cnpj_limpo}")
    if isinstance(dados.get("data"), dict):
        return dados["data"]

    return dados


def coletar_fornecedor(cnpj: str) -> dict[str, Any]:
    cnpj_limpo = somente_digitos(cnpj)
    return {
        "cnpj": cnpj_limpo,
        "brasilapi": buscar_brasilapi(cnpj_limpo),
        "opencnpj": buscar_opencnpj(cnpj_limpo),
    }
