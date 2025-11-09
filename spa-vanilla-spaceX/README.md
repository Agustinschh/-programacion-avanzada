# SPA Vanilla JavaScript

Una aplicación de página única (SPA) construida completamente con vanilla JavaScript, sin frameworks externos.

## 🚀 Características

- **Navegación sin recarga**: Cambio de vistas sin recargar la página
- **Sistema de routing personalizado**: Manejo de rutas con hash (#)
- **Diseño responsive**: Adaptable a diferentes tamaños de pantalla
- **Interfaz moderna**: Estilos CSS3 con gradientes y animaciones
- **Fácil de extender**: Arquitectura modular y bien documentada

## 📁 Estructura del proyecto

```
spa-vanilla-spaceX/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── js/
│   ├── router.js       # Sistema de routing
│   └── app.js          # Aplicación principal y componentes
└── README.md           # Este archivo
```

## 🛠️ Tecnologías utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con Flexbox y Grid
- **JavaScript ES6+**: Clases, módulos y funcionalidades modernas
- **History API**: Para el manejo de rutas del navegador

## 🚀 Cómo usar

1. **Clona o descarga el proyecto**
2. **Abre `index.html` en tu navegador**
3. **¡Listo!** La aplicación debería funcionar inmediatamente

### Opcional: Servidor local

Para un mejor desarrollo, puedes usar un servidor local:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server

# Con PHP
php -S localhost:8000
```

Luego visita `http://localhost:8000`

## 📖 Funcionalidades

### Navegación
- **Inicio**: Página de bienvenida con información general
- **Acerca de**: Información sobre la aplicación y tecnologías
- **Contacto**: Formulario de contacto funcional
- **Productos**: Lista de productos con carga dinámica

### Sistema de routing
- Navegación basada en hash (#)
- Soporte para botones atrás/adelante del navegador
- Enlaces activos automáticos
- Página 404 personalizada

## 🔧 Personalización

### Agregar nuevas rutas

1. En `js/app.js`, agrega la ruta en `setupRoutes()`:
```javascript
this.router.addRoute('/nueva-ruta', () => this.createNuevaVista());
```

2. Crea el método de la vista:
```javascript
createNuevaVista() {
    const div = document.createElement('div');
    div.className = 'view';
    div.innerHTML = `
        <h2>Mi Nueva Vista</h2>
        <p>Contenido de la nueva vista...</p>
    `;
    return div;
}
```

3. Agrega el enlace en `index.html`:
```html
<li><a href="#/nueva-ruta" class="nav-link" data-route="nueva-ruta">Nueva Vista</a></li>
```

### Modificar estilos

Edita `styles.css` para personalizar:
- Colores y gradientes
- Tipografías
- Espaciados
- Animaciones
- Diseño responsive

## 🎨 Estructura del CSS

- **Reset y base**: Estilos generales y reset
- **Navegación**: Estilos del navbar
- **Contenido**: Estilos del área principal
- **Vistas**: Estilos específicos para cada vista
- **Responsive**: Media queries para móviles
- **Utilidades**: Spinners, animaciones, etc.

## 🔍 Arquitectura del JavaScript

### Router (`js/router.js`)
- Maneja el sistema de routing
- Escucha cambios en la URL
- Renderiza componentes
- Actualiza enlaces activos

### App (`js/app.js`)
- Aplicación principal
- Define todas las rutas
- Crea componentes/vistas
- Maneja lógica de negocio

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: Pantallas grandes (1200px+)
- **Tablet**: Pantallas medianas (768px - 1199px)
- **Mobile**: Pantallas pequeñas (< 768px)

## 🚀 Próximos pasos

Algunas ideas para extender la aplicación:

1. **API Integration**: Conectar con APIs reales
2. **State Management**: Implementar un sistema de estado global
3. **Componentes reutilizables**: Crear una librería de componentes
4. **Testing**: Agregar tests unitarios
5. **PWA**: Convertir en Progressive Web App
6. **Build Process**: Agregar herramientas de build (Webpack, Vite, etc.)

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar la aplicación, no dudes en:

1. Hacer fork del proyecto
2. Crear una rama para tu feature
3. Hacer commit de tus cambios
4. Hacer push a la rama
5. Abrir un Pull Request

---

**¡Disfruta construyendo tu SPA con vanilla JavaScript!** 🎉

