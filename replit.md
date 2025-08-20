# ThumbnailAI

## Overview

ThumbnailAI is a web application that allows users to generate professional YouTube thumbnails using AI. The application provides an intuitive interface for creating thumbnails with custom text, styles, and categories, utilizing OpenAI's DALL-E 3 for image generation. Users can specify their content details, choose between realistic or cartoon styles, and add custom text overlays to create eye-catching thumbnails optimized for YouTube's platform.

## User Preferences

Preferred communication style: Simple, everyday language.
Language: Italian - All interface elements, messages, and user-facing text in Italian
Content focus: Crime/Suspense genre with enhanced AI prompts for realistic, noir-style imagery
Image requirements: No text overlays in generated images, pure visual content only

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool and development server
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing
- **Canvas Rendering**: HTML5 Canvas API for thumbnail editing and text overlay functionality

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for REST API endpoints
- **Language**: TypeScript with ES modules for type safety and modern JavaScript features
- **Data Storage**: In-memory storage implementation with interface abstraction for future database integration
- **File Structure**: Monorepo structure with shared schema definitions between client and server
- **Development**: Hot module replacement via Vite integration for seamless development experience

### Data Storage Solutions
- **Current Implementation**: In-memory storage using Map data structures for thumbnail persistence
- **Database Ready**: Drizzle ORM configured for PostgreSQL with migration support via drizzle-kit
- **Schema Definition**: Centralized schema definitions in TypeScript with Zod validation
- **Data Models**: Thumbnail entities with support for metadata, text settings, and image URLs

### Authentication and Authorization
- **Current State**: No authentication implemented - open access application
- **Session Infrastructure**: Express session middleware configured with PostgreSQL session store (connect-pg-simple)
- **Future Ready**: Authentication hooks and user context prepared for implementation

## External Dependencies

### AI Services
- **Google AI Studio (Gemini)**: Gemini 2.0 Flash integration for AI-powered thumbnail image generation
- **Configuration**: Environment variable-based API key management using GEMINI_API_KEY
- **Model**: Uses gemini-2.0-flash-preview-image-generation for ultra-realistic image creation

### Database Services
- **Neon Database**: PostgreSQL-compatible serverless database configured via DATABASE_URL
- **Connection**: @neondatabase/serverless driver for edge-compatible database connections
- **Migration System**: Drizzle migrations with schema versioning support

### UI and Design Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Lucide React**: Modern icon library with consistent design system
- **Embla Carousel**: Touch-friendly carousel components for media galleries
- **Class Variance Authority**: Type-safe variant management for component styling

### Development Tools
- **Replit Integration**: Custom Vite plugins for Replit environment compatibility
- **Error Handling**: Runtime error overlay for development debugging
- **Code Analysis**: Cartographer plugin for code exploration and navigation
- **TypeScript**: Strict type checking with path mapping for clean imports

### Styling and Fonts
- **Google Fonts**: Inter, DM Sans, Fira Code, Geist Mono, and Architects Daughter for typography variety
- **PostCSS**: Autoprefixer for vendor prefix management
- **Tailwind CSS**: Utility-first CSS framework with custom configuration for design system consistency