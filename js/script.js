// Bomjan Lyrics - Main Application
// A professional lyrics and chord viewer for guitarists and singers

class LyricApp {
  constructor() {
    this.songs = [];
    this.currentSong = null;
    this.favorites = storage.get('favorites', []);
    this.settings = storage.get('settings', {
      autoScroll: false,
      scrollSpeed: 1,
      fontSize: 19,
      instrument: 'guitar'
    });
    this.isPlaying = false;
    this.currentLineIndex = 0;
    this.playbackTimer = null;
    this.currentChordIndex = 0;
    
    this.init();
  }

  async init() {
    await this.loadSongs();
    this.setupElements();
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
    this.loadDefaultSong();
    this.renderFavorites();
  }

  async loadSongs() {
    try {
      const response = await fetch('data/songs.json');
      const data = await response.json();
      this.songs = data.songs;
    } catch (error) {
      console.error('Error loading songs:', error);
      this.songs = [];
    }
  }

  setupElements() {
    // Header elements
    this.searchInput = document.getElementById('search');
    this.likedBtn = document.querySelector('.liked');
    this.libraryBtn = document.querySelector('.library');
    
    // Meta section
    this.songTitleEl = document.querySelector('.song-title');
    this.artistNameEl = document.querySelector('.artist-name');
    this.songImageEl = document.querySelector('.meta img');
    this.keyEl = document.getElementById('key');
    
    // Lyric section
    this.lyricBox = document.querySelector('.lyric-box');
    this.lyricTitleEl = document.getElementById('song-title');
    
    // Chord section
    this.currentChordImg = document.querySelector('.current-chord img');
    this.nextChordImg = document.querySelector('.next-chord img');
    this.currentChordName = document.querySelector('.current-chord-name');
  }

