# Frequently Asked Questions

Common questions and solutions for using React TanStack Virtual Table.

## General Questions

### Q: How do I install the library?

A: See the [Installation Guide](./INSTALLATION.md) for detailed instructions. In short:

```bash
npm install react-tanstack-virtual-table
npm install react react-dom @tanstack/react-table @tanstack/react-virtual
```

### Q: Do I need to import CSS files?

A: Yes, you need to import the CSS files:

```tsx
import "react-tanstack-virtual-table/styles/variables.css";
import "react-tanstack-virtual-table/styles/table.css";
```

### Q: What version of React is required?

A: React 18 or higher is required. The library uses modern React features and hooks.

### Q: Does it work with TypeScript?

A: Yes! The library is written in TypeScript and includes full type definitions.

## Data & Columns

### Q: How do I handle large datasets?

A: The table uses virtualization, so it efficiently handles large datasets (10,000+ rows). Just pass your data array:

```tsx
const largeData = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
}));

<VirtualTable data={largeData} columns={columns} height={600} />;
```

### Q: Can I use computed/derived columns?

A: Yes, use a custom `cell` renderer:

```tsx
{
  header: "Full Name",
  id: "fullName",
  cell: (info) => {
    const row = info.row.original;
    return `${row.firstName} ${row.lastName}`;
  },
}
```

### Q: How do I format cell values?

A: Use the `cell` renderer:

```tsx
{
  header: "Price",
  accessorKey: "price",
  cell: (info) => `$${info.getValue().toFixed(2)}`,
}
```

### Q: Can I make columns sortable?

A: Yes, columns are sortable by default. Click the header to sort. To disable:

```tsx
{
  header: "Name",
  accessorKey: "name",
  enableSorting: false,
}
```

## Cell Editing

### Q: How do I enable cell editing?

A: Set `readonly={false}` and provide an `onCellValueChange` callback:

```tsx
<VirtualTable
  data={data}
  columns={columns}
  readonly={false}
  onCellValueChange={(rowIndex, columnId, value) => {
    // Update your data
  }}
/>
```

### Q: The `onCellValueChange` callback receives strings. How do I handle numbers?

A: Convert the string to the appropriate type:

```tsx
const handleCellEdit = (rowIndex, columnId, value) => {
  setData((prev) => {
    const newData = [...prev];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [columnId]: columnId === "price" ? parseFloat(value) : value,
    };
    return newData;
  });
};
```

### Q: How do I make specific columns read-only?

A: You can handle this in your `onCellValueChange` callback:

```tsx
const handleCellEdit = (rowIndex, columnId, value) => {
  // Skip read-only columns
  if (columnId === "id" || columnId === "createdAt") {
    return;
  }
  // Update other columns...
};
```

### Q: Can I validate cell edits?

A: Yes, add validation in your `onCellValueChange` callback:

```tsx
const handleCellEdit = (rowIndex, columnId, value) => {
  if (columnId === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      alert("Invalid email");
      return; // Don't update
    }
  }
  // Update if valid...
};
```

## Styling & Theming

### Q: How do I change the theme?

A: Use the `theme` prop:

```tsx
<VirtualTable theme="dark" ... />
```

### Q: How do I customize colors?

A: Use `themeOverride`:

```tsx
<VirtualTable
  themeOverride={{
    "--vt-bg": "#ffffff",
    "--vt-border": "#e0e0e0",
  }}
  ...
/>
```

### Q: Can I use my own CSS classes?

A: Yes, use the `className` prop:

```tsx
<VirtualTable className="my-custom-table" ... />
```

Then override CSS variables in your CSS:

```css
.my-custom-table {
  --vt-bg: #ffffff;
  --vt-border: #e0e0e0;
}
```

### Q: How do I change row height?

A: Set the `estimateRowHeight` prop:

```tsx
<VirtualTable estimateRowHeight={60} ... />
```

## Keyboard Navigation

### Q: How do I navigate with keyboard?

A: The table supports full keyboard navigation:

- **Arrow keys**: Move between cells
- **Tab**: Next cell
- **Shift+Tab**: Previous cell
- **Enter/F2**: Enter edit mode
- **Escape**: Exit edit mode

### Q: Can I disable keyboard navigation?

A: Keyboard navigation is always enabled when a cell is selected. You can't disable it, but you can make the table read-only to prevent editing.

## Performance

### Q: Will it work with 100,000 rows?

A: Yes! The table uses row virtualization, so it only renders visible rows. Performance should remain smooth.

### Q: How do I optimize performance?

A:

1. Set `estimateRowHeight` close to actual row height
2. Memoize your data and columns
3. Avoid complex cell renderers for large datasets
4. Use `readonly={true}` if editing isn't needed

### Q: Why is scrolling slow?

A: Check:

1. Is `estimateRowHeight` set correctly?
2. Are cell renderers too complex?
3. Are you updating state on every scroll event?

## Common Issues

### Q: Styles aren't appearing

A: Make sure you've imported the CSS files:

```tsx
import "react-tanstack-virtual-table/styles/variables.css";
import "react-tanstack-virtual-table/styles/table.css";
```

### Q: Cell edits aren't saving

A: Make sure you're updating state immutably:

```tsx
// ❌ Wrong
data[rowIndex][columnId] = value;

// ✅ Correct
setData((prev) => {
  const newData = [...prev];
  newData[rowIndex] = { ...newData[rowIndex], [columnId]: value };
  return newData;
});
```

### Q: TypeScript errors about types

A: Make sure your data type extends `RowData`:

```tsx
import type { RowData } from "@tanstack/react-table";

interface Person extends RowData {
  name: string;
  age: number;
}
```

### Q: Columns aren't showing

A: Check:

1. Are your columns defined correctly?
2. Do `accessorKey` values match your data keys?
3. Is your data array not empty?

### Q: Focus ring isn't appearing

A: Make sure:

1. You've clicked on a cell
2. The table container has focus
3. CSS files are imported

### Q: Sorting isn't working

A: Sorting is enabled by default. Click column headers to sort. Make sure `enableSorting` isn't set to `false` on your columns.

## Advanced Usage

### Q: Can I access the TanStack Table instance?

A: Yes, you can use the `useVirtualTable` hook directly:

```tsx
import { useVirtualTable } from "react-tanstack-virtual-table";

const { table, rowVirtualizer } = useVirtualTable({
  data,
  columns,
});
```

### Q: Can I customize the row header?

A: The row header shows row numbers (1, 2, 3...). You can hide it with `showRowHeader={false}`, but you can't customize the content without modifying the library.

### Q: How do I handle async data loading?

A: Use React state and update when data loads:

```tsx
const [data, setData] = useState([]);

useEffect(() => {
  fetchData().then(setData);
}, []);

<VirtualTable data={data} columns={columns} ... />
```

### Q: Can I use this with React Query?

A: Yes! See the [Examples](./EXAMPLES.md) for integration patterns.

## Still Have Questions?

- Check the [API Reference](./API.md) for detailed prop descriptions
- Review the [Examples](./EXAMPLES.md) for common patterns
- Open an issue on GitHub for bugs or feature requests
