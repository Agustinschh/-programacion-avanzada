# Script para iniciar todos los servicios del sistema de transacciones
$ErrorActionPreference = "Continue"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  SISTEMA DE TRANSACCIONES BANCARIAS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Cambiar al directorio del script
Set-Location $PSScriptRoot

# Iniciar Kafka (Docker o Local)
Write-Host "[1/5] Iniciando Kafka..." -ForegroundColor Yellow
$kafkaStarted = $false

# Intentar con Docker primero
try {
    $null = docker --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Docker detectado, iniciando contenedores..." -ForegroundColor Gray
        docker compose up -d 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [OK] Kafka iniciado con Docker" -ForegroundColor Green
            $kafkaStarted = $true
            Write-Host "  Esperando 15 segundos para que Kafka este listo..." -ForegroundColor Gray
            Start-Sleep -Seconds 15
        } else {
            Write-Host "  [X] Error al iniciar Docker Compose" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "  Docker no disponible" -ForegroundColor Yellow
}

# Si Docker no funcionó, intentar Kafka local
if (-not $kafkaStarted) {
    $kafkaLocalScript = Join-Path $PSScriptRoot "start-kafka-local.ps1"
    if (Test-Path $kafkaLocalScript) {
        Write-Host "  Intentando Kafka local..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-File", $kafkaLocalScript -WindowStyle Minimized
        $kafkaStarted = $true
        Start-Sleep -Seconds 10
    } else {
        Write-Host "  [!] ADVERTENCIA: No se pudo iniciar Kafka" -ForegroundColor Yellow
        Write-Host "  Los servicios se iniciaran pero no podran conectarse a Kafka." -ForegroundColor Yellow
    }
}

# Verificar que los directorios existen
$services = @(
    @{Name="API Service"; Path="backend/api"; Port=3001},
    @{Name="Orchestrator Service"; Path="backend/orchestrator"; Port=$null},
    @{Name="Gateway WebSocket"; Path="backend/gateway"; Port=3002},
    @{Name="Frontend"; Path="frontend"; Port=3000}
)

$serviceNum = 2
foreach ($service in $services) {
    $servicePath = Join-Path $PSScriptRoot $service.Path
    if (-not (Test-Path $servicePath)) {
        Write-Host "[$serviceNum/5] [X] $($service.Name) - Directorio no encontrado: $servicePath" -ForegroundColor Red
        $serviceNum++
        continue
    }
    
    Write-Host "[$serviceNum/5] Iniciando $($service.Name)..." -ForegroundColor Yellow
    $fullPath = (Resolve-Path $servicePath).Path
    $command = "cd '$fullPath'; npm run dev"
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $command -WindowStyle Normal
    Write-Host "  [OK] $($service.Name) iniciado" -ForegroundColor Green
    
    if ($service.Port) {
        Write-Host "  → http://localhost:$($service.Port)" -ForegroundColor Gray
    }
    
    Start-Sleep -Seconds 2
    $serviceNum++
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  [OK] TODOS LOS SERVICIOS INICIADOS" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Servicios disponibles:" -ForegroundColor Cyan
Write-Host "  • Frontend:        http://localhost:3000" -ForegroundColor White
Write-Host "  • API Service:     http://localhost:3001" -ForegroundColor White
Write-Host "  • Gateway WS:      http://localhost:3002" -ForegroundColor White
Write-Host "  • Kafka UI:        http://localhost:8080" -ForegroundColor White
Write-Host "`nPara detener los servicios, cierra las ventanas de PowerShell.`n" -ForegroundColor Gray

# Nota: Si se ejecuta desde .bat, el pause del .bat mantendrá la ventana abierta
# Si se ejecuta directamente desde PowerShell, descomentar la siguiente línea:
# Read-Host "Presiona Enter para cerrar"

