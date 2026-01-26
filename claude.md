# Evergreen UI Codebase

## Project Overview

This is the Evergreen UI monorepo containing two React applications for MongoDB's continuous integration system:

- **Spruce** (`apps/spruce`) - The main CI/CD dashboard UI for Evergreen
- **Parsley** (`apps/parsley`) - Log viewer application for Evergreen

**Tech Stack:** React 18, TypeScript 5.9, Vite 7, pnpm workspaces, Apollo Client (GraphQL), Emotion (CSS-in-JS), LeafyGreen UI components

## Monorepo Structure

```
ui/
├── apps/
│   ├── spruce/           # Main CI/CD dashboard (port 3000)
│   └── parsley/          # Log viewer (port 5173)
├── packages/
│   ├── lib/              # Shared components, hooks, utilities
│   ├── eslint-config/    # Shared ESLint configuration
│   ├── deploy-utils/     # Deployment CLI utilities
│   ├── vite-utils/       # Shared Vite configuration
│   ├── storybook-addon/  # Custom Storybook addon
│   ├── fungi/            # AI/Chat components
│   ├── analytics-visualizer/
│   └── lint-staged/
└── scripts/
```

### App Directory Structure

Within each app (`apps/spruce/`, `apps/parsley/`):
```
src/
├── components/     # Reusable UI components
├── pages/          # Route-level page components
├── hooks/          # Custom React hooks
├── gql/            # GraphQL queries, mutations, generated types
├── types/          # TypeScript type definitions
├── constants/      # App constants
├── context/        # React Context providers
├── analytics/      # Analytics tracking
├── utils/          # Utility functions
└── test_utils/     # Test helpers
```

## Core Commands

### Root-Level Commands
```bash
pnpm install              # Install all dependencies
pnpm clean                # Remove all node_modules
pnpm codegen              # Generate GraphQL types (all workspaces)
pnpm test                 # Run unit tests (all workspaces)
pnpm check-types          # TypeScript type check (all workspaces)
pnpm eslint:strict        # Strict linting (all workspaces)
pnpm eslint:fix           # Auto-fix lint errors
pnpm storybook            # Run combined Storybook
```

### App-Level Commands (run from `apps/spruce/` or `apps/parsley/`)
```bash
pnpm dev                  # Start dev server (local Evergreen)
pnpm staging              # Dev server against staging Evergreen (HTTPS)
pnpm prod                 # Dev server against production Evergreen (HTTPS)
pnpm test                 # Run Vitest unit tests
pnpm cy:open              # Cypress interactive mode
pnpm cy:run               # Cypress headless tests
pnpm codegen              # Generate GraphQL types
pnpm storybook            # Run Storybook
pnpm build                # Production build
pnpm snapshot             # Run snapshot tests
```

## GraphQL Code Generation

### Setup (One-time)
Create a symlink to the Evergreen GraphQL schema in each app:
```bash
ln -s <path_to_evergreen_repo>/graphql/schema sdlschema
```

### Running Codegen
```bash
pnpm codegen              # From app directory or root
```

### How It Works
- **Config file:** `graphql.config.ts` in each app
- **Input:** `.graphql` files in `src/gql/queries/` and `src/gql/mutations/`
- **Output:** `src/gql/generated/types.ts`
- **Plugins:** `typescript`, `typescript-operations`
- **Custom scalars:** `Duration` → `number`, `Time` → `Date`, `StringMap` → `{ [key: string]: any }`

### Best Practices
- Each query/mutation must have a unique name
- Queries should be declared with a name for type generation
- Run codegen after modifying `.graphql` files

## Coding Conventions

### React Components
```typescript
// Use arrow functions with React.FC
export const ComponentName: React.FC<ComponentNameProps> = ({ prop1, prop2 }) => {
  return <div>...</div>;
};

// Props interface
interface ComponentNameProps {
  prop1: string;
  prop2?: boolean;
  onEvent: (value: string) => void;
}
```

### File Organization
- Components are directory-based with `index.tsx` as barrel export
- Co-locate tests (`*.test.tsx`), stories (`*.stories.tsx`), and types
- Use named exports (not default exports)

