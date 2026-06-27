# GrievSetu 

**AI-Powered Citizen Grievance Management System**

GrievSetu is a full-stack web application that enables citizens to submit grievances (with text and images) and uses deep learning models to automatically classify, prioritize, and route them to the appropriate government departments.
An AI-powered grievance management system designed to address the growing challenges associated with civic complaint redressal in India.

## Architecture

```
GrievSetu/
├── frontend/          → Citizen-facing React (Vite) app
├── admin-frontend/    → Admin panel React (Vite) app
├── backend/           → FastAPI backend (user + admin APIs)
└── model-service/     → ML inference service (Hugging Face Spaces)
```

## AI Models

| Model | Type | Purpose | Size |
|-------|------|---------|------|
| **BiLSTM** | Text Classification | Categorizes grievance text | 4.5 MB |
| **CBAM** | Image Classification | Categorizes grievance images | 1.8 MB |

**Categories**: Electricity, Road/Infrastructure, Sanitation, Water Supply

## Tech Stack

- **Frontend**: React 19, Vite, Vanilla CSS
- **Admin Panel**: React, Vite
- **Backend**: FastAPI, SQLAlchemy, PyMySQL
- **Database**: MySQL (production) / SQLite (development fallback)
- **ML**: TensorFlow/Keras (BiLSTM + CBAM models)
- **Auth**: JWT (PyJWT)

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL (optional — falls back to SQLite)

### Backend
```bash
cd backend
cp .env.example .env        # Edit with your DB credentials
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend (User)
```bash
cd frontend
npm install
npm run dev                  
```

### Admin Frontend
```bash
cd admin-frontend
npm install
npm run dev                  # Runs on http://localhost:5174
```

## Key Features

- **Citizens**: Submit grievances (text + image), track status, notifications, profile management
- **Admin**: View all grievances, update status, escalate, export to Excel, send notifications
- **AI Pipeline**: Automatic category classification, priority assignment, department routing
- **Conflict Detection**: Flags cases where text and image models disagree

## Team
Harsh Varma
Kushal Gupta
Aman Rathore
Sudhanshu Kumar

## Mentor
Dr. Pranshu CBS Negi
