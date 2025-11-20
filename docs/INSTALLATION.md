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

### 3. Basic Setup

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

## Styling / CSS Usage

**Important**: You must manually import the library's CSS file for the table to display correctly. The CSS file contains all the necessary styles for the table layout, CSS variables, and visual elements like the focus ring.

### Import the CSS File

Add this import statement to your application's entry point (usually `main.tsx`, `index.tsx`, or `App.tsx`):

```tsx
import "react-tanstack-virtual-table/dist/index.css";
```

### Framework-Specific Examples

#### Vite

In a Vite project, add the import to your `main.tsx` or `main.js`:

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "react-tanstack-virtual-table/dist/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### Create React App (CRA)

In a Create React App project, add the import to your `src/index.js` or `src/index.tsx`:

```tsx
// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "react-tanstack-virtual-table/dist/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### Next.js

In a Next.js project, add the import to your `pages/_app.tsx` (Pages Router) or `app/layout.tsx` (App Router):

**Pages Router:**

```tsx
// pages/_app.tsx
import type { AppProps } from "next/app";
import "react-tanstack-virtual-table/dist/index.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

**App Router:**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import "react-tanstack-virtual-table/dist/index.css";

export const metadata: Metadata = {
  title: "My App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### What the CSS File Includes

The CSS file provides:

- **CSS Variables**: All theme variables (colors, spacing, etc.) that you can override
- **Table Layout Styles**: Core table structure and positioning
- **Focus Ring Styles**: Visual indicator for selected/editing cells
- **Theme Styles**: Built-in light and dark theme support

Without importing this file, the table will not have proper styling, and features like the focus ring and theme colors won't work.

### Overriding CSS Variables

You can override CSS variables to customize the table appearance. See the [Styling & Theming Guide](./STYLING.md) for a complete list of available variables.

**Example:**

```css
/* In your global CSS file or component styles */
:root {
  --vt-bg: #ffffff;
  --vt-bg-header: #f5f5f5;
  --vt-border: #e0e0e0;
  --vt-text: #212121;
  --vt-row-height: 50px;
}
```

### Using Custom Themes

You can customize the table using the `themeOverride` prop or by overriding CSS variables. For detailed theming options, see the [Styling & Theming Guide](./STYLING.md).

**Example with themeOverride:**

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={400}
  themeOverride={{
    "--vt-bg": "#ffffff",
    "--vt-border": "#e0e0e0",
    "--vt-text": "#333333",
  }}
/>
```

### Custom Styling

You can add your own CSS classes and styles to further customize the table:

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={400}
  className="my-custom-table"
  style={{ border: "2px solid blue" }}
/>
```

```css
/* Your custom styles */
.my-custom-table {
  --vt-padding-cell: 16px;
  --vt-border-radius: 8px;
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

If styles aren't appearing, make sure you've imported the CSS file:

```tsx
import "react-tanstack-virtual-table/dist/index.css";
```

**Important**: The CSS import must be added to your application entry point. Without it, the table will lack proper styling, layout, and visual features like the focus ring.

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
