import { useState } from 'react'
import { ArrowLeft, Plus, UserPlus, Pencil } from 'lucide-react'
import { formatGrade, getSchoolLevelLabel, getCurrentYearMonth } from '../utils/dateUtils'
import { getFeedbacksByStudent } from '../utils/storage'
import FeedbackHistoryCard from './FeedbackHistoryCard'
import RadarChart from './RadarChart'

function MiniStat({ label, value, highlight = false }) {
  return (
    <div className="bg-ivory rounded-lg p-2.5 text-center">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-gold' : 'text-navy'}`}>{value}</p>
    </div>
  )
}

/**
 * @param {{
 *   student: import('../data/schema').Student,
 *   onBack: () => void,
 *   onNewFeedback: () => void,
 *   onEditStudent: (student: import('../data/schema').Student) => void,
 * }} props
 */
export default function StudentDetail({ student, onBack, onNewFeedback, onEditStudent }) {
  const [feedbacks, setFeedbacks] = useState(() => getFeedbacksByStudent(student.id))

  const refreshFeedbacks = () => setFeedbacks(getFeedbacksByStudent(student.id))

  const currentYearMonth = getCurrentYearMonth()
  const hasCurrentMonth  = feedbacks.some((f) => f.yearMonth === currentYearMonth)
  const latestFeedback   = feedbacks[0] ?? null

  return (
    <div>
      {/* ── 상단 학생 정보 (sticky) ── */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-navy hover:opacity-70 transition mb-2"
          >
            <ArrowLeft size={15} />
            학생 목록으로
          </button>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <h2 className="text-xl font-bold text-charcoal leading-snug">{student.name}</h2>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  student.schoolLevel === 'middle' ? 'bg-gold text-navy' : 'bg-lightblue text-navy'
                }`}
              >
                {getSchoolLevelLabel(student.schoolLevel)}
              </span>
              <span className="text-sm font-semibold text-navy shrink-0">
                {formatGrade(student.schoolLevel, student.grade)}
              </span>
              {student.unit && (
                <span className="text-sm text-gray-500 truncate">{student.unit}</span>
              )}
            </div>
            <button
              onClick={() => onEditStudent(student)}
              className="flex items-center gap-1.5 text-sm text-navy border border-navy px-3 py-1.5 rounded-lg hover:bg-navy hover:text-white transition shrink-0"
            >
              <Pencil size={14} />
              <span className="hidden sm:inline">정보 수정</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 메인 컨텐츠 ── */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/*
          flex-col-reverse 계열 대신 flex-col(모바일) + md:flex-row-reverse(데스크탑) 사용:
          DOM 순서: [차트/분석] [히스토리]
          → 모바일: 차트 상단, 히스토리 하단  ✓
          → 데스크탑: 히스토리 좌측, 차트 우측 ✓
        */}
        <div className="flex flex-col md:flex-row-reverse gap-6">

          {/* ── 우측(데스크탑) / 상단(모바일): 레이더 차트 + 핵심 지표 ── */}
          {latestFeedback && (
            <div className="md:w-72 shrink-0">
              <div className="md:sticky md:top-28 space-y-4">
                {/* 레이더 차트 카드 */}
                <div className="bg-white rounded-xl shadow-md p-5">
                  <h3 className="text-base font-bold text-charcoal mb-1">📊 최근 평가 분석</h3>
                  <p className="text-xs text-gray-400 mb-3">
                    기준: {latestFeedback.yearMonth.split('-')[0]}년{' '}
                    {parseInt(latestFeedback.yearMonth.split('-')[1])}월
                  </p>
                  <RadarChart feedback={latestFeedback} />
                </div>

                {/* 핵심 지표 카드 */}
                <div className="bg-white rounded-xl shadow-md p-5">
                  <h3 className="text-sm font-bold text-charcoal mb-3">핵심 지표</h3>
                  {latestFeedback.testScore > 0 && (
                    <div className="text-center mb-4">
                      <p className="text-4xl font-bold text-navy">{latestFeedback.testScore}</p>
                      <p className="text-xs text-gray-400 mt-0.5">단원평가 점수</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <MiniStat label="출석률"  value={`${latestFeedback.attendance}%`} />
                    <MiniStat label="과제 수행" value={`${latestFeedback.homework}%`} />
                    <MiniStat
                      label="집중도"
                      value={`${'★'.repeat(latestFeedback.focus)}${'☆'.repeat(5 - latestFeedback.focus)}`}
                      highlight
                    />
                    <MiniStat
                      label="수업 태도"
                      value={`${'★'.repeat(latestFeedback.attitude)}${'☆'.repeat(5 - latestFeedback.attitude)}`}
                      highlight
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── 좌측(데스크탑) / 하단(모바일): 히스토리 ── */}
          <div className="flex-1 min-w-0">
            {/* 이번 달 피드백 작성 버튼 */}
            <button
              onClick={onNewFeedback}
              disabled={hasCurrentMonth}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-bold mb-6 transition ${
                hasCurrentMonth
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gold text-navy hover:opacity-90'
              }`}
            >
              <Plus size={18} />
              {hasCurrentMonth ? '이번 달 피드백 작성 완료' : '+ 이번 달 피드백 작성'}
            </button>

            <h3 className="text-base font-bold text-charcoal mb-4">📚 피드백 히스토리</h3>

            {feedbacks.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <UserPlus size={48} className="mx-auto mb-4 text-lightblue" />
                <p className="font-medium text-gray-500">아직 작성된 피드백이 없습니다.</p>
                <p className="text-sm mt-1">첫 피드백을 작성해보세요!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedbacks.map((fb) => (
                  <FeedbackHistoryCard
                    key={fb.id}
                    feedback={fb}
                    student={student}
                    onDelete={refreshFeedbacks}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
