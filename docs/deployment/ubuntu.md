# Ubuntu Server Deployment

## Requirements
- Ubuntu 22.04 LTS or 24.04 LTS
- 2 vCPUs, 4 GB RAM, 20 GB SSD minimum
- Docker Engine 24+ and Docker Compose v2
- Ports 80 and 443 open
- A domain pointing to the server IP

## Steps

1. SSH into your server and update packages:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-v2 nginx certbot python3-certbot-nginx git
sudo systemctl enable --now docker
```

2. Clone the repository:
```bash
git clone https://github.com/moeketsitsomo/EduVision-Web-.git eduvision
cd eduvision
```

3. Configure environment variables:
```bash
cp .env.example .env
nano .env
```
Set `POSTGRES_PASSWORD`, `JWT_SECRET`, `COOKIE_DOMAIN`, `STORAGE_BASE_URL`, `EMAIL_*`, and `NEXT_PUBLIC_STORAGE_BASE_URL`.

4. Start the production stack:
```bash
./scripts/deploy.sh
```

5. Obtain SSL certificate:
```bash
./scripts/init-ssl.sh yourdomain.com
```

6. Verify:
```bash
curl https://yourdomain.com/api/health
```

Use `./scripts/migrate.sh` to apply migrations and `./scripts/backup.sh` to run a manual backup.
