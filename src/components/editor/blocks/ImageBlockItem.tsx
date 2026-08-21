'use client'

import type { ImageBlock } from '@/types/note'
import { Image as ImageIcon } from 'lucide-react'

type Props = {
  block: ImageBlock
  onChange: (updated: ImageBlock) => void
}

export default function ImageBlockItem({ block, onChange }: Props) {
  return (
    <div className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-lg border border-gray-200 dark:border-gray-700/80 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
        <ImageIcon className="w-4 h-4" />
        <span>Image Block</span>
      </div>

      <div className="space-y-2">
        <input
          type="url"
          value={block.url}
          onChange={(e) => onChange({ ...block, url: e.target.value })}
          placeholder="Paste image URL (https://...)"
          className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            type="text"
            value={block.alt ?? ''}
            onChange={(e) => onChange({ ...block, alt: e.target.value })}
            placeholder="Alt text (for accessibility)..."
            className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            value={block.caption ?? ''}
            onChange={(e) => onChange({ ...block, caption: e.target.value })}
            placeholder="Image caption (optional)..."
            className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {block.url && (
        <div className="mt-2 rounded border border-gray-200 dark:border-gray-700 overflow-hidden max-h-60 bg-slate-950 flex items-center justify-center p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.url}
            alt={block.alt || 'Preview'}
            className="max-h-56 object-contain rounded"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
      )}
    </div>
  )
}