### Styling with Emotion
```typescript
import styled from "@emotion/styled";
import { size } from "constants/tokens";

const StyledWrapper = styled.div`
  padding: ${size.xs};
  margin-bottom: ${size.s};
`;
```

### Import Ordering
1. External dependencies (react, @apollo/client, date-fns)
2. LeafyGreen UI components (@leafygreen-ui/*)
3. Shared library (@evg-ui/lib/*)
4. Internal paths (components, hooks, utils, gql, etc.)
5. Relative imports (./sibling, ../parent)

### Naming Conventions
- Components: PascalCase
- Hooks: `use` prefix (useMyHook)
- Constants: SCREAMING_SNAKE_CASE
- Files: Match export name (MyComponent.tsx, useMyHook.ts)

## Running Different Environments

### Local Development
Requires local Evergreen server running on `http://localhost:9090`:
```bash
# In Evergreen repo
make local-evergreen

# In app directory
pnpm dev
```

### Remote Servers (Staging/Production)

**One-time setup (when first cloning the repo):**
```bash
# Install mkcert
brew install mkcert nss
mkcert -install

# Generate certificates (run from app directory)
mkcert -key-file localhost-key.pem -cert-file localhost-cert.pem spruce-local.corp.mongodb.com
mkcert -key-file localhost-key.pem -cert-file localhost-cert.pem parsley-local.corp.mongodb.com

# Add to /etc/hosts
127.0.0.1  spruce-local.corp.mongodb.com
127.0.0.1  parsley-local.corp.mongodb.com
```

**Running against remote servers:**
```bash
pnpm staging              # Run against staging Evergreen
pnpm prod                 # Run against production Evergreen
```

**URLs:**
- Spruce (staging/prod): `https://spruce-local.corp.mongodb.com:8443`
- Parsley (staging/prod): `https://parsley-local.corp.mongodb.com:8444`

## Testing

### Unit Tests (Vitest)
```bash
pnpm test                 # Watch mode
pnpm test run             # Run once
pnpm test run <name>      # Run specific test
```

Use test utilities from `@evg-ui/lib/test_utils`:
```typescript
import { render, screen, userEvent, waitFor, renderWithRouterMatch } from "@evg-ui/lib/test_utils";
```

### E2E Tests (Cypress)
Requires local Evergreen server and built app:
```bash
pnpm build:local && pnpm serve   # Build and serve
pnpm cy:open                     # Interactive mode
pnpm cy:run                      # Headless mode
```

### Snapshot Tests
Generated from Storybook stories:
```bash
pnpm snapshot
```

## Shared Library (`packages/lib`)

Houses code shared between Spruce and Parsley:
- Reusable React components
- Custom hooks
- Test utilities
- Type definitions
- Analytics infrastructure

### Dependency Management
- External deps used only by lib: install in `packages/lib`
- External deps shared with apps: install in both lib and app

## Deployment

### Production
Must be on `main` branch:
```bash
pnpm deploy:prod          # Creates git tag, triggers build
```

### Staging/Beta
Run corresponding deploy task in Evergreen patch.

## Pull Request Format

Follow the template in `.github/pull_request_template.md`:

**Title format:**
- Prefix with Jira ticket: `DEVPROD-XXXX: Description of change`
- Include `[minor]` or `[major]` for SemVer version bumps
- Example: `DEVPROD-1234: Add user authentication [minor]`

**Labels:**
- Add 🔵Spruce or 🟢Parsley label in the sidebar

**Required sections:**
- **Description** - Context, thought process, what changed
- **Screenshots** - For visible UI changes
- **Testing** - How you tested the changes
- **Evergreen PR** - Link to corresponding backend PR if applicable

## Common Issues

### Dependencies out of date
```bash
pnpm clean                # Remove all node_modules
pnpm install              # Reinstall
```

### GraphQL types not generating
- Ensure `sdlschema` symlink exists and points to valid schema
- Run `pnpm codegen` after modifying `.graphql` files

### HTTPS certificate issues
- Regenerate certificate with `mkcert`
- Ensure hosts file entry exists
