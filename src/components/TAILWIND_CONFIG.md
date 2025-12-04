# Tailwind CSS Configuration for Glassmorphic Components

To use these components effectively, ensure your Tailwind CSS is properly configured.

## 1. Required Tailwind CSS Setup

Add this to your `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        sm: "4px",
        DEFAULT: "12px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      colors: {
        // Ensure warm tones are available
        orange: {
          300: "#fed7aa",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
        },
        blue: {
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
        },
        green: {
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
        },
        purple: {
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
        },
      },
    },
  },
  plugins: [],
};
```

## 2. Global CSS Setup

Add this to your global CSS file (e.g., `src/index.css` or `src/styles/globals.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Dark theme background */
@layer base {
  body {
    @apply bg-gray-950 text-gray-100;
  }

  html {
    @apply scroll-smooth;
  }
}

/* Optional: Custom scrollbar styling */
@layer utilities {
  ::-webkit-scrollbar {
    @apply w-2 h-2;
  }

  ::-webkit-scrollbar-track {
    @apply bg-gray-900/30;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-gray-700/50 rounded-full;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-600/70;
  }
}
```

## 3. Installation Commands

```bash
# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

## 4. Key Tailwind Classes Used

### Backdrop Blur
- `backdrop-blur-md` - Medium blur effect for glassmorphism

### Backgrounds
- `bg-black/20` - Semi-transparent black backgrounds
- `bg-gradient-to-br` - Gradient backgrounds
- `from-orange-500/70 to-orange-600/70` - Colored gradient overlays

### Borders
- `border-white/10` - Subtle white borders
- `rounded-3xl` - Highly rounded corners
- `rounded-full` - Circular elements

### Shadows
- `shadow-lg` - Large shadows
- `shadow-black/20` - Semi-transparent shadows
- `drop-shadow()` - Filter-based shadows

### Colors
- `text-orange-400` - Warm accent text
- `text-gray-400` - Secondary text
- `text-white` - Primary text

### Opacity and Transitions
- `opacity-80` - Semi-transparent elements
- `transition-all` - Smooth transitions
- `duration-300` - Transition timing

## 5. Design Tokens

### Color Palette
```
Primary Accent: Orange (#fb923c)
Secondary Accents: Blue, Green, Purple
Dark Background: Black with transparency
Text: White and Gray
```

### Border Radius
```
Cards & Buttons: rounded-3xl (24px)
Circular: rounded-full
```

### Spacing
```
Card Padding: p-6
Gap Between Elements: gap-4
```

### Effects
```
Blur: backdrop-blur-md
Shadows: shadow-lg with 20% opacity
Borders: white with 10% opacity
Hover Effects: Increased opacity and elevated shadows
```

## 6. Usage in Components

All components use the following Tailwind patterns:

1. **Glassmorphism**: `backdrop-blur-md bg-black/20 border border-white/10`
2. **Rounded Corners**: `rounded-3xl` for cards, `rounded-full` for buttons
3. **Warm Tones**: Primary orange accent, secondary colors for variety
4. **Smooth Interactions**: `transition-all duration-300` for hover effects
5. **Dark Theme**: Black backgrounds with gray text

## 7. Browser Support

The components use:
- `backdrop-filter` (modern browsers support this)
- CSS Grid and Flexbox
- CSS Variables and Filter Effects

Ensure your browser supports these features. The components work on:
- Chrome 76+
- Firefox 103+
- Safari 9+
- Edge 79+

## 8. Performance Tips

1. Use `@apply` for repeated styles if needed
2. Enable Tailwind's purging in production
3. Use PurgeCSS with proper content patterns
4. Consider using CSS containment for performance

## 9. Customization

To customize the glassmorphic effect:

```jsx
// Increase blur effect
className="backdrop-blur-xl bg-black/30"

// Increase transparency
className="bg-black/40"

// Change border opacity
className="border-white/20"

// Adjust shadow
className="shadow-2xl shadow-black/40"
```

## 10. Dark Mode Configuration (Optional)

If using dark mode strategy:

```javascript
export default {
  darkMode: 'class', // or 'media'
  // ... rest of config
}
```

Add `dark:` prefix for dark mode specific styles (though our components are already dark by default).
