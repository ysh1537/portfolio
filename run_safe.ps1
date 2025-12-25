# 1. Node.js Path 설정
$env:PATH = "C:\Users\yesol\.gemini\tools\node22\node-v22.12.0-win-x64;" + $env:PATH

# 2. 가상 드라이브 Z: 매핑 (한글 경로 우회)
$originalPath = "g:\다른 컴퓨터\내 컴퓨터\test\portfolio"
if (Test-Path Z:) { subst Z: /D }
subst Z: $originalPath

# 3. Z: 드라이브로 이동
Set-Location Z:

# 4. API Key 직접 주입 (환경 변수 로딩 에러 방지)
$env:VITE_GEMINI_API_KEY = "AIzaSyAcfKsmxuH13-kohpFVfQb-VIrwdER8Gf8"
$env:VITE_SANITY_PROJECT_ID = "8s8dcy9g"
$env:VITE_SANITY_DATASET = "production"

Write-Host "🚀 Starting Portfolio Server on Z: Drive..."
Write-Host "✅ Path Simplified: $(Get-Location)"
Write-Host "✅ API Key Injected."

# 5. 서버 실행 (호스트 개방)
npm run dev -- --host
