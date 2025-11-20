# Cell Editing Guide

Learn how to enable and handle cell editing in your virtual table.

## Basic Cell Editing

### Enable Editing

Set `readonly={false}` to enable cell editing:

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={400}
  readonly={false}
  onCellValueChange={(rowIndex, columnId, value) => {
    console.log(`Row ${rowIndex}, Column ${columnId}: ${value}`);
  }}
/>
```

### Handle Cell Edits

The `onCellValueChange` callback receives three parameters:

- `rowIndex`: The zero-based index of the row
- `columnId`: The ID of the column (from `accessorKey` or `id`)
- `value`: The new string value from the cell

```tsx
const handleCellEdit = (rowIndex: number, columnId: string, value: string) => {
  // Update your data state
  setData((prev) => {
    const newData = [...prev];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [columnId]: value,
    };
    return newData;
  });
};
```

## Complete Example

```tsx
import { useState } from "react";
import { VirtualTable } from "react-tanstack-virtual-table";
import type { ColumnDef } from "@tanstack/react-table";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

const initialProducts: Product[] = [
  { id: 1, name: "Laptop", price: 999, stock: 10 },
  { id: 2, name: "Mouse", price: 25, stock: 50 },
];

function EditableProductTable() {
  const [products, setProducts] = useState(initialProducts);

  const columns: ColumnDef<Product>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Name", accessorKey: "name" },
    { header: "Price", accessorKey: "price" },
    { header: "Stock", accessorKey: "stock" },
  ];

  const handleCellEdit = (
    rowIndex: number,
    columnId: string,
    value: string
  ) => {
    setProducts((prev) => {
      const newData = [...prev];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [columnId]:
          columnId === "id" || columnId === "price" || columnId === "stock"
            ? Number(value)
            : value,
      };
      return newData;
    });
  };

  return (
    <VirtualTable
      data={products}
      columns={columns}
      height={400}
      readonly={false}
      onCellValueChange={handleCellEdit}
    />
  );
}
```

## How Cell Editing Works

### User Interactions

1. **Click**: Selects a cell (blue focus ring appears)
2. **Double-Click**: Selects and enters edit mode
3. **Enter / F2**: Enters edit mode for selected cell
4. **Escape**: Exits edit mode (keeps selection)
5. **Click Outside**: Deselects and exits edit mode

### Edit Mode

When a cell enters edit mode:

- A textarea appears over the cell
- The cell value is pre-filled
- The textarea is automatically focused
- The focus ring remains visible

### Type Conversion

The `onCellValueChange` callback always receives a **string** value. You need to convert it to the appropriate type:

```tsx
const handleCellEdit = (rowIndex: number, columnId: string, value: string) => {
  setData((prev) => {
    const newData = [...prev];
    const currentRow = newData[rowIndex];

    // Type conversion based on column
    let convertedValue: any = value;

    if (columnId === "price" || columnId === "amount") {
      convertedValue = parseFloat(value) || 0;
    } else if (columnId === "quantity" || columnId === "id") {
      convertedValue = parseInt(value, 10) || 0;
    } else if (columnId === "isActive" || columnId === "enabled") {
      convertedValue = value === "true" || value === "1";
    } else if (columnId === "date") {
      convertedValue = new Date(value);
    }

    newData[rowIndex] = {
      ...currentRow,
      [columnId]: convertedValue,
    };

    return newData;
  });
};
```

## Advanced Patterns

### Validation

Add validation before updating:

```tsx
const handleCellEdit = (rowIndex: number, columnId: string, value: string) => {
  // Validate price
  if (columnId === "price") {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      alert("Price must be a positive number");
      return; // Don't update
    }
  }

  // Validate email
  if (columnId === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      alert("Invalid email format");
      return; // Don't update
    }
  }

  // Update if validation passes
  setData((prev) => {
    const newData = [...prev];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [columnId]: value,
    };
    return newData;
  });
};
```

### Async Updates (API Calls)

```tsx
const handleCellEdit = async (
  rowIndex: number,
  columnId: string,
  value: string
) => {
  const rowId = data[rowIndex].id;

  try {
    // Optimistic update
    setData((prev) => {
      const newData = [...prev];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [columnId]: value,
      };
      return newData;
    });

    // API call
    await fetch(`/api/products/${rowId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [columnId]: value }),
    });
  } catch (error) {
    // Revert on error
    console.error("Failed to update:", error);
    // Optionally reload data or show error message
  }
};
```

### Read-Only Columns

Make specific columns read-only by not including them in editable columns:

```tsx
const columns: ColumnDef<Product>[] = [
  {
    header: "ID",
    accessorKey: "id",
    // This column is read-only (no editing)
  },
  {
    header: "Name",
    accessorKey: "name",
    // This column is editable
  },
];
```

Or handle it in the callback:

```tsx
const handleCellEdit = (rowIndex: number, columnId: string, value: string) => {
  // Skip read-only columns
  if (columnId === "id" || columnId === "createdAt") {
    return;
  }

  // Update editable columns
  setData((prev) => {
    const newData = [...prev];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [columnId]: value,
    };
    return newData;
  });
};
```

### Custom Cell Editors

You can create custom cell renderers that include their own input controls:

```tsx
const columns: ColumnDef<Product>[] = [
  {
    header: "Price",
    accessorKey: "price",
    cell: (info) => {
      const [isEditing, setIsEditing] = useState(false);
      const [value, setValue] = useState(String(info.getValue()));

      if (isEditing) {
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
              handleCellEdit(info.row.index, "price", value);
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCellEdit(info.row.index, "price", value);
                setIsEditing(false);
              }
            }}
            autoFocus
          />
        );
      }

      return (
        <div onDoubleClick={() => setIsEditing(true)}>${info.getValue()}</div>
      );
    },
  },
];
```

## Best Practices

1. **Always update immutably**: Use spread operators to create new objects/arrays
2. **Handle type conversion**: The callback receives strings, convert as needed
3. **Validate input**: Add validation before updating state
4. **Provide feedback**: Show loading states or error messages for async operations
5. **Preserve other fields**: Always spread the existing row data when updating

## Common Issues

### Value Not Updating

Make sure you're updating state correctly:

```tsx
// ❌ Wrong - mutating state
const handleCellEdit = (rowIndex, columnId, value) => {
  data[rowIndex][columnId] = value; // Don't do this!
};

// ✅ Correct - immutable update
const handleCellEdit = (rowIndex, columnId, value) => {
  setData((prev) => {
    const newData = [...prev];
    newData[rowIndex] = { ...newData[rowIndex], [columnId]: value };
    return newData;
  });
};
```

### Type Mismatches

Remember to convert string values:

```tsx
// ❌ Wrong - keeping as string
newData[rowIndex] = { ...newData[rowIndex], price: value };

// ✅ Correct - converting to number
newData[rowIndex] = { ...newData[rowIndex], price: parseFloat(value) };
```
