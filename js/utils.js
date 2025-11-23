// Utility Functions for Lyric Application

// Local Storage Helpers
const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Chord Transposition
const chordUtils = {
  notes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  
  transpose: (chord, semitones) => {
    if (!chord || chord === '') return '';
    
    // Extract the root note and the rest (e.g., "Am" -> "A" + "m")
    const match = chord.match(/^([A-G][#b]?)(.*)/);
    if (!match) return chord;
    
    let [, root, suffix] = match;
    
    // Convert flat to sharp
    if (root.includes('b')) {
      const flatToSharp = {
        'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
      };
      root = flatToSharp[root] || root;
    }
    
    // Find current position
    const currentIndex = chordUtils.notes.indexOf(root);
    if (currentIndex === -1) return chord;
    
    // Calculate new position
    let newIndex = (currentIndex + semitones) % 12;
    if (newIndex < 0) newIndex += 12;
    
    return chordUtils.notes[newIndex] + suffix;
  },

  getCapoPosition: (fromKey, toKey) => {
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const fromIndex = keys.indexOf(fromKey.replace(/\s*(maj|min|major|minor)/i, '').trim());
    const toIndex = keys.indexOf(toKey.replace(/\s*(maj|min|major|minor)/i, '').trim());
    
    if (fromIndex === -1 || toIndex === -1) return 0;
    
    let capo = toIndex - fromIndex;
    if (capo < 0) capo += 12;
    
    return capo;
  }
};

// Time Formatting
const timeUtils = {
  formatTime: (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  parseTime: (timeString) => {
    const [mins, secs] = timeString.split(':').map(Number);
    return (mins * 60) + secs;
  }
};

// Debounce Function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle Function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// DOM Helpers
const dom = {
  create: (tag, className = '', attributes = {}) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  },

  show: (element) => {
    if (element) element.style.display = '';
  },

  hide: (element) => {
    if (element) element.style.display = 'none';
  },

  toggle: (element) => {
    if (!element) return;
    element.style.display = element.style.display === 'none' ? '' : 'none';
  },

  addClass: (element, className) => {
    if (element) element.classList.add(className);
  },

  removeClass: (element, className) => {
    if (element) element.classList.remove(className);
  },

  toggleClass: (element, className) => {
    if (element) element.classList.toggle(className);
  },

  hasClass: (element, className) => {
    return element ? element.classList.contains(className) : false;
  }
};

// Animation Helpers
const animate = {
  fadeIn: (element, duration = 300) => {
    if (!element) return;
    element.style.opacity = 0;
    element.style.display = '';
    
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      element.style.opacity = Math.min(progress / duration, 1);
      
      if (progress < duration) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  },

  fadeOut: (element, duration = 300) => {
    if (!element) return;
    
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      element.style.opacity = Math.max(1 - (progress / duration), 0);
      
      if (progress < duration) {
        requestAnimationFrame(step);
      } else {
        element.style.display = 'none';
      }
    };
    requestAnimationFrame(step);
  },

  slideDown: (element, duration = 300) => {
    if (!element) return;
    element.style.height = '0';
    element.style.overflow = 'hidden';
    element.style.display = '';
    
    const targetHeight = element.scrollHeight;
    let start = null;
    
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      element.style.height = Math.min((progress / duration) * targetHeight, targetHeight) + 'px';
      
      if (progress < duration) {
        requestAnimationFrame(step);
      } else {
        element.style.height = '';
        element.style.overflow = '';
      }
    };
    requestAnimationFrame(step);
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { storage, chordUtils, timeUtils, debounce, throttle, dom, animate };
}
