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

    def test_normalizar_porte_me_identifica_microempresa(self) -> None:
        self.assertEqual(fornecedores.normalizar_porte_me("ME"), "ME")
        self.assertEqual(fornecedores.normalizar_porte_me("MICRO EMPRESA"), "ME")
        self.assertEqual(fornecedores.normalizar_porte_me("micro-empresa"), "ME")
        self.assertIsNone(fornecedores.normalizar_porte_me("EPP"))

    @patch("app.pipeline.ingestion.fornecedores.buscar_opencnpj")
    @patch("app.pipeline.ingestion.fornecedores.buscar_brasilapi")
    def test_coletar_fornecedor_retorna_payloads_brutos(self, buscar_brasilapi, buscar_opencnpj) -> None:
        buscar_brasilapi.return_value = {"porte": "MICRO EMPRESA"}
        buscar_opencnpj.return_value = {"porte": "ME"}

        dados = fornecedores.coletar_fornecedor("12.345.678/0001-99")

        self.assertEqual(dados["cnpj"], "12345678000199")
        self.assertEqual(dados["brasilapi"], {"porte": "MICRO EMPRESA"})
        self.assertEqual(dados["opencnpj"], {"porte": "ME"})

    @patch("app.pipeline.ingestion.fornecedores.buscar_opencnpj")
    @patch("app.pipeline.ingestion.fornecedores.buscar_brasilapi")
    @patch("app.pipeline.ingestion.fornecedores.database.localizar_fornecedor_me")
    def test_validar_fornecedor_me_usa_banco_sem_chamar_apis(
        self,
        localizar_fornecedor_me,
        buscar_brasilapi,
        buscar_opencnpj,
    ) -> None:
        fornecedor = {
            "cnpj": "12345678000199",
            "razao_social": "EMPRESA TESTE LTDA",
            "porte": "ME",
        }
        localizar_fornecedor_me.return_value = fornecedor

        dados = fornecedores.validar_fornecedor_me("12.345.678/0001-99")

        self.assertEqual(dados, fornecedor)
        buscar_brasilapi.assert_not_called()
        buscar_opencnpj.assert_not_called()

    @patch("app.pipeline.ingestion.fornecedores.database.salvar_fornecedor_me")
    @patch("app.pipeline.ingestion.fornecedores.database.localizar_fornecedor_me")
    @patch("app.pipeline.ingestion.fornecedores.buscar_opencnpj")
    @patch("app.pipeline.ingestion.fornecedores.buscar_brasilapi")
    def test_validar_fornecedor_me_salva_apenas_quando_porte_e_me(
        self,
        buscar_brasilapi,
        buscar_opencnpj,
        localizar_fornecedor_me,
        salvar_fornecedor_me,
    ) -> None:
        localizar_fornecedor_me.return_value = None
        buscar_brasilapi.return_value = {
            "cnpj": "12345678000199",
            "razao_social": "EMPRESA TESTE LTDA",
            "porte": "MICRO EMPRESA",
        }
        buscar_opencnpj.return_value = {}

        dados = fornecedores.validar_fornecedor_me("12.345.678/0001-99")

        self.assertEqual(
            dados,
            {
                "cnpj": "12345678000199",
                "razao_social": "EMPRESA TESTE LTDA",
                "porte": "ME",
            },
        )
        salvar_fornecedor_me.assert_called_once_with("12345678000199", "EMPRESA TESTE LTDA", "ME")

    @patch("app.pipeline.ingestion.fornecedores.database.salvar_fornecedor_me")
    @patch("app.pipeline.ingestion.fornecedores.database.localizar_fornecedor_me")
    @patch("app.pipeline.ingestion.fornecedores.buscar_opencnpj")
    @patch("app.pipeline.ingestion.fornecedores.buscar_brasilapi")
    def test_validar_fornecedor_me_nao_salva_empresa_que_nao_e_me(
        self,
        buscar_brasilapi,
        buscar_opencnpj,
        localizar_fornecedor_me,
        salvar_fornecedor_me,
    ) -> None:
        localizar_fornecedor_me.return_value = None
        buscar_brasilapi.return_value = {
            "razao_social": "EMPRESA MEDIA LTDA",
            "porte": "DEMAIS",
        }
        buscar_opencnpj.return_value = {"porte": "EPP"}

        dados = fornecedores.validar_fornecedor_me("12.345.678/0001-99")

        self.assertIsNone(dados)
        salvar_fornecedor_me.assert_not_called()


if __name__ == "__main__":
    unittest.main()
