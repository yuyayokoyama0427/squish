import type { CompressOptions, OutputFormat } from '../lib/compressor'

interface Props {
  options: CompressOptions
  onChange: (options: CompressOptions) => void
}

export function Settings({ options, onChange }: Props) {
  function update<K extends keyof CompressOptions>(key: K, value: CompressOptions[K]) {
    onChange({ ...options, [key]: value })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">変換設定</h3>

      {/* 出力形式 */}
      <div>
        <label className="text-xs text-gray-500 block mb-1">出力形式</label>
        <div className="flex gap-2">
          {(['jpeg', 'png', 'webp'] as OutputFormat[]).map(fmt => (
            <button
              key={fmt}
              className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition
                ${options.outputFormat === fmt
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'border-gray-300 text-gray-600 hover:border-emerald-400'}`}
              onClick={() => update('outputFormat', fmt)}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 最大サイズ */}
      <div>
        <label className="text-xs text-gray-500 block mb-1">
          最大ファイルサイズ：<span className="text-gray-800 font-medium">{options.maxSizeMB} MB</span>
        </label>
        <input
          type="range" min={0.1} max={5} step={0.1}
          value={options.maxSizeMB}
          onChange={e => update('maxSizeMB', parseFloat(e.target.value))}
          className="w-full accent-emerald-500"
        />
      </div>

      {/* 最大解像度 */}
      <div>
        <label className="text-xs text-gray-500 block mb-1">
          最大解像度（長辺）：<span className="text-gray-800 font-medium">{options.maxWidthOrHeight}px</span>
        </label>
        <input
          type="range" min={400} max={4000} step={100}
          value={options.maxWidthOrHeight}
          onChange={e => update('maxWidthOrHeight', parseInt(e.target.value))}
          className="w-full accent-emerald-500"
        />
      </div>

      {/* 品質 */}
      {options.outputFormat !== 'png' && (
        <div>
          <label className="text-xs text-gray-500 block mb-1">
            品質：<span className="text-gray-800 font-medium">{options.quality}%</span>
          </label>
          <input
            type="range" min={10} max={100} step={5}
            value={options.quality}
            onChange={e => update('quality', parseInt(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>
      )}
    </div>
  )
}
