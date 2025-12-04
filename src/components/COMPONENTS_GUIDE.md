# Glassmorphic Components Guide

Complete documentation for all reusable React components with glassmorphic UI design.

## Overview

These components provide a modern, glassmorphic UI design system suitable for dashboard applications, health tracking apps, and modern web interfaces. All components feature:

- Dark theme with warm accent colors (orange, blue, green, purple)
- Backdrop blur effects for glassmorphism
- Highly rounded corners
- Subtle borders and shadows
- Smooth transitions and hover effects
- Full TypeScript support

---

## 1. GlassCard Component

### Purpose
A reusable base container component that provides the core glassmorphic effect.

### Props

```typescript
interface GlassCardProps {
  children: React.ReactNode;           // Card content
  className?: string;                  // Additional Tailwind classes
  onClick?: () => void;                // Click handler (optional)
}
```

### Features
- Backdrop blur effect
- Semi-transparent dark background
- Subtle white borders
- Rounded corners (rounded-3xl)
- Smooth hover effects
- Optional click handling

### Basic Usage

```tsx
import { GlassCard } from './components';

export function MyComponent() {
  return (
    <GlassCard>
      <h2>Hello World</h2>
      <p>This is a glass card</p>
    </GlassCard>
  );
}
```

### Advanced Usage

```tsx
<GlassCard
  className="max-w-lg"
  onClick={() => console.log('Clicked!')}
>
  <div className="space-y-4">
    <h3 className="text-white text-lg font-bold">Clickable Card</h3>
    <p className="text-gray-300">Click me for interactions</p>
  </div>
</GlassCard>
```

### Styling Customization

```tsx
// Large card
<GlassCard className="max-w-2xl p-8">

// Minimal padding
<GlassCard className="p-3">

// With max height
<GlassCard className="max-h-96 overflow-y-auto">
```

---

## 2. StatCard Component

### Purpose
Display statistics with title, value, unit, and optional icons. Perfect for dashboards.

### Props

```typescript
interface StatCardProps {
  title: string;                      // Stat label
  value: string | number;             // Stat value
  unit?: string;                      // Unit of measurement
  icon?: React.ReactNode;             // Optional emoji/icon
  accentColor?: 'orange' | 'blue' | 'green' | 'purple';
  className?: string;                 // Additional classes
}
```

### Color Options
- `orange` - Default, warm tone
- `blue` - Cool tone
- `green` - Success/positive tone
- `purple` - Premium/special tone

### Basic Usage

```tsx
import { StatCard } from './components';

export function StatsSection() {
  return (
    <StatCard
      title="Battery Level"
      value={85}
      unit="%"
      accentColor="orange"
    />
  );
}
```

### With Icons

```tsx
<StatCard
  title="Active Workouts"
  value={12}
  icon="🏋️"
  accentColor="orange"
/>

<StatCard
  title="Goals Completed"
  value={8}
  icon="✓"
  accentColor="green"
/>
```

### Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard title="Battery" value={85} unit="%" accentColor="orange" />
  <StatCard title="Meditation" value={45} unit="min" accentColor="purple" />
  <StatCard title="Calories" value={320} unit="kcal" accentColor="green" />
  <StatCard title="Heart Rate" value={72} unit="bpm" accentColor="blue" />
</div>
```

---

## 3. CircularProgress Component

### Purpose
Display progress as a circular indicator. Great for charging status, goal progress, etc.

### Props

```typescript
interface CircularProgressProps {
  percentage: number;                 // Progress 0-100
  size?: 'sm' | 'md' | 'lg';          // Component size
  color?: 'orange' | 'blue' | 'green' | 'purple';
  label?: string;                     // Label below percentage
  showPercentage?: boolean;           // Show % text (default: true)
  animated?: boolean;                 // Smooth animation (default: true)
  strokeWidth?: number;               // SVG stroke width (default: 6)
}
```

### Size Options
- `sm` - 100px (text-lg)
- `md` - 150px (text-3xl) - Default
- `lg` - 200px (text-4xl)

### Basic Usage

```tsx
import { CircularProgress } from './components';

export function ProgressSection() {
  return (
    <CircularProgress
      percentage={65}
      size="md"
      color="orange"
      label="Fitness Goal"
    />
  );
}
```

### Charging Indicator

```tsx
<CircularProgress
  percentage={5}
  size="lg"
  color="orange"
  label="Charging"
  animated={true}
