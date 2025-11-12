/**
 * Layout Principal de la Aplicación
 * 
 * Este componente define la estructura HTML base de toda la aplicación Next.js.
 * Es un componente de servidor que envuelve todas las páginas y proporciona
 * la estructura HTML común (html, head, body).
 * 
 * Funcionalidades:
 * - Define los metadatos de la aplicación (título, descripción)
 * - Importa los estilos globales (Tailwind CSS y estilos personalizados)
 * - Establece el idioma de la página (español)
 * - Aplica clases de estilo globales al body (antialiased para mejor renderizado de fuentes)
 * - Renderiza el contenido de las páginas mediante el prop children
 * 
 * Este layout se aplica automáticamente a todas las páginas de la aplicación Next.js
 * gracias al sistema de App Router.
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sistema de Monitoreo de Red',
  description: 'Dashboard de monitoreo en tiempo real de nodos de red con Kafka',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

