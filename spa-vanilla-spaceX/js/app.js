// Aplicación principal SPA
class App {
    constructor() {
        this.router = new Router();
        this.init();
    }

    init() {
        this.setupRoutes();
        console.log('SPA iniciada correctamente');
    }

    setupRoutes() {
        // Ruta de inicio
        this.router.addRoute('/', () => this.createHomeView());
        
        // Ruta acerca de
        this.router.addRoute('/about', () => this.createAboutView());
        
        // Ruta contacto
        this.router.addRoute('/contact', () => this.createContactView());
        
        // Ruta productos
        this.router.addRoute('/products', () => this.createProductsView());
        
        // Ruta 404
        this.router.addRoute('/404', () => this.create404View());
    }

    // Vista de inicio
    createHomeView() {
        const div = document.createElement('div');
        div.className = 'view';
        div.innerHTML = `
            <h2>¡Bienvenido a mi SPA!</h2>
            <p>Esta es una aplicación de página única (SPA) construida con vanilla JavaScript.</p>
            <p>Características principales:</p>
            <ul style="margin: 1rem 0; padding-left: 2rem;">
                <li>Navegación sin recarga de página</li>
                <li>Sistema de routing personalizado</li>
                <li>Interfaz moderna y responsive</li>
                <li>Fácil de extender y personalizar</li>
            </ul>
            <p>Usa el menú de navegación para explorar las diferentes secciones.</p>
        `;
        return div;
    }

    // Vista acerca de
    createAboutView() {
        const div = document.createElement('div');
        div.className = 'view';
        div.innerHTML = `
            <h2>Acerca de</h2>
            <p>Esta aplicación demuestra cómo crear un SPA (Single Page Application) usando solo vanilla JavaScript, sin frameworks externos.</p>
            
            <h3 style="margin-top: 2rem; color: #667eea;">Tecnologías utilizadas:</h3>
            <ul style="margin: 1rem 0; padding-left: 2rem;">
                <li><strong>HTML5:</strong> Estructura semántica</li>
                <li><strong>CSS3:</strong> Estilos modernos con Flexbox y Grid</li>
                <li><strong>JavaScript ES6+:</strong> Clases, módulos y funcionalidades modernas</li>
                <li><strong>History API:</strong> Para el manejo de rutas</li>
            </ul>

            <h3 style="margin-top: 2rem; color: #667eea;">Características del router:</h3>
            <ul style="margin: 1rem 0; padding-left: 2rem;">
                <li>Navegación basada en hash (#)</li>
                <li>Manejo del botón atrás/adelante del navegador</li>
                <li>Enlaces activos automáticos</li>
                <li>Página 404 personalizada</li>
            </ul>
        `;
        return div;
    }

    // Vista de contacto
    createContactView() {
        const div = document.createElement('div');
        div.className = 'view';
        div.innerHTML = `
            <h2>Contacto</h2>
            <p>¿Tienes alguna pregunta o sugerencia? ¡Nos encantaría saber de ti!</p>
            
            <div class="contact-form">
                <form id="contactForm">
                    <div class="form-group">
                        <label for="name">Nombre:</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="subject">Asunto:</label>
                        <input type="text" id="subject" name="subject" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="message">Mensaje:</label>
                        <textarea id="message" name="message" rows="5" required></textarea>
                    </div>
                    
                    <button type="submit" class="btn">Enviar mensaje</button>
                </form>
            </div>
        `;

        // Agregar funcionalidad al formulario
        const form = div.querySelector('#contactForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactForm(form);
        });

        return div;
    }

    // Vista de productos
    createProductsView() {
        const div = document.createElement('div');
        div.className = 'view';
        div.innerHTML = `
            <h2>Nuestros Productos</h2>
            <p>Descubre nuestra amplia gama de productos de alta calidad.</p>
            
            <div class="product-grid" id="productGrid">
                <div class="loading">
                    <div class="spinner"></div>
                </div>
            </div>
        `;

        // Cargar productos dinámicamente
        this.loadProducts(div);

        return div;
    }

    // Vista 404
    create404View() {
        const div = document.createElement('div');
        div.className = 'view';
        div.innerHTML = `
            <h2>Página no encontrada</h2>
            <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
            <p>Puedes:</p>
            <ul style="margin: 1rem 0; padding-left: 2rem;">
                <li>Verificar la URL</li>
                <li>Usar el menú de navegación</li>
                <li>Volver a la página de inicio</li>
            </ul>
            <a href="#/" class="btn" data-route="home">Volver al inicio</a>
        `;
        return div;
    }

    // Manejar envío del formulario de contacto
    handleContactForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simular envío
        console.log('Datos del formulario:', data);
        
        // Mostrar mensaje de éxito
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            background: #d4edda;
            color: #155724;
            padding: 1rem;
            border-radius: 5px;
            margin-top: 1rem;
            border: 1px solid #c3e6cb;
        `;
        successMsg.textContent = '¡Mensaje enviado correctamente! Te responderemos pronto.';
        
        form.parentNode.insertBefore(successMsg, form.nextSibling);
        form.reset();
        
        // Remover mensaje después de 5 segundos
        setTimeout(() => {
            successMsg.remove();
        }, 5000);
    }

    // Cargar productos (simulado)
    loadProducts(container) {
        const productGrid = container.querySelector('#productGrid');
        
        // Simular carga asíncrona
        setTimeout(() => {
            const products = [
                {
                    id: 1,
                    name: 'Producto Premium',
                    description: 'Descripción del producto premium con características avanzadas.',
                    price: '$99.99'
                },
                {
                    id: 2,
                    name: 'Producto Estándar',
                    description: 'Producto estándar con excelente relación calidad-precio.',
                    price: '$49.99'
                },
                {
                    id: 3,
                    name: 'Producto Básico',
                    description: 'Producto básico perfecto para empezar.',
                    price: '$19.99'
                }
            ];

            productGrid.innerHTML = products.map(product => `
                <div class="product-card">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p style="font-size: 1.2rem; font-weight: bold; color: #667eea; margin-top: 1rem;">
                        ${product.price}
                    </p>
                    <button class="btn" style="margin-top: 1rem; width: 100%;">
                        Ver detalles
                    </button>
                </div>
            `).join('');
        }, 1000);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

