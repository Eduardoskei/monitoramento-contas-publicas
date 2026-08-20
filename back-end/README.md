# API de Análise de Compras Públicas

API NestJS responsável por receber solicitações do frontend, validar os dados, encaminhá-los a um serviço FastAPI de análise de dados e devolver respostas padronizadas em português.

O projeto segue a organização Clean Architecture do `05-nest-clean`. Não possui autenticação, banco de dados, Prisma ou Redis neste MVP.

## Responsabilidades

- Validar os dados recebidos do frontend com Zod.
- Encaminhar análises ao FastAPI configurado em `FASTAPI_BASE_URL`.
- Validar as respostas do FastAPI antes de entregá-las ao frontend.
- Armazenar respostas estáveis em cache local com TTL e política LRU.
- Padronizar erros em português.
- Publicar documentação OpenAPI/Swagger integralmente em português.

## Endpoints

| Método | Rota | Finalidade |
| --- | --- | --- |
| `POST` | `/api/v1/analises/licitacoes-municipais` | Consultar licitações de um município |
| `POST` | `/api/v1/analises/participacao-me-local` | Calcular a participação financeira de ME local |
| `POST` | `/api/v1/analises/licitacoes-me` | Consultar licitações destinadas a microempresas |
| `POST` | `/api/v1/analises/licitacoes-por-empresa` | Consultar licitações e itens de uma empresa |
| `POST` | `/api/v1/analises/contratos-da-licitacao` | Consultar contratos de uma licitação ou item |

O Nest encaminha cada requisição para a mesma rota relativa no FastAPI.

## Swagger

Com `DOCUMENTATION_ENABLED=true`:

- Swagger UI: `http://localhost:3333/documentacao`
- OpenAPI JSON: `http://localhost:3333/documentacao-json`

Entradas, campos de retorno, exemplos, descrições e erros estão documentados em português do Brasil.

## Configuração

Copie `.env.example` para `.env` e ajuste pelo menos:

```env
FASTAPI_BASE_URL=http://localhost:8000
FASTAPI_TIMEOUT_MS=10000
FASTAPI_RETRY_ATTEMPTS=1
```

`FASTAPI_SERVICE_TOKEN` é opcional. Quando informado, é enviado como token Bearer exclusivamente ao FastAPI.

## Cache em memória

O cache possui:

- TTL configurável por operação.
- Limite de entradas.
- Limite por resposta e limite total de memória.
- Remoção LRU.
- Expiração automática.
- Deduplicação de requisições simultâneas iguais.
- Armazenamento exclusivo de respostas válidas e bem-sucedidas.

O cache é local ao processo, não é compartilhado entre réplicas e é perdido durante reinicializações. O contrato `AnalysisCache` permite substituir a implementação futuramente sem alterar os casos de uso.

## Contrato esperado do FastAPI

O FastAPI ainda será implementado. Ele deverá:

1. Expor as mesmas cinco rotas relativas usadas pelo Nest.
2. Aceitar os corpos JSON documentados no Swagger.
3. Retornar apenas o conteúdo de `dados`, sem o envelope de `metadados`.
4. Usar strings decimais para valores monetários e percentuais.
5. Retornar os campos obrigatórios definidos na documentação.

O Nest adiciona o envelope final:

```json
{
  "dados": {},
  "metadados": {
    "origemResposta": "CACHE",
    "geradoEm": "2026-08-20T12:00:00.000Z",
    "expiraEm": "2026-08-20T18:00:00.000Z",
    "identificadorRastreio": "f583b452-75c4-4f17-a2ca-50404d57c863",
    "fonteDados": "Serviço de análise de dados"
  }
}
```

## Erros tratados

- Entrada do frontend inválida: `400`.
- Parâmetros rejeitados pelo FastAPI: `422`.
- Recurso inexistente: `404`.
- Limite de requisições: `429`.
- Resposta inválida ou erro interno do FastAPI: `502`.
- FastAPI indisponível: `503`.
- Tempo limite excedido: `504`.

Erros e timeouts não são armazenados no cache.

## Execução

```bash
npm install
npm run start:dev
```

## Verificações

O escopo atual possui somente testes unitários. O cliente HTTP é mockado e nenhuma conexão com FastAPI é realizada durante os testes.

```bash
npm test
npm run test:cov
npm run lint
npm run build
```
