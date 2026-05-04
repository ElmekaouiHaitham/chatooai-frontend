# ChatooAI Frontend

ChatooAI Frontend is the Next.js web app for a multi WhatsApp chatbot platform. The product vision is an agency/SaaS dashboard where users can create multiple AI-powered WhatsApp bots, connect each bot by QR code, configure bot behavior, monitor usage, and manage plans.

This repository contains the browser-facing application only. WhatsApp sessions, AI replies, protected bot mutations, and WebSocket QR broadcasts are handled by the separate backend service.

## Repository Links

- Frontend repository: [https://github.com/ElmekaouiHaitham/chatooai-frontend](https://github.com/ElmekaouiHaitham/chatooai-frontend)
- Backend repository: [https://github.com/ElmekaouiHaitham/chatooai-backend](https://github.com/ElmekaouiHaitham/chatooai-backend)
- Local demo URL: [http://localhost:3000](http://localhost:3000)
- Live website: add the deployed frontend URL here when available.

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Firebase client SDK
- Firebase Authentication
- Firestore
- Firebase Storage setup
- Chart.js / react-chartjs-2

## What Is Implemented

- Public landing page for the ChatooAI product.
- Email/password and Google authentication through Firebase.
- User profile creation in Firestore after sign up or sign in.
- Protected routes for logged-in users.
- Dashboard that loads the current user's bots from Firestore.
- Bot creation form that calls the backend `/bot` endpoint.
- Bot detail page with:
  - Firestore real-time bot document listener.
  - WebSocket QR updates from the backend.
  - QR fallback fetch from the backend.
  - WhatsApp status display.
  - Disconnect action for connected bots.
- Bot settings page that updates bot metadata through the backend.
- Admin dashboard screens for users, bots, plans, growth charts, and recent activity.
- Admin plan management UI connected to Firestore/backend routes.
- Billing and usage page that reads the user's current plan and monthly usage from Firestore.
- Analytics page that reads usage and bot counts from Firestore.
- Support page with a mailto-based contact form.

## Partially Implemented Or Mocked

These areas exist in the UI, but should not be treated as production-complete:

- Billing is mostly informational. There is no Stripe, PayPal, invoice, checkout, subscription cancellation, refund, tax, or payment-method integration.
- Payment method UI is placeholder content.
- Analytics are limited to stored Firestore usage counters and simple derived values. There is no deep WhatsApp conversation analytics, cohorting, attribution, or export workflow.
- Plan limits are represented in Firestore and checked by the backend, but the subscription lifecycle is not fully automated.
- Admin screens depend on Firestore data shape and basic admin flags. They are not a complete enterprise admin console.
- Support form opens the user's email client with a prefilled message. There is no ticketing backend.
- Some UI pages are polished views over current data, but not every visible action is wired to a complete production workflow.

## Not Implemented Yet

- Real payment processing.
- Full subscription lifecycle management.
- Tenant/team/workspace management for agencies.
- Conversation inbox or chat transcript viewer.
- Human handoff tools.
- Message templates and WhatsApp Business template approval flows.
- File/document ingestion or RAG.
- Deployment automation.
- End-to-end tests.
- Role/permission system beyond the current admin checks.
- Production observability and audit logs.

## Relationship To The Product Description

The product description describes an optimal multi-bot WhatsApp chatbot system for agencies, SaaS providers, developers, and resellers. This frontend is a working foundation toward that product, not a finished marketplace-ready SaaS.

Accurate today:

- Multi-bot dashboard concept.
- Firebase-backed users, bots, plans, and usage data.
- QR-based WhatsApp connection UI.
- AI bot configuration forms.
- Admin and plan-management screens.

Still future work:

- "Unlimited" scale claims.
- Complete billing.
- Complete analytics.
- Production-grade multi-tenant operations.
- Marketplace-style installation guide and support flow.

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- A Firebase project with Authentication and Firestore enabled
- The ChatooAI backend running locally or deployed

### Installation

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

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

All required variables are listed in [.env.example](./.env.example).

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase web app API key. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase Auth domain. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase project ID. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Firebase Storage bucket. |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase messaging sender ID. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase web app ID. |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | No | Firebase Analytics measurement ID. |
| `NEXT_PUBLIC_API_URL` | Yes | Backend HTTP URL, for example `http://localhost:5000`. |
| `NEXT_PUBLIC_WS_URL` | Yes | Backend WebSocket URL, for example `ws://localhost:5000`. |

Because these variables use the `NEXT_PUBLIC_` prefix, they are exposed to the browser. Do not place private secrets or Firebase service account credentials in the frontend.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project Structure

```text
app/          Next.js pages and route segments
components/   Shared UI components
constants/    Static form/config values
contexts/     React providers, including auth context
lib/          Firebase setup and data helpers
public/       Static assets
```

## Contributing

Contributions are welcome. The most useful areas right now are:

- Replacing mocked billing with real payment integration.
- Improving analytics with real bot/message metrics.
- Hardening admin permissions and Firestore rules.
- Adding tests for auth, bot creation, settings, and QR connection flows.
- Cleaning up UI copy, loading states, error states, and accessibility.
- Documenting deployment for Vercel or another hosting provider.

Please open an issue or pull request with a clear description of the change and how it was tested.
