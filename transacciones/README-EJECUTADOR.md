# 🚀 Ejecutadores del Sistema

## Iniciar el Sistema

### Opción 1: Doble clic (Más fácil)
Haz doble clic en el archivo:
```
INICIAR-SISTEMA.bat
```

### Opción 2: Desde PowerShell
```powershell
cd transacciones
.\start-all.ps1
```

## Detener el Sistema

### Opción 1: Doble clic
Haz doble clic en el archivo:
```
DETENER-SISTEMA.bat
```

### Opción 2: Manualmente
1. Cierra todas las ventanas de PowerShell que se abrieron
2. Detén Docker Compose:
   ```powershell
   cd transacciones
   docker compose down
   ```

## Servicios Iniciados

Una vez iniciado, tendrás acceso a:

- **Frontend**: http://localhost:3000
- **API Service**: http://localhost:3001
- **Gateway WebSocket**: http://localhost:3002
- **Kafka UI**: http://localhost:8080

## Notas

- El sistema intentará usar Docker primero para Kafka
- Si Docker no está disponible, intentará usar Kafka local (requiere Java)
- Cada servicio se abre en una ventana separada para ver los logs
- Para detener todo, usa `DETENER-SISTEMA.bat` o cierra las ventanas manualmente

