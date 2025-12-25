$env:PATH = "C:\Users\yesol\.gemini\tools\node22\node-v22.12.0-win-x64;" + $env:PATH
Write-Host "Path set. Node version:"
node --version
Write-Host "Starting Dev Server..."
npm run dev
