/**
 * Format duration in minutes to readable time string
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 1) return 'Less than a minute'
  if (minutes < 60) return `${Math.round(minutes)} min`

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) return `${hours}h`
  return `${hours}h ${remainingMinutes}m`
}

/**
 * Format date to readable format
 */
export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format date and time
 */
export const formatDateTime = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format calories burned
 */
export const formatCalories = (calories: number): string => {
  if (calories >= 1000) return `${(calories / 1000).toFixed(1)}k cal`
  return `${Math.round(calories)} cal`
}

/**
 * Format weight with unit
 */
export const formatWeight = (weight: number, unit: 'kg' | 'lbs' = 'kg'): string => {
  return `${weight.toFixed(1)} ${unit}`
}

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
  return `${value.toFixed(decimals)}%`
}

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert camelCase or snake_case to Title Case
 */
export const toTitleCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, (char) => char.toUpperCase())
    .trim()
}

/**
 * Format large numbers with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US')
}
