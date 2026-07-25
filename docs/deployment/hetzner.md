# Hetzner Cloud Deployment

## Server Setup
1. Create a **CX21** or larger Hetzner Cloud server (4 GB RAM recommended).
2. Choose **Ubuntu 22.04** as the image.
3. Add your SSH key and assign a public IPv4 address.
4. Configure DNS A records and a wildcard A/AAAA record to the server IP.

## Optional: Hetzner Storage Box for backups
Mount a Hetzner Storage Box to `/backups`:
```bash
sudo mkdir /backups
sudo mount -t cifs //<storage-box-ip>/backup /backups -o username=<user>,password=<pass>
```
Update `docker-compose.prod.yml` to bind `/backups` from the host.

## Deploy
```bash
ssh root@<server-ip>
apt update && apt install -y docker.io docker-compose-v2 git nginx certbot
systemctl enable --now docker
git clone https://github.com/moeketsitsomo/EduVision-Web-.git eduvision
cd eduvision
cp .env.example .env
# edit .env
./scripts/deploy.sh
./scripts/init-ssl.sh eduvisionschools.co.za
```

## Firewall
Use `ufw` or Hetzner firewall to allow `22`, `80`, and `443`.
