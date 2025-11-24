import React from 'react';
import styles from './Meta.module.css';

interface MetaProps {
  title: string;
  artist: string;
  image: string;
  songKey: string;
}

const Meta: React.FC<MetaProps> = ({ title, artist, image, songKey }) => {
  return (
    <div className={styles.meta}>
      <h1 className={styles.songTitle}>{title}</h1>
      <h2 className={styles.artistName}>{artist}</h2>
      <img src={image} alt={title} />
      <h2 className={styles.key}>
        Key: <span>{songKey}</span>
      </h2>
    </div>
  );
};

export default Meta;
