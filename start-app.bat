@echo off
echo ==============================================
echo Iniciando o Gerador de Propostas Autha
echo ==============================================

:: Definir encoding para UTF-8
chcp 65001 > nul

:: Verificar se o Node.js está instalado
where node > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js não encontrado. Por favor, instale o Node.js para continuar.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado.

:: Verificar se as portas necessárias estão disponíveis
echo Verificando portas em uso...
netstat -ano | findstr ":5000" > nul
if %ERRORLEVEL% EQU 0 (
    echo [AVISO] Porta 5000 em uso. Tentando liberar...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000"') do (
        taskkill /F /PID %%a > nul 2>&1
    )
)

netstat -ano | findstr ":5173" > nul
if %ERRORLEVEL% EQU 0 (
    echo [AVISO] Porta 5173 em uso. Tentando liberar...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173"') do (
        taskkill /F /PID %%a > nul 2>&1
    )
)

:: Garantir que as dependências estão instaladas em ambos projetos
echo Verificando dependências do servidor...
cd server
echo Instalando dependências do servidor...
call npm install

:: Garantir que nodemon e puppeteer estão disponíveis para o servidor
echo Instalando nodemon e puppeteer localmente no servidor...
call npm install --save-dev nodemon ts-node
call npm install puppeteer

:: Verificar se o Chromium foi instalado corretamente
echo Verificando instalação do Chromium...
if not exist "node_modules\puppeteer\.local-chromium" (
    echo [AVISO] Chromium não encontrado. Reinstalando Puppeteer...
    call npm uninstall puppeteer
    call npm install puppeteer
)

cd ..

:: Verificar dependências do cliente e instalar pacotes específicos
echo Verificando dependências do cliente...
cd client
echo Instalando dependências do cliente...
call npm install

:: Instalar bibliotecas específicas no cliente
echo Instalando bibliotecas React necessárias...
call npm install react-router-dom axios react-hook-form react-toastify

:: Limpar cache do Vite
echo Limpando cache do Vite...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
)

cd ..

:: Encerrar qualquer processo Node.js existente
echo Encerrando processos Node.js anteriores...
taskkill /f /im node.exe > nul 2>&1

:: Aguardar para garantir que os processos foram encerrados
timeout /t 3 /nobreak > nul

:: Iniciar o servidor backend em uma nova janela
echo.
echo Iniciando o servidor backend na porta 5000...
start "Servidor Backend Autha" cmd /k "cd server && npx nodemon --exec ts-node index.ts"

:: Aguardar o servidor iniciar (aumentado para 12 segundos)
echo Aguardando o servidor backend iniciar (12 segundos)...
timeout /t 12 /nobreak > nul

:: Verificar se o servidor está respondendo
curl -s http://localhost:5000/api/company-info > nul
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] Servidor backend pode não estar respondendo. Continuando mesmo assim...
)

:: Iniciar o cliente em uma nova janela
echo.
echo Iniciando o cliente frontend na porta 5173...
start "Cliente Frontend Autha" cmd /k "cd client && npm run dev"

:: Aguardar o cliente iniciar (aumentado para 15 segundos)
echo Aguardando o cliente frontend iniciar (15 segundos)...
timeout /t 15 /nobreak > nul

:: Abrir o navegador
echo.
echo Abrindo o navegador...
start http://localhost:5173

echo ==============================================
echo Aplicação iniciada!
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:5173
echo ==============================================
echo.
echo Logs do servidor:
echo - Verifique a janela "Servidor Backend Autha"
echo.
echo Logs do cliente:
echo - Verifique a janela "Cliente Frontend Autha"
echo ==============================================
echo Para encerrar os servidores, feche as janelas de comando ou use Ctrl+C
echo.

:: Manter a janela aberta para acompanhamento
echo Pressione qualquer tecla para encerrar todos os processos e sair...
pause

:: Ao encerrar, matar os processos das aplicações Node
echo Encerrando todos os processos...
taskkill /f /im node.exe > nul 2>&1
timeout /t 2 /nobreak > nul

echo Todos os processos encerrados.
exit /b 0 