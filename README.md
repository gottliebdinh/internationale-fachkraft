# GeVin – Fachkräfte für Deutschland

B2B recruiting platform connecting German employers (hospitality, hairdressing, nursing) with Vietnamese training schools. IHK-compliant, DSGVO-secure.

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **UI**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL + Row Level Security)
- **Auth**: Supabase Auth with role-based access (admin, school, employer)
- **i18n**: next-intl (DE/VI/EN)
- **Forms**: React Hook Form + Zod validation
- **Email**: Resend
- **PDF**: @react-pdf/renderer (IHK document generation)

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (EU region recommended: Frankfurt)

### Setup

```bash
npm install
```

Copy `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

Apply migrations to your Supabase project:

1. Go to Supabase Dashboard → SQL Editor
2. Run `supabase/migrations/001_initial_schema.sql`
3. Run `supabase/migrations/002_rls_policies.sql`

Or use the Supabase CLI:

```bash
npx supabase db push
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    (public)/        → Public pages (landing, FAQ, legal)
    (auth)/          → Login, registration
    dashboard/
      admin/         → Admin dashboard
      school/        → School dashboard
      employer/      → Employer dashboard
    api/             → API routes (documents, notifications)
  components/
    ui/              → shadcn/ui components
    shared/          → Navbar, sidebar, footer, consent banner
  lib/
    supabase/        → Client, server, middleware, actions
    validators/      → Zod schemas
    matching.ts      → Candidate matching logic
    pdf-generator.ts → IHK document generation
    notifications.ts → Notification system
    email.ts         → Email integration (Resend)
  i18n/              → Translations (de, vi, en)
  types/             → TypeScript types
  hooks/             → Custom hooks
supabase/
  migrations/        → SQL schema + RLS policies
```

## User Roles

| Role | Access |
|------|--------|
| Admin | Full platform management, verification, audit logs |
| School | Candidate management, match responses |
| Employer | Job positions, candidate search, match requests |

## Key Features

- **IHK Document Generator**: Auto-fill Berufsausbildungsvertrag and Erklärung zum Beschäftigungsverhältnis
- **Match Pipeline**: Full status tracking from proposal to arrival
- **DSGVO Compliance**: Audit logs, consent management, encrypted document storage
- **Multilingual**: German, Vietnamese, English
