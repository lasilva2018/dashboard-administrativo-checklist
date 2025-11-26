# Dashboard Administrativo de Inspeções Prediais - Grupo Pensou

Dashboard completo para gerenciamento de inspeções prediais condominiais, desenvolvido com Next.js 14, TailwindCSS, Shadcn/UI e Firebase Authentication.

## 🎯 Visão Geral

Este dashboard permite que síndicos e administradores gerenciem inspeções prediais realizadas por zeladores, com funcionalidades de aprovação/reprovação, visualização de checklists, filtros avançados e exportação de relatórios em PDF e Excel.

## 🚀 Tecnologias Utilizadas

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** TailwindCSS 4
- **Componentes UI:** Shadcn/UI
- **Autenticação:** Firebase Authentication (Google + Email/Senha)
- **Gerenciamento de Estado:** SWR (React Hooks for Data Fetching)
- **Exportação:** jsPDF, jspdf-autotable, xlsx
- **Ícones:** Lucide React
- **Notificações:** Sonner (Toast)

## 📋 Funcionalidades

### 1. Autenticação
- Login com Google
- Login com Email e Senha
- Proteção de rotas (AuthGuard)
- Persistência de sessão

### 2. Dashboard Principal
- Cards de estatísticas (Total, Pendentes, Aprovadas, Reprovadas)
- Últimas 5 inspeções
- Navegação rápida
- Contador de notificações pendentes

### 3. Listagem de Inspeções
- Tabela completa com todas as inspeções
- Filtros:
  - Busca por condomínio ou zelador
  - Filtro por status
- Paginação (50 itens por página)
- Visualização de itens NOK destacados

### 4. Detalhes da Inspeção
- Informações gerais (condomínio, zelador, data)
- Checklist completo com status visual (OK/NOK/N/A)
- Observações e fotos anexadas
- Histórico de aprovação/reprovação
- Botões de ação:
  - Aprovar inspeção (com comentário opcional)
  - Reprovar inspeção (com motivo obrigatório)
- Exportação individual (PDF e Excel)

### 5. Histórico
- Estatísticas do período filtrado
- Filtros avançados:
  - Busca
  - Status
  - Período personalizado (data inicial e final)
- Exportação consolidada:
  - Relatório PDF com tabela formatada
  - Planilha Excel com todos os dados

## 🔧 Configuração e Instalação

### 1. Pré-requisitos
- Node.js 18+ instalado
- pnpm instalado (`npm install -g pnpm`)
- Conta Firebase configurada

### 2. Instalação

```bash
# Instale as dependências
pnpm install
```

### 3. Configuração do Firebase

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### 4. Executar o Projeto

```bash
# Modo de desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Executar produção
pnpm start
```

O projeto estará disponível em `http://localhost:3000`

## 🎨 Identidade Visual

O dashboard utiliza a identidade visual do **Grupo Pensou**:
- **Cores primárias:** Azul royal (#1e3a8a) e azul claro (#3b82f6)
- **Logo:** Oficial do Grupo Pensou
- **Tipografia:** Inter (Google Fonts)

## 📊 Dados Mock

O projeto inclui 15 inspeções fictícias para demonstração, com:
- 5 zeladores diferentes
- 5 condomínios diferentes
- Status variados (pendente, aprovada, reprovada)
- 8-12 itens de checklist por inspeção
- Datas distribuídas nos últimos 30 dias

## 🔐 Autenticação

O sistema usa Firebase Authentication com:
- **Google Sign-In:** Login rápido com conta Google
- **Email/Senha:** Login tradicional
- **Proteção de rotas:** Redireciona para login se não autenticado
- **Persistência:** Sessão mantida entre recarregamentos

## 📱 Responsividade

O dashboard é totalmente responsivo e otimizado para:
- Desktop (1920px+)
- Laptop (1366px - 1920px)
- Tablet (768px - 1366px)
- Mobile (320px - 768px)

## 🔄 Integração com Baserow

O projeto está preparado para integração com Baserow:

**Tabelas:**
1. **inspecoes** - Dados gerais das inspeções
2. **itens_checklist** - Itens verificados em cada inspeção

Para conectar ao Baserow real, substitua as funções em `lib/api/index.ts` por chamadas HTTP à API do Baserow.

## 📦 Exportação de Relatórios

### PDF
- Relatório consolidado com tabela formatada
- PDF individual de cada inspeção
- Cabeçalho com logo e estatísticas
- Cores da identidade visual

### Excel
- Planilha consolidada com todas as colunas
- Excel individual com múltiplas abas
- Larguras de coluna ajustadas automaticamente
- Formato XLSX compatível com Excel e Google Sheets

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

### Outras Plataformas
O projeto é compatível com qualquer plataforma que suporte Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Docker

## 📝 TODO Futuro

- [ ] Integração real com API do Baserow
- [ ] Upload de fotos para S3 ou Firebase Storage
- [ ] Notificações push quando novas inspeções chegarem
- [ ] Gráficos de evolução temporal
- [ ] Filtro por múltiplos condomínios
- [ ] Permissões por role (síndico, administrador, visualizador)
- [ ] Modo escuro (dark mode)
- [ ] PWA (Progressive Web App)

## 👥 Autor

Desenvolvido para o **Grupo Pensou**

## 📄 Licença

Este projeto é proprietário do Grupo Pensou.
