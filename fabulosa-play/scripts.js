// Inicializar Swiper para publicidad
document.addEventListener("DOMContentLoaded", () => {
  // Carrusel de publicidad
  if (typeof Swiper !== "undefined") {
    new Swiper(".publicidad-swiper", {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      }
    });
  }

  // Reproductor HLS para canales
  const video = document.getElementById("canalPlayer");
  const botonesCanal = document.querySelectorAll(".canal-btn");

  // Cambia esta URL por el canal que quieras que cargue por defecto
  const defaultStream = "URL_CANAL_1_HLS.m3u8";

  let hlsInstance = null;

  function playStream(url) {
    if (!url) return;

    // Si ya hay una instancia HLS, destruirla
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }

    // Navegadores con HLS.js
    if (window.Hls && window.Hls.isSupported() && url.endsWith(".m3u8")) {
      hlsInstance = new Hls();
      hlsInstance.loadSource(url);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl") && url.endsWith(".m3u8")) {
      // Safari
      video.src = url;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      }, { once: true });
    } else {
      // Por si la URL es MP4 u otro formato soportado directo
      video.src = url;
      video.play().catch(() => {});
    }
  }

  // Click en cada canal
  botonesCanal.forEach(btn => {
    btn.addEventListener("click", () => {
      const url = btn.dataset.stream;
      playStream(url);
    });
  });

  // Cargar canal por defecto
  playStream(defaultStream);
});
