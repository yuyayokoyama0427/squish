import { useState } from 'react'
import type { ImageResult } from '../lib/compressor'
import { formatBytes, reductionRate } from '../lib/compressor'

interface Props {
  image: ImageResult
  onRemove: (id: string) => void
}

export function ImageCard({ image, onRemove }: Props) {
  const [saved, setSaved] = useState(false)
  const reduction = image.compressedSize
    ? reductionRate(image.originalSize, image.compressedSize)
    : null

  function handleDownload() {
    if (!image.compressedBlob) return
    const url = URL.createObjectURL(image.compressedBlob)
    const a = document.createElement('a')
    a.href = url
    // MIMEタイプから実際の出力拡張子を決定（元ファイル名の拡張子ではなく変換後の形式を使う）
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    }
    const ext = mimeToExt[image.compressedBlob.type] ?? image.originalFile.name.split('.').pop() ?? 'jpg'
    const baseName = image.originalFile.name.replace(/\.[^.]+$/, '')
    a.download = `${baseName}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
    setSaved(true)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex items-center gap-3 p-3">
      <img
        src={image.previewUrl}
        alt={image.originalFile.name}
        className="w-14 h-14 object-cover rounded-lg shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{image.originalFile.name}</p>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
          <span>{formatBytes(image.originalSize)}</span>
          {image.compressedSize && (
            <>
              <span>→</span>
              <span className="text-emerald-600 font-medium">{formatBytes(image.compressedSize)}</span>
              <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">
                -{reduction}%
              </span>
            </>
          )}
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        {image.status === 'processing' && (
          <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        )}
        {image.status === 'done' && (
          <button
            onClick={handleDownload}
            className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${saved ? 'bg-gray-200 text-gray-500' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
          >
            {saved ? '保存済み ✓' : '保存'}
          </button>
        )}
        {image.status === 'error' && <span className="text-red-500 text-xs">{image.error}</span>}
        {image.status !== 'processing' && (
          <button
            onClick={() => onRemove(image.id)}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
