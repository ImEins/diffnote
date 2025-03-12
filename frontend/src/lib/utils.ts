import { JSONContent } from '@tiptap/react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { getDateCategory } from './date'

/**
 * Merge class names
 * @param inputs - The class names to merge
 * @returns The merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extract text from content
 * @param content - The content to extract text from
 * @returns The extracted text
 */
export function extractTextFromContent(content: string | JSONContent): string {
  const parsedContent = typeof content === 'string' ? JSON.parse(content) : content

  if (!parsedContent?.content) return ''

  return parsedContent.content
    .filter((node: JSONContent) => node.type === 'paragraph' && node.content)
    .flatMap((node: JSONContent) => node.content)
    .filter(Boolean)
    .filter((textNode: JSONContent) => textNode?.text)
    .map((textNode: JSONContent) => textNode?.text)
    .join(' ')
}

/**
 * Group by date categories: Today, Yesterday, Last Week, Last Month, Older
 * Should be used for items that have a `created_at` field
 * @param items - The items to group
 * @returns The grouped items
 */
export function groupByDateCategory<T extends { created_at: string }>(items: T[]): Record<string, T[]> {
  const result: Record<string, T[]> = {}

  // Sort items by created_at in descending order (newest first)
  const sortedItems = [...items].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  sortedItems.forEach(item => {
    const itemDate = new Date(item.created_at)
    const category = getDateCategory(itemDate)

    if (!result[category]) {
      result[category] = []
    }

    result[category].push(item)
  })

  return result
}
