import { useState } from 'react'
import './index.css'
import { useCompressor } from './hooks/useCompressor'
import { usePro } from './hooks/usePro'
import { DropZone } from './components/DropZone'
import { Settings } from './components/Settings'
import { ImageCard } from './components/ImageCard'
import { LicenseModal } from './components/LicenseModal'
import { FREE_LIMIT } from './lib/license'
import type { CompressOptions } from './lib/compressor'

const CHECKOUT_URL = 'https://yomiyasu.lemonsqueezy.com/checkout/buy/94c33544-4424-482d-8ef7-def1677f4e20'

const DEFAULT_OPTIONS: CompressOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  outputFormat: 'jpeg',
  quality: 80,
}

export default function App() {
  const [options, setOptions] = useState<CompressOptions>(DEFAULT_OPTIONS)
  const [showModal, setShowModal] = useState(false)
  const { isPro, activate, loading, error } = usePro()
  const { images, addImages, removeImage, clearAll, processAll, downloadZip, isProcessing, isZipping } = useCompressor()

  const canAdd = isPro || images.length < FREE_LIMIT
  const doneCount = images.filter(i => i.status === 'done').length
  const pendingCount = images.filter(i => i.status === 'pending').length

  async function handleActivate(key: string) {
    await activate(key)
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">Squish</span>
            <span className="text-xs text-gray-400">画像一括圧縮・リサイズ</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">
              🔒 サーバーに送信されません
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isPro ? (
              <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-1 rounded-full">
                ✨ Pro
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href={CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-3 py-1.5 rounded-full transition"
                >
                  Pro版 買い切り980円
                </a>
                <button
                  className="text-xs text-emerald-600 hover:underline"
                  onClick={() => setShowModal(true)}
                >
                  キー認証
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Drop Zone */}
        <DropZone
          onFiles={addImages}
          disabled={!canAdd}
          limit={isPro ? undefined : FREE_LIMIT}
          currentCount={images.length}
        />

        {!isPro && images.length >= FREE_LIMIT && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 text-center">
            無料版は{FREE_LIMIT}件まで。
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="underline font-medium ml-1">
              Pro版（買い切り980円）で無制限に
            </a>
          </div>
        )}

        {/* Settings + Actions */}
        {images.length > 0 && (
          <>
            <Settings options={options} onChange={setOptions} />

            <div className="flex gap-3">
              <button
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl transition disabled:opacity-50"
                onClick={() => processAll(options)}
                disabled={isProcessing || pendingCount === 0}
              >
                {isProcessing ? '変換中...' : `一括変換（${pendingCount}件）`}
              </button>
              {doneCount > 0 && (
                <button
                  className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 rounded-xl transition disabled:opacity-50"
                  onClick={() => downloadZip(options.outputFormat)}
                  disabled={isZipping}
                >
                  {isZipping ? 'ZIPを作成中...' : `ZIPでダウンロード（${doneCount}件）`}
                </button>
              )}
              <button
                className="px-4 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl transition text-sm"
                onClick={clearAll}
              >
                クリア
              </button>
            </div>

            {/* Image List */}
            <div className="space-y-2">
              {images.map(img => (
                <ImageCard key={img.id} image={img} onRemove={removeImage} />
              ))}
            </div>
          </>
        )}

        {images.length === 0 && (
          <div className="text-center text-gray-400 py-8 text-sm">
            画像をドロップすると一括変換・圧縮できます
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-gray-400 py-8">
        © 2026 Squish — 画像はブラウザ内で処理され、サーバーには送信されません
      </footer>

      {showModal && (
        <LicenseModal
          onActivate={handleActivate}
          onClose={() => setShowModal(false)}
          loading={loading}
          error={error}
        />
      )}
    </div>
  )
}
