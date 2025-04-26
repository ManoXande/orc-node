@echo off
chcp 65001 > nul

echo ===============================
echo Iniciando Gerador de Propostas
echo ===============================

:: Encerrar processos Node.js anteriores
taskkill /f /im node.exe > nul 2>&1
timeout /t 1 /nobreak > nul

:: Iniciar servidor backend
echo.
echo Iniciando servidor (porta 5000)...
start "Backend" cmd /k "cd server && npx nodemon --exec ts-node src/index.ts"

:: Pequena pausa para o servidor iniciar
timeout /t 2 /nobreak > nul

:: Iniciar cliente frontend
echo Iniciando cliente (porta 5173)...
start "Frontend" cmd /k "cd client && npm run dev"

:: Pequena pausa para o cliente iniciar
timeout /t 2 /nobreak > nul

:: Abrir navegador
echo Abrindo navegador...
start http://localhost:5173

echo.
echo ===============================
echo Aplicação iniciada!
echo - http://localhost:5173
echo.
echo Para encerrar: feche as janelas
echo ou pressione qualquer tecla
echo ===============================

pause > nul

:: Encerrar ao sair
taskkill /f /im node.exe > nul 2>&1 