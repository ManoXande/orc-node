@echo off
chcp 65001 > nul

echo ================================
echo Configuração Inicial do Projeto
echo ================================

:: Verificar Node.js
where node > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js não encontrado!
    echo Instale Node.js e tente novamente
    pause
    exit /b 1
)

:: Instalar dependências do servidor
echo.
echo Instalando dependências do servidor...
cd server
call npm install
call npm install --save-dev nodemon ts-node
call npm install puppeteer
cd ..

:: Instalar dependências do cliente
echo.
echo Instalando dependências do cliente...
cd client
call npm install
call npm install react-router-dom axios react-hook-form react-toastify
cd ..

echo.
echo ================================
echo Configuração concluída!
echo.
echo Execute start-app.bat para 
echo iniciar a aplicação
echo ================================
pause 