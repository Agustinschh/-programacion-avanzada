class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.init();
    }

    init() {
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                const route = e.target.getAttribute('data-route');
                this.navigate(route);
            }
        });

        this.handleRoute();
    }

    addRoute(path, component) {
        this.routes.set(path, component);
    }

    navigate(path) {
        if (path === 'home') path = '/';
        window.history.pushState({}, '', `#${path}`);
        this.handleRoute();
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const route = this.routes.get(hash);
        
        if (route) {
            this.currentRoute = hash;
            this.render(route);
            this.updateActiveLink();
        } else {
            this.render(this.routes.get('/404') || this.default404);
        }
    }

    render(component) {
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = '';
            content.appendChild(component());
        }
    }

    updateActiveLink() {
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.classList.remove('active');
            const route = link.getAttribute('data-route');
            if ((route === 'home' && this.currentRoute === '/') || 
                (route !== 'home' && this.currentRoute === `/${route}`)) {
                link.classList.add('active');
            }
        });
    }

    default404() {
        const div = document.createElement('div');
        div.className = 'view';
        div.innerHTML = `
            <h2>Página no encontrada</h2>
            <p>Lo sentimos, la página que buscas no existe.</p>
            <a href="#/" class="btn" data-route="home">Volver al inicio</a>
        `;
        return div;
    }
}

window.Router = Router;

