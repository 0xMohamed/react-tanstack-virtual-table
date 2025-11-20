import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { VirtualTable } from "../core/VirtualTable";
import type { ColumnDef } from "@tanstack/react-table";

// Mock data generators
const generatePerson = (index: number) => ({
  id: index + 1,
  name: `Person ${index + 1}`,
  age: 20 + (index % 50),
  email: `person${index + 1}@example.com`,
  department: ["Engineering", "Marketing", "Sales", "Support"][index % 4],
  salary: 50000 + (index % 100000),
  status: ["active", "inactive", "pending"][index % 3] as
    | "active"
    | "inactive"
    | "pending",
  joinDate: new Date(2020 + (index % 4), index % 12, (index % 28) + 1)
    .toISOString()
    .split("T")[0],
});

const generateProducts = (index: number) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
  category: ["Electronics", "Clothing", "Food", "Books"][index % 4],
  price: (Math.random() * 1000).toFixed(2),
  stock: Math.floor(Math.random() * 100),
  supplier: `Supplier ${(index % 10) + 1}`,
});

type Person = {
  id: number;
  name: string;
  age: number;
  email: string;
  department: string;
  salary: number;
  status: "active" | "inactive" | "pending";
  joinDate: string;
};

type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  supplier: string;
};

const meta: Meta<typeof VirtualTable> = {
  title: "VirtualTable",
  component: VirtualTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A high-performance virtualized table component built with TanStack Table and TanStack Virtual.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    height: {
      control: { type: "number", min: 200, max: 1000, step: 50 },
      description: "Height of the table container in pixels",
    },
    estimateRowHeight: {
      control: { type: "number", min: 20, max: 100, step: 5 },
      description: "Estimated row height for virtualization",
    },
    readonly: {
      control: "boolean",
      description: "Disable cell editing",
    },
    showRowHeader: {
      control: "boolean",
      description: "Show row number column",
    },
    showColumnHeader: {
      control: "boolean",
      description: "Show column headers",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Built-in theme",
    },
    autoFitColumnWidth: {
      control: "boolean",
      description: "Enable automatic column sizing",
    },
  },
};

export default meta;
type Story = StoryObj<typeof VirtualTable>;

// Basic columns
const personColumns: ColumnDef<Person>[] = [
  { header: "ID", accessorKey: "id" },
  { header: "Name", accessorKey: "name" },
  { header: "Age", accessorKey: "age" },
  { header: "Email", accessorKey: "email" },
  { header: "Department", accessorKey: "department" },
  { header: "Salary", accessorKey: "salary" },
  { header: "Status", accessorKey: "status" },
  { header: "Join Date", accessorKey: "joinDate" },
];

// Basic Story
export const Basic: Story = {
  args: {
    data: Array.from({ length: 100 }, (_, i) => generatePerson(i)),
    columns: personColumns,
    height: 400,
  },
};

// Large Dataset
export const LargeDataset: Story = {
  args: {
    data: Array.from({ length: 10000 }, (_, i) => generatePerson(i)),
    columns: personColumns,
    height: 600,
    estimateRowHeight: 40,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates virtualization with 10,000 rows. Only visible rows are rendered.",
      },
    },
  },
};

// Editable Table
export const Editable: Story = {
  render: (args) => {
    const [data, setData] = useState(
      Array.from({ length: 50 }, (_, i) => generatePerson(i))
    );

    const handleCellEdit = (
      rowIndex: number,
      columnId: string,
      value: string
    ) => {
      setData((prev) => {
        const newData = [...prev];
        newData[rowIndex] = {
          ...newData[rowIndex],
          [columnId]:
            columnId === "id" || columnId === "age" || columnId === "salary"
              ? Number(value)
              : value,
        };
        return newData;
      });
    };

    return (
      <VirtualTable
        {...args}
        data={data}
        readonly={false}
        onCellValueChange={handleCellEdit}
      />
    );
  },
  args: {
    columns: personColumns,
    height: 500,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Editable table. Double-click a cell or press Enter/F2 to edit. Press Escape to exit edit mode.",
      },
    },
  },
};

// Read-Only Table
export const ReadOnly: Story = {
  args: {
    data: Array.from({ length: 100 }, (_, i) => generatePerson(i)),
    columns: personColumns,
    height: 400,
    readonly: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Read-only table. Cells cannot be edited.",
      },
    },
  },
};

// Dark Theme
export const DarkTheme: Story = {
  args: {
    data: Array.from({ length: 100 }, (_, i) => generatePerson(i)),
    columns: personColumns,
    height: 400,
    theme: "dark",
  },
  parameters: {
    backgrounds: {
      default: "dark",
    },
    docs: {
      description: {
        story: "Table with dark theme applied.",
      },
    },
  },
};

// Custom Theme
export const CustomTheme: Story = {
  args: {
    data: Array.from({ length: 100 }, (_, i) => generatePerson(i)),
    columns: personColumns,
    height: 400,
    themeOverride: {
      "--vt-bg": "#f5f5f5",
      "--vt-bg-header": "#2196F3",
      "--vt-bg-active-cell": "#E3F2FD",
      "--vt-border": "#BBDEFB",
      "--vt-text": "#212121",
      "--vt-border-focus": "#1976D2",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Table with custom theme colors using CSS variables.",
      },
    },
  },
};

