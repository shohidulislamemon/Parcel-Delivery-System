# ExcelBD Parcel Delivery System

A production-ready backend for managing parcels end-to-end — create parcels, assign to delivery agents, update statuses, and let customers track via a public tracking code.

> **Demo & Docs**
> - 📹 Video: https://drive.google.com/file/d/1YruyipAYwnM1o_qnDHnNYSWv3cHfrmWD/view?usp=sharing  
> - 📄 Project Documents: https://github.com/shohidulislamemon/Parcel-Delivery-System/tree/main/doccuments  
> - 🔗 API Docs (Postman): https://documenter.getpostman.com/view/40095994/2sB3BEoVsq

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture at a Glance](#architecture-at-a-glance)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Project Scripts](#project-scripts)
- [Folder Structure](#folder-structure)
- [Core Flows](#core-flows)
- [API Overview](#api-overview)
- [Seed / Demo Users](#seed--demo-users)
- [Deployment Notes](#deployment-notes)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Author](#author)

---

## Features
- **Role-Based Access Control (RBAC)**: Admin, Agent, Customer
- **Parcels**: create, update, assign/unassign, status lifecycle (created → picked → in-transit → delivered/failed/returned)
- **Tracking**: public endpoint by **tracking code**
- **Search & Filter**: list parcels by status/agent/date with pagination
- **Reports**: CSV export (if enabled)
- **Email notifications**: via SMTP (optional)

> ❌ Not in this version: real-time tracking (WebSockets), route optimization, Docker.

---

## Tech Stack
- **Runtime**: Node.js (Express)
- **DB**: MongoDB (Mongoose)
- **Auth**: JWT (access/refresh), bcrypt
- **Mail**: Nodemailer (SMTP)
- **Docs**: Postman Collection

---

## Architecture at a Glance

Client (Admin / Agent / Customer)
│ HTTP (REST, JSON)
▼
Express API (RBAC, validation)
│
Services / Controllers
│
Mongoose (MongoDB)
│
MongoDB Atlas / MongoDB


---

## Quick Start

### Prerequisites
- Node.js **v18+** (v20+ recommended)
- A MongoDB connection (e.g., MongoDB Atlas)

### 1) Clone & install
```bash
git clone https://github.com/shohidulislamemon/Parcel-Delivery-System.git
cd Parcel-Delivery-System
npm install

2) Configure env

Create a .env file in project root (see Environment Variables).
3) Run (dev)

npm run dev
# default: http://localhost:5000

Environment Variables

Create .env in the root:

# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority

# Auth
JWT_SECRET=<a-strong-random-secret>
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Email (optional, for Nodemailer)
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<smtp-username>
SMTP_PASS=<smtp-password>
SMTP_FROM="ExcelBD Courier <no-reply@yourdomain.com>"

    If you don’t need email right now, you can leave SMTP vars empty and keep email features off.

Project Scripts

npm run dev     # start in development (nodemon if configured)
npm start       # start in production
npm test        # run tests (if present)

Folder Structure

    Your repo may vary slightly; this reflects the typical layout.

Parcel-Delivery-System/
├─ src/ or server/                 # main source
│  ├─ config/                      # env, db setup
│  ├─ modules/                     # feature modules
│  │  ├─ auth/                     # register/login/me
│  │  ├─ parcels/                  # create/list/update/assign/status
│  │  ├─ users/agents/             # user/agent management
│  ├─ middlewares/                 # auth, rbac, validate
│  ├─ utils/                       # helpers (logger, error)
│  ├─ app.js / server.js           # express app
│
├─ backgroundservices/             # cron/jobs/helpers (e.g., sendmail.js)
├─ doccuments/                     # reports/docs
├─ package.json
├─ README.md
└─ .env (local)

Core Flows
1) Admin creates a parcel

    POST /api/parcels
    Payload includes sender/receiver, addresses, weight, COD, notes.
    Returns a parcel with a trackingCode.

2) Admin assigns parcel to an agent

    PATCH /api/parcels/:id/assign
    Body: { "agentId": "<agent_id>" }
    Creates/updates an Assignment record.

3) Agent updates status

    PATCH /api/parcels/:id/status
    Body: { "status": "picked" | "in-transit" | "delivered" | "failed" | "returned", "notes": "...", "location": "optional" }
    Enforces valid transitions; logs a StatusEvent.

4) Customer tracks parcel

    GET /api/track/:trackingCode
    Public, read-only summary + timeline.

    Full contract & examples → Postman Docs: https://documenter.getpostman.com/view/40095994/2sB3BEoVsq

API Overview

Common endpoints (see Postman for full list & examples):

    Auth

        POST /api/auth/register — create user

        POST /api/auth/login — get JWT tokens

        GET /api/auth/me — current user profile

    Parcels

        POST /api/parcels — create parcel (Admin/Customer)

        GET /api/parcels — list parcels (Admin; supports filters & pagination)

        GET /api/parcels/find/:id — parcel details (Admin/Agent)

        PUT /api/parcels/:id — update parcel (Admin)

        PATCH /api/parcels/:id/assign — assign to agent (Admin)

        PATCH /api/parcels/:id/unassign — unassign (Admin)

        PATCH /api/parcels/:id/status — status update (Agent/Admin)

        DELETE /api/parcels/:id — soft delete (Admin)

    Tracking (Public)

        GET /api/track/:trackingCode

Seed / Demo Users

If you don’t have a seeding script, you can:

    Create an Admin via POST /api/auth/register and then update role in DB manually, or

    Insert a user directly in MongoDB with role ADMIN.

    Example (Mongo Shell)

    db.users.insertOne({
      name: "Admin",
      email: "admin@example.com",
      role: "ADMIN",
      passwordHash: "<bcrypt-hash-here>",
      createdAt: new Date()
    })

Deployment Notes

    Host Node.js API on any VPS/PAAS (e.g., Render, Railway, AWS, Azure).

    Set environment variables on the platform.

    Point any frontend to the API base URL.

    Use a managed MongoDB (e.g., MongoDB Atlas).

Troubleshooting
PowerShell: npm.ps1 cannot be loaded

If you see:

File ...\npm.ps1 cannot be loaded because running scripts is disabled on this system.

Run PowerShell as Administrator:

Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

Nodemailer: Unexpected socket close

    Verify SMTP host/port/user/pass, and firewall rules.

    Increase timeout in transport:

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  socketTimeout: 60000
});

    Guard against missing info.response:

transport.sendMail(mailOptions, (err, info) => {
  if (err) return console.error("Email error:", err);
  console.log("MessageId:", info?.messageId);
  console.log("Response:", info?.response || "No SMTP response");
});

License

MIT
Author

Shohidul Islam Emon
📧 shohidulislamemon99@gmail.com • 📞 +8801646506191


If you want a **shorter** README for the root and move deeper examples to `/docs`, say the word and I’ll split it cleanly.
::contentReference[oaicite:0]{index=0}