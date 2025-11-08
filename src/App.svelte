<script>
  import { onDestroy, onMount } from 'svelte';
  import HomePage from './components/HomePage.svelte';
  import TaskModal from './components/TaskModal.svelte';
  import HistoryView from './components/HistoryView.svelte';
  import { audioManager } from './utils/audioManager.js';
  
  // App state
  let showTaskModal = false;
  let showHistoryView = false;
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
  let fightTimeouts = []; // Store timeout IDs for cleanup/skip
  let currentFightResult = null; // Store whether player wins or loses
  
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
  
  // Music state - simple boolean
  let isMusicPlaying = false;
  
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
  
  // Helper function to end the fight and show results
  function endFightSequence(playerWins) {
    // Clear any remaining timeouts
    fightTimeouts.forEach(id => clearTimeout(id));
    fightTimeouts = [];
    
    if (playerWins) {
      activeTask.status = 'completed';
      activeTask.endTime = Date.now();
      saveToHistory(activeTask);
      
      // Restore main music after fight
      audioManager.restoreMainMusic().then(() => {
        isMusicPlaying = audioManager.isPlaying;
      });
      
      // Reset immediately
      resetTimer();
    } else {
      timerState = 'failed';
      activeTask.status = 'failed';
      activeTask.endTime = Date.now();
      saveToHistory(activeTask);
      
      // Restore main music after fight
      audioManager.restoreMainMusic().then(() => {
        isMusicPlaying = audioManager.isPlaying;
      });
      
      // Reset animations but keep in failed state to show extend options
      enemyAnimation = 'idle';
      heroAnimation = 'idle';
      inFightSequence = false;
    }
  }

  // Skip fight sequence - jump to end
  function handleSkipFight() {
    console.log('Skipping fight sequence');
    endFightSequence(currentFightResult);
  }

  // Extended fight sequence - now 20 seconds with more back and forth
  function startFightSequence(playerWins) {
    inFightSequence = true;
    fightStep = 0;
    currentFightResult = playerWins;
    fightTimeouts = []; // Reset timeouts array
    
    // Start fight music
    audioManager.playFightMusic();
    
    // Step 1: Characters move closer to center (1s)
    fightTimeouts.push(setTimeout(() => {
      fightStep = 1;
      
      // Step 2: Player attacks (1.5s)
      fightTimeouts.push(setTimeout(() => {
        heroAnimation = 'attack';
        fightTimeouts.push(setTimeout(() => {
          enemyAnimation = 'hurt';
        }, 500));
        
        // Step 3: Enemy counters (2.5s)
        fightTimeouts.push(setTimeout(() => {
          heroAnimation = 'idle';
          enemyAnimation = 'idle';
          
          fightTimeouts.push(setTimeout(() => {
            enemyAnimation = 'attack';
            fightTimeouts.push(setTimeout(() => {
              heroAnimation = 'hurt';
            }, 400));
            
            // Step 4: Player attacks again (2.5s)
            fightTimeouts.push(setTimeout(() => {
              heroAnimation = 'idle';
              enemyAnimation = 'idle';
              
              fightTimeouts.push(setTimeout(() => {
                heroAnimation = 'attack';
                fightTimeouts.push(setTimeout(() => {
                  enemyAnimation = 'hurt';
                }, 500));
                
                // Step 5: Enemy attacks again (2.5s)
                fightTimeouts.push(setTimeout(() => {
                  heroAnimation = 'idle';
                  enemyAnimation = 'idle';
                  
                  fightTimeouts.push(setTimeout(() => {
                    enemyAnimation = 'attack';
                    fightTimeouts.push(setTimeout(() => {
                      heroAnimation = 'hurt';
                    }, 400));
                    
                    // Step 6: Another exchange (2.5s)
                    fightTimeouts.push(setTimeout(() => {
                      heroAnimation = 'idle';
                      enemyAnimation = 'idle';
                      
                      fightTimeouts.push(setTimeout(() => {
                        heroAnimation = 'attack';
                        fightTimeouts.push(setTimeout(() => {
                          enemyAnimation = 'hurt';
                        }, 500));
                        
                        // Step 7: Final outcome (3s)
                        fightTimeouts.push(setTimeout(() => {
                          heroAnimation = 'idle';
                          enemyAnimation = 'idle';
                          
                          fightTimeouts.push(setTimeout(() => {
                            if (playerWins) {
                              // Player wins: Final attack
                              heroAnimation = 'attack';
                              fightTimeouts.push(setTimeout(() => {
                                enemyAnimation = 'death';
                                
                                fightTimeouts.push(setTimeout(() => {
                                  endFightSequence(true);
                                }, 1500));
                              }, 500));
                            } else {
                              // Player loses: Enemy final attack
                              enemyAnimation = 'attack';
                              fightTimeouts.push(setTimeout(() => {
                                heroAnimation = 'hurt';
                                
                                fightTimeouts.push(setTimeout(() => {
                                  endFightSequence(false);
                                }, 1000));
                              }, 400));
                            }
                          }, 800));
                        }, 1500));
                      }, 800));
                    }, 2500));
                  }, 800));
                }, 2500));
              }, 800));
            }, 2500));
          }, 800));
        }, 2500));
      }, 1500));
    }, 1000));
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
  
  async function handleToggleMusic() {
    await audioManager.toggle();
    isMusicPlaying = audioManager.isPlaying;
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
  onToggleMusic={handleToggleMusic}
  isMusicPlaying={isMusicPlaying}
  activeTask={activeTask}
  timerState={timerState}
  totalTimeRemaining={totalTimeRemaining}
  currentSessionRemaining={currentSessionRemaining}
  taskConfig={taskConfig}
  onMarkComplete={handleMarkComplete}
  onAbortTask={handleAbortTask}
  onExtendTimer={handleExtendTimer}
  onSkipFight={handleSkipFight}
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
