# ClinicAI Frontend

React frontend for an AI-powered Clinic Management SaaS. It connects to the deployed backend API, handles JWT authentication, role-based navigation, patient records, appointments, prescriptions, AI tools, analytics, and PDF downloads.

## Tech Stack

- React 18 + Vite
- React Router v6 with `createBrowserRouter`
- Redux Toolkit + RTK Query
- React Hook Form + Zod
- Tailwind CSS v3
- Recharts
- React Hot Toast
- date-fns
- lucide-react
- axios for PDF blob downloads

## Backend API

Default API URL:

```bash
https://hackathon-backend-woad-two.vercel.app/api
```

The frontend sends protected requests with:

```bash
Authorization: Bearer <clinic_token>
```

Important: the backend must return `token` from `/auth/login` and `/auth/register`. If the live deployed backend has not been redeployed after the token fix, protected pages will still show `Authorization token missing`.

## Quick Start

From the frontend folder:

```bash
cd /home/engineer/projects/Hackathon/hackathon-fronted
yarn
yarn dev
```

Open the Vite URL shown in the terminal. Usually:

```bash
http://localhost:5173
```

If port `5173` is busy, Vite will choose another port such as `5174`.

## Environment

Create or confirm `.env`:

```bash
VITE_API_URL=https://hackathon-backend-woad-two.vercel.app/api
```

Example file:

```bash
VITE_API_URL=https://your-backend-url.vercel.app/api
```

## Commands

Install dependencies:

```bash
yarn
```

Run development server:

```bash
yarn dev
```

Lint:

```bash
yarn lint
```

Production build:

```bash
yarn build
```

Preview production build:

```bash
yarn preview
```

Seed demo data into a backend:

```bash
API_URL=http://localhost:5003/api yarn seed:demo
```

The seeder creates/logs in test role accounts, creates patients, books appointments, marks statuses, writes prescriptions, runs AI symptom checks, runs risk flagging, and fetches analytics so charts have real backend records.

## Full Project Structure

```text
hackathon-fronted/
├── .env
├── .env.example
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
├── vite.config.js
├── yarn.lock
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── app/
    │   └── store.js
    ├── components/
    │   ├── common/
    │   │   ├── ConfirmModal.jsx
    │   │   ├── DataTable.jsx
    │   │   ├── EmptyState.jsx
    │   │   ├── ErrorAlert.jsx
    │   │   ├── PageHeader.jsx
    │   │   ├── RoleBadge.jsx
    │   │   ├── SkeletonCard.jsx
    │   │   ├── SkeletonTable.jsx
    │   │   ├── StatCard.jsx
    │   │   └── StatusBadge.jsx
    │   └── layout/
    │       ├── AppLayout.jsx
    │       ├── MobileNav.jsx
    │       ├── Sidebar.jsx
    │       └── TopBar.jsx
    ├── features/
    │   ├── ai/
    │   │   └── aiApi.js
    │   ├── analytics/
    │   │   └── analyticsApi.js
    │   ├── appointments/
    │   │   └── appointmentsApi.js
    │   ├── auth/
    │   │   ├── authApi.js
    │   │   └── authSlice.js
    │   ├── patients/
    │   │   └── patientsApi.js
    │   ├── prescriptions/
    │   │   └── prescriptionsApi.js
    │   └── users/
    │       └── usersApi.js
    ├── hooks/
    │   ├── useAuth.js
    │   ├── usePDFDownload.js
    │   └── useRoleAccess.js
    ├── pages/
    │   ├── NotFoundPage.jsx
    │   ├── ai/
    │   │   └── AIToolsPage.jsx
    │   ├── analytics/
    │   │   └── AnalyticsPage.jsx
    │   ├── appointments/
    │   │   ├── AppointmentDetailPage.jsx
    │   │   ├── AppointmentsPage.jsx
    │   │   └── BookAppointmentPage.jsx
    │   ├── auth/
    │   │   ├── LoginPage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── dashboard/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── DoctorDashboard.jsx
    │   │   ├── PatientDashboard.jsx
    │   │   └── ReceptionistDashboard.jsx
    │   ├── patients/
    │   │   ├── PatientDetailPage.jsx
    │   │   ├── PatientFormPage.jsx
    │   │   └── PatientsPage.jsx
    │   ├── prescriptions/
    │   │   ├── PrescriptionDetailPage.jsx
    │   │   ├── PrescriptionsPage.jsx
    │   │   └── WritePrescriptionPage.jsx
    │   └── users/
    │       ├── UserFormPage.jsx
    │       └── UsersPage.jsx
    ├── routes/
    │   ├── ProtectedRoute.jsx
    │   ├── RoleRoute.jsx
    │   └── index.jsx
    ├── style/
    │   └── style.css
    └── utils/
        ├── authResponse.js
        ├── axiosInstance.js
        ├── constants.js
        ├── formatDate.js
        └── formatters.js
```

