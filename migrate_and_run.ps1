# 1. 환경 설정
$env:PATH = "C:\Users\yesol\.gemini\tools\node22\node-v22.12.0-win-x64;" + $env:PATH
$sourceDir = "g:\다른 컴퓨터\내 컴퓨터\test\portfolio"
$destDir = "C:\Portfolio_Clean"

Write-Host "🚀 Migration Protocol Initiated..."

# 2. 목적지 초기화 (있으면 삭제 후 재생성)
# if (Test-Path $destDir) { Remove-Item -Recurse -Force $destDir }
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Force -Path $destDir | Out-Null }

# 3. 파일 복사 (Robocopy 활용, node_modules 제외)
Write-Host "📦 Copying Project Files..."
$robocopyParams = @($sourceDir, $destDir, "/E", "/XD", "node_modules", ".git", "dist", ".agent", "/R:1", "/W:1")
& robocopy $robocopyParams
if ($LASTEXITCODE -ge 8) { Write-Error "Robocopy failed with exit code $LASTEXITCODE"; exit 1 }

# 4. 의존성 설치 및 실행
Set-Location $destDir
Write-Host "📂 Moved to: $(Get-Location)"

Write-Host "⬇️ Installing Dependencies (This may take a moment)..."
npm install --legacy-peer-deps

Write-Host "✅ Setup Complete. Starting Server..."
# API Key 환경변수 강제 주입
$env:VITE_GEMINI_API_KEY = "AIzaSyAcfKsmxuH13-kohpFVfQb-VIrwdER8Gf8"

npm run dev -- --host
