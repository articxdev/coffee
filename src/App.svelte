<script>
  import { DRINKS, CUP_SIZES, SUGAR_LEVELS } from './lib/drinks.js';
  import DrinkSelector from './components/DrinkSelector.svelte';
  import PaymentQR from './components/PaymentQR.svelte';
  import BrewingProgress from './components/BrewingProgress.svelte';
  import DrinkReady from './components/DrinkReady.svelte';

  // Kiosk App State Machine: 'select' | 'payment' | 'brewing' | 'ready'
  let currentScreen = $state('select');

  // User Order Selection State
  let selectedDrink = $state(DRINKS[0]);
  let selectedSize = $state(CUP_SIZES[0]);
  let selectedSugar = $state(SUGAR_LEVELS[1]);

  function handleProceedToPayment() {
    currentScreen = 'payment';
  }

  function handlePaymentSuccess() {
    currentScreen = 'brewing';
  }

  function handleBrewComplete() {
    currentScreen = 'ready';
  }

  function handleResetToHome() {
    currentScreen = 'select';
    selectedDrink = DRINKS[0];
    selectedSize = CUP_SIZES[0];
    selectedSugar = SUGAR_LEVELS[1];
  }

  function handleCancelPayment() {
    currentScreen = 'select';
  }
</script>

<main class="kiosk-viewport">
  {#if currentScreen === 'select'}
    <DrinkSelector 
      bind:selectedDrink
      bind:selectedSize
      bind:selectedSugar
      onProceed={handleProceedToPayment}
    />
  {:else if currentScreen === 'payment'}
    <PaymentQR 
      {selectedDrink}
      {selectedSize}
      {selectedSugar}
      onPaymentComplete={handlePaymentSuccess}
      onCancel={handleCancelPayment}
    />
  {:else if currentScreen === 'brewing'}
    <BrewingProgress 
      {selectedDrink}
      {selectedSize}
      onBrewComplete={handleBrewComplete}
    />
  {:else if currentScreen === 'ready'}
    <DrinkReady 
      {selectedDrink}
      {selectedSize}
      onReset={handleResetToHome}
    />
  {/if}
</main>

<style>
  .kiosk-viewport {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: var(--bg-app);
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
