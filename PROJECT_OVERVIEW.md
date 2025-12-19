# Project Overview: NestJS Learning Management System (LMS)

## 🎯 Project Purpose

This is a **Learning Management System (LMS) API** built with NestJS, TypeScript, and PostgreSQL. The system supports authentication for both students and staff, and provides book management functionality for a library system.

---

## 🛠 Technology Stack

### Core Framework

- **NestJS 11** - Progressive Node.js framework
- **TypeScript 5.7** - Type-safe development
- **Express** - HTTP server framework

### Database & ORM

- **PostgreSQL 16** - Relational database
- **Drizzle ORM 0.45** - Type-safe ORM
- **pg** - PostgreSQL client driver

### Authentication & Security

- **Passport.js** - Authentication middleware
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing

### Testing

- **Vitest 4.0** - Fast unit testing framework
- **SWC** - Fast TypeScript/JavaScript compiler

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Commit message validation
- **Swagger/OpenAPI** - API documentation

### Package Manager

- **pnpm 10.26** - Fast, disk space efficient package manager

---

## 📁 Project Structure

```
nestjs-demo/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── app.controller.ts       # Root controller
│   ├── app.service.ts          # Root service
│   │
│   ├── auth/                   # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts     # Login, validation, JWT generation
│   │   ├── auth.controller.ts  # Login & profile endpoints
│   │   ├── strategies/         # Passport strategies
│   │   │   ├── local.strategy.ts    # Email/password auth
│   │   │   └── jwt.strategy.ts      # JWT token validation
│   │   ├── guards/             # Route protection
│   │   │   ├── local-auth.guard.ts
│   │   │   └── jwt-auth.guard.ts
│   │   ├── decorators/         # Custom decorators
│   │   │   └── current-user.decorator.ts
│   │   └── dto/                # Data Transfer Objects
│   │       ├── login.dto.ts
│   │       └── auth-response.dto.ts
│   │
│   ├── books/                  # Books management module
│   │   ├── books.module.ts
│   │   ├── books.service.ts    # CRUD operations
│   │   ├── books.controller.ts # REST endpoints
│   │   └── dto/
│   │       ├── create-book.dto.ts
│   │       └── update-book.dto.ts
│   │
│   └── database/               # Database layer
│       ├── database.module.ts  # Global database module
│       ├── database.service.ts # Drizzle connection & pool
│       └── schema/             # Database schemas
│           ├── student.schema.ts
│           ├── staff.schema.ts
│           ├── book.schema.ts
│           └── example.schema.ts (users)
│
├── test/                       # E2E tests
│   └── app.e2e-spec.ts
│
├── .husky/                     # Git hooks
│   ├── pre-commit              # Runs lint-staged
│   ├── pre-push                # Runs tests
│   └── commit-msg              # Validates commit messages
│
├── docker-compose.yml          # PostgreSQL container
├── drizzle.config.ts           # Drizzle ORM configuration
├── vitest.config.ts            # Unit test configuration
├── vitest.e2e.config.ts        # E2E test configuration
├── eslint.config.mjs           # ESLint configuration
├── commitlint.config.ts        # Commit message rules
└── package.json
```

---

## ✨ Key Features

### 1. Authentication System

Supports **dual authentication** for both students and staff.

- **Login Endpoint**: `POST /auth/login`
  - Validates email/password
  - Checks both `students` and `staff` tables
  - Returns JWT token with user type information
- **Profile Endpoint**: `POST /auth/profile`
  - Protected route requiring JWT token
  - Returns current user information

**How it works:**

1. User sends email/password
2. Local strategy validates credentials
3. Auth service checks students table first, then staff table
4. JWT token generated with user type included
5. JWT strategy validates tokens on protected routes

### 2. Books Management

Complete **CRUD operations** for book management.

**Endpoints:**

- `POST /books` - Create a new book
- `GET /books` - Get all books
- `GET /books/:id` - Get book by ID
- `PATCH /books/:id` - Update a book
- `DELETE /books/:id` - Delete a book

**Features:**

- ISBN uniqueness validation
- Copy management (total/available copies)
- Auto-updates availability status
- All endpoints require JWT authentication

### 3. Database Layer

**Drizzle ORM** with PostgreSQL for type-safe database operations.

**Schemas:**