/>
```

### Progress Grid

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-8 place-items-center">
  <CircularProgress percentage={65} size="md" color="orange" label="Fitness" />
  <CircularProgress percentage={80} size="md" color="blue" label="Water" />
  <CircularProgress percentage={45} size="md" color="green" label="Sleep" />
  <CircularProgress percentage={95} size="md" color="purple" label="Meditation" />
</div>
```

### Without Percentage Display

```tsx
<CircularProgress
  percentage={75}
  size="md"
  color="green"
  label="Complete"
  showPercentage={false}
/>
```

---

## 4. Button Component

### Purpose
Reusable button with multiple variants, sizes, and colors.

### Props

```typescript
interface ButtonProps {
  children: React.ReactNode;                      // Button text/content
  variant?: 'primary' | 'secondary' | 'ghost';   // Style variant
  size?: 'sm' | 'md' | 'lg';                      // Button size
  color?: 'orange' | 'blue' | 'green' | 'purple';
  onClick?: () => void;                          // Click handler
  disabled?: boolean;                            // Disabled state
  className?: string;                            // Additional classes
  type?: 'button' | 'submit' | 'reset';         // Button type
}
```

### Variants

1. **Primary** - Solid colored button with gradient
   ```tsx
   <Button variant="primary" color="orange">
     Click Me
   </Button>
   ```

2. **Secondary** - Outlined style with glassmorphism
   ```tsx
   <Button variant="secondary" color="blue">
     Learn More
   </Button>
   ```

3. **Ghost** - Transparent with border only
   ```tsx
   <Button variant="ghost" color="green">
     Cancel
   </Button>
   ```

### Size Options
- `sm` - Small button (px-4 py-2 text-sm)
- `md` - Medium button (px-6 py-3 text-base) - Default
- `lg` - Large button (px-8 py-4 text-lg)

### Color Options
- `orange` - Primary warm tone
- `blue` - Cool tone
- `green` - Success tone
- `purple` - Premium tone

### Basic Usage

```tsx
import { Button } from './components';

export function MyComponent() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <Button
      variant="primary"
      color="orange"
      onClick={handleClick}
    >
      Start Workout
    </Button>
  );
}
```

### All Variants and Colors

```tsx
<div className="space-y-4">
  {/* Primary variants */}
  <Button variant="primary" color="orange">Orange Primary</Button>
  <Button variant="primary" color="blue">Blue Primary</Button>
  <Button variant="primary" color="green">Green Primary</Button>
  <Button variant="primary" color="purple">Purple Primary</Button>

  {/* Secondary variants */}
  <Button variant="secondary" color="orange">Orange Secondary</Button>
  <Button variant="secondary" color="blue">Blue Secondary</Button>

  {/* Ghost variants */}
  <Button variant="ghost" color="green">Green Ghost</Button>
  <Button variant="ghost" color="purple">Purple Ghost</Button>
</div>
```

### Form Integration

```tsx
<form onSubmit={(e) => {
  e.preventDefault();
  // Handle submission
}}>
  {/* Form fields */}
  <Button type="submit" variant="primary" color="orange">
    Submit
  </Button>
</form>
```

### Disabled State

```tsx
<Button variant="primary" color="orange" disabled>
  Disabled Button
</Button>
```

### Full Width Button

```tsx
<Button variant="primary" color="orange" className="w-full">
  Full Width
</Button>
```

---

## 5. ProfileCard Component

### Purpose
Display user profile information with avatar and status indicator.

### Props

```typescript
interface ProfileCardProps {
  name: string;                                   // User name
  greeting?: string;                              // Greeting message
  avatarUrl?: string;                             // Image URL
  avatarInitials?: string;                        // Fallback initials
  status?: string;                                // Status text
  statusColor?: 'online' | 'away' | 'offline';   // Status color
  className?: string;                             // Additional classes
}
```

### Status Colors
- `online` - Green indicator
- `away` - Yellow indicator
- `offline` - Gray indicator

### Basic Usage

```tsx
import { ProfileCard } from './components';

export function Header() {
  return (
    <ProfileCard
      name="John Doe"
      greeting="Good morning"
    />
  );
}
```

### With Status

```tsx
<ProfileCard
  name="Sarah Mitchell"
  greeting="Welcome back"
  status="Active - Workout in progress"
  statusColor="online"
  avatarInitials="SM"
/>
```

### With Avatar Image

```tsx
<ProfileCard
  name="Alex Johnson"
  greeting="Hello"
  avatarUrl="https://example.com/avatar.jpg"
  status="Online"
  statusColor="online"
/>
```

### All Status Variations

