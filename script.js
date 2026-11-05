// LBank BD & KOC Portal Interactive Scripts
// Pure %60 Rebate Volume Simulator & Application Handler

document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
});

// --- Volume-Only Simulator Logic ---
function initCalculator() {
  const volumeRange = document.getElementById('volume-range');
  const volumeVal = document.getElementById('volume-val');

  const totalEarnings = document.getElementById('total-earnings');
  const commissionShare = document.getElementById('commission-share');
  const statVolume = document.getElementById('stat-volume');
  const subsequentEarn = document.getElementById('subsequent-earn');

  function update() {
    if (!volumeRange) return;

    const volume = parseInt(volumeRange.value, 10);

    // Update Slider Label
    if (volumeVal) volumeVal.textContent = `$${volume.toLocaleString('en-US')}`;

    // Calculation based on standard 60% Rebate:
    // 1M volume brings $240 - $300 USDT net commission
    const volumeInM = volume / 1000000;
    const minEarn = Math.round(volumeInM * 240);
    const maxEarn = Math.round(volumeInM * 300);

    // Update Result Card
    if (totalEarnings) {
      totalEarnings.textContent = `$${minEarn.toLocaleString('en-US')} - $${maxEarn.toLocaleString('en-US')}`;
    }

    if (statVolume) {
      statVolume.textContent = `$${volume.toLocaleString('en-US')} USD`;
    }

    if (commissionShare) {
      commissionShare.textContent = `$${minEarn.toLocaleString('en-US')} - $${maxEarn.toLocaleString('en-US')} USDT`;
    }

    if (subsequentEarn) {
      subsequentEarn.textContent = volumeInM === 1 
        ? 'Her 1M\'de 240$ - 300$' 
        : `${volumeInM}M hacim için ${minEarn}$ - ${maxEarn}$`;
    }
  }

  volumeRange.addEventListener('input', update);

  // Initial calculation
  update();
}
