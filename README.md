# Motion Industries — CS499 Capstone
**Spring 2026 | Team Project**

## Overview
Prototype for Motion Industries that adds PDF and CSV export to individual product pages, with user authentication and an AI chatbot assistant powered by Groq (llama-3.3-70b-versatile).

## Team & Ownership
| Name | Role | Files Owned |
|------|------|-------------|
| John Hernandez | Full-Stack Lead / Architect | `next.config.js`, `lib/api.ts`, API wiring, general support |
| Kerry | Frontend — Auth | `src/app/signin/`, `src/app/signup/`, `src/lib/auth.ts` |
| AJ Osei | Frontend — Discovery | `src/app/page.tsx`, `src/app/search/` |
| Josh Little | Frontend / QA | `src/app/product/[id]/`, `src/app/chatbot/ChatBotUI.tsx` |
| Mouhamad Diop | Backend Lead | `ProductController.java`, `AuthController.java`, `ChatBotController.java`, `AuthService.java` |
| Talal Naser | Database & API | `database/migrations/`, `UserRepository.java`, `ProductRepository.java` |

## Tech Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS — runs on `http://localhost:3000`
- **Backend**: Java 17 + Spring Boot 3 + Spring Security — runs on `http://localhost:8080`
- **Database**: PostgreSQL 15+ (also compatible with PostgreSQL 17)

## Project Structure
```
motion-industries/
├── frontend/
│   └── src/app/
│       ├── page.tsx                    # Homepage (AJ)
│       ├── search/page.tsx             # Search (AJ)
│       ├── product/[id]/page.tsx       # Product detail + export (Josh)
│       ├── signin/page.tsx             # Sign In (Kerry)
│       ├── signup/page.tsx             # Sign Up (Kerry)
│       ├── api/image-proxy/route.ts    # Image proxy for PDF embedding (John)
│       ├── chatbot/
│       │   └── ChatBotUI.tsx           # Floating chatbot widget (Josh)
│       └── lib/
│           ├── auth.ts                 # Session helpers (Kerry)
│           ├── api.ts                  # Axios instance + JWT interceptor (Kerry)
│           └── categoryMap.ts          # UI category mapping (John)
├── backend/src/main/java/com/motionindustries/
│   ├── controller/
│   │   ├── ProductController.java
│   │   ├── AuthController.java
│   │   └── ChatBotController.java
│   ├── service/
│   │   └── AuthService.java
│   ├── model/
│   │   ├── Product.java
│   │   ├── User.java
│   │   └── AuthDTOs.java
│   ├── repository/
│   │   ├── ProductRepository.java
│   │   └── UserRepository.java
│   └── config/
│       ├── SecurityConfig.java
│       ├── JwtUtil.java
│       └── JwtFilter.java
└── database/migrations/
    ├── 001_init.sql          # Products table + 8 seed products
    ├── 002_users.sql         # Users table + admin seed user
    ├── 003_add_image_url.sql # Adds image_url column to products
    ├── 004_more_products.sql # 50+ additional products with images
    └── 005_seed_images.sql   # Backfills images for original 8 products
```

---

## Prerequisites

Before running the project, make sure the following are installed:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| Java JDK | 17+ | https://adoptium.net |
| Maven | 3.8+ | https://maven.apache.org (or use included `./mvnw`) |
| PostgreSQL | 15+ | https://www.postgresql.org/download |

---

## Getting Started

### 1. Install PostgreSQL

