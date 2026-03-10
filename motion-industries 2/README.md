# Motion Industries — CS499 Capstone
**Spring 2026 | Team Project**

## Overview
Prototype for Motion Industries that adds PDF and CSV export to individual product pages, with user auth and an AI chatbot assistant.

## Team & Ownership
| Name | Role | Files Owned |
|------|------|-------------|
| John Hernandez | Full-Stack Lead / Architect | `next.config.js`, API wiring, general support |
| Kerry | Frontend — Auth | `src/app/signin/`, `src/app/signup/`, `src/lib/auth.ts` |
| AJ Osei | Frontend — Discovery | `src/app/page.tsx`, `src/app/search/` |
| Josh Little | Frontend / QA | `src/app/product/[id]/`, `src/app/chatbot/ChatBotUI.tsx` |
| Mouhamad Diop | Backend Lead | `ProductController.java`, `AuthController.java`, `ChatBotController.java`, `AuthService.java` |
| Talal Naser | Database & API | `database/migrations/`, `UserRepository.java`, `ProductRepository.java` |

## Tech Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Java 17 + Spring Boot 3 + Spring Security
- **Database**: PostgreSQL 15

## Project Structure
```
motion-industries/
├── frontend/
│   └── src/app/
│       ├── page.tsx              # Homepage (AJ)
│       ├── search/page.tsx       # Search (AJ)
│       ├── product/[id]/page.tsx # Product detail + export (Josh)
│       ├── signin/page.tsx       # Sign In (Kerry)
│       ├── signup/page.tsx       # Sign Up (Kerry)
│       ├── chatbot/
│       │   └── ChatBotUI.tsx     # Floating chatbot widget (Josh)
│       └── lib/auth.ts           # Session helpers (Kerry)
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
│       └── SecurityConfig.java
└── database/migrations/
    ├── 001_init.sql
    └── 002_users.sql
```

## Getting Started

### 1. Database
```bash
psql -U postgres -c "CREATE DATABASE motion_industries;"
psql -U postgres -d motion_industries -f database/migrations/001_init.sql
psql -U postgres -d motion_industries -f database/migrations/002_users.sql
```

### 2. Backend
```bash
cd backend
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

## API Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/products` | List / search products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product |
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/signin` | Login |
| GET | `/api/auth/me` | Current user (requires token) |
| POST | `/api/chatbot/message` | Send chat message |

## Key Feature
Product pages export as **PDF** or **CSV** in 3 clicks or fewer from the homepage.

## Test Credentials
- Email: `admin@motionindustries.com`
- Password: `password123`
