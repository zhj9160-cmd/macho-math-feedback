import { useState, useEffect } from 'react'
import { X, RotateCcw } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { DEFAULT_SETTINGS } from '../data/settings'

const inputCls =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy transition'

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-charcoal mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

/**
 * @param {{ onClose: () => void }} props
 */
export default function SettingsModal({ onClose }) {
  const { settings, updateSettings, resetSettings } = useSettings()
  const [form, setForm] = useState({ ...settings })

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    updateSettings(form)
    onClose()
  }

  const handleReset = () => {
    resetSettings()
    setForm({ ...DEFAULT_SETTINGS })
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-charcoal">⚙️ 학원/강사 설정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-charcoal transition p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <Field
            label="학원/공부방 이름"
            hint="헤더와 시스템 전체에 표시됩니다"
          >
            <input
              type="text"
              value={form.academyName}
              onChange={(e) => set('academyName', e.target.value)}
              placeholder="마초수학"
              className={inputCls}
            />
          </Field>

          <Field
            label="강사 이름 (서명용)"
            hint="학부모 메시지 마지막 서명에 사용됩니다"
          >
            <input
              type="text"
              value={form.teacherFullName}
              onChange={(e) => set('teacherFullName', e.target.value)}
              placeholder="마초샘 정현정"
              className={inputCls}
            />
          </Field>

          <Field
            label="강사 호칭 (메시지 안)"
            hint="메시지 본문 내 호칭 (예: '마초샘입니다')"
          >
            <input
              type="text"
              value={form.teacherShortName}
              onChange={(e) => set('teacherShortName', e.target.value)}
              placeholder="마초샘"
              className={inputCls}
            />
          </Field>

          <Field
            label="학원 이모지"
            hint="헤더에 표시되는 아이콘"
          >
            <input
              type="text"
              value={form.academyEmoji}
              onChange={(e) => set('academyEmoji', e.target.value)}
              placeholder="🧮"
              className={`${inputCls} w-24 text-2xl text-center`}
            />
          </Field>

          {/* 버튼 */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 bg-navy text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition"
              >
                저장
              </button>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 text-gold text-sm py-2 rounded-lg hover:bg-gold/10 transition"
            >
              <RotateCcw size={14} />
              기본값으로 되돌리기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
