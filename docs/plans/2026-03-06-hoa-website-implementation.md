# Pine Brook Meadows HOA Website — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a clean, multi-page HOA website for Pine Brook Meadows (Sammamish, WA) with Sanity CMS for board-managed content, Supabase magic-link auth for member-only sections, and Netlify hosting.

**Architecture:** React + Vite + TypeScript frontend in `web/`, Sanity Studio in `studio/` (deployed to Sanity-hosted URL for board members). Public pages: Home, Announcements, Vendors, Login. Protected pages (magic link required): Documents, Directory. Member directory stored in Supabase; all other content in Sanity.

**Tech Stack:** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, React Router v6, @sanity/client v3, @supabase/supabase-js v2, Vitest, React Testing Library, Netlify

---

## Prerequisites (do before Task 1)

### Create a Sanity account and project
1. Go to sanity.io, create a free account
2. Create a new project named "pinebrook-meadows-hoa"
3. Choose dataset name: `production`
4. Note your **Project ID** (looks like `abc12345`) — you'll need it in Task 4

### Create a Supabase project
1. Go to supabase.com, create a free account
2. Create a new project named "pinebrook-meadows-hoa"
3. Note your **Project URL** and **anon public key** from Settings → API — you'll need them in Task 4
4. In Authentication → URL Configuration:
   - Site URL: `http://localhost:5173` (update to production URL after deploy)
   - Add Redirect URL: `http://localhost:5173/**`

---

## Task 1: Scaffold the web app

**Files:**
- Create: `web/` (new Vite project)
- Create: `web/src/test/setup.ts`

**Step 1: Initialize the Vite project**

```bash
cd /Users/monika.daryani/code/hoa_website
npm create vite@latest web -- --template react-ts
cd web
npm install
```

**Step 2: Install all dependencies**

```bash
npm install react-router-dom @sanity/client @supabase/supabase-js
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Step 3: Install Tailwind**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Step 4: Configure Tailwind — replace `web/tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2d6a4f',
          50: '#f0faf4',
          100: '#dcf5e7',
          600: '#2d6a4f',
          700: '#1b4332',
          800: '#133020',
        },
      },
    },
  },
  plugins: [],
}
```

**Step 5: Configure Tailwind base styles — replace `web/src/index.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply text-gray-800 bg-white;
  }
}
```

**Step 6: Add path alias — update `web/vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

**Step 7: Create test setup file `web/src/test/setup.ts`**

```ts
import '@testing-library/jest-dom'
```

**Step 8: Update `web/tsconfig.json` to add path alias**

Add inside `compilerOptions`:
```json
"baseUrl": ".",
"paths": { "@/*": ["./src/*"] }
```

**Step 9: Add test script to `web/package.json`**

Add to `scripts`:
```json
"test": "vitest",
"test:run": "vitest run"
```

**Step 10: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted:
- Style: Default
- Base color: Slate
- CSS variables: Yes

Then add the components we'll use:
```bash
npx shadcn@latest add button card badge tabs input label separator
```

**Step 11: Verify setup runs**

```bash
npm run dev
```
Expected: Vite dev server starts at `http://localhost:5173`

**Step 12: Commit**

```bash
cd /Users/monika.daryani/code/hoa_website
git init
git add web/
git commit -m "feat: scaffold React + Vite + Tailwind + shadcn web app"
```

---

## Task 2: Scaffold Sanity Studio

**Files:**
- Create: `studio/` (new Sanity project)
- Create: `studio/schemas/index.ts`
- Create: `studio/schemas/announcement.ts`
- Create: `studio/schemas/hoaDocument.ts`
- Create: `studio/schemas/vendor.ts`
- Create: `studio/schemas/boardMember.ts`
- Create: `studio/schemas/siteSettings.ts`

**Step 1: Create Sanity project**

```bash
cd /Users/monika.daryani/code/hoa_website
npm create sanity@latest -- --project YOUR_PROJECT_ID --dataset production --template clean --output-path studio
cd studio
```

Replace `YOUR_PROJECT_ID` with the ID from the Sanity dashboard.

**Step 2: Create `studio/schemas/announcement.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const announcement = defineType({
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      type: 'date',
      title: 'Date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: ['Meeting', 'Maintenance', 'Event', 'General'],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      type: 'text',
      title: 'Content',
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pinned',
      type: 'boolean',
      title: 'Pin to top of announcements',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'date' },
  },
})
```

