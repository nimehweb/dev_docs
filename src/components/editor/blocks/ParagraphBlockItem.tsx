'use client'

import type { ParagraphBlock } from '@/types/note'

type Props = {
  block: ParagraphBlock
  onChange: (updated: ParagraphBlock) => void
}

export default function ParagraphBlockItem({ block, onChange }: Props) {
  return (
    <div>
      <textarea
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        placeholder="Write markdown prose or explanation here..."
        rows={3}
        className="w-full bg-transparent border border-gray-200 dark:border-gray-700/80 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none rounded-lg p-3 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 resize-y leading-relaxed"
      />
    </div>
  )
}
