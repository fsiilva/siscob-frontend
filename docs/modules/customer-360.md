# Customer 360 — documentação funcional e técnica inicial

**Módulo:** E013 — Customer 360

**Status:** proposta inicial, anterior à implementação

**Escopo:** visão funcional, integrações necessárias e recorte do MVP

## 1. Objetivo de negócio

O Customer 360 será a visão consolidada do cliente no SisCob. Seu objetivo é reunir, em um único contexto, identificação, situação financeira, recebíveis, pagamentos, contratos e eventos relevantes para apoiar a análise da carteira e a tomada de decisão em cobrança.

A visão deve reduzir a navegação entre sistemas e permitir que o usuário compreenda rapidamente quem é o cliente, quanto deve, como costuma pagar, quais contratos mantém e qual deve ser a próxima ação operacional.

## 2. Usuários do módulo

- **Analista de cobrança:** pesquisa clientes, avalia pendências e identifica a próxima ação.
- **Gestor financeiro:** acompanha exposição, comportamento de pagamento e risco da carteira.
- **Administrador:** consulta informações consolidadas e apoia a governança operacional.

Permissões específicas por perfil não fazem parte do MVP; os papéis acima representam os usuários-alvo.

## 3. Fluxo principal

1. O usuário acessa **Clientes** pelo Application Shell.
2. Pesquisa ou seleciona um cliente na listagem.
3. Abre a visão **Customer 360**.
4. Analisa carteira, histórico de pagamentos, contratos e sinais de risco.
5. Define a próxima ação fora do módulo ou, em versões futuras, por uma ação integrada.

## 4. Seções previstas

### Cabeçalho do cliente

Nome ou razão social, nome fantasia, CPF/CNPJ, situação cadastral e principais contatos.

### KPIs

Exposição total, saldo em aberto, saldo vencido, quantidade de títulos, atraso máximo e indicadores de pagamento.

### Dados cadastrais

Tipo de pessoa, documentos, cidade, estado, situação e demais dados de identificação disponíveis.

### Recebíveis em aberto

Títulos abertos do cliente, com empresa, documento, vencimento, atraso, saldo e tipo de cobrança.

### Histórico de pagamentos

Títulos pagos, datas de pagamento e valores relacionados ao comportamento financeiro do cliente.

### Contratos/locações

Locações relacionadas ao cliente, situação, empresa, datas relevantes e valores contratuais disponíveis.

### Timeline

Sequência cronológica derivada de emissões, vencimentos, pagamentos e eventos de contratos existentes.

### Observações

Registro operacional futuro de informações produzidas pelos usuários do SisCob.

### Contatos

Telefones, celular, e-mail e dados de cobrança disponíveis no Sisloc.

### Score de risco

Classificação futura baseada em critérios determinísticos e, posteriormente, modelos de risco aprovados.

### Resumo por IA

Síntese futura do contexto do cliente, condicionada a governança, rastreabilidade e autorização de uso dos dados.

### Próxima ação recomendada

Orientação futura baseada no estado da carteira, histórico e políticas de cobrança.

## 5. MVP do módulo

O MVP deve conter somente:

- identificação do cliente;
- KPIs financeiros;
- recebíveis em aberto;
- histórico básico de pagamentos;
- contratos ativos;
- timeline derivada dos dados existentes.

O MVP será somente de consulta. Não incluirá ações de cobrança ou mutações de dados.

## 6. Fora do MVP

- WhatsApp;
- e-mail;
- ligações;
- anexos;
- IA generativa;
- automação de cobrança;
- permissões avançadas.

Observações manuais, score de risco persistido e recomendação operacional também dependem de contratos ainda inexistentes e devem permanecer fora da primeira entrega.

## 7. APIs necessárias

Todos os endpoints identificados atualmente exigem autenticação Bearer. Os contratos abaixo foram auditados no SisCob Backend; propostas novas estão explicitamente separadas.

### 7.1 Endpoints já existentes

#### Busca e listagem de clientes

```http
GET /sisloc/customers?page=1&pageSize=20&search=
```

Parâmetros atuais:

| Parâmetro | Tipo | Regra |
| --- | --- | --- |
| `page` | número inteiro | mínimo 1; padrão 1 |
| `pageSize` | número inteiro | 1 a 100; padrão 20 |
| `search` | texto | opcional; busca conforme implementação Sisloc |

Resposta atual:

```ts
interface CustomersResponse {
  data: Array<{
    id: number;
    name: string;
    tradeName: string | null;
    personType: string | null;
    cpf: string | null;
    cnpj: string | null;
    email: string | null;
    mobilePhone: string | null;
    phone: string | null;
    city: string | null;
    state: string | null;
    active: boolean;
  }>;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
```

Esse endpoint atende à listagem inicial, mas não substitui um contrato de detalhe individual.

#### Recebíveis por cliente

