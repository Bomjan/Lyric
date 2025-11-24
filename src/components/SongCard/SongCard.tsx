import React from 'react';
import { FaHeart } from 'react-icons/fa';
import type { Song } from '../../types';
import styles from './SongCard.module.css';

interface SongCardProps {
  song: Song;
  isFavorite: boolean;
  onClick: () => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, isFavorite, onClick }) => {
  return (
    <div className={styles.songCard} onClick={onClick}>
      <img src={song.image} alt={song.title} className={styles.songCardImg} />
      <div className={styles.songCardInfo}>
        <h3 className={styles.songCardTitle}>{song.title}</h3>
        <p className={styles.songCardArtist}>{song.artist}</p>
        <p className={styles.songCardKey}>Key: {song.key}</p>
      </div>
      {isFavorite && <FaHeart className={styles.favoriteIcon} />}
    </div>
  );
};

export default SongCard;
