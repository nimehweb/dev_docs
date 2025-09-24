import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database helper functions
export const solutionsAPI = {
  // Get all solutions for the current user
  async getSolutions() {
    const { data, error } = await supabase
      .from('solutions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Add a new solution
  async addSolution(solution) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('solutions')
      .insert([{
        ...solution,
        user_id: user.id
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update a solution
  async updateSolution(id, updates) {
    const { data, error } = await supabase
      .from('solutions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete a solution
  async deleteSolution(id) {
    const { error } = await supabase
      .from('solutions')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Get user favorites
  async getFavorites() {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('solution_id')
    
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
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('solution_id', solutionId)
    
    if (error) throw error
  }
}