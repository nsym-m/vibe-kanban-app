# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a kanban board application built with Next.js 15, TypeScript, Prisma, and PostgreSQL. It features drag-and-drop functionality using @dnd-kit/sortable and uses shadcn/ui components with Tailwind CSS.

## Database Architecture

The application uses Prisma ORM with PostgreSQL and has three main models:
- **Board**: Top-level kanban boards with title and description
- **Column**: Columns within boards with position ordering and color customization
- **Task**: Tasks within columns with priority levels, due dates, and position ordering

Key relationships:
- Boards → Columns (one-to-many with cascade delete)
- Columns → Tasks (one-to-many with cascade delete)
- Unique constraints on position fields ensure proper ordering

## Development Commands

### Core Development
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Management
- `npx prisma generate` - Generate Prisma client after schema changes
- `npx prisma db push` - Push schema changes to database
- `npx prisma migrate dev` - Create and apply new migration
- `npx prisma studio` - Open Prisma Studio database browser

### Docker Database
- `docker compose up -d` - Start PostgreSQL database container
- `docker compose down` - Stop database container

## UI Component System

The project uses shadcn/ui with the "new-york" style variant:
- Components are in `@/components/ui`
- Utilities in `@/lib/utils` (includes `cn()` function for class merging)
- Tailwind configuration uses CSS variables
- Uses Lucide React for icons

Path aliases configured:
- `@/components` → components/
- `@/lib` → lib/
- `@/utils` → lib/utils
- `@/ui` → components/ui
- `@/hooks` → hooks/

## Environment Setup

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string (default: postgresql://user:password@localhost:5432/kanban-app)

## Next.js Best Practices

### Component Architecture
- **Server Components First**: Default to Server Components for data fetching and rendering (Zenn: Data Fetching Principles)
- **Client Components**: Use only for interactive elements requiring browser APIs (Next.js docs: Rendering Strategies)
- **Composition Patterns**: Mix server and client components effectively using composition (Zenn: Component Design)
- **Container/Presentational**: Separate data fetching (containers) from UI logic (presentational) (Zenn: Component Design)

### Data Fetching
- **Server-Side Data Fetching**: Leverage built-in caching with async/await in Server Components (Zenn: Data Fetching Principles)
- **Co-location**: Keep data fetching close to components that use the data (Zenn: Data Fetching Principles)
- **Request Memoization**: Utilize automatic request deduplication (Zenn: Data Fetching Principles)
- **Parallel Fetching**: Fetch data in parallel where possible to improve performance (Zenn: Data Fetching Principles)

### Caching Strategy
- **Static Rendering**: Pre-render pages at build time when possible (Zenn: Caching Strategies)
- **Dynamic Rendering**: Use for personalized content (Zenn: Caching Strategies)
- **Revalidation**: Implement time-based and on-demand revalidation (Next.js docs: Data Fetching)

### Project Structure
- **App Router**: Use app directory for routing and layouts (Next.js docs: Project Structure)
- **Route Groups**: Organize routes logically using parentheses (Next.js docs: Project Structure)
- **File Colocation**: Keep related files close to their routes (Next.js docs: Project Structure)

### Performance
- **Image Optimization**: Use `next/image` for automatic optimization (Next.js docs: Optimization)
- **Font Optimization**: Use `next/font` for web font performance (Next.js docs: Optimization)
- **Lazy Loading**: Implement for components and third-party libraries (Next.js docs: Optimization)