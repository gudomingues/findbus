# FindBus 🚌

Sistema de Informações de Transporte Público de São Paulo

[![Deploy to GitHub Pages](https://github.com/SEU_USUARIO/findbus/actions/workflows/deploy.yml/badge.svg)](https://github.com/SEU_USUARIO/findbus/actions/workflows/deploy.yml)

## 🎯 Sobre o Projeto

FindBus é uma aplicação web moderna para consultar informações em tempo real sobre o transporte público de São Paulo, utilizando a API Olho Vivo da SPTrans.

### Funcionalidades

- 🚍 **De Olho na Linha**: Localização dos ônibus ao longo do trajeto
- 🚏 **De Olho no Ponto**: Próximos ônibus chegando na parada
- 🚦 **De Olho na Via**: Velocidade média dos corredores viários
- 🗺️ **Mapas Interativos**: Visualização com Google Maps
- 🌙 **Tema Dark/Light**: Alternância de tema
- 📱 **Responsivo**: Funciona em desktop, tablet e mobile

## 🚀 Demo

Acesse: [https://gudomingues.github.io/findbus/](https://gudomingues.github.io/findbus/)

## 🛠️ Tecnologias

- **React 18** - Framework frontend
- **TypeScript** - Tipagem estática
- **Bootstrap 5** - UI Framework
- **Google Maps API** - Mapas interativos
- **Axios** - Cliente HTTP
- **Context API** - Gerenciamento de estado
- **GitHub Actions** - CI/CD
- **GitHub Pages** - Hospedagem

## 📋 Pré-requisitos

- Node.js 16+ 
- npm ou yarn
- Chaves de API:
  - API Olho Vivo (SPTrans)
  - Google Maps JavaScript API

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/findbus.git

# Entre na pasta
cd findbus

# Instale as dependências
npm install

# Copie o arquivo .env.example e configure suas chaves
cp .env.example .env

# Edite o .env com suas chaves de API
# REACT_APP_OLHOVIVO_TOKEN=sua_chave_aqui
# REACT_APP_GOOGLE_MAPS_API_KEY=sua_chave_aqui

# Inicie o servidor de desenvolvimento
npm start
```

O projeto estará rodando em `http://localhost:3000`

## 📦 Build para Produção

```bash
# Gerar build otimizado
npm run build

# A pasta /build conterá os arquivos prontos para deploy
```

## 🚀 Deploy Automático

O projeto usa GitHub Actions para deploy automático no GitHub Pages.

### Configuração:

1. Configure as secrets no GitHub:
   - `REACT_APP_OLHOVIVO_TOKEN`
   - `REACT_APP_GOOGLE_MAPS_API_KEY`

2. Habilite GitHub Pages nas configurações do repositório

3. Faça push para `main` - deploy automático!

Veja instruções detalhadas em [DEPLOY_GITHUB_PAGES.md](./DEPLOY_GITHUB_PAGES.md)

## 📚 Documentação

- [Deploy no GitHub Pages](./DEPLOY_GITHUB_PAGES.md)
- [Refatoração Completa](./REFATORACAO_COMPLETA.md)
- [Todas as Funcionalidades](./TODAS_FUNCIONALIDADES_IMPLEMENTADAS.md)

## 🏗️ Arquitetura

O projeto segue princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**:

```
src/
├── domain/              # Entidades e tipos do domínio
├── infrastructure/      # API, serviços externos
├── presentation/        # Componentes React, hooks
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   └── contexts/
└── shared/             # Utilitários, constantes
```

### Padrões Aplicados:
- ✅ SOLID
- ✅ DRY (Don't Repeat Yourself)
- ✅ KISS (Keep It Simple)
- ✅ YAGNI (You Aren't Gonna Need It)
- ✅ Defensive Programming

## 🎨 Features

- **Tema Dark/Light**: Alternância suave com persistência
- **Pins Personalizados**: Pins vermelhos para paradas, círculos azuis para veículos
- **Auto-atualização**: Dados atualizados automaticamente
- **Validação Robusta**: Tratamento defensivo de dados
- **Responsivo**: Design mobile-first

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes com coverage
npm test -- --coverage
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

Seu Nome
- GitHub: [@SEU_USUARIO](https://github.com/SEU_USUARIO)

## 🙏 Agradecimentos

- API Olho Vivo - SPTrans
- Google Maps Platform
- React Community

---

⭐ Se este projeto foi útil, considere dar uma estrela!
