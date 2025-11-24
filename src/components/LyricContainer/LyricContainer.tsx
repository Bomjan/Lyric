import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import type { Lyric } from '../../types';
import styles from './LyricContainer.module.css';

interface LyricContainerProps {
  title: string;
  artist: string;
  lyrics: Lyric[];
  currentLineIndex: number;
  onLineClick: (index: number) => void;
}

const LyricContainer: React.FC<LyricContainerProps> = ({
  title,
  artist,
  lyrics,
  currentLineIndex,
  onLineClick,
}) => {
  const activeLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll the active line into view smoothly
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentLineIndex]);

  return (
    <div className={styles.lyricContainer}>
      <h2 className={styles.songTitle}>
        {title} | {artist}
      </h2>
      <div className={styles.lyricBox}>
        {lyrics.map((lyric, index) => (
          <div
            key={index}
            ref={index === currentLineIndex ? activeLineRef : null}
            className={classNames(styles.lyricLine, {
              [styles.active]: index === currentLineIndex,
            })}
            onClick={() => onLineClick(index)}
          >
            {lyric.chord && lyric.chord !== '' && (
              <>
                <span className={styles.chordIndicator}>{lyric.chord}</span>
                <br />
              </>
            )}
            {lyric.line || '\u00A0'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LyricContainer;
