<script>
  // Props - functions and data passed from parent
  export let onStartTask;
  export let onViewHistory;
  export let activeTask = null;
  export let timerState = 'idle';
  export let totalTimeRemaining = 0;
  export let currentSessionRemaining = 0;
  export let taskConfig = {};
  export let onMarkComplete;
  export let onAbortTask;
  export let onExtendTimer;
  export let currentEnemy = 1; // Which enemy to show (1, 2, or 3)
  export let heroAnimation = 'idle'; // 'idle', 'attack', 'hurt'
  export let enemyAnimation = 'idle'; // 'idle', 'attack', 'death'
  
  let extendMinutes = 15; // Default extend time
  
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
  
  <!-- History icon button (top right) -->
  <button class="history-btn" on:click={onViewHistory} title="View History">
    📜
  </button>
  
  <!-- Bottom Container - Horizontal Layout (like LinearLayout) -->
  <div class="bottom-container" class:combat={activeTask}>
    <!-- Hero character (left) -->
    <div class="hero-container">
      <div class="hero {heroAnimation}"></div>
    </div>
    
    <!-- Right side - Either button or enemy based on state -->
    <div class="right-container">
      {#if !activeTask}
        <!-- Start New Task button - Only show when no active task -->
        <button class="start-task-btn" on:click={onStartTask}>
          ⚔️ Start New Task
        </button>
      {:else}
        <!-- Enemy character - Only show when task is active -->
        <div class="enemy-container">
          <div class="enemy {enemyAnimation} enemy-{currentEnemy}"></div>
        </div>
      {/if}
    </div>
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
        <div class="enemy-label">PROCRASTINATION</div>
      </div>
    </div>
    
    <!-- Action Buttons - Bottom Center -->
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
  }
  
  .subtitle {
    font-size: 1.5rem;
    color: #f0f0f0;
    margin: 0;
    font-style: italic;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.9);
    font-weight: 300;
  }
  
  /* History icon button (top right) */
  .history-btn {
    position: absolute;
    top: 30px;
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
  
  /* Bottom Container - Flexbox (like Android LinearLayout horizontal) */
  .bottom-container {
    position: absolute;
    bottom: 20%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end; /* Align to bottom baseline */
    padding: 0 8%;
    z-index: 2;
    transition: all 0.5s ease;
  }
  
  /* Combat mode - bring characters closer */
  .bottom-container.combat {
    justify-content: center;
    gap: 0px; /* Space between hero and enemy - close combat */
    padding: 0; /* Remove side padding to center properly */
  }
  
  /* Hero container - no positioning needed, flex handles it */
  .hero-container {
    flex-shrink: 0;
    transition: margin 0.5s ease;
  }
  
  /* In combat mode, move hero closer */
  .combat .hero-container {
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
  
  /* Right container - holds either button or enemy */
  .right-container {
    flex-shrink: 0;
    display: flex;
    align-items: flex-end;
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
    margin-bottom: -170px; /* Push down to align character feet with hero */
    transition: margin 0.5s ease;
  }
  
  /* In combat mode, bring enemy much closer with negative margin */
  .combat .enemy-container {
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
    font-family: 'Cinzel', 'Georgia', serif;
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
    font-family: 'Courier New', monospace;
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
    font-family: 'Cinzel', 'Georgia', serif;
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
</style>

