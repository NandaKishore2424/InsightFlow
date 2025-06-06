<<<<<<< HEAD
# InsightFlow - Customer Feedback Intelligence Dashboard

A full-stack application for collecting, analyzing, and visualizing customer feedback.

## Project Structure

- `/frontend-svelte` - Svelte frontend application
- `/frontend-react` - React (CRA) frontend application
- `/backend` - Node.js and Express REST API
- `/ml-service` - Python Flask API for sentiment analysis

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend (Svelte)

```bash
cd frontend-svelte
npm install
npm run dev
```

### Frontend (React)

```bash
cd frontend-react
npm install
npm start
```

### ML Service

```bash
cd ml-service
# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

## Database Setup

1. Create a PostgreSQL database named "insightflow"
2. Run the schema file in backend/src/db/schema.sql
=======
# Node Express template project

This project is based on a GitLab [Project Template](https://docs.gitlab.com/ee/user/project/#create-a-project-from-a-built-in-template).

Improvements can be proposed in the [original project](https://gitlab.com/gitlab-org/project-templates/express).

## CI/CD with Auto DevOps

This template is compatible with [Auto DevOps](https://docs.gitlab.com/ee/topics/autodevops/).

If Auto DevOps is not already enabled for this project, you can [turn it on](https://docs.gitlab.com/ee/topics/autodevops/#enable-or-disable-auto-devops) in the project settings.

### Developing with Gitpod

This template has a fully-automated dev setup for [Gitpod](https://docs.gitlab.com/ee/integration/gitpod.html).

If you open this project in Gitpod, you'll get all Node dependencies pre-installed.
>>>>>>> 451d11f8285b8a43cd344674bee085149f97724b
