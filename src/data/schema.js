/**
 * @typedef {Object} Student
 * @property {string} id - UUID
 * @property {string} name - 학생 이름
 * @property {'elementary'|'middle'} schoolLevel - 초등/중등
 * @property {number} grade - 학년 (1~6: 초등, 1~3: 중등)
 * @property {string} unit - 현재 학습 단원
 * @property {string} startDate - 수강 시작일 (ISO 날짜)
 * @property {string} createdAt - 등록일 (ISO 날짜)
 */

/**
 * @typedef {Object} MonthlyFeedback
 * @property {string} id - UUID
 * @property {string} studentId - 연결된 학생 ID
 * @property {string} yearMonth - 대상 연월 ("2026-05" 형식)
 * @property {number} attendance - 출석률 (0~100)
 * @property {number} homework - 숙제 완료율 (0~100)
 * @property {number} testScore - 시험 점수 (0~100)
 * @property {number} focus - 집중도 (1~5)
 * @property {number} attitude - 수업 태도 (1~5)
 * @property {string[]} errorTypes - 오류 유형 목록
 * @property {string} teacherMemo - 선생님 메모
 * @property {string} generatedFeedback - 생성된 피드백 문구
 * @property {string[]} nextGoals - 다음 달 목표 목록
 * @property {string} createdAt - 작성일 (ISO 날짜)
 */
