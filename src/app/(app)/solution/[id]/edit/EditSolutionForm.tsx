'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { ArrowLeft, Loader2 } from 'lucide-react'
import BasicInfo from '../../_components/BasicInfo'
import ProblemsAndSolutions from '../../_components/ProblemsAndSolutions'
import CodeSnippets from '../../_components/CodeSnippets'
import AddTags from '../../_components/AddTags'
import type { SolutionForm } from '../../_components/types'
import { updateSolutionAction } from '@/app/actions/solution'
import type { SolutionWithFavorite } from '@/db/queries'

export default function EditSolutionForm({
  solution,
}: {
  solution: SolutionWithFavorite
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const defaultValues: SolutionForm = {
    title: solution.title,
    description: solution.description,
    status: solution.status,
    difficulty: solution.difficulty,
    problemDescription: solution.problemDescription,
    solutionSteps: solution.solutionSteps,
    codeSnippets: solution.codeSnippets,
    tags: solution.tags,
  }

  const methods = useForm<SolutionForm>({ defaultValues })

  const onSubmit = async (data: SolutionForm) => {
    setIsSubmitting(true)
    setError(null)

    const result = await updateSolutionAction(solution.id, data)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      router.push(`/solution/${solution.id}`)
    }
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg inline-block">
        <Link href={`/solution/${solution.id}`}>
          <ArrowLeft className="inline-block mr-2" />
          <p className="inline font-semibold text-base lg:text-lg">
            Back to Solution
          </p>
        </Link>
      </div>
      <div>
        <h1 className="text-xl lg:text-2xl font-bold mb-1">Edit Solution</h1>
        <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
          Update solution details, code snippets, or tags
        </p>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/40 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <BasicInfo />
          <ProblemsAndSolutions />
          <CodeSnippets />
          <AddTags />
          <section className="mt-8">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => router.push(`/solution/${solution.id}`)}
                disabled={isSubmitting}
                className="border border-gray-500 px-3 lg:px-4 py-2 text-sm lg:text-base rounded-lg hover:bg-slate-100 dark:hover:bg-slate-500 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="border border-gray-500 px-3 lg:px-4 py-2 text-sm lg:text-base rounded-lg hover:bg-slate-100 dark:hover:bg-slate-500 cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </section>
        </form>
      </FormProvider>
    </div>
  )
}
