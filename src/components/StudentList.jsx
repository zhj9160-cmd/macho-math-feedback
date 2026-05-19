import { useState } from 'react'
import { UserPlus, Pencil, Trash2 } from 'lucide-react'
import { formatGrade, formatDate } from '../utils/dateUtils'

const FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'elementary', label: '초등' },
  { value: 'middle', label: '중등' },
]

/**
 * @param {{
 *   students: import('../data/schema').Student[],
 *   onEdit: (student: import('../data/schema').Student) => void,
 *   onDelete: (id: string) => void,
 *   onSelect: (student: import('../data/schema').Student) => void,
 * }} props
 */
export default function StudentList({ students, onEdit, onDelete, onSelect }) {
  const [filter, setFilter] = useState('all')

  const counts = {
    all: students.length,
    elementary: students.filter((s) => s.schoolLevel === 'elementary').length,
    middle: students.filter((s) => s.schoolLevel === 'middle').length,
  }

  const filtered =
    filter === 'all' ? students : students.filter((s) => s.schoolLevel === filter)

  return (
    <div>
      {/* 필터 탭 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === f.value
                ? 'bg-navy text-white'
                : 'bg-white border border-gray-300 text-gray-600 hover:border-navy'
            }`}
          >
            {f.label} {counts[f.value]}명
          </button>
        ))}
      </div>

      {/* 빈 상태 */}
      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <UserPlus size={52} className="mx-auto mb-4 text-lightblue" />
          <p className="text-lg font-medium text-gray-500">
            {filter === 'all'
              ? '아직 등록된 학생이 없습니다.'
              : `등록된 ${filter === 'elementary' ? '초등' : '중등'} 학생이 없습니다.`}
          </p>
          <p className="text-sm mt-1">첫 학생을 등록해보세요!</p>
        </div>
      )}

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((student) => (
          <div
            key={student.id}
            onClick={() => onSelect(student)}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer relative p-5"
          >
            {/* 학교급 배지 */}
            <span
              className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full ${
                student.schoolLevel === 'middle'
                  ? 'bg-gold text-navy'
                  : 'bg-lightblue text-navy'
              }`}
            >
              {student.schoolLevel === 'middle' ? '중등' : '초등'}
            </span>

            {/* 이름 + 학년 */}
            <h3 className="text-xl font-bold text-charcoal pr-14 leading-snug">
              {student.name}
            </h3>
            <p className="text-navy font-semibold text-sm mt-1">
              {formatGrade(student.schoolLevel, student.grade)}
            </p>

            {/* 학습 단원 */}
            <p className="text-gray-600 text-sm mt-2 leading-relaxed min-h-[1.5rem]">
              {student.unit || <span className="text-gray-300 italic">단원 미입력</span>}
            </p>

            {/* 등록일 */}
            <p className="text-gray-400 text-xs mt-3">
              등록일: {formatDate(student.createdAt)}
            </p>

            {/* 액션 버튼 */}
            <div
              className="flex gap-2 mt-4 pt-4 border-t border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onEdit(student)}
                className="flex items-center gap-1 text-sm text-navy border border-navy px-3 py-1.5 rounded-lg hover:bg-navy hover:text-white transition"
              >
                <Pencil size={14} />
                수정
              </button>
              <button
                onClick={() => onDelete(student.id)}
                className="flex items-center gap-1 text-sm text-red-500 border border-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition"
              >
                <Trash2 size={14} />
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
