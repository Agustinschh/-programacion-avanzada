@echo off
title Sistema de Transacciones Bancarias - Iniciador
color 0A

echo.
echo ========================================
echo   SISTEMA DE TRANSACCIONES BANCARIAS
echo ========================================
echo.
echo Iniciando todos los servicios...
echo.

REM Cambiar al directorio del script
cd /d "%~dp0"

REM Ejecutar el script de PowerShell
powershell.exe -ExecutionPolicy Bypass -File "start-all.ps1"

pause

