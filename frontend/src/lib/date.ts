/**
 * Format a date string to display in the format "23 October 2023, 22:22"
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)

  // Format date like "23 October 2023, 22:22"
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

/**
 * Format a date string to display in a relative format (e.g., "Today", "Yesterday")
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()

  // Reset time part for date comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date >= today) {
    return 'Today'
  } else if (date >= yesterday) {
    return 'Yesterday'
  } else {
    // For older dates, return the formatted date
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }
}

/**
 * Get date categories based on current date
 */
export function getDateCategories() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const oneWeekAgo = new Date(today)
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const oneMonthAgo = new Date(today)
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  return {
    today,
    yesterday,
    oneWeekAgo,
    oneMonthAgo,
  }
}

/**
 * Determine which date category a date belongs to
 */
export function getDateCategory(date: Date): string {
  const { today, yesterday, oneWeekAgo, oneMonthAgo } = getDateCategories()

  if (date >= today) {
    return 'Today'
  } else if (date >= yesterday) {
    return 'Yesterday'
  } else if (date >= oneWeekAgo) {
    return 'Last Week'
  } else if (date >= oneMonthAgo) {
    return 'Last Month'
  } else {
    return 'Older'
  }
}
