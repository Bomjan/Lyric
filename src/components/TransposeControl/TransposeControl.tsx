import React from 'react';
import { FaPlus, FaMinus, FaUndo } from 'react-icons/fa';
import { getIntervalName } from '../../utils/transpose';
import styles from './TransposeControl.module.css';

interface TransposeControlProps {
  originalKey: string;
  transposedKey: string;
  transposeSteps: number;
  onTranspose: (steps: number) => void;
  onReset: () => void;
}

const TransposeControl: React.FC<TransposeControlProps> = ({
  originalKey,
  transposedKey,
  transposeSteps,
  onTranspose,
  onReset,
}) => {
  return (
    <div className={styles.controls}>
      <div className={styles.header}>
        <h3>Transpose</h3>
      </div>

      <div className={styles.keyDisplay}>
        <div className={styles.keyInfo}>
          <span className={styles.label}>Original:</span>
          <span className={styles.key}>{originalKey}</span>
        </div>
        {transposeSteps !== 0 && (
          <div className={styles.keyInfo}>
            <span className={styles.label}>Current:</span>
            <span className={`${styles.key} ${styles.transposed}`}>{transposedKey}</span>
          </div>
        )}
      </div>

      <div className={styles.buttons}>
        <button
          className={styles.transposeBtn}
          onClick={() => onTranspose(transposeSteps - 1)}
          disabled={transposeSteps <= -11}
        >
          <FaMinus />
        </button>
        <div className={styles.stepDisplay}>
          <div className={styles.stepValue}>
            {transposeSteps > 0 ? '+' : ''}{transposeSteps}
          </div>
          <div className={styles.intervalName}>
            {getIntervalName(transposeSteps)}
          </div>
        </div>
        <button
          className={styles.transposeBtn}
          onClick={() => onTranspose(transposeSteps + 1)}
          disabled={transposeSteps >= 11}
        >
          <FaPlus />
        </button>
      </div>

      {transposeSteps !== 0 && (
        <button className={styles.resetBtn} onClick={onReset}>
          <FaUndo />
          <span>Reset to Original</span>
        </button>
      )}

      <div className={styles.hint}>
        <small>Transpose to match your vocal range</small>
      </div>
    </div>
  );
};

export default TransposeControl;
