ARG NODE_VERSION=22-alpine

# ─── Stage 1: dependencies ───────────────────────────────────────────────────
# Устанавливаем зависимости отдельным слоем — кэш инвалидируется только
# при изменении package.json / yarn.lock, не при изменении исходников.
FROM node:${NODE_VERSION} AS deps

WORKDIR /app
ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive

# ─── Stage 2: build ──────────────────────────────────────────────────────────
# VITE_* переменные встраиваются в бандл на этапе сборки.
# Передаются через build-args в docker-compose (см. docker-compose.yml).
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
# vite.config.ts грузит tanstackRouter(), а тот на старте сканирует routesDirectory —
# без этой папки `vite preview` не упадёт, но будет сыпать ENOENT в логи при каждом запуске.
COPY --from=builder /app/src/app/routes ./src/app/routes

EXPOSE 4173

# localhost на Alpine/musl резолвится в ::1 раньше 127.0.0.1, а сервер слушает только
# IPv4 (0.0.0.0) — с "localhost" healthcheck никогда не проходит, несмотря на рабочее приложение.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:4173/ || exit 1

CMD ["yarn", "prod"]
