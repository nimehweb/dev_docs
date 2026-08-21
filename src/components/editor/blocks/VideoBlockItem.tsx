'use client'

import type { VideoBlock } from '@/types/note'
import { Video } from 'lucide-react'

type Props = {
  block: VideoBlock
  onChange: (updated: VideoBlock) => void
}

export function getEmbedUrl(url: string): string | null {
  if (!url) return null

  // YouTube match: youtube.com/watch?v=xxx or youtu.be/xxx
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`
  }

  // Loom match: loom.com/share/xxx
  const loomMatch = url.match(/loom\.com\/(?:share|embed)\/([\w-]+)/)
  if (loomMatch) {
    return `https://www.loom.com/embed/${loomMatch[1]}`
  }

  // Vimeo match: vimeo.com/xxx
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  return url
}

export default function VideoBlockItem({ block, onChange }: Props) {
  const embedUrl = getEmbedUrl(block.url)

  return (
    <div className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-lg border border-gray-200 dark:border-gray-700/80 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
        <Video className="w-4 h-4 text-red-500" />
        <span>Video Embed Block (YouTube, Loom, Vimeo)</span>
      </div>

      <div className="space-y-2">
        <input
          type="url"
          value={block.url}
          onChange={(e) => onChange({ ...block, url: e.target.value })}
          placeholder="Paste YouTube, Loom, or Vimeo URL (e.g. https://www.youtube.com/watch?v=...)..."
          className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />

        <input
          type="text"
          value={block.caption ?? ''}
          onChange={(e) => onChange({ ...block, caption: e.target.value })}
          placeholder="Video caption (optional)..."
          className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {embedUrl && (
        <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-black">
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  )
}
