# Buxoro Avto Magnat — Premium Chevrolet Dealership Website

Buxoro Avto Magnat is a complete, production-ready automotive dealership website based in Bukhara, Uzbekistan. The website features a luxurious, elegant showroom aesthetic inspired by top-tier automotive brands (Mercedes-Benz, BMW, Tesla) and is tailored for Chevrolet vehicles.

The application is built using **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS v4**, and is fully multilingual (Uzbek, Russian, English) and responsive with Light/Dark mode toggling.

---

## 🌟 Key Features

1. **Elegant Showroom UI/UX**: Premium dark/light themes, sleek gold gradients (`#D9A300`), glassmorphic layouts, and smooth animations using Framer Motion.
2. **Interactive Vehicles Catalog**: Instantly search, filter, and sort models. Features dynamic comparison and favoriting (wishlist) boards.
3. **Dynamic 360° Spin Simulator**: Visualizer slider that spins the vehicle view through multiple angles.
4. **Active Color Picker**: Dynamic exterior color selector that swaps the preview asset.
5. **Real-time Credit & Installment Calculators**: Interactive calculators that adjust down payments, loan terms, and interest rates to calculate monthly fees in real-time.
6. **AI Car Advisor**: Intelligent advisory system recommending Chevrolet models based on budget constraints and target use.
7. **Lead Forms & Integrations**: Integrated forms for booking test-drives, requesting price quotes, and Trade-In valuation (with mock image uploads), including mock Telegram support alerts.
8. **Client Dashboard**: Personalized customer panel showing active test drives, trade-ins, and wishlists.
9. **Fully Featured Admin Panel**:
   - **Dashboard Analytics**: CSS-based line/bar chart displaying weekly traffic and leads growth.
   - **Inventory Management**: Full CRUD operations for cars, categories, and colors.
   - **Lead Managers**: Action panels to approve/complete test drives and value trade-in models.
   - **Credit Settings**: Add, configure, and delete bank programs.
   - **Website Configurations**: Configure office address, phone numbers, and Telegram link.
10. **Dual-Mode Database Service (Self-Seeding)**:
    - **PostgreSQL / Prisma Mode**: Automatically runs via Prisma client when `DATABASE_URL` is set in `.env`.
    - **Zero-Setup Fallback Mode**: Uses a persistent, file-based JSON database engine located at `src/data/db_local/`. It self-seeds automatically on the first request with authentic Uzbek Chevrolet data (Malibu 2, Tracker 2, Tahoe, Onix, Captiva, Cobalt, Gentra) so the app works **instantly** out-of-the-box.

---

## 📂 Directory Structure

```
├── prisma/
│   └── schema.prisma         # Prisma Schema for PostgreSQL
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai-recommend/ # AI Recommendation Endpoint
│   │   │   ├── auth/         # Login & Register Handlers
│   │   │   ├── bookings/     # Test Drive & Trade-In leads processor
│   │   │   ├── car/          # Single car getter
│   │   │   ├── cars/         # Cars list & CRUD
│   │   │   ├── categories/   # Categories getter
│   │   │   ├── colors/       # Colors getter
│   │   │   ├── credit-programs/ # Banks CRUD
│   │   │   ├── news/         # News CRUD
│   │   │   └── settings/     # Veb-sayt settings
│   │   ├── admin/
│   │   │   └── dashboard/    # Fully-featured Admin Panel
│   │   ├── catalog/
│   │   │   ├── page.tsx      # Vehicles catalog with Compare workspace
│   │   │   └── [id]/         # Detailed car sheet & 360 Visualizer
│   │   ├── credit/           # Loan Application calculator
│   │   ├── trade-in/         # Trade-in Express Evaluator
│   │   ├── dashboard/        # Customer dashboard panel
│   │   ├── locations/        # Branch coordinates & map frames
│   │   ├── about/            # Showroom values & milestones
│   │   ├── login/            # Login with Quick-demo buttons
│   │   └── page.tsx          # Landing Hero page
│   ├── components/
│   │   ├── Navbar.tsx        # Blurred glass header with language switches
│   │   ├── Footer.tsx        # Styled footer with Google Maps
│   │   └── FloatingWidgets.tsx # Floating Telegram/WhatsApp support widgets
│   ├── context/
│   │   ├── LanguageContext.tsx # i18n switcher context (UZ, RU, EN)
│   │   ├── ThemeContext.tsx    # Class-based Dark/Light context
│   │   ├── AuthContext.tsx     # Session management
│   │   └── AppContext.tsx      # Wishlist / Compare storage
│   ├── data/
│   │   └── db_local/         # Local JSON persistence (self-seeds)
│   └── lib/
│       ├── dbService.ts      # Hybrid DB connection layer
│       └── translations.ts   # i18n translated dictionaries
└── next.config.ts            # Next.js configurations (Unsplash patterns)
```

---

## 🚀 Setup & Local Execution

### 1. Environment Configuration
Create a `.env` file in the root directory:
```env
# Optional: Set this to run on PostgreSQL + Prisma.
# If left blank or omitted, the app runs in Fallback JSON mode automatically!
DATABASE_URL="postgresql://username:password@localhost:5432/magnat_db"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Admin Access (Demo mode)
- Click **Kirish** (Log In) in the navbar.
- Select the gold **Admin Panel** quick login button, or log in manually using:
  - **Email**: `admin@magnat.uz`
  - **Password**: `admin123`
- The system will grant you full admin rights and redirect you to `/admin/dashboard`.

---

## 🗺️ Production Deployment Guide

### Option A: Vercel + Supabase (Recommended)

1. **Set up Supabase Database**:
   - Create a free project on [Supabase](https://supabase.com).
   - Go to Project Settings -> Database -> Connection string (URI) and copy the Connection String.
2. **Synchronize Database**:
   - Paste the Connection String as `DATABASE_URL` in your `.env`.
   - Run the Prisma migrations command to build tables in Supabase:
     ```bash
     npx prisma db push
     ```
   - Seed initial data into Supabase if required using:
     ```bash
     npx prisma db seed
     ```
3. **Deploy to Vercel**:
   - Push your repository to GitHub.
   - Import the project into [Vercel](https://vercel.com).
   - Add `DATABASE_URL` as an Environment Variable in Vercel settings.
   - Click **Deploy**. Vercel will automatically compile the TypeScript files and deploy the App Router routes.
