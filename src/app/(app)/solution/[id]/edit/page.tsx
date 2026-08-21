import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { getSessionUser } from '@/lib/auth'
import { getNoteById } from '@/db/queries'
import BlockEditor from '@/components/editor/BlockEditor'

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const userId = await getSessionUser()
  if (!userId) {
    redirect('/login')
  }

  const { id } = await params
  const note = await getNoteById(id, userId)

  if (!note) {
    notFound()
  }

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link
          href={`/solution/${id}`}
          className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Note Details</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          Edit Note
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Update the content blocks, tags, and summary for this note
        </p>
      </div>

      <BlockEditor initialNote={note} />
    </div>
  )
}