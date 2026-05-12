# 대나무의숲 — 캠퍼스 AI 소통 서비스 프로토타입

교수와 학생 사이의 어색한 공기를 AI로 부드럽게 바꾸는 수업 소통 서비스의 프론트엔드 목업입니다.

## 로컬에서 보기
정적 파일이므로 아무 정적 서버로 열면 됩니다.
```bash
npx serve .
# 또는
python3 -m http.server 8000
```

## Vercel 배포

### GitHub 연동 배포
1. [vercel.com/new](https://vercel.com/new)에서 `koheon2/likeloin_ideathon` 저장소를 Import
2. Framework Preset → **Other**
3. Root Directory → `./`
4. Build Command → 비워둠
5. Output Directory → 비워둠
6. Install Command → 비워둠
7. **Deploy**

이 프로젝트는 빌드 단계가 없는 정적 앱입니다. Vercel은 루트의 `index.html`을 진입점으로 배포합니다.

### 방법 1: 드래그 앤 드롭 (가장 쉬움)
1. 이 폴더를 zip으로 압축
2. [vercel.com/new](https://vercel.com/new) 접속
3. 압축 파일을 드래그
4. Framework Preset → **Other** 선택, 나머지 설정은 비워두고 **Deploy**

### 방법 2: CLI
```bash
npm i -g vercel
vercel
```

진입 파일은 `index.html`로 정리되어 있어 루트 URL에서 바로 실행됩니다.

## 구조
- `index.html` — 진입점
- `app.jsx` — 라우터 + Tweaks
- `shell.jsx` — 사이드바/탑바
- `character.jsx` — 동물 캐릭터 자리표시자
- `data.jsx` — 가상 시간표/대화/뱃지 데이터
- `screens/` — 7개 화면 (home, chat, profile, ask, faq, mypage, professor)
- `styles.css` — 디자인 시스템

## 주의
브라우저에서 Babel이 JSX를 직접 변환하므로 첫 로딩이 1–2초 걸립니다. 운영 배포 시에는 Vite 등으로 프리컴파일하면 빨라집니다.
