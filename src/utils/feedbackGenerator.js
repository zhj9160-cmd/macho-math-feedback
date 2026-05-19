/**
 * @file 템플릿 기반 학부모 피드백 자동 생성기
 * 정현정 교수의 25년 교육 노하우를 반영한 학교급별(초등/중등) 맞춤 피드백
 */

/**
 * 이름 마지막 글자에 받침이 있으면 '이'를 붙여 자연스러운 호칭 반환 (초등용)
 * 예: 신재경 → 신재경이, 민지 → 민지
 * @param {string} name
 * @returns {string}
 */
function callName(name) {
  const code = name.charCodeAt(name.length - 1)
  if (code < 0xAC00 || code > 0xD7A3) return name
  return (code - 0xAC00) % 28 !== 0 ? `${name}이` : name
}

/**
 * 마지막 글자 받침 여부로 한국어 조사를 자동 선택
 * @param {string} word
 * @param {string} consonant 받침 있을 때 (예: '과', '이', '을')
 * @param {string} vowel 받침 없을 때 (예: '와', '가', '를')
 * @returns {string}
 */
function josa(word, consonant, vowel) {
  const code = word.charCodeAt(word.length - 1)
  if (code < 0xAC00 || code > 0xD7A3) return consonant
  return (code - 0xAC00) % 28 !== 0 ? consonant : vowel
}

/**
 * 단원평가 점수를 학교급에 맞는 해설 문구로 변환
 * 초등 80이상: 안심, 70미만: 동행. 중등 80이상: 내신 안정권, 70미만: 심화 보완
 * @param {number} score
 * @param {'elementary'|'middle'} schoolLevel
 * @returns {string}
 */
export function interpretScore(score, schoolLevel) {
  if (schoolLevel === 'elementary') {
    if (score >= 80) return '충분히 잘 이해하고 있어요'
    if (score < 70) return '조금 더 함께 다져나가면 좋겠어요'
    return '꾸준히 발전하고 있어요'
  }
  if (score >= 80) return '내신 관점에서 안정권에 있습니다'
  if (score < 70) return '심화 보완이 필요한 단원입니다'
  return '조금 더 다지면 안정권에 들어올 것입니다'
}

/**
 * 학습 데이터를 분석해 강점 3가지 반환
 * 조건 미달 시 학교급별 격려 문구로 채워 반드시 3개 반환
 * @param {import('../data/schema').MonthlyFeedback} feedback
 * @param {'elementary'|'middle'} schoolLevel
 * @returns {string[]}
 */
export function analyzeStrengths(feedback, schoolLevel) {
  const score = parseInt(feedback.testScore) || 0
  const isMiddle = schoolLevel === 'middle'
  const found = []

  if (feedback.attendance >= 90) found.push('성실한 출석')
  if (feedback.homework >= 85)   found.push('꾸준한 과제 수행')
  if (score >= 85)               found.push('안정적인 학업 성취')
  if (feedback.focus >= 4) {
    found.push(isMiddle ? '뛰어난 수업 집중력' : '스스로 집중하는 힘')
  }
  if (feedback.attitude >= 4) {
    found.push(isMiddle ? '모범적인 수업 태도' : '끈기 있는 자세')
  }

  const fillers = isMiddle
    ? ['자기주도학습 의지', '꾸준히 노력하는 자세', '안정적인 내신 관리 의지']
    : ['꾸준히 노력하는 자세', '스스로 푸는 힘', '성실한 학습 태도']

  for (const f of fillers) {
    if (found.length >= 3) break
    if (!found.includes(f)) found.push(f)
  }

  return found.slice(0, 3)
}

/**
 * 학습 데이터를 분석해 보완점 2가지를 성장 관점으로 반환
 * 부정 표현 금지: 초등은 동행·과정, 중등은 내신·전략 언어 사용
 * @param {import('../data/schema').MonthlyFeedback} feedback
 * @param {'elementary'|'middle'} schoolLevel
 * @returns {string[]}
 */
