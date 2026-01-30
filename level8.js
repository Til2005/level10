// Level 8 - Advanced Prompting - Game Logic

// ===== CONSTANTS & CONFIGURATION =====
const GAME_CONFIG = {
    totalChallenges: 5,
    pointsPerChallenge: 100,
    totalPoints: 500,
    storageKey: 'aiBytes_level6_progress_data'
};

// ===== TXP ANIMATIONS =====
const TXP_ANIMATIONS = {
    stand: {
        path: 'TXP/TXP_Stand_Pose/TXP Stand Pose_',
        frames: 24,
        speed: 40
    },
    talk: {
        path: 'TXP/TXP_Talk_Pose/TXP_Talk Pose_',
        frames: 24,
        speed: 60
    }
};

// ===== CHALLENGE DATA =====
const CHALLENGE_DATA = {
    1: {
        name: "Basis-Struktur",
        icon: "🎯",
        technique: null, // Keine spezielle Technik
        scenarios: [
            {
                id: "scenario-1a",
                icon: "📊",
                title: "Qualitätsbericht Karosserie",
                description: "Qualitätsbericht erstellen für Karosseriefertigung"
            },
            {
                id: "scenario-1b",
                icon: "⚠️",
                title: "Arbeitssicherheits-Hinweis",
                description: "Arbeitssicherheits-Hinweis für neue Mitarbeiter"
            },
            {
                id: "scenario-1c",
                icon: "🚗",
                title: "E-Klasse Spezifikation",
                description: "Technische Spezifikation der E-Klasse zusammenfassen"
            }
        ],
        blocks: [
            {
                id: "block-1a",
                type: "Promptbaustein 1",
                icon: "📊",
                text: "Du bist Qualitätsingenieur. Erstelle Wochenbericht zur Karosserie. Format: Stichpunkte.",
                correctScenario: "scenario-1a"
            },
            {
                id: "block-1b",
                type: "Promptbaustein 2",
                icon: "⚠️",
                text: "Du bist Sicherheits-Experte. Erkläre Schutzausrüstung. Zielgruppe: Neue Mitarbeiter.",
                correctScenario: "scenario-1b"
            },
            {
                id: "block-1c",
                type: "Promptbaustein 3",
                icon: "🚗",
                text: "Du bist Produktspezialist. Fasse E-Klasse zusammen. Themen: Antrieb, Assistenz, Connectivity.",
                correctScenario: "scenario-1c"
            }
        ],
        tutorialMessages: [
            "Willkommen zu Advanced Prompting! 🎯",
            "Ein guter Prompt braucht STRUKTUR: Rolle, Aufgabe, Kontext und Format.",
            "Ziehe die passenden Bausteine zu den Szenarien oben.",
            "In Challenge 1 passen alle 3 Bausteine!",
            "Viel Erfolg! 🚀"
        ],
        successMessage: "Perfekt! Du verstehst jetzt, wie wichtig Struktur beim Prompten ist! 🎯"
    },

    2: {
        name: "Few-Shot",
        icon: "💡",
        technique: {
            name: "Few-Shot:",
            description: "Man gibt der KI mehrere Beispiele"
        },
        scenarios: [
            {
                id: "scenario-2a",
                icon: "🎨",
                title: "Lackfehler klassifizieren",
                description: "Fehlertypen in Lackierung klassifizieren"
            },
            {
                id: "scenario-2b",
                icon: "🔧",
                title: "Ersatzteil-Anfragen",
                description: "Ersatzteil-Anfragen kategorisieren"
            },
            {
                id: "scenario-2c",
                icon: "📈",
                title: "Produktions-Status",
                description: "Produktions-Status interpretieren"
            }
        ],
        blocks: [
            {
                id: "block-2a",
                type: "Promptbaustein 1",
                icon: "🎨",
                text: "Klassifiziere Lackfehler. Beispiele: 'Kleiner Kratzer' → Klasse B, 'Großer Kratzer' → Klasse A",
                correctScenario: "scenario-2a"
            },
            {
                id: "block-2wrong",
                type: "Promptbaustein 2",
                icon: "❌",
                text: "Kategorisiere Anfragen nach Dringlichkeit. Nutze dein bestes Urteilsvermögen.",
                correctScenario: null
            },
            {
                id: "block-2b",
                type: "Promptbaustein 3",
                icon: "🔧",
                text: "Kategorisiere Ersatzteil-Anfragen. Beispiele: 'Maschine steht' → Notfall, 'Ersatzteil' → Normal",
                correctScenario: "scenario-2b"
            },
            {
                id: "block-2c",
                type: "Promptbaustein 4",
                icon: "📈",
                text: "Interpretiere Produktions-Status. Beispiele: 'Takt 57s, Ziel 60s' → OK, 'Takt 75s, Ziel 60s' → Verzögerung",
                correctScenario: "scenario-2c"
            }
        ],
        tutorialMessages: [
            "Challenge 2: Few-Shot Learning! 💡",
            "Few-Shot bedeutet: Du gibst der KI 2-3 Beispiele.",
            "Die KI lernt daraus das Muster und wendet es an.",
            "Beispiel: 'Kratzer 5cm → A, Staub 2mm → B'",
            "Achtung: 4 Bausteine, nur 3 passen! Los! 🚀"
        ],
        successMessage: "Super! Few-Shot Learning ist eine mächtige Technik! 💡"
    },

    3: {
        name: "Chain-of-Thought",
        icon: "🔗",
        technique: {
            name: "Chain-of-Thought:",
            description: "KI zeigt ihren Denkprozess Schritt für Schritt"
        },
        scenarios: [
            {
                id: "scenario-3a",
                icon: "📊",
                title: "Produktionseffizienz",
                description: "Produktionseffizienz berechnen (Verfügbarkeit: 85%, Leistung: 90%, Qualität: 95%)"
            },
            {
                id: "scenario-3b",
                icon: "🚚",
                title: "Lieferketten-Problem",
                description: "Lieferketten-Problem analysieren (Verzögerung Zulieferer)"
            },
            {
                id: "scenario-3c",
                icon: "⏱️",
                title: "Taktzeit-Überschreitung",
                description: "Ursache für Taktzeit-Überschreitung finden (Produktion)"
            }
        ],
        blocks: [
            {
                id: "block-3wrong1",
                type: "Promptbaustein 1",
                icon: "❌",
                text: "Erstelle einen Qualitätsbericht für die Karosserie.",
                correctScenario: null
            },
            {
                id: "block-3a",
                type: "Promptbaustein 2",
                icon: "📊",
                text: "Berechne Produktionseffizienz aus Verfügbarkeit, Leistung und Qualität. Erkläre jeden Rechenschritt.",
                correctScenario: "scenario-3a"
            },
            {
                id: "block-3b",
                type: "Promptbaustein 3",
                icon: "🚚",
                text: "Analysiere die Lieferverzögerung. Denke laut: Was ist das Problem? Welche Optionen gibt es? Was empfiehlst du?",
                correctScenario: "scenario-3b"
            },
            {
                id: "block-3wrong2",
                type: "Promptbaustein 4",
                icon: "❌",
                text: "Finde schnell eine Lösung für das Produktionsproblem.",
                correctScenario: null
            },
            {
                id: "block-3c",
                type: "Promptbaustein 5",
                icon: "⏱️",
                text: "Warum dauert die Produktion zu lange? Denke Schritt für Schritt: Station identifizieren, Ursache finden, Lösung vorschlagen.",
                correctScenario: "scenario-3c"
            }
        ],
        tutorialMessages: [
            "Challenge 3: Chain-of-Thought! 🔗",
            "Chain-of-Thought = Schritt-für-Schritt denken.",
            "Die KI erklärt jeden Schritt ihrer Überlegung.",
            "Beispiel: '1) Prüfe Werte 2) Berechne 3) Ergebnis'",
            "5 Bausteine, nur 3 richtig. Viel Erfolg! 🚀"
        ],
        successMessage: "Großartig! Chain-of-Thought macht KI-Antworten nachvollziehbar! 🔗"
    },

    4: {
        name: "Tree of Thoughts",
        icon: "🌳",
        technique: {
            name: "Tree of Thoughts:",
            description: "KI prüft mehrere Lösungswege parallel"
        },
        scenarios: [
            {
                id: "scenario-4a",
                icon: "🔧",
                title: "Montagereihenfolge",
                description: "Optimierung der Montagereihenfolge (3 Varianten prüfen)"
            },
            {
                id: "scenario-4b",
                icon: "⚡",
                title: "Energiespar-Konzept",
                description: "Energiespar-Konzept für Lackiererei entwickeln"
            },
            {
                id: "scenario-4c",
                icon: "👥",
                title: "Schichtmodell",
                description: "Neue Schichtmodell-Optionen bewerten"
            }
        ],
        blocks: [
            {
                id: "block-4a",
                type: "Promptbaustein 1",
                icon: "🔧",
                text: "Montage: Erstelle 3 verschiedene Reihenfolgen. Vergleiche sie nach Zeit und Fehlerrisiko. Empfehle die beste.",
                correctScenario: "scenario-4a"
            },
            {
                id: "block-4wrong1",
                type: "Promptbaustein 2",
                icon: "❌",
                text: "Montage: Finde die beste Reihenfolge für die Montage.",
                correctScenario: null
            },
            {
                id: "block-4wrong2",
                type: "Promptbaustein 3",
                icon: "❌",
                text: "Energie: Entwickle ein Konzept zum Energie sparen.",
                correctScenario: null
            },
            {
                id: "block-4b",
                type: "Promptbaustein 4",
                icon: "⚡",
                text: "Energie sparen in Lackiererei: Entwickle 3 Konzepte. Vergleiche Kosten und Einsparung. Wähle das beste.",
                correctScenario: "scenario-4b"
            },
            {
                id: "block-4c",
                type: "Promptbaustein 5",
                icon: "👥",
                text: "Schichtarbeit: Erstelle 3 unterschiedliche Schichtmodelle. Vergleiche Produktivität und Mitarbeiterzufriedenheit. Wähle das beste.",
                correctScenario: "scenario-4c"
            },
            {
                id: "block-4wrong3",
                type: "Promptbaustein 6",
                icon: "❌",
                text: "Schicht: Schlage ein gutes Schichtmodell vor.",
                correctScenario: null
            }
        ],
        tutorialMessages: [
            "Challenge 4: Tree of Thoughts! 🌳",
            "Tree of Thoughts = Mehrere Lösungen generieren.",
            "Die KI erstellt 3 Varianten und bewertet sie.",
            "Beispiel: 'Option A, B, C vergleichen → beste wählen'",
            "6 Bausteine - nur 3 richtig. Los! 🚀"
        ],
        successMessage: "Hervorragend! Tree of Thoughts bringt die besten Lösungen! 🌳"
    },

    5: {
        name: "Guardrails",
        icon: "⚠️",
        technique: {
            name: "Guardrails:",
            description: "Sicherheitsregeln schützen vor Fehlern und Datenlecks"
        },
        scenarios: [
            {
                id: "scenario-5a",
                icon: "📋",
                title: "Mitarbeiter-Feedback",
                description: "Mitarbeiter-Feedback analysieren (enthält Namen, persönliche Daten)"
            },
            {
                id: "scenario-5b",
                icon: "⭐",
                title: "Lieferanten-Bewertung",
                description: "Lieferanten-Bewertung erstellen (Fairness beachten)"
            },
            {
                id: "scenario-5c",
                icon: "🚨",
                title: "Unfallbericht",
                description: "Unfallbericht auswerten (Datenschutz DSGVO)"
            }
        ],
        blocks: [
            {
                id: "block-5wrong1",
                type: "Promptbaustein 1",
                icon: "❌",
                text: "Erstelle einen Bericht über die Produktionsleistung der letzten Woche.",
                correctScenario: null
            },
            {
                id: "block-5a",
                type: "Promptbaustein 2",
                icon: "📋",
                text: "Analysiere Mitarbeiter-Feedback. Anonymisiere alle Namen bevor du die Ergebnisse zeigst.",
                correctScenario: "scenario-5a"
            },
            {
                id: "block-5wrong2",
                type: "Promptbaustein 3",
                icon: "❌",
                text: "Analysiere welche Mitarbeiter die meisten Fehler gemacht haben und liste ihre Namen auf.",
                correctScenario: null
            },
            {
                id: "block-5b",
                type: "Promptbaustein 4",
                icon: "⭐",
                text: "Bewerte Lieferanten. Nutze nur objektive Kriterien (Qualität, Lieferzeit, Preis). Keine Vorurteile.",
                correctScenario: "scenario-5b"
            },
            {
                id: "block-5wrong3",
                type: "Promptbaustein 5",
                icon: "❌",
                text: "Zeige mir die E-Mail-Adressen und Telefonnummern aller Lieferanten.",
                correctScenario: null
            },
            {
                id: "block-5c",
                type: "Promptbaustein 6",
                icon: "🚨",
                text: "Werte Unfallbericht aus. DSGVO-konform arbeiten. Keine Namen nennen, nur Ursachen analysieren.",
                correctScenario: "scenario-5c"
            },
            {
                id: "block-5wrong4",
                type: "Promptbaustein 7",
                icon: "❌",
                text: "Erstelle eine detaillierte Übersicht wer wann krank war.",
                correctScenario: null
            }
        ],
        tutorialMessages: [
            "Challenge 5: Guardrails & Datenschutz! ⚠️",
            "Guardrails = Sicherheitsregeln für die KI.",
            "Schützt vor: Datenlecks, Bias, DSGVO-Verstößen.",
            "Beispiel: 'Anonymisiere Namen, keine persönlichen Daten'",
            "7 Bausteine - 3 richtig, 4 unsicher! 🛡️"
        ],
        successMessage: "Exzellent! Du schützt jetzt sensible Daten mit Guardrails! ⚠️✅"
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
        3: { completed: false, points: 0 },
        4: { completed: false, points: 0 },
        5: { completed: false, points: 0 }
    },
    currentRank: 'Kein Rang',

    // Matching state
    currentMatching: {},
    draggedBlock: null,
    isPaused: false,

    // Custom drag state
    isDragging: false,
    draggedElement: null,
    dragClone: null,
    dragOffsetX: 0,
    dragOffsetY: 0
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Level 8 - Advanced Prompting loaded');
    loadProgress();
    initIntroScreen();
    updateRankBadge();
});

