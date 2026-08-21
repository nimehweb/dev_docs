'use client'

import type { CodeBlock } from '@/types/note'

type Props = {
  block: CodeBlock
  onChange: (updated: CodeBlock) => void
}

const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'html',
  'css',
  'bash',
  'json',
  'sql',
  'go',
  'rust',
  'markdown',
]

export default function CodeBlockItem({ block, onChange }: Props) {
  return (
    <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <input
          type="text"
          value={block.title ?? ''}
          onChange={(e) => onChange({ ...block, title: e.target.value })}
          placeholder="Snippet title (e.g. index.ts)..."
          className="bg-transparent text-xs text-slate-300 placeholder-slate-500 focus:outline-none py-1 border-b border-slate-700 focus:border-blue-400 max-w-xs"
        />

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Language:</label>
          <select
            value={block.language}
            onChange={(e) => onChange({ ...block, language: e.target.value })}
            className="bg-slate-800 text-xs text-slate-200 rounded px-2 py-1 border border-slate-700 focus:outline-none focus:border-blue-500"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      <textarea
        value={block.code}
        onChange={(e) => onChange({ ...block, code: e.target.value })}
        placeholder="// Write your code snippet here..."
        rows={5}
        className="w-full bg-slate-950 text-slate-100 font-mono text-xs p-3 rounded border border-slate-800/80 focus:outline-none focus:border-blue-500/80 placeholder-slate-600 resize-y leading-relaxed"
      />
    </div>
  )
}
