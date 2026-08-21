'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Calendar, Plus, Search, Star, Tag as TagIcon } from 'lucide-react'

import type { NoteWithFavorite } from '@/db/queries'
import { toggleNoteFavoriteAction } from '@/app/actions/note'

type Props = {
  initialNotes: NoteWithFavorite[]
}

export default function LibraryContent({ initialNotes }: Props) {
  const [notes, setNotes] = useState<NoteWithFavorite[]>(initialNotes)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [selectedTag, setSelectedTag] = useState<string>('')

  const allTags = useMemo(() => {
    const set = new Set<string>()
    notes.forEach((n) => n.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [notes])

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      if (statusFilter !== 'all' && note.status !== statusFilter) {
        return false
      }

      if (selectedTag && !note.tags.includes(selectedTag)) {
        return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const titleMatch = note.title.toLowerCase().includes(q)
        const summaryMatch = note.summary.toLowerCase().includes(q)
        const tagMatch = note.tags.some((t) => t.toLowerCase().includes(q))
        const blockMatch = note.blocks.some((b) => {
          if (b.type === 'heading') return b.text.toLowerCase().includes(q)
          if (b.type === 'paragraph') return b.content.toLowerCase().includes(q)
          if (b.type === 'code') return b.code.toLowerCase().includes(q) || (b.title ?? '').toLowerCase().includes(q)
          if (b.type === 'callout') return b.content.toLowerCase().includes(q)
          return false
        })

        if (!titleMatch && !summaryMatch && !tagMatch && !blockMatch) {
          return false
        }
      }

      return true
    })
  }, [notes, searchQuery, statusFilter, selectedTag])

  const handleToggleFavorite = async (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isFavorited: !n.isFavorited } : n))
    )
    const res = await toggleNoteFavoriteAction(noteId)
    if (res?.error) {
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, isFavorited: !n.isFavorited } : n))
      )
    }
  }

  const publishedCount = notes.filter((n) => n.status === 'published').length
  const draftCount = notes.filter((n) => n.status === 'draft').length

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-zinc-900 dark:text-white">
            Library
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Search, filter, and manage your developer notes & articles
          </p>
        </div>

        <Link
          href="/solution/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-bold text-xs lg:text-sm rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Note</span>
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white dark:bg-[#121215] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, summary, tags, or code content..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-zinc-50 dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-zinc-50 dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:outline-none"
            >
              <option value="">All Tags / Topics</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Tabs - Strict Monochrome */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              statusFilter === 'all'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            All Notes ({notes.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              statusFilter === 'published'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              statusFilter === 'draft'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            Drafts ({draftCount})
          </button>
        </div>
      </div>

      {/* Note Cards List Grid - Monochrome */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#121215] rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 space-y-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">No notes found matching your filter.</p>
          <Link
            href="/solution/new"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-white underline"
          >
            <Plus className="w-3.5 h-3.5" />
            Write your first note
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="group bg-white dark:bg-[#121215] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    {note.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(note.id)}
                    className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                    title={note.isFavorited ? 'Unstar Note' : 'Star Note'}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        note.isFavorited
                          ? 'fill-zinc-900 text-zinc-900 dark:fill-white dark:text-white'
                          : 'text-zinc-400'
                      }`}
                    />
                  </button>
                </div>

                <Link href={`/solution/${note.id}`} className="block group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                  <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white line-clamp-2">
                    {note.title}
                  </h3>
                </Link>

                {note.summary && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                    {note.summary}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex flex-wrap items-center gap-1.5">
                  {note.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700"
                    >
                      <TagIcon className="w-2.5 h-2.5" />
                      #{tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="text-[10px] text-zinc-400">+{note.tags.length - 3}</span>
                  )}
                </div>

                <span className="flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3 h-3" />
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
