import { JSONContent } from '@tiptap/react'
import { diff, diffCleanupSemantic } from 'diff-match-patch-es'

export interface DiffResult {
  additions: string[]
  deletions: string[]
  fromId: number | string
  toId: number
}

/**
 * Extract text content from JSON content structure
 * @param content - The content to extract text from
 * @returns The extracted text as a string
 */
export function extractTextContent(content: JSONContent | string): string {
  if (!content) return ''

  if (typeof content === 'string') return content

  if (Array.isArray(content)) {
    return content.map(item => extractTextContent(item)).join(' ')
  }

  if (content.text) return content.text as string

  if (content.content) return extractTextContent(content.content)

  if (content.type && !content.text && !content.content) return ''

  return ''
}

/**
 * Compare two versions of content and return the differences
 * @param fromContent - The content of the previous version
 * @param toContent - The content of the current version
 * @param fromId - The ID of the previous version (or 'original')
 * @param toId - The ID of the current version
 * @returns The differences between the two versions
 */
export function compareContents(
  fromContent: JSONContent | string,
  toContent: JSONContent | string,
  fromId: number | string = 'original',
  toId: number
): DiffResult {
  // Extract text content from both versions
  const fromText = extractTextContent(fromContent)
  const toText = extractTextContent(toContent)

  const diffs = diff(fromText, toText)
  diffCleanupSemantic(diffs)

  const additions: string[] = []
  const deletions: string[] = []

  diffs.forEach(([op, text]) => {
    if (text.trim()) {
      if (op === 1) {
        additions.push(text)
      } else if (op === -1) {
        deletions.push(text)
      }
    }
  })

  return {
    additions,
    deletions,
    fromId,
    toId,
  }
}
