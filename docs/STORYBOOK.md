# Storybook Guide

Storybook provides an interactive playground to explore and test all features of the Virtual Table library.

## Running Storybook

### Start Development Server

```bash
npm run storybook
```

This will:
- Start Storybook on `http://localhost:6006`
- Open automatically in your browser
- Hot-reload when you make changes

### Build Static Storybook

```bash
npm run build-storybook
```

This creates a static build in the `storybook-static` directory that can be deployed.

## Available Stories

### Basic Stories

1. **Basic** - Simple table with 100 rows
2. **Large Dataset** - 10,000 rows demonstrating virtualization
3. **Small Dataset** - 10 rows for testing small data scenarios

### Feature Stories

4. **Editable** - Table with cell editing enabled
5. **Read-Only** - Table with editing disabled
6. **Keyboard Navigation** - Interactive demo of keyboard shortcuts
7. **Auto Column Sizing** - Automatic column width calculation
8. **Custom Cell Rendering** - Examples of custom cell formats

### Theming Stories

9. **Dark Theme** - Dark theme example
10. **Custom Theme** - Custom color scheme using CSS variables
11. **No Row Header** - Table without row numbers
12. **No Column Header** - Table without column headers

### Advanced Stories

13. **Product Table** - Real-world product inventory example
14. **Custom Row Height** - Table with custom row heights
15. **All Features** - Combination of all features

## Using Storybook

### Controls Panel

Use the **Controls** panel to:
- Adjust table height
- Toggle features (readonly, showRowHeader, etc.)
- Change themes
- Modify row heights
- Enable/disable auto column sizing

### Actions Panel

The **Actions** panel shows:
- Cell edit events
- Click events
- Keyboard navigation events

### Viewport Toolbar

Use the viewport toolbar to:
- Test different screen sizes
- Check responsive behavior

### Docs Tab

The **Docs** tab provides:
- Component documentation
- Prop descriptions
- Usage examples
- Code snippets

## Story Organization

Stories are organized by category:

```
VirtualTable/
├── Basic Examples
│   ├── Basic
│   ├── Large Dataset
│   └── Small Dataset
├── Editing
│   ├── Editable
│   └── Read-Only
├── Theming
│   ├── Dark Theme
│   └── Custom Theme
└── Advanced
    ├── Auto Column Sizing
    └── All Features
```

## Interactive Testing

### Testing Cell Editing

1. Open the **Editable** story
2. Double-click any cell
3. Edit the value
4. Press Enter or click outside to save
5. Check the Actions panel for the edit event

### Testing Keyboard Navigation

1. Open the **Keyboard Navigation** story
2. Click a cell to select it
3. Use arrow keys to navigate
4. Press Tab to move to next cell
5. Press Enter/F2 to edit
6. Press Escape to exit edit mode

### Testing Virtualization

1. Open the **Large Dataset** story
2. Scroll quickly through 10,000 rows
3. Notice smooth performance
4. Check that only visible rows are rendered

### Testing Themes

1. Open **Dark Theme** or **Custom Theme** stories
2. Use Controls to switch themes
3. Adjust theme variables in Custom Theme story

## Code Examples

Each story includes:
- **Source code** - View the implementation
- **Controls** - Adjust props interactively
- **Actions** - See events in real-time

## Best Practices

1. **Test with different data sizes** - Use Large Dataset and Small Dataset stories
2. **Test editing flow** - Use Editable story to verify cell editing
3. **Test keyboard navigation** - Use Keyboard Navigation story
4. **Test theming** - Use theme stories to verify styling
5. **Check responsiveness** - Use viewport toolbar

## Troubleshooting

### Storybook won't start

- Make sure all dependencies are installed: `npm install`
- Check that port 6006 is available
- Try clearing node_modules and reinstalling

### Styles not appearing

- Check that CSS files are imported in `.storybook/preview.ts`
- Verify CSS files exist in `src/styles/`

### Stories not showing

- Check that story files are in `src/stories/` or match the pattern in `.storybook/main.ts`
- Verify story files have `.stories.tsx` extension

## Adding New Stories

To add a new story:

1. Create a new story file: `src/stories/MyStory.stories.tsx`
2. Export a story using the `Story` type
3. Storybook will automatically pick it up

Example:

```tsx
import type { StoryObj } from "@storybook/react";
import { VirtualTable } from "../core/VirtualTable";

export const MyStory: StoryObj<typeof VirtualTable> = {
  args: {
    data: myData,
    columns: myColumns,
    height: 400,
  },
};
```

## Deployment

### Build for Production

```bash
npm run build-storybook
```

### Deploy to GitHub Pages

1. Build Storybook: `npm run build-storybook`
2. Deploy the `storybook-static` folder
3. Configure your hosting service

### Deploy to Netlify/Vercel

Both platforms can automatically build and deploy Storybook:
- Netlify: Add build command `npm run build-storybook`
- Vercel: Configure for static site deployment

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Storybook for React](https://storybook.js.org/docs/react/get-started/introduction)
- [Writing Stories](https://storybook.js.org/docs/react/writing-stories/introduction)

