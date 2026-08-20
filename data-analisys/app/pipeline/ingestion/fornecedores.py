from __future__ import annotations

from typing import Any, Iterable
import time
import unicodedata

import requests

from app.config import BRASILAPI_BASE_URL, OPENCNPJ_BASE_URL
from app import database

BRASILAPI_URL = BRASILAPI_BASE_URL
OPENCNPJ_URL = OPENCNPJ_BASE_URL


def somente_digitos(valor: Any) -> str:
    return "".join(caractere for caractere in str(valor or "") if caractere.isdigit())


def _normalizar_texto(valor: Any) -> str:
    texto = str(valor or "").strip().upper()
    texto = "".join(
        caractere
        for caractere in unicodedata.normalize("NFKD", texto)
        if not unicodedata.combining(caractere)
    )
    return " ".join(texto.replace("-", " ").split())


def normalizar_porte_me(valor: Any) -> str | None:
    texto = _normalizar_texto(valor)
    if texto in {"ME", "MICRO EMPRESA", "MICROEMPRESA"}:
        return "ME"

    return None


def _get_nested(registro: dict[str, Any], caminho: tuple[str, ...]) -> Any:
    atual: Any = registro
    for chave in caminho:
        if not isinstance(atual, dict):
            return None
        atual = atual.get(chave)
    return atual


def _primeiro_valor(registro: dict[str, Any], caminhos: tuple[tuple[str, ...], ...]) -> Any:
    for caminho in caminhos:
        valor = _get_nested(registro, caminho)
        if valor not in (None, ""):
            return valor
    return None


def _ignorar_banco_indisponivel(error: RuntimeError) -> bool:
    mensagem = str(error)
    return "DATABASE_URL" in mensagem or "psycopg2-binary" in mensagem


def _buscar_fornecedor_me_no_banco(cnpj: str) -> dict[str, Any] | None:
    try:
        return database.localizar_fornecedor_me(cnpj)
    except RuntimeError as error:
        if _ignorar_banco_indisponivel(error):
            return None
        raise


def _salvar_fornecedor_me_no_banco(fornecedor: dict[str, Any]) -> None:
    try:
        database.salvar_fornecedor_me(
            fornecedor["cnpj"],
            fornecedor.get("razao_social"),
            fornecedor["porte"],
        )
    except RuntimeError as error:
        if _ignorar_banco_indisponivel(error):
            return
        print(f"Falha ao salvar fornecedor ME no Postgres: {error}")
    except Exception as error:
        print(f"Falha ao salvar fornecedor ME no Postgres: {error}")


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


def extrair_fornecedor_me(dados: dict[str, Any]) -> dict[str, Any] | None:
    cnpj = somente_digitos(dados.get("cnpj"))
    if len(cnpj) != 14:
        return None

    brasilapi = dados.get("brasilapi") if isinstance(dados.get("brasilapi"), dict) else {}
    opencnpj = dados.get("opencnpj") if isinstance(dados.get("opencnpj"), dict) else {}

    porte_brasilapi = normalizar_porte_me(
        _primeiro_valor(
            brasilapi,
            (
                ("porte",),
                ("descricao_porte",),
                ("porte_empresa",),
                ("empresa", "porte"),
            ),
        )
    )
    porte_opencnpj = normalizar_porte_me(
        _primeiro_valor(
            opencnpj,
            (
                ("porte",),
                ("descricao_porte",),
                ("porte_empresa",),
                ("empresa", "porte"),
                ("estabelecimento", "porte"),
            ),
        )
    )

    if "ME" not in {porte_brasilapi, porte_opencnpj}:
        return None

    razao_social = _primeiro_valor(
        brasilapi,
        (
            ("razao_social",),
            ("razaoSocial",),
            ("nome",),
            ("nome_empresarial",),
        ),
    ) or _primeiro_valor(
        opencnpj,
        (
            ("razao_social",),
            ("razaoSocial",),
            ("nome",),
            ("nome_empresarial",),
            ("empresa", "razao_social"),
        ),
    )

    return {
        "cnpj": cnpj,
        "razao_social": str(razao_social).strip() if razao_social not in (None, "") else None,
        "porte": "ME",
    }


def validar_fornecedor_me(cnpj: str) -> dict[str, Any] | None:
    cnpj_limpo = somente_digitos(cnpj)
    if len(cnpj_limpo) != 14:
        return None

    fornecedor_salvo = _buscar_fornecedor_me_no_banco(cnpj_limpo)
    if fornecedor_salvo is not None:
        return fornecedor_salvo

    fornecedor_me = extrair_fornecedor_me(coletar_fornecedor(cnpj_limpo))
    if fornecedor_me is not None:
        _salvar_fornecedor_me_no_banco(fornecedor_me)

    return fornecedor_me
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
