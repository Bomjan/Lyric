import React from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import styles from './PlaybackControls.module.css';

interface PlaybackControlsProps {
  isPlaying: boolean;
  speed: number;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
}

const SPEED_PRESETS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  speed,
  onTogglePlay,
  onSpeedChange,
}) => {
  return (
    <div className={styles.controls}>
      <div className={styles.header}>
        <h3>Playback</h3>
      </div>

      <button className={styles.playButton} onClick={onTogglePlay}>
        {isPlaying ? <FaPause /> : <FaPlay />}
        <span>{isPlaying ? 'Pause' : 'Play'} Auto-Scroll</span>
      </button>

      <div className={styles.speedControl}>
        <label>Speed: {speed}x</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.25"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.presets}>
        {SPEED_PRESETS.map((preset) => (
          <button
            key={preset}
            className={`${styles.presetBtn} ${speed === preset ? styles.active : ''}`}
            onClick={() => onSpeedChange(preset)}
          >
            {preset}x
          </button>
        ))}
      </div>

      <div className={styles.hint}>
        <small>Tip: Press Space to play/pause</small>
      </div>
    </div>
  );
};

export default PlaybackControls;
