# Examples

A collection of practical examples demonstrating various features and use cases.

## Basic Examples

### Simple Read-Only Table

```tsx
import { VirtualTable } from "react-tanstack-virtual-table";
import type { ColumnDef } from "@tanstack/react-table";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

const products: Product[] = [
  { id: 1, name: "Laptop", price: 999, category: "Electronics" },
  { id: 2, name: "Mouse", price: 25, category: "Electronics" },
  // ... more products
];

const columns: ColumnDef<Product>[] = [
  { header: "ID", accessorKey: "id" },
  { header: "Name", accessorKey: "name" },
  { header: "Price", accessorKey: "price" },
  { header: "Category", accessorKey: "category" },
];

function ProductTable() {
  return (
    <VirtualTable
      data={products}
      columns={columns}
      height={500}
      readonly={true}
    />
  );
}
```

### Editable Table with State Management

```tsx
import { useState } from "react";
import { VirtualTable } from "react-tanstack-virtual-table";

type Employee = {
  id: number;
  name: string;
  department: string;
  salary: number;
};

const initialEmployees: Employee[] = [
  { id: 1, name: "Alice", department: "Engineering", salary: 100000 },
  { id: 2, name: "Bob", department: "Marketing", salary: 80000 },
];

function EmployeeTable() {
  const [employees, setEmployees] = useState(initialEmployees);

  const columns: ColumnDef<Employee>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Name", accessorKey: "name" },
    { header: "Department", accessorKey: "department" },
    { header: "Salary", accessorKey: "salary" },
  ];

  const handleCellEdit = (rowIndex: number, columnId: string, value: string) => {
    setEmployees((prev) => {
      const newData = [...prev];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [columnId]: columnId === "id" || columnId === "salary" 
          ? Number(value) 
          : value,
      };
      return newData;
    });
  };

  return (
    <VirtualTable
      data={employees}
      columns={columns}
      height={400}
      readonly={false}
      onCellEdit={handleCellEdit}
    />
  );
}
```

## Advanced Examples

### Large Dataset (10,000+ rows)

```tsx
import { useMemo } from "react";
import { VirtualTable } from "react-tanstack-virtual-table";

function LargeDataTable() {
  // Generate large dataset
  const data = useMemo(() => {
    return Array.from({ length: 10000 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      value: Math.random() * 1000,
      category: `Category ${(i % 10) + 1}`,
    }));
  }, []);

  const columns: ColumnDef<typeof data[0]>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Name", accessorKey: "name" },
    { header: "Value", accessorKey: "value" },
    { header: "Category", accessorKey: "category" },
  ];

  return (
    <VirtualTable
      data={data}
      columns={columns}
      height={600}
      estimateRowHeight={40}
    />
  );
}
```

### Custom Cell Rendering

```tsx
import { VirtualTable } from "react-tanstack-virtual-table";
import type { ColumnDef } from "@tanstack/react-table";

type Order = {
  id: number;
  customer: string;
  amount: number;
  status: "pending" | "completed" | "cancelled";
  date: string;
};

const orders: Order[] = [
  { id: 1, customer: "John", amount: 150, status: "completed", date: "2024-01-15" },
  // ... more orders
];

const columns: ColumnDef<Order>[] = [
  { header: "ID", accessorKey: "id" },
  { header: "Customer", accessorKey: "customer" },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: (info) => `$${info.getValue().toFixed(2)}`,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (info) => {
      const status = info.getValue() as string;
      const colors = {
        pending: "orange",
        completed: "green",
        cancelled: "red",
      };
      return (
        <span style={{ color: colors[status] }}>
          {status.toUpperCase()}
        </span>
      );
    },
  },
  { header: "Date", accessorKey: "date" },
];

function OrderTable() {
  return (
    <VirtualTable
      data={orders}
      columns={columns}
      height={500}
    />
  );
}
```

### With Auto Column Sizing

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={500}
  autoFitColumnWidth={true}
  autoFitOptions={{
    minWidth: 100,
    maxWidth: 500,
    padding: 20,
  }}
/>
```

### Dark Theme

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={500}
  theme="dark"
/>
```

### Custom Theme Override

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={500}
  themeOverride={{
    "--vt-bg": "#f5f5f5",
    "--vt-bg-header": "#e0e0e0",
    "--vt-border": "#cccccc",
    "--vt-text": "#333333",
    "--vt-border-focus": "#2196F3",
  }}
/>
```

### Without Row Headers

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={500}
  showRowHeader={false}
/>
```

### Without Column Headers

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={500}
  showColumnHeader={false}
/>
```

### Custom Row Height

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={500}
  estimateRowHeight={60}
/>
```

## Integration Examples

### With React Query

```tsx
import { useQuery } from "@tanstack/react-query";
import { VirtualTable } from "react-tanstack-virtual-table";

function DataTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <VirtualTable
      data={data || []}
      columns={columns}
      height={500}
    />
  );
}
```

### With Form State Management

```tsx
import { useState } from "react";
import { VirtualTable } from "react-tanstack-virtual-table";

function FormTable() {
  const [formData, setFormData] = useState(initialData);

  const handleCellEdit = (rowIndex: number, columnId: string, value: string) => {
    setFormData((prev) => {
      const newData = [...prev];
      newData[rowIndex] = { ...newData[rowIndex], [columnId]: value };
      return newData;
    });
  };

  const handleSubmit = () => {
    console.log("Submitting:", formData);
    // Submit to API
  };

  return (
    <div>
      <VirtualTable
        data={formData}
        columns={columns}
        height={400}
        onCellEdit={handleCellEdit}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

## Best Practices

1. **Memoize Large Datasets**: Use `useMemo` for large datasets to prevent unnecessary recalculations
2. **Stable Column Definitions**: Define columns outside the component or use `useMemo`
3. **Handle Cell Edits Properly**: Always update your state immutably
4. **Use Appropriate Row Heights**: Set `estimateRowHeight` close to actual row height for better performance
5. **Leverage Virtualization**: The table handles large datasets efficiently, don't paginate unnecessarily

