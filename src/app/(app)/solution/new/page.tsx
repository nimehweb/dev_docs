import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import BlockEditor from '@/components/editor/BlockEditor'

export default function AddNewNotePage() {
  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/solution"
          className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          Write a Note
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Compose a modular technical note or article for your knowledge base
        </p>
      </div>

      <BlockEditor />
    </div>
  )
}