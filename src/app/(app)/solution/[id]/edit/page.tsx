'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import BasicInfo from '../../_components/BasicInfo'
import ProblemsAndSolutions from '../../_components/ProblemsAndSolutions'
import CodeSnippets from '../../_components/CodeSnippets'
import AddTags from '../../_components/AddTags'
import type { SolutionForm } from '../../_components/types'

const placeholder: SolutionForm = {
  title: 'Example: Fix React useEffect infinite loop',
  description: 'A documented problem and its solution.',
  status: 'open',
  difficulty: 'medium',
  problemDescription: '## Problem\nA `useEffect` runs infinitely because a dependency changes on every render.',
  solutionSteps: '## Solution\n1. Identify the unstable dependency.',
  codeSnippets: [
    {
      title: 'Before',
      language: 'javascript',
      code: 'useEffect(() => {\n  fetchData()\n}, [props])\n',
    },
  ],
  tags: ['React', 'BugFix', 'Hooks'],
}

export default function EditSolutionPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const methods = useForm<SolutionForm>({ defaultValues: placeholder })

  const onSubmit = () => {
    router.push(`/solution/${id}`)
  }

  return (
    <div className="p-6">
      <Link href={`/solution/${id}`} className="text-blue-600 hover:underline">
        ← Back to Solution
      </Link>
      <h1 className="text-2xl font-bold mb-1">Edit Solution</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <BasicInfo />
          <ProblemsAndSolutions />
          <CodeSnippets />
          <AddTags />
          <section className="mt-8 flex justify-between">
            <button
              onClick={() => router.push(`/solution/${id}`)}
              className="border dark:border-gray-300 border-gray-700 p-2 rounded-lg dark:hover:bg-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="border dark:border-gray-300 border-gray-700 p-2 rounded-lg dark:hover:bg-slate-500 hover:bg-slate-100"
            >
              Save Changes
            </button>
          </section>
        </form>
      </FormProvider>
    </div>
  )
}