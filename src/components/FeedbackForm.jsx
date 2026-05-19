import { useState, useRef } from 'react'
import { ArrowLeft, Save, Sparkles, Copy, Check, MessageCircle } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { ERROR_TYPES } from '../data/constants'
import { formatGrade, getSchoolLevelLabel, getCurrentYearMonth } from '../utils/dateUtils'
import {
  analyzeStrengths,
  analyzeWeaknesses,
  generateNextGoals,
  generateParentMessage,
} from '../utils/feedbackGenerator'
import { addFeedback } from '../utils/storage'
import { shareFeedbackToKakao } from '../utils/kakaoShare'
import StarRating from './StarRating'
import ChipSelect from './ChipSelect'
import Slider from './Slider'

/** 최근 6개월 선택지 생성 */
function generateMonthOptions() {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - i)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return { value: `${year}-${month}`, label: `${year}년 ${parseInt(month)}월` }
  })
}

const MONTH_OPTIONS = generateMonthOptions()
const MEMO_MAX = 200

/**
 * @param {{
 *   student: import('../data/schema').Student,
 *   onBack: () => void,
 *   onSave: (data: object) => void,
 *   onGenerate: (data: object) => void,
 * }} props
 */
export default function FeedbackForm({ student, onBack, onSave, onGenerate, onSaveSuccess }) {
  const [form, setForm] = useState({
    yearMonth: getCurrentYearMonth(),
    attendance: 80,
    homework: 80,
    testScore: '',
    focus: 0,
    attitude: 0,
    errorTypes: [],
    teacherMemo: '',
  })

  /** @type {[{message:string, strengths:string[], weaknesses:string[], goals:string[]}|null, Function]} */
  const [generated, setGenerated] = useState(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState(null)
  const resultRef = useRef(null)
  const { settings } = useSettings()

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  const handleGenerate = () => {
    const message   = generateParentMessage(student, form, settings)
    const strengths = analyzeStrengths(form, student.schoolLevel)
    const weaknesses = analyzeWeaknesses(form, student.schoolLevel)
    const goals     = generateNextGoals(form, student.schoolLevel)
    setGenerated({ message, strengths, weaknesses, goals })
    setSaved(false)
    onGenerate({ ...form, studentId: student.id })
    // 결과 카드로 스크롤
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generated.message)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch {
      setCopySuccess(false)
    }
  }

  const handleSaveFeedback = () => {
    addFeedback({
      studentId: student.id,
      yearMonth: form.yearMonth,
      attendance: form.attendance,
      homework: form.homework,
      testScore: parseInt(form.testScore) || 0,
      focus: form.focus,
      attitude: form.attitude,
      errorTypes: form.errorTypes,
      teacherMemo: form.teacherMemo,
      generatedFeedback: generated.message,
      nextGoals: generated.goals,
    })
    setSaved(true)
    setToast('✅ 피드백이 저장되었습니다')
    setTimeout(() => { setToast(null); onSaveSuccess?.() }, 1800)
  }

  return (
    <div>
      {/* ── 상단 학생 정보 (sticky) ── */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-navy hover:opacity-70 transition mb-2"
          >
            <ArrowLeft size={15} />
            학생 상세로 돌아가기
          </button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-charcoal leading-snug">{student.name}</h2>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    student.schoolLevel === 'middle' ? 'bg-gold text-navy' : 'bg-lightblue text-navy'
                  }`}
                >
                  {getSchoolLevelLabel(student.schoolLevel)}
                </span>
                <span className="text-sm font-semibold text-navy">
                  {formatGrade(student.schoolLevel, student.grade)}
                </span>
              </div>
              {student.unit && <p className="text-sm text-gray-500 mt-0.5">{student.unit}</p>}
            </div>
            <select
              value={form.yearMonth}
              onChange={(e) => set('yearMonth', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-navy bg-white shrink-0"
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── 폼 본문 ── */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

        {/* 섹션 1: 학습 데이터 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-base font-bold text-charcoal mb-5">📊 학습 데이터</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">출석률</label>
              <Slider value={form.attendance} onChange={(v) => set('attendance', v)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">과제 수행률</label>
              <Slider value={form.homework} onChange={(v) => set('homework', v)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">단원평가 점수</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.testScore}
                  onChange={(e) => {
                    const v = e.target.value
                    if (v === '' || (Number(v) >= 0 && Number(v) <= 100)) set('testScore', v)
                  }}
                  placeholder="—"
                  className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:border-navy transition"
                />
                <span className="text-sm text-gray-500">점 (0~100)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 섹션 2: 태도 평가 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-base font-bold text-charcoal mb-5">⭐ 태도 평가</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">집중도</label>
              <div className="flex items-center gap-3">
                <StarRating value={form.focus} onChange={(v) => set('focus', v)} />
                <span className="text-sm text-gray-400">{form.focus > 0 ? `${form.focus}점` : '미평가'}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">수업 태도</label>
              <div className="flex items-center gap-3">
                <StarRating value={form.attitude} onChange={(v) => set('attitude', v)} />
                <span className="text-sm text-gray-400">{form.attitude > 0 ? `${form.attitude}점` : '미평가'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 섹션 3: 오답 유형 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-base font-bold text-charcoal mb-2">❌ 오답 유형</h3>
          <p className="text-xs text-gray-400 mb-4">해당하는 항목을 모두 선택하세요</p>
          <ChipSelect
            options={ERROR_TYPES}
            selected={form.errorTypes}
            onChange={(v) => set('errorTypes', v)}
          />
        </div>

        {/* 섹션 4: 강사 메모 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-base font-bold text-charcoal mb-4">📝 강사 메모</h3>
          <div className="relative">
            <textarea
              value={form.teacherMemo}
              onChange={(e) => {
                if (e.target.value.length <= MEMO_MAX) set('teacherMemo', e.target.value)
              }}
              placeholder="이번 달 특이사항, 개선된 점, 주의할 점 등을 자유롭게 입력하세요."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-navy transition leading-relaxed"
            />
            <span
              className={`absolute bottom-3 right-3 text-xs pointer-events-none ${
                form.teacherMemo.length >= MEMO_MAX ? 'text-red-400' : 'text-gray-400'
              }`}
            >
              {form.teacherMemo.length}/{MEMO_MAX}
            </span>
          </div>
        </div>

        {/* ── 액션 버튼 ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => onSave({ ...form, studentId: student.id })}
            className="flex items-center justify-center gap-2 border border-gray-300 text-gray-600 py-3 px-6 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
          >
            <Save size={16} />
            임시 저장
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 flex items-center justify-center gap-2 bg-gold text-navy py-3 rounded-xl text-base font-bold hover:opacity-90 transition"
          >
            <Sparkles size={18} />
            피드백 자동 생성하기
          </button>
        </div>

        {/* ── 생성 결과 카드 ── */}
        {generated && (
          <div ref={resultRef} className="bg-white rounded-xl shadow-md p-6 space-y-5">
            <h3 className="text-base font-bold text-charcoal">📋 자동 생성된 학부모 메시지</h3>

            {/* 메시지 본문 */}
            <div className="bg-ivory rounded-lg p-4">
              <p className="text-base leading-relaxed text-charcoal whitespace-pre-line">
                {generated.message}
              </p>
            </div>

            {/* 복사 / 저장 / 카톡 공유 버튼 */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                {copySuccess ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                {copySuccess ? '복사됨!' : '복사하기'}
              </button>
              <button
                onClick={handleSaveFeedback}
                disabled={saved}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition ${
                  saved
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-navy text-white hover:opacity-90'
                }`}
              >
                {saved ? <Check size={14} /> : <Save size={14} />}
                {saved ? '저장됨' : '저장하기'}
              </button>
              <button
                onClick={() => shareFeedbackToKakao({ student, feedback: form, settings, message: generated.message })}
                className="flex items-center gap-1.5 bg-[#FEE500] text-[#191919] font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#FDD835] transition"
              >
                <MessageCircle size={14} />
                💬 카톡으로 학부모에게 보내기
              </button>
            </div>

            {/* 강점 */}
            <div>
              <p className="text-sm font-semibold text-charcoal mb-2">강점</p>
              <div className="space-y-1.5">
                {generated.strengths.map((s, i) => (
                  <div key={i} className="border-l-4 border-gold pl-3 py-1 text-sm text-charcoal leading-relaxed">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* 보완점 */}
            <div>
              <p className="text-sm font-semibold text-charcoal mb-2">보완점</p>
              <div className="space-y-1.5">
                {generated.weaknesses.map((w, i) => (
                  <div key={i} className="border-l-4 border-lightblue pl-3 py-1 text-sm text-charcoal leading-relaxed">
                    {w}
                  </div>
                ))}
              </div>
            </div>

            {/* 다음 달 목표 */}
            <div>
              <p className="text-sm font-semibold text-charcoal mb-2">다음 달 목표</p>
              <div className="space-y-1.5">
                {generated.goals.map((g, i) => (
                  <div key={i} className="border-l-4 border-navy pl-3 py-1 text-sm text-charcoal leading-relaxed">
                    {i + 1}. {g}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="pb-10" />
      </div>

      {toast && (
        <div className="fixed bottom-8 inset-x-0 flex justify-center z-50 pointer-events-none">
          <div className="bg-charcoal text-white px-6 py-3 rounded-full text-sm font-medium shadow-xl">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}
