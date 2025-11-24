export interface Lyric {
  line: string;
  chord: string;
  time: number;
}

export interface Chord {
  name: string;
  guitar: number[];
  piano: string[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  key: string;
  tempo: number;
  image: string;
  tags: string[];
  lyrics: Lyric[];
  chords: Chord[];
}

export interface Settings {
  autoScroll: boolean;
  scrollSpeed: number;
  fontSize: number;
  instrument: 'guitar' | 'piano';
}
