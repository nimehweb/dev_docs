'use client'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import type { SolutionForm } from './types'

const availableTags = [
  'JavaScript',
  'React',
  'Python',
  'Django',
  'BugFix',
  'Java',
  'Spring',
  'C#',
  '.NET',
  'C++',
  'API',
  'Database',
  'Authentication',
  'Performance',
  'Deployment',
  'Security',
  'Testing',
  'Git',
  'Data Science',
  'Machine learning',
  'DevOps',
  'Cloud',
]

export default function AddTags() {
  const { watch, setValue } = useFormContext<SolutionForm>()
  const watchedTags = watch('tags') || []
  const [newTag, setNewTag] = useState('')

  function addTag(tag: string) {
    const t = tag.trim()
    if (!t || watchedTags.includes(t)) return
    setValue('tags', [...watchedTags, t], { shouldDirty: true })
    setNewTag('')
  }

  function handleAddTag(e?: React.FormEvent) {
    e?.preventDefault()
    addTag(newTag)
  }

  function handleRemoveTag(index: number) {
    const next = watchedTags.filter((_, i) => i !== index)
    setValue('tags', next, { shouldDirty: true })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault()
      addTag(newTag)
    }
  }

  return (
    <section className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg">
      <h2 className="font-semibold mb-3">Tags & Categories</h2>

      <div className="flex flex-wrap gap-2 my-6">
        {watchedTags.map((t, i) => (
          <div
            key={t + i}
            onClick={() => handleRemoveTag(i)}
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-600"
          >
            <span>{t}</span>
            <button type="button" className="text-sm">
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        <input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag and press Enter or comma"
          className="border border-gray-300 dark:border-gray-700 p-2 rounded-lg flex-1"
        />
        <button
          type="button"
          onClick={() => handleAddTag()}
          className="border border-gray-300 dark:border-gray-700 hover:bg-slate-100 dark:hover:bg-slate-500 px-3 py-1 rounded-lg"
        >
          Add Tag
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-8">
        {availableTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => addTag(tag)}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-300"
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  )
}