```http
GET /receivables?customerId={customerId}&page=1&pageSize=20&status=OPEN
```

O endpoint aceita `customerId`, `companyId`, `status`, `collectionTypeId`, intervalo de vencimento, pesquisa textual e faixa de atraso. Para o Customer 360:

- `status=OPEN` atende à seção de recebíveis em aberto;
- `status=PAID` pode fornecer o histórico básico de pagamentos;
- a paginação deve permanecer no servidor.

Cada item contém cliente, empresa, documento, emissão, vencimento, pagamento, valores, saldo, dias de atraso, status e tipo de cobrança.

Também existe:

```http
GET /receivables/:id
```

Essa rota detalha um título, não o cliente.

#### Contratos/locações por cliente

```http
GET /sisloc/rentals?customerId={customerId}&page=1&pageSize=20&status=0
```

Parâmetros atuais relevantes: `customerId`, `companyId`, `number` e `status`, além da paginação. O contrato retorna dados de locação, datas, empresa, situação, contatos de cobrança e valores disponíveis.

O significado funcional de `status=0` e `status=1` deve ser confirmado e documentado pelo backend antes da interface final; o DTO atual expõe apenas códigos numéricos.

### 7.2 Endpoints que ainda precisam ser criados

Os caminhos abaixo são **contratos recomendados**, não endpoints existentes.

#### Detalhe do cliente

```http
GET /customers/:id
```

Deve retornar um cliente pelo identificador canônico, com o mesmo núcleo cadastral da listagem. Respostas mínimas: `200`, `400`, `401` e `404`. O contrato precisa definir a origem do ID e a política para clientes duplicados.

#### Resumo financeiro do cliente

```http
GET /customers/:id/financial-summary
```

Resposta recomendada:

```ts
interface CustomerFinancialSummary {
  customerId: number;
  totalOpenAmount: number;
  overdueAmount: number;
  openReceivables: number;
  overdueReceivables: number;
  paidReceivables: number;
  averagePaymentDelayDays: number | null;
  maximumOverdueDays: number;
  activeRentals: number;
  referenceDate: string;
}
```

Esse agregado evita calcular KPIs incorretos com apenas uma página de recebíveis.

#### Histórico de pagamentos

No MVP, pode ser atendido por `GET /receivables` com `customerId` e `status=PAID`. Um endpoint específico só será necessário se o negócio exigir eventos de pagamento parciais, estornos, múltiplas baixas ou informações não representadas pelo título.

#### Timeline consolidada

Não existe endpoint de timeline. O MVP pode derivar eventos no frontend a partir das páginas efetivamente carregadas, desde que a interface deixe claro o recorte. Para uma timeline completa, ordenada e paginada, recomenda-se futuramente:

```http
GET /customers/:id/timeline?page=1&pageSize=20
```

O backend deverá definir tipos de evento, identificador da origem, data, título, descrição segura e cursor/paginação. Não deve sintetizar observações ou contatos que não existam nas fontes.

### 7.3 Matriz de cobertura

| Necessidade | Situação atual | Gap |
| --- | --- | --- |
| Busca/listagem | Atendida por `/sisloc/customers` | Padronizar rota de domínio no futuro |
| Detalhe do cliente | Não atendida | Criar endpoint por ID |
| Recebíveis abertos | Atendida por `/receivables` | Nenhum para o recorte básico |
| Histórico básico de pagamentos | Parcialmente atendido por `/receivables?status=PAID` | Eventos parciais/estornos não modelados |
| Contratos ativos | Parcialmente atendido por `/sisloc/rentals` | Documentar semântica do status |
| Resumo financeiro | Não atendido por cliente | Criar agregado no backend |
| Timeline completa | Não atendida | Criar contrato consolidado ou declarar recorte local |

## 8. Estrutura de telas

### Proposta principal

```text
/customers
/customers/:id
```

`/customers` contém pesquisa, filtros, tabela e paginação. `/customers/:id` apresenta a visão Customer 360 completa.

**Vantagens:** URL compartilhável, navegação previsível, suporte a atualização da página, mais espaço para seções e evolução independente.

**Desvantagens:** troca de rota e necessidade de preservar estado da listagem ao retornar.

### Alternativa com drawer

A listagem permanece em `/customers` e abre o Customer 360 em um drawer.

**Vantagens:** preserva filtros, página e scroll; favorece consultas rápidas e comparação sequencial.

**Desvantagens:** espaço limitado, conteúdo longo com excesso de scroll, URL menos explícita e maior complexidade de foco/acessibilidade.

### Recomendação

Adotar `/customers/:id` para a visão completa. Um drawer pode ser usado futuramente como resumo rápido, com link para a página completa, sem duplicar regras de consulta.

## 9. Componentes de frontend previstos

