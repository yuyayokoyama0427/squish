import { useState, useCallback } from 'react'
import JSZip from 'jszip'
import { compressImage, type CompressOptions, type ImageResult } from '../lib/compressor'

export function useCompressor() {
  const [images, setImages] = useState<ImageResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isZipping, setIsZipping] = useState(false)

  const addImages = useCallback((files: File[]) => {
    const newImages: ImageResult[] = files.map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      originalFile: file,
      originalSize: file.size,
      compressedBlob: null,
      compressedSize: null,
      previewUrl: URL.createObjectURL(file),
      status: 'pending' as const,
    }))
    setImages(prev => [...prev, ...newImages])
  }, [])

  const removeImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setImages([])
  }, [])

  const processAll = useCallback(async (options: CompressOptions) => {
    setIsProcessing(true)
    setImages(prev => prev.map(img =>
      img.status === 'pending' ? { ...img, status: 'processing' as const } : img
    ))

    for (const img of images.filter(i => i.status === 'pending' || i.status === 'processing')) {
      try {
        const blob = await compressImage(img.originalFile, options)
        setImages(prev => prev.map(i =>
          i.id === img.id
            ? { ...i, compressedBlob: blob, compressedSize: blob.size, status: 'done' as const }
            : i
        ))
      } catch (e) {
        setImages(prev => prev.map(i =>
          i.id === img.id
            ? { ...i, status: 'error' as const, error: '変換に失敗しました' }
            : i
        ))
      }
    }
    setIsProcessing(false)
  }, [images])

  const downloadZip = useCallback(async (outputFormat: string) => {
    const done = images.filter(i => i.status === 'done' && i.compressedBlob)
    if (done.length === 0) return

    setIsZipping(true)
    const zip = new JSZip()

    done.forEach(img => {
      const ext = outputFormat
      const baseName = img.originalFile.name.replace(/\.[^.]+$/, '')
      zip.file(`${baseName}.${ext}`, img.compressedBlob!)
    })

    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `squish_${Date.now()}.zip`
    a.click()
    URL.revokeObjectURL(url)
    setIsZipping(false)
  }, [images])

  return { images, addImages, removeImage, clearAll, processAll, downloadZip, isProcessing, isZipping }
}
