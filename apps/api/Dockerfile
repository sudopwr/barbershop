# Production image for the API. Build from the repository root:
#   docker build -f apps/api/Dockerfile -t barbershop-api .

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/
COPY apps/admin/package.json apps/admin/
COPY apps/web/package.json apps/web/
COPY e2e/package.json e2e/
ENV MONGOMS_DISABLE_POSTINSTALL=1 PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
RUN if [ -f package-lock.json ]; then npm ci -w apps/api; else npm install -w apps/api; fi

FROM deps AS build
COPY apps/api apps/api
RUN npm run build -w apps/api

FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/
COPY apps/admin/package.json apps/admin/
COPY apps/web/package.json apps/web/
COPY e2e/package.json e2e/
RUN if [ -f package-lock.json ]; then npm ci -w apps/api --omit=dev; else npm install -w apps/api --omit=dev; fi \
  && mkdir -p apps/api/node_modules \
  && npm cache clean --force

FROM node:22-alpine AS runtime
ENV NODE_ENV=production PORT=4000 HOST=0.0.0.0
WORKDIR /app
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=prod-deps --chown=node:node /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build --chown=node:node /app/apps/api/dist ./apps/api/dist
COPY --chown=node:node apps/api/package.json ./apps/api/package.json
WORKDIR /app/apps/api
USER node
EXPOSE 4000
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4000/api/health || exit 1
CMD ["node", "dist/server.js"]