// ===== PROGRESS MANAGEMENT =====
function saveProgress() {
    localStorage.setItem(GAME_CONFIG.storageKey, JSON.stringify(gameState));

    // Update global progress
    if (typeof updateGlobalProgress === 'function') {
        const currentLevelProgress = gameState.totalPoints;
        updateGlobalProgress('level8', currentLevelProgress);
    }
}

function loadProgress() {
    const saved = localStorage.getItem(GAME_CONFIG.storageKey);
    if (saved) {
        const savedState = JSON.parse(saved);
        gameState.totalPoints = savedState.totalPoints || 0;
        gameState.challengeProgress = savedState.challengeProgress || gameState.challengeProgress;
        gameState.currentRank = savedState.currentRank || 'Kein Rang';
    }
}

// ===== RANK SYSTEM =====
function updateRank() {
    const points = gameState.totalPoints;
    let rank = 'Kein Rang';

    if (points >= 500) rank = 'Gold';
    else if (points >= 400) rank = 'Silber';
    else if (points >= 300) rank = 'Bronze';

    gameState.currentRank = rank;
}

function updateRankBadge() {
    const rankBadge = document.getElementById('rankBadge');
    const rankIcon = document.getElementById('rankIcon');
    const rankLabel = document.getElementById('rankLabel');

    if (!rankBadge) return;

    const rank = gameState.currentRank;

    // Hide badge if no rank (like level2)
    if (rank === 'Kein Rang' || rank === 'Anfänger') {
        rankBadge.style.display = 'none';
        return;
    }

    // Show badge
    rankBadge.style.display = 'flex';
    const rankClass = rank.toLowerCase(); // 'gold', 'silber', 'bronze'
    rankBadge.className = `rank-badge ${rankClass}`;

    // Set label (no icon like level2)
    rankLabel.textContent = rank;
    rankIcon.textContent = '';
}

