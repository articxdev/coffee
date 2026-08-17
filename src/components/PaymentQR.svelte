<script>
  import { onMount, onDestroy } from 'svelte';
  import { ArrowLeft, Check } from 'lucide-svelte';
  import { playTapSound, playSuccessChime } from '../lib/sound.js';

  let {
    selectedDrink,
    selectedSize,
    selectedSugar,
    onPaymentComplete = () => {},
    onCancel = () => {}
  } = $props();

  let timeLeft = $state(60);
  let timer;
  let isPaying = $state(false);

  let totalPrice = $derived(selectedDrink.price + selectedSize.priceMod);

  onMount(() => {
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft -= 1;
      } else {
        clearInterval(timer);
        onCancel();
      }
    }, 1000);
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });

  function handleSimulatePayment() {
    if (isPaying) return;
    isPaying = true;
    playSuccessChime();
    setTimeout(() => {
      onPaymentComplete();
    }, 900);
  }
</script>

<div class="kiosk-screen fade-enter">
  <!-- Top Navigation -->
  <div class="top-nav">
    <button class="back-btn" on:click={() => { playTapSound(); onCancel(); }}>
      <ArrowLeft size={20} />
      <span>Back</span>
    </button>

    <div class="timer-pill">
      <span>{timeLeft}s remaining</span>
    </div>
  </div>

  <!-- Center QR Card -->
  <div class="qr-content-card fade-stagger" style="animation-delay: 0.1s">
    <div class="text-heading">
      <h2 class="qr-title">Scan QR Code</h2>
      <p class="qr-sub">{selectedDrink.name} · {selectedSize.name} · {selectedSugar.label} Sugar</p>
    </div>

    <!-- Crisp High Contrast Monochrome QR -->
    <div class="qr-frame">
      <svg viewBox="0 0 140 140" class="qr-svg" xmlns="http://www.w3.org/2000/svg">
        <rect width="140" height="140" fill="#ffffff" rx="14" />
        
        <!-- Corner Markers -->
        <rect x="14" y="14" width="32" height="32" fill="none" stroke="#000000" stroke-width="4.5" rx="3" />
        <rect x="22" y="22" width="16" height="16" fill="#000000" rx="1" />

        <rect x="94" y="14" width="32" height="32" fill="none" stroke="#000000" stroke-width="4.5" rx="3" />
        <rect x="102" y="22" width="16" height="16" fill="#000000" rx="1" />

        <rect x="14" y="94" width="32" height="32" fill="none" stroke="#000000" stroke-width="4.5" rx="3" />
        <rect x="22" y="102" width="16" height="16" fill="#000000" rx="1" />

        <!-- Crisp Data Grid -->
        <rect x="54" y="16" width="8" height="8" fill="#000000" />
        <rect x="68" y="16" width="8" height="8" fill="#000000" />
        <rect x="78" y="28" width="8" height="8" fill="#000000" />
        <rect x="54" y="38" width="8" height="8" fill="#000000" />

        <rect x="16" y="56" width="8" height="8" fill="#000000" />
        <rect x="28" y="56" width="8" height="8" fill="#000000" />
        <rect x="42" y="56" width="8" height="8" fill="#000000" />
        <rect x="56" y="56" width="8" height="8" fill="#000000" />
        <rect x="72" y="56" width="8" height="8" fill="#000000" />
        <rect x="88" y="56" width="8" height="8" fill="#000000" />
        <rect x="104" y="56" width="8" height="8" fill="#000000" />
        <rect x="118" y="56" width="8" height="8" fill="#000000" />

        <rect x="16" y="70" width="8" height="8" fill="#000000" />
        <rect x="36" y="70" width="8" height="8" fill="#000000" />
        <rect x="60" y="70" width="8" height="8" fill="#000000" />
        <rect x="80" y="70" width="8" height="8" fill="#000000" />
        <rect x="100" y="70" width="8" height="8" fill="#000000" />
        <rect x="118" y="70" width="8" height="8" fill="#000000" />

        <rect x="54" y="94" width="8" height="8" fill="#000000" />
        <rect x="68" y="94" width="8" height="8" fill="#000000" />
        <rect x="82" y="94" width="8" height="8" fill="#000000" />
        <rect x="100" y="94" width="8" height="8" fill="#000000" />
        <rect x="118" y="94" width="8" height="8" fill="#000000" />

        <rect x="54" y="112" width="8" height="8" fill="#000000" />
        <rect x="76" y="112" width="8" height="8" fill="#000000" />
        <rect x="96" y="112" width="8" height="8" fill="#000000" />
        <rect x="118" y="112" width="8" height="8" fill="#000000" />
      </svg>

      {#if isPaying}
        <div class="success-overlay">
          <Check size={40} strokeWidth={3} />
          <span>Payment Authorized</span>
        </div>
      {/if}
    </div>

    <!-- Amount Due -->
    <div class="amount-box">
      <span class="amount-label">Amount Due</span>
      <span class="amount-val">₹{totalPrice}</span>
    </div>
  </div>

  <!-- Bottom Trigger -->
  <div class="bottom-action fade-stagger" style="animation-delay: 0.2s">
    <button 
      class="btn-primary simulate-btn"
      class:loading={isPaying}
      on:click={handleSimulatePayment}
    >
      <span>{isPaying ? 'Processing...' : 'Simulate Scan & Pay'}</span>
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

  .top-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--bg-surface);
    border: 2px solid transparent;
    border-radius: var(--radius-full);
    padding: 14px 20px;
    color: var(--text-primary);
    font-family: var(--font-main);
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    transition: all 0.2s var(--ease-spring);
  }

  .back-btn:active {
    transform: scale(0.96);
  }

  .timer-pill {
    font-family: var(--font-mono);
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--brand-accent);
    background: #eff6ff; /* light blue */
    border: 2px solid #bfdbfe;
    padding: 12px 18px;
    border-radius: var(--radius-full);
  }

  /* Center Card */
  .qr-content-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background: var(--bg-surface);
    border: none;
    border-radius: var(--radius-lg);
    padding: 40px 24px;
    gap: 24px;
    box-shadow: var(--shadow-card);
  }

  .text-heading {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .qr-title {
    font-size: 2rem;
    font-weight: 900;
    letter-spacing: -0.02em;
    color: var(--text-primary);
  }

  .qr-sub {
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .qr-frame {
    position: relative;
    padding: 16px;
    background: #ffffff;
    border: 4px solid var(--brand-primary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
  }

  .qr-svg {
    width: 220px;
    height: 220px;
    display: block;
  }

  .success-overlay {
    position: absolute;
    inset: 0;
    background: var(--brand-primary);
    border-radius: calc(var(--radius-lg) - 4px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #ffffff;
    font-weight: 900;
    font-size: 1.2rem;
    animation: slideUpBounce 0.3s var(--ease-spring);
  }

  .amount-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .amount-label {
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .amount-val {
    font-family: var(--font-mono);
    font-size: 2.6rem;
    font-weight: 900;
    color: var(--brand-primary);
    line-height: 1;
  }

  .bottom-action {
    padding-top: 8px;
  }

  .simulate-btn {
    padding: 22px;
  }

  .simulate-btn.loading {
    opacity: 0.8;
    pointer-events: none;
    background: var(--text-secondary);
    box-shadow: none;
  }
</style>
