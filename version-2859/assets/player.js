import { H as Hls } from './video-vendor-dru42stk.js';

const shells = Array.from(document.querySelectorAll('[data-video-source]'));

shells.forEach(function (shell) {
  const video = shell.querySelector('video');
  const button = shell.querySelector('.player-start');
  const source = shell.dataset.videoSource;
  let initialized = false;
  let hls = null;

  function attach() {
    if (!video || !source || initialized) {
      return;
    }

    initialized = true;

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else {
      video.src = source;
    }
  }

  function play() {
    attach();
    shell.classList.add('is-playing');
    const promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        shell.classList.remove('is-playing');
      });
    }
  }

  if (button) {
    button.addEventListener('click', play);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      if (!video.ended) {
        shell.classList.remove('is-playing');
      }
    });
  }

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
});
