import React from 'react';
import type { Song } from '../../types';
import SongCard from '../SongCard/SongCard';
import styles from './LibraryModal.module.css';

interface LibraryModalProps {
  songs: Song[];
  favorites: string[];
  onClose: () => void;
  onSelectSong: (song: Song) => void;
}

const LibraryModal: React.FC<LibraryModalProps> = ({ songs, favorites, onClose, onSelectSong }) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.libraryModal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Song Library</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.songList}>
          {songs.length === 0 ? (
            <p className={styles.noResults}>No songs found</p>
          ) : (
            songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                isFavorite={favorites.includes(song.id)}
                onClick={() => {
                  onSelectSong(song);
                  onClose();
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryModal;