**Windows:**
1. Download the installer from https://www.postgresql.org/download/windows/
2. Run the installer — use default port `5432`
3. Set the `postgres` superuser password to `postgres` (or note your password for the env var step below)
4. After install, open **pgAdmin** or use the `psql` command-line tool

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
```

---

### 2. Create the Database

Open a terminal and run:

```bash
psql -U postgres -c "CREATE DATABASE motion_industries;"
```

If prompted, enter your postgres password (`postgres` by default).

**Windows users** — if `psql` is not on your PATH, use the full path:
```
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE motion_industries;"
```

---

### 3. Run All Migrations

Run all 5 migration files in order. These create the tables and seed all product/user data.

**From the project root (`motion-industries 2/`):**

```bash
psql -U postgres -d motion_industries -f database/migrations/001_init.sql
psql -U postgres -d motion_industries -f database/migrations/002_users.sql
psql -U postgres -d motion_industries -f database/migrations/003_add_image_url.sql
psql -U postgres -d motion_industries -f database/migrations/004_more_products.sql
psql -U postgres -d motion_industries -f database/migrations/005_seed_images.sql
```

**Windows full path example:**
```
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d motion_industries -f "database/migrations/001_init.sql"
```

Repeat for all 5 files. When complete you should have ~58 products and 1 admin user in the DB.

**Verify the setup:**
```bash
psql -U postgres -d motion_industries -c "SELECT COUNT(*) FROM products;"
# Should return ~58

psql -U postgres -d motion_industries -c "SELECT COUNT(*) FROM users;"
# Should return 1
```

---

### 4. Configure the Database Connection

The backend connects to PostgreSQL using settings in `backend/src/main/resources/application.properties`.

**Default configuration (no changes needed if using defaults):**
```
spring.datasource.url=jdbc:postgresql://localhost:5432/motion_industries
spring.datasource.username=postgres
spring.datasource.password=postgres
```

**If your PostgreSQL uses different credentials**, set environment variables before starting the backend:

```bash
# Mac/Linux
export DB_USERNAME=your_username
export DB_PASSWORD=your_password

# Windows (Command Prompt)
set DB_USERNAME=your_username
set DB_PASSWORD=your_password

# Windows (PowerShell)
$env:DB_USERNAME="your_username"
$env:DB_PASSWORD="your_password"
```

---

### 5. Configure the Groq API Key (for LLM Chatbot)

The chatbot uses Groq. Without the key it falls back to rule-based replies. To enable LLM responses:

1. Create the file `backend/src/main/resources/secrets.properties`
2. Add the following line (get the key from John):
   ```
   groq.api.key=YOUR_KEY_HERE
   ```
3. This file is gitignored — never commit it.

---

### 6. Start the Backend

```bash
cd backend

# Mac/Linux
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
mvn spring-boot:run
```

The backend starts on `http://localhost:8080`. Wait for:
```
Started MotionIndustriesApplication in X.XXX seconds
```

---

### 7. Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:3000`.

---

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_USERNAME` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `JWT_SECRET` | (built-in default) | JWT signing secret — change in production |
| `JWT_EXPIRY` | `86400000` | JWT expiry in ms (default: 24 hours) |

---

## API Endpoints

| Method | URL | Auth Required | Description |
|--------|-----|---------------|-------------|
| GET | `/api/products` | No | List / search all products |
| GET | `/api/products/:id` | No | Get single product by ID |
| POST | `/api/products` | No | Create a product |
| GET | `/api/products/:id/export/pdf` | No | Export product as PDF (server-side) |
| GET | `/api/products/:id/export/csv` | No | Export product as CSV (server-side) |
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/signin` | No | Login — returns JWT |
| GET | `/api/auth/me` | Yes (Bearer JWT) | Get current authenticated user |
| POST | `/api/chatbot/message` | No | Send message to chatbot |
| GET | `/api/image-proxy?url=...` | No | Proxy CDN image for PDF embedding |

---

## Key Features

- **Product Export**: PDF and CSV export from the product detail page in 3 clicks
- **PDF includes product image** via `/api/image-proxy` (Next.js route that proxies Motion Industries CDN)
- **CSV format** matches Motion Industries cart format (15 columns)
- **User Auth**: JWT-based sign up / sign in with BCrypt hashed passwords
- **AI Chatbot**: Groq LLM (llama-3.3-70b-versatile) with rule-based fallback

---

## Demo Path

```
1. Go to http://localhost:3000
2. Click Sign Up — create an account
3. Search for a product (e.g., "bearing")
4. Click a product to open the detail page
5. Click "Export PDF" — downloads a product spec sheet with image
6. Click "Export CSV" — downloads a Motion Industries cart-format CSV
7. Open the chatbot widget (bottom-right) and ask a question
```

---

## Test Credentials

- **Email**: `admin@motionindustries.com`
- **Password**: `password123`
