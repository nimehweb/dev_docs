'use client'

import type { CalloutBlock } from '@/types/note'
import { AlertCircle, AlertTriangle, Info, Lightbulb } from 'lucide-react'

type Props = {
  block: CalloutBlock
  onChange: (updated: CalloutBlock) => void
}

const VARIANTS = [
  { id: 'info', label: 'Info', icon: Info },
  { id: 'tip', label: 'Tip', icon: Lightbulb },
  { id: 'warning', label: 'Warning', icon: AlertTriangle },
  { id: 'note', label: 'Note', icon: AlertCircle },
] as const

export default function CalloutBlockItem({ block, onChange }: Props) {
  const currentVariant = VARIANTS.find((v) => v.id === block.variant) ?? VARIANTS[0]
  const Icon = currentVariant.icon

  return (
    <div className="p-4 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 shrink-0 text-zinc-700 dark:text-zinc-300" />
          <span className="text-xs font-bold uppercase tracking-wider">{currentVariant.label} Callout</span>
        </div>

        <div className="flex gap-1">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => onChange({ ...block, variant: v.id })}
              className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                block.variant === v.id
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        placeholder="Enter callout text or note..."
        rows={2}
        className="w-full bg-transparent focus:outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 resize-y"
      />
    </div>
  )
}
