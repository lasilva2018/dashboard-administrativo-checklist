# 🚀 Guia de Deploy do Dashboard Administrativo Predial na Vercel

Este guia vai te ajudar a publicar o Dashboard Administrativo Predial do Grupo Pensou na Vercel de forma rápida e gratuita.

---

## 📋 Pré-requisitos

1. Conta no GitHub (gratuita) - [github.com](https://github.com)
2. Conta na Vercel (gratuita) - [vercel.com](https://vercel.com)
3. Código do dashboard (arquivo ZIP fornecido)

---

## 🔧 Passo 1: Criar Repositório no GitHub

### 1.1. Acesse o GitHub
- Vá para [github.com](https://github.com) e faça login
- Clique no botão **"+"** no canto superior direito
- Selecione **"New repository"**

### 1.2. Configure o Repositório
- **Nome:** `dashboard-administrativo-pensou`
- **Descrição:** Dashboard Administrativo Predial - Grupo Pensou
- **Visibilidade:** Private (recomendado)
- **NÃO** marque "Add a README file"
- Clique em **"Create repository"**

### 1.3. Faça Upload do Código
Você tem duas opções:

#### Opção A: Upload via Interface Web (Mais Fácil)
1. Descompacte o arquivo ZIP no seu computador
2. No GitHub, clique em **"uploading an existing file"**
3. Arraste todos os arquivos da pasta descompactada
4. Clique em **"Commit changes"**

#### Opção B: Upload via Git (Linha de Comando)
```bash
# Descompacte o ZIP e entre na pasta
cd dashboard-administrativo-inspecoes

# Inicialize o repositório
git init
git add .
git commit -m "Initial commit"

# Conecte ao GitHub (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/dashboard-administrativo-pensou.git
git branch -M main
git push -u origin main
```

---

## 🌐 Passo 2: Deploy na Vercel

### 2.1. Conecte sua Conta
1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Sign Up"** ou **"Log In"**
3. Escolha **"Continue with GitHub"**
4. Autorize a Vercel a acessar seus repositórios

### 2.2. Importe o Projeto
1. No dashboard da Vercel, clique em **"Add New..."** → **"Project"**
2. Encontre o repositório `dashboard-administrativo-pensou`
3. Clique em **"Import"**

### 2.3. Configure o Projeto
- **Framework Preset:** Next.js (detectado automaticamente)
- **Root Directory:** `./` (deixe como está)
- **Build Command:** `pnpm build` (já configurado)
- **Output Directory:** `.next` (já configurado)
- **Install Command:** `pnpm install` (já configurado)

### 2.4. Configure as Variáveis de Ambiente
Clique em **"Environment Variables"** e adicione as seguintes variáveis:

#### Firebase (obrigatórias)
```
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

#### Baserow (obrigatórias)
```
NEXT_PUBLIC_BASEROW_API_TOKEN=seu_token_baserow
NEXT_PUBLIC_BASEROW_TABLE_ID=seu_table_id
```

**Onde encontrar essas credenciais:**
- **Firebase:** Console do Firebase → Project Settings → General
- **Baserow:** Configurações da sua conta Baserow → API tokens

### 2.5. Faça o Deploy
1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos enquanto a Vercel faz o build
3. ✅ Pronto! Seu dashboard está no ar!

---

## 🎯 Passo 3: Acessar e Configurar

### 3.1. URL do Projeto
Após o deploy, você receberá uma URL como:
```
https://dashboard-administrativo-pensou.vercel.app
```

### 3.2. Domínio Customizado (Opcional)
1. No dashboard da Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio personalizado (ex: `dashboard.grupopensou.com.br`)
3. Configure os DNS conforme instruções da Vercel

---

## 🔄 Atualizações Futuras

Sempre que você fizer alterações no código:

1. Faça commit no GitHub:
```bash
git add .
git commit -m "Descrição da mudança"
git push
```

2. A Vercel fará deploy automático em segundos! 🚀

---

## ⚙️ Configurações Importantes

### Autenticação Firebase
- Certifique-se de adicionar o domínio da Vercel nas **Authorized domains** do Firebase
- Firebase Console → Authentication → Settings → Authorized domains
- Adicione: `dashboard-administrativo-pensou.vercel.app`

### CORS do Baserow
- Configure o CORS do Baserow para aceitar requisições do domínio da Vercel

---

## 🆘 Problemas Comuns

### Erro de Build
- Verifique se todas as variáveis de ambiente estão configuradas
- Confira os logs de build na Vercel

### Erro de Autenticação
- Adicione o domínio da Vercel no Firebase Authorized domains
- Verifique se as credenciais do Firebase estão corretas

### Erro de API Baserow
- Verifique se o token do Baserow está correto
- Confirme se o CORS está configurado

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs na Vercel (aba "Deployments")
2. Consulte a documentação da Vercel: [vercel.com/docs](https://vercel.com/docs)
3. Verifique se todas as variáveis de ambiente estão corretas

---

## ✅ Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Código enviado para o GitHub
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Domínio adicionado no Firebase Authorized domains
- [ ] Dashboard acessível e funcionando

---

**Parabéns! Seu Dashboard Administrativo Predial está no ar! 🎉**
