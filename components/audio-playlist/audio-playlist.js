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
        this.tracks = [
            { title: 'Calme', src: 'audio.mp3' },
            { title: 'Motivation', src: 'audio2.mp3' },
            { title: 'Tristesse', src: 'audio3.mp3' }
        ];
    }

    connectedCallback() {
        this.loadCSS();
        this.renderPlaylist();
        
    }

    loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'components/audio-playlist/audio-playlist.css';
        this.shadowRoot.appendChild(link);
    }

    renderPlaylist() {
        const list = this.shadowRoot.querySelector('#trackList');
        list.innerHTML = '';
        this.tracks.forEach((track, index) => {
            const item = document.createElement('li');
            item.textContent = track.title;
            item.className = 'track-item';
            item.addEventListener('click', () => {
                this.dispatchEvent(
                    new CustomEvent('selecttrack', {
                        detail: { index },
                        bubbles: true,
                        composed: true,
                    })
                );
                this.highlightTrack(index);
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
            list.appendChild(item);
        });
    }

    highlightTrack(index) {
        const items = this.shadowRoot.querySelectorAll('.track-item');
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    get tracks() {
        return this._tracks || [];
    }

    set tracks(value) {
        this._tracks = value;
        this.renderPlaylist();
    }
}

customElements.define('audio-playlist', AudioPlaylist);
