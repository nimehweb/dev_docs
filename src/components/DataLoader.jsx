import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import useSolutionsStore from '../store/solutionsStore'

function DataLoader({ children }) {
  const [user, loading] = useAuthState(auth)
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