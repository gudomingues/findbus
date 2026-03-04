# 🚀 DEPLOY NO GITHUB PAGES

## ✅ Configuração Completa

Este projeto está configurado para deploy automático no GitHub Pages usando GitHub Actions.

---

## 📋 Passo a Passo para Configurar

### 1. **Criar Repositório no GitHub**

```bash
# Inicialize o git (se ainda não foi feito)
git init

# Adicione todos os arquivos
git add .

# Faça o primeiro commit
git commit -m "Initial commit - FindBus Project"

# Crie um repositório no GitHub e conecte
git remote add origin https://github.com/SEU_USUARIO/findbus.git

# Push para o GitHub
git push -u origin main
```

---

### 2. **Configurar GitHub Secrets (Variáveis de Ambiente)**

No seu repositório do GitHub:

1. Vá em **Settings** → **Secrets and variables** → **Actions**
2. Clique em **New repository secret**
3. Adicione as seguintes secrets:

#### Secret 1: REACT_APP_OLHOVIVO_TOKEN
- **Name:** `REACT_APP_OLHOVIVO_TOKEN`
- **Value:** `6336708fa832bd35a008691c697daffe93e248f0bffed553801b7bddbfa9dc00`

#### Secret 2: REACT_APP_GOOGLE_MAPS_API_KEY
- **Name:** `REACT_APP_GOOGLE_MAPS_API_KEY`
- **Value:** `AIzaSyBmcBxeaUVZOJBIiuwD6yOlZJv7JPz2lqc`

> ⚠️ **IMPORTANTE:** As secrets são criptografadas e não podem ser visualizadas depois de salvas!

---

### 3. **Habilitar GitHub Pages**

No seu repositório:

1. Vá em **Settings** → **Pages**
2. Em **Source**, selecione: **GitHub Actions**
3. Salve as configurações

---

### 4. **Fazer Deploy**

O deploy acontece automaticamente quando você faz push para `main` ou `master`:

```bash
# Faça suas alterações
git add .
git commit -m "feat: sua mensagem de commit"
git push
```

Ou force um deploy manual:
1. Vá em **Actions**
2. Selecione o workflow **Deploy to GitHub Pages**
3. Clique em **Run workflow**

---

## 🔧 Arquivos de Configuração

### `.github/workflows/deploy.yml`
Workflow do GitHub Actions que:
- ✅ Instala dependências
- ✅ Cria arquivo `.env` com as secrets
- ✅ Faz build do projeto
- ✅ Faz deploy no GitHub Pages

### `package.json`
- `"homepage": "."` - Configurado para funcionar no GitHub Pages

---

## 📊 Monitorar Deploy

Após fazer push:

1. Vá em **Actions** no GitHub
2. Veja o progresso do workflow
3. Quando completar, o site estará no ar!

**URL do site:** `https://SEU_USUARIO.github.io/findbus/`

---

## 🎯 Estrutura do Workflow

```yaml
1. Build Job:
   - Checkout do código
   - Setup Node.js 18
   - Instala dependências (npm ci)
   - Cria .env com secrets
   - Build do projeto
   - Upload do artifact

2. Deploy Job:
   - Deploy no GitHub Pages
   - URL do site disponível
```

---

## 🔒 Segurança das Secrets

✅ **Seguro:**
- Secrets são criptografadas pelo GitHub
- Não aparecem nos logs
- Apenas disponíveis durante o workflow
- Não podem ser lidas depois de salvas

❌ **NUNCA:**
- Commite o arquivo `.env`
- Exponha as API keys em código
- Compartilhe as secrets publicamente

---

## 🐛 Troubleshooting

### Build Falha
- Verifique se as secrets estão configuradas
- Veja os logs no Actions
- Confirme que o arquivo `.env` foi criado

### Site não carrega
- Verifique se GitHub Pages está habilitado
- Confirme que o source é "GitHub Actions"
- Aguarde alguns minutos após o deploy

### Erro 404
- Verifique o `homepage` no `package.json`
- Confirme o nome do repositório

---

## 📝 Comandos Úteis

```bash
# Ver status do git
git status

# Ver diferenças
git diff

# Ver histórico
git log --oneline

# Ver remote
git remote -v

# Fazer deploy
git add .
git commit -m "sua mensagem"
git push
```

---

## 🎉 Pronto!

Após seguir esses passos:
- ✅ Projeto no GitHub
- ✅ Secrets configuradas
- ✅ GitHub Pages habilitado
- ✅ Deploy automático funcionando

**Cada push para main/master fará um novo deploy automaticamente!** 🚀

---

## 📞 URLs Importantes

- **Repositório:** `https://github.com/SEU_USUARIO/findbus`
- **Actions:** `https://github.com/SEU_USUARIO/findbus/actions`
- **Site:** `https://SEU_USUARIO.github.io/findbus/`
- **Settings:** `https://github.com/SEU_USUARIO/findbus/settings`

---

**COMECE AGORA:** Siga o Passo 1 para criar o repositório! 🎯