export function analyzeWeaknesses(feedback, schoolLevel) {
  const score = parseInt(feedback.testScore) || 0
  const { homework, errorTypes = [] } = feedback
  const isMiddle = schoolLevel === 'middle'
  const weaknesses = []

  const errorMap = {
    calculation: {
      elementary: '계산 과정을 한 번 더 점검하는 습관을 기르는 중이에요',
      middle: '계산 정확성 강화가 필요합니다',
    },
    concept: {
      elementary: '기본 개념을 한 번 더 다지면 훨씬 좋아질 거예요',
      middle: '심화 개념 정리가 필요합니다',
    },
    comprehension: {
      elementary: '문제 핵심 파악 연습을 함께 차근차근 해나가고 있어요',
      middle: '문제 핵심 파악 연습이 필요합니다',
    },
    persistence: {
      elementary: '끝까지 풀어보는 습관을 함께 만들어가는 중이에요',
      middle: '고난도 문제 도전이 필요합니다',
    },
  }

  for (const type of errorTypes) {
    if (weaknesses.length >= 2) break
    if (errorMap[type]) weaknesses.push(errorMap[type][schoolLevel])
  }

  if (weaknesses.length < 2 && score > 0 && score < 80) {
    weaknesses.push(
      isMiddle
        ? '내신 안정권을 위해 단원 개념 보완이 필요합니다'
        : '아직 단원 내용을 익히는 중이에요, 함께 차근차근 다져나가요'
    )
  }
  if (weaknesses.length < 2 && homework < 75) {
    weaknesses.push(
      isMiddle
        ? '과제 완성도를 높이면 내신 관리에 도움이 됩니다'
        : '숙제를 꾸준히 하는 습관을 함께 만들어가요'
    )
  }

  const fillers = isMiddle
    ? ['심화 단계로 나아가기 위한 응용력 강화가 필요합니다', '꾸준한 기출문제 훈련이 도움이 됩니다']
    : ['다양한 문제 유형에 도전하는 연습이 도움이 될 거예요', '풀이 과정을 한 줄씩 써보는 습관이 실력을 키워줘요']

  for (const f of fillers) {
    if (weaknesses.length >= 2) break
    weaknesses.push(f)
  }

  return weaknesses
}

/**
 * 다음 달 목표 3가지 생성
 * 초등: 학습 습관 형성 중심 / 중등: 내신·전략 중심
 * errorTypes가 있으면 해당 항목을 우선 배치
 * @param {import('../data/schema').MonthlyFeedback} feedback
 * @param {'elementary'|'middle'} schoolLevel
 * @returns {string[]}
 */
export function generateNextGoals(feedback, schoolLevel) {
  const { errorTypes = [] } = feedback
  const isMiddle = schoolLevel === 'middle'

  const errorSpecific = isMiddle
    ? {
      calculation:    '계산 속도와 정확성 동시 훈련',
      concept:        '핵심 개념 정리 노트 주 2회 복습',
      comprehension:  '문제 분석 후 풀이 전략 먼저 세우기',
      persistence:    '고난도 문제 매일 1문제 도전',
    }
    : {
      calculation:    '계산 과정 한 줄씩 쓰는 습관 만들기',
      concept:        '교과서 개념 소리 내어 읽기',
      comprehension:  '문제 읽기 전 조건 먼저 찾기',
      persistence:    '포기하지 않고 끝까지 도전하기',
    }

  const defaults = isMiddle
    ? ['오답유형 분류 노트 작성', '기출문제 주 3회 풀이', '단원 개념 백지 복습', '서술형 풀이 과정 단계별 정리']
    : ['오답노트 주 1회 작성', '수업 시작 5분 전 자리에 앉기', '문제 끝까지 풀어보기', '풀이 과정 두 줄 더 쓰기']

  const goals = []

  for (const type of errorTypes) {
    if (goals.length >= 2) break
    if (errorSpecific[type]) goals.push(errorSpecific[type])
  }

  for (const g of defaults) {
    if (goals.length >= 3) break
    if (!goals.includes(g)) goals.push(g)
  }

  return goals.slice(0, 3)
}

