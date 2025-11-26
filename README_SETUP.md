# Dashboard Administrativo de Inspeções Prediais

## 🚀 Projeto desenvolvido em etapas

### ✅ Etapa 1 - CONCLUÍDA
- Estrutura base do projeto
- Página de login com Firebase (Google + Email/Senha)
- Sidebar e Header com navegação
- Proteção de rotas
- Layout base para todas as páginas
- Identidade visual do Grupo Pensou

---

## 📋 Configuração Inicial

### 1. Instalar dependências
```bash
cd /home/ubuntu/dashboard-administrativo-inspecoes
pnpm install
```

### 2. Configurar Firebase
Edite o arquivo `.env.local` com as credenciais do Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

**Nota:** Use as mesmas credenciais do projeto `login-pensou` para manter a mesma base de usuários.

### 3. Iniciar servidor de desenvolvimento
```bash
pnpm dev --port 3001
```

O dashboard estará disponível em: `http://localhost:3001`

---

## 🎨 Identidade Visual

- **Cores primárias:** Azul royal/escuro (Grupo Pensou)
- **Paleta OKLCH:**
  - Primary: `oklch(0.38 0.15 264)` - Azul royal escuro
  - Primary Light: `oklch(0.55 0.18 264)` - Azul claro
  - Primary Hover: `oklch(0.45 0.16 264)` - Azul médio

---

## 📁 Estrutura do Projeto

```
dashboard-administrativo-inspecoes/
├── app/
│   ├── login/              # Página de login
│   ├── dashboard/          # Dashboard principal (em construção)
│   ├── inspecoes/          # Listagem de inspeções (em construção)
│   ├── historico/          # Histórico (em construção)
│   ├── layout.tsx          # Layout raiz
│   ├── page.tsx            # Redirect para /login
│   └── globals.css         # Estilos globais
├── components/
│   ├── ui/                 # Componentes Shadcn/UI
│   ├── Sidebar.tsx         # Menu lateral
│   ├── Header.tsx          # Cabeçalho
│   ├── AuthGuard.tsx       # Proteção de rotas
│   └── DashboardLayout.tsx # Layout base
├── lib/
│   ├── firebase.ts         # Configuração Firebase
│   ├── constants.ts        # Constantes do projeto
│   └── utils.ts            # Funções utilitárias
└── todo.md                 # Checklist de desenvolvimento
```

---

## 🔐 Autenticação

O sistema suporta dois métodos de autenticação:

1. **Google Sign-In:** Login rápido com conta Google
2. **Email/Senha:** Login tradicional

Após o login, o usuário é redirecionado para `/dashboard`.

---

## 🛣️ Rotas

- `/` - Redirect para `/login`
- `/login` - Página de autenticação
- `/dashboard` - Dashboard principal (protegido)
- `/inspecoes` - Listagem de inspeções (protegido)
- `/historico` - Histórico de inspeções (protegido)

---

## 📦 Próximas Etapas

### Etapa 2 - Dashboard Principal
- Cards com estatísticas (Pendentes, Aprovadas, Reprovadas)
- Tabela com últimas inspeções
- Componente InspectionCard
- API mock com dados fictícios

### Etapa 3 - Listagem de Inspeções
- Filtros por status
- Busca por zelador/data
- Paginação (50 itens por página)
- Componente Table reutilizável

### Etapa 4 - Detalhes da Inspeção
- Visualização completa da inspeção
- Grid de fotos 3x3
- Modal fullscreen para imagens
- Ações: Aprovar/Reprovar

### Etapa 5 - Histórico e Exportação
- Filtros avançados
- Exportação para PDF
- Exportação para Excel
- Relatórios consolidados

---

## 🐛 Troubleshooting

### Erro: "address already in use :::3000"
A porta 3000 está ocupada pelo projeto `login-pensou`. Use a porta 3001:
```bash
pnpm dev --port 3001
```

### Firebase não inicializado
Verifique se o arquivo `.env.local` está configurado corretamente com todas as variáveis.

---

## 📝 Notas Importantes

- Este projeto é **independente** do `login-pensou`, mas compartilha a mesma autenticação Firebase
- O servidor roda na **porta 3001** para não conflitar com outros projetos
- A identidade visual segue o padrão do **Grupo Pensou**
- Desenvolvido com **Next.js 14**, **TailwindCSS 4** e **Shadcn/UI**
