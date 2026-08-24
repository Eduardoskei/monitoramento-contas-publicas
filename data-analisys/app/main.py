from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app import database
from app.pipeline import analisys
from app.route import (
    health,
    pncp_contratacoes,
    router,
    tce_contratos,
    tce_kpi_me_por_mes,
)
from app.utils import banco_indisponivel as _banco_opcional_indisponivel

__all__ = [
    "analisys",
    "app",
    "health",
    "lifespan",
    "pncp_contratacoes",
    "tce_contratos",
    "tce_kpi_me_por_mes",
]


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    try:
        database.init_db()
    except RuntimeError as error:
        if not _banco_opcional_indisponivel(error):
            raise
        print(f"Cache Postgres indisponivel; API seguira sem cache local: {error}")
    try:
        yield
    finally:
        database.close_pool()


app = FastAPI(
    title="Monitoramento de Contas Publicas",
    description="API para consulta e analise de contratacoes publicas a partir do PNCP e TCE-CE.",
    version="1.0.0",
    lifespan=lifespan,
)

app.include_router(router)