- `CustomersPage`: orquestra a listagem e os estados da rota.
- `CustomersTable`: tabela paginada e acessível.
- `CustomerFilters`: pesquisa e filtros suportados pelo backend.
- `Customer360Header`: identificação e situação cadastral.
- `CustomerKpis`: indicadores retornados pelo resumo financeiro.
- `CustomerReceivables`: recebíveis abertos paginados.
- `CustomerPayments`: histórico básico de títulos pagos.
- `CustomerRentals`: contratos/locações ativos.
- `CustomerTimeline`: composição cronológica dos eventos disponíveis.

Os componentes devem reutilizar o Design System em `src/components/ui` e manter consultas, tipos e regras fora da camada visual.

## 10. Estados

Cada bloco remoto deve tratar seu próprio estado, sem bloquear toda a página desnecessariamente:

- **loading:** skeleton do cabeçalho, KPIs ou lista correspondente;
- **error:** mensagem contextual e opção de tentar novamente;
- **empty:** fonte consultada com sucesso, mas sem registros;
- **success:** dados válidos renderizados;
- **not found:** cliente solicitado não existe ou não está disponível para consulta.

Falhas parciais devem preservar as seções carregadas com sucesso.

## 11. Critérios de aceite do MVP

1. `/customers` pesquisa clientes reais com debounce e paginação da API.
2. Selecionar um cliente navega para `/customers/:id` usando seu ID real.
3. Atualizar diretamente `/customers/:id` restaura a visão sem depender da listagem anterior.
4. Cliente inexistente apresenta estado `not found`, distinto de erro genérico.
5. O cabeçalho exibe identificação cadastral sem inventar valores para campos nulos.
6. KPIs financeiros são calculados no backend sobre o conjunto completo, não sobre uma página.
7. Recebíveis em aberto usam `customerId` e `status=OPEN`, com paginação real.
8. Histórico básico usa `customerId` e `status=PAID`, exibindo somente dados do contrato.
9. Contratos ativos usam filtro por `customerId` e semântica de status previamente confirmada.
10. A timeline identifica a fonte de cada evento e declara o recorte quando derivada de dados paginados.
11. Todas as seções possuem estados loading, error, empty e success; a página possui not found.
12. Datas seguem `dd/MM/yyyy`, valores usam Real brasileiro e a interface é responsiva.
13. Nenhuma ação de WhatsApp, e-mail, ligação, automação ou IA aparece no MVP.
14. Autenticação e refresh existentes são reutilizados sem contratos paralelos.
15. Lint, build, testes e `git diff --check` são aprovados nas features de implementação.

## 12. Roadmap interno do módulo

### E013-F001 — Auditoria de APIs

Validar contratos publicados, semântica de status, volumetria, relacionamentos e qualidade dos identificadores.

### E013-F002 — Listagem de clientes

Criar `/customers`, pesquisa, tabela, paginação e estados.

### E013-F003 — Endpoint de detalhe

Implementar e publicar o detalhe individual do cliente, incluindo 404 consistente.

### E013-F004 — Tela Customer 360

Criar `/customers/:id`, cabeçalho, dados cadastrais, layout responsivo e estados parciais.

### E013-F005 — Recebíveis do cliente

Integrar recebíveis abertos e KPIs com paginação e resumo financeiro completo.

### E013-F006 — Histórico e contratos

Integrar títulos pagos e locações ativas após validar a semântica dos contratos.

### E013-F007 — Timeline

Definir eventos, ordenação e recorte; implementar derivação inicial ou endpoint consolidado.

### Sequência recomendada

`F001 → F003 → F002 → F004 → F005 → F006 → F007`. O detalhe e a semântica das fontes devem ser estabilizados antes da composição da visão completa.

## 13. Riscos e dependências

- **Qualidade dos dados do Sisloc:** campos incompletos, formatos legados e inconsistências podem reduzir a confiabilidade da visão.
- **Ausência de relacionamentos:** pagamentos, contratos e recebíveis podem não compartilhar uma chave canônica suficiente.
- **Performance:** múltiplas seções podem disparar consultas pesadas; agregados e carregamento progressivo serão necessários.
- **Paginação:** KPIs e timeline não podem ser calculados corretamente usando somente a página visível.
- **Duplicidade de clientes:** registros equivalentes podem possuir IDs distintos e fragmentar a visão.
- **CPF/CNPJ ausente:** a ausência impede deduplicação simples e exige política explícita de identidade.
- **Dependência de novas APIs:** detalhe, resumo financeiro e timeline completa ainda não possuem contratos publicados.
- **Semântica de status:** códigos de locação precisam de significado funcional documentado.
- **Consistência temporal:** fontes podem ser atualizadas em momentos diferentes; respostas devem informar uma data de referência quando aplicável.
- **Segurança e privacidade:** dados pessoais e financeiros devem seguir minimização, controle de acesso e políticas de auditoria em fases futuras.
