import {create} from "zustand"

const useSolutionsStore = create((set) => ({
    solutions: [],
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
    })),

}))

export default useSolutionsStore