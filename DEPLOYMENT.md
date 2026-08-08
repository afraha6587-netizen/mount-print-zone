# 🚀 Mount Print Zone (MPZ) - Full Production Deployment Checklist

This document provides a step-by-step checklist to deploy the **Mount Print Zone** web application to production with custom domain, cloud PostgreSQL database, Cloudinary media storage, and Resend email notifications.

---

## 📋 Pre-Deployment Verification Matrix

| Check | Component | Status | Notes |
|---|---|---|---|
| ✅ | Next.js 15 App Router | Verified | Built with Zero Errors |
| ✅ | TypeScript Strict Mode | Verified | 0 Type Errors |
| ✅ | Prisma ORM Schema | Verified | 13 Relational Models Configured |
| ✅ | SQLite Local DB | Verified | Fully Seeded with Real Bengaluru Data |
| ✅ | Client PDF Invoicing | Verified | Auto-Generates Tax Invoices with QR Code |
| ✅ | Customer Review Modal | Verified | Public Submission & Admin Moderation |
| ✅ | Admin Banners & Coupons | Verified | Full Editable CRUD Interface |
| ✅ | Admin & Staff Registration | Verified | Secure JWT + RBAC Authentication |

---

## Step 1: Database Setup (Managed PostgreSQL)

Mount Print Zone uses **Prisma ORM**, which supports PostgreSQL out-of-the-box. Recommended cloud providers:
- **Neon** (Free managed PostgreSQL serverless): [neon.tech](https://neon.tech)
- **Supabase**: [supabase.com](https://supabase.com)
- **AWS RDS** or **Render PostgreSQL**

1. Create a PostgreSQL database on Neon or Supabase.
2. Copy your connection URL format:
   ```env
   DATABASE_URL="postgresql://user:password@ep-host.region.aws.neon.tech/mpz_db?sslmode=require"
   ```

---

## Step 2: Storage Setup (Cloudinary for Customer Artwork Files)

Customer print orders support uploading artwork files up to 50MB (PDF, AI, PSD, CDR, PNG, JPG, DWG, DOCX):

1. Create a free account at [Cloudinary](https://cloudinary.com).
2. Copy your credentials from the Cloudinary Dashboard:
   ```env
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```

---

## Step 3: Email Alerts (Resend API)

For sending instant order confirmation emails to customers:

1. Create a free account at [Resend](https://resend.com).
2. Create an API Key and add it:
   ```env
   RESEND_API_KEY="re_123456789_your_resend_key"
   SENDER_EMAIL="orders@mountprintzone.com"
   ```

---

## Step 4: Deploying to Vercel

1. **Push Code to GitHub / GitLab / Bitbucket**:
   ```bash
   git init
   git add .
   git commit -m "Mount Print Zone Production Build"
   git remote add origin https://github.com/your-username/mount-print-zone.git
   git push -u origin main
   ```

2. **Import Project to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new).
   - Click **Add New Project** and select your GitHub repository.

3. **Configure Environment Variables in Vercel**:
   Add the following variables under **Project Settings -> Environment Variables**:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `RESEND_API_KEY`
   - `SENDER_EMAIL`
   - `NEXT_PUBLIC_APP_URL`

4. **Deploy**:
   - Click **Deploy**. Vercel will automatically build the Next.js App Router bundle, execute `prisma db push`, and serve your live website!

---

## 🔑 Default Production Admin Credentials
- **Login URL**: `/admin/login`
- **Super Admin**: `admin@mountprintzone.com` | Password: `admin123`
- **Store Staff**: `staff@mountprintzone.com` | Password: `staff123`
