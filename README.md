# Bharat Digital Census Portal

A production-ready, full-stack digital census documentation portal built with **React.js** (Vite + Tailwind CSS) and **Node.js** (Express + SQLite).

This application mirrors the design architecture of Stitch project `7848053034776732826`, introducing security compliance, session persistence, a 10-step wizard form, document upload verification, and an administrative portal for census audit officers.

---

## Technical Stack & Architecture

### Frontend (`/frontend`)
- **React.js**: Bootstrapped using Vite for fast compilation.
- **Tailwind CSS**: Custom palette representing the national colors (Navy Blue `#0b2447`, Saffron Orange `#ff9933`, Success Green `#138808`).
- **React Router**: Safe role-based routing (`/dashboard` and `/wizard` for citizens; `/admin` for officers).
- **Lucide React**: Vector icons.

### Backend (`/backend`)
- **Node.js & Express.js**: REST API server.
- **SQLite Database**: Native file-based relational store (`database.sqlite`). Self-contained, requiring zero external server configurations.
- **Multer**: Disk-based file validation and upload system.
- **JWT (JsonWebToken)**: Secure, stateless session management.
- **Bcrypt.js**: Security hashing for officer password databases.

---

## Database Schemas

- **`users`**: ID, Aadhaar (Unique for citizens), Username (Unique for officers), Password (hashed), Role (`CITIZEN` / `OFFICER`), FullName, CreatedAt.
- **`census_responses`**: Map to user drafts storing form fields across steps 1-10, comments, submission status (`DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED`), and timestamps.
- **`family_members`**: Relationship dependents declarations.
- **`uploaded_documents`**: Proof document tracking records.

---

## Installation & Getting Started

### Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed on your system.

### One-Step Setup
From the root workspace folder, run the automated installation script:
```bash
npm run install:all
```
This commands runs `npm install` at the root and recursively calls installs inside both `frontend/` and `backend/` subdirectories.

### Running the Application

To launch both the API backend and Vite React frontend concurrently in development mode:
```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## Mock Verification & Credentials

To test the application flows:

### 1. Citizen Journey
- Enter any **12-digit Aadhaar number** on the login screen.
- If it's a new Aadhaar, you will be prompted to fill out a short signup profile.
- Verify OTP using code: **`123456`** (mock validated).
- Fill in steps 1 to 10 of the census form.
- Upload mock file proofs (PDF/Images) on Step 7.
- Submit the declaration on Step 10. Your status will shift to "Under Verification".

### 2. Census Officer Journey
- Click the **Census Officer** tab on the Login page.
- Login using:
  - **Username**: `admin`
  - **Password**: `admin123`
- Inspect the pending registration queue, check uploaded scans, and choose to **Approve** or **Reject** (with comment logs).
- Log back in as the citizen to view comments or download the official **Digital Census Certificate**!
