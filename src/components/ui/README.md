# SisCob UI

Foundation visual compartilhada pelos módulos do SisCob. Os componentes são apresentacionais, tipados, acessíveis e aceitam `className` para extensões locais.

## Componentes

- `Button`: ações primary, secondary, ghost e danger, incluindo loading.
- `Card` e `StatCard`: superfícies e indicadores.
- `Input` e `Select`: controles nativos com foco e estados desabilitados.
- `Badge`: estados OPEN, PAID, CANCELED, warning, success e danger.
- `Table`: primitives semânticos com container de overflow controlado.
- `Drawer`: painel modal com ESC, backdrop, foco inicial, focus trap e scroll interno.
- `Toolbar` e `FilterBar`: composição de ações e filtros.
- `EmptyState`, `LoadingState` e `Skeleton`: feedback de ausência e carregamento.
- `Pagination`: navegação controlada por paginação de API.
- `Section` e `PageHeader`: estrutura semântica de conteúdo.

## Boas práticas

Importe pelo barrel `@/components/ui` ou pela pasta específica. Prefira as variantes existentes antes de adicionar classes. Use `aria-label` quando um botão tiver apenas ícone, associe labels a inputs e mantenha títulos de drawers descritivos.

## Quando reutilizar

Use estes componentes sempre que o padrão visual e semântico corresponder. Regras de negócio, busca de dados e estado de domínio devem permanecer nos módulos consumidores. Não coloque chamadas de API ou decisões de permissão na camada `ui`.