// ===== INTRO SCREEN =====
function initIntroScreen() {
    const pressKey = document.getElementById('pressKey');
    const introScreen = document.getElementById('introScreen');

    // Flow canvas animation
    initFlowCanvas();

    // Letter drop animation
    const letters = document.querySelectorAll('.letter');
    letters.forEach((letter, index) => {
        letter.style.animationDelay = `${index * 0.05}s`;
    });

    // Key press or click to start
    const startGame = () => {
        transitionToScreen('loadingScreen');
        simulateLoading();
    };

    document.addEventListener('keydown', startGame, { once: true });
    introScreen.addEventListener('click', startGame, { once: true });
}

function initFlowCanvas() {
    const canvas = document.getElementById('flowCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const nodes = [];
    const nodeCount = 80;

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw nodes
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

            ctx.fillStyle = 'rgba(103, 199, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.strokeStyle = `rgba(168, 106, 255, ${(1 - dist / 150) * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// ===== LOADING SCREEN =====
function simulateLoading() {
    const loadingBar = document.getElementById('loadingBar');
    const loadingText = document.getElementById('loadingText');
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                transitionToScreen('levelSelectScreen');
                initLevelSelect();
            }, 500);
        }
        loadingBar.style.width = progress + '%';
        loadingText.textContent = Math.floor(progress) + '%';
    }, 100);
}

