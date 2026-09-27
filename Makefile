.PHONY: help install dev dev-down test test-e2e prod prod-down seed logs

help:            ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-12s %s\n", $$1, $$2}'

install:         ## Install all workspace dependencies locally
	npm install

dev:             ## Start the dev stack in Docker (hot reload)
	docker compose up --build

dev-down:        ## Stop the dev stack
	docker compose down

seed:            ## Load the demo barber menu into the dev database
	docker compose exec api npm run seed:demo -w apps/api

test:            ## Run unit, component and API e2e tests
	npm test

test-e2e:        ## Run Playwright browser tests (stack must be running)
	npm run test:e2e

prod:            ## Build and start the production stack
	docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build

prod-down:       ## Stop the production stack
	docker compose -f docker-compose.prod.yml --env-file .env.production down

logs:            ## Tail dev logs
	docker compose logs -f
