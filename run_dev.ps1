# FinSight AI Full-Stack Launcher
Write-Host "🏛️ Starting FinSight AI Development Stack..." -ForegroundColor Cyan

# 1. Start FastAPI Backend in new window
Write-Host "→ Launching FastAPI Backend (:8001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/backend'; python -m uvicorn app.main:app --reload --port 8001"

# 2. Start Next.js Frontend in new window
Write-Host "→ Launching Next.js 14 Frontend (:3001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/frontend'; npm run dev -- -p 3001"

Write-Host "🚀 Stack initialized!" -ForegroundColor Green
Write-Host "  • Frontend: http://localhost:3001"
Write-Host "  • Backend API: http://localhost:8001"
Write-Host "  • API Docs: http://localhost:8001/docs"
