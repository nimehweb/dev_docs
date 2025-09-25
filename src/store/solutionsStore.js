import { create } from "zustand"
import { solutionsAPI } from '../lib/supabase'

const useSolutionsStore = create((set, get) => ({
  solutions: [],
  favorites: [],
  loading: false,
  error: null,

  // Initialize data from Supabase
  initializeData: async () => {
    set({ loading: true, error: null })
    try {
      const [solutions, favorites] = await Promise.all([
        solutionsAPI.getSolutions(),
        solutionsAPI.getFavorites()
      ])
      set({ solutions, favorites, loading: false })
    } catch (error) {
      console.error('Error initializing data:', error)
      set({ error: error.message, loading: false })
    }
  },

  // Add solution
  addSolution: async (solution) => {
    set({ loading: true, error: null })
    try {
      const newSolution = await solutionsAPI.addSolution(solution)
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
    set({ loading: true, error: null })
    try {
      const updated = await solutionsAPI.updateSolution(id, updatedSolution)
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
    set({ loading: true, error: null })
    try {
      await solutionsAPI.deleteSolution(id)
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
    const { favorites } = get()
    const isFavorited = favorites.includes(id)
    
    try {
      if (isFavorited) {
        await solutionsAPI.removeFromFavorites(id)
        set((state) => ({
          favorites: state.favorites.filter((fId) => fId !== id)
        }))
      } else {
        await solutionsAPI.addToFavorites(id)
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