- **Students**: id, email, password, firstName, lastName, studentId, etc.
- **Staff**: id, email, password, firstName, lastName, staffId, role, etc.
- **Books**: id, isbn, title, author, publisher, copies, etc.
- **Users**: id, email, name, password (legacy table)

**Connection:**

- Connection pooling for performance
- Global module (available everywhere)
- Type-safe queries
- Automatic lifecycle management

---

## ⚙️ Configuration Files

### 1. `main.ts` - Application Bootstrap

- Creates NestJS application
- Sets up global validation pipe
- Configures Swagger documentation
- Starts server on port 3000

### 2. `app.module.ts` - Root Module

- Imports: ConfigModule, DatabaseModule, AuthModule, BooksModule
- Makes ConfigModule global for environment variables

### 3. `drizzle.config.ts` - Database Configuration

- Schema location
- Database connection settings
- Migration output directory

### 4. `vitest.config.ts` - Test Configuration

- SWC for fast compilation
- Test file patterns
- Coverage settings
- Setup files

### 5. `eslint.config.mjs` - Linting Rules

- TypeScript rules
- Prettier integration
- Vitest globals for test files

### 6. `commitlint.config.ts` - Commit Message Rules

- Conventional commit format
- Type validation
- Message length limits

### 7. `docker-compose.yml` - PostgreSQL Setup

- PostgreSQL 16 Alpine image
- Persistent volumes
- Health checks
- Network isolation

---

## 🔄 Development Workflow

### Git Hooks (Husky)

1. **Pre-commit Hook**:
   - Runs `lint-staged`
   - Formats code with Prettier
   - Lints with ESLint
   - Auto-fixes issues

2. **Commit-msg Hook**:
   - Validates commit message format
   - Enforces conventional commits

3. **Pre-push Hook**:
   - Runs all tests
   - Prevents push if tests fail

### Code Quality

- **ESLint**: TypeScript and NestJS rules
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **Commitlint**: Commit message validation

---

## 📚 API Documentation

**Swagger UI** available at: `http://localhost:3000/api`

**Features:**

- Interactive API explorer
- Try-it-out functionality
- JWT authentication support
- Request/response schemas

---

## 🔐 Environment Variables

Required in `.env`:

```env
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=nestjs_lms
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nestjs_lms

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d

# Application
PORT=3000
NODE_ENV=development
```

---

## 🔄 How It Works Together

### Request Flow Example: Creating a Book

1. **Client** sends: `POST /books` with JWT token
2. **JWT Guard** validates token
3. **JWT Strategy** extracts user info
4. **Books Controller** receives request
5. **Validation Pipe** validates DTO
6. **Books Service** processes business logic
7. **Database Service** executes query via Drizzle
8. **PostgreSQL** returns data
9. **Response** sent back to client

### Authentication Flow

1. **Login Request**: `POST /auth/login` with email/password
2. **Local Guard** activates Local Strategy
3. **Auth Service** validates credentials
4. Checks students table, then staff table
5. Password verified with bcrypt
6. **JWT token** generated
7. Token returned to client
8. Client uses token in Authorization header
9. **JWT Guard** validates token on protected routes

---

## 📝 Available Commands

```bash
# Development
pnpm start:dev          # Start in watch mode
pnpm build              # Build for production
pnpm start:prod         # Run production build

# Testing
pnpm test               # Run unit tests
pnpm test:watch         # Watch mode
pnpm test:cov           # With coverage
pnpm test:e2e           # E2E tests

# Database
pnpm db:generate        # Generate migrations
pnpm db:push            # Push schema changes
pnpm db:studio          # Open Drizzle Studio

# Code quality
pnpm lint               # Lint code
pnpm format             # Format code
```

---

## 🛡️ Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Route protection with guards
- ✅ Input validation with class-validator
- ✅ SQL injection protection (Drizzle ORM)

---

## 📊 Summary

This is a **production-ready NestJS API** with:

- ✅ Modular architecture
- ✅ Type-safe database operations
- ✅ Authentication for multiple user types
- ✅ RESTful API with Swagger docs
- ✅ Comprehensive testing setup
- ✅ Code quality tools
- ✅ Git hooks for quality control
- ✅ Docker support for database

The project follows NestJS best practices and is structured for scalability and maintainability.
