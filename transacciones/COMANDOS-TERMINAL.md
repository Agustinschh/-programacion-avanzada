# Comandos para Terminal

## Desde PowerShell

### Ver Estado del Sistema
```powershell
cd transacciones
.\ESTADO-SISTEMA.ps1
```

O directamente:
```powershell
.\transacciones\ESTADO-SISTEMA.ps1
```

### Iniciar Sistema
```powershell
cd transacciones
.\INICIAR-SISTEMA.bat
```

O ejecutar el script PowerShell directamente:
```powershell
cd transacciones
.\start-all.ps1
```

### Detener Sistema
```powershell
cd transacciones
.\DETENER-SISTEMA.bat
```

## Desde CMD (Símbolo del sistema)

### Ver Estado del Sistema
```cmd
cd transacciones
powershell -ExecutionPolicy Bypass -File ESTADO-SISTEMA.ps1
```

### Iniciar Sistema
```cmd
cd transacciones
INICIAR-SISTEMA.bat
```

### Detener Sistema
```cmd
cd transacciones
DETENER-SISTEMA.bat
```

## Comandos Rápidos (desde la raíz del proyecto)

### Estado
```powershell
powershell -ExecutionPolicy Bypass -File transacciones\ESTADO-SISTEMA.ps1
```

### Iniciar
```powershell
cd transacciones; .\INICIAR-SISTEMA.bat
```

### Detener
```powershell
cd transacciones; .\DETENER-SISTEMA.bat
```

