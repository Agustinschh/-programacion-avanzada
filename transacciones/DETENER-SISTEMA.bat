@echo off
title Sistema de Transacciones Bancarias - Detener
color 0C

echo.
echo ========================================
echo   DETENIENDO SISTEMA DE TRANSACCIONES
echo ========================================
echo.

REM Cambiar al directorio del script
cd /d "%~dp0"

echo [1/2] Deteniendo contenedores de Docker...
docker compose down 2>nul
if %ERRORLEVEL% EQU 0 (
    echo   ✓ Contenedores de Docker detenidos
) else (
    echo   ⚠ Docker no estaba corriendo o no está disponible
)

echo.
echo [2/2] Cerrando procesos de Node.js...
taskkill /F /IM node.exe 2>nul
if %ERRORLEVEL% EQU 0 (
    echo   ✓ Procesos de Node.js cerrados
) else (
    echo   ⚠ No se encontraron procesos de Node.js corriendo
)

echo.
echo ========================================
echo   ✓ SISTEMA DETENIDO
echo ========================================
echo.
pause

