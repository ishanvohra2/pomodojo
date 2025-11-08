<script>
  import { audioManager } from '../utils/audioManager.js';
  
  export let show = false;
  export let onClose;
  export let currentStation;
  export let isPlaying;
  export let volume;
  export let isMuted;
  
  let stations = audioManager.stations;
  let localVolume = volume;
  
  function handleStationSelect(stationId) {
    audioManager.play(stationId);
    // Small delay to let audio start, then close
    setTimeout(() => {
      onClose();
    }, 300);
  }
  
  function handleVolumeChange(e) {
    localVolume = parseFloat(e.target.value);
    audioManager.setVolume(localVolume);
  }
  
  function handleToggleMute() {
    audioManager.toggleMute();
  }
  
  function handleStop() {
    audioManager.stop();
    onClose();
  }
</script>

{#if show}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-overlay" on:click={onClose}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-content" on:click|stopPropagation>
      <div class="modal-header">
        <h2>🎵 Music Control</h2>
        <button class="close-btn" on:click={onClose}>✕</button>
      </div>
      
      <div class="modal-body">
        <!-- Current Status -->
        <div class="status-section">
          {#if isPlaying}
            <div class="now-playing">
              ▶️ Now Playing: <strong>{audioManager.getCurrentStation()?.name || 'None'}</strong>
            </div>
          {:else}
            <div class="now-playing inactive">⏸️ No music playing</div>
          {/if}
        </div>
        
        <!-- Volume Control -->
        <div class="volume-section">
          <label for="volume-slider">Volume</label>
          <div class="volume-control">
            <button class="mute-btn" on:click={handleToggleMute}>
              {isMuted ? '🔇' : '🔊'}
            </button>
            <input 
              id="volume-slider"
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={localVolume}
              on:input={handleVolumeChange}
              class="volume-slider"
              aria-label="Volume control"
            />
            <span class="volume-text">{Math.round(localVolume * 100)}%</span>
          </div>
        </div>
        
        <!-- Station Selection -->
        <div class="stations-section">
          <h3>Select Station</h3>
          <div class="stations-grid">
            {#each stations as station}
              <button 
                class="station-card"
                class:active={currentStation === station.id}
                on:click={() => handleStationSelect(station.id)}
              >
                <div class="station-icon">{station.icon}</div>
                <div class="station-name">{station.name}</div>
                <div class="station-desc">{station.description}</div>
              </button>
            {/each}
          </div>
        </div>
        
        <!-- Stop Button -->
        {#if isPlaying}
          <button class="stop-btn" on:click={handleStop}>
            ⏹️ Stop Music
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border: 3px solid #FFD700;
    border-radius: 20px;
    padding: 0;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
    font-family: 'Cinzel', 'Georgia', serif;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 30px;
    border-bottom: 2px solid rgba(255, 215, 0, 0.3);
  }
  
  .modal-header h2 {
    margin: 0;
    color: #FFD700;
    font-size: 1.8rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }
  
  .close-btn {
    background: transparent;
    border: none;
    color: #999;
    font-size: 2rem;
    cursor: pointer;
    transition: all 0.2s;
    padding: 0;
    width: 40px;
    height: 40px;
  }
  
  .close-btn:hover {
    color: #ff6b6b;
    transform: rotate(90deg);
  }
  
  .modal-body {
    padding: 30px;
  }
  
  .status-section {
    margin-bottom: 25px;
  }
  
  .now-playing {
    background: rgba(76, 175, 80, 0.2);
    border: 2px solid #4caf50;
    padding: 15px;
    border-radius: 10px;
    color: #81c784;
    text-align: center;
    font-size: 1.1rem;
  }
  
  .now-playing.inactive {
    background: rgba(100, 100, 100, 0.2);
    border-color: #666;
    color: #999;
  }
  
  .volume-section {
    margin-bottom: 30px;
  }
  
  .volume-section label {
    display: block;
    color: #FFD700;
    font-size: 1rem;
    margin-bottom: 12px;
    font-weight: 600;
  }
  
  .volume-control {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .mute-btn {
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(255, 215, 0, 0.3);
    border-radius: 8px;
    font-size: 1.5rem;
    width: 50px;
    height: 50px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .mute-btn:hover {
    border-color: #FFD700;
    background: rgba(0, 0, 0, 0.7);
  }
  
  .volume-slider {
    flex: 1;
    height: 8px;
    border-radius: 4px;
    background: rgba(255, 215, 0, 0.2);
    outline: none;
    appearance: none;
    -webkit-appearance: none;
  }
  
  .volume-slider::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #FFD700;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
  
  .volume-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #FFD700;
    cursor: pointer;
    border: none;
  }
  
  .volume-text {
    color: white;
    font-size: 1rem;
    min-width: 50px;
    font-family: 'Courier New', monospace;
  }
  
  .stations-section h3 {
    color: #FFD700;
    font-size: 1.2rem;
    margin-bottom: 15px;
  }
  
  .stations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .station-card {
    background: rgba(0, 0, 0, 0.4);
    border: 2px solid rgba(255, 215, 0, 0.3);
    border-radius: 12px;
    padding: 20px 15px;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;
  }
  
  .station-card:hover {
    border-color: #FFD700;
    background: rgba(0, 0, 0, 0.6);
    transform: translateY(-3px);
    box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
  }
  
  .station-card.active {
    border-color: #4caf50;
    background: rgba(76, 175, 80, 0.2);
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.4);
  }
  
  .station-icon {
    font-size: 3rem;
    margin-bottom: 10px;
  }
  
  .station-name {
    color: white;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 5px;
  }
  
  .station-desc {
    color: #aaa;
    font-size: 0.75rem;
  }
  
  .stop-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #d32f2f, #b71c1c);
    border: 2px solid rgba(255, 107, 107, 0.5);
    border-radius: 10px;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Cinzel', 'Georgia', serif;
  }
  
  .stop-btn:hover {
    background: linear-gradient(135deg, #e53935, #c62828);
    border-color: #ff6b6b;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(211, 47, 47, 0.4);
  }
</style>

