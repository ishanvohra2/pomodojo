<script>
  import { onDestroy, onMount } from 'svelte';
  import HomePage from './components/HomePage.svelte';
  import TaskModal from './components/TaskModal.svelte';
  import HistoryView from './components/HistoryView.svelte';
  import MusicModal from './components/MusicModal.svelte';
  import { audioManager } from './utils/audioManager.js';
  
  // App state
  let showTaskModal = false;
  let showHistoryView = false;
  let showMusicModal = false;
  let activeTask = null; // Stores current task data
  let timerState = 'idle'; // 'idle', 'focus', 'break', 'completed', 'failed'
  let currentEnemy = 1; // Random enemy (1, 2, or 3)
  let taskHistory = []; // Array of completed/aborted tasks
  
  // Animation states
  let heroAnimation = 'idle'; // 'idle', 'attack', 'hurt'
  let enemyAnimation = 'idle'; // 'idle', 'attack', 'death', 'hurt'
  
  // Fight sequence state
  let inFightSequence = false; // Whether we're in the dramatic fight sequence
  let fightStep = 0; // Current step in the fight sequence
  
  // Timer variables
  let totalTimeRemaining = 0; // Total mission time in seconds
  let currentSessionRemaining = 0; // Current focus/break session in seconds
  let timerInterval = null;
  
  // Task configuration (stored from modal)
  let taskConfig = {
    title: '',
    description: '',
    totalFocusTime: 0,
    focusSessionLength: 0,
    breakDuration: 0
  };
  
  // Music state
  let musicState = {
    currentStation: null,
    isPlaying: false,
    volume: 0.3,
    isMuted: false
  };
  
  // Event handlers
  function handleStartTask() {
    showTaskModal = true;
  }
  
  function handleCloseModal() {
    showTaskModal = false;
  }
  
  function handleTaskSubmit(taskData) {
    console.log('Task submitted:', taskData);
    
    // Randomly select enemy (1, 2, or 3)
    currentEnemy = Math.floor(Math.random() * 3) + 1;
    console.log('Enemy selected:', currentEnemy);
    
    // Reset animations to idle for new task
    heroAnimation = 'idle';
    enemyAnimation = 'idle';
    
    // Store task configuration
    taskConfig = taskData;
    activeTask = {
      ...taskData,
      startTime: Date.now(),
      status: 'in-progress'
    };
    
    // Initialize timer
    totalTimeRemaining = taskData.totalFocusTime * 60; // Convert to seconds
    currentSessionRemaining = taskData.focusSessionLength * 60; // Start with focus session
    timerState = 'focus';
    
    // Start the countdown
    startTimer();
    
    showTaskModal = false;
  }
  
  function startTimer() {
    // Clear any existing timer
    if (timerInterval) clearInterval(timerInterval);
    
    // Countdown every second
    timerInterval = setInterval(() => {
      if (currentSessionRemaining > 0) {
        currentSessionRemaining--;
        totalTimeRemaining--;
        
        // Check if total time is up
        if (totalTimeRemaining <= 0) {
          handleTimerComplete();
          return;
        }
      } else {
        // Session complete, switch between focus and break
        if (timerState === 'focus') {
          // Start break
          timerState = 'break';
          currentSessionRemaining = taskConfig.breakDuration * 60;
        } else {
          // Break done, start new focus session
          timerState = 'focus';
          currentSessionRemaining = taskConfig.focusSessionLength * 60;
        }
      }
    }, 1000);
  }
  
  function handleTimerComplete() {
    clearInterval(timerInterval);
    
    // Start fight sequence - player loses this one
    startFightSequence(false);
    
    console.log('Timer ran out! Starting fight sequence - player loses');
  }
  
  function handleMarkComplete() {
    clearInterval(timerInterval);
    
    // Start fight sequence - player wins this one
    startFightSequence(true);
    
    console.log('Task completed! Starting fight sequence - player wins');
  }
  
  // Dramatic fight sequence with multiple steps
  function startFightSequence(playerWins) {
    inFightSequence = true;
    fightStep = 0;
    
    // Step 1: Characters move closer to center (0.8s)
    setTimeout(() => {
      fightStep = 1; // This will trigger CSS transition to move characters
      
      // Step 2: Player attacks (1.2s after moving)
      setTimeout(() => {
        heroAnimation = 'attack';
        
        // Enemy gets hurt after attack animation plays out (delay for impact)
        setTimeout(() => {
          enemyAnimation = 'hurt';
        }, 500); // Delay for attack to land
        
        // Step 3: Reset to idle, then enemy attacks, player hurts (1.8s after player attack)
        setTimeout(() => {
          heroAnimation = 'idle';
          enemyAnimation = 'idle';
          
          setTimeout(() => {
            enemyAnimation = 'attack';
            
            // Player gets hurt after enemy attack lands
            setTimeout(() => {
              heroAnimation = 'hurt';
            }, 400); // Delay for attack to land
            
            // Step 4: Final outcome (1.5s after player hurt)
            setTimeout(() => {
              if (playerWins) {
                // Player wins: Hero attacks
                heroAnimation = 'attack';
                
                // Enemy dies after hero's attack lands
                setTimeout(() => {
                  enemyAnimation = 'death';
                  
                  // Complete the task and reset immediately after death animation
                  setTimeout(() => {
                    activeTask.status = 'completed';
                    activeTask.endTime = Date.now();
                    saveToHistory(activeTask);
                    
                    // Reset immediately to avoid awkward idle frame
                    resetTimer();
                  }, 1000); // Time for death animation to complete
                }, 500); // Delay for final attack to land
              } else {
                // Player loses: Enemy attacks again
                enemyAnimation = 'attack';
                
                // Player hurt after enemy attack lands
                setTimeout(() => {
                  heroAnimation = 'hurt';
                  timerState = 'failed';
                  
                  // Mark task as failed and save to history
                  activeTask.status = 'failed';
                  activeTask.endTime = Date.now();
                  saveToHistory(activeTask);
                  
                  // Reset animations but keep in failed state to show extend options
                  setTimeout(() => {
                    enemyAnimation = 'idle';
                    inFightSequence = false;
                  }, 800);
                }, 400); // Delay for attack to land
              }
            }, 1500);
          }, 500);
        }, 1800);
      }, 1200);
    }, 800);
  }
  
  function handleAbortTask() {
    clearInterval(timerInterval);
    activeTask.status = 'aborted';
    activeTask.endTime = Date.now();
    
    // Save to history with aborted status
    console.log('Task aborted:', activeTask);
    saveToHistory(activeTask);
    
    // Reset to idle state
    resetTimer();
  }
  
  function resetTimer() {
    activeTask = null;
    timerState = 'idle';
    totalTimeRemaining = 0;
    currentSessionRemaining = 0;
    heroAnimation = 'idle';
    enemyAnimation = 'idle';
    inFightSequence = false;
    fightStep = 0;
    taskConfig = {
      title: '',
      description: '',
      totalFocusTime: 0,
      focusSessionLength: 0,
      breakDuration: 0
    };
  }
  
  function handleExtendTimer(additionalMinutes) {
    // Add time to the timer
    const additionalSeconds = additionalMinutes * 60;
    totalTimeRemaining += additionalSeconds;
    
    // Reset animations to idle
    heroAnimation = 'idle';
    enemyAnimation = 'idle';
    timerState = 'focus';
    inFightSequence = false;
    fightStep = 0;
    
    // Restart timer if it was stopped
    if (!timerInterval) {
      startTimer();
    }
    
    console.log(`Extended timer by ${additionalMinutes} minutes`);
  }
  
  function handleViewHistory() {
    console.log('View history clicked');
    showHistoryView = true;
  }
  
  function handleCloseHistory() {
    showHistoryView = false;
  }
  
  function handleOpenMusic() {
    showMusicModal = true;
    // Update music state from manager
    updateMusicState();
  }
  
  function handleCloseMusic() {
    showMusicModal = false;
    // Sync state after modal closes
    updateMusicState();
  }
  
  function updateMusicState() {
    musicState = {
      currentStation: audioManager.currentStation,
      isPlaying: audioManager.isPlaying,
      volume: audioManager.volume,
      isMuted: audioManager.isMuted
    };
  }
  
  // Save task to history (localStorage)
  function saveToHistory(task) {
    taskHistory = [...taskHistory, task];
    localStorage.setItem('pomodojo_history', JSON.stringify(taskHistory));
    console.log('Task saved to history:', task);
  }
  
  // Load history from localStorage on mount
  function loadHistory() {
    const savedHistory = localStorage.getItem('pomodojo_history');
    if (savedHistory) {
      try {
        taskHistory = JSON.parse(savedHistory);
        console.log('Loaded history:', taskHistory.length, 'tasks');
      } catch (e) {
        console.error('Failed to parse history:', e);
        taskHistory = [];
      }
    }
  }
  
  // Load history when component mounts
  onMount(() => {
    loadHistory();
    audioManager.init();
  });
  
  // Cleanup timer on component destroy
  onDestroy(() => {
    if (timerInterval) clearInterval(timerInterval);
    audioManager.cleanup();
  });
