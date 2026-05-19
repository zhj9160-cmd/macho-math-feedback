import { getMonthName } from './dateUtils'

export function initKakao() {
  if (!window.Kakao) {
    console.warn('[KakaoShare] Kakao SDK가 아직 로드되지 않았습니다.')
    return false
  }
  if (window.Kakao.isInitialized()) return true

  const key = import.meta.env.VITE_KAKAO_JS_KEY
  if (!key || key.startsWith('YOUR_')) {
    console.warn('[KakaoShare] VITE_KAKAO_JS_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.')
    return false
  }

  try {
    window.Kakao.init(key)
    console.log('[KakaoShare] 카카오 SDK 초기화 성공')
    return true
  } catch (err) {
    console.error('[KakaoShare] 카카오 SDK 초기화 실패:', err)
    return false
  }
}

/**
 * @param {{
 *   student: import('../data/schema').Student,
 *   feedback: { yearMonth: string },
 *   settings: { academyName?: string },
 *   message: string,
 * }} params
 */
export function shareFeedbackToKakao({ student, feedback, settings, message }) {
  if (!window.Kakao) {
    alert('카카오 SDK 로딩 중입니다. 잠시 후 다시 시도해주세요.')
    return
  }

  if (!initKakao()) {
    alert('카카오 공유 기능을 사용하려면 .env 파일에 VITE_KAKAO_JS_KEY를 설정해주세요.')
    return
  }

  const academyName = settings?.academyName ?? '마초수학'
  const monthName = getMonthName(feedback.yearMonth)
  const title = `${student.name} 학생 ${monthName} ${academyName} 성장 리포트`
  const description = message.slice(0, 100).trim() + '...'
  const imageUrl = `https://placehold.co/800x400/1B365D/C9A961/png?text=${encodeURIComponent(academyName + ' ' + monthName + ' 리포트')}`

  try {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title,
        description,
        imageUrl,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: '전체 리포트 보기',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
      installTalk: true,
    })
  } catch (err) {
    console.error('[KakaoShare] 공유 실패:', err)
    alert('카카오톡 공유에 실패했습니다. 카카오톡이 설치되어 있는지 확인해주세요.')
  }
}
