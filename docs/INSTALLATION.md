# Installation Guide

## Prerequisites

- Node.js 16+ and npm/yarn/pnpm
- React 18 or higher
- TypeScript 4.5+ (optional but recommended)

## Installation Steps

### 1. Install the Package

```bash
npm install react-tanstack-virtual-table
```

or with yarn:

```bash
yarn add react-tanstack-virtual-table
```

or with pnpm:

```bash
pnpm add react-tanstack-virtual-table
```

### 2. Install Peer Dependencies

The library requires the following peer dependencies:

```bash
npm install react react-dom @tanstack/react-table @tanstack/react-virtual
```

**Note**: Make sure you have React 18+ installed. The library uses React hooks and modern React features.

### 3. Import CSS Styles

Import the required CSS files in your application entry point:

```tsx
// In your main.tsx or App.tsx
import "react-tanstack-virtual-table/dist/styles/variables.css";
import "react-tanstack-virtual-table/dist/styles/table.css";
```

Or if you're using a bundler that supports CSS imports:

```tsx
import "react-tanstack-virtual-table/styles/variables.css";
import "react-tanstack-virtual-table/styles/table.css";
```

### 4. Basic Setup

```tsx
import { VirtualTable } from "react-tanstack-virtual-table";
import type { ColumnDef } from "@tanstack/react-table";

// Your data and columns
const data = [...];
const columns: ColumnDef<YourType>[] = [...];

function App() {
  return <VirtualTable data={data} columns={columns} height={600} />;
}
```

## TypeScript Setup

If you're using TypeScript, the library includes full type definitions. No additional setup is required.

```tsx
import { VirtualTable, VirtualTableProps } from "react-tanstack-virtual-table";
import type { ColumnDef, RowData } from "@tanstack/react-table";

interface Person extends RowData {
  name: string;
  age: number;
  email: string;
}

const columns: ColumnDef<Person>[] = [
  { header: "Name", accessorKey: "name" },
  { header: "Age", accessorKey: "age" },
  { header: "Email", accessorKey: "email" },
];
```

## Vite Configuration

If you're using Vite, no special configuration is needed. The library works out of the box.

## Next.js Configuration

For Next.js projects, you may need to configure CSS imports. Add this to your `next.config.js`:

```js
module.exports = {
  // ... other config
  transpilePackages: ["react-tanstack-virtual-table"],
};
```

## Common Issues

### CSS Not Loading

If styles aren't appearing, make sure you've imported the CSS files:

```tsx
import "react-tanstack-virtual-table/styles/variables.css";
import "react-tanstack-virtual-table/styles/table.css";
```

### TypeScript Errors

If you encounter TypeScript errors, ensure you have the latest versions:

```bash
npm install --save-dev @types/react @types/react-dom typescript
```

### Build Errors

If you encounter build errors related to CSS, ensure your bundler is configured to handle CSS imports. For Vite, this is automatic. For Webpack, you may need `css-loader` and `style-loader`.

## Next Steps

- Read the [Quick Start Guide](./QUICK_START.md)
- Check out [Basic Examples](./EXAMPLES.md)
- Explore the [API Reference](./API.md)
