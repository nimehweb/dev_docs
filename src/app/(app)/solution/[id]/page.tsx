import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, Heart, Edit, Trash } from 'lucide-react'
import MarkdownRenderer from '../_components/MarkdownRenderer'
import CodeSnippet from '../_components/CodeSnippet'

type CodeSnippetRecord = {
  id: string
  title: string
  language: string
  code: string
}

const placeholderSolution = {
  id: 'placeholder',
  title: 'Example: Fix React useEffect infinite loop',
  description: 'A documented problem and its solution.',
  status: 'open',
  difficulty: 'medium',
  tags: ['React', 'BugFix', 'Hooks'],
  created_at: new Date().toISOString(),
  problem_description: '## Problem\nA `useEffect` runs infinitely because a dependency changes on every render.',
  solution_steps: '## Solution\n1. Identify the unstable dependency.\n2. Memoize it or move it out of the effect.',
  code_snippets: [
    {
      id: '1',
      title: 'Before',
      language: 'javascript',
      code: 'useEffect(() => {\n  fetchData()\n}, [props])\n',
    },
  ] as CodeSnippetRecord[],
}

export default async function SolutionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const solution = placeholderSolution

  return (
    <div className="p-4 lg:p-6">
      <div className="flex justify-between items-center mb-6">
        <Link href="/solution" className="flex items-center text-blue-600 hover:underline cursor-pointer">
          <ArrowLeft className="mr-2" /> Back to Solutions
        </Link>
        <div className="flex items-center gap-2 lg:gap-4">
          <button
            type="button"
            className="border border-gray-700 px-2 lg:px-3 py-1 lg:py-2 flex items-center justify-center rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Heart className="inline-block size-3 lg:size-4" />
          </button>
          <button
            type="button"
            className="border border-gray-300 dark:border-gray-700 px-2 lg:px-3 py-1 rounded-lg hover:bg-red-200 hover:text-red-500 hover:border-red-500 cursor-pointer text-sm lg:text-base"
          >
            <Trash className="inline-block mr-1 lg:mr-2 size-3 lg:size-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
          <Link href={`/solution/${id}/edit`}>
            <button
              className="border border-gray-300 dark:border-gray-700 px-2 lg:px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-500 cursor-pointer text-sm lg:text-base"
              type="button"
            >
              <Edit className="inline-block mr-1 lg:mr-2 size-3 lg:size-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          </Link>
        </div>
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
        <Calendar className="size-3 lg:size-4" /> <p>Created: {new Date(solution.created_at).toLocaleDateString()}</p>
      </div>

      <section>
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

      <section className="mb-6 mt-4">
        <h2 className="text-base lg:text-lg font-semibold mb-2">Problem Description</h2>
        <MarkdownRenderer content={solution.problem_description} />
      </section>

      <section className="mb-6">
        <h2 className="text-base lg:text-lg font-semibold mb-2">Solution Steps</h2>
        <MarkdownRenderer content={solution.solution_steps} />
      </section>

      <section className="mb-6">
        <h2 className="text-base lg:text-lg font-semibold mb-2">Code Snippets</h2>
        {solution.code_snippets.length === 0 ? (
          <p className="text-sm lg:text-base text-gray-500">No code snippets added.</p>
        ) : (
          solution.code_snippets.map((snippet) => (
            <CodeSnippet
              key={snippet.id}
              title={snippet.title}
              language={snippet.language}
              code={snippet.code}
            />
          ))
        )}
      </section>
    </div>
  )
}