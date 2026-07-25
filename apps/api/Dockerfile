# syntax=docker/dockerfile:1
FROM node:20-slim AS builder
WORKDIR /app

# Native dependencies (bcrypt, Prisma, sharp) need build tools and OpenSSL.
RUN apt-get update && apt-get install -y python3 make g++ openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY apps/api/package*.json apps/api/
COPY apps/web/package*.json apps/web/
RUN npm ci --legacy-peer-deps

COPY apps/api/prisma ./apps/api/prisma
COPY apps/api/tsconfig*.json ./apps/api/
COPY apps/api/src ./apps/api/src

RUN npm run db:generate
RUN npm run build --workspace=@eduvision/api

FROM node:20-slim AS runner
WORKDIR /app

# Prisma engines require OpenSSL at runtime.
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json apps/api/
COPY --from=builder /app/apps/api/dist apps/api/dist
COPY --from=builder /app/apps/api/prisma apps/api/prisma

EXPOSE 4000
CMD ["node", "apps/api/dist/src/main.js"]
