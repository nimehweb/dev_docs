'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit3, Loader2, Star, Trash2 } from 'lucide-react'
import { deleteNoteAction, toggleNoteFavoriteAction } from '@/app/actions/note'

type Props = {
  noteId: string
  initialIsFavorited: boolean
}

export default function NoteHeaderActions({ noteId, initialIsFavorited }: Props) {
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [isTogglingFav, setIsTogglingFav] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const handleToggleFavorite = async () => {
    setIsTogglingFav(true)
    const prev = isFavorited
    setIsFavorited(!prev)

    const res = await toggleNoteFavoriteAction(noteId)
    if (res?.error) {
      setIsFavorited(prev)
    } else if (res?.data) {
      setIsFavorited(res.data.isFavorited)
    }
    setIsTogglingFav(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const res = await deleteNoteAction(noteId)
    if (res?.error) {
      alert(res.error)
      setIsDeleting(false)
      setShowConfirmDelete(false)
    } else {
      router.push('/solution')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={isTogglingFav}
        onClick={handleToggleFavorite}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
          isFavorited
            ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
            : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700'
        }`}
      >
        <Star className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
        <span>{isFavorited ? 'Starred' : 'Star Note'}</span>
      </button>

      <Link
        href={`/solution/${noteId}/edit`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 rounded-lg transition-colors"
      >
        <Edit3 className="w-3.5 h-3.5" />
        <span>Edit Note</span>
      </Link>

      <button
        type="button"
        onClick={() => setShowConfirmDelete(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 border border-zinc-300 dark:border-zinc-700 rounded-lg transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Delete</span>
      </button>

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121215] p-6 rounded-xl shadow-xl max-w-sm w-full space-y-4 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">Delete Note?</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowConfirmDelete(false)}
                className="px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-3 h-3 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
