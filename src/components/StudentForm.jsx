import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { GRADE_OPTIONS, UNIT_SUGGESTIONS } from '../data/constants'

const TODAY = new Date().toISOString().split('T')[0]

/**
 * @param {{
 *   editingStudent: import('../data/schema').Student | null,
 *   onSave: (data: object) => void,
 *   onClose: () => void,
 * }} props
 */
export default function StudentForm({ editingStudent, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    gradeValue: '',
    schoolLevel: 'elementary',
    grade: 1,
    unit: '',
    startDate: TODAY,
  })
  const [errors, setErrors] = useState({})

  // 수정 모드일 때 기존 값으로 초기화
  useEffect(() => {
    if (editingStudent) {
      setForm({
        name: editingStudent.name,
        gradeValue: `${editingStudent.schoolLevel}-${editingStudent.grade}`,
        schoolLevel: editingStudent.schoolLevel,
        grade: editingStudent.grade,
        unit: editingStudent.unit || '',
        startDate: editingStudent.startDate || TODAY,
      })
    }
  }, [editingStudent])

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleGradeChange = (e) => {
    const value = e.target.value
    const option = GRADE_OPTIONS.find((o) => o.value === value)
    if (option) {
      setForm((prev) => ({
        ...prev,
        gradeValue: value,
        schoolLevel: option.schoolLevel,
        grade: option.grade,
        // 학교급이 바뀔 때만 단원 초기화
        unit: prev.schoolLevel !== option.schoolLevel ? '' : prev.unit,
      }))
    } else {
      setForm((prev) => ({ ...prev, gradeValue: value }))
    }
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = '학생 이름을 입력해주세요'
    if (!form.gradeValue) next.grade = '학년을 선택해주세요'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({
      name: form.name.trim(),
      schoolLevel: form.schoolLevel,
      grade: form.grade,
      unit: form.unit.trim(),
      startDate: form.startDate,
    })
  }

  const unitSuggestions = UNIT_SUGGESTIONS[form.schoolLevel] || []

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-charcoal">
            {editingStudent ? '학생 정보 수정' : '새 학생 등록'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-charcoal transition p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* 학생 이름 */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              학생 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="예: 홍길동"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy transition"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* 학년 */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              학년 <span className="text-red-500">*</span>
            </label>
            <select
              value={form.gradeValue}
              onChange={handleGradeChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy transition bg-white"
            >
              <option value="">학년 선택</option>
              {GRADE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.grade && (
              <p className="text-red-500 text-xs mt-1">{errors.grade}</p>
            )}
          </div>

          {/* 현재 학습 단원 */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              현재 학습 단원
            </label>
            <input
              type="text"
              list="unit-suggestions"
              value={form.unit}
              onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
              placeholder="예: 분수의 덧셈과 뺄셈"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy transition"
            />
            <datalist id="unit-suggestions">
              {unitSuggestions.map((u) => (
                <option key={u} value={u} />
              ))}
            </datalist>
          </div>

          {/* 학습 시작일 */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              학습 시작일
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy transition"
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
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
              {editingStudent ? '수정 완료' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