## What Each Folder Does

`src/app/store.js`

Configures Redux Toolkit, RTK Query reducers, and middleware.

`src/features`

Contains RTK Query API slices and auth state:

- `authApi.js`: login, register, me, logout
- `authSlice.js`: stores `user`, `token`, and `isAuthenticated`
- `usersApi.js`: admin user management and doctors list
- `patientsApi.js`: patient CRUD and patient timeline
- `appointmentsApi.js`: appointment CRUD and doctor schedule
- `prescriptionsApi.js`: prescription CRUD
- `aiApi.js`: symptom checker, prescription explanation, risk flag
- `analyticsApi.js`: admin and doctor analytics

`src/components/common`

Reusable UI components such as tables, badges, stat cards, skeletons, empty states, alerts, and confirmation modal.

`src/components/layout`

Main authenticated app layout:

- Sidebar for desktop
- Top bar
- Mobile drawer
- Mobile bottom nav

`src/pages`

Route pages for authentication, dashboards, patients, appointments, prescriptions, users, AI tools, analytics, and 404.

`src/routes`

Defines public routes, protected routes, and role-protected routes.

`src/hooks`

Reusable hooks for auth state, role permissions, and PDF download.

`src/utils`

Constants, date formatting, API response formatting, auth response parsing, and axios instance.

## Routes

Public:

```text
/login
/register
```

Protected:

```text
/dashboard
/patients
/patients/new
/patients/:id
/patients/:id/edit
/appointments
/appointments/book
/appointments/:id
/prescriptions
/prescriptions/write
/prescriptions/:id
/users
/users/new
/users/:id/edit
/ai-tools
/analytics
```

Role protected:

```text
/users                 admin only
/users/new             admin only
/users/:id/edit        admin only
/appointments/book     admin, receptionist, patient
/prescriptions/write   doctor only
/ai-tools              admin, doctor, patient
/analytics             admin, doctor
```

## How To Test The Full Frontend

### 1. Start Backend Or Use Live Backend

If using live backend, confirm it is redeployed after the token fix.

If testing local backend:

```bash
cd /home/engineer/projects/Hackathon/hackathon-backend
yarn
yarn dev
```

Then update frontend `.env`:

```bash
VITE_API_URL=http://localhost:5000/api
```

Restart frontend after changing `.env`.

### 2. Start Frontend

```bash
cd /home/engineer/projects/Hackathon/hackathon-fronted
yarn dev
```

Open:

```bash
http://localhost:5173
```

### 3. Test Login Token

Login or register from the frontend.

Open browser DevTools:

```text
Application tab -> Local Storage -> your localhost URL
```

Confirm these keys exist:

```text
clinic_token
clinic_user
```

`clinic_token` must be a real JWT string. It should not be:

```text
undefined
null
empty
```

If token is missing, redeploy or restart backend with the updated auth controller.

### 4. Test Protected API Requests

Open browser DevTools:

```text
Network tab -> Fetch/XHR
```

Visit:

```text
/patients
/appointments
/prescriptions
/dashboard
```

Click any API request and check Request Headers:

```text
Authorization: Bearer <token>
```

If this header is present, frontend auth is working.

If backend returns `Authorization token missing`, the live backend probably has not been redeployed after the token response fix.

### 5. Test Admin Flow

Login as admin.

Check:

- Dashboard stats load
- `/users` opens
- Add user works
- Edit user works
- Toggle active/inactive works
- `/patients` opens
- Add patient works
- Edit patient works
- Delete patient opens confirmation modal
- `/appointments` opens
- Book appointment works
- `/analytics` opens
- `/ai-tools` risk flagging tab appears

Expected admin nav:

```text
Dashboard
Users
Patients
Appointments
Prescriptions
AI Tools
Analytics
```

### 6. Test Doctor Flow

Login as doctor.

