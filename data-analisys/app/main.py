from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app import database


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    database.init_db()
    try:
        yield
    finally:
        database.close_pool()


app = FastAPI(lifespan=lifespan)


@app.get("/health")
async def health():
    return {"status": "healthy"}
