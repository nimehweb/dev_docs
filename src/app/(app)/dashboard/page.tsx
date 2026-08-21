import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  Plus,
  Star,
  Tag,
} from 'lucide-react'
import { getSessionUser } from '@/lib/auth'
import { getUserFavoriteNotes, getUserNotes, getUserSolutions } from '@/db/queries'

export default async function DashboardPage() {
  const userId = await getSessionUser()
  if (!userId) {
    redirect('/login')
  }

  const notes = await getUserNotes(userId)
  const legacySolutions = await getUserSolutions(userId)
  const favoriteNotes = await getUserFavoriteNotes(userId)

  const totalNotes = notes.length + legacySolutions.length
  const publishedNotes = notes.filter((n) => n.status === 'published').length + legacySolutions.length
  const draftNotes = notes.filter((n) => n.status === 'draft').length
  const starredCount = favoriteNotes.length + legacySolutions.filter((s) => s.isFavorited).length

  const recentItems = [
    ...notes.map((n) => ({ id: n.id, title: n.title, status: n.status, createdAt: n.createdAt, tags: n.tags })),
    ...legacySolutions.map((s) => ({ id: s.id, title: s.title, status: 'published' as const, createdAt: s.createdAt, tags: s.tags })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const tagCounts = [...notes, ...legacySolutions].reduce<Record<string, number>>((acc, item) => {
    item.tags.forEach((t) => {
      acc[t] = (acc[t] || 0) + 1
    })
    return acc
  }, {})

  const popularTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)

  const quickActions = [
    {
      title: 'Write a Note',
      description: 'Compose a new developer note',
      icon: <Plus className="h-5 w-5" />,
      link: '/solution/new',
    },
    {
      title: 'Browse Library',
      description: 'View all developer notes',
      icon: <FileText className="h-5 w-5" />,
      link: '/solution',
    },
    {
      title: 'Manage Topics',
      description: 'Filter notes by tag',
      icon: <Tag className="h-5 w-5" />,
      link: '/tags',
    },
    {
      title: 'Starred Notes',
      description: 'Quick access to favorites',
      icon: <Star className="h-5 w-5" />,
      link: '/favorites',
    },
  ]

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-zinc-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Overview of your personal developer library & knowledge base
        </p>
      </div>

      {/* Metric Cards - Strict Monochrome */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#121215] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Notes
            </p>
            <p className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {totalNotes}
            </p>
          </div>
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#121215] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Published
            </p>
            <p className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {publishedNotes}
            </p>
          </div>
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#121215] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Drafts
            </p>
            <p className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {draftNotes}
            </p>
          </div>
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#121215] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Starred
            </p>
            <p className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {starredCount}
            </p>
          </div>
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100">
            <Star className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Quick Actions - Strict Monochrome */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((act) => (
            <Link
              key={act.title}
              href={act.link}
              className="bg-white dark:bg-[#121215] hover:bg-zinc-50 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{act.title}</span>
                <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                  {act.icon}
                </div>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{act.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Notes & Popular Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#121215] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-500" />
              Recent Notes
            </h2>
            <Link href="/solution" className="text-xs font-bold text-zinc-900 dark:text-white hover:underline">
              View Library
            </Link>
          </div>

          {recentItems.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-6">No notes composed yet.</p>
          ) : (
            <div className="space-y-3">
              {recentItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="space-y-1">
                    <Link
                      href={`/solution/${item.id}`}
                      className="text-sm font-semibold text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span className="capitalize text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium">
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/solution/${item.id}`}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-[#121215] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-5 space-y-4">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-zinc-500" />
              Popular Topics
            </h2>
          </div>

          {popularTags.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-6">No topics added yet.</p>
          ) : (
            <div className="space-y-2.5">
              {popularTags.map(([tag, count]) => (
                <div key={tag} className="flex items-center justify-between text-xs">
                  <Link
                    href={`/solution?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <Tag className="w-3 h-3 text-zinc-500" />
                    #{tag}
                  </Link>
                  <span className="font-semibold text-zinc-500 dark:text-zinc-400">
                    {count} note{count !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}