  setupEventListeners() {
    // Search functionality
    if (this.searchInput) {
      this.searchInput.addEventListener('input', debounce((e) => {
        this.handleSearch(e.target.value);
      }, 300));
    }

    // Liked button
    if (this.likedBtn) {
      this.likedBtn.addEventListener('click', () => this.toggleFavorite());
    }

    // Library button
    if (this.libraryBtn) {
      this.libraryBtn.addEventListener('click', () => this.showLibrary());
    }

    // Lyric box click to play/pause
    if (this.lyricBox) {
      this.lyricBox.addEventListener('click', (e) => {
        if (e.target.classList.contains('lyric-line')) {
          const index = parseInt(e.target.dataset.index);
          this.jumpToLine(index);
        }
      });
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Space: Play/Pause
      if (e.code === 'Space' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        this.togglePlayback();
      }
      
      // Arrow Up: Previous line
      if (e.code === 'ArrowUp' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        this.previousLine();
      }
      
      // Arrow Down: Next line
      if (e.code === 'ArrowDown' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        this.nextLine();
      }
      
      // L: Toggle Library
      if (e.code === 'KeyL' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        this.showLibrary();
      }
      
      // F: Toggle Favorite
      if (e.code === 'KeyF' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        this.toggleFavorite();
      }
    });
  }

  loadDefaultSong() {
    // Load the first song or the last played song
    const lastPlayed = storage.get('lastPlayed');
    const song = lastPlayed 
      ? this.songs.find(s => s.id === lastPlayed) 
      : this.songs[0];
    
    if (song) {
      this.loadSong(song);
    }
  }

  loadSong(song) {
    this.currentSong = song;
    this.currentLineIndex = 0;
    this.currentChordIndex = 0;
    this.isPlaying = false;
    
    if (this.playbackTimer) {
      clearInterval(this.playbackTimer);
      this.playbackTimer = null;
    }
    
    // Update meta section
    if (this.songTitleEl) this.songTitleEl.textContent = song.title;
    if (this.artistNameEl) this.artistNameEl.textContent = song.artist;
    if (this.songImageEl) this.songImageEl.src = song.image;
    if (this.keyEl) this.keyEl.textContent = song.key;
    if (this.lyricTitleEl) this.lyricTitleEl.textContent = `${song.title} | ${song.artist}`;
    
    // Render lyrics
    this.renderLyrics();
    
    // Update chord display
    this.updateChordDisplay();
    
    // Update favorite button
    this.updateFavoriteButton();
    
    // Save as last played
    storage.set('lastPlayed', song.id);
  }

  renderLyrics() {
    if (!this.currentSong || !this.lyricBox) return;
    
    this.lyricBox.innerHTML = '';
    
    this.currentSong.lyrics.forEach((lyric, index) => {
      const lineDiv = dom.create('div', 'lyric-line');
      lineDiv.dataset.index = index;
      
      // Add chord indicator if present
      if (lyric.chord && lyric.chord !== '') {
        const chordSpan = dom.create('span', 'chord-indicator');
        chordSpan.textContent = lyric.chord;
        lineDiv.appendChild(chordSpan);
        lineDiv.appendChild(document.createElement('br'));
      }
      
      // Add lyric text
      const textNode = document.createTextNode(lyric.line || '\u00A0');
      lineDiv.appendChild(textNode);
      
      this.lyricBox.appendChild(lineDiv);
    });
    
    // Highlight first line
    this.highlightLine(0);
  }

  highlightLine(index) {
    if (!this.lyricBox) return;
    
    const lines = this.lyricBox.querySelectorAll('.lyric-line');
    lines.forEach((line, i) => {
      if (i === index) {
        line.classList.add('active');
        // Scroll into view
        line.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        line.classList.remove('active');
      }
    });
    
    this.currentLineIndex = index;
    this.updateChordDisplay();
  }

  updateChordDisplay() {
    if (!this.currentSong) return;
    
    const currentLyric = this.currentSong.lyrics[this.currentLineIndex];
    if (!currentLyric || !currentLyric.chord) return;
    
    const chord = this.currentSong.chords.find(c => c.name === currentLyric.chord);
    if (!chord) return;
    
    // Update chord name
    if (this.currentChordName) {
      this.currentChordName.textContent = chord.name;
    }
    
    // For now, keep the existing chord images
    // In a full implementation, we would generate chord diagrams dynamically
  }

  togglePlayback() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (!this.currentSong) return;
    
    this.isPlaying = true;
    const speed = this.settings.scrollSpeed || 1;
    const interval = 3000 / speed; // Base interval of 3 seconds
    
    this.playbackTimer = setInterval(() => {
      this.nextLine();
    }, interval);
  }

  pause() {
    this.isPlaying = false;
    if (this.playbackTimer) {
      clearInterval(this.playbackTimer);
      this.playbackTimer = null;
    }
  }

  nextLine() {
    if (!this.currentSong) return;
    
    const nextIndex = this.currentLineIndex + 1;
    if (nextIndex < this.currentSong.lyrics.length) {
      this.highlightLine(nextIndex);
    } else {
      // End of song
      this.pause();
      this.highlightLine(0);
    }
  }

  previousLine() {
    if (!this.currentSong) return;
    
    const prevIndex = this.currentLineIndex - 1;
    if (prevIndex >= 0) {
      this.highlightLine(prevIndex);
    }
  }

  jumpToLine(index) {
    if (!this.currentSong) return;
    
    if (index >= 0 && index < this.currentSong.lyrics.length) {
      this.highlightLine(index);
    }
  }

  handleSearch(query) {
    if (!query || query.trim() === '') {
      this.showLibrary();
      return;
    }
    
    const searchTerm = query.toLowerCase();
    const results = this.songs.filter(song => 
      song.title.toLowerCase().includes(searchTerm) ||
      song.artist.toLowerCase().includes(searchTerm) ||
      song.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    this.showLibrary(results);
  }

  showLibrary(songsToShow = null) {
    const songs = songsToShow || this.songs;
    
    // Create modal overlay
    const overlay = dom.create('div', 'modal-overlay');
    const modal = dom.create('div', 'library-modal');
    
    // Modal header
    const header = dom.create('div', 'modal-header');
    const title = dom.create('h2', 'modal-title');
    title.textContent = 'Song Library';
    const closeBtn = dom.create('button', 'close-btn');
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => document.body.removeChild(overlay);
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    // Song list
    const songList = dom.create('div', 'song-list');
    
    if (songs.length === 0) {
      const noResults = dom.create('p', 'no-results');
      noResults.textContent = 'No songs found';
      songList.appendChild(noResults);
    } else {
      songs.forEach(song => {
        const songCard = this.createSongCard(song);
        songCard.onclick = () => {
          this.loadSong(song);
          document.body.removeChild(overlay);
        };
        songList.appendChild(songCard);
      });
    }
    
    modal.appendChild(header);
    modal.appendChild(songList);
    overlay.appendChild(modal);
    
    // Close on overlay click
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    };
    
    document.body.appendChild(overlay);
    animate.fadeIn(overlay, 200);
  }

  createSongCard(song) {
    const card = dom.create('div', 'song-card');
    
    const img = dom.create('img', 'song-card-img');
    img.src = song.image;
    img.alt = song.title;
    
    const info = dom.create('div', 'song-card-info');
    
    const title = dom.create('h3', 'song-card-title');
    title.textContent = song.title;
    
    const artist = dom.create('p', 'song-card-artist');
    artist.textContent = song.artist;
    
    const key = dom.create('p', 'song-card-key');
    key.textContent = `Key: ${song.key}`;
    
    info.appendChild(title);
    info.appendChild(artist);
    info.appendChild(key);
    
    card.appendChild(img);
    card.appendChild(info);
    
    // Add favorite indicator
    if (this.favorites.includes(song.id)) {
      const favIcon = dom.create('i', 'fa-solid fa-heart favorite-icon');
      card.appendChild(favIcon);
    }
    
    return card;
  }

  toggleFavorite() {
    if (!this.currentSong) return;
    
    const songId = this.currentSong.id;
    const index = this.favorites.indexOf(songId);
    
    if (index > -1) {
      // Remove from favorites
      this.favorites.splice(index, 1);
    } else {
      // Add to favorites
      this.favorites.push(songId);
    }
    
    storage.set('favorites', this.favorites);
    this.updateFavoriteButton();
  }

  updateFavoriteButton() {
    if (!this.likedBtn || !this.currentSong) return;
    
    const icon = this.likedBtn.querySelector('i');
    if (!icon) return;
    
    if (this.favorites.includes(this.currentSong.id)) {
      icon.className = 'fa-solid fa-heart';
      this.likedBtn.style.color = '#ff6b6b';
    } else {
      icon.className = 'fa-regular fa-heart';
      this.likedBtn.style.color = '';
    }
  }

  renderFavorites() {
    // This could be expanded to show a favorites list
    // For now, it just updates the button state
    this.updateFavoriteButton();
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.lyricApp = new LyricApp();
});
