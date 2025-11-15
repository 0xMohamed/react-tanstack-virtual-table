# Styling & Theming Guide

The library uses CSS variables for theming, making it easy to customize the appearance.

## Built-in Themes

### Light Theme (Default)

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={400}
  theme="light" // or omit for default
/>
```

### Dark Theme

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={400}
  theme="dark"
/>
```

## CSS Variables

All styling is controlled through CSS variables. Here's the complete list:

### Colors

- `--vt-bg`: Background color of the table container
- `--vt-bg-header`: Background color of header cells
- `--vt-bg-active-row`: Background color of active row header
- `--vt-bg-active-column`: Background color of active column header
- `--vt-bg-active-cell`: Background color of selected/active cells
- `--vt-border`: Border color
- `--vt-border-focus`: Focus ring border color
- `--vt-text`: Primary text color
- `--vt-text-secondary`: Secondary text color

### Spacing & Sizing

- `--vt-padding-cell`: Padding inside table cells
- `--vt-padding-header`: Padding inside header cells
- `--vt-row-height`: Estimated row height
- `--vt-row-header-width`: Width of the row number column
- `--vt-header-height`: Height of the header row

### Visual Effects

- `--vt-radius`: Border radius
- `--vt-shadow-focus`: Box shadow for focus ring
- `--vt-transition`: Transition timing function

## Custom Theme

### Method 1: Using `themeOverride` Prop

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={400}
  themeOverride={{
    "--vt-bg": "#ffffff",
    "--vt-bg-header": "#f0f0f0",
    "--vt-border": "#d0d0d0",
    "--vt-text": "#333333",
    "--vt-border-focus": "#2196F3",
  }}
/>
```

### Method 2: Using CSS Classes

Create a custom CSS file:

```css
.my-custom-table {
  --vt-bg: #ffffff;
  --vt-bg-header: #f0f0f0;
  --vt-border: #d0d0d0;
  --vt-text: #333333;
  --vt-border-focus: #2196F3;
  --vt-padding-cell: 12px;
  --vt-padding-header: 16px;
}
```

Then apply the class:

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={400}
  className="my-custom-table"
/>
```

### Method 3: Global CSS Override

Override variables globally:

```css
:root {
  --vt-bg: #ffffff;
  --vt-bg-header: #f0f0f0;
  --vt-border: #d0d0d0;
  --vt-text: #333333;
}
```

## Custom Styling Examples

### Corporate Blue Theme

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={400}
  themeOverride={{
    "--vt-bg": "#ffffff",
    "--vt-bg-header": "#1976D2",
    "--vt-bg-active-cell": "#E3F2FD",
    "--vt-border": "#BBDEFB",
    "--vt-text": "#212121",
    "--vt-border-focus": "#1976D2",
  }}
/>
```

### Minimalist Theme

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={400}
  themeOverride={{
    "--vt-bg": "#ffffff",
    "--vt-bg-header": "#ffffff",
    "--vt-border": "#e0e0e0",
    "--vt-text": "#212121",
    "--vt-padding-cell": "12px",
    "--vt-padding-header": "12px",
  }}
/>
```

### High Contrast Theme

```tsx
<VirtualTable
  data={data}
  columns={columns}
  height={400}
  themeOverride={{
    "--vt-bg": "#000000",
    "--vt-bg-header": "#333333",
    "--vt-bg-active-cell": "#555555",
    "--vt-border": "#666666",
    "--vt-text": "#ffffff",
    "--vt-border-focus": "#00ff00",
  }}
/>
```

## Custom Cell Styling

You can style individual cells using the `cell` renderer:

```tsx
const columns: ColumnDef<Data>[] = [
  {
    header: "Status",
    accessorKey: "status",
    cell: (info) => {
      const status = info.getValue();
      return (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor: status === "active" ? "#4CAF50" : "#f44336",
            color: "white",
          }}
        >
          {status}
        </span>
      );
    },
  },
];
```

## Custom Header Styling

You can customize headers using the `header` renderer:

```tsx
const columns: ColumnDef<Data>[] = [
  {
    header: () => (
      <div style={{ fontWeight: "bold", color: "#1976D2" }}>
        Custom Header
      </div>
    ),
    accessorKey: "name",
  },
];
```

## Responsive Styling

The table container can be styled responsively:

```css
.responsive-table {
  width: 100%;
  max-width: 100%;
}

@media (max-width: 768px) {
  .responsive-table {
    --vt-padding-cell: 4px;
    --vt-padding-header: 6px;
    --vt-row-header-width: 40px;
  }
}
```

## Overriding Specific Styles

If you need to override specific styles, you can target the CSS classes:

```css
/* Override cell styles */
.vt-td {
  font-size: 14px;
  font-family: 'Your Font', sans-serif;
}

/* Override header styles */
.vt-th {
  font-weight: 600;
  text-transform: uppercase;
}

/* Override focus ring */
.vt-focus-ring {
  border-radius: 8px;
}

/* Override selected cell */
.vt-cell-selected {
  background-color: #E3F2FD !important;
}
```

## Complete Theme Example

```tsx
const customTheme = {
  "--vt-bg": "#ffffff",
  "--vt-bg-header": "#f5f5f5",
  "--vt-bg-active-row": "rgba(33, 150, 243, 0.1)",
  "--vt-bg-active-column": "rgba(33, 150, 243, 0.15)",
  "--vt-bg-active-cell": "#E3F2FD",
  "--vt-border": "#e0e0e0",
  "--vt-border-focus": "#2196F3",
  "--vt-text": "#212121",
  "--vt-text-secondary": "#757575",
  "--vt-radius": "8px",
  "--vt-padding-cell": "12px",
  "--vt-padding-header": "16px",
  "--vt-shadow-focus": "0 0 0 2px rgba(33, 150, 243, 0.3)",
  "--vt-transition": "200ms ease-out",
};

<VirtualTable
  data={data}
  columns={columns}
  height={400}
  themeOverride={customTheme}
/>
```

## Tips

1. **Start with a theme**: Use `theme="light"` or `theme="dark"` as a base
2. **Override selectively**: Only override the variables you need to change
3. **Test contrast**: Ensure text is readable against backgrounds
4. **Consistent spacing**: Use consistent padding values for a polished look
5. **Focus states**: Make sure focus rings are visible for accessibility

