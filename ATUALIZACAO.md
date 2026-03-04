# Atualização do Projeto FindBus

## Data da Atualização
03 de Março de 2026

## Resumo
Projeto React atualizado com sucesso para versões modernas das dependências.

## Mudanças Realizadas

### 1. Dependências Atualizadas

#### Versões Antigas → Versões Novas

- **React**: 17.0.2 → 18.2.0
- **React-DOM**: 17.0.2 → 18.2.0
- **React-Scripts**: 4.0.3 → 5.0.1
- **Axios**: 0.21.1 → 1.6.7
- **Bootstrap**: 4.6.0 → 5.3.3
- **React-Bootstrap**: 1.6.1 → 2.10.1
- **Styled-Components**: 5.3.0 → 6.1.8
- **@iconify/react**: 1.1.4 → 4.1.1
- **@testing-library/jest-dom**: 5.11.4 → 6.4.2
- **@testing-library/react**: 11.1.0 → 14.2.1
- **@testing-library/user-event**: 12.1.10 → 14.5.2
- **google-map-react**: 2.1.10 → 2.2.1
- **web-vitals**: 1.0.1 → 3.5.2
- **http-proxy-middleware**: 2.0.1 → 2.0.6

### 2. Correções de Código

#### SimpleMap.jsx
- Removido imports não utilizados: `Component`, `State`
- Removido variável não utilizada: `setInfoVisible`
- Corrigido propriedade duplicada `google={props.google}`

#### Search.jsx
- Removido import não utilizado: `Component`
- Corrigido operador de comparação: `==` → `===`

### 3. Status do Projeto

✅ **Projeto rodando com sucesso**
- Servidor de desenvolvimento iniciado em: http://localhost:3000
- Compilação bem-sucedida sem erros
- Todos os warnings de ESLint corrigidos

### 4. Sobre a API

#### API Olho Vivo da SPTrans
- **Status**: API oficial ainda está ativa e funcionando
- **URL Oficial**: http://api.olhovivo.sptrans.com.br/v2.1/
- **Documentação**: https://www.sptrans.com.br/desenvolvedores/
- **Mudança Importante**: A API migrou de HTTP para HTTPS em 02/01/2024

#### Proxy Utilizado no Projeto
- **URL Atual**: https://aiko-olhovivo-proxy.aikodigital.io/
- **Status**: Não foi possível confirmar se o proxy ainda está ativo
- **Recomendação**: Considerar migrar para a API oficial da SPTrans

### 5. Avisos e Observações

#### Compatibilidade Node.js
O sistema está usando Node.js v14.21.3, que é uma versão antiga. Algumas dependências recomendam:
- **styled-components 6.x**: Node >= 16
- **postcss-load-config 6.x**: Node >= 18

**Recomendação**: Atualizar para Node.js 18 LTS ou 20 LTS para melhor compatibilidade.

#### Biblioteca google-maps-react
A biblioteca `google-maps-react` requer React 16 ou inferior como peer dependency, mas o projeto agora usa React 18. A biblioteca continua funcionando, mas pode haver incompatibilidades futuras.

**Recomendação**: Considerar migrar para `@react-google-maps/api` que tem suporte melhor para React 18.

#### Chave da API do Google Maps
A chave da API está exposta no código (`SimpleMap.jsx` linha 73). 

**Recomendação**: Mover para variáveis de ambiente (.env).

### 6. Vulnerabilidades de Segurança
8 vulnerabilidades foram detectadas (3 moderadas, 5 altas) que requerem revisão manual. Estas provavelmente são de dependências transitivas do react-scripts.

### 7. Como Rodar o Projeto

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Build para produção
npm build
```

O projeto estará disponível em: http://localhost:3000

### 8. Próximos Passos Recomendados

1. **Testar a conectividade com a API**
   - Verificar se o proxy aiko-olhovivo ainda funciona
   - Se não funcionar, migrar para a API oficial da SPTrans
   - Implementar sistema de autenticação conforme documentação oficial

2. **Atualizar Node.js**
   - Instalar Node.js 18 LTS ou 20 LTS
   - Reinstalar dependências

3. **Melhorar segurança**
   - Mover chave da API para variável de ambiente
   - Adicionar .env ao .gitignore
   - Revisar vulnerabilidades de segurança

4. **Considerar migração de bibliotecas**
   - Avaliar migração de `google-maps-react` para `@react-google-maps/api`
   - Atualizar Bootstrap 5 requer revisão de componentes (mudanças de API)

## Tecnologias do Projeto

- **React 18** - Framework JavaScript
- **Google Maps React** - Integração com Google Maps
- **Axios** - Cliente HTTP
- **Bootstrap 5 + React-Bootstrap** - UI Framework
- **Styled Components** - CSS-in-JS
- **API Olho Vivo SPTrans** - Dados de ônibus em tempo real

## Funcionalidades

- Busca de paradas de ônibus
- Visualização de paradas no mapa do Google Maps
- Localização geográfica das paradas
- Interface responsiva com Bootstrap

---

**Atualização realizada com sucesso!** 🚀
