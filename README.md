# ExcelBD Parcel Delivery System



![Parcel Delivery System](https://i.ibb.co.com/VRSrLVK/11.png)

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
```
### 2) Configure env
```bash
Create a .env file in project root (see Environment Variables).
```
3) Run (dev)
```bash
npm run dev
```
# default: http://localhost:5000

Environment Variables

Create .env in the root:

# Server
PORT=8000
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
```bash
npm run dev     # start in development (nodemon if configured)
npm start       # start in production
npm test        # run tests (if present)
```
Folder Structure

    
# Author 


Shohidul Islam Emon

📧 shohidulislamemon99@gmail.com 

📞 +8801646506191

