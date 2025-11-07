<script>
  // Props - data passed from parent component
  export let show = false; // Controls visibility
  export let onClose; // Function to call when closing
  export let onSubmit; // Function to call when submitting
  
  // Form data
  let taskTitle = '';
  let taskDescription = '';
  let totalFocusTime = 120; // in minutes (default 2 hours)
  let focusSessionLength = 25; // in minutes (default 25 min)
  let breakDuration = 5; // in minutes (default 5 min)
  
  // Stepper functions for number inputs with validation
  function incrementTime(field, step = 5) {
    if (field === 'total') {
      totalFocusTime += step;
    } 
    else if (field === 'session') {
      const newValue = focusSessionLength + step;
      // Session can't exceed total focus time
      if (newValue <= totalFocusTime) {
        focusSessionLength = newValue;
      }
    } 
    else if (field === 'break') {
      const newValue = breakDuration + step;
      // Break can't exceed focus session length
      if (newValue <= focusSessionLength) {
        breakDuration = newValue;
      }
    }
  }
  
  function decrementTime(field, step = 5) {
    if (field === 'total') {
      const newValue = totalFocusTime - step;
      // Total can't go below the focus session length
      if (newValue >= focusSessionLength) {
        totalFocusTime = newValue;
      }
    } 
    else if (field === 'session') {
      const newValue = focusSessionLength - step;
      // Session must be at least equal to break time and >= 1
      if (newValue >= breakDuration && newValue >= 1) {
        focusSessionLength = newValue;
      }
    } 
    else if (field === 'break') {
      const newValue = breakDuration - step;
      // Break must be at least 1 minute
      if (newValue >= 1) {
        breakDuration = newValue;
      }
    }
  }
  
  // Format time display
  function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }
  
  // Handle form submission
  function handleSubmit() {
    if (!taskTitle.trim()) return;
    
    // Pass data back to parent
    onSubmit({
      title: taskTitle,
      description: taskDescription,
      totalFocusTime,
      focusSessionLength,
      breakDuration
    });
    
    // Reset form
    resetForm();
  }
  
  function handleClose() {
    resetForm();
    onClose();
  }
  
  function resetForm() {
    taskTitle = '';
    taskDescription = '';
    totalFocusTime = 120;
    focusSessionLength = 25;
    breakDuration = 5;
  }
</script>

