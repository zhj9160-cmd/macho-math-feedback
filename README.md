# 🧮 마초수학 월간 피드백 시스템

> by 마초샘 정현정 (국민AI리터러시 교육자)

매월 학생별 수학 학습 현황을 기록하고, 학교급(초등/중등)별 맞춤 학부모 메시지를 자동 생성하는 웹앱입니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 📋 학생 관리 | 초등/중등 학생 등록·수정·삭제, 학교급별 필터 |
| ✍️ 자동 피드백 생성 | 학습 데이터 입력 → 학교급별 맞춤 학부모 메시지 자동 생성 |
| 💬 카카오톡 공유 | 생성된 피드백을 카카오톡으로 바로 공유 |
| 📊 레이더 차트 | 집중도·태도·이해도·꾸준함·성장도 5각형 시각화 |
| 📚 피드백 히스토리 | 월별 피드백 기록 열람 및 관리 |
| ⚙️ 학원 정보 설정 | 학원명·강사명·이모지 커스터마이징 |

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| 프레임워크 | React 19 + Vite |
| 스타일 | Tailwind CSS v3 |
| 차트 | Recharts |
| 아이콘 | Lucide React |
| 공유 | Kakao SDK 2.7.4 |
| 저장소 | localStorage (백엔드 없음) |

## 브랜드 컬러

| 이름 | HEX |
|------|-----|
| Navy | `#1B365D` |
| Light Blue | `#A8C5E2` |
| Ivory | `#FAF7F0` |
| Gold | `#C9A961` |
| Charcoal | `#2C2C2C` |

---

## 로컬 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정 (아래 환경변수 섹션 참고)
cp .env.example .env

# 3. 개발 서버 실행
npm run dev
# → http://localhost:5173 에서 확인

# 4. 프로덕션 빌드
npm run build

# 5. 빌드 결과물 미리보기
npm run preview
```

---

## 환경변수 설정

`.env` 파일에 카카오 JavaScript 키를 입력합니다:

```env
VITE_KAKAO_JS_KEY=your_kakao_javascript_key_here
```

> 키 미설정 상태에서도 앱은 정상 작동합니다. 카톡 공유 버튼 클릭 시에만 설정 안내가 표시됩니다.

### 카카오 JavaScript 키 발급

1. [Kakao Developers](https://developers.kakao.com) 접속 후 로그인
2. **내 애플리케이션** > **애플리케이션 추가**
3. [앱 설정] > [플랫폼] > **Web** 플랫폼 추가 — 사이트 도메인 등록:
   - 로컬: `http://localhost:5173`
   - 배포: 실제 Vercel 도메인
4. [앱 키] 메뉴에서 **JavaScript 키** 복사
5. `.env` 파일의 값을 복사한 키로 교체 후 `npm run dev` 재시작

---

## Vercel 배포

1. [Vercel](https://vercel.com)에 GitHub 계정으로 로그인
2. **New Project** > 이 저장소(`macho-math-feedback`) 선택
3. Framework Preset: **Vite** 자동 감지 확인
4. **Environment Variables** 섹션에서 추가:
   - Key: `VITE_KAKAO_JS_KEY` / Value: 카카오 JavaScript 키
5. **Deploy** 클릭
6. 배포 완료 후 Vercel 도메인을 카카오 개발자 콘솔 Web 플랫폼에 추가

---

## 폴더 구조

```
src/
├── components/   # 재사용 UI 컴포넌트
├── hooks/        # 커스텀 React 훅
├── utils/        # 유틸리티 함수
├── data/         # 초기 데이터 및 상수
├── App.jsx       # 루트 컴포넌트
└── main.jsx      # 엔트리 포인트
```
