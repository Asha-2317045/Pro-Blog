# ProBlog Platform 

A full-stack, production-ready blogging platform built with **React**, **Express**, and **Prisma**.

##  Features

### Frontend
- **Authentication**: Secure Login/Register flow with JWT persistence.
- **Private Dashboard**: Manage your own blogs (Create, Read, Update, Delete).
- **Public Feed**: Paginated feed showing published stories from all users.
- **Interactive Features**: Like/Unlike system and real-time comments.
- **Responsive Design**: Minimalist UI built with Tailwind CSS and Lucide Icons.
- **State Management**: Data fetching and caching with React Query.

### Backend
- **Express Server**: Integrated with Vite for a seamless full-stack experience.
- **Prisma ORM**: Type-safe database access with SQLite.
- **Security**: 
  - Password hashing with `bcryptjs`.
  - JWT-based authorization.
  - API Rate limiting to prevent abuse.
  - Input validation using `Zod`.
- **Async Jobs**: Background processing for blog summary generation.
- **Logging**: Structured logging with `Pino`.

---

##  Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Query, React Router 7, Lucide React, Motion.
- **Backend**: Node.js, Express, Prisma, Zod, Bcryptjs, JSONWebToken.
- **Database**: SQLite (via Prisma).

---

## Project Structure

```text
├── prisma/
│   └── schema.prisma      # Database models & configuration
├── server/
│   ├── auth.ts            # Authentication logic & middleware
│   ├── blogs.ts           # Private blog management API
│   ├── public.ts          # Public feed & detail API
│   ├── db.ts              # Prisma client initialization
│   └── logger.ts          # Pino logger configuration
├── src/
│   ├── components/        # Reusable UI components (Navbar, BlogCard, etc.)
│   ├── pages/             # Page components (Home, Feed, Dashboard, etc.)
│   ├── AuthContext.tsx    # Global authentication state
│   ├── api.ts             # Axios instance with auth interceptors
│   └── App.tsx            # Main routing configuration
├── server.ts              # Main Express server entry point
└── package.json           # Dependencies and scripts
```

---

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   The project uses SQLite. Generate the client and push the schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Environment Variables**:
   Ensure your `.env` file has the following:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-secret-key"
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.
