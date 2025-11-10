# Script para verificar el estado del sistema
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ESTADO DEL SISTEMA DE TRANSACCIONES" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Verificar Docker
Write-Host "[1] Contenedores Docker:" -ForegroundColor Yellow
$dockerContainers = docker ps --format "{{.Names}}" 2>&1
$kafkaRunning = $false
$zookeeperRunning = $false
$kafkaUIRunning = $false

if ($dockerContainers -match "kafka") {
    Write-Host "  [OK] Kafka - ACTIVO" -ForegroundColor Green
    $kafkaRunning = $true
} else {
    Write-Host "  [X] Kafka - INACTIVO" -ForegroundColor Red
}

if ($dockerContainers -match "zookeeper") {
    Write-Host "  [OK] Zookeeper - ACTIVO" -ForegroundColor Green
    $zookeeperRunning = $true
} else {
    Write-Host "  [X] Zookeeper - INACTIVO" -ForegroundColor Red
}

if ($dockerContainers -match "kafka-ui") {
    Write-Host "  [OK] Kafka UI - ACTIVO" -ForegroundColor Green
    $kafkaUIRunning = $true
} else {
    Write-Host "  [X] Kafka UI - INACTIVO" -ForegroundColor Red
}

# Verificar puertos
Write-Host "`n[2] Servicios Backend:" -ForegroundColor Yellow
$ports = @{
    3000 = "Frontend"
    3001 = "API Service"
    3002 = "Gateway WebSocket"
    8080 = "Kafka UI"
    9092 = "Kafka"
    2181 = "Zookeeper"
}

$activePorts = @()
foreach ($port in $ports.Keys) {
    $result = netstat -ano | findstr ":$port " | findstr "LISTENING"
    if ($result) {
        Write-Host "  [OK] Puerto $port - $($ports[$port]) - ACTIVO" -ForegroundColor Green
        $activePorts += $port
    } else {
        Write-Host "  [X] Puerto $port - $($ports[$port]) - INACTIVO" -ForegroundColor Red
    }
}

# Verificar procesos Node.js
Write-Host "`n[3] Procesos Node.js:" -ForegroundColor Yellow
$nodeProcesses = (Get-Process -Name node -ErrorAction SilentlyContinue).Count
Write-Host "  → $nodeProcesses procesos Node.js corriendo" -ForegroundColor White

# Resumen
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RESUMEN" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$allServices = @(
    @{Name="Kafka"; Status=$kafkaRunning},
    @{Name="Zookeeper"; Status=$zookeeperRunning},
    @{Name="Kafka UI"; Status=$kafkaUIRunning},
    @{Name="Frontend (3000)"; Status=($activePorts -contains 3000)},
    @{Name="API Service (3001)"; Status=($activePorts -contains 3001)},
    @{Name="Gateway (3002)"; Status=($activePorts -contains 3002)}
)

$activeCount = ($allServices | Where-Object { $_.Status }).Count
$totalCount = $allServices.Count

Write-Host "Servicios activos: $activeCount/$totalCount`n" -ForegroundColor $(if ($activeCount -eq $totalCount) { "Green" } else { "Yellow" })

foreach ($service in $allServices) {
    $status = if ($service.Status) { "[OK] ACTIVO" } else { "[X] INACTIVO" }
    $color = if ($service.Status) { "Green" } else { "Red" }
    Write-Host "  $status - $($service.Name)" -ForegroundColor $color
}

if ($activeCount -eq $totalCount) {
    Write-Host "`n[OK] Sistema completamente operativo!" -ForegroundColor Green
    Write-Host "`nAccesos:" -ForegroundColor Cyan
    Write-Host "  • Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "  • API: http://localhost:3001" -ForegroundColor White
    Write-Host "  • Gateway: http://localhost:3002" -ForegroundColor White
    Write-Host "  • Kafka UI: http://localhost:8080" -ForegroundColor White
} else {
    Write-Host "`n[!] Algunos servicios no estan activos." -ForegroundColor Yellow
    Write-Host "  Ejecuta .\INICIAR-SISTEMA.bat para iniciar todos los servicios.`n" -ForegroundColor Yellow
}

Write-Host ""

