// Transpose utility for changing song keys

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_TO_SHARP: Record<string, string> = {
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#',
};

/**
 * Transpose a chord by a given number of semitones
 * @param chord - The chord to transpose (e.g., "C", "Am", "F#m7")
 * @param semitones - Number of semitones to transpose (-11 to +11)
 * @returns The transposed chord
 */
export function transposeChord(chord: string, semitones: number): string {
  if (!chord || chord.trim() === '') return chord;

  // Extract the root note and the rest (quality, extensions, etc.)
  const match = chord.match(/^([A-G][#b]?)(.*)/);
  if (!match) return chord;

  let [, root, suffix] = match;

  // Convert flats to sharps for consistency
  if (root in FLAT_TO_SHARP) {
    root = FLAT_TO_SHARP[root];
  }

  // Find the index of the root note
  const rootIndex = NOTES.indexOf(root);
  if (rootIndex === -1) return chord;

  // Calculate the new index (wrap around using modulo)
  const newIndex = (rootIndex + semitones + 12) % 12;
  const newRoot = NOTES[newIndex];

  return newRoot + suffix;
}

/**
 * Transpose a key signature
 * @param key - The key to transpose (e.g., "C maj", "Am", "F# min")
 * @param semitones - Number of semitones to transpose
 * @returns The transposed key
 */
export function transposeKey(key: string, semitones: number): string {
  const parts = key.split(' ');
  const root = parts[0];
  const quality = parts.slice(1).join(' ');

  const transposedRoot = transposeChord(root, semitones);
  return quality ? `${transposedRoot} ${quality}` : transposedRoot;
}

/**
 * Get the interval name for a number of semitones
 * @param semitones - Number of semitones
 * @returns Interval description
 */
export function getIntervalName(semitones: number): string {
  const abs = Math.abs(semitones);
  const direction = semitones > 0 ? 'up' : 'down';

  const intervals: Record<number, string> = {
    0: 'Original key',
    1: `1 semitone ${direction}`,
    2: `1 whole tone ${direction}`,
    3: `Minor 3rd ${direction}`,
    4: `Major 3rd ${direction}`,
    5: `Perfect 4th ${direction}`,
    6: `Tritone ${direction}`,
    7: `Perfect 5th ${direction}`,
    8: `Minor 6th ${direction}`,
    9: `Major 6th ${direction}`,
    10: `Minor 7th ${direction}`,
    11: `Major 7th ${direction}`,
  };

  return intervals[abs] || `${abs} semitones ${direction}`;
}
