# ===================================================================
# STAGE 1: BUILD - Cria o código compilado e instala todas as dependências
# ===================================================================
# Usamos uma imagem Node.js completa, pois precisamos do 'npm' e ferramentas de build
FROM node:20-alpine AS build

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de configuração de dependências
# Isso permite que o Docker use o cache de camadas de forma eficiente
COPY package.json package-lock.json ./

# Instala todas as dependências (dev e prod)
# O ambiente Alpine é muito leve, mas requer o 'git' para algumas dependências
RUN npm install

# Copia todo o código-fonte
COPY . .

# Roda o comando de build do NestJS (cria a pasta 'dist')
# De acordo com seu package.json: "build": "nest build"
RUN npx prisma generate
RUN npm run build


# ===================================================================
# STAGE 2: PRODUCTION - Cria a imagem final (leve e de produção)
# ===================================================================
# Usamos uma imagem Node.js Alpine (mais leve) para o ambiente de execução
FROM node:20-alpine AS production

# Define o diretório de trabalho
WORKDIR /app

# Variável de ambiente crucial para o NestJS/Node em produção
ENV NODE_ENV=production

# A porta que sua aplicação NestJS deve escutar (geralmente 3000)
# Se você configurou uma porta diferente no seu 'main.ts', mude aqui
EXPOSE 3000

# 1. Copia apenas as dependências de *produção* do estágio de build
# Fazemos isso para não ter que rodar 'npm install --production' de novo
COPY --from=build /app/node_modules ./node_modules

# 2. Copia o código compilado (a pasta 'dist') do estágio de build
COPY --from=build /app/dist ./dist

# 3. Copia arquivos essenciais de configuração para a execução
COPY package.json ./

# Comando que será executado quando o contêiner iniciar
# De acordo com seu package.json: "start:prod": "node dist/main"
CMD [ "npm", "run", "start:prod" ]