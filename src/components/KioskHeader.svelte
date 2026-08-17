<script>
  import { onMount, onDestroy } from 'svelte';
  import { Volume2, VolumeX, Maximize, Minimize } from 'lucide-svelte';
  import { playTapSound, setMuted } from '../lib/sound.js';

  export let onReset = () => {};

  let timeString = '';
  let timer;
  let isMutedState = false;
  let isFullscreen = false;

  function updateTime() {
    const now = new Date();
    timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  onMount(() => {
    updateTime();
    timer = setInterval(updateTime, 1000);
    document.addEventListener('fullscreenchange', () => {
      isFullscreen = !!document.fullscreenElement;
    });
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });

  function toggleMute() {
    isMutedState = !isMutedState;
    setMuted(isMutedState);
    if (!isMutedState) playTapSound();
  }

  function toggleFullscreen() {
    playTapSound();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }
</script>

<header class="header">
  <div class="brand" role="button" tabindex="0" on:click={() => { playTapSound(); onReset(); }} on:keydown={(e) => e.key === 'Enter' && onReset()}>
    <div class="brand-badge">
      <span>☕</span>
    </div>
    <div class="brand-text">
      <span class="brand-name">AURA COFFEE</span>
      <span class="brand-sub">Smart Dispenser</span>
    </div>
  </div>

  <div class="header-center">
    <div class="status-indicator">
      <span class="dot"></span>
      <span class="status-text">Machine Ready • 92°C</span>
    </div>
  </div>

  <div class="header-right">
    <span class="time">{timeString}</span>

    <button class="icon-btn" on:click={toggleMute} aria-label="Toggle Sound">
      {#if isMutedState}
        <VolumeX size={18} />
      {:else}
        <Volume2 size={18} />
      {/if}
    </button>

    <button class="icon-btn" on:click={toggleFullscreen} aria-label="Toggle Fullscreen">
      {#if isFullscreen}
        <Minimize size={18} />
      {:else}
        <Maximize size={18} />
      {/if}
    </button>
  </div>
</header>

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 40px;
    background: var(--bg-surface);
    border-bottom: 1.5px solid var(--border-light);
    height: 74px;
    box-shadow: var(--shadow-sm);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
  }

  .brand-badge {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-sm);
    background: #fff7ed;
    border: 1.5px solid #fdba74;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
  }

  .brand-name {
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: var(--text-primary);
  }

  .brand-sub {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .header-center {
    display: flex;
    align-items: center;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    padding: 6px 14px;
    border-radius: var(--radius-full);
    font-size: 0.84rem;
    font-weight: 600;
    color: #065f46;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 8px #10b981;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .time {
    font-family: var(--font-mono);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .icon-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--bg-hover);
    border: 1px solid var(--border-light);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .icon-btn:hover {
    color: var(--text-primary);
    border-color: var(--text-primary);
    background: #ffffff;
  }

  @media (max-width: 768px) {
    .header {
      padding: 14px 20px;
    }
    .header-center {
      display: none;
    }
  }
</style>
