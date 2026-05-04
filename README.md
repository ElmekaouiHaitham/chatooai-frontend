# ChatooAI Frontend

ChatooAI is a Next.js frontend for managing AI-powered WhatsApp chatbots. It provides authentication, dashboard views, bot creation and settings, QR-based WhatsApp connection screens, billing and plan selection pages, analytics, support, and admin tools for managing users and subscription plans.

This repository contains the frontend application. It expects a Firebase project for authentication, Firestore, and Storage, plus a backend API/WebSocket service for bot and WhatsApp operations.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Firebase
- Chart.js

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- A configured Firebase project
- The ChatooAI backend service running locally or deployed

### Installation

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Firebase web app configuration and backend URLs.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev
```

Runs the app locally with Turbopack.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server after a successful build.

```bash
npm run lint
```

Runs the configured lint command.

## Environment Variables

All required variables are listed in [.env.example](./.env.example).

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase web app API key. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase Auth domain, usually `your-project.firebaseapp.com`. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase project ID. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Firebase Storage bucket name. |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase messaging sender ID. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase web app ID. |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | No | Firebase Analytics measurement ID, if Analytics is enabled. |
| `NEXT_PUBLIC_API_URL` | Yes | HTTP base URL for the backend API. |
| `NEXT_PUBLIC_WS_URL` | Yes | WebSocket URL for real-time bot connection updates. |

Because these variables use the `NEXT_PUBLIC_` prefix, they are exposed to the browser. Do not place private secrets, Firebase service account credentials, or backend-only tokens in this frontend environment file.

## Project Structure

```text
app/          Next.js App Router pages and routes
components/   Reusable UI components
constants/    Shared static configuration
contexts/     React context providers
lib/          Firebase setup and shared helpers
public/       Static assets
```

## Notes

- The backend API should be reachable at `NEXT_PUBLIC_API_URL`.
- The WebSocket server should be reachable at `NEXT_PUBLIC_WS_URL`.
- Firebase Authentication, Firestore, and Storage must be enabled for the app features to work correctly.
