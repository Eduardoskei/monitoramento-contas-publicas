from __future__ import annotations

import os
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

os.environ.setdefault("TCE_CE_BASE_URL", "https://api-dados-abertos.tce.ce.gov.br/sim")
os.environ.setdefault("IBGE_LOCALIDADES_BASE_URL", "https://servicodados.ibge.gov.br/api/v1/localidades")
os.environ.setdefault("PNCP_CONSULTA_BASE_URL", "https://pncp.gov.br/api/consulta")
os.environ.setdefault("PNCP_GESTAO_BASE_URL", "https://pncp.gov.br/api/pncp")
os.environ.setdefault("BRASILAPI_BASE_URL", "https://brasilapi.com.br/api")
os.environ.setdefault("OPENCNPJ_BASE_URL", "https://kitana.opencnpj.com")
os.environ.setdefault("UF_PADRAO", "CE")
os.environ.setdefault("CODIGO_IBGE_PADRAO", "2304400")
os.environ.setdefault("CODIGO_MUNICIPIO_TCE_PADRAO", "010")
os.environ.setdefault("MODALIDADE_ID_PADRAO", "6")

from app.pipeline.ingestion import fornecedores


class FornecedoresIngestionTest(unittest.TestCase):
    def test_somente_digitos_limpa_cnpj_para_chamadas(self) -> None:
        self.assertEqual(fornecedores.somente_digitos("12.345.678/0001-99"), "12345678000199")

    @patch("app.pipeline.ingestion.fornecedores.buscar_opencnpj")
    @patch("app.pipeline.ingestion.fornecedores.buscar_brasilapi")
    def test_coletar_fornecedor_retorna_payloads_brutos(self, buscar_brasilapi, buscar_opencnpj) -> None:
        buscar_brasilapi.return_value = {"porte": "MICRO EMPRESA"}
        buscar_opencnpj.return_value = {"porte": "ME"}

        dados = fornecedores.coletar_fornecedor("12.345.678/0001-99")

        self.assertEqual(dados["cnpj"], "12345678000199")
        self.assertEqual(dados["brasilapi"], {"porte": "MICRO EMPRESA"})
        self.assertEqual(dados["opencnpj"], {"porte": "ME"})


if __name__ == "__main__":
    unittest.main()
