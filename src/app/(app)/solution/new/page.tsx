'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'
import BasicInfo from '../_components/BasicInfo'
import ProblemsAndSolutions from '../_components/ProblemsAndSolutions'
import CodeSnippets from '../_components/CodeSnippets'
import AddTags from '../_components/AddTags'
import type { SolutionForm } from '../_components/types'

const defaultValues: SolutionForm = {
  title: '',
  description: '',
  status: 'open',
  difficulty: 'easy',
  problemDescription: '',
  solutionSteps: '',
  codeSnippets: [],
  tags: [],
}

export default function AddNewSolutionPage() {
  const router = useRouter()
  const methods = useForm<SolutionForm>({ defaultValues })

  const onSubmit = () => {
    router.push('/solution')
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg inline-block">
        <Link href="/solution">
          <ArrowLeft className="inline-block mr-2" />
          <p className="inline font-semibold text-base lg:text-lg">Back to Solutions</p>
        </Link>
      </div>
      <div>
        <h1 className="text-xl lg:text-2xl font-bold mb-1">Add New Solution</h1>
        <p className="text-sm lg:text-base">Document a new problem and its solution</p>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <BasicInfo />
          <ProblemsAndSolutions />
          <CodeSnippets />
          <AddTags />
          <section className="mt-8">
            <div className="flex justify-between">
              <button
                onClick={() => router.push('/solution')}
                className="border border-gray-500 px-3 lg:px-4 py-2 text-sm lg:text-base rounded-lg hover:bg-slate-100 dark:hover:bg-slate-500 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="border border-gray-500 px-3 lg:px-4 py-2 text-sm lg:text-base rounded-lg hover:bg-slate-100 dark:hover:bg-slate-500 cursor-pointer"
              >
                <span className="hidden sm:inline">Publish Solution</span>
                <span className="sm:hidden">Publish</span>
              </button>
            </div>
          </section>
        </form>
      </FormProvider>
    </div>
  )
}