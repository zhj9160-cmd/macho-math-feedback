const STUDENTS_KEY = 'macho-students'
const FEEDBACKS_KEY = 'macho-feedbacks'

/** @returns {import('../data/schema').Student[]} */
function readStudents() {
  try {
    const raw = localStorage.getItem(STUDENTS_KEY)
    const data = raw ? JSON.parse(raw) : []
    // 구버전 호환: schoolLevel 없는 레코드는 'elementary'로 보정
    return data.map((s) => ({ schoolLevel: 'elementary', ...s }))
  } catch {
    return []
  }
}

/** @param {import('../data/schema').Student[]} students */
function writeStudents(students) {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students))
}

/** @returns {import('../data/schema').MonthlyFeedback[]} */
function readFeedbacks() {
  try {
    const raw = localStorage.getItem(FEEDBACKS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/** @param {import('../data/schema').MonthlyFeedback[]} feedbacks */
function writeFeedbacks(feedbacks) {
  localStorage.setItem(FEEDBACKS_KEY, JSON.stringify(feedbacks))
}

// ─── 학생 CRUD ────────────────────────────────────────────────

/** @returns {import('../data/schema').Student[]} */
export function getStudents() {
  return readStudents()
}

/**
 * @param {Omit<import('../data/schema').Student, 'id'|'createdAt'>} data
 * @returns {import('../data/schema').Student}
 */
export function addStudent(data) {
  const students = readStudents()
  const newStudent = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  writeStudents([...students, newStudent])
  return newStudent
}

/**
 * @param {string} id
 * @param {Partial<import('../data/schema').Student>} updates
 * @returns {import('../data/schema').Student|null}
 */
export function updateStudent(id, updates) {
  const students = readStudents()
  const index = students.findIndex((s) => s.id === id)
  if (index === -1) return null
  students[index] = { ...students[index], ...updates }
  writeStudents(students)
  return students[index]
}

/**
 * @param {string} id
 * @returns {boolean}
 */
export function deleteStudent(id) {
  const students = readStudents()
  const filtered = students.filter((s) => s.id !== id)
  if (filtered.length === students.length) return false
  writeStudents(filtered)
  // 해당 학생의 피드백도 함께 삭제
  const feedbacks = readFeedbacks()
  writeFeedbacks(feedbacks.filter((f) => f.studentId !== id))
  return true
}

// ─── 피드백 CRUD ─────────────────────────────────────────────

/**
 * @param {string} studentId
 * @returns {import('../data/schema').MonthlyFeedback[]}
 */
export function getFeedbacks(studentId) {
  return readFeedbacks().filter((f) => f.studentId === studentId)
}

/**
 * @param {string} id
 * @returns {import('../data/schema').MonthlyFeedback|undefined}
 */
export function getFeedback(id) {
  return readFeedbacks().find((f) => f.id === id)
}

/**
 * @param {Omit<import('../data/schema').MonthlyFeedback, 'id'|'createdAt'>} data
 * @returns {import('../data/schema').MonthlyFeedback}
 */
export function addFeedback(data) {
  const feedbacks = readFeedbacks()
  const newFeedback = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  writeFeedbacks([...feedbacks, newFeedback])
  return newFeedback
}

/**
 * @param {string} id
 * @param {Partial<import('../data/schema').MonthlyFeedback>} updates
 * @returns {import('../data/schema').MonthlyFeedback|null}
 */
export function updateFeedback(id, updates) {
  const feedbacks = readFeedbacks()
  const index = feedbacks.findIndex((f) => f.id === id)
  if (index === -1) return null
  feedbacks[index] = { ...feedbacks[index], ...updates }
  writeFeedbacks(feedbacks)
  return feedbacks[index]
}

/**
 * @param {string} id
 * @returns {boolean}
 */
export function deleteFeedback(id) {
  const feedbacks = readFeedbacks()
  const filtered = feedbacks.filter((f) => f.id !== id)
  if (filtered.length === feedbacks.length) return false
  writeFeedbacks(filtered)
  return true
}

/**
 * @param {string} studentId
 * @returns {import('../data/schema').MonthlyFeedback[]}
 */
export function getFeedbacksByStudent(studentId) {
  return readFeedbacks()
    .filter((f) => f.studentId === studentId)
    .sort((a, b) => b.yearMonth.localeCompare(a.yearMonth))
}

/**
 * @param {string} studentId
 * @returns {import('../data/schema').MonthlyFeedback|null}
 */
export function getLatestFeedback(studentId) {
  return getFeedbacksByStudent(studentId)[0] ?? null
}
