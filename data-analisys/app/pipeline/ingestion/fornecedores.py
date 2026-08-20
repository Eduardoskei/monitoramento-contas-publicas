from __future__ import annotations

from typing import Any, Iterable
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


def coletar_fornecedores_em_lote(
    cnpjs: Iterable[str],
    *,
    throttle_segundos: float = 0.3,
) -> list[dict[str, Any]]:
    """
    Chama `coletar_fornecedor` uma vez para cada CNPJ distinto de `cnpjs`,
    com uma pausa entre chamadas (mesmo padrao de espacamento entre paginas
    ja usado em pncp.py/tce.py) para nao estourar limite de requisicoes das
    APIs publicas. Duplicatas na lista de entrada sao ignoradas — cada CNPJ
    e consultado uma unica vez, mesmo que apareca em varios contratos.

    Use `app.pipeline.merge.extrair_cnpjs_distintos` para montar `cnpjs` a
    partir das tabelas ja limpas de contratos/contratados.
    """
    vistos: set[str] = set()
    resultados: list[dict[str, Any]] = []

    for cnpj in cnpjs:
        cnpj_limpo = somente_digitos(cnpj)
        if not cnpj_limpo or cnpj_limpo in vistos:
            continue
        vistos.add(cnpj_limpo)

        resultados.append(coletar_fornecedor(cnpj_limpo))
        if throttle_segundos:
            time.sleep(throttle_segundos)

    return resultados
