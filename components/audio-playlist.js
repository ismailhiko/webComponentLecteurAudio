class AudioPlaylist extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <div id="playlist">
                <h3>Playlist</h3>
                <ul id="trackList"></ul>
            </div>
        `;
    }

    connectedCallback() {
        this.loadCSS();
        this.trackList = this.shadowRoot.getElementById('trackList');
    }

    loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'components/audio-playlist.css';
        this.shadowRoot.appendChild(link);
    }

    setTracks(tracks) {
        this.tracks = tracks;
        this.renderPlaylist();
    }

    renderPlaylist() {
        this.trackList.innerHTML = '';
        this.tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = track.title;
            li.addEventListener('click', () => this.dispatchEvent(new CustomEvent('selecttrack', { detail: index })));
            this.trackList.appendChild(li);
        });
    }

    highlightTrack(index) {
        const items = this.trackList.querySelectorAll('li');
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }
}

customElements.define('audio-playlist', AudioPlaylist);
