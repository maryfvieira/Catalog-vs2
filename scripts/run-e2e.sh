#!/bin/bash
set -e

MONGO_URI="mongodb://user:123456@127.0.0.1:42069/curso_git?authSource=curso_git&replicaSet=test-rs"

echo "⌛ Esperando MongoDB autenticar..."
for i in {1..15}; do
  echo "Tentativa $i: testando autenticação com MongoDB..."

  OUTPUT=$(mongo "$MONGO_URI" --quiet --eval "db.stats()" 2>&1)
  EXIT_CODE=$?

  if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Conexão com MongoDB autenticada com sucesso"
    break
  else
    echo "⚠️  Falha na autenticação MongoDB (tentativa $i)"
    echo "↪️  Saída:"
    echo "$OUTPUT"
    sleep 1
  fi
done

if [ $EXIT_CODE -ne 0 ]; then
  echo "❌ Falha ao autenticar no MongoDB após 15 tentativas"
  echo "‼️ Última saída do mongo:"
  echo "$OUTPUT"
  exit 2
fi

echo "⌛ Verificando conexão com MongoDB e acesso à collection 'products'..."
for i in {1..15}; do
  echo "Tentativa $i: testando acesso à collection..."

  OUTPUT=$(mongosh "$MONGO_URI" --quiet --eval "db.products.findOne()" 2>&1)
  EXIT_CODE=$?

  if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Acesso à collection 'products' confirmado"
    break
  else
    echo "⚠️  Falha ao acessar a collection 'products' (tentativa $i)"
    echo "↪️  Saída:"
    echo "$OUTPUT"
    sleep 1
  fi
done

if [ $EXIT_CODE -ne 0 ]; then
  echo "❌ Falha ao acessar collection 'products' após 15 tentativas"
  echo "‼️ Última saída do mongosh:"
  echo "$OUTPUT"
  exit 3
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

echo "🛑 Finalizando servidor"
kill $SERVER_PID
