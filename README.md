# EaseCook

EaseCook is a full-stack meal planning application designed to help users organize recipes, plan meals, manage pantry
ingredients, and generate shopping lists.

## Project Goals

- Build a portfolio-ready full-stack web application with a clean architecture.
- Practice backend API design with Django REST Framework.
- Practice frontend development with React and TypeScript.
- Use PostgreSQL and Docker to create a reproducible local development environment.
- Add automated tests to improve reliability and maintainability.

## Core Features

- User authentication and profile preferences.
- Recipe and ingredient management.
- Meal planning by date and meal type.
- Pantry ingredient tracking.
- Shopping list generation based on planned meals.

## Tech Stack

- Backend: Python, Django, Django REST Framework
- Frontend: React, TypeScript, Vite
- Database: PostgreSQL
- Development Environment: Docker Compose
- Testing: Django TestCase, pytest, Vitest

## Development Status

This project is being rebuilt step by step as a portfolio project for junior software engineer interviews.

## Local Demo

Start the database and services:

```bash
docker compose up
```

Run migrations:

```bash
docker compose run --rm backend python manage.py migrate
```

Create demo data:

```bash
make seed-demo
```

Demo account:

```text
Username: demo_user
Password: DemoPass123!
```

Local URLs:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- API Docs: http://localhost:8000/api/docs/

## Interview Demo Flow

1. Sign in with the demo account.
2. Open Recipes and review recipe ingredients.
3. Open Meal Plan and check scheduled meals.
4. Generate a shopping list from a meal plan.
5. Open Pantry to show available ingredients.
6. Open Shopping to review generated items.
