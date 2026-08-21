'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { AlertCircle, AlertTriangle, Check, Copy, Info, Lightbulb } from 'lucide-react'

import type { NoteBlock } from '@/types/note'
import { slugify } from './TableOfContents'
import { getEmbedUrl } from '../editor/blocks/VideoBlockItem'

type Props = {
  blocks: NoteBlock[]
}

function CodeBlockRenderer({ code, language, title }: { code: string; language: string; title?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-[#09090b] rounded-xl border border-zinc-800 overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-[#121215] border-b border-zinc-800 text-xs text-zinc-400">
        <span className="font-mono font-semibold text-zinc-200">{title || language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span className="text-white font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="text-xs font-mono">
        <SyntaxHighlighter
          language={language || 'javascript'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            background: 'transparent',
            fontSize: '0.8125rem',
            lineHeight: '1.6',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

const CALLOUT_VARIANTS = {
  info: { icon: Info },
  tip: { icon: Lightbulb },
  warning: { icon: AlertTriangle },
  note: { icon: AlertCircle },
}

export default function BlockRenderer({ blocks }: Props) {
  return (
    <div className="space-y-6 text-zinc-900 dark:text-zinc-100 leading-relaxed">
      {blocks.map((block) => {
        switch (block.type) {
          case 'heading': {
            const slug = slugify(block.text)
            if (block.level === 1) {
              return (
                <h1
                  key={block.id}
                  id={slug}
                  className="text-2xl lg:text-3xl font-extrabold text-zinc-900 dark:text-white pt-4 pb-2 border-b border-zinc-200 dark:border-zinc-800 scroll-mt-6"
                >
                  {block.text}
                </h1>
              )
            }
            if (block.level === 2) {
              return (
                <h2
                  key={block.id}
                  id={slug}
                  className="text-xl lg:text-2xl font-bold text-zinc-900 dark:text-white pt-3 pb-1 scroll-mt-6"
                >
                  {block.text}
                </h2>
              )
            }
            return (
              <h3
                key={block.id}
                id={slug}
                className="text-lg font-bold text-zinc-900 dark:text-white pt-2 scroll-mt-6"
              >
                {block.text}
              </h3>
            )
          }

          case 'paragraph':
            return (
              <div key={block.id} className="prose dark:prose-invert max-w-none text-sm lg:text-base leading-relaxed text-zinc-800 dark:text-zinc-200">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
              </div>
            )

          case 'code':
            return (
              <CodeBlockRenderer
                key={block.id}
                code={block.code}
                language={block.language}
                title={block.title}
              />
            )

          case 'callout': {
            const variantInfo = CALLOUT_VARIANTS[block.variant] ?? CALLOUT_VARIANTS.info
            const Icon = variantInfo.icon
            return (
              <div
                key={block.id}
                className="p-4 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 flex items-start gap-3 my-4"
              >
                <Icon className="w-5 h-5 shrink-0 mt-0.5 text-zinc-700 dark:text-zinc-300" />
                <div className="text-sm leading-relaxed">{block.content}</div>
              </div>
            )
          }

          case 'divider':
            return (
              <hr
                key={block.id}
                className="my-8 border-t border-zinc-200 dark:border-zinc-800"
              />
            )

          case 'image':
            return (
              <figure key={block.id} className="my-6 space-y-2">
                <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-black flex items-center justify-center p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={block.url}
                    alt={block.alt || 'Note Image'}
                    className="max-h-[500px] w-auto object-contain rounded-lg"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-center text-xs text-zinc-500 dark:text-zinc-400 italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            )

          case 'video': {
            const embedUrl = getEmbedUrl(block.url)
            if (!embedUrl) return null
            return (
              <figure key={block.id} className="my-6 space-y-2">
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-black">
                  <iframe
                    src={embedUrl}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-center text-xs text-zinc-500 dark:text-zinc-400 italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            )
          }

          default:
            return null
        }
      })}
    </div>
  )
}
