@echo off
title Estado del Sistema - Transacciones
color 0B

REM Cambiar al directorio del script
cd /d "%~dp0"

REM Ejecutar el script de PowerShell
powershell.exe -ExecutionPolicy Bypass -File "ESTADO-SISTEMA.ps1"

pause