Check:

- Doctor dashboard loads
- Today's schedule section renders
- `/patients` opens
- `/appointments` opens
- `/prescriptions` opens
- `/prescriptions/write` opens
- Write prescription works
- Prescription detail opens
- Generate AI explanation works
- Download PDF button works
- `/ai-tools` shows Symptom Checker, Prescription Explain, Risk Flagging
- `/analytics` opens doctor stats

Expected doctor nav:

```text
Dashboard
Patients
Appointments
Prescriptions
AI Tools
My Stats
```

### 7. Test Receptionist Flow

Login as receptionist.

Check:

- Receptionist dashboard loads
- `/patients` opens
- Add patient works
- `/appointments` opens
- Book appointment works
- User management is blocked
- Prescriptions are not in sidebar
- AI tools are blocked

Expected receptionist nav:

```text
Dashboard
Patients
Appointments
```

### 8. Test Patient Flow

Login as patient.

Check:

- Patient dashboard loads
- `/appointments` opens
- Book appointment works
- `/prescriptions` opens
- PDF download button works if prescriptions exist
- `/ai-tools` shows Prescription Explain only
- User management is blocked
- Patient list is blocked by backend permissions if backend is enforcing patient restrictions

Expected patient nav:

```text
Dashboard
My Appointments
My Prescriptions
```

## Full Feature Checklist

Use this checklist to confirm the project is working:

- Register user
- Login user
- Token saved in localStorage
- Protected pages do not redirect to login
- Sidebar changes based on role
- Mobile nav appears on small screen
- Dashboard loads for each role
- Admin analytics charts render
- Doctor stats render
- Patient list loads
- Patient search works
- Create patient works
- Edit patient works
- Patient detail tabs work
- Patient timeline loads
- Appointment list loads
- Status filter works
- Book appointment works
- Appointment detail opens
- Appointment status update works
- Prescription list loads
- Write prescription works
- Dynamic medicines add/remove works
- Prescription detail opens
- AI prescription explanation works
- PDF download works
- AI symptom checker works for doctor
- AI risk flagging works for admin/doctor
- User management works for admin
- Unauthorized routes redirect to `/dashboard`
- Unknown route shows 404 page
- `yarn lint` passes
- `yarn build` passes

## Common Problems And Fixes

### Authorization token missing

Cause:

The backend login/register response did not send a token, or the deployed backend is still old.

Fix:

Redeploy backend after confirming `controllers/authController.js` returns:

```js
{ user, token }
```

Then logout, clear localStorage, and login again.

Clear browser localStorage:

```text
DevTools -> Application -> Local Storage -> Clear
```

Or run in browser console:

```js
localStorage.removeItem('clinic_token')
localStorage.removeItem('clinic_user')
```

### Page redirects to login after refresh

Check localStorage:

```text
clinic_token
clinic_user
```

If token is missing, login again.

### API requests fail in Network tab

Check `.env`:

```bash
VITE_API_URL=https://hackathon-backend-woad-two.vercel.app/api
```

Restart Vite after changing `.env`.

### Vite port already in use

Vite will automatically choose another port. Use the URL shown in terminal.

### Build has chunk-size warning

This is not a failure. The app includes charts and all pages in one bundle. Build is successful if you see:

```text
✓ built
```

## Production Test Before Deployment

Run:

```bash
yarn lint
yarn build
yarn preview
```

Open the preview URL and test:

- Login
- Dashboard
- Patients
- Appointments
- Prescriptions
- AI tools
- Refresh any nested route like `/patients` or `/appointments`

Vercel routing is handled by:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Deploy To Vercel

1. Push frontend to GitHub.
2. Import project in Vercel.
3. Framework preset: Vite.
4. Build command:

```bash
yarn build
```

5. Output directory:

```bash
dist
```

6. Add environment variable:

```bash
VITE_API_URL=https://hackathon-backend-woad-two.vercel.app/api
```

7. Deploy.

## Final Local Verification

Use this exact command set:

```bash
cd /home/engineer/projects/Hackathon/hackathon-fronted
yarn
yarn lint
yarn build
yarn dev
```

Then test in browser:

```text
/login
/register
/dashboard
/patients
/appointments
/prescriptions
/ai-tools
/analytics
```

If login saves `clinic_token` and protected API requests include `Authorization: Bearer <token>`, the frontend auth flow is working correctly.
