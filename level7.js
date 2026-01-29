// Level 7 - Die KI-Challenge - Memory Game Logic

// ===== CONSTANTS & CONFIGURATION =====
const GAME_CONFIG = {
    totalChallenges: 3,
    challengePoints: [300, 100, 100], // Points per challenge
    totalPoints: 500
};

// ===== MEMORY CARD DATA =====
const MEMORY_DATA = {
    1: {
        name: "Basis-Wissen",
        pairs: [
            {
                id: "datenbank",
                icon: "📂",
                title: "Datenbank",
                info: "Der DFC Chatbot beendet die Ordner Odyssee. Alle Informationen zentral an einem Ort. Keine endlose Suche mehr."
            },
            {
                id: "suchen",
                icon: "🔍",
                title: "Suchen",
                info: "Dateien, Logos, Anleitungen findet der DFC Chatbot in Sekunden. Nie wieder verzweifelt nach Dokumenten suchen."
            },
            {
                id: "schnelle-antwort",
                icon: "⚡",
                title: "Schnelle Antwort",
                info: "Mercedes spezifische Fragen stellen und innerhalb von Sekunden die passende Antwort erhalten. So einfach geht der DFC Chatbot."
            },
            {
                id: "ueberall",
                icon: "🎯",
                title: "Überall anwendbar",
                info: "Egal ob Produktion, Verwaltung, Planung oder Qualität. Der DFC Chatbot bietet allen die Lösung aus dem digitalen Dschungel."
            }
        ]
    },
    2: {
        name: "DFC-Experte",
        pairs: [
            {
                id: "experte",
                icon: "🕵️",
                title: "Experte",
                info: "Der DFC Chatbot ist dein persönlicher Experte für Mercedes Richtlinien, Ansprüche und Abteilungswissen. Nur ohne Pfeife und viel schneller als Sherlock Holmes."
            },
            {
                id: "mobil",
                icon: "📱",
                title: "Mobil",
                info: "Am Schreibtisch und direkt vor Ort per Smartphone. Der DFC Chatbot macht Wissen mobil und jederzeit zugänglich."
            },
            {
                id: "bereiche",
                icon: "🧠",
                title: "120 Bereiche",
                info: "Vom Shopfloormanagement bis zu Zulassungskriterien. Über 120 Bereiche mit täglich wachsendem Mercedes Wissen."
            },
            {
                id: "support",
                icon: "💬",
                title: "Support",
                info: "Erste Hilfe direkt vom Chatbot. Nur ein Klick vom geballten Wissen entfernt. Keine Hotline mehr notwendig."
            },
            {
                id: "zugaenglich",
                icon: "🛡️",
                title: "Zugänglich",
                info: "Mercedes Wissen ist nicht mehr personenabhängig. Der DFC Chatbot macht es für alle zugänglich. Die ultimative Versicherung gegen Wissens Engpässe."
            },
            {
                id: "verfuegbar",
                icon: "🔄",
                title: "Verfügbar",
                info: "Wissen bleibt verfügbar, auch wenn Kollegen abwesend sind oder Schichten wechseln. Der DFC Chatbot sorgt für durchgängige Verfügbarkeit."
            }
        ]
    },
    3: {
        name: "Wissens-Champion",
        pairs: [
            {
                id: "bremen",
                icon: "🏭",
                title: "Bremen",
                info: "Werk Bremen machte es vor. Eigener Wissens Bereich in kurzer Zeit aufgebaut. Vom Ordner Chaos zum strukturierten BodyFactoryChat."
            },
            {
                id: "schneller-start",
                icon: "⏱️",
                title: "Schneller Start",
                info: "Im Team zur eigenen Wissenslösung. Einfach, effizient und nachhaltig umgesetzt."
            },
            {
                id: "dokumente",
                icon: "📑",
                title: "Dokumente",
                info: "Unternehmensdaten, Richtlinien und Vorgaben einfach hochladen. So wird der DFC Chatbot zur zentralen Anlaufstelle für alle Informationen."
            },
            {
                id: "infos",
                icon: "🔩",
                title: "Infos",
                info: "Arbeitssicherheit, technische Spezifikationen, Reaktionspläne. Alle Informationen nur eine Frage entfernt im DFC Chatbot."
            },
            {
                id: "anlage",
                icon: "🖥️",
                title: "Anlage",
                info: "Der DFC Chatbot funktioniert am Schreibtisch und direkt an den Anlagen. Wissen genau dort, wo es gebraucht wird."
            },
            {
                id: "zentral",
                icon: "📊",
                title: "Zentral",
                info: "Was früher in Ordnern und Tabellen verstreut war, ist jetzt zentral im DFC Chatbot verfügbar. Strukturiert und schnell auffindbar."
            },
            {
                id: "verantwortlicher",
                icon: "👤",
                title: "Verantwortlicher",
                info: "Werde Verantwortlicher und teile dein Expertenwissen für dein Team, deine Abteilung oder dein Projekt."
            },
            {
                id: "bonus-zone",
                icon: "🎓",
                title: "Bonus-Zone",
                info: "In der Bonus-Zone findest du alle Informationen und Anleitungen zum Aufbau deines eigenen DFC Chatbots."
            }
        ]
    }
};

