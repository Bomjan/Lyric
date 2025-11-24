# Bomjan Lyrics

A professional, feature-rich lyrics and chord viewer designed specifically for guitarists and singers. Built with React, TypeScript, and Vite for a modern, type-safe development experience.

![Bomjan Lyrics](src/assets/screenshot.png)

## Features

### Core Functionality
- **Synchronized Lyrics Display** - View lyrics with real-time highlighting
- **Interactive Chord Diagrams** - Visual guitar chord representations
- **Auto-Scroll** - Automatic lyric scrolling with adjustable speed
- **Chord Indicators** - See which chord plays with each lyric line
- **Song Transpose** - Change key up/down by semitones to match your vocal range
- **Playback Speed Control** - Adjust auto-scroll speed from 0.5x to 2x with visual controls

### Song Management
- **Powerful Search** - Search by song title, artist, or tags
- **Song Library** - Beautiful modal with all your songs
- **Favorites System** - Save your favorite songs with one click
- **Persistent Storage** - Your preferences and favorites are saved locally

### Keyboard Shortcuts
- `Space` - Play/Pause auto-scroll
- `↑` - Previous lyric line
- `↓` - Next lyric line
- `L` - Open song library
- `F` - Toggle favorite for current song

### Modern UI/UX
- **Glassmorphism Design** - Modern, sleek interface with backdrop blur
- **Smooth Animations** - Polished transitions and micro-interactions
- **Toast Notifications** - Instant visual feedback for all actions
- **Responsive Layout** - Works perfectly on desktop, tablet, and mobile
- **Dark Theme** - Easy on the eyes for long practice sessions
- **CSS Modules** - Scoped styling with no conflicts

## Tech Stack

- **React 18** - Modern UI library with hooks
- **TypeScript** - Type safety and better developer experience
- **Vite** - Lightning-fast build tool and dev server
- **CSS Modules** - Scoped component styling
- **React Icons** - Beautiful icon library

## Project Structure

```
src/
├── components/          # React components
│   ├── Header/         # Search, favorites, library controls
│   ├── Meta/           # Song information display
│   ├── LyricContainer/ # Auto-scrolling lyrics
│   ├── ChordContainer/ # Chord diagrams
│   ├── LibraryModal/   # Song selection modal
│   ├── SongCard/       # Individual song cards
│   ├── PlaybackControls/ # Speed and playback controls
│   ├── TransposeControl/ # Key transposition controls
│   └── Toast/          # Notification system
├── data/               # Song data (TypeScript)
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions (transpose, etc.)
├── assets/             # Images and static files
├── App.tsx             # Main application component
├── App.css             # App-specific styles
├── index.css           # Global styles
└── main.tsx            # Application entry point
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bomjan/Lyric.git
   cd Lyric
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage Guide

### Viewing Lyrics
1. The app loads with a default song
2. Click on any lyric line to jump to that position
3. Use the arrow keys to navigate line by line
4. Press `Space` to start/stop auto-scroll

### Searching for Songs
1. Type in the search bar at the top
2. Search works across song titles, artists, and tags
3. Results appear in real-time in the library modal

### Managing Your Library
1. Click the music icon or press `L` to open the library
2. Browse all available songs in a beautiful grid
3. Click any song card to load it
4. Songs marked with ❤️ are in your favorites

### Saving Favorites
1. Click the heart icon in the header
2. Or press `F` on your keyboard
3. Favorites are saved automatically to localStorage
4. View all favorites in the library (marked with ❤️)

## Adding New Songs

Songs are defined in [`src/data/songs.ts`](src/data/songs.ts). To add a new song:

1. Import the album image (if new):
   ```typescript
   import newSongImage from '../assets/new-song.webp';
   ```

2. Add the song object to the `songs` array:
   ```typescript
   {
     id: 'unique-song-id',
     title: 'Song Title',
     artist: 'Artist Name',
     key: 'C maj',
     tempo: 120,
     image: newSongImage,
     tags: ['genre', 'mood'],
     lyrics: [
       { line: 'First line', chord: 'C', time: 0 },
       { line: 'Second line', chord: 'G', time: 4 }
     ],
     chords: [
       { name: 'C', guitar: [0, 3, 2, 0, 1, 0], piano: ['C', 'E', 'G'] }
     ]
   }
   ```

## Type Definitions

The app uses TypeScript for type safety. Key interfaces:

```typescript
interface Song {
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

interface Lyric {
  line: string;
  chord: string;
  time: number;
}

interface Chord {
  name: string;
  guitar: number[];
  piano: string[];
}
```

## Customization

### Changing Colors
Edit the CSS in component modules or `src/index.css`:

```css
/* Main colors used throughout */
--primary: #2aa59c;
--secondary: #147171;
--accent: #e4d66a;
--background: #111717;
```

### Adjusting Auto-Scroll Speed
In `src/App.tsx`, modify the `settings` default:

```typescript
const [settings] = useLocalStorage<Settings>('settings', {
  autoScroll: false,
  scrollSpeed: 1,  // Change this (0.5 = slower, 2 = faster)
  fontSize: 19,
  instrument: 'guitar'
});
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

The project uses:
- **TypeScript** for type checking
- **ESLint** for code linting
- **CSS Modules** for scoped styling
- **Vite** for fast builds

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Mobile Support

The app is fully responsive and works great on:
- Smartphones (320px and up)
- Tablets (768px and up)
- Desktops (1024px and up)

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- React Icons for the beautiful icons
- Google Fonts for the Inter typeface
- All the musicians who inspire us to create

## Contact

For questions, suggestions, or feedback:
- GitHub: [@Bomjan](https://github.com/Bomjan)
- Email: sundrabomjan@gmail.com

---

**Made with ❤️ for guitarists and singers everywhere**
