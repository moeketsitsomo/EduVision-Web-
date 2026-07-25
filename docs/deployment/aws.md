# AWS Deployment

## Recommended Architecture
- **EC2** `t3.medium` or larger running Ubuntu 22.04
- **RDS PostgreSQL 16** for managed database
- **S3** bucket for file uploads
- **Application Load Balancer** (optional) for HTTPS and scaling
- **Route 53** for DNS

## EC2 Setup
1. Launch an EC2 instance in a public subnet with a security group allowing `22`, `80`, `443`.
2. Allocate an Elastic IP and create Route 53 A records.
3. SSH into the instance:
```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2 git nginx certbot
sudo systemctl enable --now docker
```

## RDS
1. Create an RDS PostgreSQL 16 instance.
2. Set the username, password, and database name.
3. Copy the endpoint and update `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql://user:pass@<rds-endpoint>:5432/eduvision?schema=public
```

## S3 Bucket
1. Create an S3 bucket (e.g. `eduvision-uploads`).
2. Create an IAM user with `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`.
3. Update `.env`:
```env
STORAGE_TYPE=s3
S3_ENDPOINT=https://s3.<region>.amazonaws.com
S3_BUCKET=eduvision-uploads
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_REGION=<region>
STORAGE_BASE_URL=https://eduvision-uploads.s3.<region>.amazonaws.com
NEXT_PUBLIC_STORAGE_BASE_URL=https://eduvision-uploads.s3.<region>.amazonaws.com
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

## Backup
Use RDS automated backups and AWS Backup for S3.
