# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based web application for discovering and searching festivals in Italy. The application integrates with a Strapi CMS backend for content management and uses Geoapify for location services and geocoding.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for unused dependencies
npm run knip
```

## Architecture

### Tech Stack
- **Framework**: Astro 5 with Preact integration (using React compatibility layer)
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form with Zod validation
- **Pattern Matching**: ts-pattern for exhaustive type-safe matching
- **Date Handling**: dayjs

### API Integration
The application communicates with two external APIs:

1. **Strapi CMS Backend** (`src/lib/api/strapi.ts`)
   - Configured via `BASE_URL` and `API_TOKEN` environment variables
   - All API calls use bearer token authentication
   - Main entity: Festivals with geographic coordinates and rich text descriptions

2. **Geoapify Geocoding** (`src/lib/api/geoapify.ts`)
   - Configured via `BASE_GEOAPIFY_URL` and `GEOAPIFY_TOKEN` environment variables
   - Used for location autocomplete and reverse geocoding
   - Constrained to Italy via `ITALY_COORDS_RECT` filter

### Result Type Pattern
The codebase uses a custom algebraic data type for error handling (`src/lib/utils/algebraic.ts`):
- `Result<T>` represents either success (`Ok`) or failure (`Error`)
- Use `ts-pattern` for exhaustive matching on `Result` types
- Never throw exceptions in API calls; always return `Result` types

Example:
```typescript
const result = await fetchPlaces(query)
match(result)
  .with({ resultType: ResultType.Ok }, res => {
    // Handle success with res.result
  })
  .with({ resultType: ResultType.Error }, err => {
    // Handle error with err.error
  })
  .exhaustive()
```

### Data Enrichment Pattern
Festivals are enriched with location data asynchronously:
- Base `Festival` type comes from Strapi with `position: { lat, lng }`
- `EnrichedFestival` type adds optional `address?: Address` field
- Address is fetched via `reverseGeocode()` from Geoapify
- Multiple festivals are enriched in parallel using `Promise.all()`

### Strapi Blocks API
Festival descriptions use Strapi's Blocks API for rich text content:
- Type definitions in `src/lib/models/api/strapi.ts`
- Supports headings, paragraphs, lists, links, images, and formatted text
- Rendered via `BlockRenderContent.astro` component
- Each block type has specific structure (e.g., `TextNode`, `LinkNode`, `ImageData`)

### Search Functionality
Search implementation (`src/components/search/`):
- Form validation with Zod schemas (`src/lib/models/forms/schemas.ts`)
- Supports filtering by:
  - Text query (title/slug)
  - Geographic radius from selected location
  - Date range (start/end dates)
- Autocomplete for location selection using Geoapify
- Client-side pagination component

### Component Structure
- **Layouts**: `BaseLayout.astro` (minimal), `HeaderLayout.astro` (with navigation)
- **Search components** (Preact/React): Interactive form, autocomplete, pagination, results display
- **Common components**: Mostly Astro components for static content
- Use Preact for interactive components via `@astrojs/preact` with React compatibility

### TypeScript Configuration
- Uses Astro's strict tsconfig
- JSX configured for Preact with React compatibility layer via path aliases
- `react` and `react-dom` aliased to `preact/compat`

### Environment Variables
Required variables (defined in `astro.config.mjs`):
- `BASE_URL`: Strapi backend URL
- `API_TOKEN`: Strapi authentication token
- `BASE_GEOAPIFY_URL`: Geoapify API base URL
- `GEOAPIFY_TOKEN`: Geoapify API key

All are configured as client-side accessible via Astro's env system.

### Code Style
- **Prettier**: 4-space tabs, single quotes, no semicolons, trailing commas
- **ESLint**: TypeScript strict mode, Astro plugin, JSX accessibility rules
- Prettier plugins enforce Tailwind class ordering and Astro import organization

### File Organization
- `src/lib/api/`: API client implementations
- `src/lib/models/`: TypeScript type definitions (separate by API/forms)
- `src/lib/utils/`: Shared utilities (algebraic types, hooks)
- `src/components/`: UI components (Astro and Preact/React)
- `src/pages/`: File-based routing
  - Dynamic route: `/trippas/[slug].astro` for festival detail pages
  - Index pages for listing views

### Common Patterns
- Use `baseFetch()` helper for authenticated Strapi requests
- Pagination uses page numbers (1-indexed) with configurable page size
- Query string building via `qs-stringify` library
- Date formatting with `dayjs` in components
- Festival slugs used for URL routing
