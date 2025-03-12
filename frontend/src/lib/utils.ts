import { JSONContent } from "@tiptap/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
  const parsedContent = typeof content === 'string'
    ? JSON.parse(content)
    : content;

  if (!parsedContent?.content) return '';

  return parsedContent.content
    .filter((node: JSONContent) => node.type === 'paragraph' && node.content)
    .flatMap((node: JSONContent) => node.content)
    .filter(Boolean)
    .filter((textNode: JSONContent) => textNode?.text)
    .map((textNode: JSONContent) => textNode?.text)
    .join(' ')
}
