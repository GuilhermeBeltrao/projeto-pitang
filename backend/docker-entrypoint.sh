#!/bin/sh
set -e

echo "Aguardando banco de dados..."
until npm run prisma:deploy; do
  echo "Banco indisponivel, tentando novamente em 2s..."
  sleep 2
done

echo "Executando seed..."
npm run prisma:seed

echo "Iniciando API..."
exec npm run start
