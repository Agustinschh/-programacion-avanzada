# Script para iniciar Kafka local (sin Docker)
$ErrorActionPreference = "Continue"

Write-Host "=== Iniciando Kafka Local ===" -ForegroundColor Cyan

$kafkaDir = "C:\kafka"

if (-not (Test-Path $kafkaDir)) {
    Write-Host "ERROR: Kafka no encontrado en $kafkaDir" -ForegroundColor Red
    Write-Host "Por favor instala Kafka primero." -ForegroundColor Yellow
    exit 1
}

# Iniciar Kafka en una nueva ventana
Write-Host "Iniciando Kafka en una nueva ventana..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-File", "$kafkaDir\start-kafka.ps1" -WindowStyle Normal

Write-Host "Esperando 10 segundos para que Kafka inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "`nKafka debería estar corriendo en localhost:9092" -ForegroundColor Green
Write-Host "Verifica en la ventana de Kafka que no haya errores.`n" -ForegroundColor Yellow

