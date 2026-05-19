const SETTINGS_KEY = 'macho-settings'

export const DEFAULT_SETTINGS = {
  academyName: '마초수학',
  teacherFullName: '마초샘 정현정',
  teacherShortName: '마초샘',
  academyEmoji: '🧮',
}

/**
 * 저장된 설정 반환. 없으면 기본값 사용
 * @returns {typeof DEFAULT_SETTINGS}
 */
export function getSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

/**
 * 일부 설정만 업데이트 후 저장
 * @param {Partial<typeof DEFAULT_SETTINGS>} updates
 * @returns {typeof DEFAULT_SETTINGS}
 */
export function updateSettings(updates) {
  const next = { ...getSettings(), ...updates }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
  return next
}

/**
 * 기본값으로 초기화 (localStorage에서 설정 삭제)
 * @returns {typeof DEFAULT_SETTINGS}
 */
export function resetSettings() {
  localStorage.removeItem(SETTINGS_KEY)
  return { ...DEFAULT_SETTINGS }
}
