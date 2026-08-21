'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { BlockType, NoteBlock, NoteFormInput, NoteStatus } from '@/types/note'
import {
  ArrowDown,
  ArrowUp,
  Code2,
  Copy,
  Heading,
  Image as ImageIcon,
  Loader2,
  MessageSquareQuote,
  Minus,
  Plus,
  Trash2,
  Type,
  Video,
  X,
} from 'lucide-react'

import HeadingBlockItem from './blocks/HeadingBlockItem'
import ParagraphBlockItem from './blocks/ParagraphBlockItem'
import CodeBlockItem from './blocks/CodeBlockItem'
import CalloutBlockItem from './blocks/CalloutBlockItem'
import DividerBlockItem from './blocks/DividerBlockItem'
import ImageBlockItem from './blocks/ImageBlockItem'
import VideoBlockItem from './blocks/VideoBlockItem'
import { createNoteAction, updateNoteAction } from '@/app/actions/note'

type Props = {
  initialNote?: {
    id: string
    title: string
    summary: string
    status: NoteStatus
    tags: string[]
    blocks: NoteBlock[]
  }
}

export default function BlockEditor({ initialNote }: Props) {
  const router = useRouter()
  const isEditing = Boolean(initialNote?.id)

  const [title, setTitle] = useState(initialNote?.title ?? '')
  const [summary, setSummary] = useState(initialNote?.summary ?? '')
  const [status, setStatus] = useState<NoteStatus>(initialNote?.status ?? 'published')
  const [tags, setTags] = useState<string[]>(initialNote?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [blocks, setBlocks] = useState<NoteBlock[]>(
    initialNote?.blocks ?? [
      { id: crypto.randomUUID(), type: 'heading', level: 1, text: '' },
      { id: crypto.randomUUID(), type: 'paragraph', content: '' },
    ]
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>()

  const createBlock = (type: BlockType): NoteBlock => {
    const id = crypto.randomUUID()
    switch (type) {
      case 'heading':
        return { id, type: 'heading', level: 2, text: '' }
      case 'paragraph':
        return { id, type: 'paragraph', content: '' }
      case 'code':
        return { id, type: 'code', title: '', language: 'typescript', code: '' }
      case 'callout':
        return { id, type: 'callout', variant: 'note', content: '' }
      case 'divider':
        return { id, type: 'divider' }
      case 'image':
        return { id, type: 'image', url: '', alt: '', caption: '' }
      case 'video':
        return { id, type: 'video', url: '', caption: '' }
    }
  }

  const addBlock = (type: BlockType, targetIndex?: number) => {
    const newBlock = createBlock(type)
    if (typeof targetIndex === 'number') {
      const updated = [...blocks]
      updated.splice(targetIndex + 1, 0, newBlock)
      setBlocks(updated)
    } else {
      setBlocks([...blocks, newBlock])
    }
  }

  const updateBlock = (index: number, updated: NoteBlock) => {
    const next = [...blocks]
    next[index] = updated
    setBlocks(next)
  }

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === blocks.length - 1)
    ) {
      return
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const next = [...blocks]
    const [moved] = next.splice(index, 1)
    next.splice(targetIndex, 0, moved)
    setBlocks(next)
  }

  const duplicateBlock = (index: number) => {
    const blockToCopy = blocks[index]
    const copy: NoteBlock = JSON.parse(JSON.stringify(blockToCopy))
    copy.id = crypto.randomUUID()
    const next = [...blocks]
    next.splice(index + 1, 0, copy)
    setBlocks(next)
  }

  const removeBlock = (index: number) => {
    if (blocks.length <= 1) return
    setBlocks(blocks.filter((_, i) => i !== index))
  }

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleSubmit = async (targetStatus: NoteStatus) => {
    if (!title.trim()) {
      setErrorMsg('Note title is required')
      return
    }

    setIsSubmitting(true)
    setErrorMsg(undefined)

    const payload: NoteFormInput = {
      title: title.trim(),
      summary: summary.trim(),
      status: targetStatus,
      tags,
      blocks,
    }

    try {
      if (isEditing && initialNote?.id) {
        const res = await updateNoteAction(initialNote.id, payload)
        if (res?.error) {
          setErrorMsg(res.error)
        } else {
          router.push(`/solution/${initialNote.id}`)
        }
      } else {
        const res = await createNoteAction(payload)
        if (res?.error) {
          setErrorMsg(res.error)
        } else if (res?.data?.id) {
          router.push(`/solution/${res.data.id}`)
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Top Bar Actions - Strict Monochrome */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#121215] p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Status:
          </span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as NoteStatus)}
            className="text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 focus:outline-none"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('draft')}
            className="px-4 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-300 dark:border-zinc-700 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('published')}
            className="px-5 py-2 text-xs font-bold text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Publish Note'}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Main Header Inputs */}
      <div className="bg-white dark:bg-[#121215] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title (e.g., Setting up Auth in Next.js 16)..."
          className="w-full text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white bg-transparent placeholder-zinc-400 focus:outline-none border-b border-transparent focus:border-zinc-500 pb-1"
        />

        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Brief summary or summary takeaway of this note..."
          rows={2}
          className="w-full text-sm text-zinc-700 dark:text-zinc-300 bg-transparent placeholder-zinc-400 focus:outline-none resize-none border-b border-zinc-100 dark:border-zinc-800 pb-2"
        />

        {/* Tags input */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Tags & Topics
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium rounded-md border border-zinc-300 dark:border-zinc-700"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-zinc-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  }
                }}
                placeholder="Add tag and press enter..."
                className="text-xs px-2.5 py-1 bg-zinc-50 dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-500"
              />
              <button
                type="button"
                onClick={addTag}
                className="p-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-700 dark:text-zinc-300"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Blocks Canvas */}
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="group relative bg-white dark:bg-[#121215] rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:border-zinc-400 dark:hover:border-zinc-600"
          >
            {/* Toolbar for individual block */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Block {index + 1}: {block.type}
              </span>

              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveBlock(index, 'up')}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === blocks.length - 1}
                  onClick={() => moveBlock(index, 'down')}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => duplicateBlock(index)}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400"
                  title="Duplicate Block"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={blocks.length <= 1}
                  onClick={() => removeBlock(index)}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:text-red-500 disabled:opacity-30"
                  title="Delete Block"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Block Body Rendering */}
            {block.type === 'heading' && (
              <HeadingBlockItem
                block={block}
                onChange={(updated) => updateBlock(index, updated)}
              />
            )}
            {block.type === 'paragraph' && (
              <ParagraphBlockItem
                block={block}
                onChange={(updated) => updateBlock(index, updated)}
              />
            )}
            {block.type === 'code' && (
              <CodeBlockItem
                block={block}
                onChange={(updated) => updateBlock(index, updated)}
              />
            )}
            {block.type === 'callout' && (
              <CalloutBlockItem
                block={block}
                onChange={(updated) => updateBlock(index, updated)}
              />
            )}
            {block.type === 'divider' && <DividerBlockItem />}
            {block.type === 'image' && (
              <ImageBlockItem
                block={block}
                onChange={(updated) => updateBlock(index, updated)}
              />
            )}
            {block.type === 'video' && (
              <VideoBlockItem
                block={block}
                onChange={(updated) => updateBlock(index, updated)}
              />
            )}

            {/* In-between + Add Block Bar - Monochrome */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="flex items-center gap-1 bg-black text-white shadow-lg rounded-full px-3 py-1 border border-zinc-800 text-xs">
                <span className="text-[10px] font-semibold text-zinc-400 pl-1">+ Insert:</span>
                <button
                  type="button"
                  onClick={() => addBlock('heading', index)}
                  className="px-2 py-0.5 hover:bg-zinc-800 rounded font-medium text-zinc-200"
                >
                  Heading
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('paragraph', index)}
                  className="px-2 py-0.5 hover:bg-zinc-800 rounded font-medium text-zinc-200"
                >
                  Prose
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('code', index)}
                  className="px-2 py-0.5 hover:bg-slate-800 rounded font-medium text-zinc-200"
                >
                  Code
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('callout', index)}
                  className="px-2 py-0.5 hover:bg-zinc-800 rounded font-medium text-zinc-200"
                >
                  Callout
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('video', index)}
                  className="px-2 py-0.5 hover:bg-zinc-800 rounded font-medium text-zinc-200"
                >
                  Video
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Global Add Block Bar at Bottom - Strict Monochrome */}
      <div className="bg-white dark:bg-[#121215] p-5 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 text-center space-y-3">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Add Content Block
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => addBlock('heading')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            <Heading className="w-3.5 h-3.5" />
            Heading
          </button>
          <button
            type="button"
            onClick={() => addBlock('paragraph')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            <Type className="w-3.5 h-3.5" />
            Paragraph
          </button>
          <button
            type="button"
            onClick={() => addBlock('code')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            <Code2 className="w-3.5 h-3.5" />
            Code Block
          </button>
          <button
            type="button"
            onClick={() => addBlock('callout')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            Callout
          </button>
          <button
            type="button"
            onClick={() => addBlock('divider')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            <Minus className="w-3.5 h-3.5" />
            Divider
          </button>
          <button
            type="button"
            onClick={() => addBlock('image')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Image
          </button>
          <button
            type="button"
            onClick={() => addBlock('video')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            <Video className="w-3.5 h-3.5" />
            Video
          </button>
        </div>
      </div>
    </div>
  )
}
