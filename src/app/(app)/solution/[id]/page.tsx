import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import { getSessionUser } from '@/lib/auth'
import { getSolutionById } from '@/db/queries'
import MarkdownRenderer from '../_components/MarkdownRenderer'
import CodeSnippet from '../_components/CodeSnippet'
import SolutionHeaderActions from './SolutionHeaderActions'

export default async function SolutionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const userId = await getSessionUser()
  if (!userId) {
    redirect('/login')
  }

  const { id } = await params
  const solution = await getSolutionById(id, userId)

  if (!solution) {
    notFound()
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="flex justify-between items-center mb-6">
        <Link href="/solution" className="flex items-center text-blue-600 hover:underline cursor-pointer">
          <ArrowLeft className="mr-2" /> Back to Solutions
        </Link>
        <SolutionHeaderActions
          solutionId={solution.id}
          initialIsFavorited={solution.isFavorited}
        />
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-xl lg:text-2xl font-bold mb-2 pr-4">{solution.title}</h1>
        <div className="flex gap-2 lg:gap-4 mb-4 flex-shrink-0">
          <span
            className={`py-1 px-2 lg:px-3 rounded-lg text-xs lg:text-sm ${
              solution.status === 'resolved'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
            }`}
          >
            {solution.status}
          </span>
          <span className="px-2 lg:px-3 py-1 bg-slate-200 dark:bg-slate-500 rounded-lg text-xs lg:text-sm">
            {solution.difficulty}
          </span>
        </div>
      </div>

      <p className="text-gray-900 dark:text-white mb-4 text-base lg:text-lg">{solution.description}</p>

      <div className="text-xs lg:text-sm text-gray-500 flex gap-2 items-center mb-2">
        <Calendar className="size-3 lg:size-4" /> <p>Created: {new Date(solution.createdAt).toLocaleDateString()}</p>
      </div>

      <section className="mb-4">
        {solution.tags.map((tag) => (
          <Link
            key={tag}
            href={`/solution?tag=${encodeURIComponent(tag)}`}
            className="inline-block text-xs lg:text-sm px-2 lg:px-3 py-1 rounded-full mr-2 mb-2 border border-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors"
          >
            <Tag className="inline-block size-2 lg:size-3 mr-1" />
            {tag}
          </Link>
        ))}
      </section>

      {solution.problemDescription && (
        <section className="mb-6 mt-4">
          <h2 className="text-base lg:text-lg font-semibold mb-2">Problem Description</h2>
          <MarkdownRenderer content={solution.problemDescription} />
        </section>
      )}

      {solution.solutionSteps && (
        <section className="mb-6">
          <h2 className="text-base lg:text-lg font-semibold mb-2">Solution Steps</h2>
          <MarkdownRenderer content={solution.solutionSteps} />
        </section>
      )}

      <section className="mb-6">
        <h2 className="text-base lg:text-lg font-semibold mb-2">Code Snippets</h2>
        {solution.codeSnippets.length === 0 ? (
          <p className="text-sm lg:text-base text-gray-500">No code snippets added.</p>
        ) : (
          solution.codeSnippets.map((snippet, idx) => (
            <CodeSnippet
              key={idx}
              title={snippet.title || `Snippet #${idx + 1}`}
              language={snippet.language}
              code={snippet.code}
            />
          ))
        )}
      </section>
    </div>
  )
}