#!/bin/bash

export HOST=http://localhost
export PORT=3000

npm run build
node dist/server.js &
SERVER_PID=$!

echo "⌛ Aguardando servidor iniciar..."
npx wait-on tcp:3000

echo "🚀 Executando testes Playwright..."
npx playwright test --reporter=list
TEST_RESULT=$?

echo "🛑 Encerrando servidor"
kill $SERVER_PID
wait $SERVER_PID

exit $TEST_RESULT