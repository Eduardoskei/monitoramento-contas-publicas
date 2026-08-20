"""
app/pipeline/kpis.py

Camada de agregacao (KPIs) sobre tabelas ja limpas/enriquecidas por
cleaning.py e merge.py — nao faz join nem limpeza, so agrupa e soma.

Uso tipico:
    df = merge.montar_base_tce(df_contratos, df_contratados, fornecedores_df=fornecedores_df)
    df["ano_mes"] = kpis.extrair_ano_mes(df["data_contrato"])
    resultado = kpis.calcular_participacao_me_epp(
        df,
        colunas_agrupamento=["ano_mes"],
        coluna_valor="valor_total_contrato",
    )
"""

from __future__ import annotations

import pandas as pd


def extrair_ano_mes(coluna_data: pd.Series) -> pd.Series:
    """
    Extrai o periodo 'YYYY-MM' de uma coluna de data ja normalizada para ISO
    8601 por `cleaning.converter_datas` ('YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS'
    ou '...Z'). Valores nulos/vazios (incluindo o marcador 'nao_informado' que
    `cleaning.tratar_nulos` usa em colunas de texto) viram `None`.
    """
    texto = coluna_data.astype("string")
    ano_mes = texto.str.slice(0, 7)
    valido = texto.notna() & texto.str.match(r"^\d{4}-\d{2}")
    return ano_mes.where(valido, None)


def calcular_participacao_me_epp(
    df: pd.DataFrame,
    *,
    colunas_agrupamento: list[str],
    coluna_valor: str,
    coluna_elegivel_me_epp: str = "fornecedor_elegivel_me_epp",
) -> pd.DataFrame:
    """
    Agrupa por `colunas_agrupamento` e calcula, por grupo:
      - total_compras: soma de `coluna_valor` de todas as linhas do grupo
      - valor_me_epp: soma de `coluna_valor` so onde `coluna_elegivel_me_epp` e True
      - percentual_me_epp: valor_me_epp / total_compras (None quando o total e 0,
        para nao gerar divisao por zero nem confundir com "0% de participacao")

    Linhas sem fornecedor identificado (`coluna_elegivel_me_epp` nulo — CNPJ
    nao encontrado na base de fornecedores, nao consultado, ou contratado
    pessoa fisica) contam para o total mas NAO para valor_me_epp: sao "nao
    comprovadamente ME/EPP", o que e diferente de "comprovadamente nao
    ME/EPP" (`False`). Essa distincao evita subestimar a participacao real
    quando a coleta de fornecedores ainda esta incompleta.
    """
    df = df.copy()
    eh_me_epp = df[coluna_elegivel_me_epp].map(lambda v: bool(v) if pd.notna(v) else False)
    df["_valor_me_epp"] = df[coluna_valor].where(eh_me_epp, 0)

    agrupado = (
        df.groupby(colunas_agrupamento, dropna=False)
        .agg(total_compras=(coluna_valor, "sum"), valor_me_epp=("_valor_me_epp", "sum"))
        .reset_index()
    )

    agrupado["percentual_me_epp"] = (agrupado["valor_me_epp"] / agrupado["total_compras"]).where(
        agrupado["total_compras"] != 0
    )

    return agrupado


def calcular_participacao_me_epp_por_mes(
    df: pd.DataFrame,
    *,
    coluna_data: str,
    coluna_valor: str,
    coluna_elegivel_me_epp: str = "fornecedor_elegivel_me_epp",
) -> pd.DataFrame:
    """Atalho de `calcular_participacao_me_epp` agrupando por mes (`extrair_ano_mes`)."""
    df = df.copy()
    df["ano_mes"] = extrair_ano_mes(df[coluna_data])
    return calcular_participacao_me_epp(
        df,
        colunas_agrupamento=["ano_mes"],
        coluna_valor=coluna_valor,
        coluna_elegivel_me_epp=coluna_elegivel_me_epp,
    )
