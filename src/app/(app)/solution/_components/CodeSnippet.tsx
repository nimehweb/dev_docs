'use client'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

type CodeSnippetProps = {
  title: string
  language: string
  code: string
}

export default function CodeSnippet({ title, language, code }: CodeSnippetProps) {
  return (
    <div className="mb-4 border border-gray-300 dark:border-gray-700 rounded-lg p-3 lg:p-4">
      <h3 className="text-sm lg:text-base font-semibold mb-2">{title || 'Untitled snippet'}</h3>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        className="rounded-lg text-xs lg:text-sm"
        customStyle={{ fontSize: '0.75rem' }}
      >
        {code}
      </SyntaxHighlighter>
      <p className="text-xs lg:text-sm mt-2 text-gray-500">Language: {language}</p>
    </div>
  )
}