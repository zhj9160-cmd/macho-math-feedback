/**
 * 현재 연월을 "YYYY-MM" 형식으로 반환
 * @returns {string} 예: "2026-05"
 */
export function getCurrentYearMonth() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * ISO 날짜 문자열을 한국식 날짜로 포맷
 * @param {string} iso - ISO 날짜 문자열
 * @returns {string} 예: "2026년 5월 19일"
 */
export function formatDate(iso) {
  const date = new Date(iso)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}년 ${month}월 ${day}일`
}

/**
 * "YYYY-MM" 문자열에서 월 이름만 반환
 * @param {string} yearMonth - "2026-05" 형식
 * @returns {string} 예: "5월"
 */
export function getMonthName(yearMonth) {
  const month = parseInt(yearMonth.split('-')[1], 10)
  return `${month}월`
}

/**
 * 학교 구분과 학년을 짧은 레이블로 변환
 * @param {'elementary'|'middle'} schoolLevel
 * @param {number} grade
 * @returns {string} 예: "초3", "중2"
 */
export function formatGrade(schoolLevel, grade) {
  const prefix = schoolLevel === 'middle' ? '중' : '초'
  return `${prefix}${grade}`
}

/**
 * schoolLevel 값을 한국어 레이블로 변환
 * @param {'elementary'|'middle'} schoolLevel
 * @returns {string} "초등" 또는 "중등"
 */
export function getSchoolLevelLabel(schoolLevel) {
  return schoolLevel === 'middle' ? '중등' : '초등'
}
