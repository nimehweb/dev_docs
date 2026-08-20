import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'
import { getUserSolutions } from '@/db/queries'
import TagsContent from './TagsContent'

export default async function TagsPage() {
  const userId = await getSessionUser()
  if (!userId) {
    redirect('/login')
  }

  const solutions = await getUserSolutions(userId)

  return <TagsContent solutions={solutions} />
}