export type NoteStatus = 'draft' | 'published'

export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'code'
  | 'callout'
  | 'divider'
  | 'image'
  | 'video'

export type BaseBlock = {
  id: string
  type: BlockType
}

export type HeadingBlock = BaseBlock & {
  type: 'heading'
  level: 1 | 2 | 3
  text: string
}

export type ParagraphBlock = BaseBlock & {
  type: 'paragraph'
  content: string
}

export type CodeBlock = BaseBlock & {
  type: 'code'
  title?: string
  language: string
  code: string
}

export type CalloutBlock = BaseBlock & {
  type: 'callout'
  variant: 'info' | 'warning' | 'tip' | 'note'
  content: string
}

export type DividerBlock = BaseBlock & {
  type: 'divider'
}

export type ImageBlock = BaseBlock & {
  type: 'image'
  url: string
  alt?: string
  caption?: string
}

export type VideoBlock = BaseBlock & {
  type: 'video'
  url: string
  caption?: string
}

export type NoteBlock =
  | HeadingBlock
  | ParagraphBlock
  | CodeBlock
  | CalloutBlock
  | DividerBlock
  | ImageBlock
  | VideoBlock


export type Note = {
  id: string
  userId: string
  title: string
  summary: string
  status: NoteStatus
  tags: string[]
  blocks: NoteBlock[]
  createdAt: Date
  updatedAt: Date
  isFavorited?: boolean
}

export type NoteFormInput = {
  title: string
  summary: string
  status: NoteStatus
  tags: string[]
  blocks: NoteBlock[]
}
