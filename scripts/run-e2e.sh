#!/bin/bash

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
