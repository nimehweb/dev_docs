import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const authAPI = {
  // Sign up with email and password
  async signUp(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    })
    
    if (error) throw error
    return data
  },

  // Sign in with email and password
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  getCurrentUser() {
    return supabase.auth.getUser()
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helper functions
export const solutionsAPI = {
  // Get all solutions for the current user
  async getSolutions() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from("solutions")
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Add a new solution
  async addSolution(solution) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Map camelCase → snake_case
    const payload = {
      title: solution.title,
      description: solution.description,
      status: solution.status,
      difficulty: solution.difficulty,
      problem_description: solution.problemDescription || "",
      solution_steps: solution.solutionSteps || "",
      code_snippets: solution.codeSnippets || [],
      tags: solution.tags || [],
      user_id: user.id,
    }
    
    const { data, error } = await supabase
      .from('solutions')
      .insert([payload])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update a solution
  async updateSolution(id, updates) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Map camelCase → snake_case
    const payload = {
      title: updates.title,
      description: updates.description,
      status: updates.status,
      difficulty: updates.difficulty,
      problem_description: updates.problemDescription,
      solution_steps: updates.solutionSteps,
      code_snippets: updates.codeSnippets,
      tags: updates.tags,
    }
    
    const { data, error } = await supabase
      .from('solutions')
      .update(payload)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete a solution
  async deleteSolution(id) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('solutions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    
    if (error) throw error
  },

  // Get user favorites
  async getFavorites() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_favorites')
      .select('solution_id')
      .eq('user_id', user.id)
    
    if (error) throw error
    return (data || []).map(fav => fav.solution_id)
  },

  // Add to favorites
  async addToFavorites(solutionId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('user_favorites')
      .insert([{
        user_id: user.id,
        solution_id: solutionId
      }])
    
    if (error && error.code !== '23505') { // Ignore duplicate key error
      throw error
    }
  },

  // Remove from favorites
  async removeFromFavorites(solutionId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('solution_id', solutionId)
      .eq('user_id', user.id)
    
    if (error) throw error
  }
}