**Step 3: Create `studio/schemas/hoaDocument.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const hoaDocument = defineType({
  name: 'hoaDocument',
  title: 'Document',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'string',
      title: 'Description',
    }),
    defineField({
      name: 'file',
      type: 'file',
      title: 'PDF File',
      options: { accept: '.pdf' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          { title: 'Governing Documents', value: 'governing' },
          { title: 'Meeting Minutes', value: 'minutes' },
          { title: 'Financial Documents', value: 'financial' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category' },
  },
})
```

**Step 4: Create `studio/schemas/vendor.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const vendor = defineType({
  name: 'vendor',
  title: 'Vendor',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Name', validation: (Rule) => Rule.required() }),
    defineField({ name: 'category', type: 'string', title: 'Category (e.g. Landscaping, Roofing)' }),
    defineField({ name: 'phone', type: 'string', title: 'Phone' }),
    defineField({ name: 'email', type: 'string', title: 'Email' }),
    defineField({ name: 'description', type: 'string', title: 'Short description' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category' },
  },
})
```

**Step 5: Create `studio/schemas/boardMember.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const boardMember = defineType({
  name: 'boardMember',
  title: 'Board Member',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Name', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', type: 'string', title: 'Role (e.g. President)', validation: (Rule) => Rule.required() }),
    defineField({ name: 'displayOrder', type: 'number', title: 'Display order (1 = first)', initialValue: 10 }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role' },
  },
})
```

**Step 6: Create `studio/schemas/siteSettings.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'heroTagline', type: 'string', title: 'Hero tagline', initialValue: 'A welcoming community in Sammamish, WA' }),
    defineField({ name: 'parkPhoto', type: 'image', title: 'Community park photo', options: { hotspot: true } }),
    defineField({ name: 'propertyManagerName', type: 'string', title: 'Property manager name' }),
    defineField({ name: 'propertyManagerEmail', type: 'string', title: 'Property manager email' }),
    defineField({ name: 'propertyManagerPhone', type: 'string', title: 'Property manager phone' }),
    defineField({ name: 'propertyManagerMailingAddress', type: 'string', title: 'Mailing address' }),
  ],
  // Prevent creating multiple settings documents
  __experimental_actions: ['update', 'publish'],
})
```

**Step 7: Wire up schemas in `studio/schemas/index.ts`**

```ts
import { announcement } from './announcement'
import { hoaDocument } from './hoaDocument'
import { vendor } from './vendor'
import { boardMember } from './boardMember'
import { siteSettings } from './siteSettings'

export const schemaTypes = [announcement, hoaDocument, vendor, boardMember, siteSettings]
```

**Step 8: Update `studio/sanity.config.ts` to use schemas**

```ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'pinebrook-meadows',
  title: 'Pine Brook Meadows HOA',
  projectId: 'YOUR_PROJECT_ID',
  dataset: 'production',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
})
```

**Step 9: Configure CORS in Sanity dashboard**
- Go to sanity.io/manage → your project → API → CORS Origins
- Add: `http://localhost:5173` (for dev)
- Add: `https://pinebrookmeadowswa.com` (for production, after deploy)

**Step 10: Run the studio locally to verify**

```bash
cd studio
npm run dev
```
Expected: Studio opens at `http://localhost:3333`. You should see all 5 content types in the sidebar.

**Step 11: Commit**

```bash
cd /Users/monika.daryani/code/hoa_website
git add studio/
git commit -m "feat: add Sanity studio with HOA content schemas"
```

---

## Task 3: Supabase database setup

**Files:**
- No local files — this is done in the Supabase dashboard SQL editor

**Step 1: Create the homeowners table**

Go to Supabase dashboard → SQL Editor → New query. Run:

```sql
create table public.homeowners (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  address text not null,
  phone text,
  email text,
  move_in_date date,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.homeowners enable row level security;

-- Authenticated users (verified community members) can read all homeowners
create policy "Authenticated users can view homeowners"
  on public.homeowners
  for select
  to authenticated
  using (true);

-- Only service role (Supabase dashboard) can insert/update/delete
-- Board admins manage records directly via Supabase Table Editor
```

**Step 2: Verify the table exists**

In Supabase dashboard → Table Editor, you should see the `homeowners` table with the correct columns.

**Step 3: Configure magic link email template (optional but nice)**

Go to Authentication → Email Templates → Magic Link. Update the body to say:

