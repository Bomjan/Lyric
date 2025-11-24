import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Song, Settings, Lyric } from './types';
import { songs as songsData } from './data/songs';
import { useLocalStorage } from './hooks/useLocalStorage';
import { transposeChord, transposeKey } from './utils/transpose';
import Header from './components/Header/Header';
import Meta from './components/Meta/Meta';
import LyricContainer from './components/LyricContainer/LyricContainer';
import ChordContainer from './components/ChordContainer/ChordContainer';
import LibraryModal from './components/LibraryModal/LibraryModal';
import PlaybackControls from './components/PlaybackControls/PlaybackControls';
import TransposeControl from './components/TransposeControl/TransposeControl';
import Toast from './components/Toast/Toast';
import './App.css';

interface ToastMessage {
  id: number;
  message: string;
  type?: 'success' | 'info' | 'error';
  icon?: 'check' | 'heart' | 'music' | 'error';
}

function App() {
  const [songs] = useState<Song[]>(songsData);
  const [currentSong, setCurrentSong] = useState<Song>(songsData[0]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(songsData);
  const [transposeSteps, setTransposeSteps] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
  const [lastPlayed, setLastPlayed] = useLocalStorage<string>('lastPlayed', songsData[0].id);
  const [settings, setSettings] = useLocalStorage<Settings>('settings', {
    autoScroll: false,
    scrollSpeed: 1,
    fontSize: 19,
    instrument: 'guitar',
  });

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info', icon?: 'check' | 'heart' | 'music' | 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, icon }]);
  }, []);

  // Remove toast
  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Transpose current song
  const transposedSong = useMemo(() => {
    if (transposeSteps === 0) return currentSong;

    const transposedLyrics: Lyric[] = currentSong.lyrics.map((lyric) => ({
      ...lyric,
      chord: lyric.chord ? transposeChord(lyric.chord, transposeSteps) : lyric.chord,
    }));

    return {
      ...currentSong,
      key: transposeKey(currentSong.key, transposeSteps),
      lyrics: transposedLyrics,
    };
  }, [currentSong, transposeSteps]);

  // Load last played song on mount
  useEffect(() => {
    const song = songs.find((s) => s.id === lastPlayed) || songs[0];
    setCurrentSong(song);
  }, []);

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSongs(songs);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.tags.some((tag) => tag.toLowerCase().includes(query))
    );
    setFilteredSongs(results);
  }, [searchQuery, songs]);

  // Auto-scroll playback
  useEffect(() => {
    if (!isPlaying) return;

    const interval = 3000 / settings.scrollSpeed;
    const timer = setInterval(() => {
      setCurrentLineIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= transposedSong.lyrics.length) {
          setIsPlaying(false);
          return 0;
        }
        return nextIndex;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, transposedSong, settings.scrollSpeed]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('input, textarea')) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setCurrentLineIndex((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setCurrentLineIndex((prev) => Math.min(transposedSong.lyrics.length - 1, prev + 1));
          break;
        case 'KeyL':
          e.preventDefault();
          setShowLibrary(true);
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFavorite();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [transposedSong]);

  const loadSong = useCallback((song: Song) => {
    setCurrentSong(song);
    setCurrentLineIndex(0);
    setIsPlaying(false);
    setTransposeSteps(0);
    setLastPlayed(song.id);
  }, [setLastPlayed]);

  const toggleFavorite = useCallback(() => {
    setFavorites((prev: string[]) => {
      const isFavorite = prev.includes(currentSong.id);
      if (isFavorite) {
        showToast('Removed from favorites', 'info', 'heart');
        return prev.filter((id: string) => id !== currentSong.id);
      } else {
        showToast('Added to favorites', 'success', 'heart');
        return [...prev, currentSong.id];
      }
    });
  }, [currentSong, setFavorites, showToast]);

  const handleLineClick = useCallback((index: number) => {
    setCurrentLineIndex(index);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowLibrary(true);
    }
  }, []);

  const handleSpeedChange = useCallback((speed: number) => {
    setSettings((prev) => ({ ...prev, scrollSpeed: speed }));
    showToast(`Playback speed: ${speed}x`, 'info', 'check');
  }, [setSettings, showToast]);

  const handleTranspose = useCallback((steps: number) => {
    setTransposeSteps(steps);
    if (steps !== 0) {
      const newKey = transposeKey(currentSong.key, steps);
      showToast(`Transposed to ${newKey}`, 'success', 'music');
    }
  }, [currentSong.key, showToast]);

  const handleResetTranspose = useCallback(() => {
    setTransposeSteps(0);
    showToast('Reset to original key', 'info', 'check');
  }, [showToast]);

  const currentChordName = transposedSong.lyrics[currentLineIndex]?.chord || 'N/A';

  return (
    <div className="app">
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        isFavorite={favorites.includes(currentSong.id)}
        onToggleFavorite={toggleFavorite}
        onOpenLibrary={() => setShowLibrary(true)}
      />
      <main>
        <div className="meta-section">
          <Meta
            title={currentSong.title}
            artist={currentSong.artist}
            image={currentSong.image}
            songKey={transposedSong.key}
          />
          <PlaybackControls
            isPlaying={isPlaying}
            speed={settings.scrollSpeed}
            onTogglePlay={() => setIsPlaying((prev) => !prev)}
            onSpeedChange={handleSpeedChange}
          />
          <TransposeControl
            originalKey={currentSong.key}
            transposedKey={transposedSong.key}
            transposeSteps={transposeSteps}
            onTranspose={handleTranspose}
            onReset={handleResetTranspose}
          />
        </div>
        <LyricContainer
          title={currentSong.title}
          artist={currentSong.artist}
          lyrics={transposedSong.lyrics}
          currentLineIndex={currentLineIndex}
          onLineClick={handleLineClick}
        />
        <ChordContainer currentChordName={currentChordName} />
      </main>
      {showLibrary && (
        <LibraryModal
          songs={filteredSongs}
          favorites={favorites}
          onClose={() => {
            setShowLibrary(false);
            setSearchQuery('');
          }}
          onSelectSong={loadSong}
        />
      )}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          icon={toast.icon}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default App;
