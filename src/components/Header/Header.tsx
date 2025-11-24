import React from 'react';
import { FaHeart, FaRegHeart, FaMusic } from 'react-icons/fa';
import styles from './Header.module.css';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenLibrary: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  isFavorite,
  onToggleFavorite,
  onOpenLibrary,
}) => {
  return (
    <header className={styles.header}>
      <h1 onClick={() => window.location.reload()}>Bomjan Lyrics</h1>
      <input
        type="text"
        name="search"
        id="search"
        placeholder="Search your lyrics"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className={styles.liked} onClick={onToggleFavorite} style={{ color: isFavorite ? '#ff6b6b' : '' }}>
        {isFavorite ? <FaHeart /> : <FaRegHeart />}
      </div>
      <div className={styles.library} title="Song Library (L)" onClick={onOpenLibrary}>
        <FaMusic />
      </div>
    </header>
  );
};

export default Header;
