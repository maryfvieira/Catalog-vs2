Antes de executar o docker-compose dar permissao para:
- keyfile
> chmod 400 ./mongo-keyfile/keyfile 
- init.js
> chmod +x ./mongo-init/init
Depois é só executar o docker-compose
> docker-compose up -d