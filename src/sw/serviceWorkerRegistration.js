/**
 * Service Worker Registration
 * Registra el Service Worker y maneja actualizaciones
 */

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('Service Worker registrado:', registration);

          // Verificar actualizaciones cada hora
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);

          // Escuchar cuando hay una nueva versión disponible
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // Nueva versión disponible
                  console.log('Nueva versión disponible. Por favor, recarga la página.');
                  
                  // Notificar al usuario
                  if (window.confirm('Hay una nueva versión disponible. ¿Deseas actualizar?')) {
                    installingWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                } else {
                  // Contenido cacheado por primera vez
                  console.log('Contenido cacheado para uso offline.');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error('Error registrando Service Worker:', error);
        });

      // Recargar cuando el Service Worker toma control
      let refreshing;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
      });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
