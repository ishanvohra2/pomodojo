<script>
  // Props - functions and data passed from parent
  export let onStartTask;
  export let onViewHistory;
  export let onToggleMusic;
  export let isMusicPlaying;
  export let activeTask = null;
  export let timerState = 'idle';
  export let totalTimeRemaining = 0;
  export let currentSessionRemaining = 0;
  export let taskConfig = {};
  export let onMarkComplete;
  export let onAbortTask;
  export let onExtendTimer;
  export let onSkipFight;
  export let currentEnemy = 1; // Which enemy to show (1, 2, or 3)
  export let heroAnimation = 'idle'; // 'idle', 'attack', 'hurt'
  export let enemyAnimation = 'idle'; // 'idle', 'attack', 'death', 'hurt'
  export let inFightSequence = false; // Whether in dramatic fight sequence
  export let fightStep = 0; // Current step in fight sequence
  
  let extendMinutes = 15; // Default extend time
  
  // Enemy names - each corresponds to procrastination/laziness
  const enemyNames = {
    1: "Lethargoth",  // The dark lord of lethargy and exhaustion
    2: "Inertius",    // The ancient warrior of inaction and stillness
    3: "Malingor"     // The cunning master of excuses and avoidance
  };
  
  // Helper function to format seconds to MM:SS
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  
  // Helper function to format total time remaining
  function formatTotalTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }
</script>