```
<h2>Pine Brook Meadows HOA — Member Login</h2>
<p>Click the link below to access the member portal:</p>
<p><a href="{{ .ConfirmationURL }}">Access Member Portal</a></p>
<p>This link expires in 1 hour.</p>
```

**Step 4: No commit needed** (Supabase is a cloud service, no local files changed)

---

## Task 4: Environment variables and API clients

**Files:**
- Create: `web/.env.local`
- Create: `web/.env.example`
- Create: `web/src/lib/sanity.ts`
- Create: `web/src/lib/supabase.ts`

**Step 1: Create `web/.env.local`** (never commit this file)

```
VITE_SANITY_PROJECT_ID=your_project_id_here
VITE_SANITY_DATASET=production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Fill in the values from the Sanity and Supabase dashboards.

**Step 2: Create `web/.env.example`** (safe to commit, shows required vars)

```
VITE_SANITY_PROJECT_ID=
VITE_SANITY_DATASET=production
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

**Step 3: Add `.env.local` to `.gitignore`**

Verify `web/.gitignore` contains `*.local`. If not, add it.

**Step 4: Install Sanity image URL builder**

```bash
cd web
npm install @sanity/image-url
```

**Step 5: Create `web/src/lib/sanity.ts`**

```ts
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  useCdn: true,
  apiVersion: '2024-01-01',
})

const builder = imageUrlBuilder(sanityClient)
export const urlFor = (source: SanityImageSource) => builder.image(source)
```

**Step 6: Create `web/src/lib/supabase.ts`**

```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

**Step 7: Commit**

```bash
cd /Users/monika.daryani/code/hoa_website
git add web/src/lib/ web/.env.example web/.gitignore
git commit -m "feat: add Sanity and Supabase API clients"
```

---

## Task 5: Auth context and protected routes

**Files:**
- Create: `web/src/contexts/AuthContext.tsx`
- Create: `web/src/components/ProtectedRoute.tsx`
- Create: `web/src/components/__tests__/ProtectedRoute.test.tsx`

**Step 1: Write the failing test — `web/src/components/__tests__/ProtectedRoute.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi } from 'vitest'
import { AuthContext } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import type { Session } from '@supabase/supabase-js'

