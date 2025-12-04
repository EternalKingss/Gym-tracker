# Quick Start Guide - Gym Tracker App

## Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
This will start the development server at `http://localhost:5173`

### 3. Open in Browser
Navigate to `http://localhost:5173` to see your app running with hot-reload enabled.

---

## Project Structure Quick Reference

```
src/
├── components/     # Reusable UI components (Button, StatCard, Header, Footer)
├── pages/         # Page components (Dashboard)
├── hooks/         # Custom React hooks (useLocalStorage)
├── utils/         # Utility functions (formatters, validators)
├── types/         # TypeScript type definitions
├── styles/        # CSS files (Tailwind + custom styles)
├── config/        # Configuration files
├── App.tsx        # Root component
└── main.tsx       # Entry point
```

---

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |

---

## Creating New Components

### Example: Creating a New Component

1. Create file in `src/components/MyComponent.tsx`:
```tsx
import React from 'react'

interface MyComponentProps {
  title: string
}

const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return <div className="p-4 rounded-lg bg-white/10">{title}</div>
}

export default MyComponent
```

2. Export in `src/components/index.ts`:
```ts
export { default as MyComponent } from './MyComponent'
```

3. Import and use:
```tsx
import { MyComponent } from '@components'

// Use in your component
<MyComponent title="Hello" />
```

---

## Using the Built-in Components

### Button
```tsx
import { Button } from '@components'

<Button variant="primary" size="medium" onClick={() => alert('Clicked!')}>
  Click Me
</Button>
```

### StatCard
```tsx
import { StatCard } from '@components'

<StatCard
  title="Total Workouts"
  value={24}
  unit="sessions"
  trend={{ value: 15, direction: 'up' }}
/>
```

### Header
```tsx
import { Header } from '@components'

<Header title="My App" subtitle="Welcome!" />
```

### Footer
```tsx
import { Footer } from '@components'

<Footer />
```

---

## Styling with Tailwind CSS

The project uses Tailwind CSS for styling. Use utility classes:

```tsx
<div className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700">
  Styled with Tailwind
</div>
```

---

## Adding Animations with Framer Motion

Import and use Framer Motion for animations:

```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Animated content
</motion.div>
```

---

## TypeScript Support

All code is TypeScript. Define types for better type safety:

```tsx
interface UserProps {
  name: string
  age: number
}

const User: React.FC<UserProps> = ({ name, age }) => {
  return <div>{name} ({age})</div>
}
```

---

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port.

### TypeScript Errors
Check the terminal during development for TypeScript errors. Fix them before building.

### Tailwind Classes Not Working
Ensure the CSS is imported in your component. Tailwind styles are automatically applied through `src/styles/index.css`.

---

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Framer Motion Documentation](https://www.framer.com/motion)

---

## Next Steps

1. Modify the Dashboard in `src/pages/Dashboard.tsx`
2. Create new components in `src/components/`
3. Add new pages in `src/pages/`
4. Customize colors in `tailwind.config.js`
5. Add API integration when ready

Happy coding!
