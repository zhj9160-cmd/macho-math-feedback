import { useState } from 'react'

/**
 * localStorage와 동기화되는 상태 훅
 * @template T
 * @param {string} key - localStorage 키
 * @param {T} initialValue - 초기값 (저장된 값이 없을 때 사용)
 * @returns {[T, (value: T | ((prev: T) => T)) => void]}
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  /**
   * @param {T | ((prev: T) => T)} value
   */
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch {
      // localStorage 쓰기 실패 시 상태만 업데이트
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
    }
  }

  return [storedValue, setValue]
}
