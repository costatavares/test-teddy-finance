# test-teddy-finance

Este projeto está dividido em duas partes:

## 📁 Estrutura do Repositório

- **clientes-app**  
  Backend em NestJS/TypeORM responsável pela API REST de clientes, autenticação e fixtures.

- **front-clientes**  
  Frontend em React + Vite + TypeScript + Tailwind CSS, consumindo a API e oferecendo telas de listagem, criação, edição e exclusão de clientes.

---

## 🚀 Como Rodar

1. **Backend**  
   

### 1 - Gerar chaves privada e publica 
    ```
    openssl genrsa -out private.pem 2048
    openssl rsa -in private.pem -out public.pem
      
    Colar as chaves no 

    JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----"
    JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----"

    criar o arquivo .env copiar o .env.exemple para .env no backend 
  
    cd clientes-app  
    docker-compose up --build
    
    ```

2. **FrontEnd**  
   ```bash
   cd front-clientes-app

   npm run dev
  ```  
   

### 🔑 Credenciais de Acesso (Front-end)

  Para testar a aplicação, use as credenciais padrão já carregadas pelas fixtures:
  - http://localhost:5173/
  - **E-mail:** admin@user.com  
  - **Senha:** Senha2024@  

  Em seguida, acesse a tela de login no front-end e insira esses dados para autenticar e navegar pelo sistema. 
  
     
   


# 🛠️ Tecnologias
- Backend: NestJS, TypeORM, PostgreSQL (ou outro BD), ts‑node for fixtures
- Frontend: React, Vite, TypeScript, Tailwind CSS, Zustand (state management)