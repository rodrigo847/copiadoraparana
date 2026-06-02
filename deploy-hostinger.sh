#!/bin/bash

# 🚀 Script de Deploy Copiadora Paraná Laser - Hostinger
# Copie e cole os comandos abaixo no SSH da Hostinger

echo "=========================================="
echo "Deploy Copiadora Paraná Laser - Hostinger"
echo "=========================================="

# ✅ PASSO 1: Criar pasta do projeto
echo ""
echo "📁 Criando pasta do projeto..."
mkdir -p ~/copiadora-parana-laser
cd ~/copiadora-parana-laser

# ✅ PASSO 2: Fazer upload dos arquivos
# (Você fará isso via SCP, FTP ou Git. Exemplo com Git abaixo)
echo ""
echo "📤 Upload: Cole os arquivos do projeto aqui"
echo "   Opção 1: Via FTP/SCP - faça upload manualmente"
echo "   Opção 2: Via Git - descomente a linha abaixo:"
# git clone SEU_REPOSITORIO_GITHUB .

# ✅ PASSO 3: Instalar dependências Node.js
echo ""
echo "📦 Instalando dependências..."
npm ci

# ✅ PASSO 4: Build da aplicação
echo ""
echo "🔨 Fazendo build..."
npm run build

# ✅ PASSO 5: Criar arquivo .env.production
echo ""
echo "⚙️  Criando .env.production..."
cat > .env.production << EOF
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://copiadoraparanalaser.com.br
EOF

# ✅ PASSO 6: Instalar PM2 globalmente (se não estiver)
echo ""
echo "🔄 Configurando PM2..."
npm install -g pm2 2>/dev/null || echo "PM2 já está instalado"
pm2 startup > /dev/null 2>&1
pm2 save > /dev/null 2>&1

# ✅ PASSO 7: Parar qualquer instância anterior
echo ""
echo "🛑 Parando instâncias anteriores..."
pm2 delete copiadora-parana-laser 2>/dev/null || echo "Nenhuma instância anterior"

# ✅ PASSO 8: Iniciar com PM2
echo ""
echo "✅ Iniciando aplicação com PM2..."
pm2 start ecosystem.config.js --env production
pm2 save

# ✅ PASSO 9: Status
echo ""
echo "📊 Status da aplicação:"
pm2 status

# ✅ PASSO 10: Testar localmente
echo ""
echo "🧪 Testando localmente (porta 3000)..."
curl http://localhost:3000 > /dev/null 2>&1 && echo "✅ Aplicação respondendo na porta 3000!" || echo "❌ Erro ao conectar"

# ✅ PASSO 11: Ver logs
echo ""
echo "📋 Logs da aplicação:"
pm2 logs copiadora-parana-laser --lines 10

echo ""
echo "=========================================="
echo "✅ Deploy concluído!"
echo "=========================================="
echo ""
echo "📌 Próximos passos:"
echo "1. Configure Nginx (DEPLOYMENT.md)"
echo "2. Configure SSL com Let's Encrypt"
echo "3. Teste: https://copiadoraparanalaser.com.br"
echo ""
echo "📞 Suporte:"
echo "   - Logs: pm2 logs copiadora-parana-laser"
echo "   - Status: pm2 status"
echo "   - Reiniciar: pm2 restart copiadora-parana-laser"
echo "   - Parar: pm2 stop copiadora-parana-laser"
