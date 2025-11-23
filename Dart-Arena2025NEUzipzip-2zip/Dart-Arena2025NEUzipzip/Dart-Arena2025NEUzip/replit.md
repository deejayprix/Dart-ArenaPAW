# Darts Arena - Darts Scoring Application

## Overview

A comprehensive darts scoring application that tracks games of 301, 501, and 701, along with "Around the Clock" mode and Tournament mode. The application provides real-time score tracking, player statistics, and supports various game modes including Double In/Out and Master In/Out configurations. Built as a single-page application with all game state managed client-side.

## Recent Changes (November 23, 2025)

### Bug Fixes (November 23, 2025 - Latest)
- **Leg Reset Bug Fixed**: Corrected issue where leg reset would fail after a leg win due to stale closure values in setTimeout callbacks. Now uses functional setState to ensure fresh state values.
- **Tournament Callback Bug Fixed**: Fixed tournament match completion not updating standings and match list. Changed from useState to useRef for callback storage to prevent React state issues with function values.

### Page Refresh Protection
- Implemented browser warning when user attempts to refresh/close page during active match
- Prevents accidental loss of game progress
- Automatically activates when any match is in play (regular game or tournament match)
- Automatically deactivates when match ends or user returns to setup screen

### Tournament Mode Overhaul
- Removed auto-start functionality - users now manually select which match to start
- All tournament matches are displayed in a scrollable list below the ranking table
- Each match has its own "Start" button for manual selection
- Results refresh in the ranking list after each match completes
- Match list is scrollable (400px height) to accommodate all matches
- Tournament ends when all matches are played
- After completing a match, app returns to ranking list screen
- Removed intermediate dialog between matches for smoother UX

### Project Structure Cleanup
- Flattened deeply nested folder structure from multiple zip extractions
- Removed duplicate replit.md and zipFile.zip files
- Organized files at root level with clear separation: client/, server/, shared/

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for the UI layer
- **Vite** as the build tool and development server
- **Wouter** for client-side routing
- Single-page application with all state managed in-memory

**UI Component System**
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for styling with custom design tokens
- **ScrollArea** component used for tournament match lists
- Clean, minimal interface following modern design principles

**State Management**
- Client-side state only - no backend persistence
- React hooks for local component state
- Tournament state includes: players, schedule, active match, standings
- TanStack Query configured for future extensibility

**Key Components**
- `DartsGame.tsx`: Main game controller managing all game logic and state
- `PlayerSetup.tsx`: Player configuration interface
- `GameConfig.tsx`: Game mode and rule configuration
- `PlayerCard.tsx`: Individual player score display with statistics
- `NumberPad.tsx`: Dart score input interface with double/triple modifiers
- `TournamentView.tsx`: Tournament scheduling, standings, and match management

### Game Logic Architecture

**Game Modes**
- Standard scoring: 301, 501, 701 point countdown
- Around the Clock: Hit numbers 1-20 in sequence
- Tournament Mode: Round-robin tournament with manual match selection
- In/Out variations: Standard, Double (must hit double to start/finish), Master (double or triple required)

**Tournament Features**
- Round-robin schedule generation (circle method)
- Real-time standings calculation based on wins, leg difference, set difference
- Manual match selection from scrollable list
- Standings refresh after each match
- Winner determination when all matches complete

**Score Calculation**
- Countdown from starting score (301/501/701)
- Three-dart turn system with double/triple multipliers
- Average calculation based on total score and throw count
- Bust validation (going below zero or not finishing on required double/master)

## External Dependencies

### UI Framework & Components
- **@radix-ui/***: Headless UI primitives (scroll-area, card, button, etc.)
- **shadcn/ui**: Pre-built accessible components
- **Tailwind CSS**: Utility-first CSS framework
- **lucide-react**: Icon library

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **PostCSS**: CSS processing with autoprefixer

### State & Data Management
- **TanStack Query (React Query)**: Configured for potential server state
- **wouter**: Lightweight routing
- **zod**: Schema validation for game state types

## Development

**Scripts**
- `npm run dev`: Start development server on port 5000
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run check`: Run TypeScript type checking

**Dev Server Configuration**
- Binds to 0.0.0.0:5000 for Replit compatibility
- Hot module replacement (HMR) enabled
- Strict file system access for security
