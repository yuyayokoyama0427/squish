import imageCompression from 'browser-image-compression'

export type OutputFormat = 'jpeg' | 'png' | 'webp'

export interface CompressOptions {
  maxSizeMB: number
  maxWidthOrHeight: number
  outputFormat: OutputFormat
  quality: number
}

export interface ImageResult {
  id: string
  originalFile: File
  originalSize: number
  compressedBlob: Blob | null
  compressedSize: number | null
  previewUrl: string
  status: 'pending' | 'processing' | 'done' | 'error'
  error?: string
}

export async function compressImage(
  file: File,
  options: CompressOptions
): Promise<Blob> {
  const compressed = await imageCompression(file, {
    maxSizeMB: options.maxSizeMB,
    maxWidthOrHeight: options.maxWidthOrHeight,
    useWebWorker: true,
    fileType: `image/${options.outputFormat}`,
    initialQuality: options.quality / 100,
  })
  return compressed
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function reductionRate(original: number, compressed: number): number {
  return Math.round((1 - compressed / original) * 100)
}
