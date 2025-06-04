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