<main>
  <!-- Title and subtitle at top center - Only show when no active task -->
  {#if !activeTask}
    <div class="header">
      <h1>PomoDojo</h1>
      <p class="subtitle">Train your focus, defeat procrastination</p>
    </div>
  {/if}
  
  <!-- Music icon button (top right, left of history) -->
  <button 
    class="music-btn" 
    on:click={onToggleMusic} 
    title="Toggle Music"
    class:playing={isMusicPlaying}
  >
    {isMusicPlaying ? '🔊' : '🔇'}
  </button>
  
  <!-- History icon button (top right) -->
  <button class="history-btn" on:click={onViewHistory} title="View History">
    📜
  </button>
  
  <!-- Skip Fight Button - Show during fight sequence -->
  {#if inFightSequence}
    <button class="skip-fight-btn" on:click={onSkipFight} title="Skip to results">
      ⏭️ Skip Fight
    </button>
  {/if}
  
  <!-- Bottom Container - Horizontal Layout (like LinearLayout) -->
  <div class="bottom-container" class:fighting={inFightSequence && fightStep > 0}>
    <!-- Characters container - holds hero and enemy side by side -->
    <div class="characters-row">
      <!-- Hero character (left) -->
      <div class="hero-container">
        <div class="hero {heroAnimation}"></div>
      </div>
      
      <!-- Enemy character - Only show when task is active -->
      {#if activeTask}
        <div class="enemy-container enemy-container-{currentEnemy}">
          <div class="enemy {enemyAnimation} enemy-{currentEnemy}"></div>
        </div>
      {/if}
    </div>
    
    <!-- Start New Task button - Below characters when no active task -->
    {#if !activeTask}
      <button class="start-task-btn" on:click={onStartTask}>
        ⚔️ Start New Task
      </button>
    {/if}
  </div>
  
  <!-- Conditional rendering for timer HUD -->
  {#if activeTask}
    <!-- Fighting Game HUD - Top of screen -->
    <div class="game-hud">
      <!-- Left: Task Title -->
      <div class="hud-left">
        <div class="player-label">YOU</div>
        <div class="task-title">{activeTask.title}</div>
        {#if activeTask.description}
          <div class="task-desc-small">{activeTask.description}</div>
        {/if}
      </div>
      
      <!-- Center: Timer -->
      <div class="hud-center">
        <div class="status-indicator">
          {#if timerState === 'focus'}
            <span class="status-text focus">FOCUS</span>
          {:else if timerState === 'break'}
            <span class="status-text break">BREAK</span>
          {/if}
        </div>
        <div class="main-timer">{formatTime(currentSessionRemaining)}</div>
        <div class="total-time-bar">
          <div class="time-bar-fill" style="width: {(totalTimeRemaining / (taskConfig.totalFocusTime * 60)) * 100}%"></div>
        </div>
        <div class="total-time-text">Total: {formatTotalTime(totalTimeRemaining)}</div>
      </div>
      
      <!-- Right: Enemy Name -->
      <div class="hud-right">
        <div class="enemy-label">{enemyNames[currentEnemy]?.toUpperCase()}</div>
      </div>
    </div>
    
    <!-- Action Buttons - Bottom Center (Hidden during fight sequence) -->
    {#if !inFightSequence}
      {#if timerState === 'failed'}
        <!-- Failed state - show extend/forfeit options -->
        <div class="action-buttons failed">
          <div class="failed-message">Time's up! Enemy strikes!</div>
          <div class="button-row">
            <input 
              type="number" 
              bind:value={extendMinutes} 
              min="1" 
              class="extend-input"
              placeholder="Minutes"
            />
            <button class="extend-btn" on:click={() => onExtendTimer(extendMinutes)}>
              ⏱️ Extend +{extendMinutes}min
            </button>
            <button class="abort-link" on:click={onAbortTask}>
              ✕ Forfeit
            </button>
          </div>
        </div>
      {:else}
        <!-- Normal state - show complete/abort -->
        <div class="action-buttons">
          <button class="complete-btn" on:click={onMarkComplete}>
            ✓ Complete
          </button>
          <button class="abort-link" on:click={onAbortTask}>
            ✕ Abort
          </button>
        </div>
      {/if}
    {/if}
  {/if}
</main>

<style>
  /* Main container with dojo background */
  main {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-image: url('/assets/bg.jpg');
    background-size: cover;
    background-position: center;
    overflow: hidden;
    font-family: 'Cinzel', 'Georgia', serif;
  }
  
  /* Header section (top center) */
  .header {
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 10;
  }
  
  h1 {
    font-size: 5.5rem;
    color: #FFD700;
    text-shadow: 4px 4px 12px rgba(0, 0, 0, 0.9);
    margin: 0 0 15px 0;
    font-weight: bold;
    letter-spacing: 4px;
    font-family: 'Press Start 2P', 'Cinzel', 'Georgia', serif;
  }
  
  .subtitle {
    font-size: 1.5rem;
    color: #f0f0f0;
    margin: 0;
    font-style: normal;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.9);
    font-weight: 400;
    font-family: 'Press Start 2P', 'Cinzel', 'Georgia', serif;
    line-height: 1.6;
  }
  
  /* Music icon button (bottom right, left of history button) */
  .music-btn {
    position: absolute;
    top: auto;
    bottom: 30px;
    right: 120px; /* Left of history button */
    background: rgba(0, 0, 0, 0.6);
    border: 3px solid rgba(255, 215, 0, 0.5);
    border-radius: 50%;
    width: 70px;
    height: 70px;
    font-size: 32px;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .music-btn:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: #FFD700;
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }
  
  .music-btn.playing {
    border-color: #4caf50;
    box-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
  }
  
  .music-btn.playing:hover {
    border-color: #66bb6a;
  }
  
  .music-btn:active {
    transform: scale(1.05);
  }
  
  /* History icon button (bottom right) */
  .history-btn {
    position: absolute;
    top: auto;
    bottom: 30px;
    right: 30px;
    background: rgba(0, 0, 0, 0.6);
    border: 3px solid rgba(255, 215, 0, 0.5);
    border-radius: 50%;
    width: 70px;
    height: 70px;
    font-size: 32px;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .history-btn:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: #FFD700;
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }
  
  .history-btn:active {
    transform: scale(1.05) rotate(5deg);
  }
  
  /* Skip Fight Button - Center top during fight */
  .skip-fight-btn {
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.9) 0%, rgba(255, 165, 0, 0.9) 100%);
    border: 3px solid #FFD700;
    border-radius: 25px;
    padding: 15px 35px;
    font-size: 1.2rem;
    font-weight: 600;
    color: #1a1a1a;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 200;
    font-family: 'Cinzel', 'Georgia', serif;
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  .skip-fight-btn:hover {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    transform: translateX(-50%) scale(1.05);
    box-shadow: 0 6px 25px rgba(255, 215, 0, 0.6);
  }
  
  .skip-fight-btn:active {
    transform: translateX(-50%) scale(0.98);
  }
  
  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
    }
    50% {
      box-shadow: 0 4px 25px rgba(255, 215, 0, 0.7);
    }
  }
  
  /* Bottom Container - Vertical stacking for all platforms */
  .bottom-container {
    position: absolute;
    bottom: 20%;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 8%;
    z-index: 2;
    gap: 25px;
    transition: all 0.8s ease;
  }
  
  /* Characters row - holds hero and enemy side by side */
  .characters-row {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 0;
    transition: all 0.8s ease;
  }
  
  /* Fighting mode - bring characters closer for dramatic combat */
  .bottom-container.fighting {
    flex-direction: row;
  }
  
  .bottom-container.fighting .characters-row {
    justify-content: center;
    gap: 0px; /* Space between hero and enemy - close combat */
  }
  
  /* Hero container - no positioning needed, flex handles it */
  .hero-container {
    flex-shrink: 0;
    transition: margin 0.8s ease;
  }
  
  /* In fighting mode, move hero closer */
  .fighting .hero-container {
    margin-right: -100px; /* Move right to get closer to enemy */
  }
  
  .hero {
    width: 350px;
    height: 350px;
    background-size: auto 350px;
    image-rendering: pixelated;
  }
  
  /* Hero idle animation - sprite sheet animation */
  .hero.idle {
    background-image: url('/assets/hero/sprites/IDLE.png');
    animation: hero-idle 1s steps(10) infinite;
  }
  
  @keyframes hero-idle {
    from { background-position: 0 0; }
    to { background-position: -3500px 0; } /* 10 frames × 350px */
  }
  
  /* Hero attack animation */
  .hero.attack {
    background-image: url('/assets/hero/sprites/ATTACK 1.png');
    animation: hero-attack 0.7s steps(7) forwards;
  }
  
  @keyframes hero-attack {
    from { background-position: 0 0; }
    to { background-position: -2450px 0; } /* 7 frames × 350px */
  }
  
  /* Hero hurt animation - stays on last frame */
  .hero.hurt {
    background-image: url('/assets/hero/sprites/HURT.png');
    animation: hero-hurt 0.6s steps(3) forwards;
  }
  
  @keyframes hero-hurt {
    from { background-position: 0 0; }
    to { background-position: -1050px 0; } /* 3 frames × 350px */
  }
  
  /* Start New Task button */
  .start-task-btn {
    padding: 30px 55px;
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    background: linear-gradient(135deg, #d32f2f, #b71c1c);
    border: 4px solid #FFD700;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
    font-family: 'Cinzel', 'Georgia', serif;
  }
  
  .start-task-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 30px rgba(255, 215, 0, 0.7);
    background: linear-gradient(135deg, #e53935, #c62828);
    border-color: #FFD700;
  }
  
  .start-task-btn:active {
    transform: scale(1.02);
  }
  
  /* Enemy container - no positioning needed, flex handles it */
  .enemy-container {
    flex-shrink: 0;
    transform: scaleX(-1); /* Flip to face left */
    transition: margin 0.8s ease;
    margin-left: 20px; /* Add some margin from hero */
  }
  
  /* Hero gets margin when enemy is present (during active task) */
  .characters-row .hero-container {
    margin-right: 20px;
  }
  
  /* Enemy-specific vertical alignment adjustments */
  .enemy-container-1 {
    margin-bottom: -140px; /* Enemy 1 alignment */
  }
  
  .enemy-container-2 {
    margin-bottom: -160px; /* Enemy 2 alignment */
  }
  
  .enemy-container-3 {
    margin-bottom: -170px; /* Enemy 3 alignment */
  }
  
  /* In fighting mode, bring enemy much closer with negative margin */
  .fighting .enemy-container {
    margin-left: -250px; /* Overlap to get closer */
  }
  
  .enemy {
    width: 600px;
    height: 600px;
    background-size: auto 600px;
    image-rendering: pixelated;
  }
  
  /* ===== ENEMY ANIMATIONS ===== */
  
  /* Enemy 1 - Idle */
  .enemy.idle.enemy-1 {
    background-image: url('/assets/enemy1/sprites/Idle.png');
    animation: enemy-1-idle 0.8s steps(8) infinite;
  }
  
  @keyframes enemy-1-idle {
    from { background-position: 0 0; }
    to { background-position: -4800px 0; } /* 8 frames × 600px */
  }
  
  /* Enemy 1 - Attack */
  .enemy.attack.enemy-1 {
    background-image: url('/assets/enemy1/sprites/Attack1.png');
    animation: enemy-1-attack 0.8s steps(8) forwards;
  }
  
  @keyframes enemy-1-attack {
    from { background-position: 0 0; }
    to { background-position: -4800px 0; } /* 8 frames × 600px */
  }
  
  /* Enemy 1 - Hurt */
  .enemy.hurt.enemy-1 {
    background-image: url('/assets/enemy1/sprites/Take hit.png');
    animation: enemy-1-hurt 0.5s steps(4) forwards;
  }
  
  @keyframes enemy-1-hurt {
    from { background-position: 0 0; }
    to { background-position: -2400px 0; } /* 4 frames × 600px */
  }
  
  /* Enemy 1 - Death */
  .enemy.death.enemy-1 {
    background-image: url('/assets/enemy1/sprites/Death.png');
    animation: enemy-1-death 1s steps(7) forwards;
  }
  
  @keyframes enemy-1-death {
    from { background-position: 0 0; }
    to { background-position: -4200px 0; } /* 7 frames × 600px */
  }
  
  /* Enemy 2 - Idle */
  .enemy.idle.enemy-2 {
    background-image: url('/assets/enemy2/sprites/Idle.png');
    animation: enemy-2-idle 0.8s steps(8) infinite;
  }
  
  @keyframes enemy-2-idle {
    from { background-position: 0 0; }
    to { background-position: -4800px 0; } /* 8 frames × 600px */
  }
  
  /* Enemy 2 - Attack */
  .enemy.attack.enemy-2 {
    background-image: url('/assets/enemy2/sprites/Attack1.png');
    animation: enemy-2-attack 0.6s steps(5) forwards;
  }
  
  @keyframes enemy-2-attack {
    from { background-position: 0 0; }
    to { background-position: -3000px 0; } /* 5 frames × 600px */
  }
  
  /* Enemy 2 - Hurt */
  .enemy.hurt.enemy-2 {
    background-image: url('/assets/enemy2/sprites/Take hit.png');
    animation: enemy-2-hurt 0.5s steps(3) forwards;
  }
  
  @keyframes enemy-2-hurt {
    from { background-position: 0 0; }
    to { background-position: -1800px 0; } /* 3 frames × 600px */
  }
  
  /* Enemy 2 - Death */
  .enemy.death.enemy-2 {
    background-image: url('/assets/enemy2/sprites/Death.png');
    animation: enemy-2-death 1s steps(8) forwards;
  }
  
  @keyframes enemy-2-death {
    from { background-position: 0 0; }
    to { background-position: -4800px 0; } /* 8 frames × 600px */
  }
  
  /* Enemy 3 - Idle */
  .enemy.idle.enemy-3 {
    background-image: url('/assets/enemy3/sprites/Idle.png');
    animation: enemy-3-idle 0.6s steps(4) infinite;
  }
  
  @keyframes enemy-3-idle {
    from { background-position: 0 0; }
    to { background-position: -2400px 0; } /* 4 frames × 600px */
  }
  
  /* Enemy 3 - Attack */
  .enemy.attack.enemy-3 {
    background-image: url('/assets/enemy3/sprites/Attack1.png');
    animation: enemy-3-attack 0.7s steps(6) forwards;
  }
  
  @keyframes enemy-3-attack {
    from { background-position: 0 0; }
    to { background-position: -3600px 0; } /* 6 frames × 600px */
  }
  
  /* Enemy 3 - Hurt */
  .enemy.hurt.enemy-3 {
    background-image: url('/assets/enemy3/sprites/Take hit.png');
    animation: enemy-3-hurt 0.5s steps(3) forwards;
  }
  
  @keyframes enemy-3-hurt {
    from { background-position: 0 0; }
    to { background-position: -1800px 0; } /* 3 frames × 600px */
  }
  
  /* Enemy 3 - Death */
  .enemy.death.enemy-3 {
    background-image: url('/assets/enemy3/sprites/Death.png');
    animation: enemy-3-death 1s steps(7) forwards;
  }
  
  @keyframes enemy-3-death {
    from { background-position: 0 0; }
    to { background-position: -4200px 0; } /* 7 frames × 600px */
  }
  
  /* Fighting Game HUD - Top of screen */
  .game-hud {
    position: absolute;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 1200px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    z-index: 20;
    gap: 20px;
    
    /* Frosted glass effect */
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 215, 0, 0.2);
    border-radius: 12px;
    padding: 20px 25px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  }
  
  /* Left HUD - Player Info */
  .hud-left {
    flex: 1;
    text-align: left;
  }
  
  .player-label {
    font-size: 0.9rem;
    font-weight: 700;
    color: #FFD700;
    letter-spacing: 2px;
    margin-bottom: 5px;
    font-family: 'Press Start 2P', 'Cinzel', 'Georgia', serif;
  }
  
  .task-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    font-family: 'Cinzel', 'Georgia', serif;
    line-height: 1.2;
  }
  
  .task-desc-small {
    font-size: 0.85rem;
    color: #aaa;
    margin-top: 5px;
    max-width: 300px;
  }
  
  /* Center HUD - Timer */
  .hud-center {
    flex: 0 0 auto;
    text-align: center;
    min-width: 200px;
  }
  
  .status-indicator {
    margin-bottom: 10px;
  }
  
  .status-text {
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 3px;
    padding: 6px 20px;
    border-radius: 20px;
    display: inline-block;
    font-family: 'Press Start 2P', 'Courier New', monospace;
  }
  
  .status-text.focus {
    background: rgba(211, 47, 47, 0.3);
    border: 2px solid #d32f2f;
    color: #ff6b6b;
  }
  
  .status-text.break {
    background: rgba(76, 175, 80, 0.3);
    border: 2px solid #4caf50;
    color: #81c784;
  }
  
  .main-timer {
    font-size: 3.5rem;
    font-weight: 900;
    color: white;
    font-family: 'Press Start 2P', 'Courier New', monospace;
    letter-spacing: 6px;
    text-shadow: 3px 3px 0 #000,
                 0 0 20px rgba(255, 215, 0, 0.6);
    margin: 5px 0;
  }
  
  .total-time-bar {
    width: 100%;
    height: 12px;
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(255, 215, 0, 0.4);
    border-radius: 6px;
    overflow: hidden;
    margin: 10px 0 5px 0;
  }
  
  .time-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #FFD700, #FFA500);
    transition: width 1s linear;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
  }
  
  .total-time-text {
    font-size: 0.8rem;
    color: #999;
    font-weight: 600;
  }
  
  /* Right HUD - Enemy Info */
  .hud-right {
    flex: 1;
    text-align: right;
  }
  
  .enemy-label {
    font-size: 0.9rem;
    font-weight: 700;
    color: #ff6b6b;
    letter-spacing: 2px;
    margin-bottom: 5px;
    font-family: 'Press Start 2P', 'Cinzel', 'Georgia', serif;
  }
  
  /* Action Buttons - Bottom Center */
  .action-buttons {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 15px;
    z-index: 20;
    
    /* Frosted glass effect */
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 15px 20px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
  }
  
  /* Complete Button - Arcade style */
  .complete-btn {
    padding: 14px 35px;
    font-size: 1rem;
    font-weight: 700;
    color: white;
    background: linear-gradient(135deg, #4caf50, #45a049);
    border: 3px solid #FFD700;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Cinzel', 'Georgia', serif;
    box-shadow: 0 4px 0 #2e7d32,
                0 6px 15px rgba(0, 0, 0, 0.4);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .complete-btn:hover {
    background: linear-gradient(135deg, #66bb6a, #4caf50);
    box-shadow: 0 4px 0 #2e7d32,
                0 8px 20px rgba(76, 175, 80, 0.6);
    transform: translateY(-2px);
  }
  
  .complete-btn:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #2e7d32,
                0 3px 10px rgba(0, 0, 0, 0.4);
  }
  
  /* Abort Link - Subtle secondary action */
  .abort-link {
    padding: 14px 30px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #888;
    background: rgba(0, 0, 0, 0.4);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .abort-link:hover {
    color: #ff6b6b;
    border-color: rgba(255, 107, 107, 0.4);
    background: rgba(255, 107, 107, 0.1);
  }
  
  .abort-link:active {
    transform: scale(0.95);
  }
  
  /* Failed State - Extend Timer UI */
  .action-buttons.failed {
    flex-direction: column;
    gap: 12px;
    padding: 20px 25px;
  }
  
  .failed-message {
    font-size: 1.1rem;
    color: #ff6b6b;
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .button-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  .extend-input {
    width: 80px;
    padding: 12px;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    border: 2px solid #FFD700;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
  }
  
  .extend-input:focus {
    outline: none;
    border-color: #FFA500;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
  }
  
  .extend-btn {
    padding: 14px 25px;
    font-size: 0.95rem;
    font-weight: 700;
    color: white;
    background: linear-gradient(135deg, #FFA500, #FF8C00);
    border: 3px solid #FFD700;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Cinzel', 'Georgia', serif;
    box-shadow: 0 4px 0 #CC7000,
                0 6px 15px rgba(0, 0, 0, 0.4);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .extend-btn:hover {
    background: linear-gradient(135deg, #FFB52E, #FFA500);
    box-shadow: 0 4px 0 #CC7000,
                0 8px 20px rgba(255, 165, 0, 0.6);
    transform: translateY(-2px);
  }
  
  .extend-btn:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #CC7000,
                0 3px 10px rgba(0, 0, 0, 0.4);
  }
  
  /* ===== RESPONSIVE DESIGN - MEDIA QUERIES ===== */
  
  /* Tablet and smaller screens */
  @media (max-width: 768px) {
    /* Header - Reduce title size */
    .header {
      top: 20px;
    }
    
    h1 {
      font-size: 3rem;
      letter-spacing: 2px;
      margin: 0 0 8px 0;
    }
    
    .subtitle {
      font-size: 1rem;
    }
    
    /* Music and History buttons - Smaller for tablet */
    .music-btn,
    .history-btn {
      width: 50px;
      height: 50px;
      font-size: 24px;
      bottom: 20px;
      border-width: 2px;
    }
    
    .music-btn {
      right: 85px;
    }
    
    .history-btn {
      right: 20px;
    }
    
    /* Skip fight button */
    .skip-fight-btn {
      top: 20px;
      padding: 10px 20px;
      font-size: 0.9rem;
    }
    
    /* Game HUD - Smaller */
    .game-hud {
      top: 80px;
      width: 95%;
      padding: 15px;
      gap: 10px;
    }
    
    .task-title {
      font-size: 1.1rem;
    }
    
    .task-desc-small {
      font-size: 0.75rem;
      max-width: 200px;
    }
    
    .player-label,
    .enemy-label {
      font-size: 0.75rem;
    }
    
    .main-timer {
      font-size: 2.5rem;
      letter-spacing: 4px;
    }
    
    .status-text {
      font-size: 0.75rem;
      padding: 4px 12px;
    }
    
    /* Bottom container - adjust for tablet */
    .bottom-container {
      bottom: 10%;
      gap: 20px;
      padding: 0 5%;
    }
    
    /* Characters row - adjust spacing */
    .characters-row {
      gap: 15px;
    }
    
    /* Fighting mode adjustments for tablet */
    .fighting .hero-container {
      margin-right: -50px;
    }
    
    .fighting .enemy-container {
      margin-left: -150px;
    }
    
    /* Enemy container adjustments */
    .enemy-container-1 {
      margin-bottom: -100px;
    }
    
    .enemy-container-2 {
      margin-bottom: -110px;
    }
    
    .enemy-container-3 {
      margin-bottom: -120px;
    }
    
    /* Characters - Smaller */
    .hero {
      width: 250px;
      height: 250px;
      background-size: auto 250px;
    }
    
    /* Update hero animations for smaller size */
    @keyframes hero-idle {
      from { background-position: 0 0; }
      to { background-position: -2500px 0; } /* 10 frames × 250px */
    }
    
    @keyframes hero-attack {
      from { background-position: 0 0; }
      to { background-position: -1750px 0; } /* 7 frames × 250px */
    }
    
    @keyframes hero-hurt {
      from { background-position: 0 0; }
      to { background-position: -750px 0; } /* 3 frames × 250px */
    }
    
    .enemy {
      width: 400px;
      height: 400px;
      background-size: auto 400px;
    }
    
    /* Update enemy animations for smaller size */
    @keyframes enemy-1-idle {
      from { background-position: 0 0; }
      to { background-position: -3200px 0; } /* 8 frames × 400px */
    }
    
    @keyframes enemy-1-attack {
      from { background-position: 0 0; }
      to { background-position: -3200px 0; }
    }
    
    @keyframes enemy-1-hurt {
      from { background-position: 0 0; }
      to { background-position: -1600px 0; } /* 4 frames × 400px */
    }
    
    @keyframes enemy-1-death {
      from { background-position: 0 0; }
      to { background-position: -2800px 0; } /* 7 frames × 400px */
    }
    
    @keyframes enemy-2-idle {
      from { background-position: 0 0; }
      to { background-position: -3200px 0; }
    }
    
    @keyframes enemy-2-attack {
      from { background-position: 0 0; }
      to { background-position: -2000px 0; } /* 5 frames × 400px */
    }
    
    @keyframes enemy-2-hurt {
      from { background-position: 0 0; }
      to { background-position: -1200px 0; } /* 3 frames × 400px */
    }
    
    @keyframes enemy-2-death {
      from { background-position: 0 0; }
      to { background-position: -3200px 0; }
    }
    
    @keyframes enemy-3-idle {
      from { background-position: 0 0; }
      to { background-position: -1600px 0; } /* 4 frames × 400px */
    }
    
    @keyframes enemy-3-attack {
      from { background-position: 0 0; }
      to { background-position: -2400px 0; } /* 6 frames × 400px */
    }
    
    @keyframes enemy-3-hurt {
      from { background-position: 0 0; }
      to { background-position: -1200px 0; }
    }
    
    @keyframes enemy-3-death {
      from { background-position: 0 0; }
      to { background-position: -2800px 0; }
    }
    
    /* Start button */
    .start-task-btn {
      padding: 20px 35px;
      font-size: 1.1rem;
    }
    
    /* Action buttons */
    .action-buttons {
      bottom: 20px;
      padding: 12px 15px;
    }
    
    .complete-btn {
      padding: 12px 25px;
      font-size: 0.9rem;
    }
    
    .abort-link {
      padding: 12px 20px;
      font-size: 0.75rem;
    }
    
    .extend-btn {
      padding: 12px 20px;
      font-size: 0.85rem;
    }
    
    .extend-input {
      width: 70px;
      padding: 10px;
      font-size: 0.9rem;
    }
    
    .failed-message {
      font-size: 0.95rem;
    }
  }
  
  /* Mobile phones - Portrait */
  @media (max-width: 480px) {
    /* Use portrait background for mobile */
    main {
      background-image: url('/assets/bg_portrait.jpg');
    }
    
    /* Header - Even smaller */
    .header {
      top: 15px;
    }
    
    h1 {
      font-size: 2rem;
      letter-spacing: 1px;
      margin: 0 0 5px 0;
    }
    
    .subtitle {
      font-size: 0.75rem;
    }
    
    /* Music and History buttons - Smaller for mobile */
    .music-btn,
    .history-btn {
      width: 40px;
      height: 40px;
      font-size: 20px;
      bottom: 15px;
      border-width: 2px;
    }
    
    .music-btn {
      right: 65px;
    }
    
    .history-btn {
      right: 15px;
    }
    
    /* Skip fight button */
    .skip-fight-btn {
      top: 15px;
      padding: 8px 15px;
      font-size: 0.75rem;
      border-width: 2px;
    }
    
    /* Game HUD - Compact */
    .game-hud {
      top: 60px;
      width: 98%;
      padding: 10px;
      gap: 8px;
      flex-direction: column;
      align-items: center;
    }
    
    .hud-left,
    .hud-right {
      text-align: center;
      width: 100%;
    }
    
    .hud-center {
      width: 100%;
      min-width: auto;
    }
    
    .task-title {
      font-size: 0.9rem;
    }
    
    .task-desc-small {
      font-size: 0.65rem;
      max-width: 100%;
    }
    
    .player-label,
    .enemy-label {
      font-size: 0.65rem;
      letter-spacing: 1px;
    }
    
    .main-timer {
      font-size: 2rem;
      letter-spacing: 3px;
    }
    
    .status-text {
      font-size: 0.65rem;
      padding: 3px 10px;
      letter-spacing: 2px;
    }
    
    .total-time-bar {
      height: 8px;
    }
    
    .total-time-text {
      font-size: 0.7rem;
    }
    
    /* Bottom container - adjust for mobile */
    .bottom-container {
      bottom: 8%;
      gap: 15px;
      padding: 0 3%;
    }
    
    /* Characters row - adjust spacing */
    .characters-row {
      gap: 10px;
    }
    
    /* Fighting mode adjustments for mobile */
    .fighting .hero-container {
      margin-right: -30px;
    }
    
    .fighting .enemy-container {
      margin-left: -100px;
    }
    
    /* Enemy container adjustments for mobile */
    .enemy-container-1 {
      margin-bottom: -70px;
    }
    
    .enemy-container-2 {
      margin-bottom: -80px;
    }
    
    .enemy-container-3 {
      margin-bottom: -85px;
    }
    
    /* Characters - Much smaller for mobile */
    .hero {
      width: 180px;
      height: 180px;
      background-size: auto 180px;
    }
    
    /* Update hero animations for mobile size */
    @keyframes hero-idle {
      from { background-position: 0 0; }
      to { background-position: -1800px 0; } /* 10 frames × 180px */
    }
    
    @keyframes hero-attack {
      from { background-position: 0 0; }
      to { background-position: -1260px 0; } /* 7 frames × 180px */
    }
    
    @keyframes hero-hurt {
      from { background-position: 0 0; }
      to { background-position: -540px 0; } /* 3 frames × 180px */
    }
    
    .enemy {
      width: 280px;
      height: 280px;
      background-size: auto 280px;
    }
    
    /* Update enemy animations for mobile size */
    @keyframes enemy-1-idle {
      from { background-position: 0 0; }
      to { background-position: -2240px 0; } /* 8 frames × 280px */
    }
    
    @keyframes enemy-1-attack {
      from { background-position: 0 0; }
      to { background-position: -2240px 0; }
    }
    
    @keyframes enemy-1-hurt {
      from { background-position: 0 0; }
      to { background-position: -1120px 0; } /* 4 frames × 280px */
    }
    
    @keyframes enemy-1-death {
      from { background-position: 0 0; }
      to { background-position: -1960px 0; } /* 7 frames × 280px */
    }
    
    @keyframes enemy-2-idle {
      from { background-position: 0 0; }
      to { background-position: -2240px 0; }
    }
    
    @keyframes enemy-2-attack {
      from { background-position: 0 0; }
      to { background-position: -1400px 0; } /* 5 frames × 280px */
    }
    
    @keyframes enemy-2-hurt {
      from { background-position: 0 0; }
      to { background-position: -840px 0; } /* 3 frames × 280px */
    }
    
    @keyframes enemy-2-death {
      from { background-position: 0 0; }
      to { background-position: -2240px 0; }
    }
    
    @keyframes enemy-3-idle {
      from { background-position: 0 0; }
      to { background-position: -1120px 0; } /* 4 frames × 280px */
    }
    
    @keyframes enemy-3-attack {
      from { background-position: 0 0; }
      to { background-position: -1680px 0; } /* 6 frames × 280px */
    }
    
    @keyframes enemy-3-hurt {
      from { background-position: 0 0; }
      to { background-position: -840px 0; }
    }
    
    @keyframes enemy-3-death {
      from { background-position: 0 0; }
      to { background-position: -1960px 0; }
    }
    
    /* Start button */
    .start-task-btn {
      padding: 15px 25px;
      font-size: 0.9rem;
      border-width: 3px;
    }
    
    /* Action buttons */
    .action-buttons {
      bottom: 15px;
      padding: 10px 12px;
      gap: 10px;
    }
    
    .complete-btn {
      padding: 10px 20px;
      font-size: 0.8rem;
      border-width: 2px;
    }
    
    .abort-link {
      padding: 10px 15px;
      font-size: 0.7rem;
    }
    
    .action-buttons.failed {
      padding: 15px 18px;
    }
    
    .button-row {
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }
    
    .extend-input {
      width: 100%;
      padding: 10px;
      font-size: 0.85rem;
    }
    
    .extend-btn {
      width: 100%;
      padding: 10px 18px;
      font-size: 0.8rem;
      border-width: 2px;
    }
    
    .abort-link {
      width: 100%;
    }
    
    .failed-message {
      font-size: 0.85rem;
    }
  }
  
  /* Very small phones - Extra compact */
  @media (max-width: 360px) {
    h1 {
      font-size: 1.5rem;
    }
    
    .subtitle {
      font-size: 0.65rem;
    }
    
    .music-btn,
    .history-btn {
      width: 35px;
      height: 35px;
      font-size: 18px;
    }
    
    .music-btn {
      right: 55px;
    }
    
    .history-btn {
      right: 10px;
    }
    
    .main-timer {
      font-size: 1.6rem;
    }
    
    .hero {
      width: 140px;
      height: 140px;
      background-size: auto 140px;
    }
    
    .enemy {
      width: 220px;
      height: 220px;
      background-size: auto 220px;
    }
  }
</style>

