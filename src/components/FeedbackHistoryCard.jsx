import { useState } from 'react'
import { Copy, Trash2 } from 'lucide-react'
import { deleteFeedback } from '../utils/storage'
import FeedbackDetailModal from './FeedbackDetailModal'

function MiniStat({ label, value }) {
  return (
    <div className="bg-ivory rounded-lg p-2 text-center">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-charcoal">{value}</p>
    </div>
  )
}

/**
 * @param {{
 *   feedback: import('../data/schema').MonthlyFeedback,
 *   onDelete: () => void,
 * }} props
 */
export default function FeedbackHistoryCard({ feedback, student, onDelete }) {
  const [showModal, setShowModal] = useState(false)

  const [year, month] = feedback.yearMonth.split('-')
  const monthLabel = `${year}년 ${parseInt(month)}월`
  const score = feedback.testScore

  const previewText = feedback.generatedFeedback
    ? feedback.generatedFeedback.slice(0, 80) +
      (feedback.generatedFeedback.length > 80 ? '...' : '')
    : null

  const handleCopy = async (e) => {
    e.stopPropagation()
    if (!feedback.generatedFeedback) return
    try { await navigator.clipboard.writeText(feedback.generatedFeedback) } catch {}
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (!window.confirm('이 피드백을 삭제하시겠습니까?')) return
    deleteFeedback(feedback.id)
    onDelete()
  }

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer p-5"
      >
        {/* 헤더: 월 + 점수 + 액션 버튼 */}
        <div className="flex items-start justify-between mb-3">
          <p className="font-bold text-navy text-base">{monthLabel}</p>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {score > 0 && (
              <span className="text-xl font-bold text-charcoal mr-1">{score}점</span>
            )}
            <button
              onClick={handleCopy}
              className="p-1.5 text-gray-400 hover:text-navy rounded transition"
              title="메시지 복사"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-gray-400 hover:text-red-500 rounded transition"
              title="삭제"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* 핵심 지표 4개 */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <MiniStat label="출석"  value={`${feedback.attendance}%`} />
          <MiniStat label="과제"  value={`${feedback.homework}%`} />
          <MiniStat label="집중도" value={`${feedback.focus}★`} />
          <MiniStat label="태도"  value={`${feedback.attitude}★`} />
        </div>

        {/* 메시지 미리보기 */}
        {previewText && (
          <p className="text-xs text-gray-500 leading-relaxed">{previewText}</p>
        )}
      </div>

      {showModal && (
        <FeedbackDetailModal
          feedback={feedback}
          student={student}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
