# AttendanceOS

AttendanceOS is a classroom attendance dashboard for managing teaching sessions, a weekly timetable, student RFID cards, and live attendance. The interface includes an RFID reader simulator so the main workflows can be tried without physical hardware.

## Run locally

Requirements: Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To create a local account, use **Create account**, then enter the verification code displayed on the page. Sign-in, registration, password reset, sample roster, timetable, sessions, and attendance are stored in that browser's local storage.

Other commands:

```sh
npm run lint
npm run build
npm run preview
```

## Deploy to Vercel

Import this repository into Vercel as a Vite project. Use the default settings:

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

`vercel.json` rewrites app routes to `index.html`, so refreshing a route such as `/sessions` works in production. No environment variables are required for the demo adapter.

## Demo and integrations

The app starts with sample students, RFID assignments, one scheduled session, attendance records, and weekly timetable slots. Changes persist in the current browser. Clearing the site's local storage restores the sample data.

This repository currently contains a browser-only demo data adapter, not a production server. Passwords and attendance data are stored in local storage and are not protected for multi-user or sensitive production use. The local verification code is intentionally shown in the registration page; email delivery and Google sign-in require a configured server-side identity provider and are not enabled by this demo adapter.

## Main routes

- `/` — attendance dashboard
- `/sessions` and `/sessions/:id` — create, open, close, and review sessions
- `/timetable` — weekly class slots
- `/rfid-cards` — assign and manage RFID cards
- `/students/:id` — student attendance details
- `/settings` — reader simulator and appearance preferences
