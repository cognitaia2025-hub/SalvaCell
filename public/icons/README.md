# PWA Icons

Este directorio debe contener los iconos de la PWA en los siguientes tamaños:

- `icon-192x192.png` - Icono de 192x192 píxeles
- `icon-512x512.png` - Icono de 512x512 píxeles

## Generación de Iconos

Los iconos pueden ser generados usando herramientas como:

- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- Manualmente con software de diseño gráfico

## Requisitos

- Formato: PNG
- Fondo: Transparente o color sólido (#2563eb recomendado)
- Contenido: Logo de SalvaCell centrado
- Propósito: `any maskable` (adaptable a diferentes formas de iconos en dispositivos)

## Comando para generar desde logo existente

Si tienes un logo en formato SVG o PNG de alta resolución:

```bash
npx pwa-asset-generator logo.svg ./public/icons \
  --icon-only \
  --type png \
  --padding "10%" \
  --background "#2563eb"
```
