# Glassmorphic Components - Quick Reference Guide

## Import All Components

```tsx
import { 
  GlassCard, 
  StatCard, 
  CircularProgress, 
  Button, 
  ProfileCard 
} from './components';
```

---

## GlassCard - Base Container

### Simple Card
```tsx
<GlassCard>
  <h2 className="text-white font-bold">Title</h2>
  <p className="text-gray-300">Content goes here</p>
</GlassCard>
```

### Clickable Card
```tsx
<GlassCard onClick={() => handleClick()}>
  <p>Click me!</p>
</GlassCard>
```

### Custom Sized Card
```tsx
<GlassCard className="max-w-md h-48">
  <p>Custom size card</p>
</GlassCard>
```

---

## StatCard - Statistics Display

### Basic Stat
```tsx
<StatCard 
  title="Battery Level"
  value={85}
  unit="%"
  accentColor="orange"
/>
```

### Stat with Icon
```tsx
<StatCard
  title="Active Workouts"
  value={12}
  icon="🏋️"
  accentColor="green"
/>
```

### Stat Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard title="Battery" value={85} unit="%" accentColor="orange" />
  <StatCard title="Meditation" value={45} unit="min" accentColor="purple" />
  <StatCard title="Calories" value={320} unit="kcal" accentColor="green" />
  <StatCard title="Heart Rate" value={72} unit="bpm" accentColor="blue" />
</div>
```

---

## CircularProgress - Progress Indicators

### Basic Progress
```tsx
<CircularProgress 
  percentage={65}
  size="md"
  color="orange"
/>
```

### Progress with Label
```tsx
<CircularProgress
  percentage={65}
  size="md"
  color="orange"
  label="Fitness Goal"
/>
```

### Without Percentage Text
```tsx
<CircularProgress
  percentage={75}
  size="md"
  color="green"
  showPercentage={false}
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

### Different Sizes
```tsx
{/* Small */}
<CircularProgress percentage={50} size="sm" color="orange" />

{/* Medium (default) */}
<CircularProgress percentage={50} size="md" color="orange" />

{/* Large */}
<CircularProgress percentage={50} size="lg" color="orange" />
```

### Charging Indicator
```tsx
<GlassCard>
  <div className="flex flex-col items-center gap-4">
    <h3 className="text-white font-bold">Charging</h3>
    <CircularProgress percentage={5} size="lg" color="orange" />
    <p className="text-gray-400 text-sm">Est. 2h 30m remaining</p>
  </div>
</GlassCard>
```

---

## Button - Interactive Elements

### Primary Button (Default)
```tsx
<Button variant="primary" color="orange">
  Primary Button
</Button>
```

### Secondary Button
```tsx
<Button variant="secondary" color="blue">
  Secondary Button
</Button>
```

### Ghost Button
```tsx
<Button variant="ghost" color="green">
  Ghost Button
</Button>
```

### Button Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### All Colors
```tsx
<Button color="orange">Orange</Button>
<Button color="blue">Blue</Button>
<Button color="green">Green</Button>
<Button color="purple">Purple</Button>
```

### With Click Handler
```tsx
<Button 
  onClick={() => console.log('Clicked')}
  variant="primary"
  color="orange"
>
  Click Me
</Button>
```

### Disabled Button
```tsx
<Button disabled>
  Disabled
</Button>
```

### Full Width Button
```tsx
<Button className="w-full">
  Full Width Button
</Button>
```

### Button Group
```tsx
<div className="flex gap-3">
  <Button variant="primary" color="orange">Start</Button>
  <Button variant="secondary" color="blue">Cancel</Button>
  <Button variant="ghost" color="gray">Learn More</Button>
</div>
```

### Form Submit Button
```tsx
<Button type="submit" variant="primary" color="orange">
  Submit
</Button>
```

---

## ProfileCard - User Profile

### Basic Profile
```tsx
<ProfileCard
  name="John Doe"
  greeting="Good morning"
/>
```

### Profile with Status
```tsx
<ProfileCard
  name="Sarah Mitchell"
  greeting="Welcome back"
  status="Active - Workout in progress"
  statusColor="online"
/>
```

### Profile with Custom Initials
```tsx
<ProfileCard
  name="User Name"
  avatarInitials="UN"
  greeting="Hello"
/>
```

### Profile with Avatar Image
```tsx
<ProfileCard
  name="Alex Johnson"
  avatarUrl="https://example.com/avatar.jpg"
  greeting="Good morning"
  status="Online"
  statusColor="online"
/>
```

