'use client'

import type { HeadingBlock, NoteBlock } from '@/types/note'
import { List } from 'lucide-react'

type Props = {
  blocks: NoteBlock[]
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function TableOfContents({ blocks }: Props) {
  const headings = blocks.filter(
    (b): b is HeadingBlock => b.type === 'heading' && Boolean(b.text.trim())
  )

  if (headings.length === 0) return null

  return (
    <div className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700/80 space-y-3 sticky top-6">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        <List className="w-3.5 h-3.5" />
        <span>Table of Contents</span>
      </div>

      <nav className="space-y-1 text-xs">
        {headings.map((h) => {
          const slug = slugify(h.text)
          return (
            <a
              key={h.id}
              href={`#${slug}`}
              className={`block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-1 transition-colors ${
                h.level === 1 ? 'pl-0 font-semibold text-gray-900 dark:text-white' : h.level === 2 ? 'pl-3' : 'pl-6'
              }`}
            >
              {h.text}
            </a>
          )
        })}
      </nav>
    </div>
  )
}
