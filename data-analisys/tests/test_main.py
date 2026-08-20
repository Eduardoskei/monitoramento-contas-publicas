from __future__ import annotations

import asyncio
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app import main


class MainTest(unittest.TestCase):
    def test_lifespan_inicializa_db_e_fecha_pool(self) -> None:
        async def executar_lifespan() -> None:
            with (
                patch("app.main.database.init_db") as init_db,
                patch("app.main.database.close_pool") as close_pool,
            ):
                async with main.lifespan(main.app):
                    init_db.assert_called_once_with()
                    close_pool.assert_not_called()

                close_pool.assert_called_once_with()

        asyncio.run(executar_lifespan())


if __name__ == "__main__":
    unittest.main()