const renderWithAuth = (session: Session | null, loading = false) =>
  render(
    <AuthContext.Provider value={{ session, loading, signOut: vi.fn() }}>
      <MemoryRouter initialEntries={['/documents']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <div>Documents Page</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  )

test('redirects unauthenticated users to /login', () => {
  renderWithAuth(null)
  expect(screen.getByText('Login Page')).toBeInTheDocument()
})

test('renders children for authenticated users', () => {
  renderWithAuth({ user: { email: 'resident@example.com' } } as unknown as Session)
  expect(screen.getByText('Documents Page')).toBeInTheDocument()
})

test('shows loading indicator while checking auth', () => {
  renderWithAuth(null, true)
  expect(screen.getByText('Loading...')).toBeInTheDocument()
})
```

**Step 2: Run test to verify it fails**

```bash
cd web && npm run test:run
```
Expected: FAIL — `AuthContext` and `ProtectedRoute` not found.

**Step 3: Create `web/src/contexts/AuthContext.tsx`**

```tsx
import { createContext, useContext, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
```

**Step 4: Create `web/src/components/ProtectedRoute.tsx`**

```tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div>Loading...</div>
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />
  return <>{children}</>
}
```

**Step 5: Run tests to verify they pass**

```bash
npm run test:run
```
Expected: 3 tests PASS.

**Step 6: Commit**

```bash
cd /Users/monika.daryani/code/hoa_website
git add web/src/contexts/ web/src/components/ProtectedRoute.tsx web/src/components/__tests__/
git commit -m "feat: add auth context and protected route with tests"
```

---

## Task 6: App router and shared layout

**Files:**
- Modify: `web/src/main.tsx`
- Create: `web/src/App.tsx`
- Create: `web/src/components/Navbar.tsx`
- Create: `web/src/components/Footer.tsx`
- Create: `web/src/components/Layout.tsx`
- Create: `web/src/pages/NotFound.tsx`

**Step 1: Replace `web/src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

**Step 2: Create `web/src/App.tsx`**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import Announcements from '@/pages/Announcements'
import Vendors from '@/pages/Vendors'
import Login from '@/pages/Login'
import AuthCallback from '@/pages/AuthCallback'
import Documents from '@/pages/Documents'
import Directory from '@/pages/Directory'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
            <Route path="/directory" element={<ProtectedRoute><Directory /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
```

**Step 3: Create `web/src/components/Navbar.tsx`**

```tsx
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

const navLinks = [
  { to: '/announcements', label: 'Announcements' },
  { to: '/vendors', label: 'Vendors' },
]

const memberLinks = [
  { to: '/documents', label: 'Documents' },
  { to: '/directory', label: 'Directory' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { session, signOut } = useAuth()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors hover:text-primary-600 ${isActive ? 'text-primary-600' : 'text-gray-600'}`

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">PBM</span>
            </div>
            <span className="font-playfair font-bold text-lg text-gray-900 hidden sm:block">
              Pine Brook Meadows
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>
            ))}
            {session && memberLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>
            ))}
            {session ? (
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-1 text-gray-500">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button asChild size="sm" className="bg-primary-700 hover:bg-primary-800 text-white">
                <Link to="/login">Member Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 space-y-1">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md" onClick={() => setMobileOpen(false)}>
                {l.label}
              </NavLink>
            ))}
            {session && memberLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md" onClick={() => setMobileOpen(false)}>
                {l.label}
              </NavLink>
            ))}
            {session ? (
              <button onClick={signOut} className="block w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-md">
                Logout
              </button>
            ) : (
              <Link to="/login" className="block px-3 py-2 text-sm font-medium text-primary-700 hover:bg-gray-50 rounded-md" onClick={() => setMobileOpen(false)}>
                Member Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
```

**Step 4: Create `web/src/components/Footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Pine Brook Meadows HOA · Sammamish, WA</p>
      </div>
    </footer>
  )
}
```

**Step 5: Create `web/src/components/Layout.tsx`**

```tsx
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

**Step 6: Create `web/src/pages/NotFound.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="font-playfair text-4xl font-bold text-gray-900 mb-4">Page not found</h1>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
      <Button asChild><Link to="/">Go home</Link></Button>
    </div>
  )
}
```

**Step 7: Commit**

```bash
cd /Users/monika.daryani/code/hoa_website
git add web/src/
git commit -m "feat: add app router, layout, navbar, and footer"
```

---

## Task 7: Home page

**Files:**
- Create: `web/src/pages/Home.tsx`
- Create: `web/src/types/sanity.ts`

**Step 1: Create shared Sanity types — `web/src/types/sanity.ts`**

```ts
export interface Announcement {
  _id: string
  title: string
  date: string
  category: string
  body: string
  pinned: boolean
}

export interface BoardMember {
  _id: string
  name: string
  role: string
  displayOrder: number
}

export interface SiteSettings {
  heroTagline: string
  parkPhoto: { asset: { url: string } }
  propertyManagerName: string
  propertyManagerEmail: string
  propertyManagerPhone: string
  propertyManagerMailingAddress: string
}

export interface Vendor {
  _id: string
  name: string
  category: string
  phone: string
  email?: string
  description: string
}

export interface HoaDocument {
  _id: string
  title: string
  description: string
  file: { asset: { url: string } }
  category: 'governing' | 'minutes' | 'financial'
}
```

**Step 2: Create `web/src/pages/Home.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone, Calendar, Megaphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { sanityClient } from '@/lib/sanity'
import type { Announcement, BoardMember, SiteSettings } from '@/types/sanity'

const BADGE_COLORS: Record<string, string> = {
  Meeting: 'bg-blue-100 text-blue-800',
  Maintenance: 'bg-yellow-100 text-yellow-800',
  Event: 'bg-green-100 text-green-800',
  General: 'bg-gray-100 text-gray-800',
}

export default function Home() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [board, setBoard] = useState<BoardMember[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    sanityClient.fetch<Announcement[]>(
      `*[_type == "announcement"] | order(pinned desc, date desc)[0...3]`
    ).then(setAnnouncements)

    sanityClient.fetch<BoardMember[]>(
      `*[_type == "boardMember"] | order(displayOrder asc)`
    ).then(setBoard)

    sanityClient.fetch<SiteSettings>(
      `*[_type == "siteSettings"][0]{ heroTagline, parkPhoto{ asset->{ url } }, propertyManagerName, propertyManagerEmail, propertyManagerPhone, propertyManagerMailingAddress }`
    ).then(setSettings)
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-primary-800">
        {settings?.parkPhoto && (
          <img
            src={settings.parkPhoto.asset.url}
            alt="Pine Brook Meadows community park"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-primary-900/60" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="font-playfair font-bold text-5xl md:text-6xl mb-3">
            Pine Brook Meadows
          </h1>
          <p className="text-lg text-white/85 mb-6">
            {settings?.heroTagline ?? 'A welcoming community in Sammamish, WA'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild className="bg-white text-primary-700 hover:bg-white/90 font-semibold">
              <Link to="/announcements">View Announcements</Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/login">Member Login</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        {/* Latest Announcements */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-playfair font-bold text-3xl text-gray-900">Latest Announcements</h2>
            <Link to="/announcements" className="text-sm text-primary-700 hover:underline">View all →</Link>
          </div>
          {announcements.length === 0 ? (
            <p className="text-gray-500">No announcements yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {announcements.map((a) => (
                <Card key={a._id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-2 justify-between">
                      <CardTitle className="font-playfair text-lg leading-snug">{a.title}</CardTitle>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${BADGE_COLORS[a.category] ?? BADGE_COLORS.General}`}>
                        {a.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(a.date).toLocaleDateString()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">{a.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Board of Directors */}
        <section>
          <h2 className="font-playfair font-bold text-3xl text-gray-900 mb-6">Board of Directors</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {board.map((m) => (
              <Card key={m._id}>
                <CardContent className="pt-5">
                  <p className="font-semibold text-gray-900">{m.name}</p>
                  <p className="text-sm text-primary-700 mt-0.5">{m.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact */}
        {settings && (
          <section>
            <h2 className="font-playfair font-bold text-3xl text-gray-900 mb-6">Contact</h2>
            <Card className="max-w-md">
              <CardContent className="pt-5 space-y-3">
                <p className="font-semibold text-gray-900">{settings.propertyManagerName}</p>
                <p className="text-sm text-gray-500">Property Manager</p>
                <div className="space-y-2 pt-1">
                  <a href={`mailto:${settings.propertyManagerEmail}`} className="flex items-center gap-2 text-sm text-primary-700 hover:underline">
                    <Mail className="h-4 w-4" />
                    {settings.propertyManagerEmail}
                  </a>
                  <a href={`tel:${settings.propertyManagerPhone}`} className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {settings.propertyManagerPhone}
                  </a>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {settings.propertyManagerMailingAddress}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </>
  )
}
```

**Step 3: Commit**

```bash
cd /Users/monika.daryani/code/hoa_website
git add web/src/
git commit -m "feat: add Home page with hero, announcements preview, board, and contact"
```

---

## Task 8: Announcements page

**Files:**
- Create: `web/src/pages/Announcements.tsx`

**Step 1: Create `web/src/pages/Announcements.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Calendar, Pin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sanityClient } from '@/lib/sanity'
import type { Announcement } from '@/types/sanity'

const BADGE_COLORS: Record<string, string> = {
  Meeting: 'bg-blue-100 text-blue-800',
  Maintenance: 'bg-yellow-100 text-yellow-800',
  Event: 'bg-green-100 text-green-800',
  General: 'bg-gray-100 text-gray-800',
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sanityClient
      .fetch<Announcement[]>(`*[_type == "announcement"] | order(pinned desc, date desc)`)
      .then((data) => { setAnnouncements(data); setLoading(false) })
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-playfair font-bold text-4xl text-gray-900 mb-2">Announcements</h1>
      <p className="text-gray-500 mb-10">Community news and updates from the board</p>

      {loading && <p className="text-gray-400">Loading...</p>}

      {!loading && announcements.length === 0 && (
        <p className="text-gray-500">No announcements yet.</p>
      )}

      <div className="space-y-5">
        {announcements.map((a) => (
          <Card key={a._id} className={a.pinned ? 'border-primary-600 shadow-md' : ''}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-2">
                  {a.pinned && <Pin className="h-4 w-4 text-primary-600 mt-1 flex-shrink-0" />}
                  <CardTitle className="font-playfair text-xl">{a.title}</CardTitle>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${BADGE_COLORS[a.category] ?? BADGE_COLORS.General}`}>
                  {a.category}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <Calendar className="h-3 w-3" />
                {new Date(a.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{a.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
cd /Users/monika.daryani/code/hoa_website
git add web/src/pages/Announcements.tsx
git commit -m "feat: add Announcements page"
```

---

## Task 9: Vendors page

**Files:**
- Create: `web/src/pages/Vendors.tsx`

**Step 1: Create `web/src/pages/Vendors.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Phone, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sanityClient } from '@/lib/sanity'
import type { Vendor } from '@/types/sanity'

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sanityClient
      .fetch<Vendor[]>(`*[_type == "vendor"] | order(category asc, name asc)`)
      .then((data) => { setVendors(data); setLoading(false) })
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-playfair font-bold text-4xl text-gray-900 mb-2">Preferred Vendors</h1>
      <p className="text-gray-500 mb-10">Trusted local service providers recommended by our community</p>

      {loading && <p className="text-gray-400">Loading...</p>}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {vendors.map((v) => (
          <Card key={v._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <p className="text-xs font-medium text-primary-700 uppercase tracking-wide">{v.category}</p>
              <CardTitle className="font-playfair text-xl mt-1">{v.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {v.description && <p className="text-sm text-gray-600">{v.description}</p>}
              <div className="pt-2 border-t border-gray-100 space-y-1">
                {v.phone && (
                  <a href={`tel:${v.phone}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-700">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {v.phone}
                  </a>
                )}
                {v.email && (
                  <a href={`mailto:${v.email}`} className="flex items-center gap-2 text-sm text-primary-700 hover:underline">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {v.email}
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
cd /Users/monika.daryani/code/hoa_website
git add web/src/pages/Vendors.tsx
git commit -m "feat: add Vendors page"
```

---

## Task 10: Login page and auth callback

**Files:**
- Create: `web/src/pages/Login.tsx`
- Create: `web/src/pages/AuthCallback.tsx`

**Step 1: Create `web/src/pages/Login.tsx`**

```tsx
import { useState } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { session } = useAuth()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname ?? '/documents'

  // Already logged in — send them where they wanted to go
  if (session) return <Navigate to={from} replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">📬</span>
        </div>
        <h2 className="font-playfair font-bold text-3xl text-gray-900 mb-3">Check your email</h2>
        <p className="text-gray-600">
          We sent a login link to <strong>{email}</strong>.
          Click the link in the email to access the member portal.
        </p>
        <p className="text-sm text-gray-400 mt-4">
          Don't see it? Check your spam folder.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <h1 className="font-playfair font-bold text-3xl text-gray-900 mb-2">Member Login</h1>
      <p className="text-gray-500 mb-8">
        Enter your email address and we'll send you a secure login link.
        This section is for Pine Brook Meadows residents only.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            autoFocus
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full bg-primary-700 hover:bg-primary-800">
          {loading ? 'Sending...' : 'Send login link'}
        </Button>
      </form>
    </div>
  )
}
```

**Step 2: Create `web/src/pages/AuthCallback.tsx`**

```tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

// Supabase redirects here after the user clicks the magic link.
// The supabase client automatically exchanges the token from the URL hash.
export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        navigate('/documents', { replace: true })
      }
    })
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-gray-500">Signing you in...</p>
    </div>
  )
}
```

**Step 3: Commit**

```bash
cd /Users/monika.daryani/code/hoa_website
git add web/src/pages/Login.tsx web/src/pages/AuthCallback.tsx
git commit -m "feat: add Login page with magic link flow and auth callback"
```

---

## Task 11: Documents page (protected)

**Files:**
- Create: `web/src/pages/Documents.tsx`

**Step 1: Install lucide-react if not already present**

```bash
cd web && npm install lucide-react
```

**Step 2: Create `web/src/pages/Documents.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { FileText, Download } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { sanityClient } from '@/lib/sanity'
import type { HoaDocument } from '@/types/sanity'

const CATEGORIES = [
  { value: 'governing', label: 'Governing Documents' },
  { value: 'minutes', label: 'Meeting Minutes' },
  { value: 'financial', label: 'Financial Documents' },
] as const

function DocList({ docs }: { docs: HoaDocument[] }) {
  if (docs.length === 0) {
    return <p className="text-gray-400 py-8 text-center">No documents in this category yet.</p>
  }
  return (
    <div className="space-y-3">
      {docs.map((doc) => (
        <div key={doc._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">{doc.title}</p>
              {doc.description && <p className="text-sm text-gray-500">{doc.description}</p>}
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1.5 ml-4 flex-shrink-0">
            <a href={doc.file.asset.url} target="_blank" rel="noopener noreferrer" download>
              <Download className="h-4 w-4" />
              Download
            </a>
          </Button>
        </div>
      ))}
    </div>
  )
}

export default function Documents() {
  const [docs, setDocs] = useState<HoaDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sanityClient
      .fetch<HoaDocument[]>(
        `*[_type == "hoaDocument"]{ _id, title, description, category, file{ asset->{ url } } } | order(title asc)`
      )
      .then((data) => { setDocs(data); setLoading(false) })
  }, [])

  const byCategory = (cat: string) => docs.filter((d) => d.category === cat)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-playfair font-bold text-4xl text-gray-900 mb-2">Documents</h1>
      <p className="text-gray-500 mb-8">HOA governing documents, meeting minutes, and financial reports</p>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <Tabs defaultValue="governing">
          <TabsList className="mb-6">
            {CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {CATEGORIES.map((cat) => (
            <TabsContent key={cat.value} value={cat.value}>
              <DocList docs={byCategory(cat.value)} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
```

**Step 3: Commit**

```bash
cd /Users/monika.daryani/code/hoa_website
git add web/src/pages/Documents.tsx
git commit -m "feat: add Documents page with governing/minutes/financial tabs"
```

---

## Task 12: Directory page (protected)

**Files:**
- Create: `web/src/pages/Directory.tsx`

**Step 1: Create `web/src/pages/Directory.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { User, Home, Phone, Mail, Calendar } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

interface Homeowner {
  id: string
  name: string
  address: string
  phone: string | null
  email: string | null
  move_in_date: string | null
}

function HomeownerCard({ h }: { h: Homeowner }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 font-playfair text-lg">
          <User className="h-4 w-4 text-primary-600" />
          {h.name}
        </CardTitle>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
          <Home className="h-3.5 w-3.5" />
          {h.address}
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {h.phone && (
          <a href={`tel:${h.phone}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-700">
            <Phone className="h-3.5 w-3.5 text-gray-400" />
            {h.phone}
          </a>
        )}
        {h.email && (
          <a href={`mailto:${h.email}`} className="flex items-center gap-2 text-sm text-primary-700 hover:underline">
            <Mail className="h-3.5 w-3.5 text-gray-400" />
            {h.email}
          </a>
        )}
        {h.move_in_date && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            Moved in {new Date(h.move_in_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function groupByStreet(homeowners: Homeowner[]) {
  const map = new Map<string, Homeowner[]>()
  homeowners.forEach((h) => {
    const street = h.address.split(',')[0].trim()
    if (!map.has(street)) map.set(street, [])
    map.get(street)!.push(h)
  })
  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
}

export default function Directory() {
  const [homeowners, setHomeowners] = useState<Homeowner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('homeowners')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setHomeowners(data ?? [])
        setLoading(false)
      })
  }, [])

  const streetGroups = groupByStreet(homeowners)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-playfair font-bold text-4xl text-gray-900 mb-2">Member Directory</h1>
      <p className="text-gray-500 mb-8">Connect with your neighbors in Pine Brook Meadows</p>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Residents</TabsTrigger>
            <TabsTrigger value="by-street">By Street</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {homeowners.map((h) => <HomeownerCard key={h.id} h={h} />)}
            </div>
            {homeowners.length === 0 && (
              <p className="text-gray-400 text-center py-12">No residents in the directory yet.</p>
            )}
          </TabsContent>

          <TabsContent value="by-street">
            <div className="space-y-10">
              {streetGroups.map(([street, residents]) => (
                <div key={street}>
                  <h3 className="font-playfair text-2xl font-semibold text-primary-700 mb-4">{street}</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {residents.map((h) => <HomeownerCard key={h.id} h={h} />)}
                  </div>
                </div>
              ))}
              {streetGroups.length === 0 && (
                <p className="text-gray-400 text-center py-12">No residents in the directory yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
cd /Users/monika.daryani/code/hoa_website
git add web/src/pages/Directory.tsx
git commit -m "feat: add Directory page with all/by-street views"
```

---

## Task 13: Seed real content into Sanity

**Step 1: Log into Sanity Studio**

```bash
cd studio && npm run dev
```
Open `http://localhost:3333`

**Step 2: Add Site Settings**

Click "Site Settings" → fill in:
- Hero tagline: "A welcoming community in Sammamish, WA"
- Park photo: upload a photo of the community park
- Property manager name: Jeff Kirkman
- Property manager email: jkirkman@pcamgmt.com
- Property manager phone: (425) 343-7221
- Mailing address: P.O. Box 991, Monroe, WA 98272

**Step 3: Add Board Members** (in order)

1. Judy Adams — President — order: 1
2. Pam Miller — Vice President — order: 2
3. Navranjan Khanna — Treasurer — order: 3
4. Kersten Brinkworth — Secretary — order: 4

**Step 4: Add real Vendors**

Remove the fake (555) vendors from the old site. Add only real ones:
- Raul Garcia — Landscaping & Lawn Care — 425-445-9001
- John Rodgers — Handyman — 714-697-5042
- (Add any other real vendors the board knows of)

**Step 5: Upload real documents**

Upload PDFs from `pinebrook-meadows-hub/public/`:
- `4.0_CCRs_PBMHOA.pdf` → Title: "CC&Rs" → Category: Governing Documents
- `4.1_RoofAmend_PBMHOA.pdf` → Title: "Roof Amendment" → Category: Governing Documents
- `7.0_RulesRegulations_PBMHOA.pdf` → Title: "Rules & Regulations" → Category: Governing Documents
- `241009_Owners_PBMHOA.pdf` → Title: "Owners List (Oct 2024)" → Category: Governing Documents

Upload any meeting minutes and financial docs from your files.

**Step 6: Add a first announcement**

Title: "Welcome to the new Pine Brook Meadows website"
Date: today
Category: General
Pinned: Yes
Body: Something welcoming for residents.

**Step 7: Add member emails to Supabase auth**

Go to Supabase dashboard → Authentication → Users.
For each community member email, you can either:
- Wait for them to use the magic link (Supabase auto-creates the user)
- Or pre-create users via the dashboard to whitelist emails before launch

Note: Supabase magic links work for ANY email by default. If you want to restrict to only known residents, you'll need to implement a check after login (compare session email against a whitelist table). For now, trust that only residents know the site exists.

---

## Task 14: Netlify deploy

**Files:**
- Create: `web/netlify.toml`

**Step 1: Create `web/netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This ensures React Router routes work when users navigate directly to `/documents` etc.

**Step 2: Push to GitHub**

```bash
cd /Users/monika.daryani/code/hoa_website
git add web/netlify.toml
git commit -m "feat: add Netlify config"
# Create a GitHub repo named "pinebrook-meadows-hoa" and push
git remote add origin https://github.com/YOUR_USERNAME/pinebrook-meadows-hoa.git
git push -u origin main
```

**Step 3: Deploy on Netlify**

1. Go to netlify.com → "Add new site" → "Import an existing project"
2. Connect GitHub → select the repo
3. Base directory: `web`
4. Build command: `npm run build`
5. Publish directory: `web/dist`
6. Add environment variables (Settings → Environment variables):
   - `VITE_SANITY_PROJECT_ID`
   - `VITE_SANITY_DATASET` = `production`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Deploy site

**Step 4: Connect custom domain**

In Netlify → Domain settings → Add custom domain: `pinebrookmeadowswa.com`
Follow Netlify's instructions to update DNS records with your domain registrar.

**Step 5: Update Supabase auth settings with production URL**

Go to Supabase → Authentication → URL Configuration:
- Site URL: `https://pinebrookmeadowswa.com`
- Add Redirect URL: `https://pinebrookmeadowswa.com/**`

**Step 6: Deploy Sanity Studio for board members**

```bash
cd studio
npx sanity deploy
```

Choose a studio hostname (e.g., `pinebrook-meadows`).
Studio will be available at: `https://pinebrook-meadows.sanity.studio`

Add the 3 board members as Sanity project members:
Sanity dashboard → Manage → Members → Invite

**Step 7: Verify the full flow**

- [ ] Home page loads with board info and announcements from Sanity
- [ ] Announcements page shows all announcements
- [ ] Vendors page shows real vendors
- [ ] `/documents` redirects to `/login` when not logged in
- [ ] Magic link login flow works end-to-end
- [ ] Documents page shows uploaded PDFs with download links
- [ ] Directory page shows homeowners from Supabase
- [ ] Board member can log into Sanity Studio and post an announcement

---

## Summary

| Step | What's built |
|---|---|
| Tasks 1-2 | Project scaffolded (React web app + Sanity studio) |
| Task 3 | Supabase database and RLS configured |
| Task 4 | API clients wired up with env vars |
| Task 5 | Auth context + protected routes (with tests) |
| Task 6 | Navbar, Footer, Layout, Router |
| Tasks 7-9 | Public pages: Home, Announcements, Vendors |
| Tasks 10 | Login + magic link auth callback |
| Tasks 11-12 | Protected pages: Documents, Directory |
| Task 13 | Real content seeded in Sanity + Supabase |
| Task 14 | Deployed to Netlify, custom domain, Sanity Studio live |
