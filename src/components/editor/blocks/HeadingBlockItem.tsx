'use client'

import type { HeadingBlock } from '@/types/note'

type Props = {
  block: HeadingBlock
  onChange: (updated: HeadingBlock) => void
}

export default function HeadingBlockItem({ block, onChange }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex bg-gray-100 dark:bg-slate-700/60 rounded-md p-1 border border-gray-200 dark:border-gray-600">
          {([1, 2, 3] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => onChange({ ...block, level: lvl })}
              className={`px-2.5 py-1 text-xs font-semibold rounded ${
                block.level === lvl
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              H{lvl}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 font-medium">Heading {block.level}</span>
      </div>

      <input
        type="text"
        value={block.text}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
        placeholder={`Heading ${block.level} title...`}
        className={`w-full bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none py-1 font-bold text-gray-900 dark:text-white placeholder-gray-400 ${
          block.level === 1
            ? 'text-2xl'
            : block.level === 2
            ? 'text-xl'
            : 'text-lg'
        }`}
      />
    </div>
  )
}