</script>

<!-- Render HomePage component and pass event handlers as props -->
<HomePage 
  onStartTask={handleStartTask}
  onViewHistory={handleViewHistory}
  onOpenMusic={handleOpenMusic}
  musicState={musicState}
  activeTask={activeTask}
  timerState={timerState}
  totalTimeRemaining={totalTimeRemaining}
  currentSessionRemaining={currentSessionRemaining}
  taskConfig={taskConfig}
  onMarkComplete={handleMarkComplete}
  onAbortTask={handleAbortTask}
  onExtendTimer={handleExtendTimer}
  currentEnemy={currentEnemy}
  heroAnimation={heroAnimation}
  enemyAnimation={enemyAnimation}
  inFightSequence={inFightSequence}
  fightStep={fightStep}
/>

<!-- Render TaskModal component and pass props -->
<TaskModal 
  show={showTaskModal}
  onClose={handleCloseModal}
  onSubmit={handleTaskSubmit}
/>

<!-- Render HistoryView component -->
<HistoryView
  show={showHistoryView}
  onClose={handleCloseHistory}
  history={taskHistory}
/>

<!-- Render MusicModal component -->
<MusicModal
  show={showMusicModal}
  onClose={handleCloseMusic}
  currentStation={musicState.currentStation}
  isPlaying={musicState.isPlaying}
  volume={musicState.volume}
  isMuted={musicState.isMuted}
/>

<style>
  /* Global styles for the app can go here */
</style>

