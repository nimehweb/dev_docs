import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'
import { getUserSolutions } from '@/db/queries'
import SolutionsListContent from './SolutionsListContent'

export default async function SolutionsPage() {
  const userId = await getSessionUser()
  if (!userId) {
    redirect('/login')
  }

  const solutions = await getUserSolutions(userId)

  return (
    <Suspense fallback={null}>
      <SolutionsListContent initialSolutions={solutions} />
    </Suspense>
  )
}