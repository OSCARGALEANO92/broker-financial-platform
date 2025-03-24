#!/bin/bash

echo "🚀 Iniciando despliegue..."

cd ~/broker-financial-platform || exit 1

echo "📥 Haciendo pull del repositorio..."
git pull origin master || exit 1

echo "📦 Instalando dependencias..."
npm install || exit 1

echo "⚙️ Generando build de producción..."
npm run build || exit 1

echo "🧹 Limpiando versión anterior..."
sudo rm -rf /var/www/html/homebridge/*

echo "📦 Copiando nuevo build al servidor web..."
sudo cp -r build/* /var/www/html/homebridge/

echo "🔁 Recargando Nginx..."
sudo systemctl reload nginx

echo "✅ Despliegue completado exitosamente en https://gestionhomebridge.com"
