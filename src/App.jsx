import { useState, useEffect } from 'react'
import Header from './components/Header'
import StudentList from './components/StudentList'
import StudentForm from './components/StudentForm'
import StudentDetail from './components/StudentDetail'
import FeedbackForm from './components/FeedbackForm'
import SettingsModal from './components/SettingsModal'
import { getStudents, addStudent, updateStudent, deleteStudent } from './utils/storage'
import { initKakao } from './utils/kakaoShare'

export default function App() {
  const [view, setView] = useState('list') // 'list' | 'student-detail' | 'feedback-form'
  const [students, setStudents] = useState(() => getStudents())
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [editingStudent, setEditingStudent] = useState(null)

  const refreshStudents = () => setStudents(getStudents())

  useEffect(() => {
    const key = import.meta.env.VITE_KAKAO_JS_KEY
    if (!key || key.startsWith('YOUR_')) {
      console.warn('[App] VITE_KAKAO_JS_KEY가 설정되지 않았습니다. 카카오 공유 기능이 비활성화됩니다.')
      return
    }
    initKakao()
  }, [])

  const handleAddClick = () => {
    setEditingStudent(null)
    setIsFormOpen(true)
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setIsFormOpen(true)
  }

  const handleDelete = (id) => {
    if (!window.confirm('학생을 삭제하시겠습니까?\n관련 피드백도 모두 삭제됩니다.')) return
    deleteStudent(id)
    refreshStudents()
  }

  const handleStudentSave = (formData) => {
    if (editingStudent) {
      const updated = updateStudent(editingStudent.id, formData)
      if (updated && selectedStudent?.id === editingStudent.id) {
        setSelectedStudent(updated)
      }
    } else {
      addStudent(formData)
    }
    refreshStudents()
    setIsFormOpen(false)
    setEditingStudent(null)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingStudent(null)
  }

  const handleSelect = (student) => {
    setSelectedStudent(student)
    setView('student-detail')
  }

  const handleNewFeedback = () => {
    setView('feedback-form')
  }

  const handleEditStudent = (student) => {
    setEditingStudent(student)
    setIsFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Header
        onAddStudent={handleAddClick}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      <main>
        {view === 'list' && (
          <div className="max-w-6xl mx-auto p-6 md:p-8">
            <StudentList
              students={students}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelect={handleSelect}
            />
          </div>
        )}

        {view === 'student-detail' && selectedStudent && (
          <StudentDetail
            student={selectedStudent}
            onBack={() => setView('list')}
            onNewFeedback={handleNewFeedback}
            onEditStudent={handleEditStudent}
          />
        )}

        {view === 'feedback-form' && selectedStudent && (
          <FeedbackForm
            student={selectedStudent}
            onBack={() => setView('student-detail')}
            onSave={(data) => console.log('임시저장:', data)}
            onGenerate={(data) => console.log('피드백 생성:', data)}
            onSaveSuccess={() => setView('student-detail')}
          />
        )}
      </main>

      {isFormOpen && (
        <StudentForm
          editingStudent={editingStudent}
          onSave={handleStudentSave}
          onClose={handleFormClose}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  )
}
