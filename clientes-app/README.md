para rodar o sistema 
# 1 - Gerar chaves privada e publica 
```
 openssl genrsa -out private.pem 2048
 openssl rsa -in private.pem -out public.pem
```  
Colar as chaves no 

JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----"

criar o arquivo .env copiar o .env.exemple para .env


# 2- Start app   realizada build docker 
```
docker-compose build 
```

# Criar CRUD para modulo
```
nest generate resource <nome-módulo>
```

docker exec -it <container_id> sh


# reconstrução completa:
```
docker-compose down --volumes --remove-orphans
docker-compose up --build
```


## 1. Ver logs em tempo real

```
docker logs -f nest_cliente_api
```


# Login para front cira usuário automaticamente 
```
usario : admin@user.com
pass: Senha2024@
```

## obs:
```
Todos os dados serão gerados automaticamente tanto o cliente como usurio 
pelo  arquivo /clientes-app/src/fixtures/load-fixtures.ts
configurado no dockerfile 

# ENTRYPOINT condicional: roda fixtures apenas se NODE_ENV=development
ENTRYPOINT sh -c 'if [ "$NODE_ENV" = "development" ]; then npm run fixtures; fi && npm run start:dev'

```
