import { useState, useEffect } from 'react'
import { X, Copy, Check, MessageCircle } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { shareFeedbackToKakao } from '../utils/kakaoShare'

function StatRow({ label, value }) {
  return (
    <div className="bg-ivory rounded-lg px-3 py-2 flex items-center justify-between">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-charcoal">{value}</span>
    </div>
  )
}

/**
 * @param {{
 *   feedback: import('../data/schema').MonthlyFeedback,
 *   onClose: () => void,
 * }} props
 */
export default function FeedbackDetailModal({ feedback, student, onClose }) {
  const [copied, setCopied] = useState(false)
  const { settings } = useSettings()

  const [year, month] = feedback.yearMonth.split('-')
  const monthLabel = `${year}년 ${parseInt(month)}월`

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleCopy = async () => {
    if (!feedback.generatedFeedback) return
    try {
      await navigator.clipboard.writeText(feedback.generatedFeedback)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-charcoal">{monthLabel} 피드백</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-charcoal transition p-1">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* 학부모 메시지 */}
          {feedback.generatedFeedback ? (
            <div className="bg-ivory rounded-lg p-4">
              <p className="text-sm leading-relaxed text-charcoal whitespace-pre-line">
                {feedback.generatedFeedback}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">생성된 메시지가 없습니다.</p>
          )}

          {/* 복사 / 카톡 공유 버튼 */}
          {feedback.generatedFeedback && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                {copied ? '복사됨!' : '📋 메시지 복사하기'}
              </button>
              <button
                onClick={() => shareFeedbackToKakao({ student, feedback, settings, message: feedback.generatedFeedback })}
                className="flex items-center gap-1.5 bg-[#FEE500] text-[#191919] font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#FDD835] transition"
              >
                <MessageCircle size={14} />
                💬 카톡으로 보내기
              </button>
            </div>
          )}

          {/* 다음 달 목표 */}
          {feedback.nextGoals?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-charcoal mb-2">다음 달 목표</p>
              <div className="space-y-1.5">
                {feedback.nextGoals.map((g, i) => (
                  <div key={i} className="border-l-4 border-navy pl-3 py-1 text-sm text-charcoal leading-relaxed">
                    {i + 1}. {g}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 핵심 지표 */}
          <div className="grid grid-cols-2 gap-2">
            <StatRow label="출석률"     value={`${feedback.attendance}%`} />
            <StatRow label="과제 수행률" value={`${feedback.homework}%`} />
            <StatRow label="단원평가"   value={feedback.testScore ? `${feedback.testScore}점` : '—'} />
            <StatRow label="집중도"     value={`${feedback.focus}점`} />
            <StatRow label="수업 태도"  value={`${feedback.attitude}점`} />
            <StatRow label="평가 월"    value={monthLabel} />
          </div>

          {/* 강사 메모 */}
          {feedback.teacherMemo && (
            <div>
              <p className="text-sm font-semibold text-charcoal mb-1">강사 메모</p>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3">
                {feedback.teacherMemo}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
