import React from 'react';
import cChordImage from '../../assets/c-chord.webp';
import styles from './ChordContainer.module.css';

interface ChordContainerProps {
  currentChordName: string;
}

const ChordContainer: React.FC<ChordContainerProps> = ({ currentChordName }) => {
  return (
    <div className={styles.chordContainer}>
      <div className={styles.chords}>
        <div className={styles.currentChord}>
          <img src={cChordImage} alt="current chord" />
        </div>
        <div className={styles.nextChord}>
          <img src={cChordImage} alt="next chord" />
        </div>
      </div>
      <div className={styles.currentChordName}>{currentChordName}</div>
    </div>
  );
};

export default ChordContainer;
