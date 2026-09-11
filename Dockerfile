ARG NODE_VERSION=22-alpine

# ─── Stage 1: dependencies ───────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS deps

WORKDIR /app
ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive

# ─── Stage 2: build ──────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS builder

WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

# ─── Stage 3: serve ──────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist        ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/vite.config.ts ./vite.config.ts
COPY --from=builder /app/src/app/routes ./src/app/routes

EXPOSE 4173

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:4173/ || exit 1

CMD ["yarn", "prod"]
