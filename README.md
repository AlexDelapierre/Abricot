# Abricot

Project management app (projects, tasks, contributors, comments and a personal dashboard). Built with Next.js, React, TypeScript and Tailwind CSS.

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or higher
- The back end API: [dev-react-P10](https://github.com/OpenClassrooms-Student-Center/dev-react-P10)

## Getting started

### 1. Start the back end

```bash
git clone https://github.com/OpenClassrooms-Student-Center/dev-react-P10.git
cd dev-react-P10
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run dev
```

Set a value for `JWT_SECRET` in `.env` before `npm install` (see the back end README). The API runs on `http://localhost:8000`.

### 2. Start the front end

In a second terminal, from this project's folder:

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app is available on `http://localhost:3000`.

## Environment variables

In `.env.local`:

- `API_URL`: the back end URL (`http://localhost:8000`)
- `GEMINI_API_KEY`: a Gemini API key, used to suggest tasks in a project. The rest of the app works without it.

## Demo accounts

| Email               | Password      |
| ------------------- | ------------- |
| `alice@example.com` | `P@ssword123` |
| `bob@example.com`   | `P@ssword123` |

## Good to know

The Kanban view only shows the tasks due this month. The seed tasks are dated 2024, so change a task's due date to see it there.
