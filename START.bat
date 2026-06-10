@echo off
echo.
echo  BuySide CRM — starting server...
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo  ERROR: Node.js is not installed.
  echo  Download it from https://nodejs.org  (choose the LTS version)
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo  First run — installing dependencies...
  npm install
  echo.
)

node server.js
pause
