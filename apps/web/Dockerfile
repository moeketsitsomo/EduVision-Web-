# syntax=docker/dockerfile:1
FROM node:20-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY apps/web/package*.json apps/web/
COPY apps/api/package*.json apps/api/
RUN npm ci

COPY apps/web/next.config.mjs apps/web/postcss.config.mjs apps/web/components.json apps/web/tsconfig.json ./apps/web/
COPY apps/web/src ./apps/web/src

# Internal API hostname used by the Next.js server for SSR and /api rewrites.
ENV API_URL=http://api:4000
ENV NEXT_PUBLIC_API_URL=

RUN npm run build --workspace=web

FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Next.js standalone output is self-contained.
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000
CMD ["node", "apps/web/server.js"]
