# Quick Start Guide

Get up and running with React TanStack Virtual Table in minutes.

## Minimal Example

Here's the simplest possible example:

```tsx
import { VirtualTable } from "react-tanstack-virtual-table";
import type { ColumnDef } from "@tanstack/react-table";

// Define your data type
type Person = {
  name: string;
  age: number;
  email: string;
};

// Prepare your data
const data: Person[] = [
  { name: "John Doe", age: 30, email: "john@example.com" },
  { name: "Jane Smith", age: 25, email: "jane@example.com" },
  { name: "Bob Johnson", age: 35, email: "bob@example.com" },
];

// Define columns
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

// Use the component
function App() {
  return <VirtualTable data={data} columns={columns} height={400} />;
}
```

## Step-by-Step Setup

### Step 1: Import the Component

```tsx
import { VirtualTable } from "react-tanstack-virtual-table";
import type { ColumnDef } from "@tanstack/react-table";
```

### Step 2: Define Your Data Type

```tsx
type Person = {
  name: string;
  age: number;
  email: string;
};
```

### Step 3: Prepare Your Data

```tsx
const data: Person[] = [
  { name: "John Doe", age: 30, email: "john@example.com" },
  // ... more rows
];
```

### Step 4: Define Columns

```tsx
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
```

### Step 5: Render the Table

```tsx
<VirtualTable data={data} columns={columns} height={400} />
```

## Common Patterns

### With Cell Editing

```tsx
const [tableData, setTableData] = useState(data);

<VirtualTable
  data={tableData}
  columns={columns}
  height={400}
  readonly={false}
  onCellValueChange={(rowIndex, columnId, value) => {
    // Update your data
    const newData = [...tableData];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [columnId]: value,
    };
    setTableData(newData);
  }}
/>;
```

### With Custom Styling

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={400}
  className="my-custom-table"
  style={{ border: "2px solid blue" }}
/>
```

### With Theme

```tsx
<VirtualTable data={data} columns={columns} height={400} theme="dark" />
```

## Next Steps

- Learn about [Cell Editing](./CELL_EDITING.md)
- Explore [Styling Options](./STYLING.md)
- Check the [API Reference](./API.md)