// ===== GAME STATE =====
let gameState = {
    currentScreen: 'intro',
    currentChallenge: 1,
    totalPoints: 0,
    challengeProgress: {
        1: { completed: false, points: 0 },
        2: { completed: false, points: 0 },
        3: { completed: false, points: 0 }
    },
    currentRank: 'Anfänger',

    // Memory game state
    flippedCards: [],
    matchedPairs: 0,
    canFlip: true,
    memoryCards: [],

    // Card skin
    selectedSkin: 'standard'
};

// ===== INTRO SCREEN =====
let neuralCanvas, neuralCtx;
let neuralNodes = [];
let neuralConnections = [];
let mouseX = -1000;
let mouseY = -1000;

function initIntroScreen() {
    neuralCanvas = document.getElementById('neuralCanvas');
    if (!neuralCanvas) return;

    neuralCtx = neuralCanvas.getContext('2d');
    neuralCanvas.width = window.innerWidth;
    neuralCanvas.height = window.innerHeight;

    // Create neural network nodes
    for (let i = 0; i < 50; i++) {
        neuralNodes.push({
            x: Math.random() * neuralCanvas.width,
            y: Math.random() * neuralCanvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 3 + 1
        });
    }

    // Add mouse move event listener
    neuralCanvas.addEventListener('mousemove', (e) => {
        const rect = neuralCanvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    // Reset mouse position when leaving canvas
    neuralCanvas.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
    });

    animateNeuralNetwork();
}

