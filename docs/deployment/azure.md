# Azure Deployment

## Recommended Architecture
- **Azure Virtual Machine** (B2s or larger) with Ubuntu 22.04
- **Azure Database for PostgreSQL - Flexible Server**
- **Azure Blob Storage** for file uploads
- **Azure DNS** for domain management
- **Azure Monitor** for health and logs

## VM Setup
1. Create a VM in a resource group, allow SSH, HTTP, and HTTPS.
2. Assign a public IP and configure Azure DNS A records.
3. SSH and install Docker:
```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2 git nginx certbot
sudo systemctl enable --now docker
```

## PostgreSQL Flexible Server
1. Create a Flexible Server with public access and firewall rule for the VM.
2. Create a database named `eduvision`.
3. Update `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql://user:pass@<server-name>.postgres.database.azure.com:5432/eduvision?schema=public
```

## Azure Blob Storage
1. Create a storage account and container (e.g. `uploads`).
2. Generate a SAS token or use account key.
3. Update `.env`:
```env
STORAGE_TYPE=s3
S3_ENDPOINT=https://<account>.blob.core.windows.net
S3_BUCKET=uploads
S3_ACCESS_KEY_ID=<account-name>
S3_SECRET_ACCESS_KEY=<account-key-or-sas>
STORAGE_BASE_URL=https://<account>.blob.core.windows.net/uploads
NEXT_PUBLIC_STORAGE_BASE_URL=https://<account>.blob.core.windows.net/uploads
```

## Deploy
```bash
git clone https://github.com/moeketsitsomo/EduVision-Web-.git eduvision
cd eduvision
cp .env.example .env
# edit .env
./scripts/deploy.sh
./scripts/init-ssl.sh eduvisionschools.co.za
```

## Monitoring
Enable Azure Monitor agent and configure alerts for CPU, memory, and availability.
