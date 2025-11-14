@echo off
echo Starting ChemLab Analytics Pro...
echo.

echo [1/2] Starting Django Backend...
cd backend
start /B python manage.py runserver
timeout /t 3 /nobreak > nul

echo [2/2] Starting React Frontend...
cd ..\frontend_web
start npm start

echo.
echo ✅ All services started!
echo 🌐 Backend: http://127.0.0.1:8000
echo 🚀 Frontend: http://localhost:3000
echo.
echo 📄 PDF Report: Upload CSV → Click "Generate Report" button
pause