// ===== LEVEL SELECTION =====
function initLevelSelect() {
    updateLevelSelectDisplay();

    const challengeCards = document.querySelectorAll('.challenge-card');
    challengeCards.forEach(card => {
        card.addEventListener('click', function() {
            const level = parseInt(this.dataset.level);
            if (!this.classList.contains('locked')) {
                startChallenge(level);
            }
        });
    });
}

function updateLevelSelectDisplay() {
    const totalPointsDisplay = document.getElementById('totalPointsDisplay');
    const currentRankDisplay = document.getElementById('currentRankDisplay');

    if (totalPointsDisplay) {
        totalPointsDisplay.textContent = `${gameState.totalPoints} / ${GAME_CONFIG.totalPoints}`;
    }

    if (currentRankDisplay) {
        const displayRank = gameState.currentRank === 'Kein Rang' ? 'Noch kein Rang' : gameState.currentRank;
        currentRankDisplay.textContent = displayRank;
    }

    // Update challenge cards
    const challengeCards = document.querySelectorAll('.challenge-card');
    challengeCards.forEach(card => {
        const level = parseInt(card.dataset.level);
        const progress = gameState.challengeProgress[level];
        const priceTag = card.querySelector('.challenge-price-tag');

        // Show/hide price tag based on completion
        if (priceTag) {
            if (progress.completed) {
                priceTag.style.display = 'block';
            } else {
                priceTag.style.display = 'none';
            }
        }

        if (level === 1 || gameState.challengeProgress[level - 1]?.completed) {
            card.classList.remove('locked');
            card.classList.add('unlocked');
            card.querySelector('.challenge-status').textContent = progress.completed ? '✓ Abgeschlossen' : '▶ Starten';
        } else {
            card.classList.add('locked');
            card.querySelector('.challenge-status').textContent = '🔒 Gesperrt';
        }
    });
}

