# One image for all three dev services (api, admin, web).
# Source code is bind-mounted by docker-compose.yml; only node_modules live in the image.
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/
COPY apps/admin/package.json apps/admin/
COPY apps/web/package.json apps/web/
COPY e2e/package.json e2e/

# Playwright's browsers are not needed inside the dev containers
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    MONGOMS_DISABLE_POSTINSTALL=1

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

CMD ["npm", "run", "dev:api"]
