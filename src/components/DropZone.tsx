import { useRef, useState } from 'react'

interface Props {
  onFiles: (files: File[]) => void
  disabled?: boolean
  limit?: number
  currentCount?: number
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function DropZone({ onFiles, disabled, limit, currentCount = 0 }: Props) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(files: FileList | null) {
    if (!files) return
    let valid = Array.from(files).filter(f => ACCEPTED.includes(f.type))
    if (limit !== undefined) {
      const remaining = limit - currentCount
      valid = valid.slice(0, remaining)
    }
    if (valid.length > 0) onFiles(valid)
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="画像をドロップ、またはクリックして選択"
      aria-disabled={disabled}
      className={`border-2 border-dashed rounded-2xl p-10 text-center transition cursor-pointer
        ${dragging ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'}
        ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      onClick={() => inputRef.current?.click()}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
    >
      <div className="text-4xl mb-3">🖼️</div>
      <p className="text-gray-600 font-medium">画像をドロップ、またはクリックして選択</p>
      <p className="text-sm text-gray-400 mt-1">JPG・PNG・WebP・GIF 対応</p>
      {limit !== undefined && (
        <p className="text-xs text-gray-400 mt-1">
          {currentCount} / {limit}件（無料上限）
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  )
}