function startChallenge(level) {
    gameState.currentChallenge = level;
    transitionToScreen('matchingScreen');
    initMatchingScreen(level);
}

// ===== MATCHING SCREEN =====
function initMatchingScreen(level) {
    const challengeData = CHALLENGE_DATA[level];

    // Update technique legend
    const techniqueLegend = document.getElementById('techniqueLegend');
    const techniqueName = document.getElementById('techniqueName');
    const techniqueDescription = document.getElementById('techniqueDescription');

    if (challengeData.technique && techniqueLegend && techniqueName && techniqueDescription) {
        techniqueName.textContent = challengeData.technique.name;
        techniqueDescription.textContent = challengeData.technique.description;
        techniqueLegend.style.display = 'flex';
    } else if (techniqueLegend) {
        techniqueLegend.style.display = 'none';
    }

    // Hide HUD (not needed)
    const challengePointsDisplay = document.getElementById('challengePointsDisplay');
    if (challengePointsDisplay) {
        challengePointsDisplay.style.display = 'none';
    }

    // Hide validate button initially
    const validateBtn = document.getElementById('validateBtn');
    if (validateBtn) {
        validateBtn.style.display = 'none';
    }

    // Reset matching state
    gameState.currentMatching = {};

    // Generate scenarios
    generateScenarios(challengeData.scenarios);

    // Generate blocks
    generateBlocks(challengeData.blocks);

    // Show TXP tutorial for all challenges every time
    showTXPTutorial(challengeData.tutorialMessages, () => {
        if (level === 1 && !gameState.challengeProgress[level].completed) {
            showTutorialOverlay();
        }
    });
}

function generateScenarios(scenarios) {
    const scenariosGrid = document.getElementById('scenariosGrid');
    scenariosGrid.innerHTML = '';

    scenarios.forEach(scenario => {
        const card = document.createElement('div');
        card.className = 'scenario-card';
        card.dataset.scenarioId = scenario.id;

        card.innerHTML = `
            <div class="scenario-header">
                <div class="scenario-icon">${scenario.icon}</div>
                <div class="scenario-title">${scenario.title}</div>
            </div>
            <div class="scenario-description">${scenario.description}</div>
            <div class="drop-zone" data-scenario-id="${scenario.id}">
                <div class="drop-zone-placeholder">Ziehe Baustein hierher</div>
            </div>
        `;

        scenariosGrid.appendChild(card);
    });

    // Init drop zones
    initDropZones();
}

function generateBlocks(blocks) {
    const blocksPalette = document.getElementById('blocksPalette');
    blocksPalette.innerHTML = '';

    // Shuffle blocks for variety
    const shuffledBlocks = [...blocks].sort(() => Math.random() - 0.5);

    shuffledBlocks.forEach((block, index) => {
        const blockEl = document.createElement('div');
        blockEl.className = 'prompt-block';
        blockEl.dataset.blockId = block.id;
        blockEl.dataset.correctScenario = block.correctScenario || '';

        // Renumber blocks after shuffling: 1, 2, 3...
        const displayNumber = index + 1;

        blockEl.innerHTML = `
            <div class="prompt-block-header">
                <div class="prompt-block-type">Promptbaustein ${displayNumber}</div>
            </div>
            <div class="prompt-block-text">${block.text}</div>
        `;

        blocksPalette.appendChild(blockEl);

        // Custom drag events
        blockEl.addEventListener('mousedown', handleCustomDragStart);
        blockEl.addEventListener('touchstart', handleCustomDragStart);
    });
}

