<script>
  export let show = false;
  export let onClose;
  export let history = [];
  
  // Format timestamp to readable date/time
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Calculate duration in minutes
  function getDuration(startTime, endTime) {
    const durationMs = endTime - startTime;
    const minutes = Math.floor(durationMs / 60000);
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours}h ${remainingMins}m`;
  }
  
  // Get status badge styling
  function getStatusClass(status) {
    switch(status) {
      case 'completed': return 'status-completed';
      case 'aborted': return 'status-aborted';
      case 'failed': return 'status-failed';
      default: return '';
    }
  }
  
  function getStatusText(status) {
    switch(status) {
      case 'completed': return '✓ Completed';
      case 'aborted': return '✕ Aborted';
      case 'failed': return '⚔️ Failed';
      default: return status;
    }
  }
  
  // Sort history by most recent first
  $: sortedHistory = [...history].sort((a, b) => b.startTime - a.startTime);
</script>

{#if show}
  <div class="modal-overlay" on:click={onClose}>
    <div class="modal-content" on:click|stopPropagation>
      <!-- Header -->
      <div class="modal-header">
        <h2>📜 Task History</h2>
        <button class="close-btn" on:click={onClose}>✕</button>
      </div>
      
      <!-- History List -->
      <div class="history-container">
        {#if sortedHistory.length === 0}
          <div class="empty-state">
            <div class="empty-icon">🗡️</div>
            <p>No battles fought yet</p>
            <p class="empty-subtitle">Complete tasks to build your history</p>
          </div>
        {:else}
          <div class="history-list">
            {#each sortedHistory as task}
              <div class="history-item">
                <!-- Status Badge -->
                <div class="status-badge {getStatusClass(task.status)}">
                  {getStatusText(task.status)}
                </div>
                
                <!-- Task Info -->
                <div class="task-info">
                  <h3 class="task-title">{task.title}</h3>
                  {#if task.description}
                    <p class="task-description">{task.description}</p>
                  {/if}
                  
                  <div class="task-meta">
                    <span class="meta-item">
                      📅 {formatDate(task.startTime)}
                    </span>
                    <span class="meta-item">
                      ⏱️ {getDuration(task.startTime, task.endTime)}
                    </span>
                    <span class="meta-item">
                      🎯 {task.totalFocusTime}m total / {task.focusSessionLength}m sessions
                    </span>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
      
      <!-- Footer Stats -->
      {#if sortedHistory.length > 0}
        <div class="history-footer">
          <div class="stat">
            <span class="stat-value">{sortedHistory.length}</span>
            <span class="stat-label">Total Tasks</span>
          </div>
          <div class="stat">
            <span class="stat-value">{sortedHistory.filter(t => t.status === 'completed').length}</span>
            <span class="stat-label">Victories</span>
          </div>
          <div class="stat">
            <span class="stat-value">{sortedHistory.filter(t => t.status === 'aborted' || t.status === 'failed').length}</span>
            <span class="stat-label">Defeats</span>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
  }
  
  .modal-content {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border: 3px solid #FFD700;
    border-radius: 16px;
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.8),
                0 0 30px rgba(255, 215, 0, 0.3);
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  /* Header */
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 30px;
    border-bottom: 2px solid rgba(255, 215, 0, 0.3);
    background: rgba(0, 0, 0, 0.3);
  }
  
  h2 {
    font-family: 'Cinzel', 'Georgia', serif;
    font-size: 2rem;
    color: #FFD700;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }
  
  .close-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }
  
  .close-btn:hover {
    background: rgba(255, 107, 107, 0.2);
    border-color: #ff6b6b;
    color: #ff6b6b;
    transform: rotate(90deg);
  }
  
  /* History Container */
  .history-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px 30px;
  }
  
  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #888;
  }
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: 20px;
    opacity: 0.5;
  }
  
  .empty-state p {
    font-size: 1.2rem;
    margin: 10px 0;
  }
  
  .empty-subtitle {
    font-size: 0.9rem !important;
    color: #666;
  }
  
  /* History List */
  .history-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .history-item {
    background: rgba(0, 0, 0, 0.4);
    border: 2px solid rgba(255, 215, 0, 0.2);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.2s ease;
  }
  
  .history-item:hover {
    border-color: rgba(255, 215, 0, 0.5);
    background: rgba(0, 0, 0, 0.6);
    transform: translateX(5px);
  }
  
  /* Status Badge */
  .status-badge {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
  }
  
  .status-completed {
    background: rgba(76, 175, 80, 0.2);
    border: 2px solid #4caf50;
    color: #81c784;
  }
  
  .status-aborted {
    background: rgba(158, 158, 158, 0.2);
    border: 2px solid #9e9e9e;
    color: #bdbdbd;
  }
  
  .status-failed {
    background: rgba(244, 67, 54, 0.2);
    border: 2px solid #f44336;
    color: #e57373;
  }
  
  /* Task Info */
  .task-info {
    color: white;
  }
  
  .task-title {
    font-family: 'Cinzel', 'Georgia', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #FFD700;
    margin: 0 0 8px 0;
  }
  
  .task-description {
    font-size: 0.9rem;
    color: #aaa;
    margin: 0 0 12px 0;
    line-height: 1.4;
  }
  
  .task-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    font-size: 0.85rem;
    color: #888;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  /* Footer Stats */
  .history-footer {
    display: flex;
    justify-content: space-around;
    padding: 25px 30px;
    border-top: 2px solid rgba(255, 215, 0, 0.3);
    background: rgba(0, 0, 0, 0.3);
  }
  
  .stat {
    text-align: center;
  }
  
  .stat-value {
    display: block;
    font-size: 2rem;
    font-weight: 900;
    color: #FFD700;
    font-family: 'Courier New', monospace;
    margin-bottom: 5px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }
  
  .stat-label {
    display: block;
    font-size: 0.8rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }
  
  /* Scrollbar Styling */
  .history-container::-webkit-scrollbar {
    width: 10px;
  }
  
  .history-container::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
  
  .history-container::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 10px;
  }
  
  .history-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 215, 0, 0.5);
  }
</style>

