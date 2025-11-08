// Audio Manager - Centralized music control
class AudioManager {
  constructor() {
    this.audio = null;
    this.currentStation = null;
    this.volume = 0.3; // Default 30% volume
    this.isMuted = false;
    this.isPlaying = false;
  }

  stations = [
    {
      id: 'dojo',
      name: 'Dojo Meditation',
      description: 'Deep ambient drones',
      url: 'https://ice1.somafm.com/dronezone-128-mp3',
      icon: '🎎'
    },
    {
      id: 'focus',
      name: 'Focus Training',
      description: 'Chill electronica',
      url: 'https://ice1.somafm.com/groovesalad-128-mp3',
      icon: '📚'
    },
    {
      id: 'arcade',
      name: 'Arcade Mode',
      description: 'Electronic beats',
      url: 'https://ice1.somafm.com/defcon-128-mp3',
      icon: '🎮'
    }
  ];

  init() {
    this.audio = new Audio();
    this.audio.volume = this.volume;
    this.audio.preload = 'none';
    
    // Handle stream errors
    this.audio.addEventListener('error', (e) => {
      console.error('Audio stream error:', e);
    });

    // Handle when audio starts playing
    this.audio.addEventListener('playing', () => {
      console.log('Audio playing:', this.getCurrentStation()?.name);
    });
  }

  play(stationId) {
    const station = this.stations.find(s => s.id === stationId);
    if (!station) return;

    // If switching stations, stop current
    if (this.currentStation !== stationId) {
      this.stop();
      this.currentStation = stationId;
      this.audio.src = station.url;
    }

    this.audio.play()
      .then(() => {
        this.isPlaying = true;
      })
      .catch(err => {
        console.error('Playback failed:', err);
      });
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.src = '';
      this.isPlaying = false;
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol)); // Clamp 0-1
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audio) {
      this.audio.muted = this.isMuted;
    }
    return this.isMuted;
  }

  getCurrentStation() {
    return this.stations.find(s => s.id === this.currentStation);
  }

  cleanup() {
    this.stop();
    if (this.audio) {
      this.audio = null;
    }
  }
}

// Export singleton instance
export const audioManager = new AudioManager();

