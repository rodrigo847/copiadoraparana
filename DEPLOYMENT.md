# Deploy (Hostinger + Next.js)

Este projeto usa Next.js em modo servidor (`next start`) com PM2. Nao usa export estatico (`out/`).

## 1) Preparar servidor

```bash
sudo apt-get update
sudo apt-get install -y nodejs npm nginx
sudo npm install -g pm2
```

## 2) Publicar codigo

```bash
cd /home/seu-usuario
git clone SEU_REPOSITORIO copiadora-parana-laser
cd copiadora-parana-laser
npm ci
npm run build
```

## 3) Variaveis de ambiente

```bash
cat > .env.production << EOF
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://copiadoraparana.com.br
EOF
```

## 4) Subir app com PM2

```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## 5) Configurar Nginx (proxy reverso)

Arquivo: `/etc/nginx/sites-available/copiadora-parana`

```nginx
server {
    listen 80;
    server_name copiadoraparana.com.br www.copiadoraparana.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /_next/static {
        proxy_pass http://localhost:3000/_next/static;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }
}
```

Ativar:

```bash
sudo ln -s /etc/nginx/sites-available/copiadora-parana /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 6) SSL

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d copiadoraparana.com.br -d www.copiadoraparana.com.br
```

## Comandos de manutencao

```bash
pm2 status
pm2 logs copiadora-parana-laser
pm2 restart copiadora-parana-laser
```
