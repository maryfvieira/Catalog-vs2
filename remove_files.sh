#!/bin/bash

echo "🔍 Verificando conflitos de merge..."
conflicts=$(git diff --name-only --diff-filter=U)

if [ -z "$conflicts" ]; then
  echo "✅ Nenhum conflito encontrado. Nada a fazer."
  exit 0
fi

echo "📁 Resolvendo conflitos mantendo a versão da branch 'dev'..."

# Loop pelos arquivos em conflito e assume versão da "dev"
for file in $conflicts; do
  echo "📄 Resolvendo: $file"
  git checkout --theirs -- "$file"
  git add "$file"
done

echo "📝 Commitando merge com versão da 'dev'..."
git commit -m "🔀 Merge automático: mantida versão da dev para conflitos"

echo "🚀 Enviando merge resolvido para o GitHub..."
git push origin main

echo "🎉 Conflitos resolvidos automaticamente com sucesso!"
