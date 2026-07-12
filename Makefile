.PHONY: build up down backend-check backend-test frontend-build frontend-lint

build:
	docker compose build

up:
	docker compose up

down:
	docker compose down

backend-check:
	docker compose run --rm backend python manage.py check

backend-test:
	docker compose run --rm backend python manage.py test

frontend-build:
	docker compose run --rm frontend npm run build

frontend-lint:
	docker compose run --rm frontend npm run lint
