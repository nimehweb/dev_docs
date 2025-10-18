import { useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import useSolutionsStore from '../store/solutionsStore'

function DataLoader({ children }) {
  const { user, loading } = useAuth()
  const initializeData = useSolutionsStore((state) => state.initializeData)
  const lastInitializedUserId = useRef(null)

  useEffect(() => {
    // If user logs out, reset the ref
    if (!user) {
      lastInitializedUserId.current = null
      return
    }

    // Initialize data only if not loading, user is present, AND user ID has changed
    if (!loading && user && user.id !== lastInitializedUserId.current) {
      initializeData()
      lastInitializedUserId.current = user.id
    }
  }, [user, loading, initializeData])

  return children
}

export default DataLoader