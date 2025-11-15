# API Reference

Complete reference for all props, types, and methods.

## VirtualTable Component

### Props

#### `data` (required)

- **Type**: `TData[]`
- **Description**: Array of data objects to display in the table
- **Example**: `[{ name: "John", age: 30 }, { name: "Jane", age: 25 }]`

#### `columns` (required)

- **Type**: `ColumnDef<TData>[]`
- **Description**: Array of column definitions. Uses TanStack Table's `ColumnDef` type.
- **Example**:
  ```tsx
  [
    { header: "Name", accessorKey: "name" },
    { header: "Age", accessorKey: "age" },
  ]
  ```

#### `height`

- **Type**: `number`
- **Default**: `400`
- **Description**: Height of the table container in pixels
- **Example**: `height={600}`

#### `estimateRowHeight`

- **Type**: `number`
- **Default**: `40`
- **Description**: Estimated height of each row in pixels. Used for virtualization calculations.
- **Example**: `estimateRowHeight={50}`

#### `className`

- **Type**: `string`
- **Description**: Additional CSS class name for the table container
- **Example**: `className="my-custom-table"`

#### `style`

- **Type**: `React.CSSProperties`
- **Description**: Inline styles for the table container
- **Example**: `style={{ border: "2px solid blue" }}`

#### `onCellEdit`

- **Type**: `(rowIndex: number, columnId: string, value: string) => void`
- **Description**: Callback fired when a cell is edited
- **Parameters**:
  - `rowIndex`: Zero-based index of the row
  - `columnId`: ID of the column (from `accessorKey` or `id`)
  - `value`: New string value from the cell
- **Example**:
  ```tsx
  onCellEdit={(rowIndex, columnId, value) => {
    console.log(`Row ${rowIndex}, Column ${columnId}: ${value}`);
  }}
  ```

#### `readonly`

- **Type**: `boolean`
- **Default**: `false`
- **Description**: If `true`, cells cannot be edited
- **Example**: `readonly={true}`

#### `showRowHeader`

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to show the row number column on the left
- **Example**: `showRowHeader={false}`

#### `rowHeaderWidth`

- **Type**: `number`
- **Default**: `60`
- **Description**: Width of the row header column in pixels
- **Example**: `rowHeaderWidth={80}`

#### `showColumnHeader`

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to show the column header row
- **Example**: `showColumnHeader={false}`

#### `autoFitColumnWidth`

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Enable automatic column width calculation based on content
- **Example**: `autoFitColumnWidth={true}`

#### `autoFitOptions`

- **Type**: `{ minWidth?: number; maxWidth?: number; padding?: number }`
- **Description**: Options for auto column sizing
- **Properties**:
  - `minWidth`: Minimum column width in pixels (default: `50`)
  - `maxWidth`: Maximum column width in pixels (default: `500`)
  - `padding`: Additional padding to add to calculated width (default: `16`)
- **Example**:
  ```tsx
  autoFitOptions={{
    minWidth: 100,
    maxWidth: 400,
    padding: 20,
  }}
  ```

#### `theme`

- **Type**: `"light" | "dark"`
- **Default**: `"light"`
- **Description**: Built-in theme to use
- **Example**: `theme="dark"`

#### `themeOverride`

- **Type**: `Record<string, string>`
- **Description**: Override CSS variables for custom theming
- **Example**:
  ```tsx
  themeOverride={{
    "--vt-bg": "#ffffff",
    "--vt-border": "#e0e0e0",
  }}
  ```

## Types

### `VirtualTableProps<TData>`

Main props interface for the VirtualTable component.

```tsx
interface VirtualTableProps<TData extends RowData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  height?: number;
  estimateRowHeight?: number;
  className?: string;
  style?: React.CSSProperties;
  onCellEdit?: (rowIndex: number, columnId: string, value: string) => void;
  readonly?: boolean;
  showRowHeader?: boolean;
  rowHeaderWidth?: number;
  showColumnHeader?: boolean;
  autoFitColumnWidth?: boolean;
  autoFitOptions?: {
    minWidth?: number;
    maxWidth?: number;
    padding?: number;
  };
  theme?: "light" | "dark";
  themeOverride?: Record<string, string>;
}
```

### `VirtualTableTheme`

Theme configuration interface (currently unused but reserved for future features).

```tsx
interface VirtualTableTheme {
  light?: Record<string, string>;
  dark?: Record<string, string>;
}
```

## Exported Hooks

### `useVirtualTable`

Core hook that sets up TanStack Table and Virtual.

```tsx
const { table, rowVirtualizer, parentRef } = useVirtualTable({
  data: TData[];
  columns: ColumnDef<TData>[];
  estimateRowHeight?: number;
});
```