// Auto Column Sizing
export const AutoColumnSizing: Story = {
  args: {
    data: Array.from({ length: 100 }, (_, i) => generatePerson(i)),
    columns: personColumns,
    height: 400,
    autoFitColumnWidth: true,
    autoFitOptions: {
      minWidth: 80,
      maxWidth: 400,
      padding: 32,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Columns automatically resize based on content width. Useful for varying content lengths.",
      },
    },
  },
};

// Without Row Header
export const NoRowHeader: Story = {
  args: {
    data: Array.from({ length: 100 }, (_, i) => generatePerson(i)),
    columns: personColumns,
    height: 400,
    showRowHeader: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Table without the row number column on the left.",
      },
    },
  },
};

// Without Column Header
export const NoColumnHeader: Story = {
  args: {
    data: Array.from({ length: 100 }, (_, i) => generatePerson(i)),
    columns: personColumns,
    height: 400,
    showColumnHeader: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Table without column headers.",
      },
    },
  },
};

// Custom Row Height
export const CustomRowHeight: Story = {
  args: {
    data: Array.from({ length: 100 }, (_, i) => generatePerson(i)),
    columns: personColumns,
    height: 400,
    estimateRowHeight: 60,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Table with custom row height. Set estimateRowHeight close to actual row height for best performance.",
      },
    },
  },
};

// Custom Cell Rendering
export const CustomCellRendering: Story = {
  render: () => {
    const customColumns: ColumnDef<Person>[] = [
      { header: "ID", accessorKey: "id" },
      { header: "Name", accessorKey: "name" },
      {
        header: "Salary",
        accessorKey: "salary",
        cell: (info) => `$${info.getValue().toLocaleString()}`,
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const status = info.getValue() as string;
          const colors: Record<string, string> = {
            active: "#4CAF50",
            inactive: "#f44336",
            pending: "#FF9800",
          };
          return (
            <span
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                backgroundColor: colors[status],
                color: "white",
                fontSize: "12px",
              }}
            >
              {status.toUpperCase()}
            </span>
          );
        },
      },
      { header: "Email", accessorKey: "email" },
    ];

    return (
      <VirtualTable
        data={Array.from({ length: 50 }, (_, i) => generatePerson(i))}
        columns={customColumns}
        height={400}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Custom cell renderers allow you to format or style cell content.",
      },
    },
  },
};

// Product Table Example
export const ProductTable: Story = {
  render: () => {
    const productColumns: ColumnDef<Product>[] = [
      { header: "ID", accessorKey: "id" },
      { header: "Name", accessorKey: "name" },
      { header: "Category", accessorKey: "category" },
      {
        header: "Price",
        accessorKey: "price",
        cell: (info) => `$${info.getValue()}`,
      },
      { header: "Stock", accessorKey: "stock" },
      { header: "Supplier", accessorKey: "supplier" },
    ];

    const [products, setProducts] = useState(
      Array.from({ length: 200 }, (_, i) => generateProducts(i))
    );

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
            columnId === "id" || columnId === "stock" ? Number(value) : value,
        };
        return newData;
      });
    };

    return (
      <VirtualTable
        data={products}
        columns={productColumns}
        height={500}
        readonly={false}
        onCellValueChange={handleCellEdit}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Example product inventory table with editing enabled.",
      },
    },
  },
};

// Keyboard Navigation Demo
export const KeyboardNavigation: Story = {
  args: {
    data: Array.from({ length: 100 }, (_, i) => generatePerson(i)),
    columns: personColumns,
    height: 400,
    readonly: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Try keyboard navigation:\n- Arrow keys to move\n- Tab/Shift+Tab to navigate\n- Enter/F2 to edit\n- Escape to exit edit",
      },
    },
  },
};

// Small Dataset
export const SmallDataset: Story = {
  args: {
    data: Array.from({ length: 10 }, (_, i) => generatePerson(i)),
    columns: personColumns,
    height: 300,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Table with a small dataset. Virtualization still works efficiently.",
      },
    },
  },
};

// All Features Combined
export const AllFeatures: Story = {
  render: () => {
    const [data, setData] = useState(
      Array.from({ length: 500 }, (_, i) => generatePerson(i))
    );

    const handleCellEdit = (
      rowIndex: number,
      columnId: string,
      value: string
    ) => {
      setData((prev) => {
        const newData = [...prev];
        newData[rowIndex] = {
          ...newData[rowIndex],
          [columnId]:
            columnId === "id" || columnId === "age" || columnId === "salary"
              ? Number(value)
              : value,
        };
        return newData;
      });
    };

    return (
      <VirtualTable
        data={data}
        columns={personColumns}
        height={600}
        readonly={false}
        onCellValueChange={handleCellEdit}
        autoFitColumnWidth={true}
        autoFitOptions={{
          minWidth: 120,
          maxWidth: 400,
          padding: 32,
        }}
        theme="light"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Table with all features enabled: editing, auto-sizing, keyboard navigation, and theming.",
      },
    },
  },
};
