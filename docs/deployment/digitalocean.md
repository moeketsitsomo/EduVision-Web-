# DigitalOcean Deployment

## Droplet Setup
1. Create a Droplet with **Ubuntu 22.04** and at least **4 GB RAM / 2 vCPUs**.
2. Add your SSH key and choose a datacenter region close to your users.
3. Point your domain or subdomain to the Droplet IPv4 address:
   - `A  eduvisionschools.co.za  -> <DROPLET_IP>`
   - `CNAME  *.eduvisionschools.co.za  -> eduvisionschools.co.za`

## Use DigitalOcean Spaces for file storage (recommended)
1. Create a **Spaces** bucket in the same region.
2. Generate an **Spaces access key** in the DigitalOcean API section.
3. Set the following in `.env`:
```env
STORAGE_TYPE=s3
S3_ENDPOINT=https://<region>.digitaloceanspaces.com
S3_BUCKET=your-bucket
S3_ACCESS_KEY_ID=your-key
S3_SECRET_ACCESS_KEY=your-secret
STORAGE_BASE_URL=https://your-bucket.<region>.cdn.digitaloceanspaces.com
NEXT_PUBLIC_STORAGE_BASE_URL=https://your-bucket.<region>.cdn.digitaloceanspaces.com
```

## Deploy
```bash
git clone https://github.com/moeketsitsomo/EduVision-Web-.git eduvision
cd eduvision
cp .env.example .env
# edit .env with your database, JWT, domain and Spaces settings
./scripts/deploy.sh
./scripts/init-ssl.sh eduvisionschools.co.za
```

## Firewall
Open TCP ports `22`, `80`, and `443` in the DigitalOcean cloud firewall.

## Monitoring
Enable DigitalOcean Monitoring on the Droplet and add uptime alerts for ports 80/443.
