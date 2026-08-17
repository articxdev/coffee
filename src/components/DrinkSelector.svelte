<script>
  import { DRINKS, CUP_SIZES, SUGAR_LEVELS } from '../lib/drinks.js';
  import { playTapSound, playSelectSound } from '../lib/sound.js';
  import { ArrowRight, Check } from 'lucide-svelte';

  let {
    selectedDrink = $bindable(DRINKS[0]),
    selectedSize = $bindable(CUP_SIZES[0]),
    selectedSugar = $bindable(SUGAR_LEVELS[1]),
    onProceed = () => {}
  } = $props();

  let totalPrice = $derived(selectedDrink.price + selectedSize.priceMod);

  function handleSelectDrink(drink) {
    selectedDrink = drink;
    playSelectSound(1.0);
  }

  function handleSelectSize(size) {
    selectedSize = size;
    playTapSound();
  }

  function handleSelectSugar(sugar) {
    selectedSugar = sugar;
    playTapSound();
  }

  function handleContinue() {
    playSelectSound(1.2);
    onProceed();
  }
</script>

<div class="kiosk-screen fade-enter">
  <!-- Top Screen Title -->
  <div class="screen-heading">
    <h1 class="main-title">Select Drink</h1>
    <p class="main-sub">Tap to choose your freshly brewed beverage</p>
  </div>

  <!-- Vertically Stacked Interactive Drink Options (Optimized for 7"-10" Touch) -->
  <div class="drink-list">
    {#each DRINKS as drink, i (drink.id)}
      {@const isSelected = selectedDrink.id === drink.id}
      <button 
        class="drink-row fade-stagger"
        style="animation-delay: {i * 0.08}s"
        class:selected={isSelected}
        on:click={() => handleSelectDrink(drink)}
      >
        <div class="icon-box">
          <svg viewBox="0 0 40 40" class="drink-icon">
            {#if drink.id === 'coffee'}
              <path d="M8 12h20v14a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V12z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
              <path d="M28 15h3a3 3 0 0 1 0 6h-3" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
              <path d="M12 7c0 1.5 2 2 2 3.5M18 7c0 1.5 2 2 2 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            {:else if drink.id === 'tea'}
              <path d="M10 13h20v13a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V13z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
              <path d="M20 6v6M17 9l3-3 3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            {:else}
              <path d="M8 12h20v16a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V12z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
              <path d="M28 15h3a3 3 0 0 1 0 6h-3" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
              <line x1="8" y1="18" x2="28" y2="18" stroke="currentColor" stroke-width="2" />
            {/if}
          </svg>
        </div>

        <div class="drink-meta">
          <span class="name">{drink.name}</span>
          <span class="sub">{drink.subtitle}</span>
        </div>

        <div class="price-side">
          <span class="price">₹{drink.price}</span>
          <div class="check-indicator">
            {#if isSelected}
              <Check size={18} strokeWidth={3} />
            {/if}
          </div>
        </div>
      </button>
    {/each}
  </div>

  <!-- Interactive Customization Panel -->
  <div class="customizer-box fade-stagger" style="animation-delay: 0.25s">
    <!-- Size Selector -->
    <div class="cust-row">
      <span class="cust-label">Size</span>
      <div class="chips-group">
        {#each CUP_SIZES as size}
          <button 
            class="touch-chip" 
            class:active={selectedSize.id === size.id}
            on:click={() => handleSelectSize(size)}
          >
            <span class="chip-title">{size.name}</span>
            <span class="chip-desc">{size.volume}{size.priceMod > 0 ? ` +₹${size.priceMod}` : ''}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Sugar Selector -->
    <div class="cust-row">
      <span class="cust-label">Sugar</span>
      <div class="chips-group">
        {#each SUGAR_LEVELS as sugar}
          <button 
            class="touch-chip" 
            class:active={selectedSugar.id === sugar.id}
            on:click={() => handleSelectSugar(sugar)}
          >
            <span class="chip-title">{sugar.label}</span>
            <span class="chip-desc">{sugar.text}</span>
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Bottom CTA Footer -->
  <div class="bottom-action-bar">
    <div class="total-display fade-stagger" style="animation-delay: 0.35s">
      <span class="total-lbl">Total</span>
      <span class="total-price">₹{totalPrice}</span>
    </div>

    <button class="btn-primary pay-btn fade-stagger" style="animation-delay: 0.4s" on:click={handleContinue}>
      <span>Pay & Brew</span>
      <ArrowRight size={22} strokeWidth={2.5} />
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
    gap: 16px;
    box-sizing: border-box;
  }

  .screen-heading {
    text-align: left;
    padding-top: 4px;
    padding-bottom: 8px;
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
    margin-top: 4px;
  }

  /* Vertical Drink Stack */
  .drink-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
    justify-content: center;
  }

  .drink-row {
    display: flex;
    align-items: center;
    padding: 20px 20px;
    background: var(--bg-surface);
    border: 3px solid transparent;
    border-radius: var(--radius-lg);
    cursor: pointer;
    text-align: left;
    gap: 16px;
    box-shadow: var(--shadow-card);
    transition: all 0.2s var(--ease-spring);
    color: var(--text-primary);
  }

  .drink-row:active {
    transform: scale(0.96);
  }

  .drink-row.selected {
    border-color: var(--brand-primary);
    background: var(--brand-primary-light);
    box-shadow: var(--shadow-md);
  }

  .icon-box {
    width: 56px;
    height: 56px;
    border-radius: var(--radius-md);
    background: #f1f5f9;
    color: var(--brand-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .drink-row.selected .icon-box {
    background: var(--brand-primary);
    color: #ffffff;
    transform: scale(1.1) rotate(-5deg);
  }

  .drink-icon {
    width: 32px;
    height: 32px;
  }

  .drink-meta {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 4px;
  }

  .name {
    font-size: 1.4rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .sub {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .drink-row.selected .sub {
    color: var(--brand-primary-dark);
  }

  .price-side {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .price {
    font-family: var(--font-mono);
    font-size: 1.4rem;
    font-weight: 900;
    color: var(--brand-accent);
  }

  .drink-row.selected .price {
    color: var(--brand-primary-dark);
  }

  .check-indicator {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 3px solid var(--border-light);
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    transition: all 0.2s ease;
  }

  .drink-row.selected .check-indicator {
    background: var(--brand-primary);
    color: #ffffff;
    border-color: var(--brand-primary);
    transform: scale(1.1);
  }

  /* Customizer Box */
  .customizer-box {
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: var(--bg-surface);
    border: none;
    border-radius: var(--radius-lg);
    padding: 20px 20px;
    box-shadow: var(--shadow-card);
  }

  .cust-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .cust-label {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--text-primary);
    min-width: 60px;
  }

  .chips-group {
    display: flex;
    gap: 10px;
    flex: 1;
    justify-content: flex-end;
  }

  .touch-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 12px 16px;
    background: #f1f5f9;
    border: 2px solid transparent;
    border-radius: var(--radius-full);
    color: var(--text-secondary);
    font-family: var(--font-main);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .touch-chip:active {
    transform: scale(0.94);
  }

  .touch-chip.active {
    background: var(--brand-primary-light);
    color: var(--brand-primary-dark);
    border-color: var(--brand-primary);
  }

  .chip-title {
    font-size: 0.95rem;
    font-weight: 800;
  }

  .chip-desc {
    font-size: 0.8rem;
    font-weight: 700;
    opacity: 0.8;
  }

  /* Bottom Sticky Action Bar */
  .bottom-action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px;
    background: var(--bg-surface);
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-lg);
    margin-bottom: 8px;
  }

  .total-display {
    display: flex;
    flex-direction: column;
    min-width: 100px;
    padding-left: 12px;
  }

  .total-lbl {
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .total-price {
    font-family: var(--font-mono);
    font-size: 2.2rem;
    font-weight: 900;
    color: var(--brand-primary);
    line-height: 1;
  }

  .pay-btn {
    flex: 1;
    padding: 20px 24px;
    font-size: 1.25rem;
  }
</style>
