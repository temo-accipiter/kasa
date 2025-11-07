# Project Reorganization Migration Map

## Overview
This document outlines the structural reorganization of the Kasa project to follow modern React/TypeScript project conventions with a standardized directory structure.

## New Directory Structure

```
src/
├── components/         # Reusable UI components (unchanged)
├── pages/             # Page-level components (unchanged)
├── hooks/             # Custom React hooks (NEW - ready for future hooks)
├── lib/               # Shared libraries and data (NEW)
│   └── data/          # Static data and mock data files
├── styles/            # Global styles and SCSS modules (unchanged)
├── types/             # TypeScript type definitions (unchanged)
├── utils/             # Utility functions and helpers (NEW - ready for future utilities)
├── assets/            # Static assets like images (unchanged)
└── App.tsx            # Main app layout component (MOVED from src/app/)
```

## File Moves

### 1. Main Application Component
- **From:** `src/app/App.tsx`
- **To:** `src/App.tsx`
- **Reason:** The App component is the root layout component and should be at the top level of src/
- **Impact:** Updated imports in `src/index.tsx`

### 2. Data Directory
- **From:** `src/data/`
- **To:** `src/lib/data/`
- **Reason:** Data files are better organized under lib/ as shared resources
- **Files Affected:**
  - `src/data/logements.json` → `src/lib/data/logements.json`
- **Impact:** Updated imports in:
  - `src/pages/home/Home.tsx`
  - `src/pages/apart/Apart.tsx`

### 3. New Directories Created
- **`src/hooks/`**: Reserved for custom React hooks
- **`src/lib/`**: For shared libraries, constants, and data
- **`src/utils/`**: For utility functions and helper methods

## Import Changes

### src/index.tsx
```diff
- import App from "./app/App"
+ import App from "./App"
```

### src/App.tsx
```diff
- import "../styles/main.scss"
- import Header from "../components/header/Header"
- import Footer from "../components/footer/Footer"
+ import "./styles/main.scss"
+ import Header from "./components/header/Header"
+ import Footer from "./components/footer/Footer"
```

### src/pages/home/Home.tsx
```diff
- import logementsData from "../../data/logements.json"
+ import logementsData from "../../lib/data/logements.json"
```

### src/pages/apart/Apart.tsx
```diff
- import logementsData from "../../data/logements.json"
+ import logementsData from "../../lib/data/logements.json"
```

## Unchanged Directories

The following directories remain in their original locations:
- `src/components/` - All UI components with their co-located styles
- `src/pages/` - All page-level components
- `src/styles/` - Global styles following SMACSS architecture
- `src/types/` - TypeScript type definitions
- `src/assets/` - Static assets (images, etc.)

## Benefits of This Structure

1. **Scalability**: Clear separation of concerns makes it easier to scale the application
2. **Maintainability**: Standard structure makes it easier for new developers to understand the codebase
3. **Organization**: Logical grouping of related files (hooks, utilities, libraries)
4. **Best Practices**: Follows modern React/TypeScript project conventions
5. **Future-Ready**: New directories (hooks, utils, lib) are ready for future development

## Build Verification

✅ Build passes successfully after reorganization
✅ All imports updated correctly
✅ No breaking changes to functionality
✅ TypeScript strict mode compliance maintained

## Next Steps

1. As the project grows, consider:
   - Adding custom hooks in `src/hooks/`
   - Creating utility functions in `src/utils/`
   - Adding constants/config files in `src/lib/`
   - Splitting types into domain-specific files in `src/types/`

2. Future enhancements:
   - Add API service layer in `src/services/` or `src/lib/api/`
   - Consider context providers in `src/context/`
   - Add test files co-located with components

## Testing

Run the following commands to verify the changes:

```bash
npm run build  # Production build
npm start      # Development server
```

Both should work without any issues.
