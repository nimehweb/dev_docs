import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Calendar, Tag as TagIcon } from 'lucide-react'

import { getSessionUser } from '@/lib/auth'
import { getNoteById, getSolutionById } from '@/db/queries'
import BlockRenderer from '@/components/note/BlockRenderer'
import TableOfContents from '@/components/note/TableOfContents'
import NoteHeaderActions from '@/components/note/NoteHeaderActions'

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const userId = await getSessionUser()
  if (!userId) {
    redirect('/login')
  }

  const { id } = await params
  
  // Try note query first
  const note = await getNoteById(id, userId)

  if (!note) {
    // Fallback to legacy solution lookup if note is not found
    const solution = await getSolutionById(id, userId)
    if (!solution) {
      notFound()
    }

    // Convert legacy solution to Note shape for uniform reading view
    const convertedBlocks = [
      ...(solution.description ? [{ id: 'desc', type: 'paragraph' as const, content: solution.description }] : []),
      ...(solution.problemDescription
        ? [
            { id: 'h-prob', type: 'heading' as const, level: 2 as const, text: 'Problem Description' },
            { id: 'prob', type: 'paragraph' as const, content: solution.problemDescription },
          ]
        : []),
      ...(solution.solutionSteps
        ? [
            { id: 'h-sol', type: 'heading' as const, level: 2 as const, text: 'Solution Steps' },
            { id: 'sol', type: 'paragraph' as const, content: solution.solutionSteps },
          ]
        : []),
      ...solution.codeSnippets.map((cs, idx) => ({
        id: `cs-${idx}`,
        type: 'code' as const,
        title: cs.title,
        language: cs.language,
        code: cs.code,
      })),
    ]

    return (
      <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
          <Link
            href="/solution"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Library</span>
          </Link>

          <NoteHeaderActions noteId={solution.id} initialIsFavorited={solution.isFavorited} />
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider">
              Published
            </span>
            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(solution.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
            {solution.title}
          </h1>

          {solution.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {solution.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/solution?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors"
                >
                  <TagIcon className="w-3 h-3" />
                  <span>#{tag}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <BlockRenderer blocks={convertedBlocks} />
          </div>
          <div className="lg:col-span-1">
            <TableOfContents blocks={convertedBlocks} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Top navigation & action header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
        <Link
          href="/solution"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </Link>

        <NoteHeaderActions noteId={note.id} initialIsFavorited={note.isFavorited} />
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`px-2.5 py-1 rounded-md font-semibold border uppercase tracking-wider ${
              note.status === 'published'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}
          >
            {note.status}
          </span>
          <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(note.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
          {note.title}
        </h1>

        {note.summary && (
          <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed italic border-l-2 border-blue-500 pl-4 py-1">
            {note.summary}
          </p>
        )}

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {note.tags.map((tag) => (
              <Link
                key={tag}
                href={`/solution?tag=${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors"
              >
                <TagIcon className="w-3 h-3" />
                <span>#{tag}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <BlockRenderer blocks={note.blocks} />
        </div>
        <div className="lg:col-span-1">
          <TableOfContents blocks={note.blocks} />
        </div>
      </div>
    </div>
  )
}