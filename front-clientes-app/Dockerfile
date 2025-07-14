# Imagem base leve
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json antes de instalar
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia todo o código-fonte
COPY . .

# Expõe a porta padrão do Vite
EXPOSE 5173

# Comando padrão para rodar em modo dev
CMD ["npm", "run", "dev"]
