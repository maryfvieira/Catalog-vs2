#!/bin/bash
set -e

echo "⌛ Esperando MongoDB autenticar..."
for i in {1..15}; do
  mongo "mongodb://user:123456@127.0.0.1:42069/curso_git?authSource=curso_git&replicaSet=test-rs" \
    --eval "db.stats()" > /dev/null 2>&1 && break
  echo "Tentativa $i: aguardando MongoDB autenticar..."
  sleep 1
done

echo "⌛ Verificando conexão com MongoDB e acesso à collection products..."

for i in {1..15}; do
  mongosh "mongodb://user:123456@127.0.0.1:42069/curso_git?authSource=curso_git&replicaSet=test-rs" \
    --quiet \
    --eval 'db.products.findOne()' > /dev/null 2>&1

  if [ $? -eq 0 ]; then
    echo "✅ Conexão com MongoDB e acesso à collection 'products' OK"
    break
  fi

  echo "Tentativa $i: aguardando MongoDB/autenticação/collection..."
  sleep 1
done

# Se não conseguiu conectar após 15 tentativas
if [ $? -ne 0 ]; then
  echo "❌ Falha ao conectar ao MongoDB ou acessar a collection 'products' após 15 tentativas"
  exit 1
fi

# Falhou após 15 tentativas
mongosh "$MONGO_URI" --quiet --eval "db.stats()" > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "❌ Falha ao conectar no MongoDB após 15 tentativas"
  exit 8
fi


echo "🔧 Buildando o projeto..."
npm run build
npx tsc-alias -v

echo "🚀 Iniciando servidor em segundo plano..."
node dist/server.js &

SERVER_PID=$!

echo "⏳ Aguardando rota de healthcheck..."
for i in {1..30}; do
  status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
  echo "Tentativa $i - Status HTTP: $status"
  if [ "$status" -eq 200 ]; then
    echo "✅ Healthcheck OK"
    break
  fi
  sleep 1
done

if [ "$status" -ne 200 ]; then
  echo "❌ Healthcheck falhou após 30 tentativas"
  kill $SERVER_PID
  exit 7
fi

echo "🌐 Tentando acessar diretamente a rota de healthcheck:"
curl -v http://localhost:3000/health || true

echo "🧪 Executando testes Playwright..."
npm run test:e2e

# Encerra o servidor
kill $SERVER_PID
