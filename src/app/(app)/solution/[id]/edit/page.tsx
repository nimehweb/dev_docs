import { notFound, redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'
import { getSolutionById } from '@/db/queries'
import EditSolutionForm from './EditSolutionForm'

export default async function EditSolutionPage({
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

  return <EditSolutionForm solution={solution} />
}