<script>
  import { onMount, onDestroy } from 'svelte';
  import { startPourSound, stopPourSound } from '../lib/sound.js';

  let {
    selectedDrink,
    selectedSize,
    onBrewComplete = () => {}
  } = $props();

  let progress = $state(0);
  let statusText = $state('Grinding Fresh Beans');
  let animationFrame;
  let startTime;
  let isPouringSound = $state(false);
  const duration = selectedDrink.brewTime * 1000;

  onMount(() => {
    startTime = performance.now();

    function updateProgress(now) {
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / duration, 1.0);
      progress = Math.round(rawProgress * 100);

      if (rawProgress < 0.3) {
        statusText = 'Grinding fresh beans';
      } else if (rawProgress < 0.65) {
        statusText = 'Heating water to 92°C';
      } else if (rawProgress < 0.95) {
        if (!isPouringSound) {
          startPourSound();
          isPouringSound = true;
        }
        statusText = 'Dispensing your drink';
      } else {
        if (isPouringSound) {
          stopPourSound();
          isPouringSound = false;
        }
        statusText = 'Finalizing';
      }

      if (rawProgress < 1.0) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        stopPourSound();
        progress = 100;
        setTimeout(() => {
          onBrewComplete();
        }, 600);
      }
    }

    animationFrame = requestAnimationFrame(updateProgress);
  });

  onDestroy(() => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    stopPourSound();
  });
</script>

<div class="kiosk-screen fade-enter">
  <!-- Top Progress Title -->
  <div class="screen-heading fade-stagger">
    <span class="step-badge">STAGE 3 OF 3</span>
    <h1 class="main-title">Brewing in Progress</h1>
    <p class="main-sub">{selectedDrink.name} · {selectedSize.name}</p>
  </div>

  <!-- Center Progress Module -->
  <div class="progress-box fade-stagger" style="animation-delay: 0.1s">
    <!-- Large Circular Gauge -->
    <div class="gauge-wrap">
      <svg viewBox="0 0 180 180" class="gauge-svg">
        <circle cx="90" cy="90" r="76" fill="none" stroke="var(--border-light)" stroke-width="12" />
        <circle 
          cx="90" 
          cy="90" 
          r="76" 
          fill="none" 
          stroke="var(--brand-primary)" 
          stroke-width="12" 
          stroke-linecap="round"
          stroke-dasharray="477.5"
          stroke-dashoffset={477.5 - (progress / 100) * 477.5}
          transform="rotate(-90 90 90)"
          style="transition: stroke-dashoffset 0.1s linear;"
        />
      </svg>

      <div class="center-content">
        <span class="percent-num">{progress}%</span>
        <span class="percent-label">EXTRACTING</span>
      </div>
    </div>

    <!-- Live Status Description -->
    <div class="status-meta">
      <h2 class="status-title">{statusText}</h2>
      <p class="status-note">Please place your cup in the dispenser tray</p>
    </div>

    <!-- Step Bars -->
    <div class="step-bars-row">
      <div class="bar" class:active={progress >= 5}>
        <span>Grind</span>
      </div>
      <div class="bar" class:active={progress >= 35}>
        <span>Heat</span>
      </div>
      <div class="bar" class:active={progress >= 68}>
        <span>Pour</span>
      </div>
      <div class="bar" class:active={progress >= 95}>
        <span>Ready</span>
      </div>
    </div>
  </div>

  <!-- Bottom Spacer / Status -->
  <div class="bottom-status-note fade-stagger" style="animation-delay: 0.2s">
    <span>Automatic safety sensor active</span>
  </div>
</div>

<style>
  .fade-stagger {
    opacity: 0;
    animation: slideUpBounce 0.5s var(--ease-spring) forwards;
  }

  .kiosk-screen {
    width: 100%;
    max-width: 600px;
    height: 100vh;
    margin: 0 auto;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
  }

  .screen-heading {
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 12px;
  }

  .step-badge {
    font-size: 0.8rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    color: var(--brand-accent);
    text-transform: uppercase;
  }

  .main-title {
    font-size: 2.2rem;
    font-weight: 900;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    line-height: 1.1;
  }

  .main-sub {
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  /* Center Module */
  .progress-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background: var(--bg-surface);
    border: none;
    border-radius: var(--radius-lg);
    padding: 40px 24px;
    gap: 32px;
    box-shadow: var(--shadow-card);
  }

  .gauge-wrap {
    position: relative;
    width: 240px;
    height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .gauge-svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 4px 12px rgba(180, 83, 9, 0.2));
  }

  .center-content {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .percent-num {
    font-family: var(--font-mono);
    font-size: 3.5rem;
    font-weight: 900;
    color: var(--brand-primary);
    line-height: 1;
  }

  .percent-label {
    font-size: 0.8rem;
    font-weight: 900;
    letter-spacing: 0.15em;
    color: var(--text-secondary);
    margin-top: 8px;
  }

  .status-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .status-title {
    font-size: 1.6rem;
    font-weight: 900;
    letter-spacing: -0.02em;
    color: var(--text-primary);
  }

  .status-note {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  /* Step Bars */
  .step-bars-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    width: 100%;
  }

  .bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--text-secondary);
    position: relative;
    padding-top: 10px;
    border-top: 4px solid var(--border-light);
    transition: all 0.3s ease;
  }

  .bar.active {
    color: var(--brand-primary);
    border-top-color: var(--brand-primary);
  }

  .bottom-status-note {
    text-align: center;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-secondary);
    padding-bottom: 8px;
    opacity: 0.8;
  }
</style>
