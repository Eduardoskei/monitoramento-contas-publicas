from __future__ import annotations

from typing import Any, Iterable
import time
import unicodedata

import requests

from app.config import BRASILAPI_BASE_URL, OPENCNPJ_BASE_URL
from app import database

BRASILAPI_URL = BRASILAPI_BASE_URL
OPENCNPJ_URL = OPENCNPJ_BASE_URL


class FonteCadastralIndisponivelError(RuntimeError):
    """Uma fonte cadastral falhou; nao significa que o CNPJ nao possua dados."""


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


def _normalizar_porte_comparacao(valor: Any) -> str:
    texto = _normalizar_texto(valor)
    if texto in {"ME", "MICRO EMPRESA", "MICROEMPRESA"}:
        return "ME"
    if texto in {"EPP", "EMPRESA DE PEQUENO PORTE"}:
        return "EPP"
    return texto


_CAMINHOS_PORTE = (
    ("porte", "descricao"),
    ("porte",),
    ("descricao_porte",),
    ("porte_empresa",),
    ("empresa", "porte", "descricao"),
    ("empresa", "porte"),
    ("estabelecimento", "porte", "descricao"),
    ("estabelecimento", "porte"),
)


def extrair_porte_cadastral(payload: dict[str, Any]) -> str | None:
    """Extrai o porte informado pela fonte sem inferi-lo de Simples/MEI."""
    valor = _primeiro_valor(payload, _CAMINHOS_PORTE)
    if isinstance(valor, dict) or valor in (None, ""):
        return None
    texto = str(valor).strip()
    return texto or None


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
    ultimo_erro: Exception | None = None

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
        except (requests.RequestException, ValueError) as error:
            ultimo_erro = error
            if tentativa == max_retries:
                raise FonteCadastralIndisponivelError(
                    f"Falha na fonte cadastral apos {max_retries + 1} tentativa(s): {url}"
                ) from ultimo_erro

            time.sleep(espera)
            espera *= 2

    raise FonteCadastralIndisponivelError(f"Falha inesperada na fonte cadastral: {url}")


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
    fontes: dict[str, dict[str, Any]] = {}
    status: dict[str, str] = {}
    for nome, consulta in (("brasilapi", buscar_brasilapi), ("opencnpj", buscar_opencnpj)):
        try:
            payload = consulta(cnpj_limpo)
            fontes[nome] = payload
            status[nome] = "ok" if payload else "nao_encontrado"
        except FonteCadastralIndisponivelError:
            fontes[nome] = {}
            status[nome] = "indisponivel"

    portes = {
        nome: extrair_porte_cadastral(payload)
        for nome, payload in fontes.items()
        if payload
    }
    portes_informados = {nome: valor for nome, valor in portes.items() if valor is not None}
    portes_normalizados = {_normalizar_porte_comparacao(valor) for valor in portes_informados.values()}
    porte_divergente = len(portes_normalizados) > 1
    porte = None if porte_divergente or not portes_informados else next(iter(portes_informados.values()))
    porte_fonte = None if porte is None else next(
        nome
        for nome, valor in portes_informados.items()
        if _normalizar_porte_comparacao(valor) == _normalizar_porte_comparacao(porte)
    )

    return {
        "cnpj": cnpj_limpo,
        **fontes,
        "porte": porte,
        "porte_fonte": porte_fonte,
        "porte_divergente": porte_divergente,
        "brasilapi_status": status["brasilapi"],
        "opencnpj_status": status["opencnpj"],
    }


def extrair_fornecedor_me(dados: dict[str, Any]) -> dict[str, Any] | None:
    cnpj = somente_digitos(dados.get("cnpj"))
    if len(cnpj) != 14:
        return None

    brasilapi = dados.get("brasilapi") if isinstance(dados.get("brasilapi"), dict) else {}
    opencnpj = dados.get("opencnpj") if isinstance(dados.get("opencnpj"), dict) else {}

    porte_brasilapi = normalizar_porte_me(extrair_porte_cadastral(brasilapi))
    porte_opencnpj = normalizar_porte_me(extrair_porte_cadastral(opencnpj))

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
