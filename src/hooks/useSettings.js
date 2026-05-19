import { useState, useEffect } from 'react'
import {
  getSettings,
  updateSettings as persist,
  resetSettings as persistReset,
} from '../data/settings'

/** 설정 변경 시 모든 useSettings 인스턴스에 브로드캐스트하는 이벤트 키 */
const SETTINGS_EVENT = 'macho-settings-updated'

/**
 * localStorage와 동기화되는 설정 훅
 * updateSettings 또는 resetSettings 호출 시 같은 페이지 내
 * 모든 useSettings 사용 컴포넌트가 자동으로 최신값으로 갱신됨
 * @returns {{ settings: import('../data/settings').DEFAULT_SETTINGS, updateSettings: Function, resetSettings: Function }}
 */
export function useSettings() {
  const [settings, setSettings] = useState(() => getSettings())

  useEffect(() => {
    const handler = () => setSettings(getSettings())
    window.addEventListener(SETTINGS_EVENT, handler)
    return () => window.removeEventListener(SETTINGS_EVENT, handler)
  }, [])

  /** @param {Partial<import('../data/settings').DEFAULT_SETTINGS>} updates */
  const updateSettings = (updates) => {
    const next = persist(updates)
    setSettings(next)
    window.dispatchEvent(new Event(SETTINGS_EVENT))
  }

  const resetSettings = () => {
    const next = persistReset()
    setSettings(next)
    window.dispatchEvent(new Event(SETTINGS_EVENT))
  }

  return { settings, updateSettings, resetSettings }
}
