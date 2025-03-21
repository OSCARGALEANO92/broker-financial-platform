// Este archivo ayuda a que tu PWA funcione offline y cargue más rápido
const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)){3}$/
    )
  );
  
  export function register() {
    if ("serviceWorker" in navigator) {
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
      if (publicUrl.origin !== window.location.origin) {
        return;
      }
  
      window.addEventListener("load", () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
        if (isLocalhost) {
          checkValidServiceWorker(swUrl);
        } else {
          registerValidSW(swUrl);
        }
      });
    }
  }
  
  function registerValidSW(swUrl) {
    navigator.serviceWorker
      .register(swUrl)
      .then(registration => {
        console.log("Service Worker registrado con éxito:", registration);
      })
      .catch(error => {
        console.error("Error al registrar el Service Worker:", error);
      });
  }
  
  function checkValidServiceWorker(swUrl) {
    fetch(swUrl)
      .then(response => {
        if (
          response.status === 404 ||
          response.headers.get("content-type")?.indexOf("javascript") === -1
        ) {
          navigator.serviceWorker.ready.then(registration => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          registerValidSW(swUrl);
        }
      })
      .catch(() => {
        console.log("No hay conexión a internet. La aplicación funciona en modo offline.");
      });
  }
  
  export function unregister() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.unregister();
      });
    }
  }
  