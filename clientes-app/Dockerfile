# Use imagem base leve
FROM node:20-alpine

# Defina diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependência
COPY package*.json ./

# Instala dependências e ferramentas necessárias
RUN apk add --no-cache python3 make g++ \
  && npm install \
  && npm install --save-dev ts-node typescript @types/node

# Copie todo o código-fonte do projeto
COPY . .

# Exponha a porta usada pela aplicação
EXPOSE 3000

# ENTRYPOINT condicional: roda fixtures apenas se NODE_ENV=development
ENTRYPOINT sh -c 'if [ "$NODE_ENV" = "development" ]; then npm run fixtures; fi && npm run start:dev'
