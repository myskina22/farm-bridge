@echo off
title FarmBridge - Starting Platform
echo ========================================================
echo   Starting FarmBridge Platform...
echo ========================================================
echo.
echo Opening your web browser to http://localhost:5173 ...
start http://localhost:5173
echo.
echo Starting the development server...
echo (Keep this black window open while using FarmBridge)
echo.
call npm run dev
pause
