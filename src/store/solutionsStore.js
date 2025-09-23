import {create} from "zustand"

const useSolutionsStore = create((set) => ({
    solutions: [],
    favorites: [],
    addSolution: (solution) => set((state) => ({
        solutions: [...state.solutions, solution]
    })),
    getSolutions: () => set((state) => state.solutions),
    editSolution: (id, updatedSolution) =>
    set((state) => ({
    solutions: state.solutions.map((sol) =>
      sol.id === id ? { ...sol, ...updatedSolution } : sol
    ),
  })),
   deleteSolution: (id) =>
    set((state) => ({
      solutions: state.solutions.filter((s) => s.id !== id),
      favorites: state.favorites.filter((fId) => fId !== id), // Also remove from favorites
    })),
   toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((fId) => fId !== id)
        : [...state.favorites, id],
    })),
   getFavoriteSolutions: () => {
      const { solutions, favorites } = get()
      return solutions.filter(solution => favorites.includes(solution.id))
    },

}))

export default useSolutionsStore