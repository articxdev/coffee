<script>
  import { onMount, onDestroy } from 'svelte';
  import { playDrinkReadyChime, playTapSound } from '../lib/sound.js';
  import { Check } from 'lucide-svelte';

  let {
    selectedDrink,
    selectedSize,
    onReset = () => {}
  } = $props();

  let autoResetTimer = $state(8);
  let interval;

  onMount(() => {
    playDrinkReadyChime();

    interval = setInterval(() => {
      if (autoResetTimer > 1) {
        autoResetTimer -= 1;
      } else {
        clearInterval(interval);
        onReset();
      }
    }, 1000);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });

  function handleReset() {
    playTapSound();
    onReset();
  }
</script>

<div class="kiosk-screen fade-enter">
  <div></div>

  <!-- Center Card -->
  <div class="ready-card fade-stagger">
    <div class="check-circle">
      <Check size={44} strokeWidth={3} />
    </div>

    <div class="ready-headings">
      <h1 class="ready-title">Ready to Enjoy</h1>
      <p class="ready-sub">Please collect your {selectedDrink.name} from the tray</p>
    </div>

    <div class="drink-summary-badge">
      <span class="drink-name">{selectedDrink.name}</span>
      <span class="dot">·</span>
      <span class="drink-size">{selectedSize.name} ({selectedSize.volume})</span>
    </div>
  </div>

  <!-- Bottom CTA -->
  <div class="bottom-action fade-stagger" style="animation-delay: 0.15s">
    <button class="btn-primary reset-btn" on:click={handleReset}>
      <span>Order Another Drink ({autoResetTimer}s)</span>
    </button>
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

  .ready-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background: var(--bg-surface);
    border: none;
    border-radius: var(--radius-lg);
    padding: 60px 24px;
    gap: 32px;
    box-shadow: var(--shadow-card);
  }

  .check-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: var(--brand-primary);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 30px rgba(180, 83, 9, 0.4);
    animation: slideUpBounce 0.5s var(--ease-spring);
  }

  .ready-headings {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ready-title {
    font-size: 2.6rem;
    font-weight: 900;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    line-height: 1.1;
  }

  .ready-sub {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .drink-summary-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: #f1f5f9;
    border-radius: var(--radius-full);
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--text-primary);
  }

  .dot {
    opacity: 0.4;
  }

  .bottom-action {
    padding-top: 8px;
  }

  .reset-btn {
    padding: 22px;
  }
</style>
