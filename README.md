# Mount Print Zone (MPZ) - E-Commerce & Print Shop Management System

[![Deployed with Vercel](https://vercel.com/button)](https://mountprintzone.com)

Precision Commercial Printing & Packaging solution built with Next.js 15, Prisma, and TailwindCSS. for **Mount Print Zone**, a commercial printing and packaging hub located in **Vasanth Nagar, Bengaluru (near Mount Carmel College)**.

---

## 🛠 Technology Stack

- **Frontend & App Framework**: Next.js 15 (App Router, Server Actions, API Routes)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Dark/Light Mode Theme Switching (`next-themes`), Glassmorphism UI
- **Animations**: Framer Motion
- **Database & ORM**: PostgreSQL with Prisma ORM (SQLite adapter pre-configured for out-of-the-box local execution)
- **Authentication**: JWT Session Cookie Authentication (`jose` + `bcryptjs`) with Role-Based Access Control (`ADMIN` vs `STAFF`)
- **PDF Generation**: Dynamic Tax Invoice Generator (`jspdf` + `qrcode`)
- **File Uploads**: Cloudinary integration with local disk fallback (`public/uploads`)
- **Emails**: Resend API integration with console log fallback

---

## 📍 Store Information (Pre-configured)

- **Store Name**: Mount Print Zone
- **Address**: `16 1st Cross, 12th Main Rd, near MOUNT CARMEL COLLEGE, Vasanth Nagar, Bengaluru, Karnataka 560001`
- **Phone**: `+91 88675 09334`
- **WhatsApp**: `+91 88675 09334`
- **Email**: `contact@mountprintzone.com`
- **Business Hours**: Monday - Saturday: 9:30 AM - 8:30 PM (Sunday Closed)

---

## 🔑 Production Environment Variables (`.env`)

To connect external cloud services for production deployment (e.g. Vercel, Supabase, Cloudinary, Resend), update your `.env` file:

```env
# Production PostgreSQL Connection (Neon, Supabase, AWS RDS, Render)
DATABASE_URL="postgresql://username:password@ep-host.region.aws.neon.tech/mpz_db?sslmode=require"

# JWT Secret Token (Change to a long random secret for production)
JWT_SECRET="your_production_secure_jwt_secret_key_2026"

# Cloudinary Integration (For storing customer artwork files)
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# Resend Integration (For automated customer email alerts)
RESEND_API_KEY="re_123456789_your_resend_key"
SENDER_EMAIL="orders@mountprintzone.com"

# Site Domain
NEXT_PUBLIC_APP_URL="https://mountprintzone.com"
```

---

## 🚀 How to Deploy Live to Vercel

1. Push this repository to GitHub / GitLab.
2. Go to [Vercel Dashboard](https://vercel.com/new) and import the repository.
3. Add your Environment Variables (`DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_*`, `RESEND_API_KEY`).
4. Set Build Command: `npx prisma db push && next build`
5. Click **Deploy**.

---

## 👥 Managing Admin & Staff Accounts

- **Login URL**: `/admin/login`
- **Default Super Admin**: `admin@mountprintzone.com` | Password: `admin123`
- **Default Store Staff**: `staff@mountprintzone.com` | Password: `staff123`
- **Register New Users**: Super Admins can add new Staff or Admin accounts directly from `/admin/users`.
