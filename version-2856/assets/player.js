function initMoviePlayer(streamUrl) {
    var video = document.getElementById('movie-player');
    var cover = document.querySelector('[data-player-cover]');
    var playButton = document.querySelector('[data-play-button]');
    var hls = null;
    var loaded = false;

    if (!video || !streamUrl) {
        return;
    }

    function hideCover() {
        if (cover) {
            cover.classList.add('is-hidden');
        }
    }

    function attach() {
        if (loaded) {
            return;
        }
        loaded = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
        } else if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
        } else {
            video.src = streamUrl;
        }
    }

    function start() {
        attach();
        hideCover();
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {});
        }
    }

    if (cover) {
        cover.addEventListener('click', start);
    }

    if (playButton) {
        playButton.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            start();
        });
    }

    video.addEventListener('play', function () {
        attach();
        hideCover();
    });

    video.addEventListener('click', function () {
        if (video.paused) {
            start();
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
}
