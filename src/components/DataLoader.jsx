import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import useSolutionsStore from '../store/solutionsStore'

function DataLoader({ children }) {
  const { user, loading } = useAuth()
  const initializeData = useSolutionsStore((state) => state.initializeData)

  useEffect(() => {
    if (!loading && user) {
      // Initialize data when user is authenticated
      initializeData()
    }
  }, [user, loading, initializeData])

  return children
}

export default DataLoader