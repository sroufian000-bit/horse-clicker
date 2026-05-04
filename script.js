// Game State
const gameState = {
    points: 0,
    totalEarned: 0,
    totalClicks: 0,
    multiplier: 1,
    upgrades: {
        horseshoes: { owned: 0, cost: 10, multiplier: 1.5, emoji: '🔨', name: 'Horseshoes' },
        saddle: { owned: 0, cost: 50, multiplier: 2, emoji: '🎀', name: 'Saddle' },
        carrot: { owned: 0, cost: 100, multiplier: 3, emoji: '🥕', name: 'Carrot' },
        lightning: { owned: 0, cost: 250, multiplier: 5, emoji: '⚡', name: 'Lightning Strike' },
        trophy: { owned: 0, cost: 500, multiplier: 10, emoji: '🏆', name: 'Trophy' },
        crown: { owned: 0, cost: 1000, multiplier: 15, emoji: '👑', name: 'Crown' }
    }
};

// Save game state to localStorage
function saveGame() {
    localStorage.setItem('horseClickerSave', JSON.stringify(gameState));
}

// Load game state from localStorage
function loadGame() {
    const saved = localStorage.getItem('horseClickerSave');
    if (saved) {
        const loaded = JSON.parse(saved);
        Object.assign(gameState, loaded);
        recalculateMultiplier();
    }
}

// Recalculate the total multiplier based on owned upgrades
function recalculateMultiplier() {
    gameState.multiplier = 1;
    for (let upgrade in gameState.upgrades) {
        gameState.multiplier += (gameState.upgrades[upgrade].owned * gameState.upgrades[upgrade].multiplier);
    }
}

// Update the display
function updateDisplay() {
    document.getElementById('points').textContent = Math.floor(gameState.points).toLocaleString();
    document.getElementById('perClick').textContent = gameState.multiplier.toFixed(1);
    document.getElementById('totalEarned').textContent = Math.floor(gameState.totalEarned).toLocaleString();
    document.getElementById('totalClicks').textContent = gameState.totalClicks.toLocaleString();
}

// Handle horse click
function clickHorse() {
    const pointsEarned = gameState.multiplier;
    gameState.points += pointsEarned;
    gameState.totalEarned += pointsEarned;
    gameState.totalClicks++;
    updateDisplay();
    updateUpgradeButtons();
    
    // Add visual feedback
    animateClick();
}

// Animate the click
function animateClick() {
    const button = document.getElementById('horseButton');
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 100);
}

// Purchase an upgrade
function buyUpgrade(upgradeKey) {
    const upgrade = gameState.upgrades[upgradeKey];
    if (gameState.points >= upgrade.cost) {
        gameState.points -= upgrade.cost;
        upgrade.owned++;
        recalculateMultiplier();
        updateDisplay();
        updateUpgradeButtons();
        saveGame();
    }
}

// Update upgrade button states
function updateUpgradeButtons() {
    for (let upgradeKey in gameState.upgrades) {
        const button = document.getElementById(`upgrade-${upgradeKey}`);
        const upgrade = gameState.upgrades[upgradeKey];
        const canAfford = gameState.points >= upgrade.cost;
        
        button.disabled = !canAfford;
        button.innerHTML = `
            <span class="upgrade-emoji">${upgrade.emoji}</span>
            <span class="upgrade-name">${upgrade.name}</span>
            <span class="upgrade-cost">Cost: ${upgrade.cost}</span>
            <span class="upgrade-multiplier">+${upgrade.multiplier.toFixed(1)}x</span>
            <span class="upgrade-owned">Owned: ${upgrade.owned}</span>
        `;
    }
}

// Initialize the upgrade buttons
function initializeUpgrades() {
    const grid = document.getElementById('upgradesGrid');
    
    for (let upgradeKey in gameState.upgrades) {
        const button = document.createElement('button');
        button.className = 'upgrade-button';
        button.id = `upgrade-${upgradeKey}`;
        button.onclick = () => buyUpgrade(upgradeKey);
        
        grid.appendChild(button);
    }
    
    updateUpgradeButtons();
}

// Initialize the game
function initializeGame() {
    loadGame();
    initializeUpgrades();
    updateDisplay();
    
    document.getElementById('horseButton').addEventListener('click', clickHorse);
    
    // Auto-save every 5 seconds
    setInterval(saveGame, 5000);
}

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', initializeGame);
