'use client'

const renderInlineMarkdown = (text = '') =>
  text
    .replace(/## (.*)/g, '<h2 class="text-xl font-semibold my-3 ">$1</h2>')
    .replace(/# (.*)/g, '<h1 class="text-2xl font-bold my-3">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/\n/g, '<br>')

const renderMarkdownWithCode = (text: string) => {
  if (!text) return null
  const codeBlockRegex = /```(\w+)\n([\s\S]*?)```/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const beforeText = text.slice(lastIndex, match.index)
      parts.push(
        <div key={lastIndex} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(beforeText) }} />,
      )
    }

    const code = match[2]
    parts.push(
      <pre
        key={match.index}
        className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4"
      >
        <code>{code.trim()}</code>
      </pre>,
    )

    lastIndex = codeBlockRegex.lastIndex
  }

  if (parts.length === 0 || lastIndex < text.length) {
    const remainingText = text.slice(lastIndex)
    parts.push(<div key={lastIndex} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(remainingText) }} />)
  }

  return parts
}

export default function MarkdownRenderer({ content, mode }: { content: string; mode?: string }) {
  return (
    <div
      className={`border border-gray-300 dark:border-gray-700 rounded-lg p-4 my-6 prose prose-sm dark:prose-invert prose-pre:rounded-xl prose-pre:p-0 prose-pre:bg-transparent prose-code:before:hidden prose-code:after:hidden ${
        mode === 'preview' ? 'bg-gray-100 dark:bg-gray-800' : ''
      }`}
    >
      {renderMarkdownWithCode(content)}
    </div>
  )
}