/**
 * 학부모용 월간 피드백 메시지 생성 (300~400자)
 * 정현정 교수 톤: 따뜻함 + 사실 + 격려 + 다음 달 약속
 * 초등: 정서적 격려 60% + 사실 30% + 약속 10%
 * 중등: 사실 50% + 격려 30% + 학습 전략 20%
 * @param {import('../data/schema').Student} student
 * @param {import('../data/schema').MonthlyFeedback} feedback
 * @param {{ teacherShortName?: string, teacherFullName?: string }} settings - 강사 이름 설정
 * @returns {string}
 */
export function generateParentMessage(student, feedback, settings = {}) {
  const { name, schoolLevel } = student
  const teacherShortName = settings.teacherShortName || '마초샘'
  const teacherFullName  = settings.teacherFullName  || '마초샘 정현정'
  const hasScore = feedback.testScore !== '' && feedback.testScore != null
  const score = parseInt(feedback.testScore) || 0

  const strengths = analyzeStrengths(feedback, schoolLevel)
  const weaknesses = analyzeWeaknesses(feedback, schoolLevel)
  const goals = generateNextGoals(feedback, schoolLevel)
  const goalsText = goals.map((g, i) => `${i + 1}. ${g}`).join('\n')

  if (schoolLevel === 'elementary') {
    const cn = callName(name)

    let dataLine = `이번 달 ${cn}가 정말 열심히 해주었어요.`
    if (hasScore) {
      dataLine += ` 단원평가는 ${score}점으로, ${interpretScore(score, 'elementary')}.`
    }
    if (feedback.attendance >= 90) {
      dataLine += ` 출석률 ${feedback.attendance}%로 성실하게 참여해주었습니다.`
    }

    return [
      `안녕하세요, ${name} 학부모님. ${teacherShortName}입니다.`,
      '',
      dataLine,
      '',
      `특히 ${strengths[0]}${josa(strengths[0], '과', '와')} ${strengths[1]}${josa(strengths[1], '이', '가')} 이번 달 가장 빛났어요. 어머님, ${cn}${josa(cn, '과', '와')} 함께 한 걸음씩 나아가고 있으니 믿어주세요.`,
      '',
      `앞으로는 ${weaknesses[0]}.`,
      '',
      '다음 달 함께할 목표입니다:',
      goalsText,
      '',
      `다음 달에도 ${cn}의 성장을 함께 응원하겠습니다 — ${teacherFullName} 드림`,
    ].join('\n')
  }

  // 중등
  let dataLine = `${name} 학생의 이번 달 학습 현황을 보고드립니다.`
  if (hasScore) {
    dataLine += ` 단원평가 ${score}점으로, ${interpretScore(score, 'middle')}.`
  }
  if (feedback.attendance < 90) {
    dataLine += ` 출석률은 ${feedback.attendance}%입니다.`
  }

  return [
    `안녕하세요, ${name} 학부모님. ${teacherShortName}입니다.`,
    '',
    dataLine,
    '',
    `이번 달 ${name} 학생의 강점으로는 ${strengths[0]}${josa(strengths[0], '과', '와')} ${strengths[1]}${josa(strengths[1], '을', '를')} 꼽을 수 있습니다.`,
    '',
    `보완 측면에서는 ${weaknesses[0]}.`,
    '',
    '다음 달 학습 전략입니다:',
    goalsText,
    '',
    `다음 달에도 ${name} 학생의 안정적인 성장을 함께 만들어가겠습니다 — ${teacherFullName} 드림`,
  ].join('\n')
}
