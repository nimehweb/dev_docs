import { create } from "zustand"
import { solutionsAPI } from '../lib/supabase'

const useSolutionsStore = create((set) => ({
  solutions: [],
  favorites: [],
  currentUserId: null,
  loading: false,
  error: null,

  // Initialize data from Supabase
  initializeData: async (userId) => {
    if (!userId) {
      set({ error: 'User ID is required for initialization' })
      return
    }

    set({ loading: true, error: null })
    try {
      const [solutions, favorites] = await Promise.all([
        solutionsAPI.getSolutions(userId),
        solutionsAPI.getFavorites(userId)
      ])
      set({ solutions, favorites, currentUserId: userId, loading: false })
    } catch (error) {
      console.error('Error initializing data:', error)
      set({ error: error.message, loading: false })
    }
  },

  // Add solution
  addSolution: async (solution) => {
    const { currentUserId } = get()
    if (!currentUserId) {
      throw new Error('User not authenticated')
    }

    set({ loading: true, error: null })
    try {
      const newSolution = await solutionsAPI.addSolution(solution, currentUserId)
      set((state) => ({
        solutions: [newSolution, ...state.solutions],
        loading: false
      }))
      return newSolution
    } catch (error) {
      console.error('Error adding solution:', error)
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Edit solution
  editSolution: async (id, updatedSolution) => {
    const { currentUserId } = get()
    if (!currentUserId) {
      throw new Error('User not authenticated')
    }

    set({ loading: true, error: null })
    try {
      const updated = await solutionsAPI.updateSolution(id, updatedSolution, currentUserId)
      set((state) => ({
        solutions: state.solutions.map((sol) =>
          sol.id === id ? updated : sol
        ),
        loading: false
      }))
      return updated
    } catch (error) {
      console.error('Error updating solution:', error)
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Delete solution
  deleteSolution: async (id) => {
    const { currentUserId } = get()
    if (!currentUserId) {
      throw new Error('User not authenticated')
    }

    set({ loading: true, error: null })
    try {
      await solutionsAPI.deleteSolution(id, currentUserId)
      set((state) => ({
        solutions: state.solutions.filter((s) => s.id !== id),
        favorites: state.favorites.filter((fId) => fId !== id),
        loading: false
      }))
    } catch (error) {
      console.error('Error deleting solution:', error)
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Toggle favorite
  toggleFavorite: async (id) => {
    const { favorites, currentUserId } = get()
    if (!currentUserId) {
      throw new Error('User not authenticated')
    }

    const isFavorited = favorites.includes(id)
    
    try {
      if (isFavorited) {
        await solutionsAPI.removeFromFavorites(id, currentUserId)
        set((state) => ({
          favorites: state.favorites.filter((fId) => fId !== id)
        }))
      } else {
        await solutionsAPI.addToFavorites(id, currentUserId)
        set((state) => ({
          favorites: [...state.favorites, id]
        }))
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      set({ error: error.message })
      throw error
    }
  },

  // Get favorite solutions
  getFavoriteSolutions: () => {
    const { solutions, favorites } = get()
    return solutions.filter(solution => favorites.includes(solution.id))
  },
}))

export default useSolutionsStore