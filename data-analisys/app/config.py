import os

from dotenv import load_dotenv

load_dotenv()


class ConfigError(RuntimeError):
    pass


def _required_env(key: str, *, strip_slash: bool = False) -> str:
    value = os.getenv(key)
    if value is None or not value.strip():
        raise ConfigError(f"Variavel de ambiente obrigatoria ausente: {key}")

    value = value.strip()
    return value.rstrip("/") if strip_slash else value


def _required_int_env(key: str) -> int:
    value = _required_env(key)
    try:
        return int(value)
    except ValueError as error:
        raise ConfigError(f"Variavel de ambiente {key} deve ser um inteiro.") from error


DATABASE_URL = os.getenv("DATABASE_URL")
TCE_CE_BASE_URL = _required_env("TCE_CE_BASE_URL", strip_slash=True)
IBGE_LOCALIDADES_BASE_URL = _required_env("IBGE_LOCALIDADES_BASE_URL", strip_slash=True)
PNCP_CONSULTA_BASE_URL = _required_env("PNCP_CONSULTA_BASE_URL", strip_slash=True)
PNCP_GESTAO_BASE_URL = _required_env("PNCP_GESTAO_BASE_URL", strip_slash=True)
BRASILAPI_BASE_URL = _required_env("BRASILAPI_BASE_URL", strip_slash=True)
OPENCNPJ_BASE_URL = _required_env("OPENCNPJ_BASE_URL", strip_slash=True)

UF_PADRAO = _required_env("UF_PADRAO")
CODIGO_IBGE_PADRAO = _required_env("CODIGO_IBGE_PADRAO")
CODIGO_MUNICIPIO_TCE_PADRAO = _required_env("CODIGO_MUNICIPIO_TCE_PADRAO")
MODALIDADE_ID_PADRAO = _required_int_env("MODALIDADE_ID_PADRAO")
