import { useState } from 'react'

const CHECKOUT_URL = 'https://squish.lemonsqueezy.com/checkout/buy/squish-pro'

interface Props {
  onActivate: (key: string) => Promise<void>
  onClose: () => void
  loading: boolean
  error: string | null
}

export function LicenseModal({ onActivate, onClose, loading, error }: Props) {
  const [key, setKey] = useState('')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Pro版を有効化</h2>
        <p className="text-sm text-gray-500 mb-4">
          購入後にメールで届いたライセンスキーを入力してください。
        </p>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          value={key}
          onChange={e => setKey(e.target.value)}
        />
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        <div className="flex gap-2 mt-4">
          <button
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50"
            onClick={() => onActivate(key)}
            disabled={loading || key.trim().length === 0}
          >
            {loading ? '確認中...' : '有効化する'}
          </button>
          <button
            className="px-4 border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50"
            onClick={onClose}
          >
            キャンセル
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          まだお持ちでない方は{' '}
          <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
            こちらから購入（買い切り980円）
          </a>
        </p>
      </div>
    </div>
  )
}