**Returns**:
- `table`: TanStack Table instance
- `rowVirtualizer`: TanStack Virtual row virtualizer
- `parentRef`: Ref for the scrollable container

### `useEditableCell`

Hook for managing cell selection and editing state.

```tsx
const {
  selectedCell,
  setSelectedCell,
  editableCell,
  setEditableCell,
  selectedCellElementRef,
  editableCellElementRef,
  focusRingStyle,
  updateFocusRingPosition,
  handleCellClick,
  handleCellDoubleClick,
  handleCellEdit,
} = useEditableCell({
  readonly?: boolean;
  onCellEdit?: (rowIndex: number, columnId: string, value: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  virtualItems?: unknown[];
});
```

### `useKeyboardNavigation`

Hook for keyboard navigation functionality.

```tsx
useKeyboardNavigation({
  table: Table<TData>;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  selectedCell: SelectedCell | null;
  editableCell: EditableCell | null;
  setSelectedCell: (cell: SelectedCell | null) => void;
  setEditableCell: (cell: EditableCell | null) => void;
  readonly?: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  selectedCellElementRef: React.RefObject<HTMLTableCellElement | null>;
});
```

### `useAutoColumnSize`

Hook for automatic column width calculation.

```tsx
useAutoColumnSize({
  enabled: boolean;
  table: Table<TData>;
  data: TData[];
  minWidth?: number;
  maxWidth?: number;
  padding?: number;
});
```

## Type Definitions

### `EditableCell`

```tsx
interface EditableCell {
  rowIndex: number;
  columnId: string;
}
```

### `SelectedCell`

```tsx
interface SelectedCell {
  rowIndex: number;
  columnId: string;
}
```

### `FocusRingStyle`

```tsx
interface FocusRingStyle {
  top: number;
  left: number;
  width: number;
  height: number;
  opacity: number;
}
```

## Column Definitions

The library uses TanStack Table's `ColumnDef` type. Common patterns:

### Basic Column

```tsx
{
  header: "Name",
  accessorKey: "name",
}
```

### Custom Header

```tsx
{
  header: () => <strong>Name</strong>,
  accessorKey: "name",
}
```

### Custom Cell Renderer

```tsx
{
  header: "Price",
  accessorKey: "price",
  cell: (info) => `$${info.getValue()}`,
}
```

### Sortable Column

```tsx
{
  header: "Name",
  accessorKey: "name",
  enableSorting: true, // Default is true
}
```

### Non-Sortable Column

```tsx
{
  header: "Actions",
  accessorKey: "actions",
  enableSorting: false,
}
```

### Column with Custom ID

```tsx
{
  id: "custom-id",
  header: "Name",
  accessorKey: "name",
}
```

## CSS Classes

The library uses the following CSS classes that you can override:

- `.vt-container`: Main table container
- `.vt-table`: Table element
- `.vt-thead`: Table header
- `.vt-tbody`: Table body
- `.vt-tr`: Table row
- `.vt-th`: Table header cell
- `.vt-td`: Table data cell
- `.vt-th--row-header`: Row header cell in header
- `.vt-td--row-header`: Row header cell in body
- `.vt-th--active`: Active column header
- `.vt-td--row-header-active`: Active row header
- `.vt-cell-selected`: Selected cell
- `.vt-cell-editable`: Editable textarea
- `.vt-focus-ring`: Focus ring overlay
- `.vt-focus-ring--visible`: Visible focus ring

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Arrow Up` | Move to cell above |
| `Arrow Down` | Move to cell below |
| `Arrow Left` | Move to cell on left |
| `Arrow Right` | Move to cell on right |
| `Tab` | Move to next cell (wraps to next row) |
| `Shift + Tab` | Move to previous cell (wraps to previous row) |
| `Enter` | Enter edit mode for selected cell |
| `F2` | Enter edit mode for selected cell |
| `Escape` | Exit edit mode (keeps selection) |

## Events

### Cell Click

- **Trigger**: Single click on a cell
- **Action**: Selects the cell (shows focus ring)

### Cell Double-Click

- **Trigger**: Double-click on a cell
- **Action**: Selects and enters edit mode

### Cell Edit

- **Trigger**: Value change in edit mode
- **Callback**: `onCellEdit(rowIndex, columnId, value)`

### Column Header Click

- **Trigger**: Click on column header
- **Action**: Toggles column sorting (if sorting enabled)

## Best Practices

1. **Memoize large datasets**: Use `useMemo` for data arrays
2. **Stable column definitions**: Define columns outside component or use `useMemo`
3. **Type safety**: Use TypeScript and define your data types
4. **Immutable updates**: Always update state immutably in `onCellEdit`
5. **Appropriate row heights**: Set `estimateRowHeight` close to actual height

