# LeadFlow CRM — Client Lead Management System

A full-stack, modern CRM application to capture, track, and convert website leads. Built with **React**, **Node.js + Express**, and **MongoDB**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Admin Login | Secure JWT-based authentication for admin access |
| 📋 Lead List | View all leads with Name, Email, Source, and Status |
| 🔄 Status Management | Change status between `New`, `Contacted`, `Converted` |
| 📝 Notes & Timeline | Log call notes and interaction history per lead |
| 📅 Follow-ups | Schedule and check off follow-up tasks per lead |
| 🌐 Website Webhook | Public API endpoint to capture leads from any website |
| 🔍 Search & Filter | Filter by status, source, and sort by date or name |
| 📊 Metrics Dashboard | Summary cards showing lead pipeline counts |
| 📖 Integration Docs | Built-in guide with copy-able curl & JS code snippets |

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Vanilla CSS, React Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Auth**: JWT (JSON Web Tokens) + bcryptjs

---

## 📁 Project Structure

```
Client Lead Management System/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── models/
│   │   ├── Lead.js          # Lead schema (name, email, source, status, notes, followups)
│   │   └── User.js          # Admin user schema with bcrypt password hashing
│   ├── routes/
│   │   ├── auth.js          # Login, Setup Admin, and /me endpoints
│   │   └── leads.js         # CRUD, status change, notes, follow-ups
│   ├── .env.example         # Environment variable template
│   ├── package.json
│   └── server.js            # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx    # Lead list with metrics, filters, and search
    │   │   ├── LeadDetails.jsx  # Slide-over drawer with status, notes, follow-ups
    │   │   ├── Login.jsx        # Admin login & first-time setup screen
    │   │   └── WebhookDocs.jsx  # Integration guide with copy-able code snippets
    │   ├── App.jsx              # Root component with auth state and routing
    │   ├── index.css            # Premium dark mode design system
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB running locally OR a MongoDB Atlas URI

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "Client Lead Management System"
```

### 2. Setup & Run Backend

```bash
cd backend
cp .env.example .env
# Edit .env and configure MONGODB_URI, JWT_SECRET
npm install
npm start
# Server runs on http://localhost:5050
```

### 3. Setup & Run Frontend

```bash
cd frontend
npm install
npm run dev
# App opens at http://localhost:5173
```

---

## 🔑 First-Time Admin Setup

On first launch, click **"First time running the app? Setup Admin"** on the login page to register your admin account. Only **one** admin account can be created this way.

> **Default credentials for demo** (if already set up):
> - Email: `aghara@gmail.com`
> - Password: `Admin@1234`

---

## 🌐 Website Integration (Webhook)

Send leads from any external website contact form to your CRM automatically:

```bash
curl -X POST "http://localhost:5050/api/leads" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "source": "Portfolio Contact Form",
    "message": "I am interested in your services."
  }'
```

| Field | Type | Required |
|---|---|---|
| `name` | String | ✅ Yes |
| `email` | String | ✅ Yes |
| `source` | String | Optional |
| `message` | String | Optional |

---

## 🔒 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/setup-admin` | Public | Create first admin account |
| POST | `/api/auth/login` | Public | Login and get JWT token |
| GET | `/api/auth/me` | 🔐 Admin | Get current admin profile |

### Leads
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/leads` | Public | Submit a new lead (webhook) |
| GET | `/api/leads` | 🔐 Admin | List leads with filters & search |
| GET | `/api/leads/:id` | 🔐 Admin | Get single lead detail |
| PATCH | `/api/leads/:id/status` | 🔐 Admin | Update lead status |
| POST | `/api/leads/:id/notes` | 🔐 Admin | Add a note to a lead |
| POST | `/api/leads/:id/followups` | 🔐 Admin | Schedule a follow-up task |
| PATCH | `/api/leads/:id/followups/:fid` | 🔐 Admin | Toggle follow-up completion |
| DELETE | `/api/leads/:id` | 🔐 Admin | Delete a lead |

---

## 📜 License

MIT — Built for the Internship Project Deliverable.