function initDropZones() {
    const dropZones = document.querySelectorAll('.drop-zone');

    dropZones.forEach(zone => {
        // No event listeners needed - custom drag handles everything
    });

    // Global mouse/touch events for custom drag
    document.addEventListener('mousemove', handleCustomDragMove);
    document.addEventListener('mouseup', handleCustomDragEnd);
    document.addEventListener('touchmove', handleCustomDragMove);
    document.addEventListener('touchend', handleCustomDragEnd);
}

// ===== CUSTOM DRAG & DROP =====
function handleCustomDragStart(e) {
    // Don't start drag if clicking on a button or if already dragging
    if (gameState.isDragging) return;

    const block = e.target.closest('.prompt-block');
    if (!block) return;

    e.preventDefault();

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    if (!clientX || !clientY) return;

    gameState.isDragging = true;
    gameState.draggedElement = block;

    const rect = block.getBoundingClientRect();
    gameState.dragOffsetX = clientX - rect.left;
    gameState.dragOffsetY = clientY - rect.top;

    // Create visual clone that follows mouse
    const clone = block.cloneNode(true);
    clone.classList.add('drag-clone');
    clone.style.position = 'fixed';
    clone.style.pointerEvents = 'none';
    clone.style.zIndex = '10000';
    clone.style.width = rect.width + 'px';
    clone.style.left = (clientX - gameState.dragOffsetX) + 'px';
    clone.style.top = (clientY - gameState.dragOffsetY) + 'px';
    clone.style.opacity = '0.9';
    clone.style.transform = 'rotate(5deg) scale(1.05)';
    clone.style.transition = 'none';
    clone.style.cursor = 'grabbing';

    document.body.appendChild(clone);
    gameState.dragClone = clone;

    // Make original semi-transparent
    block.style.opacity = '0.3';
}

function handleCustomDragMove(e) {
    if (!gameState.isDragging || !gameState.dragClone) return;

    e.preventDefault();

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    if (!clientX || !clientY) return;

    // Move clone with mouse
    gameState.dragClone.style.left = (clientX - gameState.dragOffsetX) + 'px';
    gameState.dragClone.style.top = (clientY - gameState.dragOffsetY) + 'px';

    // Highlight drop zones
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => {
        const rect = zone.getBoundingClientRect();
        if (clientX >= rect.left && clientX <= rect.right &&
            clientY >= rect.top && clientY <= rect.bottom) {
            if (!zone.classList.contains('filled') || zone.querySelector('.prompt-block') === gameState.draggedElement) {
                zone.classList.add('drag-over');
            }
        } else {
            zone.classList.remove('drag-over');
        }
    });
}

function handleCustomDragEnd(e) {
    if (!gameState.isDragging) return;

    e.preventDefault();

    const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
    const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);

    // Find drop zone under mouse
    let targetDropZone = null;
    if (clientX && clientY) {
        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            const rect = zone.getBoundingClientRect();
            if (clientX >= rect.left && clientX <= rect.right &&
                clientY >= rect.top && clientY <= rect.bottom) {
                targetDropZone = zone;
            }
        });
    }

    // Clean up
    if (gameState.dragClone) {
        gameState.dragClone.remove();
        gameState.dragClone = null;
    }

    if (gameState.draggedElement) {
        gameState.draggedElement.style.opacity = '1';
    }

    document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('drag-over'));

    // Handle drop
    if (targetDropZone && gameState.draggedElement) {
        handleCustomDrop(targetDropZone, gameState.draggedElement);
    }

    gameState.isDragging = false;
    gameState.draggedElement = null;
}

function handleCustomDrop(dropZone, block) {
    const scenarioId = dropZone.dataset.scenarioId;
    const blockId = block.dataset.blockId;

    // Check if block is already in another zone
    const oldScenario = Object.keys(gameState.currentMatching).find(
        key => gameState.currentMatching[key] === blockId
    );

    if (oldScenario) {
        // Remove from old zone
        const oldZone = document.querySelector(`.drop-zone[data-scenario-id="${oldScenario}"]`);
        if (oldZone) {
            oldZone.classList.remove('filled');
            oldZone.querySelector('.prompt-block')?.remove();
        }
    }

    // Check if this zone already has a block - if yes, return it to palette
    const existingBlockId = gameState.currentMatching[scenarioId];
    if (existingBlockId) {
        // Return existing block to palette
        const existingBlock = document.querySelector(`.blocks-palette .prompt-block[data-block-id="${existingBlockId}"]`);
        if (existingBlock) {
            existingBlock.style.display = 'block';
        }
        // Remove old block from zone
        dropZone.querySelector('.prompt-block')?.remove();
    }

    // Add to new zone
    gameState.currentMatching[scenarioId] = blockId;
    dropZone.classList.add('filled');

    // Clone block into drop zone
    const blockClone = block.cloneNode(true);
    blockClone.classList.add('in-dropzone');
    blockClone.classList.remove('dragging', 'drag-clone');
    blockClone.dataset.blockId = blockId;
    blockClone.dataset.correctScenario = block.dataset.correctScenario;
    blockClone.style.opacity = '1';
    blockClone.style.transform = 'none';

    // NO drag events for blocks in drop zone - they stay put

    // Add delete button (trash icon)
    const deleteBtn = document.createElement('div');
    deleteBtn.className = 'block-delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.title = 'Baustein entfernen';
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        returnBlockToPalette(blockClone);
    });

    blockClone.appendChild(deleteBtn);

    dropZone.appendChild(blockClone);

    // Hide original in palette
    block.style.display = 'none';
}

