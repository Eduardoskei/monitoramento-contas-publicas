# DataFrames finais do `merge.py`

Este documento descreve os 3 DataFrames que resultam de uma composição típica
de `app/pipeline/merge.py` — a que funde a tabela-filha de itens do PNCP na
tabela-pai (via `juntar_itens_pncp`) em vez de mantê-la separada. Cada um tem
grão (o que uma linha representa), fonte e propósito de KPI diferentes, e por
isso são mantidos como 3 tabelas em vez de forçados numa só.

## 1. PNCP — Contratações × Itens

**Como se chega nele:**
```python
tabelas = cleaning.limpar_pncp_contratacoes(registros)
tabelas = merge.montar_base_pncp(tabelas, municipios_ibge=municipios_ibge)
contratacoes_itens = merge.juntar_itens_pncp(tabelas)
```

**Grão:** 1 linha por **item de uma contratação** (uma contratação com N itens
gera N linhas — os campos da contratação se repetem em cada linha).

**Principais colunas:**

| Coluna | Origem | O que é |
|---|---|---|
| `numero_controle_pncp` | contratação | identificador único da contratação no PNCP |
| `objeto_compra`, `valor_total_estimado`, `valor_total_homologado` | contratação | descrição e valores da compra como um todo |
| `data_abertura_proposta`, `data_publicacao_pncp`, ... | contratação | datas do processo (já em UTC quando havia fuso) |
| `orgao_entidade_cnpj`, `orgao_entidade_razao_social` | contratação | órgão comprador (não o fornecedor) |
| `unidade_orgao_codigo_ibge`, `municipio_nome`, `municipio_uf`, `unidade_orgao_codigo_ibge_uf_confere` | contratação + enriquecimento IBGE | município oficial do órgão e sinalização de divergência de UF |
| `descricao`, `quantidade`, `valor_unitario_estimado`, `valor_total`, `numero_item` | item | detalhe de cada item comprado |

**Por que é mantido separado dos outros dois:**
- **Grão diferente de "contratos"**: um item da compra não corresponde 1:1 a
  um contrato formalizado — uma mesma contratação pode gerar vários contratos,
  e cada contrato pode cobrir vários itens. Juntar os dois numa linha só
  produziria um produto cartesiano sem significado (itens repetidos por
  contrato, ou contratos repetidos por item).
- **Não existe equivalente no TCE-CE**: o TCE não expõe itens de compra no
  mesmo nível de detalhe que o PNCP — não há com o que cruzar linha a linha.
- **Serve um propósito de KPI próprio**: análise de preço unitário, categoria
  de material/serviço comprado — granularidade que as outras duas tabelas não
  têm.

## 2. PNCP — Contratos (enriquecido com fornecedor)

**Como se chega nele:**
```python
tabelas = merge.montar_base_pncp(tabelas, fornecedores_df=fornecedores_df)
contratos_pncp = tabelas["contratos"]
```

**Grão:** 1 linha por **contrato formalizado** dentro de uma contratação
(campo `ni_fornecedor` identifica quem venceu aquele contrato específico).

**Principais colunas:**

| Coluna | Origem | O que é |
|---|---|---|
| `numero_controle_pncp` | chave-pai | liga de volta à contratação de origem |
| `ni_fornecedor`, `nome_razao_social_fornecedor` | contrato | CNPJ/CPF e nome do fornecedor vencedor (campo cru do PNCP, sem a palavra "cnpj" no nome) |
| `valor_global`, `tipo_pessoa` | contrato | valor do contrato e se é PJ/PF |
| `fornecedor_porte_padronizado`, `fornecedor_elegivel_me_epp` | enriquecimento | classificação ME/EPP (LC 123/2006) do fornecedor |
| `fornecedor_optante_simples_nacional`, `fornecedor_optante_mei` | enriquecimento | regime tributário (critério distinto do porte) |
| `fornecedor_cnpj_valido` | enriquecimento | dígito verificador do CNPJ conferido |

**Por que é mantido separado:**
- **Grão diferente de "itens"** (ver acima).
- **É a única das 3 tabelas com identidade de fornecedor no nível de
  contrato do PNCP** — misturar com a tabela de itens (que não tem fornecedor
  algum) inflaria a tabela de itens com uma dimensão que não pertence a ela.
- **Precisa do enriquecimento por CNPJ normalizado manualmente**: `ni_fornecedor`
  não bate no padrão automático de detecção de CNPJ do módulo de limpeza, então
  esse enriquecimento só acontece aqui, não em "contratações × itens".

