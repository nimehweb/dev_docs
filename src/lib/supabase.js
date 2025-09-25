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
  async getSolutions(userId) {
    if (!userId) throw new Error('User ID is required')

    const { data, error } = await supabase
      .from('solutions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Add a new solution
  async addSolution(solution, userId) {
    if (!userId) throw new Error('User ID is required')

    const { data, error } = await supabase
      .from('solutions')
      .insert([{
        ...solution,
        user_id: userId
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update a solution
  async updateSolution(id, updates, userId) {
    if (!userId) throw new Error('User ID is required')

    const { data, error } = await supabase
      .from('solutions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete a solution
  async deleteSolution(id, userId) {
    if (!userId) throw new Error('User ID is required')

    const { error } = await supabase
      .from('solutions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    
    if (error) throw error
  },

  // Get user favorites
  async getFavorites(userId) {
    if (!userId) throw new Error('User ID is required')

    const { data, error } = await supabase
      .from('user_favorites')
      .select('solution_id')
      .eq('user_id', userId)
    
    if (error) throw error
    return (data || []).map(fav => fav.solution_id)
  },

  // Add to favorites
  async addToFavorites(solutionId, userId) {
    if (!userId) throw new Error('User ID is required')

    const { error } = await supabase
      .from('user_favorites')
      .insert([{
        user_id: userId,
        solution_id: solutionId
      }])
    
    if (error && error.code !== '23505') { // Ignore duplicate key error
      throw error
    }
  },

  // Remove from favorites
  async removeFromFavorites(solutionId, userId) {
    if (!userId) throw new Error('User ID is required')

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('solution_id', solutionId)
      .eq('user_id', userId)
    
    if (error) throw error
  }
}