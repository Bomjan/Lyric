import { useState, useEffect, useCallback } from 'react';
import type { Song, Settings } from './types';
import { songs as songsData } from './data/songs';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header/Header';
import Meta from './components/Meta/Meta';
import LyricContainer from './components/LyricContainer/LyricContainer';
import ChordContainer from './components/ChordContainer/ChordContainer';
import LibraryModal from './components/LibraryModal/LibraryModal';
import './App.css';

function App() {
  const [songs] = useState<Song[]>(songsData);
  const [currentSong, setCurrentSong] = useState<Song>(songsData[0]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(songsData);

  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
  const [lastPlayed, setLastPlayed] = useLocalStorage<string>('lastPlayed', songsData[0].id);
  const [settings] = useLocalStorage<Settings>('settings', {
    autoScroll: false,
    scrollSpeed: 1,
    fontSize: 19,
    instrument: 'guitar',
  });

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
        if (nextIndex >= currentSong.lyrics.length) {
          setIsPlaying(false);
          return 0;
        }
        return nextIndex;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, currentSong, settings.scrollSpeed]);

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
          setCurrentLineIndex((prev) => Math.min(currentSong.lyrics.length - 1, prev + 1));
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
  }, [currentSong]);

  const loadSong = useCallback((song: Song) => {
    setCurrentSong(song);
    setCurrentLineIndex(0);
    setIsPlaying(false);
    setLastPlayed(song.id);
  }, [setLastPlayed]);

  const toggleFavorite = useCallback(() => {
    setFavorites((prev: string[]) => {
      if (prev.includes(currentSong.id)) {
        return prev.filter((id: string) => id !== currentSong.id);
      } else {
        return [...prev, currentSong.id];
      }
    });
  }, [currentSong, setFavorites]);

  const handleLineClick = useCallback((index: number) => {
    setCurrentLineIndex(index);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowLibrary(true);
    }
  }, []);

  const currentChordName = currentSong.lyrics[currentLineIndex]?.chord || 'N/A';

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
        <Meta
          title={currentSong.title}
          artist={currentSong.artist}
          image={currentSong.image}
          songKey={currentSong.key}
        />
        <LyricContainer
          title={currentSong.title}
          artist={currentSong.artist}
          lyrics={currentSong.lyrics}
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
    </div>
  );
}

export default App;
