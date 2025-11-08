// Audio Manager - Centralized music control
class AudioManager {
  constructor() {
    this.audio = null;
    this.fightAudio = null;
    this.streamUrl = 'https://ec3.yesstreaming.net:3755/stream';
    // Use relative path that works with Vite's asset handling
    this.fightMusicUrl = new URL('../../assets/audio/fight.mp3', import.meta.url).href;
    this.volume = 1.0; // Default 100% volume
    this.isPlaying = false;
    this.isFightMusicPlaying = false;
    this.wasPlayingBeforeFight = false;
    this.fadeInterval = null;
    this.fadeDuration = 500; // Fade duration in milliseconds
  }

  init() {
    this.audio = new Audio();
    this.audio.volume = this.volume;
    this.audio.preload = 'none';
    this.audio.src = this.streamUrl;
    
    // Handle stream errors
    this.audio.addEventListener('error', (e) => {
      console.error('Audio stream error:', e);
    });

    // Handle when audio starts playing
    this.audio.addEventListener('playing', () => {
      console.log('Audio playing');
    });

    // Initialize fight audio
    this.fightAudio = new Audio();
    this.fightAudio.volume = this.volume;
    this.fightAudio.loop = true; // Loop the fight music during battle
    this.fightAudio.preload = 'auto'; // Preload fight music for immediate playback
    this.fightAudio.src = this.fightMusicUrl;
    this.fightAudio.addEventListener('error', (e) => {
      console.error('Fight audio error:', e);
      console.error('Fight audio URL:', this.fightMusicUrl);
    });
    this.fightAudio.addEventListener('canplaythrough', () => {
      console.log('Fight audio loaded and ready');
    });
  }

  // Fade out the current audio
  fadeOut() {
    return new Promise((resolve) => {
      if (!this.audio || !this.isPlaying) {
        resolve();
        return;
      }

      const startVolume = this.audio.volume;
      const fadeStep = startVolume / (this.fadeDuration / 50); // Update every 50ms
      
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
      }

      this.fadeInterval = setInterval(() => {
        if (this.audio.volume > fadeStep) {
          this.audio.volume = Math.max(0, this.audio.volume - fadeStep);
        } else {
          this.audio.volume = 0;
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
          resolve();
        }
      }, 50);
    });
  }

  // Fade in the new audio
  fadeIn() {
    return new Promise((resolve) => {
      if (!this.audio || !this.isPlaying) {
        resolve();
        return;
      }

      const targetVolume = this.volume;
      const fadeStep = targetVolume / (this.fadeDuration / 50); // Update every 50ms
      
      this.audio.volume = 0;

      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
      }

      this.fadeInterval = setInterval(() => {
        if (this.audio.volume < targetVolume - fadeStep) {
          this.audio.volume = Math.min(targetVolume, this.audio.volume + fadeStep);
        } else {
          this.audio.volume = targetVolume;
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
          resolve();
        }
      }, 50);
    });
  }

  async play() {
    if (this.isPlaying) return;

    // Play and fade in
    try {
      await this.audio.play();
      this.isPlaying = true;
      await this.fadeIn();
    } catch (err) {
      console.error('Playback failed:', err);
      this.isPlaying = false;
    }
  }

  async toggle() {
    if (this.isPlaying) {
      await this.stop();
    } else {
      await this.play();
    }
  }

  async playFightMusic() {
    console.log('playFightMusic called');
    console.log('Fight audio URL:', this.fightMusicUrl);
    console.log('Fight audio element:', this.fightAudio);
    
    // Remember if main music was playing
    this.wasPlayingBeforeFight = this.isPlaying;
    console.log('Was playing before fight:', this.wasPlayingBeforeFight);
    
    // Stop main music if playing (no fade for immediate switch)
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
      console.log('Main music paused');
    }

    // Play fight music
    try {
      this.fightAudio.currentTime = 0; // Start from beginning
      console.log('About to play fight music...');
      await this.fightAudio.play();
      this.isFightMusicPlaying = true;
      console.log('Fight music started successfully!');
    } catch (err) {
      console.error('Fight music playback failed:', err);
      console.error('Error details:', err.name, err.message);
    }
  }

  // Fade out fight music
  fadeFightMusic() {
    return new Promise((resolve) => {
      if (!this.fightAudio || !this.isFightMusicPlaying) {
        resolve();
        return;
      }

      const startVolume = this.fightAudio.volume;
      const fadeStep = startVolume / (this.fadeDuration / 50);
      
      const fightFadeInterval = setInterval(() => {
        if (this.fightAudio.volume > fadeStep) {
          this.fightAudio.volume = Math.max(0, this.fightAudio.volume - fadeStep);
        } else {
          this.fightAudio.volume = 0;
          clearInterval(fightFadeInterval);
          resolve();
        }
      }, 50);
    });
  }

  async restoreMainMusic() {
    console.log('restoreMainMusic called');
    console.log('Is fight music playing:', this.isFightMusicPlaying);
    console.log('Was playing before fight:', this.wasPlayingBeforeFight);
    
    // Fade out and stop fight music
    if (this.isFightMusicPlaying) {
      await this.fadeFightMusic();
      this.fightAudio.pause();
      this.fightAudio.currentTime = 0;
      this.fightAudio.volume = this.volume; // Reset volume for next fight
      this.isFightMusicPlaying = false;
      console.log('Fight music faded out and stopped');
    }

    // Restore main music if it was playing before
    if (this.wasPlayingBeforeFight) {
      await this.play();
      console.log('Main music restored');
    } else {
      console.log('Main music was not playing before fight, not restoring');
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  async stop() {
    if (this.audio) {
      // Fade out before stopping
      if (this.isPlaying) {
        await this.fadeOut();
      }
      
      this.audio.pause();
      this.isPlaying = false;
      
      // Reset volume to default for next play
      this.audio.volume = this.volume;
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol)); // Clamp 0-1
    if (this.audio && !this.fadeInterval) {
      // If not currently fading, update volume immediately
      this.audio.volume = this.volume;
    }
  }

  async cleanup() {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    await this.stop();
    if (this.audio) {
      this.audio = null;
    }
    if (this.fightAudio) {
      this.fightAudio.pause();
      this.fightAudio = null;
    }
  }
}

// Export singleton instance
export const audioManager = new AudioManager();

