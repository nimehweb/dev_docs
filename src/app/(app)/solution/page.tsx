import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'
import { getUserNotes, getUserSolutions, type NoteWithFavorite } from '@/db/queries'
import LibraryContent from './LibraryContent'

export default async function LibraryPage() {
  const userId = await getSessionUser()
  if (!userId) {
    redirect('/login')
  }

  // Fetch user notes from Postgres
  const notes = await getUserNotes(userId)
  const solutions = await getUserSolutions(userId)

  // Merge legacy solutions converted to note format if any exist
  const legacyNotesConverted: NoteWithFavorite[] = solutions.map((s) => ({
    id: s.id,
    userId: s.userId,
    title: s.title,
    summary: s.description,
    status: 'published' as const,
    tags: s.tags,
    blocks: [
      { id: 'b-1', type: 'paragraph' as const, content: s.description },
      ...(s.problemDescription
        ? [
            { id: 'b-2', type: 'heading' as const, level: 2 as const, text: 'Problem Description' },
            { id: 'b-3', type: 'paragraph' as const, content: s.problemDescription },
          ]
        : []),
      ...(s.solutionSteps
        ? [
            { id: 'b-4', type: 'heading' as const, level: 2 as const, text: 'Solution Steps' },
            { id: 'b-5', type: 'paragraph' as const, content: s.solutionSteps },
          ]
        : []),
    ],
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    isFavorited: s.isFavorited,
  }))

  const allNotesCombined = [...notes, ...legacyNotesConverted]

  return <LibraryContent initialNotes={allNotesCombined} />
}