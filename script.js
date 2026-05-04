// Game State
const gameState = {
    points: 0,
    totalEarned: 0,
    totalClicks: 0,
    multiplier: 1,
    upgrades: [
        { id: 'horseshoes', name: 'Horseshoes', emoji: '🔨', cost: 10, multiplier: 0.5, owned: 0 },
        { id: 'saddle', name: 'Saddle', emoji: '🎀', cost: 50, multiplier: 1, owned: 0 },
        { id: 'carrot', name: 'Carrot', emoji: '🥕', cost: 100, multiplier: 2, owned: 0 },
        { id: 'lightning', name: 'Lightning', emoji: '⚡', cost: 250, multiplier: 4, owned: 0 },
        { id: 'trophy', name: 'Trophy', emoji: '🏆', cost: 500, multiplier: 9, owned: 0 },
        { id: 'crown', name: 'Crown', emoji: '👑', cost: 1000, multiplier: 14, owned: 0 }
    ]
};

// DOM Elements
const horseButton = document.getElementById('horseButton');
const pointsDisplay = document.getElementById('points');
const perClickDisplay = document.getElementById('perClick');
const totalEarnedDisplay = document.getElementById('totalEarned');
const totalClicksDisplay = document.getElementById('totalClicks');
const upgradesGrid = document.getElementById('upgradesGrid');

// Load game state from localStorage
function loadGame() {
    const saved = localStorage.getItem('horseClickerGame');
    if (saved) {
        const loadedState = JSON.parse(saved);
        gameState.points = loadedState.points || 0;
        gameState.totalEarned = loadedState.totalEarned || 0;
        gameState.totalClicks = loadedState.totalClicks || 0;
        gameState.upgrades = loadedState.upgrades || gameState.upgrades;
        updateMultiplier();
    }
}

// Save game state to localStorage
function saveGame() {
    localStorage.setItem('horseClickerGame', JSON.stringify(gameState));
}

// Update the multiplier based on owned upgrades
function updateMultiplier() {
    gameState.multiplier = 1;
    gameState.upgrades.forEach(upgrade => {
        gameState.multiplier += upgrade.owned * upgrade.multiplier;
    });
}

// Update all UI displays
function updateUI() {
    pointsDisplay.textContent = Math.floor(gameState.points);
    perClickDisplay.textContent = gameState.multiplier.toFixed(1);
    totalEarnedDisplay.textContent = Math.floor(gameState.totalEarned);
    totalClicksDisplay.textContent = gameState.totalClicks;
}

// Handle horse click
function clickHorse() {
    const pointsGained = gameState.multiplier;
    gameState.points += pointsGained;
    gameState.totalEarned += pointsGained;
    gameState.totalClicks++;
    
    updateUI();
    
    // Add animation
    horseButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
        horseButton.style.transform = 'scale(1)';
    }, 100);
}

// Create upgrade buttons
function createUpgradeButtons() {
    upgradesGrid.innerHTML = '';
    gameState.upgrades.forEach((upgrade, index) => {
        const button = document.createElement('button');
        button.className = 'upgrade-button';
        button.id = `upgrade-${upgrade.id}`;
        button.innerHTML = `
            <span class="upgrade-emoji">${upgrade.emoji}</span>
            <span class="upgrade-name">${upgrade.name}</span>
            <span class="upgrade-cost">Cost: ${upgrade.cost}</span>
            <span class="upgrade-multiplier">+${upgrade.multiplier}x</span>
            <span class="upgrade-owned">Owned: ${upgrade.owned}</span>
        `;
        
        button.onclick = () => buyUpgrade(index);
        upgradesGrid.appendChild(button);
    });
}

// Buy an upgrade
function buyUpgrade(index) {
    const upgrade = gameState.upgrades[index];
    
    if (gameState.points >= upgrade.cost) {
        gameState.points -= upgrade.cost;
        upgrade.owned++;
        upgrade.cost = Math.ceil(upgrade.cost * 1.15); // Increase cost by 15%
        
        updateMultiplier();
        updateUI();
        createUpgradeButtons();
        saveGame();
    } else {
        // Flash button to indicate insufficient points
        const button = document.getElementById(`upgrade-${upgrade.id}`);
        button.style.opacity = '0.5';
        setTimeout(() => {
            button.style.opacity = '1';
        }, 200);
    }
}

// Auto-save every 5 seconds
setInterval(() => {
    saveGame();
}, 5000);

// Event listeners
horseButton.addEventListener('click', clickHorse);

// Initialize game
window.addEventListener('DOMContentLoaded', () => {
    loadGame();
    createUpgradeButtons();
    updateUI();
});