<!-- Only render if show is true -->
{#if show}
  <div class="modal-overlay" on:click={handleClose}>
    <div class="modal-content" on:click|stopPropagation>
      <!-- Close button -->
      <button class="close-btn" on:click={handleClose}>✕</button>
      
      <h2>New Mission</h2>
      <p class="modal-subtitle">Configure your focus session</p>
      
      <form on:submit|preventDefault={handleSubmit}>
        <!-- Task Title -->
        <div class="form-group">
          <label for="title">
            <span class="label-icon">📝</span>
            <span>Task Title</span>
          </label>
          <input 
            id="title"
            type="text" 
            bind:value={taskTitle}
            placeholder="What are you working on?"
            required
          />
        </div>
        
        <!-- Task Description -->
        <div class="form-group">
          <label for="description">
            <span class="label-icon">📋</span>
            <span>Description</span>
            <span class="optional">(optional)</span>
          </label>
          <textarea 
            id="description"
            bind:value={taskDescription}
            placeholder="Add details about your task..."
            rows="3"
          />
        </div>
        
        <!-- Time Configuration Section -->
        <div class="time-config-section">
          <h3>⏱️ Time Configuration</h3>
          
          <!-- Total Focus Time -->
          <div class="stepper-group">
            <label>Total Focus Time</label>
            <div class="stepper">
              <button type="button" class="stepper-btn" on:click={() => decrementTime('total', 15)}>
                <span>−</span>
              </button>
              <div class="stepper-value">
                <span class="time-display">{formatTime(totalFocusTime)}</span>
              </div>
              <button type="button" class="stepper-btn" on:click={() => incrementTime('total', 15)}>
                <span>+</span>
              </button>
            </div>
          </div>
          
          <!-- Focus Session Length -->
          <div class="stepper-group">
            <label>Focus Session</label>
            <div class="stepper">
              <button type="button" class="stepper-btn" on:click={() => decrementTime('session', 5)}>
                <span>−</span>
              </button>
              <div class="stepper-value">
                <span class="time-display">{focusSessionLength}min</span>
                <span class="helper-text-inline">per session</span>
              </div>
              <button type="button" class="stepper-btn" on:click={() => incrementTime('session', 5)}>
                <span>+</span>
              </button>
            </div>
          </div>
          
          <!-- Break Duration -->
          <div class="stepper-group">
            <label>Break Time</label>
            <div class="stepper">
              <button type="button" class="stepper-btn" on:click={() => decrementTime('break', 1)}>
                <span>−</span>
              </button>
              <div class="stepper-value">
                <span class="time-display">{breakDuration}min</span>
                <span class="helper-text-inline">after each session</span>
              </div>
              <button type="button" class="stepper-btn" on:click={() => incrementTime('break', 1)}>
                <span>+</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="modal-actions">
          <button type="button" class="btn-cancel" on:click={handleClose}>
            Cancel
          </button>
          <button type="submit" class="btn-submit">
            Start Mission
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  /* Modal overlay - dark background with blur */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(8px);
    animation: fadeIn 0.2s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  /* Modal content box - modern card design */
  .modal-content {
    position: relative;
    background: linear-gradient(145deg, #1f1f1f 0%, #2a2a2a 100%);
    border: 1px solid rgba(255, 215, 0, 0.2);
    border-radius: 24px;
    padding: 35px 40px;
    max-width: 520px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(255, 215, 0, 0.1);
    animation: slideUp 0.3s ease-out;
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Close button */
  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #999;
    font-size: 20px;
    transition: all 0.2s ease;
  }
  
  .close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: rotate(90deg);
  }
  
  /* Headers */
  .modal-content h2 {
    font-size: 2rem;
    color: #FFD700;
    margin: 0 0 8px 0;
    text-align: center;
    font-family: 'Cinzel', 'Georgia', serif;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  
  .modal-subtitle {
    text-align: center;
    color: #999;
    margin-bottom: 30px;
    font-size: 0.95rem;
    font-weight: 400;
  }
  
  /* Form styling */
  form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #ddd;
    font-weight: 500;
    font-size: 0.9rem;
  }
  
  .label-icon {
    font-size: 16px;
  }
  
  .optional {
    color: #666;
    font-weight: 400;
    font-size: 0.85rem;
    margin-left: auto;
  }
  
  input, textarea {
    padding: 14px 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.3);
    color: white;
    font-size: 0.95rem;
    transition: all 0.2s ease;
  }
  
  input:focus, textarea:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.5);
    background: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }
  
  textarea {
    resize: vertical;
    font-family: inherit;
  }
  
  /* Time Configuration Section */
  .time-config-section {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 215, 0, 0.1);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .time-config-section h3 {
    margin: 0 0 8px 0;
    font-size: 1rem;
    color: #FFD700;
    font-weight: 600;
    font-family: 'Cinzel', 'Georgia', serif;
  }
  
  /* Stepper Controls - Mobile-app style */
  .stepper-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .stepper-group label {
    font-size: 0.85rem;
    color: #aaa;
  }
  
  .stepper {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 8px;
  }
  
  .stepper-btn {
    background: rgba(255, 215, 0, 0.15);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 10px;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #FFD700;
    font-size: 24px;
    font-weight: 300;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }
  
  .stepper-btn:hover {
    background: rgba(255, 215, 0, 0.25);
    border-color: rgba(255, 215, 0, 0.5);
    transform: scale(1.05);
  }
  
  .stepper-btn:active {
    transform: scale(0.95);
  }
  
  .stepper-value {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
  }
  
  .time-display {
    font-size: 1.4rem;
    font-weight: 600;
    color: white;
  }
  
  .helper-text-inline {
    font-size: 0.75rem;
    color: #777;
  }
  
  /* Modal action buttons */
  .modal-actions {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }
  
  .btn-cancel, .btn-submit {
    flex: 1;
    padding: 16px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }
  
  .btn-cancel {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #ccc;
  }
  
  .btn-cancel:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .btn-submit {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    color: #1a1a1a;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  }
  
  .btn-submit:hover {
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
    transform: translateY(-2px);
  }
  
  .btn-submit:active {
    transform: translateY(0);
  }
  
  /* Scrollbar styling */
  .modal-content::-webkit-scrollbar {
    width: 8px;
  }
  
  .modal-content::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }
  
  .modal-content::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 10px;
  }
  
  .modal-content::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 215, 0, 0.5);
  }
</style>

