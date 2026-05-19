import { UserPlus, Settings } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'

/**
 * @param {{ onAddStudent: () => void, onSettingsClick: () => void }} props
 */
export default function Header({ onAddStudent, onSettingsClick }) {
  const { settings } = useSettings()

  return (
    <header className="bg-navy py-4 px-6 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold tracking-wide leading-snug">
            {settings.academyEmoji} {settings.academyName} 월간 피드백 시스템
          </h1>
          <p className="text-gold text-xs mt-0.5">by {settings.teacherFullName}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSettingsClick}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 text-gold hover:bg-white/20 transition"
            title="학원/강사 설정"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={onAddStudent}
            className="flex items-center gap-2 bg-gold text-navy font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            <UserPlus size={18} />
            <span className="hidden sm:inline text-sm">학생 등록</span>
          </button>
        </div>
      </div>
    </header>
  )
}
