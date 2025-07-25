#!/bin/bash
set -e

echo "executando bash..."

echo "⌛ Esperando MongoDB autenticar..."
for i in {1..15}; do
  mongo "mongodb://user:123456@localhost:42069/curso_git?authSource=curso_git&replicaSet=test-rs" \
    --eval "db.stats()" > /dev/null 2>&1 && break
  echo "Tentativa $i: aguardando MongoDB autenticar..."
  sleep 1
done

export HOST=http://localhost
export PORT=3000

npm run build
node dist/server.js &
SERVER_PID=$!

echo "⌛ Aguardando rota de healthcheck..."
for i in {1..30}; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$HOST:$PORT/health")
  if [ "$status" -eq 200 ]; then
    echo "✅ Healthcheck OK"
    break
  fi
  echo "Tentativa $i: aguardando..."
  sleep 1
done

if [ "$status" -ne 200 ]; then
  echo "❌ Healthcheck falhou após 30s"
  echo "🛑 Encerrando servidor"
  kill $SERVER_PID
  wait $SERVER_PID
  exit 1
fi

echo "🚀 Executando testes Playwright..."
npx playwright test --reporter=list
TEST_RESULT=$?

echo "🛑 Encerrando servidor"
kill $SERVER_PID
wait $SERVER_PID

exit $TEST_RESULT
