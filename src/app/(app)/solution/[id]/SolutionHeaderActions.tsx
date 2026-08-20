'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, Edit, Trash, Loader2 } from 'lucide-react'
import { toggleFavoriteAction, deleteSolutionAction } from '@/app/actions/solution'

export default function SolutionHeaderActions({
  solutionId,
  initialIsFavorited,
}: {
  solutionId: string
  initialIsFavorited: boolean
}) {
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [isDeleting, setIsDeleting] = useState(false)
  const [, startTransition] = useTransition()

  const handleToggleFavorite = () => {
    setIsFavorited((prev) => !prev)
    startTransition(async () => {
      const res = await toggleFavoriteAction(solutionId)
      if (res.error) {
        setIsFavorited((prev) => !prev)
      }
    })
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this solution?')) {
      return
    }

    setIsDeleting(true)
    const res = await deleteSolutionAction(solutionId)
    if (res.error) {
      alert(res.error)
      setIsDeleting(false)
    } else {
      router.push('/solution')
    }
  }

  return (
    <div className="flex items-center gap-2 lg:gap-4">
      <button
        type="button"
        onClick={handleToggleFavorite}
        className={`border px-2 lg:px-3 py-1 lg:py-2 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${
          isFavorited
            ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
            : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        <Heart className={`size-3 lg:size-4 ${isFavorited ? 'fill-current' : ''}`} />
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="border border-gray-300 dark:border-gray-700 px-2 lg:px-3 py-1 rounded-lg hover:bg-red-200 hover:text-red-500 hover:border-red-500 cursor-pointer text-sm lg:text-base flex items-center gap-1 disabled:opacity-50"
      >
        {isDeleting ? (
          <Loader2 className="size-3 lg:size-4 animate-spin" />
        ) : (
          <Trash className="inline-block size-3 lg:size-4" />
        )}
        <span className="hidden sm:inline">Delete</span>
      </button>

      <Link href={`/solution/${solutionId}/edit`}>
        <button
          type="button"
          className="border border-gray-300 dark:border-gray-700 px-2 lg:px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-500 cursor-pointer text-sm lg:text-base flex items-center gap-1"
        >
          <Edit className="inline-block size-3 lg:size-4" />
          <span className="hidden sm:inline">Edit</span>
        </button>
      </Link>
    </div>
  )
}
