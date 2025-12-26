---
description: Deploy to Live Server (heoyesol.kr)
---

# Live Server Deployment Workflow

이 워크플로우는 로컬 변경 사항을 빌드하고 GitHub에 푸시하여 라이브 서버(`heoyesol.kr`)를 업데이트하는 과정을 설명합니다.
`heoyesol.kr` 도메인은 `ysh1537/portfolio` GitHub Pages와 연결되어 있습니다.

## Prerequisites

- 로컬 변경 사항이 저장되어 있어야 합니다.
- `d:\test\portfolio` 디렉토리에서 실행합니다.

## Steps

1. **Build Project**
   - 최신 소스 코드를 프로덕션용으로 빌드합니다.
   - `docs/` 폴더에 결과물이 생성됩니다.
   - 이 과정에서 `generate-history` 스크립트가 실행되어 패치노트가 자동 갱신됩니다.

   ```powershell
   npm run build
   ```

2. **Commit Changes**
   - 빌드된 파일(`docs/*`)과 소스 코드를 Git에 스테이징합니다.
   - 커밋 메시지는 한글로 작성하는 것을 권장합니다 (예: "✨ 기능 구현: 허브 UI 개선").

   ```powershell
   git add .
   git commit -m "배포: [업데이트 내용 요약]"
   ```

3. **Push to Remote**
   - GitHub 저장소(`origin main`)로 푸시합니다.
   - 푸시 후 약 1~2분 내에 GitHub Actions/Pages가 자동으로 `heoyesol.kr`에 반영합니다.

   ```powershell
   git push
   ```

## Verification

- 브라우저에서 `https://heoyesol.kr` 접속 후 변경 사항 확인.
- (옵션) 캐시 문제로 변경이 안 보일 경우 `Ctrl + F5` (강제 새로고침).
