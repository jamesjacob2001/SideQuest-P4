# SideQuest

## Authors

- Melissa Rejuan
- James Jacob

## Class Link

[Web Development (CS 5610), Summer 2026](https://johnguerra.co/classes/webDevelopment_online_summer_2026/)

## Project Objective

SideQuest helps students discover side projects, find collaborators across fields, and manage teams. Users can browse recruiting projects, create and edit their own, maintain profiles, request to join roles, and track memberships from a personal dashboard.

The app is a React (Vite) frontend with a Node.js + Express API. Authentication uses Passport Local with Express sessions stored in MongoDB. Application data lives in MongoDB Atlas in three collections: `users`, `projects`, and `team_memberships`.

## Live App

| Service  | URL                               |
| -------- | --------------------------------- |
| Frontend | https://side-quest-p4.vercel.app/ |
| API      | https://sidequest-p4-production.up.railway.app |

## Screenshot

![SideQuest Browse Projects page](assets/screenshot.png)

## How to Use the App

1. Open the live app at [https://side-quest-p4.vercel.app/](https://side-quest-p4.vercel.app/), or run it locally (see build instructions below).
2. **Browse Projects** to explore recruiting projects (no login required). Use search and filters to narrow results.
3. **Sign up** or **Log in**. Seeded demo accounts use the password `Password123!`.
4. Edit **My Profile**, **Create Project**, apply to open roles, and manage requests on **Dashboard**.

---

# Instructions to Build

## Prerequisites

- Node.js and npm
- A MongoDB Atlas connection string
- Your IP allowed under Atlas **Network Access** (or `0.0.0.0/0` while developing)

## 1. Install dependencies

From the project root:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

## 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` (placeholders only — never put real credentials in this README or commit `.env`):

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=sidequest_db
PORT=3000
SESSION_SECRET=replace-with-a-long-random-string
```

If Atlas does not allow your IP, the server will fail to start with a TLS/SSL error.

### Seed data (optional, 1,000+ records)

Runtime data always comes from MongoDB. Seed scripts only load the database.

- **Users:** import at least 1,000 users into `sidequest_db.users` (Atlas import), then hash demo passwords:

```bash
npm run rehash-passwords
```

Seeded users use:

```text
Password123!
```

- **Projects:** with users already in MongoDB:

```bash
npm run seed
```

This inserts 1,000 synthetic projects and clears team memberships.

- Optional dashboard memberships:

```bash
npm run seed-team-memberships
```

## 3. Start the app

From the project root:

```bash
npm run dev
```

This starts the Express API and the Vite React client together.

| Service         | URL                                       |
| --------------- | ----------------------------------------- |
| Frontend        | http://localhost:5173                     |
| Backend API     | http://localhost:3000                     |
| Health check    | http://localhost:3000/api/health          |
| Database health | http://localhost:3000/api/health/database |

Client or server alone:

```bash
npm run client
npm run server
```

Format with Prettier:

```bash
npm run format
```

Lint the client:

```bash
npm run lint --prefix client
```

---

# Repository Overview

```text
sidequest/
├── client/                 React (Vite) frontend
│   └── src/
│       ├── components/     auth, dashboard, forms, layout, profiles, projects
│       ├── pages/          route-level screens
│       ├── services/       Fetch calls to the Express API
│       ├── styles/         shared CSS module (ui.module.css)
│       └── App.jsx
├── server/                 Express API
│   ├── controllers/
│   ├── routes/
│   ├── services/           MongoDB access
│   ├── middleware/
│   └── server.js
├── database/seed/          synthetic project seed
├── docs/                   schema and API notes
├── assets/ReadmePhoto.png
├── .env.example
├── prettier.config.js
├── LICENSE                 MIT
└── README.md
```

Each React UI piece lives in its own file with a CSS Module next to it (`Component.jsx` + `Component.module.css`). Shared tokens live in `client/src/index.css` and `client/src/styles/ui.module.css`.

---

# MongoDB Collections

| Collection          | Holds                                      |
| ------------------- | ------------------------------------------ |
| `users`             | Accounts and profiles                      |
| `projects`          | Listings, roles, recruiting metadata       |
| `team_memberships`  | Join requests and accepted team membership |

The API supports create, read, update, and delete on all three.

---

# Design Decisions

- **Hierarchy:** Pages read top-left first — brand or page title is largest, then supporting copy, then primary actions. Project cards lead with title/tagline. Nav keeps the brand left and treats Create project / Sign up as the strong CTAs.
- **Layout & spacing:** One layout system (`--layout-max-width`, gutters, spacing tokens) keeps nav and content aligned. Related items sit closer together than separate sections.
- **Color:** Navy surfaces, cobalt primary actions (Accept, Apply, Create, Search), lavender accents for tags and links, outline secondary for Decline / cancel, rose danger for deletes.
- **Typography:** Metal (display) paired with EB Garamond (body), loaded from Google Fonts — not the browser default stack.