function returnBlockToPalette(blockInZone) {
    const blockId = blockInZone.dataset.blockId;

    // Find scenario
    const scenarioId = Object.keys(gameState.currentMatching).find(
        key => gameState.currentMatching[key] === blockId
    );

    if (scenarioId) {
        delete gameState.currentMatching[scenarioId];

        const dropZone = blockInZone.closest('.drop-zone');
        if (dropZone) {
            dropZone.classList.remove('filled');
            blockInZone.remove();
        }

        // Show original in palette
        const originalBlock = document.querySelector(`.blocks-palette .prompt-block[data-block-id="${blockId}"]`);
        if (originalBlock) {
            originalBlock.style.display = 'block';
        }
    }
}

// ===== VALIDATION =====
function validateMatching() {
    const challengeData = CHALLENGE_DATA[gameState.currentChallenge];
    const scenarios = challengeData.scenarios;

    // Check if all scenarios have blocks
    if (Object.keys(gameState.currentMatching).length !== scenarios.length) {
        showFeedback(false, "Ordne allen Szenarien einen Baustein zu!");
        return;
    }

    // Check correctness
    let allCorrect = true;

    for (const scenarioId in gameState.currentMatching) {
        const blockId = gameState.currentMatching[scenarioId];
        const block = challengeData.blocks.find(b => b.id === blockId);

        if (!block || block.correctScenario !== scenarioId) {
            allCorrect = false;
            break;
        }
    }

    if (allCorrect) {
        // Success!
        completeChallenge();
    } else {
        showFeedback(false, "Nicht ganz richtig. Prüfe die Zuordnungen!");
    }
}

function showFeedback(success, message) {
    // Simple alert for now - could be enhanced with animation
    alert(message);
}

function completeChallenge() {
    const level = gameState.currentChallenge;

    // Award points
    if (!gameState.challengeProgress[level].completed) {
        gameState.totalPoints += GAME_CONFIG.pointsPerChallenge;
        gameState.challengeProgress[level].completed = true;
        gameState.challengeProgress[level].points = GAME_CONFIG.pointsPerChallenge;
    }

    updateRank();
    saveProgress();

    // Show complete screen
    showCompleteScreen();
}

// ===== COMPLETE SCREEN =====
function showCompleteScreen() {
    const challengeData = CHALLENGE_DATA[gameState.currentChallenge];

    transitionToScreen('challengeCompleteScreen');

    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.textContent = challengeData.successMessage;
    }

    // Hide "Next Challenge" button on last challenge
    const nextChallengeBtn = document.querySelector('.next-level-button');
    if (nextChallengeBtn) {
        if (gameState.currentChallenge >= GAME_CONFIG.totalChallenges) {
            nextChallengeBtn.style.display = 'none';
        } else {
            nextChallengeBtn.style.display = 'inline-block';
        }
    }

    updateRankBadge();
}

function nextChallenge() {
    if (gameState.currentChallenge < GAME_CONFIG.totalChallenges) {
        gameState.currentChallenge++;
        transitionToScreen('matchingScreen');
        initMatchingScreen(gameState.currentChallenge);
    } else {
        goToLevelSelectWithAnimation();
    }
}

function goToLevelSelectWithAnimation() {
    // Hide technique legend
    const techniqueLegend = document.getElementById('techniqueLegend');
    if (techniqueLegend) {
        techniqueLegend.style.display = 'none';
    }

    transitionToScreen('levelSelectScreen');
    updateLevelSelectDisplay();
}

