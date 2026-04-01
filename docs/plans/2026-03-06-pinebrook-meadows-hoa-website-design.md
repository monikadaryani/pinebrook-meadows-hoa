# Pine Brook Meadows HOA Website — Design Document
Date: 2026-03-06

## Overview

A clean, utility-first HOA website for Pine Brook Meadows (Sammamish, WA) hosted at `pinebrookmeadowswa.com`. Designed to serve both current residents (primary users) and potential new residents (secondary). Not marketing-heavy — the focus is easy access to community information and documents.

Rebuilt from scratch in `/hoa_website`, replacing the over-engineered Lovable-generated site in `/pinebrook-meadows-hub`.

---

## Tech Stack

| Layer | Choice | Cost |
|---|---|---|
| Frontend | React + Vite + TypeScript + Tailwind CSS + shadcn/ui | Free |
| CMS | Sanity (board members manage content) | Free tier (up to 3 editors) |
| Auth + DB | Supabase (magic link emails + member directory) | Free tier |
| Hosting | Netlify | Free tier |
| Domain | pinebrookmeadowswa.com | ~$15/yr |

Total monthly cost: $0

---

## Pages

| Page | URL | Access |
|---|---|---|
| Home | `/` | Public |
| Announcements | `/announcements` | Public |
| Vendors | `/vendors` | Public |
| Login | `/login` | Public |
| Documents | `/documents` | Members only (magic link) |
| Directory | `/directory` | Members only (magic link) |

No contact form — property manager contact info displayed publicly on Home page.

---

## Page Designs

### Home (`/`)
- Sticky navbar: Logo + "Pine Brook Meadows" | nav links | "Member Login" button
- Hero: Community park photo, "Pine Brook Meadows — Sammamish, WA", two CTAs: "View Announcements" + "Member Login"
- Latest Announcements: 2-3 most recent cards with "View all" link
- Board of Directors: 4 cards — name + role only (no personal contact details)
- Contact: Property manager block — Jeff Kirkman, jkirkman@pcamgmt.com, (425) 343-7221, P.O. Box 991 Monroe WA (manager's mailing address, not community address)

### Announcements (`/announcements`)
- All announcements, newest first
- Pinned announcements shown at top
- Each card: title, date, category badge (Meeting / Maintenance / Event / General), body text
- Managed entirely in Sanity

### Vendors (`/vendors`)
- Trusted local vendor cards: name, category, phone, email, short description
- Managed in Sanity (replaces hardcoded fake vendors from current site)

### Login (`/login`)
- Single email input field
- "Enter your email to receive a secure login link"
- Supabase magic link auth
- If email is not in the member list, link will not grant access
- On success: redirect to /documents (or original destination)

### Documents (`/documents`) — members only
- Three tabs: Governing Documents | Meeting Minutes | Financial Documents
- Each document: title, description, download button (PDF)
- Governing Docs: CC&Rs, Roof Amendment, Rules & Regulations (and future additions)
- Managed in Sanity (board members upload PDFs directly)

### Directory (`/directory`) — members only
- Homeowner cards: name, address, phone (optional), email (optional), move-in date (optional)
- Two views: All | By Street
- Admin-managed in Supabase — no self-service, no visibility toggle
- If a resident asks not to be listed, admin simply removes or omits them

---

## Content Model

### Sanity (board-managed content)

**Announcement**
- title (string)
- date (date)
- category (enum: Meeting | Maintenance | Event | General)
- body (rich text)
- pinned (boolean)

**Document**
- title (string)
- description (string)
- file (PDF asset)
- category (enum: Governing Docs | Meeting Minutes | Financial)

**Vendor**
- name (string)
- category (string)
- phone (string)
- email (string, optional)
- description (string)

**Board Member**
- name (string)
- role (string)
- displayOrder (number)

**Site Settings** (singleton)
- heroTagline (string)
- parkPhoto (image asset)
- propertyManagerName (string)
- propertyManagerEmail (string)
- propertyManagerPhone (string)
- propertyManagerMailingAddress (string)

### Supabase (member directory + auth)

**homeowners table**
- id (uuid)
- name (text)
- address (text)
- phone (text, nullable)
- email (text, nullable)
- move_in_date (date, nullable)
- created_at (timestamp)

**auth** — Supabase Auth handles magic link emails. A whitelist of valid member emails must be maintained. Only whitelisted emails receive access upon clicking the magic link.

---

## Auth Flow

1. User clicks "Member Login" anywhere on the site
2. Redirected to `/login` — enters email address
3. Supabase sends magic link email
4. User clicks link → authenticated → redirected to `/documents`
5. Session persists for 1 week (no need to log in every visit)
6. Non-members attempting to access `/documents` or `/directory` are redirected to `/login` with message: "This section is for Pine Brook Meadows residents. Enter your email to continue."
7. Logged-in state: nav shows Documents and Directory links + subtle "Logout" option

---

## Visual Style

Preserving the best of the current site's visual language:

- **Headings:** Playfair Display (elegant serif)
- **Body:** System sans-serif
- **Primary color:** Deep green
- **Background:** Light neutral / white
- **Components:** shadcn/ui cards, badges, buttons
- **Layout:** Clean, generous whitespace — utility-first

Dropped from current site:
- Full-screen hero with heavy gradient overlay
- Generic "About" section with placeholder nature copy
- Amenities section (pool, gym, etc. — not real for this HOA)
- Fake vendors with (555) phone numbers

---

## What Board Members Do

Board members (up to 3) log into `pinebrookmeadowswa.sanity.studio` to:
- Post, edit, or pin announcements
- Upload new PDFs (meeting minutes, financial docs, governing doc updates)
- Update vendor listings
- Update board member names/roles

They never touch code or Supabase.

---

## Future Considerations

- **Dues payment:** Stripe integration on a new `/pay` page (members only)
- **Maintenance requests:** Simple form that emails the property manager
- **Event calendar:** Upcoming community events managed in Sanity

---

## Out of Scope (deliberately excluded)

- Complex role-based auth (admin vs board vs member)
- Self-service resident profile management
- Contact/inquiry form (property manager email suffices)
- Community forum or social features
- Mobile app