```tsx
<div className="space-y-4">
  <ProfileCard
    name="John Doe"
    status="Online"
    statusColor="online"
  />
  <ProfileCard
    name="Jane Smith"
    status="Away"
    statusColor="away"
  />
  <ProfileCard
    name="Mike Brown"
    status="Offline"
    statusColor="offline"
  />
</div>
```

### Avatar Initials

If no avatar URL is provided, initials are automatically generated from the name:

```tsx
// Generates "AJ" initials
<ProfileCard name="Alex Johnson" />

// Uses custom initials
<ProfileCard name="User Name" avatarInitials="UN" />
```

---

## Component Architecture

### Component Hierarchy

```
GlassCard (Base)
├── StatCard
├── ProfileCard
└── Other Custom Cards

Button (Standalone)

CircularProgress (Standalone)
```

### Usage Pattern

All components follow a consistent pattern:

```tsx
import { GlassCard, StatCard, Button } from './components';

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Section 1 */}
      <GlassCard>
        <h2 className="text-white font-bold">Title</h2>
      </GlassCard>

      {/* Section 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="Stat 1" value={100} />
        <StatCard title="Stat 2" value={200} />
      </div>

      {/* Section 3 */}
      <Button onClick={() => {}}>Action</Button>
    </div>
  );
}
```

---

## Complete Dashboard Example

```tsx
import {
  GlassCard,
  StatCard,
  CircularProgress,
  Button,
  ProfileCard
} from './components';

export function CompleteDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with Profile */}
        <ProfileCard
          name="Alex Johnson"
          greeting="Good morning"
          status="Active"
          statusColor="online"
        />

        {/* Statistics Grid */}
        <section>
          <h2 className="text-white text-2xl font-bold mb-4">Today's Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Battery" value={85} unit="%" accentColor="orange" />
            <StatCard title="Meditation" value={45} unit="min" accentColor="purple" />
            <StatCard title="Calories" value={320} unit="kcal" accentColor="green" />
            <StatCard title="Heart Rate" value={72} unit="bpm" accentColor="blue" />
          </div>
        </section>

        {/* Progress Section */}
        <section>
          <h2 className="text-white text-2xl font-bold mb-4">Goals Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 place-items-center">
            <CircularProgress percentage={65} size="md" color="orange" label="Fitness" />
            <CircularProgress percentage={80} size="md" color="blue" label="Water" />
            <CircularProgress percentage={45} size="md" color="green" label="Sleep" />
            <CircularProgress percentage={95} size="md" color="purple" label="Meditation" />
          </div>
        </section>

        {/* Actions */}
        <section>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" color="orange">Start Workout</Button>
            <Button variant="secondary" color="blue">View History</Button>
            <Button variant="secondary" color="green">Add Goal</Button>
            <Button variant="ghost" color="purple">Settings</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
```

---

## Best Practices

1. **Spacing**: Use consistent spacing between components
   ```tsx
   <div className="space-y-6"> {/* 24px gap */}
   ```

2. **Grid Layouts**: Use responsive grids for stat cards
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
   ```

3. **Color Consistency**: Stick to theme colors for visual coherence
   ```tsx
   - Primary: orange
   - Secondary: blue, green, purple
   ```

4. **Typography**: Maintain hierarchy
   ```tsx
   - h1: text-3xl or text-4xl
   - h2: text-2xl
   - h3: text-lg
   - p: text-base
   ```

5. **Dark Background**: Always use dark background for glassmorphism
   ```tsx
   className="bg-gradient-to-br from-gray-900 via-black to-gray-900"
   ```

---

## Accessibility

- All components support keyboard navigation
- Buttons include focus states
- Colors have sufficient contrast
- Labels and aria attributes are included where appropriate

---

## Performance Tips

1. Use React.memo for components that receive static props
2. Memoize click handlers with useCallback
3. Use Tailwind's built-in optimizations
4. Lazy load components if needed for large dashboards

---

## Browser Support

- Chrome 76+
- Firefox 103+
- Safari 9+
- Edge 79+

All components use modern CSS features that are widely supported.

---

## Troubleshooting

### Components not showing blur effect
- Ensure `backdrop-filter` is supported in your browser
- Check that Tailwind CSS is properly configured
- Verify the stylesheet is loaded

### Colors not appearing
- Check that color classes are included in Tailwind config
- Verify you're using the correct accentColor prop values
- Ensure Tailwind purging includes component files

### Buttons not responding to clicks
- Verify onClick handler is passed correctly
- Check that button type is set appropriately
- Ensure no parent elements are preventing click events
