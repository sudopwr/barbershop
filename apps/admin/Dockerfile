# Production image for the admin app: static build served by nginx, which also
# proxies /api to the API container. Build from the repository root:
#   docker build -f apps/admin/Dockerfile -t barbershop-admin .

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/
COPY apps/admin/package.json apps/admin/
COPY apps/web/package.json apps/web/
COPY e2e/package.json e2e/
ENV MONGOMS_DISABLE_POSTINSTALL=1 PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
RUN if [ -f package-lock.json ]; then npm ci -w apps/admin; else npm install -w apps/admin; fi
COPY apps/admin apps/admin
# VITE_* values are baked in at build time — pass them as build args
ARG VITE_API_URL=
ARG VITE_CURRENCY=INR
ARG VITE_LOCALE=en-IN
ARG VITE_APP_NAME="Barber Shop Admin"
ARG VITE_WEBSITE_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL VITE_CURRENCY=$VITE_CURRENCY VITE_LOCALE=$VITE_LOCALE \
    VITE_APP_NAME=$VITE_APP_NAME VITE_WEBSITE_URL=$VITE_WEBSITE_URL
RUN npm run build -w apps/admin

FROM nginx:1.27-alpine AS runtime
COPY docker/nginx/spa.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/apps/admin/dist /usr/share/nginx/html
ENV API_UPSTREAM=http://api:4000
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1/healthz || exit 1
