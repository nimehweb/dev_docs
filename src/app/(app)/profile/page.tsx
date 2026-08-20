import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'
import { getUserSolutions, getUserFavoriteSolutions, getUserProfile } from '@/db/queries'
import ProfileContent from './ProfileContent'

export default async function ProfilePage() {
  const userId = await getSessionUser()
  if (!userId) {
    redirect('/login')
  }

  const [userProfile, solutions, favoriteSolutions] = await Promise.all([
    getUserProfile(userId),
    getUserSolutions(userId),
    getUserFavoriteSolutions(userId),
  ])

  return (
    <ProfileContent
      userName={userProfile?.name ?? 'Developer'}
      userEmail={userProfile?.email ?? ''}
      solutions={solutions}
      favoriteCount={favoriteSolutions.length}
    />
  )
}