function returnToLevelSelect() {
    if (gameState.isPaused) {
        resumeGame();
    }

    // Hide technique legend
    const techniqueLegend = document.getElementById('techniqueLegend');
    if (techniqueLegend) {
        techniqueLegend.style.display = 'none';
    }

    transitionToScreen('levelSelectScreen');
    updateLevelSelectDisplay();
}

// ===== TXP TUTORIAL =====
let txpMessageIndex = 0;
let txpMessages = [];
let txpAnimationInterval = null;
let txpOnComplete = null;

function showTXPTutorial(messages, onComplete) {
    txpMessages = messages;
    txpMessageIndex = 0;
    txpOnComplete = onComplete;

    const overlay = document.getElementById('txpIntroOverlay');
    const assistant = document.getElementById('txpAssistant');
    const speech = document.getElementById('txpSpeech');

    overlay.style.display = 'block';
    assistant.style.display = 'block';
    speech.style.display = 'block';

    showNextTXPMessage(onComplete);

    // Start TXP talking animation
    startTXPAnimation('talk');

    // Add click handler to TXP during tutorial
    assistant.onclick = () => {
        const speech = document.getElementById('txpSpeech');
        if (speech.style.display !== 'none') {
            // If speaking, advance to next message
            showNextTXPMessage(txpOnComplete);
        } else {
            // If idle, replay tutorial
            replayTXPTutorial();
        }
    };
}

function showNextTXPMessage(onComplete) {
    if (txpMessageIndex >= txpMessages.length) {
        closeTXPTutorial();
        if (onComplete) onComplete();
        return;
    }

    const speechText = document.getElementById('txpSpeechText');
    speechText.textContent = txpMessages[txpMessageIndex];

    txpMessageIndex++;

    // Click to continue
    const speech = document.getElementById('txpSpeech');
    speech.onclick = () => showNextTXPMessage(onComplete);
}

function closeTXPTutorial() {
    const overlay = document.getElementById('txpIntroOverlay');
    const assistant = document.getElementById('txpAssistant');
    const speech = document.getElementById('txpSpeech');

    overlay.style.display = 'none';
    speech.style.display = 'none';

    // Keep TXP visible but in idle state
    assistant.style.display = 'block';
    stopTXPAnimation();
    startTXPAnimation('stand'); // Switch to stand animation

    // Add click handler to TXP to replay tutorial
    assistant.onclick = () => {
        replayTXPTutorial();
    };

    // Show validate button after TXP tutorial for all challenges
    const validateBtn = document.getElementById('validateBtn');
    if (validateBtn) {
        validateBtn.style.display = 'block';
    }
}

function replayTXPTutorial() {
    const challengeData = CHALLENGE_DATA[gameState.currentChallenge];
    if (challengeData && challengeData.tutorialMessages) {
        showTXPTutorial(challengeData.tutorialMessages);
    }
}

function startTXPAnimation(type) {
    stopTXPAnimation();

    const anim = TXP_ANIMATIONS[type];
    if (!anim) return;

    const img = document.getElementById('txpAssistantImg');
    let currentFrame = 0;

    txpAnimationInterval = setInterval(() => {
        const frameNum = String(currentFrame).padStart(5, '0');
        img.src = `${anim.path}${frameNum}.png`;
        currentFrame = (currentFrame + 1) % anim.frames;
    }, anim.speed);
}

function stopTXPAnimation() {
    if (txpAnimationInterval) {
        clearInterval(txpAnimationInterval);
        txpAnimationInterval = null;
    }
}

// ===== TUTORIAL OVERLAY =====
function showTutorialOverlay() {
    const overlay = document.getElementById('tutorialOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

function closeTutorial() {
    const overlay = document.getElementById('tutorialOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }

    // Show validate button after tutorial overlay is closed
    const validateBtn = document.getElementById('validateBtn');
    if (validateBtn) {
        validateBtn.style.display = 'block';
    }
}

// ===== PAUSE MENU =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (gameState.currentScreen === 'matchingScreen') {
            if (gameState.isPaused) {
                resumeGame();
            } else {
                pauseGame();
            }
        }
    }
});

function pauseGame() {
    gameState.isPaused = true;
    const pauseMenu = document.getElementById('pauseMenu');
    if (pauseMenu) {
        pauseMenu.style.display = 'flex';
    }
}

function resumeGame() {
    gameState.isPaused = false;
    const pauseMenu = document.getElementById('pauseMenu');
    if (pauseMenu) {
        pauseMenu.style.display = 'none';
    }
}

// ===== SCREEN TRANSITIONS =====
function transitionToScreen(screenId) {
    const screens = document.querySelectorAll('.game-screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    const newScreen = document.getElementById(screenId);
    if (newScreen) {
        newScreen.classList.add('active');
    }

    gameState.currentScreen = screenId;
}