### Status Variations
```tsx
{/* Online Status */}
<ProfileCard
  name="User One"
  status="Online"
  statusColor="online"
/>

{/* Away Status */}
<ProfileCard
  name="User Two"
  status="Away"
  statusColor="away"
/>

{/* Offline Status */}
<ProfileCard
  name="User Three"
  status="Offline"
  statusColor="offline"
/>
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

export function Dashboard() {
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

        {/* Progress Grid */}
        <section>
          <h2 className="text-white text-2xl font-bold mb-4">Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 place-items-center">
            <CircularProgress percentage={65} size="md" color="orange" label="Fitness" />
            <CircularProgress percentage={80} size="md" color="blue" label="Water" />
            <CircularProgress percentage={45} size="md" color="green" label="Sleep" />
            <CircularProgress percentage={95} size="md" color="purple" label="Meditation" />
          </div>
        </section>

        {/* Actions */}
        <section>
          <h2 className="text-white text-2xl font-bold mb-4">Quick Actions</h2>
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

## Styling Tips

### Add Custom Classes
All components accept `className` prop to extend styling:

```tsx
<GlassCard className="max-w-lg">
  Content
</GlassCard>

<Button className="shadow-lg">
  Button
</Button>
```

### Common Tailwind Classes

**Sizing:**
```
max-w-md, max-w-lg, max-w-2xl
w-full, h-full
```

**Spacing:**
```
p-4, p-6, p-8  (padding)
gap-4, gap-8   (gaps)
space-y-4      (vertical spacing)
```

**Responsive:**
```
grid-cols-1 md:grid-cols-2 lg:grid-cols-4
w-full md:w-1/2 lg:w-1/3
```

### Dark Background Variations

```tsx
{/* Minimal blur */}
<div className="bg-gray-950">

{/* Dark gradient */}
<div className="bg-gradient-to-br from-gray-900 via-black to-gray-900">

{/* Very dark */}
<div className="bg-black">
```

---

## Color Reference

### Accent Colors Available

```
orange  - #fb923c (Primary, warm)
blue    - #60a5fa (Secondary, cool)
green   - #4ade80 (Success, positive)
purple  - #c084fc (Premium, special)
```

All components accept these colors:
- `StatCard` - accentColor prop
- `CircularProgress` - color prop
- `Button` - color prop
- `ProfileCard` - statusColor prop

---

## Responsive Patterns

### Grid Layouts
```tsx
{/* Stats Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard ... />
  <StatCard ... />
</div>

{/* Progress Grid */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-8 place-items-center">
  <CircularProgress ... />
  <CircularProgress ... />
</div>

{/* Button Row */}
<div className="flex flex-wrap gap-3">
  <Button ... />
  <Button ... />
</div>
```

---

## Accessibility Features

All components include:
- Keyboard navigation support
- Focus states
- Disabled states
- Semantic HTML
- ARIA labels where needed

Example accessible button:
```tsx
<Button 
  type="submit"
  aria-label="Submit form"
>
  Submit
</Button>
```

---

## Performance Notes

1. Components use Tailwind CSS (highly optimizable)
2. No external animation libraries
3. SVG for CircularProgress (sharp, performant)
4. Minimal re-renders with proper prop usage
5. Pure CSS transitions (GPU accelerated)

---

## Browser Compatibility

All components work on:
- Chrome/Edge 76+
- Firefox 103+
- Safari 9+

Modern CSS features used:
- Backdrop filter (for glassmorphism)
- CSS Grid
- CSS Flexbox
- CSS Transitions

---

## Quick Customization

### Change Color Scheme
```tsx
// Change accent colors globally
<StatCard accentColor="blue" />  // Instead of orange
<Button color="purple" />         // Instead of orange
```

### Adjust Blur
In component className:
```tsx
backdrop-blur-sm   // Subtle blur
backdrop-blur-md   // Default (12px)
backdrop-blur-lg   // Strong blur
backdrop-blur-xl   // Maximum blur
```

### Modify Spacing
Using Tailwind:
```tsx
<div className="space-y-8">    {/* More vertical space */}
<div className="gap-6">       {/* Different gap size */}
<div className="p-8">         {/* More padding */}
```

---

## File Locations

All components in `/src/components/`:
- `GlassCard.tsx`
- `StatCard.tsx`
- `CircularProgress.tsx`
- `Button.tsx`
- `ProfileCard.tsx`

Import with:
```tsx
import { GlassCard, StatCard, CircularProgress, Button, ProfileCard } from './components';
```

---

**Quick copy-paste examples above! More detailed guide in COMPONENTS_GUIDE.md**
