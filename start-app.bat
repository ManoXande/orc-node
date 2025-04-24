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

:: Garantir que as dependências estão instaladas em ambos projetos
echo Verificando dependências do servidor...
cd server
echo Instalando dependências do servidor...
call npm install

:: Garantir que nodemon está disponível para o servidor
echo Instalando nodemon localmente no servidor...
call npm install --save-dev nodemon ts-node

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
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
)

cd ..

:: Encerrar qualquer processo usando a porta 5000
echo Verificando se as portas estão disponíveis...
set "errorlevel_backup=%errorlevel%"
taskkill /f /im node.exe 2>nul
set "errorlevel=%errorlevel_backup%"

:: Aguardar um pouco para garantir que os processos foram encerrados
timeout /t 2 /nobreak > nul

:: Iniciar o servidor backend em uma nova janela
echo.
echo Iniciando o servidor backend na porta 5000...
start "Servidor Backend Autha" cmd /k "cd server && npx nodemon --exec ts-node index.ts"

:: Aguardar o servidor iniciar
echo Aguardando o servidor backend iniciar (8 segundos)...
timeout /t 8 /nobreak > nul

:: Iniciar o cliente em uma nova janela
echo.
echo Iniciando o cliente frontend na porta 5173...
start "Cliente Frontend Autha" cmd /k "cd client && npm run dev"

:: Aguardar o cliente iniciar
echo Aguardando o cliente frontend iniciar (10 segundos)...
timeout /t 10 /nobreak > nul

:: Abrir o navegador
echo.
echo Abrindo o navegador...
start http://localhost:5173

echo ==============================================
echo Aplicação iniciada!
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:5173
echo ==============================================
echo Para encerrar os servidores, feche as janelas de comando ou use Ctrl+C
echo.

:: Manter a janela aberta para acompanhamento
echo Pressione qualquer tecla para encerrar todos os processos e sair...
pause

:: Ao encerrar, matar os processos das aplicações Node
taskkill /f /im node.exe 2>nul

echo Todos os processos encerrados.
exit /b 0 