## 3. TCE-CE — Contratos × Contratados (enriquecido com fornecedor)

**Como se chega nele:**
```python
df_contratos = cleaning.limpar_tce(tce.buscar_contratos(...))
df_contratados = cleaning.limpar_tce(tce.buscar_contratados(...))
tce_final = merge.montar_base_tce(df_contratos, df_contratados, fornecedores_df=fornecedores_df)
```

**Grão:** 1 linha por **contrato do TCE-CE** (já com os dados do contratado
trazidos de um dataset separado).

**Principais colunas:**

| Coluna | Origem | O que é |
|---|---|---|
| `codigo_municipio`, `numero_contrato` | contratos | identificação do contrato — `codigo_municipio` é código **interno do TCE**, não o código IBGE |
| `descricao_objeto_contrato`, `valor_total_contrato` | contratos | objeto e valor |
| `data_contrato`, `data_inicio_vigencia_contrato`, `data_fim_vigencia_contrato` | contratos | datas do contrato |
| `cpf_gestor`, `cpf_gestor_valido` | contratos | CPF do gestor responsável, já validado |
| `numero_id_contrato_pncp` | contratos | referência ao PNCP — **confirmado em varredura real: ~0% preenchido**, não serve como chave de cruzamento |
| `numero_documento_negociante`, `nome_negociante` | contratados (join por `numero_contrato`+`codigo_municipio`) | CNPJ/CPF e nome do contratado — **não existe em `contratos` sozinho** |
| `fornecedor_porte_padronizado`, `fornecedor_elegivel_me_epp`, `fornecedor_optante_simples_nacional` | enriquecimento | mesma classificação ME/EPP usada no PNCP |

**Por que é mantida separada das duas de cima:**
- **É outro sistema, de outro órgão** (TCE-CE, fiscalização estadual — não o
  portal nacional PNCP). Os nomes de campo, formatos e regras de negócio são
  inteiramente diferentes (confirmados via consulta real à API, não suposição).
- **Não há chave 1:1 confiável com o PNCP**: o campo que deveria linkar os
  dois (`numero_id_contrato_pncp`) está vazio em praticamente todos os
  registros verificados (0% em 2022-2023, ~10% só em amostra recente de 2024-2025).
  Sem essa chave, não dá para saber com segurança se um contrato do TCE e um
  do PNCP são "a mesma compra" — misturar as duas tabelas por concatenação
  simples arrisca **dupla contagem** se o mesmo gasto for reportado nos dois
  sistemas (algo que pode acontecer, já que municípios podem ser obrigados a
  publicar em ambos).
- **`codigo_municipio` não é o código IBGE**: é um código interno do TCE-CE.
  Existe uma tabela de correspondência (`tce.buscar_municipios()`), mas ainda
  não está ligada ao restante do pipeline — então esta tabela não tem
  `municipio_nome`/`municipio_uf` como a tabela 1 do PNCP tem, diferente das
  colunas de município que a tabela do PNCP carrega.
- **É a fonte primária das KPIs municipais do dashboard** (ex.: Tabela 01 —
  % ME/EPP por natureza de despesa e por mês), definida explicitamente como
  tal nesta conversa — não faz sentido diluí-la numa tabela combinada com o
  PNCP, que serve outro propósito (contratações em nível nacional).

## Resumo: por que não uma tabela só

| Motivo | Afeta |
|---|---|
| Grãos incompatíveis (item ≠ contrato) | Tabela 1 vs. Tabela 2 |
| Fontes diferentes, sem chave 1:1 confiável (crosswalk PNCP↔TCE ~0% preenchido) | Tabelas 1/2 vs. Tabela 3 |
| Esquemas de município incompatíveis (código IBGE vs. código interno TCE) | Tabelas 1/2 vs. Tabela 3 |
| Risco de dupla contagem ao somar valores das duas fontes juntas | Tabelas 1/2 vs. Tabela 3 |
| Cada uma serve um propósito de KPI diferente (preço unitário, fornecedor vencedor nacional, % ME/EPP municipal) | Todas |

Se for realmente necessário visualizar as três lado a lado (não para somar,
só para comparar), existe `merge.unir_pncp_e_tce(df_pncp, df_tce)` — uma
união vertical que preserva todas as colunas das duas fontes, com a mesma
ressalva de dupla contagem documentada em seu docstring.
