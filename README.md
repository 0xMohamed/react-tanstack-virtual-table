# React TanStack Virtual Table

A high-performance, feature-rich virtualized table component for React built on top of [TanStack Table](https://tanstack.com/table) and [TanStack Virtual](https://tanstack.com/virtual). Inspired by professional grid libraries like Handsontable and AG Grid.

## ✨ Features

- 🚀 **Virtualization**: Efficiently render thousands of rows with smooth scrolling
- ⌨️ **Keyboard Navigation**: Full keyboard support (Arrow keys, Tab, Enter, F2, Escape)
- ✏️ **Cell Editing**: Double-click or press Enter/F2 to edit cells inline
- 🎨 **Theming**: Built-in light/dark themes with CSS variables for easy customization
- 📏 **Auto Column Sizing**: Optional automatic column width calculation based on content
- 🎯 **Cell Selection**: Click to select, double-click to edit
- 📊 **Column Sorting**: Built-in column sorting support
- 🎭 **Customizable**: Extensive styling options and theme overrides
- 📱 **Responsive**: Works seamlessly across different screen sizes

## 📦 Installation

```bash
npm install react-tanstack-virtual-table
```

or

```bash
yarn add react-tanstack-virtual-table
```

or

```bash
pnpm add react-tanstack-virtual-table
```

### Peer Dependencies

This library requires React 18+ and the following peer dependencies:

```bash
npm install react react-dom @tanstack/react-table @tanstack/react-virtual
```

## 🚀 Quick Start

**Important**: Don't forget to import the CSS file! Add this import to your application entry point:

```tsx
import "react-tanstack-virtual-table/dist/index.css";
```

Then use the component:

```tsx
import { VirtualTable } from "react-tanstack-virtual-table";
import type { ColumnDef } from "@tanstack/react-table";

type Person = {
  name: string;
  age: number;
  email: string;
};

const data: Person[] = [
  { name: "John Doe", age: 30, email: "john@example.com" },
  { name: "Jane Smith", age: 25, email: "jane@example.com" },
  // ... more data
];

const columns: ColumnDef<Person>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Age",
    accessorKey: "age",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
];

function App() {
  return <VirtualTable data={data} columns={columns} height={600} />;
}
```

## 📚 Documentation

- [Installation Guide](./docs/INSTALLATION.md)
- [Quick Start Guide](./docs/QUICK_START.md)
- [Basic Examples](./docs/EXAMPLES.md)
- [Styling & Theming](./docs/STYLING.md)
- [Cell Editing Guide](./docs/CELL_EDITING.md)
- [API Reference](./docs/API.md)
- [FAQs](./docs/FAQS.md)

## 🎨 Examples

### Basic Table

```tsx
<VirtualTable data={data} columns={columns} height={400} />
```

### Editable Table

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={400}
  readonly={false}
  onCellValueChange={(rowIndex, columnId, value) => {
    console.log(`Row ${rowIndex}, Column ${columnId}: ${value}`);
    // Update your data here
  }}
/>
```

### Dark Theme

```tsx
<VirtualTable data={data} columns={columns} height={400} theme="dark" />
```

### Custom Styling

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

### Auto Column Sizing

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={400}
  autoFitColumnWidth={true}
  autoFitOptions={{
    minWidth: 80,
    maxWidth: 400,
    padding: 16,
  }}
/>
```

## ⌨️ Keyboard Shortcuts

- **Arrow Keys**: Navigate between cells
- **Tab / Shift+Tab**: Move to next/previous cell (wraps to next row)
- **Enter / F2**: Enter edit mode for selected cell
- **Escape**: Exit edit mode (keeps selection)
- **Click**: Select a cell
- **Double-Click**: Select and edit a cell

## 🎯 Features in Detail

### Virtualization

The table uses row virtualization to efficiently render large datasets. Only visible rows are rendered in the DOM, ensuring smooth performance even with thousands of rows.

### Cell Selection & Editing

- **Click** a cell to select it (blue focus ring appears)
- **Double-click** or press **Enter/F2** to enter edit mode
- **Escape** to exit edit mode
- The focus ring follows the selected/editing cell during scrolling

### Column Highlighting

When a cell is selected or being edited:

- The corresponding column header is highlighted
- The row number in the left header is highlighted

### Sorting

Click on any column header to sort. Click again to reverse the sort order.

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build library
npm run build

# Run Storybook (after setup)
npm run storybook
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📖 Learn More

- [TanStack Table Documentation](https://tanstack.com/table/latest)
- [TanStack Virtual Documentation](https://tanstack.com/virtual/latest)
