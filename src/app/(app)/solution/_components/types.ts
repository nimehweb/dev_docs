export type CodeSnippetForm = {
  title: string
  language: string
  code: string
}

export type SolutionForm = {
  title: string
  description: string
  status: 'open' | 'resolved'
  difficulty: 'easy' | 'medium' | 'hard'
  problemDescription: string
  solutionSteps: string
  codeSnippets: CodeSnippetForm[]
  tags: string[]
}