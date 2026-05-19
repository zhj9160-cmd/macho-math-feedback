/** @type {{value: string, label: string}[]} */
export const SCHOOL_LEVELS = [
  { value: 'elementary', label: '초등' },
  { value: 'middle', label: '중등' },
]

/**
 * 초1~초6, 중1~중3 총 9개 학년 옵션
 * @type {{value: string, label: string, schoolLevel: string, grade: number}[]}
 */
export const GRADE_OPTIONS = [
  { value: 'elementary-1', label: '초1', schoolLevel: 'elementary', grade: 1 },
  { value: 'elementary-2', label: '초2', schoolLevel: 'elementary', grade: 2 },
  { value: 'elementary-3', label: '초3', schoolLevel: 'elementary', grade: 3 },
  { value: 'elementary-4', label: '초4', schoolLevel: 'elementary', grade: 4 },
  { value: 'elementary-5', label: '초5', schoolLevel: 'elementary', grade: 5 },
  { value: 'elementary-6', label: '초6', schoolLevel: 'elementary', grade: 6 },
  { value: 'middle-1', label: '중1', schoolLevel: 'middle', grade: 1 },
  { value: 'middle-2', label: '중2', schoolLevel: 'middle', grade: 2 },
  { value: 'middle-3', label: '중3', schoolLevel: 'middle', grade: 3 },
]

/** @type {{elementary: string[], middle: string[]}} */
export const UNIT_SUGGESTIONS = {
  elementary: [
    '수와 연산',
    '분수의 덧셈과 뺄셈',
    '도형과 측정',
    '비와 비율',
    '규칙성과 자료의 정리',
  ],
  middle: [
    '정수와 유리수',
    '일차방정식',
    '함수와 그래프',
    '평면도형의 성질',
    '확률',
    '제곱근과 실수',
    '이차방정식',
    '이차함수',
    '도형의 닮음',
  ],
}

/** @type {{value: string, label: string}[]} */
export const ERROR_TYPES = [
  { value: 'calculation', label: '계산 실수' },
  { value: 'concept', label: '개념 부족' },
  { value: 'comprehension', label: '문제 이해 부족' },
  { value: 'persistence', label: '끈기 부족' },
]
