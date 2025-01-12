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
        this.activeTrackIndex = null; // Stocke l'index de l'élément actif
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
            item.setAttribute('draggable', 'true'); // Rendre chaque élément draggable
            item.dataset.index = index; // Sauvegarder l'index dans un attribut

            // Ajouter les événements de drag-and-drop
            item.addEventListener('dragstart', (event) => this.handleDragStart(event, index));
            item.addEventListener('dragover', (event) => this.handleDragOver(event));
            item.addEventListener('drop', (event) => this.handleDrop(event, index));

            item.addEventListener('click', () => {
                this.activeTrackIndex = index; // Mettre à jour l'élément actif
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

            // Appliquer la classe "active" si l'élément est actif
            if (index === this.activeTrackIndex) {
                item.classList.add('active');
            }

            list.appendChild(item);
        });
    }

    handleDragStart(event, index) {
        event.dataTransfer.setData('text/plain', index); // Sauvegarder l'index de l'élément
        event.target.classList.add('dragging'); // Ajouter une classe pour indiquer qu'il est en train d'être déplacé
    }

    handleDragOver(event) {
        event.preventDefault(); // Nécessaire pour permettre le drop
        event.target.classList.add('droppable'); // Ajouter une classe visuelle au survol
    }

    handleDrop(event, newIndex) {
        event.preventDefault();

        const oldIndex = event.dataTransfer.getData('text/plain'); // Récupérer l'index de l'élément déplacé

        if (oldIndex !== newIndex) {
            // Réorganiser la liste
            const movedTrack = this.tracks.splice(oldIndex, 1)[0];
            this.tracks.splice(newIndex, 0, movedTrack);

            // Mettre à jour l'index actif si nécessaire
            if (this.activeTrackIndex === parseInt(oldIndex)) {
                this.activeTrackIndex = parseInt(newIndex);
            } else if (this.activeTrackIndex > parseInt(oldIndex) && this.activeTrackIndex <= parseInt(newIndex)) {
                this.activeTrackIndex -= 1;
            } else if (this.activeTrackIndex < parseInt(oldIndex) && this.activeTrackIndex >= parseInt(newIndex)) {
                this.activeTrackIndex += 1;
            }

            // Rendre la liste à jour
            this.renderPlaylist();

            // Émettre un événement pour notifier que la playlist a été réorganisée
            this.dispatchEvent(
                new CustomEvent('playlistreordered', {
                    detail: { tracks: this.tracks },
                    bubbles: true,
                    composed: true,
                })
            );
        }

        // Nettoyer les classes visuelles
        this.shadowRoot.querySelectorAll('.track-item').forEach((item) => {
            item.classList.remove('dragging', 'droppable');
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
