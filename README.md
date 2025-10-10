# 💳 Carteira Digital Simplificada - API RESTful

<p align="center">
<a href="https://nestjs.com/" target="blank">
<img src="https://nestjs.com/img/logo_text.svg" width="150" alt="Nest Logo" />
</a>
<img height="50" width="60" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg">
</a>
</p>

## 📄 Descrição do Projeto
Esta é uma API RESTful desenvolvida com NestJS que simula uma Carteira Digital Simplificada. O projeto foi construído com foco em modularidade, segurança e manutenção futura, dividindo claramente as responsabilidades entre: User (Usuários), Account (Conta/Saldo) e History (Histórico de Transações).

## 🎯 Principais Funcionalidades
Módulo	Funcionalidade	Detalhes Técnicos
User	Criação e Autenticação de Usuários	Senhas armazenadas com hashing Argon2 para segurança.
Account	Gestão de Saldo	Criação automática de conta/saldo junto com o usuário.
Transaction	Transferências Seguras	Uso de Transações de Banco de Dados (Prisma $transaction) para garantir que o débito e o crédito ocorram de forma atômica.
History	Rastreabilidade de Operações	Registro detalhado de aberturas de conta e transferências.
Segurança	Autorização de Acesso	Implementação de JSON Web Tokens (JWT) com Passport para proteger rotas privadas.

Exportar para as Planilhas
A aplicação suporta uma funcionalidade de "Link Compartilhado" que adiciona um saldo inicial (R$100,00) na criação da conta.

## 🛠️ Tecnologias Utilizadas
Este projeto foi desenvolvido utilizando a seguinte stack:

Backend Framework: NestJS (Node.js)

Banco de Dados: PostgreSQL

ORM: Prisma

Containerização: Docker e Docker Compose

Segurança: Argon2 (Hashing de Senhas) e JWT (Autenticação)

## ⚙️ Como Executar o Projeto (Via Docker Compose)
A forma recomendada para executar este projeto é utilizando o Docker Compose, garantindo que a aplicação e o banco de dados iniciem corretamente em um ambiente isolado.

## 📋 Pré-requisitos
Você deve ter instalado na sua máquina:

Node.js (v20+)

Docker

Docker Compose

1. Configuração do Ambiente
Clone o repositório:

```Bash
git clone [(https://github.com/mario081/CarteiraDigital.git)]
cd carteira-digital-simplificada
````
Variáveis de Ambiente:

Crie um arquivo chamado .env na raiz do projeto.

Preencha-o com base nas variáveis esperadas pela aplicação, incluindo a URL de conexão com o PostgreSQL e a JWT_SECRET.

Exemplo de arquivo .env:

```
# Variáveis do Banco de Dados (configuradas no docker-compose)
DATABASE_URL="postgresql://root:root@postgres_db:5432/Carteira-Digital-db?schema=public"

# Variável de Segurança JWT
JWT_SECRET="SUA_CHAVE_SECRETA_MUITO_FORTE" 
# Use uma chave aleatória e forte.
```
2. Inicialização com Docker
Execute o comando abaixo para construir a imagem do NestJS e iniciar os serviços (app e postgres_db):

```Bash
docker-compose up --build -d
```
O --build garante que a imagem seja construída (usando seu Dockerfile) e o -d que rode em detached mode (em segundo plano).

3. Executando as Migrations (Automático)
No docker-compose.yml, o comando command: sh -c "npx prisma migrate deploy && npm run start:prod" garante que as migrations do Prisma sejam aplicadas ao banco de dados antes da aplicação NestJS iniciar, garantindo que o esquema esteja pronto.

4. Acesso à API
A aplicação estará disponível em: http:( //localhost:8080 )

## 🗺️ Endpoints da API
Acesse as rotas abaixo (utilizando ferramentas como Insomnia ou Postman) para testar a aplicação.

Rota	Método	Descrição	Requer JWT
users	POST	Cria um novo usuário e sua conta.	Não
auth/login	POST	Autentica o usuário e retorna o access_token.	Não
transactions/transfer	POST	Realiza uma transferência entre contas.	Sim
history	GET	Retorna o histórico de transações do usuário logado.	Sim
feature/privat	GET	Rota de teste para acesso privado (requer JWT).	Sim

Não se esqueça de incluir o access_token no cabeçalho Authorization (tipo Bearer) para acessar as rotas protegidas.
