# NanoBanana Love - 설치 및 실행 가이드

## 요구사항

- Node.js 18+
- npm
- Google Gemini API 키

## 설치

```bash
git clone https://github.com/kjs369369/8-SHOT-AI--Nano-Banana-Love--AI-Image-Generator.git
cd 8-SHOT-AI--Nano-Banana-Love--AI-Image-Generator
npm install
```

## 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## API 키 설정

### 방법 1: 브라우저에서 직접 입력 (권장)

앱 실행 시 API 키 입력 모달이 자동으로 표시됩니다.

1. [Google AI Studio](https://aistudio.google.com/apikey)에서 API 키 발급
2. 모달에 API 키 입력
3. 플랜 선택:
   - **무료 플랜**: `gemini-2.0-flash` 모델 사용 (이미지 품질 보통)
   - **유료 플랜**: `gemini-2.5-flash-image` 모델 사용 (고품질, ~$0.04/장)
4. "시작하기" 클릭

API 키는 브라우저 localStorage에만 저장되며 외부로 전송되지 않습니다.

### 방법 2: 환경변수 (.env)

프로젝트 루트에 `.env` 파일 생성:

```
GEMINI_API_KEY=your-api-key-here
```

> 참고: 환경변수 방식은 로컬 개발 전용입니다. 배포 시에는 브라우저 입력 방식을 사용하세요.

## 빌드

```bash
npm run build
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

## 배포

Vercel, Cloudflare Pages, Netlify 등에 `dist/` 폴더를 배포할 수 있습니다.

### Vercel 배포 예시

```bash
npm i -g vercel
vercel --prod
```

## GenSpark AI 개발자 모드에서 이어서 작업하기

1. [genspark.ai](https://www.genspark.ai/) 접속 후 로그인
2. 사이드바에서 **AI Developer** 클릭
3. **기존 GitHub 프로젝트 선택** → GitHub 계정 인증
4. `8-SHOT-AI--Nano-Banana-Love--AI-Image-Generator` 저장소 선택
5. 자연어 프롬프트로 수정 요청

### 프롬프트 예시

```
이미지 생성 결과에 SNS 공유 버튼을 추가해줘
```

```
스타일 선택 옵션을 추가해서 수채화, 유화, 애니메이션 스타일도 지원해줘
```
