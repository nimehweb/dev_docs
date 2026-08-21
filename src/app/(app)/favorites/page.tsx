import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Calendar, ExternalLink, Star, Tag } from 'lucide-react'
import { getSessionUser } from '@/lib/auth'
import { getUserFavoriteNotes, getUserFavoriteSolutions, type NoteWithFavorite } from '@/db/queries'

export default async function FavoritesPage() {
  const userId = await getSessionUser()
  if (!userId) {
    redirect('/login')
  }

  const favNotes = await getUserFavoriteNotes(userId)
  const favSolutions = await getUserFavoriteSolutions(userId)

  const legacyFavConverted: NoteWithFavorite[] = favSolutions.map((s) => ({
    id: s.id,
    userId: s.userId,
    title: s.title,
    summary: s.description,
    status: 'published' as const,
    tags: s.tags,
    blocks: [],
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    isFavorited: true,
  }))

  const allFavoritesCombined = [...favNotes, ...legacyFavConverted]

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Star className="w-7 h-7 fill-current text-zinc-900 dark:text-white" />
            Starred Notes
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Your collection of favorited developer notes for fast reference
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#121215] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Total Starred Notes
          </p>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
            {allFavoritesCombined.length}
          </p>
        </div>
        <Star className="w-8 h-8 fill-current text-zinc-900 dark:text-white" />
      </div>

      {allFavoritesCombined.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#121215] rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 space-y-3">
          <Star className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">No starred notes yet</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Click the star icon when viewing notes to save them here for quick access.
          </p>
          <Link
            href="/solution"
            className="inline-flex items-center px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold transition-colors"
          >
            Browse Library
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allFavoritesCombined.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-[#121215] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    {note.status}
                  </span>
                  <Star className="w-4 h-4 fill-current text-zinc-900 dark:text-white" />
                </div>

                <Link href={`/solution/${note.id}`} className="block hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-2">
                    {note.title}
                  </h3>
                </Link>

                {note.summary && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                    {note.summary}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex flex-wrap items-center gap-1.5">
                  {note.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      #{t}
                    </span>
                  ))}
                </div>

                <Link href={`/solution/${note.id}`} className="p-1 hover:text-zinc-900 dark:hover:text-white">
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}