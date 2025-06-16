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