function animateNeuralNetwork() {
    if (!neuralCanvas || !neuralCtx) return;

    neuralCtx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);

    // Find hovered node (closest to mouse within hover radius)
    let hoveredNode = null;
    let minDistance = 50; // Hover radius
    neuralNodes.forEach(node => {
        const dx = node.x - mouseX;
        const dy = node.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
            minDistance = distance;
            hoveredNode = node;
        }
    });

    // Find all connected nodes to hovered node
    const connectedNodes = new Set();
    if (hoveredNode) {
        connectedNodes.add(hoveredNode);
        neuralNodes.forEach(node => {
            if (node === hoveredNode) return;
            const dx = hoveredNode.x - node.x;
            const dy = hoveredNode.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                connectedNodes.add(node);
            }
        });
    }

    // Update nodes
    neuralNodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > neuralCanvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > neuralCanvas.height) node.vy *= -1;
    });

    // Draw connections first (behind nodes)
    neuralNodes.forEach((nodeA, i) => {
        neuralNodes.slice(i + 1).forEach(nodeB => {
            const dx = nodeA.x - nodeB.x;
            const dy = nodeA.y - nodeB.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const isHighlighted = hoveredNode &&
                    (nodeA === hoveredNode || nodeB === hoveredNode) &&
                    connectedNodes.has(nodeA) && connectedNodes.has(nodeB);

                neuralCtx.beginPath();
                neuralCtx.moveTo(nodeA.x, nodeA.y);
                neuralCtx.lineTo(nodeB.x, nodeB.y);

                if (isHighlighted) {
                    // Highlighted connection - bright and thick
                    neuralCtx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 150})`;
                    neuralCtx.lineWidth = 3;
                    neuralCtx.shadowBlur = 15;
                    neuralCtx.shadowColor = 'rgba(103, 199, 255, 1)';
                } else {
                    // Normal connection
                    neuralCtx.strokeStyle = `rgba(103, 199, 255, ${1 - distance / 150})`;
                    neuralCtx.lineWidth = 1;
                    neuralCtx.shadowBlur = 0;
                }
                neuralCtx.stroke();
                neuralCtx.shadowBlur = 0;
            }
        });
    });

    // Draw nodes on top
    neuralNodes.forEach(node => {
        const isConnected = connectedNodes.has(node);

        neuralCtx.beginPath();
        neuralCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        if (isConnected) {
            // Highlighted node - bright glow
            neuralCtx.fillStyle = 'rgba(255, 255, 255, 1)';
            neuralCtx.shadowBlur = 20;
            neuralCtx.shadowColor = 'rgba(103, 199, 255, 1)';

            // Draw larger radius for highlighted nodes
            neuralCtx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
        } else {
            // Normal node
            neuralCtx.fillStyle = 'rgba(103, 199, 255, 0.8)';
            neuralCtx.shadowBlur = 0;
        }

        neuralCtx.fill();
        neuralCtx.shadowBlur = 0;
    });

    requestAnimationFrame(animateNeuralNetwork);
}

// ===== SCREEN TRANSITIONS =====
function switchScreen(fromScreen, toScreen) {
    const screens = document.querySelectorAll('.game-screen');
    screens.forEach(screen => screen.classList.remove('active'));

    const targetScreen = document.getElementById(toScreen);
    if (targetScreen) {
        targetScreen.classList.add('active');
        gameState.currentScreen = toScreen.replace('Screen', '').toLowerCase();
    }

    // Show/hide skin selector button only in memory game screen
    const skinBtn = document.getElementById('skinSelectorBtn');
    if (skinBtn) {
        if (toScreen === 'memoryGameScreen') {
            skinBtn.style.display = 'flex';
        } else {
            skinBtn.style.display = 'none';
        }
    }
}

function startGame() {
    switchScreen('introScreen', 'loadingScreen');

    let progress = 0;
    const loadingBar = document.getElementById('loadingBar');
    const loadingText = document.getElementById('loadingText');

    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                switchScreen('loadingScreen', 'levelSelectScreen');
                loadProgress();
            }, 300);
        }

        loadingBar.style.width = progress + '%';
        loadingText.textContent = Math.floor(progress) + '%';
    }, 100);
}

// ===== LEVEL SELECTION =====
function loadProgress() {
    const savedProgress = localStorage.getItem('level7Progress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        gameState.challengeProgress = progress.challengeProgress || gameState.challengeProgress;
        gameState.currentRank = progress.currentRank || 'Anfänger';

        // Recalculate total points from completed challenges to avoid inconsistencies
        let calculatedPoints = 0;
        for (let i = 1; i <= 3; i++) {
            if (gameState.challengeProgress[i].completed) {
                calculatedPoints += gameState.challengeProgress[i].points;
            }
        }
        gameState.totalPoints = calculatedPoints;
    }

    updateLevelSelectUI();
}

function updateLevelSelectUI() {
    // Update points display
    document.getElementById('totalPointsDisplay').textContent = `${gameState.totalPoints} / 500`;
    document.getElementById('currentRankDisplay').textContent = gameState.currentRank;

    // Update challenge cards
    for (let i = 1; i <= 3; i++) {
        const card = document.querySelector(`.challenge-card[data-level="${i}"]`);
        const priceTag = card.querySelector('.challenge-price-tag');
        const statusElement = card.querySelector('.challenge-status');

        if (gameState.challengeProgress[i].completed) {
            card.classList.add('completed');
            card.classList.remove('locked', 'unlocked');
            priceTag.style.display = 'block';
            statusElement.textContent = '✓ Abgeschlossen';
        } else if (i === 1 || gameState.challengeProgress[i - 1].completed) {
            card.classList.add('unlocked');
            card.classList.remove('locked', 'completed');
            statusElement.textContent = '▶ Starten';
        } else {
            card.classList.add('locked');
            card.classList.remove('unlocked', 'completed');
            statusElement.textContent = '🔒 Gesperrt';
        }
    }

    // Update rank badge
    updateRankBadge();
}

function updateRankBadge() {
    const rankBadge = document.getElementById('rankBadge');
    const rankIcon = document.getElementById('rankIcon');
    const rankLabel = document.getElementById('rankLabel');

    let rank = 'Anfänger';
    let icon = '';
    let rankClass = '';

    if (gameState.totalPoints >= 500) {
        rank = 'Gold';
        icon = '🥇';
        rankClass = 'gold';
    } else if (gameState.totalPoints >= 400) {
        rank = 'Silber';
        icon = '🥈';
        rankClass = 'silver';
    } else if (gameState.totalPoints >= 300) {
        rank = 'Bronze';
        icon = '🥉';
        rankClass = 'bronze';
    }

    if (rank !== 'Anfänger') {
        rankIcon.textContent = icon;
        rankLabel.textContent = rank;
        rankBadge.className = 'rank-badge ' + rankClass;
        rankBadge.style.display = 'flex';
        gameState.currentRank = rank;
    }
}

// ===== CHALLENGE START =====
function startChallenge(level) {
    gameState.currentChallenge = level;
    gameState.matchedPairs = 0;
    gameState.flippedCards = [];
    gameState.canFlip = true;

    switchScreen('levelSelectScreen', 'memoryGameScreen');
    initMemoryGame(level);
}

function initMemoryGame(level) {
    const data = MEMORY_DATA[level];
    const grid = document.getElementById('memoryGrid');

    // Create card pairs
    const cards = [];
    data.pairs.forEach(pair => {
        // Add two copies of each card
        cards.push({ ...pair, uniqueId: pair.id + '-1' });
        cards.push({ ...pair, uniqueId: pair.id + '-2' });
    });

    // Shuffle cards
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    gameState.memoryCards = cards;

    // Set grid class based on number of pairs
    grid.className = 'memory-grid';
    grid.classList.add(`pairs-${data.pairs.length}`);

    // Render cards
    grid.innerHTML = '';
    cards.forEach((card, index) => {
        const cardElement = createMemoryCard(card, index);
        grid.appendChild(cardElement);
    });
}

function createMemoryCard(cardData, index) {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.id = cardData.id;
    card.dataset.uniqueId = cardData.uniqueId;
    card.dataset.index = index;
    card.dataset.skin = gameState.selectedSkin;

    card.innerHTML = `
        <div class="card-inner">
            <div class="card-face card-back"></div>
            <div class="card-face card-front">
                <div class="card-icon">${cardData.icon}</div>
                <div class="card-title">${cardData.title}</div>
            </div>
        </div>
    `;

    card.addEventListener('click', () => flipCard(index));

    return card;
}

// ===== MEMORY GAME LOGIC =====
function flipCard(index) {
    if (!gameState.canFlip) return;

    const card = document.querySelector(`.memory-card[data-index="${index}"]`);
    if (!card || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    // Flip the card
    card.classList.add('flipped');
    gameState.flippedCards.push(index);

    // Check if two cards are flipped
    if (gameState.flippedCards.length === 2) {
        gameState.canFlip = false;
        setTimeout(checkMatch, 800);
    }
}

function checkMatch() {
    const [index1, index2] = gameState.flippedCards;
    const card1 = document.querySelector(`.memory-card[data-index="${index1}"]`);
    const card2 = document.querySelector(`.memory-card[data-index="${index2}"]`);

    const id1 = card1.dataset.id;
    const id2 = card2.dataset.id;

    if (id1 === id2) {
        // Match!
        card1.classList.add('matched');
        card2.classList.add('matched');

        gameState.matchedPairs++;

        // Show info modal
        const cardData = MEMORY_DATA[gameState.currentChallenge].pairs.find(p => p.id === id1);
        showInfoModal(cardData);
    } else {
        // No match - just flip back
        card1.classList.add('shake');
        card2.classList.add('shake');

        setTimeout(() => {
            card1.classList.remove('flipped', 'shake');
            card2.classList.remove('flipped', 'shake');
        }, 500);
    }

    gameState.flippedCards = [];
    gameState.canFlip = true;
}


// ===== INFO MODAL =====
function showInfoModal(cardData) {
    const modal = document.getElementById('infoModal');
    document.getElementById('infoModalIcon').textContent = cardData.icon;
    document.getElementById('infoModalTitle').textContent = cardData.title;
    document.getElementById('infoModalText').textContent = cardData.info;

    modal.style.display = 'flex';
}

function closeInfoModal() {
    document.getElementById('infoModal').style.display = 'none';

    // Check if all pairs are matched after closing the info modal
    const totalPairs = MEMORY_DATA[gameState.currentChallenge].pairs.length;
    if (gameState.matchedPairs === totalPairs) {
        setTimeout(() => {
            challengeComplete();
        }, 500);
    }
}

// ===== CHALLENGE COMPLETE =====
function challengeComplete() {
    const points = GAME_CONFIG.challengePoints[gameState.currentChallenge - 1];
    const wasAlreadyCompleted = gameState.challengeProgress[gameState.currentChallenge].completed;

    // Only add points if this is the first time completing the challenge
    if (!wasAlreadyCompleted) {
        gameState.challengeProgress[gameState.currentChallenge].completed = true;
        gameState.challengeProgress[gameState.currentChallenge].points = points;
        gameState.totalPoints += points;

        // Save progress
        saveProgress();
    }

    // Show complete screen
    document.getElementById('earnedPoints').textContent = points;

    // Hide "Nächste Challenge" button if this is the last challenge
    const nextButton = document.querySelector('.next-level-button');
    if (gameState.currentChallenge >= GAME_CONFIG.totalChallenges) {
        nextButton.style.display = 'none';
    } else {
        nextButton.style.display = 'flex';
    }

    switchScreen('memoryGameScreen', 'challengeCompleteScreen');

    // Update rank badge with animation (only if points were actually added)
    if (!wasAlreadyCompleted) {
        updateRankBadge();
        const rankBadge = document.getElementById('rankBadge');
        if (rankBadge && rankBadge.style.display !== 'none') {
            rankBadge.classList.add('rank-badge-clicked');
            setTimeout(() => rankBadge.classList.remove('rank-badge-clicked'), 1000);
        }
    }
}

// ===== NAVIGATION =====
function nextChallenge() {
    if (gameState.currentChallenge < 3) {
        startChallenge(gameState.currentChallenge + 1);
    } else {
        // All challenges complete - save to main progress
        saveToMainProgress();
        goToLevelSelectWithAnimation();
    }
}

function returnToLevelSelect() {
    switchScreen(gameState.currentScreen + 'Screen', 'levelSelectScreen');
    updateLevelSelectUI();
}

function goToLevelSelectWithAnimation() {
    switchScreen('challengeCompleteScreen', 'levelSelectScreen');
    updateLevelSelectUI();
}

// ===== PAUSE MENU =====
function togglePauseMenu() {
    const pauseMenu = document.getElementById('pauseMenu');
    if (pauseMenu.style.display === 'none' || !pauseMenu.style.display) {
        pauseMenu.style.display = 'flex';
        gameState.canFlip = false;
    } else {
        pauseMenu.style.display = 'none';
        gameState.canFlip = true;
    }
}

function resumeGame() {
    document.getElementById('pauseMenu').style.display = 'none';
    gameState.canFlip = true;
}

// ===== SAVE/LOAD PROGRESS =====
function saveProgress() {
    const progress = {
        totalPoints: gameState.totalPoints,
        challengeProgress: gameState.challengeProgress,
        currentRank: gameState.currentRank
    };
    localStorage.setItem('level7Progress', JSON.stringify(progress));
}

function saveToMainProgress() {
    // Calculate actual total points from completed challenges only
    let actualPoints = 0;
    for (let i = 1; i <= 3; i++) {
        if (gameState.challengeProgress[i].completed) {
            actualPoints += gameState.challengeProgress[i].points;
        }
    }

    // Save to main game progress (script.js)
    if (typeof updateLevelProgress === 'function') {
        updateLevelProgress('level7', actualPoints);
    }
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    // Intro screen - start on any key or click
    const pressKey = document.getElementById('pressKey');
    if (pressKey) {
        pressKey.addEventListener('click', startGame);
    }

    document.addEventListener('keydown', (e) => {
        if (gameState.currentScreen === 'intro') {
            startGame();
        } else if (e.key === 'Escape' && gameState.currentScreen === 'memorygame') {
            togglePauseMenu();
        }
    });

    // Challenge card clicks
    document.querySelectorAll('.challenge-card').forEach(card => {
        card.addEventListener('click', () => {
            const level = parseInt(card.dataset.level);
            if (card.classList.contains('unlocked') || card.classList.contains('completed')) {
                startChallenge(level);
            }
        });
    });

    // Skin option clicks
    document.querySelectorAll('.skin-option').forEach(option => {
        option.addEventListener('click', () => {
            const skinName = option.dataset.skin;
            selectSkin(skinName);
        });
    });

    // Initialize intro screen
    initIntroScreen();

    // Load saved skin
    loadSelectedSkin();
});

// ===== CARD SKIN SYSTEM =====
function openSkinSelector() {
    const overlay = document.getElementById('skinSelectorOverlay');
    overlay.style.display = 'flex';
    updateSkinPreview(gameState.selectedSkin);
}

function closeSkinSelector() {
    const overlay = document.getElementById('skinSelectorOverlay');
    overlay.style.display = 'none';
}

function selectSkin(skinName) {
    // Deselect all skins
    document.querySelectorAll('.skin-option').forEach(option => {
        option.classList.remove('selected');
        option.querySelector('.skin-checkbox').checked = false;
    });

    // Select the chosen skin
    const selectedOption = document.querySelector(`.skin-option[data-skin="${skinName}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
        selectedOption.querySelector('.skin-checkbox').checked = true;
    }

    // Update game state and save
    gameState.selectedSkin = skinName;
    localStorage.setItem('level7SelectedSkin', skinName);

    // Update preview
    updateSkinPreview(skinName);

    // Apply to existing cards if in game
    applySkinsToCards();
}

function updateSkinPreview(skinName) {
    const previewBack = document.getElementById('previewCardBack');
    const previewFront = document.getElementById('previewCardFront');

    // Remove all skin data attributes
    previewBack.removeAttribute('data-skin');
    previewFront.removeAttribute('data-skin');

    // Apply skin styles based on selection
    if (skinName === 'standard') {
        previewBack.style.background = 'linear-gradient(135deg, #4b0074, #3c3aa5)';
        previewBack.style.borderColor = '#67C7FF';
        previewBack.querySelector('.preview-question').style.color = '#67C7FF';

        previewFront.style.background = 'linear-gradient(135deg, #1a1448, #2a1858)';
        previewFront.style.borderColor = '#00f7ff';
    } else if (skinName === 'gold') {
        previewBack.style.background = 'linear-gradient(135deg, #8B6914, #DAA520, #FFD700)';
        previewBack.style.borderColor = '#FFD700';
        previewBack.querySelector('.preview-question').style.color = '#FFD700';

        previewFront.style.background = 'linear-gradient(135deg, #3d2a10, #5c4520)';
        previewFront.style.borderColor = '#FFD700';
    } else if (skinName === 'matrix') {
        previewBack.style.background = 'linear-gradient(135deg, #001a00, #003300)';
        previewBack.style.borderColor = '#00ff00';
        previewBack.querySelector('.preview-question').style.color = '#00ff00';

        previewFront.style.background = 'linear-gradient(135deg, #001a00, #002200)';
        previewFront.style.borderColor = '#00ff00';
    } else if (skinName === 'purple') {
        previewBack.style.background = 'linear-gradient(135deg, #4b0082, #8b008b, #9370db)';
        previewBack.style.borderColor = '#9370db';
        previewBack.querySelector('.preview-question').style.color = '#da70d6';

        previewFront.style.background = 'linear-gradient(135deg, #2d1b4e, #3d2858)';
        previewFront.style.borderColor = '#da70d6';
    } else if (skinName === 'mercedes') {
        previewBack.style.background = 'linear-gradient(135deg, #1a1a1a, #2f2f2f, #4a4a4a)';
        previewBack.style.borderColor = '#c0c0c0';
        previewBack.querySelector('.preview-question').style.color = '#c0c0c0';

        previewFront.style.background = 'linear-gradient(135deg, #0a0a0a, #1a1a1a)';
        previewFront.style.borderColor = '#c0c0c0';
    } else if (skinName === 'fire') {
        previewBack.style.background = 'linear-gradient(135deg, #8b0000, #dc143c, #ff4500)';
        previewBack.style.borderColor = '#ff4500';
        previewBack.querySelector('.preview-question').style.color = '#ffa500';

        previewFront.style.background = 'linear-gradient(135deg, #4a0000, #6a0000)';
        previewFront.style.borderColor = '#ff4500';
    }
}

function applySkinsToCards() {
    const cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => {
        card.setAttribute('data-skin', gameState.selectedSkin);
    });
}

function loadSelectedSkin() {
    const savedSkin = localStorage.getItem('level7SelectedSkin');
    if (savedSkin) {
        gameState.selectedSkin = savedSkin;
        selectSkin(savedSkin);
    }
}

// ===== GLOBAL FUNCTIONS (for HTML onclick) =====
window.startGame = startGame;
window.startChallenge = startChallenge;
window.nextChallenge = nextChallenge;
window.returnToLevelSelect = returnToLevelSelect;
window.goToLevelSelectWithAnimation = goToLevelSelectWithAnimation;
window.closeInfoModal = closeInfoModal;
window.resumeGame = resumeGame;
window.openSkinSelector = openSkinSelector;
window.closeSkinSelector = closeSkinSelector;
window.selectSkin = selectSkin;
