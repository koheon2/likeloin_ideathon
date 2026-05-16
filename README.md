# 대나무의숲 — 웹 버전

대학생과 교수의 어색한 거리를 AI로 부드럽게 만드는 캠퍼스 소통 서비스의 웹 프론트엔드 목업.

## 실행
```bash
npx serve .
# 또는
python3 -m http.server 8000
```
브라우저에서 `localhost:8000` 접속.

## Vercel 배포
1. 이 폴더를 zip으로 압축
2. https://vercel.com/new 에 드래그
3. Framework Preset → **Other**, 나머지 비워두고 **Deploy**

또는 CLI:
```bash
npx vercel
```

## 화면 (사이드바)
- 홈 · 시간표
- 수업방 (1:1 익명 채팅)
- 교수 캐릭터 (호감도 키우기)
- 질문하기 (AI 말투 변환)
- 이미 나온 질문 (FAQ)
- 내 마이페이지
- 교수 뷰 대시보드

## Tweaks
우측 하단 토글로 컬러 팔레트(4종) · 캐릭터 스타일 전환.
