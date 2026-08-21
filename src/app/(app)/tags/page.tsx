import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'
import { getUserNotes, getUserSolutions, type SolutionWithFavorite } from '@/db/queries'
import TagsContent from './TagsContent'

export default async function TagsPage() {
  const userId = await getSessionUser()
  if (!userId) {
    redirect('/login')
  }

  const notes = await getUserNotes(userId)
  const legacySolutions = await getUserSolutions(userId)

  // Map notes to shape expected by TagsContent
  const notesConverted: SolutionWithFavorite[] = notes.map((n) => ({
    id: n.id,
    userId: n.userId,
    title: n.title,
    description: n.summary,
    problemDescription: '',
    solutionSteps: '',
    status: 'resolved',
    difficulty: 'easy',
    tags: n.tags,
    codeSnippets: [],
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
    isFavorited: n.isFavorited,
  }))

  const combined = [...notesConverted, ...legacySolutions]

  return <TagsContent solutions={combined} />
}