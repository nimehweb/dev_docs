/*
  # Create Solutions Database Schema

  1. New Tables
    - `solutions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, required)
      - `description` (text, required)
      - `problem_description` (text)
      - `solution_steps` (text)
      - `status` (text, default 'open')
      - `difficulty` (text, default 'easy')
      - `tags` (text array)
      - `code_snippets` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `solution_id` (uuid, foreign key to solutions)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create solutions table
CREATE TABLE IF NOT EXISTS solutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  problem_description text DEFAULT '',
  solution_steps text DEFAULT '',
  status text DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  difficulty text DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  tags text[] DEFAULT '{}',
  code_snippets jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  solution_id uuid REFERENCES solutions(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, solution_id)
);

-- Enable Row Level Security
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for solutions table
CREATE POLICY "Users can view their own solutions"
  ON solutions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own solutions"
  ON solutions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own solutions"
  ON solutions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own solutions"
  ON solutions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for user_favorites table
CREATE POLICY "Users can view their own favorites"
  ON user_favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON user_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON user_favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS solutions_user_id_idx ON solutions(user_id);
CREATE INDEX IF NOT EXISTS solutions_created_at_idx ON solutions(created_at DESC);
CREATE INDEX IF NOT EXISTS solutions_status_idx ON solutions(status);
CREATE INDEX IF NOT EXISTS solutions_tags_idx ON solutions USING GIN(tags);
CREATE INDEX IF NOT EXISTS user_favorites_user_id_idx ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS user_favorites_solution_id_idx ON user_favorites(solution_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_solutions_updated_at
    BEFORE UPDATE ON solutions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();