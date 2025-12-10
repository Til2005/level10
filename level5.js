// Level 5 - Schummeln erlaubt - Platformer Game Logic

// ===== CONSTANTS =====
const GAME_CONFIG = {
    playerSpeed: 8,
    playerWidth: 150,
    playerHeight: 150,
    jumpForce: -18,
    gravity: 0.7,
    groundLevel: 50,
    lives: 1,
    debugHitboxes: false, // Toggle with 'H' key
    cameraOffset: 400, // Player X position relative to screen
    levelWidth: 5000 // Each level is 5000px wide
};

// ===== ANIMATION PATHS (From Level 4) =====
const ANIMATIONS = {
    stand: {
        path: 'Mo_man_Stand_Pose/Mo man Stand Pose_',
        frames: 24,
        speed: 40
    },
    run: {
        path: 'Mo man Lauf 2s 24fps 48 frames/Mo man Lauf Pose_',
        frames: 48,
        speed: 18
    },
    jump: {
        path: 'Mo_man_Sprung_Pose/Mo man Sprung_',
        frames: 42,
        speed: 25,
        peakFrames: [27, 28]
    },
    enemy: {
        path: 'Gegner FPS 12/AI Gegner_FPS 120',
        frames: 12,
        speed: 3
    },
    jumpingEnemy: {
        path: 'Gegner PNG 12 FPS/Gegner Loop_',
        frames: 24,
        speed: 2
    }
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
    },
    jump: {
        path: 'TXP/TXP_Sprung_Pose/TXP Sprung_',
        frames: 120,
        speed: 40
    }
};

// ===== LEVEL DATA - 5 Fixed Levels (Progressiv schwieriger) =====
const LEVEL_DATA = {
    1: {
        name: "Erste Anfrage",
        difficulty: "Tutorial - Sehr Einfach",
        prompt: "Zeig mir Produktionsdaten für Werk 040",
        requiredPieces: [
            { id: "zeig-mir", text: "Zeig mir", type: "good" },
            { id: "produktionsdaten", text: "Produktionsdaten", type: "good" },
            { id: "werk-040", text: "für Werk 040", type: "good" }
        ],
        platforms: [
            // Große durchgehende Bodenplattform - Tutorial Level (Grün)
            { x: 0, y: 650, width: 5000, height: 50, green: true },
            // Wenige, einfache erhöhte Plattformen
            { x: 700, y: 500, width: 250, height: 30 },
            { x: 1700, y: 500, width: 250, height: 30 },
            { x: 2800, y: 500, width: 250, height: 30 }
        ],
        promptPieces: [
            // Good pieces auf einfachen Positionen
            { x: 780, y: 220, id: "zeig-mir", text: "Zeig mir", type: "good" },
            { x: 1750, y: 220, id: "produktionsdaten", text: "Produktionsdaten", type: "good" },
            { x: 2870, y: 220, id: "werk-040", text: "für Werk 040", type: "good" },
            // NUR 2 falsche Prompts - wenig Ablenkung
            { x: 1300, y: 590, id: "gib-daten", text: "Gib Daten", type: "bad" },
            { x: 2400, y: 590, id: "zeig-was", text: "Zeig was", type: "bad" }
        ],
        signs: [
            // Decorative wooden sign left of "Gib Daten" prompt (on platform)
            { x: 1070, y: 580, message: "bad-prompts" },
            // Sign before goal explaining level end
            { x: 3600, y: 580, message: "level-end" }
        ],
        goalX: 4700
    },

    2: {
        name: "Zeitfilter",
        difficulty: "Leicht",
        prompt: "Zeig mir Produktionsdaten im August 2025 als Balkendiagramm für Werk 040",
        requiredPieces: [
            { id: "zeig-mir", text: "Zeig mir", type: "good" },
            { id: "produktionsdaten", text: "Produktionsdaten", type: "good" },
            { id: "august-2025", text: "im August 2025", type: "good" },
            { id: "balkendiagramm", text: "als Balkendiagramm", type: "good" },
            { id: "werk-040", text: "für Werk 040", type: "good" }
        ],
        // Pieces that are already filled from previous level (shown as text, not placeholders)
        prefilledPieces: [
            { id: "zeig-mir", text: "Zeig mir" },
            { id: "produktionsdaten", text: "Produktionsdaten" },
            { id: "werk-040", text: "für Werk 040" }
        ],
        platforms: [
            // Mittelgroße Plattformen mit MODERATEN Gaps
            { x: 0, y: 650, width: 350, height: 50 },
            { x: 450, y: 650, width: 280, height: 50 },
            { x: 820, y: 650, width: 320, height: 50 },
            { x: 1230, y: 650, width: 280, height: 50 },
            { x: 1600, y: 650, width: 350, height: 50 },
            { x: 2040, y: 650, width: 280, height: 50 },
            { x: 2410, y: 650, width: 320, height: 50 },
            { x: 2820, y: 650, width: 280, height: 50 },
            { x: 3190, y: 650, width: 350, height: 50 },
            { x: 3630, y: 650, width: 1370, height: 50 },
            // Erhöhte Plattformen - etwas mehr
            { x: 550, y: 500, width: 180, height: 30 },
            { x: 920, y: 450, width: 180, height: 30 },
            { x: 1330, y: 480, width: 180, height: 30 },
            { x: 1700, y: 500, width: 180, height: 30 },
            { x: 2140, y: 450, width: 180, height: 30 },
            { x: 2510, y: 480, width: 180, height: 30 },
            { x: 2920, y: 500, width: 180, height: 30 },
            { x: 3290, y: 450, width: 180, height: 30 }
        ],
        promptPieces: [
            // Only NEW pieces to collect in Level 2
            { x: 1130, y: 230, id: "august-2025", text: "im August 2025", type: "good" },
            { x: 2800, y: 230, id: "balkendiagramm", text: "als Balkendiagramm", type: "good" },
            // Bad pieces
            { x: 1160, y: 520, id: "irgendwann", text: "irgendwann", type: "bad" },
            { x: 1540, y: 520, id: "letzte-woche", text: "letzte Woche", type: "bad" },
            { x: 1980, y: 520, id: "bald", text: "bald", type: "bad" },
            { x: 2370, y: 520, id: "neulich", text: "neulich", type: "bad" },
            { x: 2750, y: 520, id: "mal-schauen", text: "mal schauen", type: "bad" },
            { x: 3540, y: 520, id: "später", text: "später", type: "bad" }
        ],
        signs: [
            // Sign on sixth elevated platform about music and sound effects
            { x: 2160, y: 376, message: "music-info" }
        ],
        goalX: 4700
    },

    3: {
        name: "Visualisierung",
        difficulty: "Mittel",
        prompt: "Zeig mir Produktionsdaten im August 2025 als Balkendiagramm für Werk 040 filtere nach Farbe sortiert nach Menge",
        requiredPieces: [
            { id: "zeig-mir", text: "Zeig mir", type: "good" },
            { id: "produktionsdaten", text: "Produktionsdaten", type: "good" },
            { id: "august-2025", text: "im August 2025", type: "good" },
            { id: "balkendiagramm", text: "als Balkendiagramm", type: "good" },
            { id: "werk-040", text: "für Werk 040", type: "good" },
            { id: "filtere-farbe", text: "filtere nach Farbe", type: "good" },
            { id: "sortiert-menge", text: "sortiert nach Menge", type: "good" }
        ],
        // Pieces from Level 2 are prefilled
        prefilledPieces: [
            { id: "zeig-mir", text: "Zeig mir" },
            { id: "produktionsdaten", text: "Produktionsdaten" },
            { id: "august-2025", text: "im August 2025" },
            { id: "balkendiagramm", text: "als Balkendiagramm" },
            { id: "werk-040", text: "für Werk 040" }
        ],
        platforms: [
            // KLEINERE Plattformen (150-200px), GRÖSSERE Gaps (120-150px) - Medium Difficulty
            { x: 0, y: 650, width: 250, height: 50 },
            { x: 370, y: 650, width: 180, height: 40 },
            { x: 680, y: 600, width: 160, height: 40 },
            { x: 970, y: 550, width: 160, height: 40 },
            { x: 1260, y: 500, width: 180, height: 40 },
            { x: 1570, y: 550, width: 160, height: 40 },
            { x: 1860, y: 600, width: 160, height: 40 },
            { x: 2150, y: 650, width: 180, height: 40 },
            { x: 2480, y: 650, width: 160, height: 40 },
            { x: 2790, y: 600, width: 160, height: 40 },
            { x: 3080, y: 550, width: 160, height: 40 },
            { x: 3370, y: 600, width: 180, height: 40 },
            { x: 3700, y: 650, width: 160, height: 40 },
            { x: 4000, y: 650, width: 1000, height: 50 },
            // Hohe Plattformen mit mehr Vertical Challenge
            { x: 500, y: 480, width: 130, height: 30 },
            { x: 800, y: 430, width: 130, height: 30 },
            { x: 1090, y: 380, width: 130, height: 30 },
            { x: 1380, y: 350, width: 150, height: 30 },
            { x: 1690, y: 430, width: 130, height: 30 },
            { x: 1980, y: 300, width: 130, height: 30 },
            { x: 2600, y: 480, width: 130, height: 30 },
            { x: 2910, y: 430, width: 130, height: 30 },
            { x: 3200, y: 380, width: 130, height: 30 }
        ],
        promptPieces: [
            // Only NEW pieces to collect in Level 3
            { x: 1210, y: 150, id: "filtere-farbe", text: "filtere nach Farbe", type: "good" },
            { x: 2800, y: 150, id: "sortiert-menge", text: "sortiert nach Menge", type: "good" },
            // Bad pieces
            { x: 720, y: 520, id: "filter-größe", text: "filtere nach Größe", type: "bad" },
            { x: 1900, y: 520, id: "gruppiere", text: "gruppiere nach", type: "bad" },
            { x: 2650, y: 550, id: "ohne-filter", text: "ohne Filter", type: "bad" },
            { x: 2950, y: 490, id: "zeig-alles", text: "zeig alles", type: "bad" },
            { x: 3420, y: 480, id: "unsortiert", text: "unsortiert", type: "bad" }
        ],
        signs: [
            // Sign about specificity in prompts
            { x: 3220, y: 307, message: "prompt-specificity" }
        ],
        goalX: 4700
    },

    4: {
        name: "Filter & Sortierung",
        difficulty: "Schwer",
        prompt: "Zeig mir Produktionsdaten im August 2025 filtere nach Farbe sortiert nach Menge",
        requiredPieces: [
            { id: "zeig-mir", text: "Zeig mir", type: "good" },
            { id: "produktionsdaten", text: "Produktionsdaten", type: "good" },
            { id: "august-2025", text: "im August 2025", type: "good" },
            { id: "filter-farbe", text: "filtere nach Farbe", type: "good" },
            { id: "sortiert-menge", text: "sortiert nach Menge", type: "good" }
        ],
        platforms: [
            // KLEINE Plattformen (120-150px), GROSSE Gaps (150-200px) - Hard Difficulty
            { x: 0, y: 650, width: 350, height: 40 },
            // Schwieriger Zickzack-Parcours mit precision jumps
            { x: 650, y: 550, width: 130, height: 35 },
            { x: 950, y: 500, width: 130, height: 35 },
            { x: 1250, y: 450, width: 140, height: 35 },
            { x: 1550, y: 400, width: 120, height: 35 },
            { x: 1830, y: 450, width: 130, height: 35 },
            { x: 2120, y: 500, width: 130, height: 35 },
            { x: 2420, y: 550, width: 140, height: 35 },
            { x: 2720, y: 600, width: 130, height: 35 },
            { x: 3020, y: 650, width: 140, height: 40 },
            // Schmale Hindernisplattformen - Precision Challenge
            { x: 3330, y: 600, width: 110, height: 30 },
            { x: 3610, y: 550, width: 110, height: 30 },
            { x: 3890, y: 500, width: 120, height: 30 },
            { x: 4180, y: 550, width: 110, height: 30 },
            { x: 4460, y: 600, width: 120, height: 30 },
            { x: 4750, y: 650, width: 250, height: 50 },
            // Hoch platzierte schmale Plattformen für extra Challenge
            { x: 480, y: 470, width: 110, height: 25 },
            { x: 780, y: 420, width: 110, height: 25 },
            { x: 1080, y: 370, width: 110, height: 25 },
            { x: 1380, y: 320, width: 120, height: 25 },
            { x: 1680, y: 280, width: 110, height: 25 },
            { x: 1960, y: 330, width: 110, height: 25 },
            { x: 2250, y: 380, width: 110, height: 25 },
            { x: 2550, y: 430, width: 110, height: 25 }
        ],
        promptPieces: [
            // Only bad pieces - good pieces removed (Level 4: Share your prompt with colleagues)
            { x: 350, y: 230, id: "keine-filter", text: "ohne Filter", type: "bad" },
            { x: 945, y: 360, id: "random", text: "zufällig", type: "bad" },
            { x: 1830, y: 310, id: "zeig-alles", text: "zeig alles", type: "bad" },
            { x: 2110, y: 360, id: "egal-wie", text: "egal wie", type: "bad" },
            { x: 2400, y: 410, id: "mach-was", text: "mach was", type: "bad" },
            { x: 2730, y: 480, id: "irgendwie", text: "irgendwie", type: "bad" },
            { x: 4320, y: 430, id: "ohne-details", text: "ohne Details", type: "bad" }
        ],
        // Special collectible: Note to share with colleagues
        notePosition: { x: 2000, y: 200 },
        signs: [
            // Sign on high platform near the note/scroll
            { x: 1680, y: 207, message: "collect-scroll" }
        ],
        goalX: 4850
    },

    5: {
        name: "Cheat-Sheet Master",
        difficulty: "Extrem Schwer",
        prompt: "Zeig mir Produktionsdaten im August 2025 für Werk 040 als Balkendiagramm filtere nach Farbe",
        requiredPieces: [
            { id: "zeig-mir", text: "Zeig mir", type: "good" },
            { id: "produktionsdaten", text: "Produktionsdaten", type: "good" },
            { id: "august-2025", text: "im August 2025", type: "good" },
            { id: "werk-040", text: "für Werk 040", type: "good" },
            { id: "balkendiagramm", text: "als Balkendiagramm", type: "good" },
            { id: "filter-farbe", text: "filtere nach Farbe", type: "good" }
        ],
        platforms: [
            // === OBERE EBENE - START ===
            // Section 1: Schwierigere Start-Plattformen (zweite weiter links)
            { x: 0, y: 550, width: 400, height: 40 },
            { x: 500, y: 550, width: 500, height: 40 },

            // Section 2: Schwierige Sprünge nach oben (jede zweite entfernt)
            { x: 1150, y: 530, width: 120, height: 30 },
            { x: 1480, y: 450, width: 100, height: 30 },

            // Section 3: Abstieg
            { x: 1780, y: 450, width: 110, height: 30 },

            // Section 4: Plattform vor dem Fall (mit Pfeil-Markierung)
            { x: 2300, y: 550, width: 550, height: 30 },
            // HIER IST DER FALL - Kein Boden mehr, nur Teleport-Zone!
            // Keine Plattformen mehr bis zur Lava-Sektion!

            // === LAVA SEKTION (KOMPLETT GETRENNT - weit rechts) ===
            // Section 5: Lava-Sektion mit langen Plattformen (Start bei x: 10000)
            { x: 10000, y: 650, width: 350, height: 40, lava: true },
            { x: 10700, y: 650, width: 600, height: 40, lava: true },
            { x: 11650, y: 650, width: 600, height: 40, lava: true },

            // Section 6: Weniger aber breitere Aufstiegs-Plattformen
            { x: 12550, y: 600, width: 400, height: 30, lava: true },
            { x: 13300, y: 550, width: 400, height: 30, lava: true },
            { x: 14050, y: 500, width: 400, height: 30, lava: true },
            { x: 14700, y: 450, width: 1000, height: 30, lava: true },

            // Section 7: Treppe zum Teleporter (kurze Stufen nach oben)
            { x: 15900, y: 390, width: 150, height: 25, lava: true },
            { x: 16100, y: 360, width: 150, height: 25, lava: true },
            { x: 16300, y: 330, width: 150, height: 25, lava: true },
            // Plattform vor dem Teleporter nach oben (mit Pfeil-Markierung)
            // HIER IST DER TELEPORT NACH OBEN zur Ziel-Sektion!

            // === ZIEL-SEKTION (2 Plattformen + 1 extrem lange Final-Plattform) ===
            { x: 25300, y: 700, width: 300, height: 30 },
            { x: 25700, y: 650, width: 300, height: 30 },
            { x: 26100, y: 600, width: 2500, height: 40 }
        ],
        promptPieces: [
            // No good pieces in Level 5 - only bad pieces remain
            // BAD pieces - Challenge auf der langen Final-Plattform (x: 26100 bis 28600)
            // Untere Reihe - erreichbar mit Sprung (y: 460-520)
            { x: 26200, y: 520, id: "bad-1", text: "ohne Details", type: "bad" },
            { x: 26550, y: 490, id: "bad-2", text: "irgendwie", type: "bad" },
            { x: 26900, y: 460, id: "bad-4", text: "egal wie", type: "bad" },
            { x: 27300, y: 530, id: "bad-6", text: "unsortiert", type: "bad" },
            { x: 27410, y: 530, id: "bad-7", text: "random", type: "bad" },
            { x: 27700, y: 460, id: "bad-8", text: "keine Filter", type: "bad" },
            { x: 28100, y: 480, id: "bad-10", text: "keine Sortierung", type: "bad" },

            // Obere Reihe - unerreichbar (y: 180) - dicht nebeneinander
            { x: 26200, y: 180, id: "bad-11", text: "einfach so", type: "bad" },
            { x: 26350, y: 180, id: "bad-12", text: "keine Ahnung", type: "bad" },
            { x: 26520, y: 180, id: "bad-13", text: "drauflos", type: "bad" },
            { x: 26650, y: 180, id: "bad-14", text: "improvisiert", type: "bad" },
            { x: 26810, y: 180, id: "bad-15", text: "planlos", type: "bad" },
            { x: 26940, y: 180, id: "bad-16", text: "wild durcheinander", type: "bad" },
            { x: 27140, y: 180, id: "bad-17", text: "chaotisch", type: "bad" },
            { x: 27280, y: 180, id: "bad-18", text: "unstrukturiert", type: "bad" },
            { x: 27450, y: 180, id: "bad-19", text: "konfus", type: "bad" },
            { x: 27560, y: 180, id: "bad-20", text: "zusammenhangslos", type: "bad" },
            { x: 27770, y: 180, id: "bad-21", text: "unklar", type: "bad" },
            { x: 27870, y: 180, id: "bad-22", text: "vage", type: "bad" },
            { x: 27960, y: 180, id: "bad-23", text: "schwammig", type: "bad" },
            { x: 28090, y: 180, id: "bad-24", text: "unpräzise", type: "bad" },
            { x: 28220, y: 180, id: "bad-25", text: "verschwommen", type: "bad" },
            { x: 28380, y: 180, id: "bad-26", text: "nebulös", type: "bad" },
            { x: 28490, y: 180, id: "bad-27", text: "diffus", type: "bad" }
        ],
        enemies: [
            // Enemies auf längeren Lava-Plattformen - bewegen sich nur auf ihrer Plattform
            // Plattform 2: x: 10700, y: 650, width: 600
            { x: 10700, y: 539, width: 115, height: 115, speed: 1.7, platformX: 10700, platformWidth: 600 },
            // Plattform 3: x: 11700, y: 650, width: 500
            { x: 11700, y: 539, width: 115, height: 115, speed: 1.7, platformX: 11700, platformWidth: 500 },
            // Plattform 4: x: 12550, y: 600, width: 400
            { x: 12550, y: 489, width: 115, height: 115, speed: 1.7, platformX: 12550, platformWidth: 400 },
            // Plattform 5: x: 13300, y: 550, width: 400
            { x: 13300, y: 439, width: 115, height: 115, speed: 1.7, platformX: 13300, platformWidth: 400 }
        ],
        jumpingEnemies: [
            // Großer springender Enemy auf langer Plattform: x: 14700, y: 450, width: 1000
            // Mittig: platformX (14700) + (platformWidth (1000) - enemyWidth (400)) / 2 = 14700 + 300 = 15000
            { x: 15000, y: 50, width: 400, height: 400, platformX: 14700, platformWidth: 1000 }
        ],
        signs: [
            // Sign at start of lava section explaining enemy jumping mechanic
            { x: 10050, y: 575, message: "enemy-jumping" },
            // Sign before jumping enemy explaining to go under (Platform: x: 14700, y: 450)
            { x: 14750, y: 375, message: "enemy-duck" },
            // Sign at start of final section (Platform: x: 25700, y: 650)
            { x: 25730, y: 577, message: "final-section" },
            // Motivational sign near the end between "keine Filter" and "keine Sortierung"
            { x: 27900, y: 525, message: "final-motivation" }
        ],
        goalX: 28400
    }
};

// ===== MO MAN PLAYER CLASS (Platformer Version) =====
class MoManPlayer {
    static preloadedAnimations = {};

    static async preloadFrames() {
        if (Object.keys(MoManPlayer.preloadedAnimations).length > 0) {
            return Promise.resolve();
        }

        const animations = ['stand', 'run', 'jump'];
        const promises = [];

        for (const animName of animations) {
            const anim = ANIMATIONS[animName];
            MoManPlayer.preloadedAnimations[animName] = [];

            for (let i = 0; i < anim.frames; i++) {
                const img = new Image();
                const paddedNumber = String(i).padStart(5, '0');

                let frameStr = paddedNumber;
                if (animName === 'jump') {
                    if (i === 27) frameStr = '00027_a';
                    else if (i === 28) frameStr = '00028_b';
                }

                img.src = `${anim.path}${frameStr}.png`;
                MoManPlayer.preloadedAnimations[animName][i] = img;

                promises.push(new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                }));
            }
        }

        return Promise.all(promises);
    }

    constructor(gameArea, startX = 100, startY = 0, game = null) {
        this.gameArea = gameArea;
        this.game = game;
        this.element = document.getElementById('moPlayer');
        this.img = document.getElementById('moPlayerImg');

        // Position and physics
        this.x = startX;
        this.y = startY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.isGrounded = false;

        // Animation state
        this.currentAnimation = 'stand';
        this.currentFrame = 0;
        this.animationInterval = null;

        // Movement state
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.facingRight = true;

        // Debug hitbox
        this.debugHitbox = null;
        this.createDebugHitbox();

        this.startAnimation('stand');
        this.updatePosition();
    }

    createDebugHitbox() {
        this.debugHitbox = document.createElement('div');
        this.debugHitbox.className = 'debug-hitbox player';
        this.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
        this.debugHitbox.style.position = 'absolute';

        const label = document.createElement('div');
        label.className = 'debug-hitbox-label';
        label.textContent = 'Mo Man';
        this.debugHitbox.appendChild(label);

        // Add hitbox as child of player element so it moves with player
        this.element.appendChild(this.debugHitbox);
    }

    startAnimation(animName) {
        if (this.currentAnimation === animName && this.animationInterval) return;

        this.stopAnimation();
        this.currentAnimation = animName;
        this.currentFrame = 0;
        const anim = ANIMATIONS[animName];

        this.animationInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % anim.frames;
            this.updateFrame();
        }, anim.speed);
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    updateFrame() {
        const anim = ANIMATIONS[this.currentAnimation];
        let frameStr = String(this.currentFrame).padStart(5, '0');

        if (this.currentAnimation === 'jump') {
            if (this.currentFrame === 27) frameStr = '00027_a';
            else if (this.currentFrame === 28) frameStr = '00028_b';
        }

        this.img.src = `${anim.path}${frameStr}.png`;
    }

    jump() {
        if (this.isGrounded) {
            this.velocityY = GAME_CONFIG.jumpForce;
            this.isJumping = true;
            this.isGrounded = false;
            this.startAnimation('jump');

            // Play jump sound
            if (this.game && this.game.playJumpSound) {
                this.game.playJumpSound();
            }
        }
    }

    update(deltaTime, platforms) {
        // Horizontal movement with proper direction change
        if (this.isMovingLeft) {
            this.velocityX = -GAME_CONFIG.playerSpeed;
            this.facingRight = false; // Update direction (camera will apply scaleX)
        } else if (this.isMovingRight) {
            this.velocityX = GAME_CONFIG.playerSpeed;
            this.facingRight = true; // Update direction (camera will apply scaleX)
        } else {
            this.velocityX = 0;
        }

        // Update animation
        if (this.isGrounded) {
            if (this.velocityX !== 0 && this.currentAnimation !== 'run') {
                this.startAnimation('run');
            } else if (this.velocityX === 0 && this.currentAnimation === 'run') {
                this.startAnimation('stand');
            }
        }

        this.x += this.velocityX * deltaTime;

        // Store previous bottom position (feet position)
        const previousBottom = this.y + GAME_CONFIG.playerHeight;

        // Apply gravity
        this.velocityY += GAME_CONFIG.gravity * deltaTime;
        this.y += this.velocityY * deltaTime;

        // Check if grounded (reset before checking)
        this.isGrounded = false;

        // Platform collision detection - check all platforms
        for (const platform of platforms) {
            const playerBox = this.getHitbox();
            const platformBox = {
                left: platform.x,
                right: platform.x + platform.width,
                top: platform.y,
                bottom: platform.y + platform.height
            };

            // Check if player is on or landing on platform
            // Player must be falling AND their feet must have been above the platform in previous frame
            if (
                playerBox.right > platformBox.left &&
                playerBox.left < platformBox.right &&
                playerBox.bottom >= platformBox.top &&
                playerBox.bottom <= platformBox.bottom &&
                previousBottom <= platformBox.top && // Feet were above platform before
                this.velocityY > 0 // Falling down
            ) {
                // Land on platform
                this.y = platformBox.top - GAME_CONFIG.playerHeight;
                this.velocityY = 0;
                this.isGrounded = true;
                this.isJumping = false;

                // Update animation
                if (this.velocityX !== 0) {
                    this.startAnimation('run');
                } else {
                    this.startAnimation('stand');
                }
                break; // Stop checking other platforms once landed
            }
        }

        // Death if fall too low (higher limit for Level 5 with deeper sections)
        const deathLimit = GAME_CONFIG.deathLimit || 800;
        if (this.y > deathLimit) {
            return 'death';
        }

        this.updatePosition();
        return null;
    }

    updatePosition() {
        // Position is in world coordinates, will be transformed by camera
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        // Update debug hitbox (positioned relative to player)
        if (this.debugHitbox) {
            const hitboxWidth = GAME_CONFIG.playerWidth * 0.6;
            const offsetX = (GAME_CONFIG.playerWidth - hitboxWidth) / 2;

            this.debugHitbox.style.left = `${offsetX}px`;
            this.debugHitbox.style.top = `0px`;
            this.debugHitbox.style.width = `${hitboxWidth}px`;
            this.debugHitbox.style.height = `${GAME_CONFIG.playerHeight}px`;
            this.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
        }
    }

    getHitbox() {
        // Narrower hitbox (60% width) for forgiving gameplay
        const hitboxWidth = GAME_CONFIG.playerWidth * 0.6;

        return {
            left: this.x + (GAME_CONFIG.playerWidth - hitboxWidth) / 2,
            right: this.x + (GAME_CONFIG.playerWidth + hitboxWidth) / 2,
            top: this.y,
            bottom: this.y + GAME_CONFIG.playerHeight,
            centerX: this.x + GAME_CONFIG.playerWidth / 2,
            centerY: this.y + GAME_CONFIG.playerHeight / 2
        };
    }

    hide() {
        this.element.style.display = 'none';
        // Hitbox is child element, will be hidden automatically
    }

    show() {
        this.element.style.display = 'block';
        // Hitbox visibility will be updated in updatePosition()
        this.updatePosition();
    }

    reset(startX, startY) {
        this.x = startX;
        this.y = startY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.isGrounded = false;
        this.startAnimation('stand');
        this.updatePosition();
        this.show(); // Make sure player is visible after reset
    }

    destroy() {
        this.stopAnimation();
        if (this.debugHitbox) {
            this.debugHitbox.remove();
        }
    }
}

// ===== PLATFORM CLASS =====
class Platform {
    constructor(gameArea, x, y, width, height, isLava = false, isGreen = false) {
        this.gameArea = gameArea;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isLava = isLava;
        this.isGreen = isGreen;

        this.createElement();
        this.debugHitbox = null;
        this.createDebugHitbox();
    }

    createElement() {
        this.element = document.createElement('div');
        let className = 'platform';
        if (this.isLava) {
            className += ' lava-platform';
        } else if (this.isGreen) {
            className += ' green-platform';
        }
        this.element.className = className;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;

        document.getElementById('platformsContainer').appendChild(this.element);
    }

    createDebugHitbox() {
        this.debugHitbox = document.createElement('div');
        this.debugHitbox.className = 'debug-hitbox platform';
        this.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
        this.debugHitbox.style.position = 'absolute';
        this.debugHitbox.style.left = `${this.x}px`;
        this.debugHitbox.style.top = `${this.y}px`;
        this.debugHitbox.style.width = `${this.width}px`;
        this.debugHitbox.style.height = `${this.height}px`;

        const label = document.createElement('div');
        label.className = 'debug-hitbox-label';
        label.textContent = 'Platform';
        this.debugHitbox.appendChild(label);

        // Add to platformsContainer so it moves with camera
        document.getElementById('platformsContainer').appendChild(this.debugHitbox);
    }

    updateDebugHitbox() {
        if (this.debugHitbox) {
            this.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
        }
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        if (this.debugHitbox) {
            this.debugHitbox.remove();
        }
    }
}

// ===== PROMPT PIECE CLASS =====
class PromptPiece {
    constructor(gameArea, x, y, data) {
        this.gameArea = gameArea;
        this.x = x;
        this.y = y;
        this.id = data.id;
        this.text = data.text;
        this.type = data.type; // 'good' or 'bad'
        this.collected = false;

        this.createElement();
        this.debugHitbox = null;
        this.createDebugHitbox();
    }

    createElement() {
        this.element = document.createElement('div');
        // Add lego class for all prompts in Level 5
        this.element.className = `prompt-piece ${this.type} lego`;

        // Create text wrapper
        const textSpan = document.createElement('span');
        textSpan.textContent = this.text;
        this.element.appendChild(textSpan);

        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        document.getElementById('promptPiecesContainer').appendChild(this.element);

        // Cache dimensions after element is added to DOM
        requestAnimationFrame(() => {
            // Use clientWidth/clientHeight (excludes border, only content + padding)
            this.width = this.element.clientWidth;
            this.height = this.element.clientHeight;

            // Update debug hitbox with actual dimensions
            if (this.debugHitbox) {
                this.debugHitbox.style.width = `${this.width}px`;
                this.debugHitbox.style.height = `${this.height}px`;
            }

            // Add lego studs dynamically based on width (insert before text)
            this.addLegoStuds();
        });
    }

    createDebugHitbox() {
        this.debugHitbox = document.createElement('div');
        this.debugHitbox.className = 'debug-hitbox prompt';
        this.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
        this.debugHitbox.style.position = 'absolute';
        this.debugHitbox.style.left = `${this.x}px`;
        this.debugHitbox.style.top = `${this.y}px`;
        this.debugHitbox.style.border = '2px solid yellow';
        this.debugHitbox.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
        this.debugHitbox.style.pointerEvents = 'none';

        // Initial size (will be updated after element dimensions are cached)
        this.debugHitbox.style.width = '80px';
        this.debugHitbox.style.height = '40px';

        const label = document.createElement('div');
        label.className = 'debug-hitbox-label';
        label.textContent = `Prompt (${this.type})`;
        label.style.fontSize = '10px';
        label.style.color = 'yellow';
        label.style.fontWeight = 'bold';
        this.debugHitbox.appendChild(label);

        // Add to promptPiecesContainer so it moves with camera
        document.getElementById('promptPiecesContainer').appendChild(this.debugHitbox);
    }

    addLegoStuds() {
        const studWidth = 20;
        const studSpacing = 40; // Abstand zwischen Noppen (Mitte zu Mitte)

        // this.width ist jetzt clientWidth (ohne Border)
        // Also die innere Breite - genau was wir brauchen
        const centerX = this.width / 2;

        // Calculate how many studs fit (minimum 1)
        const numStuds = Math.max(1, Math.floor(this.width / studSpacing));

        // Get background color based on type
        const bgColor = this.type === 'good' ? '#2DBD2D' : '#E63E3E';

        // Get the text span (first child)
        const textSpan = this.element.firstChild;

        if (numStuds === 1) {
            // Single stud in center
            const stud = document.createElement('div');
            stud.className = 'lego-stud';
            stud.style.left = `${centerX - (studWidth / 2)}px`;
            stud.style.backgroundColor = bgColor;
            stud.style.borderBottom = `1px solid #000000`; // Dünner schwarzer Border unten
            this.element.insertBefore(stud, textSpan);
        } else {
            // Multiple studs - symmetrisch von der Mitte aus
            // Berechne die Spannweite von Mitte-zu-Mitte (erste bis letzte Noppe)
            const spanWidth = (numStuds - 1) * studSpacing;

            // Mitte der ersten Noppe (relativ zur Mitte)
            const firstStudCenterX = centerX - (spanWidth / 2);

            for (let i = 0; i < numStuds; i++) {
                const stud = document.createElement('div');
                stud.className = 'lego-stud';
                // Berechne Mitte dieser Noppe, dann ziehe halbe Breite ab für die linke Kante
                const studCenterX = firstStudCenterX + (i * studSpacing);
                stud.style.left = `${studCenterX - (studWidth / 2)}px`;
                stud.style.backgroundColor = bgColor;
                stud.style.borderBottom = `1px solid #000000`; // Dünner schwarzer Border unten
                this.element.insertBefore(stud, textSpan);
            }
        }
    }

    updateDebugHitbox() {
        if (this.debugHitbox) {
            this.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
        }
    }

    getHitbox() {
        // Use cached dimensions to avoid getBoundingClientRect() call
        const width = this.width || 80;  // Fallback to default
        const height = this.height || 40; // Fallback to default

        return {
            left: this.x,
            right: this.x + width,
            top: this.y,
            bottom: this.y + height,
            centerX: this.x + width / 2,
            centerY: this.y + height / 2
        };
    }

    collect() {
        this.collected = true;

        // Use CSS class for animation instead of inline styles for better performance
        this.element.classList.add('collected');

        if (this.debugHitbox) {
            this.debugHitbox.style.display = 'none';
        }

        // Remove element after animation using transitionend event (more reliable)
        const removeElement = () => {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        };

        this.element.addEventListener('transitionend', removeElement, { once: true });

        // Fallback timeout in case transitionend doesn't fire
        setTimeout(removeElement, 350);
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        if (this.debugHitbox) {
            this.debugHitbox.remove();
        }
    }
}

// ===== NOTE CLASS (Level 4 - Share with Colleagues) =====
class Note {
    constructor(gameArea, x, y) {
        this.gameArea = gameArea;
        this.x = x;
        this.y = y;
        this.collected = false;
        this.width = 60;
        this.height = 60;

        this.createElement();
        this.debugHitbox = null;
        this.createDebugHitbox();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'note-collectible';
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        // Note icon (📝)
        this.element.textContent = '📝';

        document.getElementById('promptPiecesContainer').appendChild(this.element);
    }

    createDebugHitbox() {
        this.debugHitbox = document.createElement('div');
        this.debugHitbox.className = 'debug-hitbox note';
        this.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
        this.debugHitbox.style.position = 'absolute';
        this.debugHitbox.style.left = `${this.x}px`;
        this.debugHitbox.style.top = `${this.y}px`;
        this.debugHitbox.style.width = `${this.width}px`;
        this.debugHitbox.style.height = `${this.height}px`;
        this.debugHitbox.style.border = '2px solid orange';
        this.debugHitbox.style.backgroundColor = 'rgba(255, 165, 0, 0.2)';
        this.debugHitbox.style.pointerEvents = 'none';

        const label = document.createElement('div');
        label.className = 'debug-hitbox-label';
        label.textContent = 'Note';
        label.style.fontSize = '10px';
        label.style.color = 'orange';
        label.style.fontWeight = 'bold';
        this.debugHitbox.appendChild(label);

        document.getElementById('promptPiecesContainer').appendChild(this.debugHitbox);
    }

    updateDebugHitbox() {
        if (this.debugHitbox) {
            this.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
        }
    }

    getHitbox() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
            centerX: this.x + this.width / 2,
            centerY: this.y + this.height / 2
        };
    }

    collect() {
        this.collected = true;
        this.element.classList.add('collected');

        if (this.debugHitbox) {
            this.debugHitbox.style.display = 'none';
        }

        const removeElement = () => {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        };

        this.element.addEventListener('transitionend', removeElement, { once: true });
        setTimeout(removeElement, 350);
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        if (this.debugHitbox) {
            this.debugHitbox.remove();
        }
    }
}

// ===== SIGN CLASS (Wooden sign decoration with interaction) =====
class Sign {
    constructor(gameArea, x, y, message = "bad-prompts") {
        this.gameArea = gameArea;
        this.x = x;
        this.y = y;
        this.width = 120;
        this.height = 80;
        this.interactionDistance = 100; // Distance to show prompt
        this.isNearby = false;
        this.message = message; // Type of message to show

        this.createElement();
        this.createInteractionPrompt();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'sign-decoration';
        this.element.style.position = 'absolute';
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.zIndex = '30';
        this.element.style.pointerEvents = 'none';
        this.element.style.transform = 'none'; // Stay fixed in level, no camera movement

        // Create image element
        const img = document.createElement('img');
        img.src = 'sign.png';
        img.alt = 'Wooden Sign';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';

        this.element.appendChild(img);
        document.getElementById('platformsContainer').appendChild(this.element);
    }

    createInteractionPrompt() {
        this.promptElement = document.createElement('div');
        this.promptElement.className = 'sign-interaction-prompt';
        this.promptElement.style.position = 'absolute';
        this.promptElement.style.left = `${this.x + this.width / 2 - 60}px`;
        this.promptElement.style.top = `${this.y - 40}px`;
        this.promptElement.style.width = '120px';
        this.promptElement.style.textAlign = 'center';
        this.promptElement.style.color = '#F5C03B';
        this.promptElement.style.fontSize = '14px';
        this.promptElement.style.fontWeight = 'bold';
        this.promptElement.style.backgroundColor = 'rgba(21, 16, 55, 0.8)';
        this.promptElement.style.padding = '8px 12px';
        this.promptElement.style.borderRadius = '8px';
        this.promptElement.style.border = '2px solid rgba(245, 192, 59, 0.6)';
        this.promptElement.style.zIndex = '40';
        this.promptElement.style.pointerEvents = 'none';
        this.promptElement.style.transform = 'none';
        this.promptElement.style.display = 'none';
        this.promptElement.textContent = 'Drücke [E]';

        document.getElementById('platformsContainer').appendChild(this.promptElement);
    }

    checkProximity(player) {
        // Check if player is within interaction range of the sign
        // Player position is player.x (left edge of player)
        const playerCenter = player.x + GAME_CONFIG.playerWidth / 2;
        const signCenter = this.x + this.width / 2;

        // Calculate distance between player center and sign center
        const distance = Math.abs(playerCenter - signCenter);

        const wasNearby = this.isNearby;
        this.isNearby = distance < this.interactionDistance;

        if (this.isNearby && !wasNearby) {
            this.showPrompt();
        } else if (!this.isNearby && wasNearby) {
            this.hidePrompt();
        }
    }

    showPrompt() {
        if (this.promptElement) {
            this.promptElement.style.display = 'block';
        }
    }

    hidePrompt() {
        if (this.promptElement) {
            this.promptElement.style.display = 'none';
        }
    }

    interact() {
        // Show wooden text box popup
        return true; // Signal that interaction happened
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        if (this.promptElement && this.promptElement.parentNode) {
            this.promptElement.parentNode.removeChild(this.promptElement);
        }
    }
}

// ===== SPIKE CLASS (Statisches Hindernis) =====
class Spike {
    constructor(gameArea, x, y, width, height) {
        this.gameArea = gameArea;
        this.x = x;
        this.y = y;
        this.width = width || 40;
        this.height = height || 40;

        this.createElement();
        this.debugHitbox = null;
        this.createDebugHitbox();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'spike';
        this.element.textContent = '▲▲▲';
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;

        document.getElementById('platformsContainer').appendChild(this.element);
    }

    createDebugHitbox() {
        this.debugHitbox = document.createElement('div');
        this.debugHitbox.className = 'debug-hitbox spike';
        this.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
        this.debugHitbox.style.position = 'absolute';
        this.debugHitbox.style.left = `${this.x}px`;
        this.debugHitbox.style.top = `${this.y}px`;
        this.debugHitbox.style.width = `${this.width}px`;
        this.debugHitbox.style.height = `${this.height}px`;

        const label = document.createElement('div');
        label.className = 'debug-hitbox-label';
        label.textContent = 'Spike';
        this.debugHitbox.appendChild(label);

        document.getElementById('platformsContainer').appendChild(this.debugHitbox);
    }

    updateDebugHitbox() {
        if (this.debugHitbox) {
            this.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
        }
    }

    getHitbox() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        if (this.debugHitbox) {
            this.debugHitbox.remove();
        }
    }
}

// ===== GOAL CLASS =====
class Goal {
    constructor(gameArea, x, y) {
        this.gameArea = gameArea;
        this.x = x;
        this.y = y;
        this.width = 100; // Goal width
        this.height = 150; // Goal height

        this.createElement();
        this.debugHitbox = null;
        this.createDebugHitbox();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'level-goal';
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        const flag = document.createElement('div');
        flag.className = 'goal-flag';
        flag.textContent = '🏁';

        const text = document.createElement('div');
        text.className = 'goal-text';
        text.textContent = 'ZIEL';

        this.element.appendChild(flag);
        this.element.appendChild(text);

        document.getElementById('platformsContainer').appendChild(this.element);
    }

    createDebugHitbox() {
        this.debugHitbox = document.createElement('div');
        this.debugHitbox.className = 'debug-hitbox goal';
        this.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
        this.debugHitbox.style.position = 'absolute';
        this.debugHitbox.style.left = `${this.x}px`;
        this.debugHitbox.style.top = `${this.y}px`;
        this.debugHitbox.style.width = `${this.width}px`;
        this.debugHitbox.style.height = `${this.height}px`;
        this.debugHitbox.style.border = '2px solid lime';
        this.debugHitbox.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
        this.debugHitbox.style.pointerEvents = 'none';

        const label = document.createElement('div');
        label.className = 'debug-hitbox-label';
        label.textContent = 'Goal';
        label.style.fontSize = '10px';
        label.style.color = 'lime';
        label.style.fontWeight = 'bold';
        this.debugHitbox.appendChild(label);

        document.getElementById('platformsContainer').appendChild(this.debugHitbox);
    }

    updateDebugHitbox() {
        if (this.debugHitbox) {
            this.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
        }
    }

    getHitbox() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
            centerX: this.x + this.width / 2,
            centerY: this.y + this.height / 2
        };
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        if (this.debugHitbox && this.debugHitbox.parentNode) {
            this.debugHitbox.parentNode.removeChild(this.debugHitbox);
        }
    }
}

// ===== ENEMY CLASS =====
class Enemy {
    static preloadedFrames = null;

    static preloadFrames() {
        if (Enemy.preloadedFrames) return Promise.resolve();

        Enemy.preloadedFrames = [];
        const promises = [];

        for (let i = 0; i < ANIMATIONS.enemy.frames; i++) {
            const img = new Image();
            const paddedNumber = String(i).padStart(4, '0');
            img.src = `${ANIMATIONS.enemy.path}${paddedNumber}.png`;
            Enemy.preloadedFrames[i] = img;
            promises.push(new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
            }));
        }

        return Promise.all(promises);
    }

    constructor(gameArea, x, y, width, height, speed, platformX, platformWidth, game = null) {
        this.gameArea = gameArea;
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width || 150;
        this.height = height || 150;
        this.speed = speed || 1;

        // Platform boundaries (enemy stays within platform)
        this.platformX = platformX !== undefined ? platformX : x;
        this.platformWidth = platformWidth || 200;
        this.minX = this.platformX;
        this.maxX = this.platformX + this.platformWidth - this.width;

        this.direction = 1;

        this.currentFrame = 0;
        this.frameCounter = 0;

        // Normal enemy can be destroyed by jumping on it
        this.isJumpingEnemy = false;
        this.destroyed = false;

        this.createElement();
        this.createDebugHitbox();
    }

    createElement() {
        this.element = document.createElement('img');
        this.element.className = 'enemy';
        this.element.src = this.getFramePath(0);
        this.element.style.position = 'absolute';
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;

        document.getElementById('platformsContainer').appendChild(this.element);
    }

    createDebugHitbox() {
        const hitboxWidth = this.width * 0.6;
        const hitboxHeight = this.height * 0.6;
        const offsetX = (this.width - hitboxWidth) / 2;
        const offsetY = (this.height - hitboxHeight) / 2 + 5;

        this.debugHitbox = document.createElement('div');
        this.debugHitbox.className = 'debug-hitbox';
        this.debugHitbox.style.position = 'absolute';
        this.debugHitbox.style.border = '2px solid red';
        this.debugHitbox.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        this.debugHitbox.style.left = `${this.x + offsetX}px`;
        this.debugHitbox.style.top = `${this.y + offsetY}px`;
        this.debugHitbox.style.width = `${hitboxWidth}px`;
        this.debugHitbox.style.height = `${hitboxHeight}px`;
        this.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
        this.debugHitbox.style.pointerEvents = 'none';
        this.debugHitbox.style.zIndex = '1000';

        this.hitboxWidth = hitboxWidth;
        this.hitboxHeight = hitboxHeight;
        this.hitboxOffsetX = offsetX;
        this.hitboxOffsetY = offsetY;

        document.getElementById('platformsContainer').appendChild(this.debugHitbox);
    }

    getFramePath(frameNumber) {
        const paddedNumber = String(frameNumber).padStart(4, '0');
        return `${ANIMATIONS.enemy.path}${paddedNumber}.png`;
    }

    update(deltaTime) {
        // Bewegung
        this.x += this.speed * this.direction * deltaTime;

        // Richtungswechsel - bleibt innerhalb der Plattform
        if (this.x > this.maxX) {
            this.x = this.maxX;
            this.direction = -1;
            this.element.style.transform = 'scaleX(-1)';
        } else if (this.x < this.minX) {
            this.x = this.minX;
            this.direction = 1;
            this.element.style.transform = 'scaleX(1)';
        }

        // Animation
        this.frameCounter++;
        if (this.frameCounter >= ANIMATIONS.enemy.speed) {
            this.frameCounter = 0;
            this.currentFrame = (this.currentFrame + 1) % ANIMATIONS.enemy.frames;
            this.element.src = this.getFramePath(this.currentFrame);
        }

        // Position aktualisieren
        this.element.style.left = `${this.x}px`;
        if (this.debugHitbox) {
            this.debugHitbox.style.left = `${this.x + this.hitboxOffsetX}px`;
        }
    }

    updateDebugHitbox() {
        if (this.debugHitbox) {
            this.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
        }
    }

    getHitbox() {
        return {
            left: this.x + this.hitboxOffsetX,
            right: this.x + this.hitboxOffsetX + this.hitboxWidth,
            top: this.y + this.hitboxOffsetY,
            bottom: this.y + this.hitboxOffsetY + this.hitboxHeight
        };
    }

    squash() {
        // Mark as squashing to prevent multiple squashes
        this.isSquashing = true;

        // Play stomp sound
        if (this.game && this.game.playEnemyStompSound) {
            this.game.playEnemyStompSound();
        }

        // Apply squash animation - compress from bottom by changing transform-origin
        // Keep the current direction (this.direction: 1 = right, -1 = left)
        const scaleX = this.direction === 1 ? 1.2 : -1.2;
        this.element.style.transition = 'transform 0.1s ease-out, opacity 0.1s ease-out';
        this.element.style.transformOrigin = 'center 90%';
        this.element.style.transform = `scaleY(0.3) scaleX(${scaleX})`;
        this.element.style.opacity = '0.8';

        // After animation, destroy enemy
        setTimeout(() => {
            this.destroyed = true;
            this.destroy();
        }, 150);
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        if (this.debugHitbox && this.debugHitbox.parentNode) {
            this.debugHitbox.parentNode.removeChild(this.debugHitbox);
        }
    }
}

// ===== JUMPING ENEMY CLASS =====
class JumpingEnemy {
    static preloadedFrames = null;

    static preloadFrames() {
        if (JumpingEnemy.preloadedFrames) return Promise.resolve();

        JumpingEnemy.preloadedFrames = [];
        const promises = [];

        for (let i = 0; i < ANIMATIONS.jumpingEnemy.frames; i++) {
            const img = new Image();
            const paddedNumber = String(i).padStart(5, '0');
            img.src = `${ANIMATIONS.jumpingEnemy.path}${paddedNumber}.png`;
            JumpingEnemy.preloadedFrames[i] = img;
            promises.push(new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
            }));
        }

        return Promise.all(promises);
    }

    constructor(gameArea, x, y, width, height, platformX, platformWidth) {
        this.gameArea = gameArea;
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.width = width || 400; // Extra groß
        this.height = height || 400;

        // Platform boundaries
        this.platformX = platformX;
        this.platformWidth = platformWidth;

        // Jump parameters
        this.jumpTimer = 0;
        this.jumpInterval = 3000; // 3 Sekunden
        this.isJumping = false;
        this.jumpVelocity = 0;
        this.jumpHeight = 300; // Sprunghöhe

        this.currentFrame = 0;
        this.frameCounter = 0;

        // Mark as jumping enemy (cannot be destroyed by jumping on it)
        this.isJumpingEnemy = true;

        this.createElement();
        this.createDebugHitbox();
    }

    createElement() {
        this.element = document.createElement('img');
        this.element.className = 'enemy jumping-enemy';
        this.element.src = this.getFramePath(0);
        this.element.style.position = 'absolute';
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;

        document.getElementById('platformsContainer').appendChild(this.element);
    }

    createDebugHitbox() {
        const hitboxWidth = this.width * 0.6;
        const hitboxHeight = this.height * 0.6;
        const offsetX = (this.width - hitboxWidth) / 2;
        const offsetY = (this.height - hitboxHeight) / 2 + 5;

        this.debugHitbox = document.createElement('div');
        this.debugHitbox.className = 'debug-hitbox';
        this.debugHitbox.style.position = 'absolute';
        this.debugHitbox.style.border = '2px solid red';
        this.debugHitbox.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        this.debugHitbox.style.left = `${this.x + offsetX}px`;
        this.debugHitbox.style.top = `${this.y + offsetY}px`;
        this.debugHitbox.style.width = `${hitboxWidth}px`;
        this.debugHitbox.style.height = `${hitboxHeight}px`;
        this.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
        this.debugHitbox.style.pointerEvents = 'none';
        this.debugHitbox.style.zIndex = '1000';

        this.hitboxWidth = hitboxWidth;
        this.hitboxHeight = hitboxHeight;
        this.hitboxOffsetX = offsetX;
        this.hitboxOffsetY = offsetY;

        document.getElementById('platformsContainer').appendChild(this.debugHitbox);
    }

    getFramePath(frameNumber) {
        const paddedNumber = String(frameNumber).padStart(5, '0');
        return `${ANIMATIONS.jumpingEnemy.path}${paddedNumber}.png`;
    }

    update(deltaTime) {
        // Jump timer
        this.jumpTimer += deltaTime * 16.67; // Convert to ms
        if (this.jumpTimer >= this.jumpInterval && !this.isJumping) {
            this.isJumping = true;
            this.jumpVelocity = -20; // Stärkere Sprungkraft für höheren Sprung
            this.jumpTimer = 0;
        }

        // Jump physics
        if (this.isJumping) {
            this.jumpVelocity += 0.4; // Niedrigere Gravity für langsameren Fall
            this.y += this.jumpVelocity;

            // Landed
            if (this.y >= this.baseY) {
                this.y = this.baseY;
                this.isJumping = false;
                this.jumpVelocity = 0;
            }
        }

        // Animation
        this.frameCounter++;
        if (this.frameCounter >= ANIMATIONS.jumpingEnemy.speed) {
            this.frameCounter = 0;
            this.currentFrame = (this.currentFrame + 1) % ANIMATIONS.jumpingEnemy.frames;
            this.element.src = this.getFramePath(this.currentFrame);
        }

        // Position aktualisieren
        this.element.style.top = `${this.y}px`;
        if (this.debugHitbox) {
            this.debugHitbox.style.top = `${this.y + this.hitboxOffsetY}px`;
        }
    }

    updateDebugHitbox() {
        if (this.debugHitbox) {
            this.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
        }
    }

    getHitbox() {
        return {
            left: this.x + this.hitboxOffsetX,
            right: this.x + this.hitboxOffsetX + this.hitboxWidth,
            top: this.y + this.hitboxOffsetY,
            bottom: this.y + this.hitboxOffsetY + this.hitboxHeight
        };
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        if (this.debugHitbox && this.debugHitbox.parentNode) {
            this.debugHitbox.parentNode.removeChild(this.debugHitbox);
        }
    }
}

// ===== FALL ARROW CLASS =====
class FallArrow {
    constructor(gameArea, x, y) {
        this.gameArea = gameArea;
        this.x = x;
        this.y = y;

        this.createElement();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'fall-arrow';
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.textContent = '⬇️';

        document.getElementById('platformsContainer').appendChild(this.element);
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// ===== UP ARROW CLASS =====
class UpArrow {
    constructor(gameArea, x, y) {
        this.gameArea = gameArea;
        this.x = x;
        this.y = y;

        this.createElement();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'up-arrow';
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.textContent = '⬆️';

        document.getElementById('platformsContainer').appendChild(this.element);
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// ===== TELEPORT ZONE CLASS =====
class TeleportZone {
    constructor(gameArea, x, y, width, height, targetX, targetY) {
        this.gameArea = gameArea;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.targetX = targetX;
        this.targetY = targetY;

        this.createElement();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'teleport-zone';
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;

        document.getElementById('platformsContainer').appendChild(this.element);
    }

    getHitbox() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// ===== CAMERA CLASS =====
class Camera {
    constructor(gameArea) {
        this.gameArea = gameArea;
        this.x = 0; // Camera position in world space
        this.targetX = 0;
    }

    follow(player) {
        // Camera follows player, keeping them centered at cameraOffset
        this.targetX = player.x - GAME_CONFIG.cameraOffset;

        // Clamp camera to level bounds
        this.targetX = Math.max(0, this.targetX);
        this.targetX = Math.min(GAME_CONFIG.levelWidth - this.gameArea.offsetWidth, this.targetX);

        // Smooth camera movement
        this.x += (this.targetX - this.x) * 0.1;
    }

    apply(player) {
        // Apply camera transform to platforms and prompts
        const containers = [
            document.getElementById('platformsContainer'),
            document.getElementById('promptPiecesContainer')
        ];

        containers.forEach(container => {
            if (container) {
                container.style.transform = `translateX(${-this.x}px)`;
            }
        });

        // Apply camera transform to player (preserve scaleX for direction)
        const moPlayer = document.getElementById('moPlayer');
        if (moPlayer && player) {
            const scaleX = player.facingRight ? 1 : -1;
            moPlayer.style.transform = `translateX(${-this.x}px) scaleX(${scaleX})`;
        }
    }
}

// ===== TXP NPC CLASS =====
class TxpNpc {
    constructor(gameArea, x, y, level = 1) {
        this.gameArea = gameArea;
        this.x = x;
        this.y = y;
        this.level = level;
        this.width = 120;
        this.height = 120;
        this.proximityRange = 150;
        this.isPlayerNear = false;
        this.hasShownTutorial = false;
        this.tutorialStep = 0;

        this.element = document.getElementById('txpNpc');
        this.img = document.getElementById('txpNpcImg');
        this.speechElement = document.getElementById('txpNpcSpeech');
        this.speechText = document.getElementById('txpNpcSpeechText');

        // Animation state
        this.currentAnimation = null;
        this.currentFrame = 0;
        this.animationInterval = null;
        this.jumpInterval = null;
        this.jumpTimeoutHandle = null; // Track the setTimeout from performJump

        // Facing direction (like enemies)
        this.facingRight = true;

        // Different messages based on level
        if (level === 1) {
            this.tutorialMessages = [
                "Halloo! Ich bin TXP und helfe dir bei deinem ersten Prompt.",
                "Siehst du die verschiedenen Promptbausteine? Du musst die grünen Promptbausteine einsammeln. Sammel bloß keinen roten ein!",
                "Schlechte Prompts wie 'Gib Daten' sind zu vage. Gute Prompts wie 'Zeig mir Produktionsdaten' sind präzise!",
                "Ach du machst das schon! Sammel alle guten Promptbausteine ein und erreiche das Ziel rechts, um das Level abzuschließen."
            ];
        } else if (level === 2) {
            // Level 2: Time filter and visualization
            this.tutorialMessages = [
                "Hey! Schön dich wiederzusehen!",
                "Jetzt erweitern wir deinen Prompt mit einer genauen Zeitangabe und einer Visualisierungsmöglichkeit.",
                "So kannst du ein besseres Ergebnis erzielen!"
            ];
        } else if (level === 3) {
            // Level 3: Filter and sorting
            this.tutorialMessages = [
                "Gut gemacht! Du machst große Fortschritte!",
                "In diesem Level fügen wir Filter- und Sortierungsfunktionen hinzu.",
                "Damit kannst du die Daten noch präziser anpassen!"
            ];
        } else if (level === 4) {
            // Level 4: Share with colleagues
            this.tutorialMessages = [];
            this.isGoal = true; // TXP acts as level goal in Level 4
            this.level4CompletionConfirmed = false; // Track if user confirmed completion
        } else if (level === 5) {
            // Level 5: Standardization
            this.tutorialMessages = [
                "Super! Dein Prompt wurde erfolgreich mit deinen Kollegen geteilt.",
                "Jetzt möchten wir den Prompt standardisieren, damit alle Mitarbeiter ihn nutzen können.",
                "Spring runter zum Pfeil, um fortzufahren!"
            ];
        }

        this.show();
        this.startAnimation('stand');

        // Only start jump routine if NOT acting as goal (Level 4)
        if (!this.isGoal) {
            this.startJumpRoutine();
        }
    }

    show() {
        if (this.element) {
            this.element.style.display = 'block';
            this.updatePosition();
        }
    }

    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
        this.stopAnimation();
        this.stopJumpRoutine();
        this.hideSpeech();

        // Clear any pending jump timeout
        if (this.jumpTimeoutHandle) {
            clearTimeout(this.jumpTimeoutHandle);
            this.jumpTimeoutHandle = null;
        }
    }

    destroy() {
        // Completely clean up this TXP instance
        this.hide();

        // Nullify references to shared DOM elements
        this.element = null;
        this.img = null;
        this.speechElement = null;
        this.speechText = null;
    }

    startAnimation(animName) {
        if (this.currentAnimation === animName && this.animationInterval) return;

        this.stopAnimation();

        // Cancel any pending jump-to-stand timeout
        if (this.jumpTimeoutHandle) {
            clearTimeout(this.jumpTimeoutHandle);
            this.jumpTimeoutHandle = null;
        }

        this.currentAnimation = animName;
        this.currentFrame = 0;
        const anim = TXP_ANIMATIONS[animName];

        this.animationInterval = setInterval(() => {
            this.currentFrame++;

            // Jump animation should NOT loop - stop at last frame
            if (animName === 'jump' && this.currentFrame >= anim.frames) {
                this.currentFrame = anim.frames - 1; // Hold on last frame
                return; // Don't update anymore, wait for timeout to switch to stand
            }

            // Other animations loop normally
            if (this.currentFrame >= anim.frames) {
                this.currentFrame = 0;
            }

            this.updateFrame();
        }, anim.speed);
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    updateFrame() {
        const anim = TXP_ANIMATIONS[this.currentAnimation];
        let frameStr = String(this.currentFrame).padStart(5, '0');

        // Handle special frame names in jump animation
        if (this.currentAnimation === 'jump') {
            if (this.currentFrame === 14) frameStr = '00014A';
            else if (this.currentFrame === 15) frameStr = '00015B';
        }

        if (this.img) {
            this.img.src = `${anim.path}${frameStr}.png`;
        }
    }

    startJumpRoutine() {
        // Jump every 10 seconds
        this.jumpInterval = setInterval(() => {
            this.performJump();
        }, 10000);
    }

    stopJumpRoutine() {
        if (this.jumpInterval) {
            clearInterval(this.jumpInterval);
            this.jumpInterval = null;
        }
    }

    performJump() {
        // Only jump if not talking to player (tutorial) and speech is not visible
        if (this.currentAnimation === 'talk' || this.isPlayerNear ||
            (this.speechElement && this.speechElement.style.display !== 'none')) {
            return; // Skip jump if in tutorial mode or speech is visible
        }

        // Play jump animation once, then return to stand
        this.startAnimation('jump');

        // Jump animation takes 120 frames * 40ms = 4800ms
        // Store the timeout handle so it can be cancelled if animation changes
        this.jumpTimeoutHandle = setTimeout(() => {
            this.jumpTimeoutHandle = null;
            // Only return to stand if we're not in talk mode now and speech is not visible
            if (this.currentAnimation !== 'talk' &&
                (!this.speechElement || this.speechElement.style.display === 'none')) {
                this.startAnimation('stand');
            }
        }, 4800);
    }

    updatePosition() {
        if (this.element) {
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
        }
    }

    checkProximity(player) {
        const distance = Math.abs(player.x - this.x);
        const wasNear = this.isPlayerNear;
        this.isPlayerNear = distance < this.proximityRange && Math.abs(player.y - this.y) < 100;

        // Update facing direction (like enemies)
        if (player.x < this.x) {
            this.facingRight = false;
        } else if (player.x >= this.x) {
            this.facingRight = true;
        }

        // Player just entered proximity
        if (this.isPlayerNear && !wasNear && !this.hasShownTutorial) {
            this.showTutorial();
        }

        // Player left proximity
        if (!this.isPlayerNear && wasNear) {
            this.hideSpeech();
            // Return to stand animation when player leaves
            if (this.currentAnimation === 'talk') {
                this.startAnimation('stand');
            }
        }
    }

    showTutorial() {
        if (this.tutorialStep < this.tutorialMessages.length) {
            this.showSpeech(this.tutorialMessages[this.tutorialStep]);
            // Switch to talk animation when showing tutorial
            this.startAnimation('talk');
        } else {
            this.hasShownTutorial = true;
            this.hideSpeech();
            this.startAnimation('stand');
        }
    }

    advanceTutorial() {
        if (this.isPlayerNear) {
            // If tutorial was completed, restart from beginning
            if (this.hasShownTutorial) {
                this.tutorialStep = 0;
                this.hasShownTutorial = false;
                this.showSpeech(this.tutorialMessages[this.tutorialStep]);
                this.startAnimation('talk');
            } else {
                this.tutorialStep++;
                if (this.tutorialStep < this.tutorialMessages.length) {
                    this.showSpeech(this.tutorialMessages[this.tutorialStep]);
                    // Switch to talk animation
                    this.startAnimation('talk');
                } else {
                    this.hasShownTutorial = true;
                    this.hideSpeech();
                    this.startAnimation('stand');
                }
            }
        }
    }

    showSpeech(message) {
        if (this.speechElement && this.speechText) {
            this.speechText.textContent = message;

            // Position speech bubble above TXP BEFORE making it visible
            // Level 4: Further left (x - 280) to stay on screen
            // All other levels: Standard position (x - 140)
            let offsetX = 140;
            if (this.level === 4) {
                offsetX = 280;
            }

            this.speechElement.style.left = `${this.x - offsetX}px`;
            this.speechElement.style.top = `${this.y - 150}px`;

            // Make visible AFTER positioning
            this.speechElement.style.display = 'block';
        }
    }

    hideSpeech() {
        if (this.speechElement) {
            this.speechElement.style.display = 'none';
        }
    }

    applyCamera(camera) {
        if (this.element && this.img) {
            // Combine camera translation with facing direction
            const scaleX = this.facingRight ? 1 : -1;
            this.img.style.transform = `scaleX(${scaleX})`;
            this.element.style.transform = `translateX(${-camera.x}px)`;
        }
        if (this.speechElement) {
            // Set CSS variable for animation and apply transform
            this.speechElement.style.setProperty('--camera-x', `${-camera.x}px`);
            this.speechElement.style.transform = `translateX(${-camera.x}px)`;
        }
    }

    getHitbox() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
            centerX: this.x + this.width / 2,
            centerY: this.y + this.height / 2
        };
    }

    checkLevel4Completion(noteCollected) {
        // Level 4: Check if note was collected
        if (noteCollected) {
            if (!this.level4CompletionConfirmed) {
                // First interaction: Show success message
                this.showSpeech("Super! Du hast den Zettel mit deinem Prompt gefunden. Teile ihn mit deinen Kollegen!");
                this.startAnimation('talk');
                return false; // Don't complete yet, wait for confirmation
            } else {
                // User pressed E to confirm
                return true; // Allow level completion
            }
        } else {
            this.showSpeech("Du musst erst den Zettel 📝 einsammeln, um deinen Prompt mit deinen Kollegen zu teilen!");
            this.startAnimation('talk');
            return false; // Block level completion
        }
    }

    confirmLevel4Completion() {
        // Called when user presses E in Level 4
        this.level4CompletionConfirmed = true;
        this.hideSpeech();
        this.startAnimation('stand');
    }
}

// ===== MAIN PLATFORMER GAME CLASS =====
class PlatformerGame {
    constructor() {
        this.gameArea = document.getElementById('gameArea');

        // Game state
        this.isRunning = false;
        this.currentLevel = 1;
        this.lives = GAME_CONFIG.lives;
        this.notePopupVisible = false; // Track if note popup is showing (blocks movement)
        this.signPopupVisible = false; // Track if sign popup is showing (blocks movement)

        // Game objects
        this.player = null;
        this.platforms = [];
        this.promptPieces = [];
        this.note = null; // Level 4 collectible
        this.signs = []; // Decorative signs
        this.spikes = [];
        this.enemies = [];
        this.jumpingEnemies = [];
        this.goal = null;
        this.fallArrow = null;
        this.teleportZone = null;
        this.camera = null;
        this.txpNpc = null;

        // Collected data
        this.collectedPieces = [];
        this.requiredPieces = [];

        // Music
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.lavaMusic = document.getElementById('lavaMusic');
        this.musicToggleBtn = document.getElementById('musicToggle');
        this.isMusicPlaying = false;
        this.currentMusic = null; // Track which music is playing
        this.inLavaSection = false;

        // Set volume for both music tracks (0.0 to 1.0)
        if (this.backgroundMusic) this.backgroundMusic.volume = 0.6;
        if (this.lavaMusic) this.lavaMusic.volume = 0.4;

        // Web Audio API for jump sound
        this.audioContext = null;
        this.initAudioContext();

        this.setupMusicToggle();

        // Input handling
        this.keys = {};
        this.setupInputHandlers();

        // Game loop
        this.lastTime = 0;
        this.gameLoopId = null;

        // Death state
        this.isDead = false;

        // Teleport cooldown
        this.teleportCooldown = false;
    }

    initAudioContext() {
        // Initialize Web Audio API context (lazy loading)
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    playJumpSound() {
        if (!this.audioContext || !this.isMusicPlaying) return;

        // Resume audio context if suspended (browser autoplay policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const now = this.audioContext.currentTime;

        // Create oscillator for jump sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Square wave for more retro 8-bit sound
        oscillator.type = 'square';

        // Jump sound: quick frequency sweep upwards (like Mario jump)
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.15);

        // Volume envelope: quick attack, smooth decay
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.25, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        // Play sound
        oscillator.start(now);
        oscillator.stop(now + 0.15);
    }

    playCoinSound() {
        if (!this.audioContext || !this.isMusicPlaying) return;

        // Resume audio context if suspended (browser autoplay policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const now = this.audioContext.currentTime;

        // Create oscillator for coin sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Sine wave for smoother coin sound
        oscillator.type = 'sine';

        // Coin sound: two quick notes (B and E - classic Mario coin sound)
        oscillator.frequency.setValueAtTime(988, now);        // B5
        oscillator.frequency.setValueAtTime(1319, now + 0.05); // E6

        // Volume envelope: quick attack, quick decay
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        // Play sound
        oscillator.start(now);
        oscillator.stop(now + 0.15);
    }

    playDeathSound() {
        if (!this.audioContext || !this.isMusicPlaying) return;

        // Resume audio context if suspended (browser autoplay policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const now = this.audioContext.currentTime;

        // Create oscillator for death sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Square wave for harsh retro death sound
        oscillator.type = 'square';

        // Death sound: dramatic downward sweep (high to low)
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.3);
        oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.6);

        // Volume envelope: quick attack, sustain, then fade out
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
        gainNode.gain.linearRampToValueAtTime(0.25, now + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

        // Play sound
        oscillator.start(now);
        oscillator.stop(now + 0.6);
    }

    playEnemyStompSound() {
        if (!this.audioContext || !this.isMusicPlaying) return;

        // Resume audio context if suspended (browser autoplay policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const now = this.audioContext.currentTime;

        // Create oscillator for stomp sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Square wave for punchy retro sound
        oscillator.type = 'square';

        // Stomp sound: quick downward thump
        oscillator.frequency.setValueAtTime(150, now);
        oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.1);

        // Volume envelope: quick punch
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.35, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        // Play sound
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }

    setupMusicToggle() {
        // Click handler for music toggle
        this.musicToggleBtn.addEventListener('click', () => {
            this.toggleMusic();
        });
    }

    toggleMusic() {
        if (this.isMusicPlaying) {
            this.pauseMusic();
        } else {
            this.playMusic();
        }
    }

    playMusic() {
        // Play the appropriate music based on location
        const musicToPlay = this.inLavaSection ? this.lavaMusic : this.backgroundMusic;

        musicToPlay.play().catch(err => {
            console.log('Music play failed:', err);
        });
        this.currentMusic = musicToPlay;
        this.isMusicPlaying = true;
        this.musicToggleBtn.textContent = '🔊';
    }

    pauseMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
        this.isMusicPlaying = false;
        this.musicToggleBtn.textContent = '🔇';
    }

    switchMusic(toLavaSection) {
        const wasPlaying = this.isMusicPlaying;

        // Update section state
        this.inLavaSection = toLavaSection;

        // Defer music switching to avoid blocking game loop
        requestAnimationFrame(() => {
            // Pause current music
            if (this.currentMusic) {
                this.currentMusic.pause();
                this.currentMusic.currentTime = 0;
            }

            // Play new music if music was playing
            if (wasPlaying) {
                const newMusic = toLavaSection ? this.lavaMusic : this.backgroundMusic;
                newMusic.currentTime = 0;
                newMusic.play().catch(err => {
                    console.log('Music play failed:', err);
                });
                this.currentMusic = newMusic;
            }
        });
    }

    setupInputHandlers() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            // Toggle pause menu with 'Escape'
            if (e.key === 'Escape') {
                this.togglePauseMenu();
                return;
            }

            // Toggle hitboxes with 'H'
            if (e.key === 'h' || e.key === 'H') {
                this.toggleHitboxes();
                return;
            }

            // Respawn with 'R' when dead
            if ((e.key === 'r' || e.key === 'R') && this.isDead) {
                this.respawn();
                return;
            }

            // Close note popup with 'E'
            if ((e.key === 'e' || e.key === 'E') && this.notePopupVisible) {
                this.hideNotePopup();
                return;
            }

            // Close sign popup with 'E'
            if ((e.key === 'e' || e.key === 'E') && this.signPopupVisible) {
                this.hideSignPopup();
                return;
            }

            // Interact with Sign with 'E'
            if ((e.key === 'e' || e.key === 'E') && this.signs.length > 0) {
                for (let sign of this.signs) {
                    if (sign.isNearby) {
                        this.showSignPopup(sign.message);
                        return;
                    }
                }
            }

            // Interact with TXP NPC with 'E'
            if ((e.key === 'e' || e.key === 'E') && this.txpNpc) {
                // Level 4: Confirm completion after showing success message
                if (this.currentLevel === 4 && this.txpNpc.isGoal && !this.txpNpc.level4CompletionConfirmed) {
                    const noteCollected = this.note && this.note.collected;
                    if (noteCollected) {
                        this.txpNpc.confirmLevel4Completion();
                    }
                } else {
                    // Level 1: Advance tutorial
                    this.txpNpc.advanceTutorial();
                }
                return;
            }

            if (!this.isRunning || this.isDead || this.notePopupVisible || this.signPopupVisible) return;

            // Movement
            if (e.key === 'ArrowLeft') {
                this.player.isMovingLeft = true;
            } else if (e.key === 'ArrowRight') {
                this.player.isMovingRight = true;
            }

            // Jump
            if (e.key === 'ArrowUp' || e.key === ' ') {
                this.player.jump();
                e.preventDefault();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;

            if (!this.isRunning || this.isDead || this.notePopupVisible || this.signPopupVisible) return;

            // Stop movement
            if (e.key === 'ArrowLeft') {
                this.player.isMovingLeft = false;
            } else if (e.key === 'ArrowRight') {
                this.player.isMovingRight = false;
            }
        });
    }

    togglePauseMenu() {
        const pauseMenu = document.getElementById('pauseMenu');
        if (!pauseMenu) return;

        if (pauseMenu.style.display === 'flex') {
            // Resume game
            pauseMenu.style.display = 'none';
            this.isRunning = true;
            this.lastTime = performance.now();
            this.gameLoop();
        } else {
            // Pause game
            pauseMenu.style.display = 'flex';
            this.isRunning = false;
            if (this.gameLoopId) {
                cancelAnimationFrame(this.gameLoopId);
            }
            // Stop all player movement
            if (this.player) {
                this.player.isMovingLeft = false;
                this.player.isMovingRight = false;
                this.player.velocityX = 0;
            }
            // Clear all keys
            this.keys = {};
        }
    }

    toggleHitboxes() {
        GAME_CONFIG.debugHitboxes = !GAME_CONFIG.debugHitboxes;

        // Toggle player hitbox
        if (this.player && this.player.debugHitbox) {
            this.player.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
        }

        // Toggle platform hitboxes
        this.platforms.forEach(platform => {
            if (platform.debugHitbox) {
                platform.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
            }
        });

        // Toggle prompt piece hitboxes
        this.promptPieces.forEach(piece => {
            if (piece.debugHitbox) {
                piece.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
            }
        });

        // Toggle spike hitboxes
        this.spikes.forEach(spike => {
            if (spike.debugHitbox) {
                spike.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
            }
        });

        // Toggle enemy hitboxes
        this.enemies.forEach(enemy => {
            enemy.updateDebugHitbox();
        });

        // Toggle jumping enemy hitboxes
        this.jumpingEnemies.forEach(jumpingEnemy => {
            jumpingEnemy.updateDebugHitbox();
        });

        // Toggle goal hitbox
        if (this.goal) {
            this.goal.updateDebugHitbox();
        }

        console.log('Hitboxes:', GAME_CONFIG.debugHitboxes ? 'ON' : 'OFF');
    }

    loadLevel(levelNumber) {
        this.currentLevel = levelNumber;
        const levelData = LEVEL_DATA[levelNumber];

        // Clear previous level
        this.clearLevel();

        // Set level width (Level 5 needs much more space for lava section)
        if (levelNumber === 5) {
            GAME_CONFIG.levelWidth = 31000;
            GAME_CONFIG.deathLimit = 1000; // Allow player to go lower in Level 5
        } else {
            GAME_CONFIG.levelWidth = 5000;
            GAME_CONFIG.deathLimit = 800;
        }

        // Update and show prompt goal display
        const promptGoalDisplay = document.getElementById('promptGoalDisplay');
        const promptGoalText = document.getElementById('promptGoalText');
        if (promptGoalText) {
            this.buildPromptDisplay(levelData);
        }
        if (promptGoalDisplay) {
            promptGoalDisplay.style.display = 'flex';
        }

        // Store required pieces
        this.requiredPieces = levelData.requiredPieces.map(p => p.id);

        // Add prefilled pieces to collected pieces (auto-filled from previous level)
        if (levelData.prefilledPieces) {
            this.collectedPieces = levelData.prefilledPieces.map(p => p.id);
        }

        // Create platforms
        levelData.platforms.forEach(platformData => {
            const platform = new Platform(
                this.gameArea,
                platformData.x,
                platformData.y,
                platformData.width,
                platformData.height,
                platformData.lava || false,
                platformData.green || false
            );
            this.platforms.push(platform);
        });

        // Create prompt pieces
        levelData.promptPieces.forEach(pieceData => {
            const piece = new PromptPiece(
                this.gameArea,
                pieceData.x,
                pieceData.y,
                pieceData
            );
            this.promptPieces.push(piece);
        });

        // Create note (if level has one - Level 4)
        if (levelData.notePosition) {
            this.note = new Note(
                this.gameArea,
                levelData.notePosition.x,
                levelData.notePosition.y
            );
        }

        // Create signs (decorative wooden signs)
        if (levelData.signs) {
            levelData.signs.forEach(signData => {
                const sign = new Sign(
                    this.gameArea,
                    signData.x,
                    signData.y,
                    signData.message
                );
                this.signs.push(sign);
            });
        }

        // Create spikes (if level has them)
        if (levelData.spikes) {
            levelData.spikes.forEach(spikeData => {
                const spike = new Spike(
                    this.gameArea,
                    spikeData.x,
                    spikeData.y,
                    spikeData.width,
                    spikeData.height
                );
                this.spikes.push(spike);
            });
        }

        // Create enemies (if level has them)
        if (levelData.enemies) {
            levelData.enemies.forEach(enemyData => {
                const enemy = new Enemy(
                    this.gameArea,
                    enemyData.x,
                    enemyData.y,
                    enemyData.width,
                    enemyData.height,
                    enemyData.speed,
                    enemyData.platformX,
                    enemyData.platformWidth,
                    this
                );
                this.enemies.push(enemy);
            });
        }

        // Create jumping enemies (if level has them)
        if (levelData.jumpingEnemies) {
            levelData.jumpingEnemies.forEach(enemyData => {
                const jumpingEnemy = new JumpingEnemy(
                    this.gameArea,
                    enemyData.x,
                    enemyData.y,
                    enemyData.width,
                    enemyData.height,
                    enemyData.platformX,
                    enemyData.platformWidth
                );
                this.jumpingEnemies.push(jumpingEnemy);
            });
        }

        // Create goal at end of level (or TXP for Level 4)
        if (levelNumber === 4) {
            // Level 4: TXP instead of goal (share prompt with colleagues)
            this.txpNpc = new TxpNpc(this.gameArea, levelData.goalX, 535, 4);
            // No regular goal in Level 4
        } else {
            this.goal = new Goal(this.gameArea, levelData.goalX, 450);
        }

        // Create fall arrow and teleport zones for Level 5 only
        if (levelNumber === 5) {
            // First teleporter - Fall down to lava section
            this.fallArrow = new FallArrow(this.gameArea, 3010, 700);
            this.teleportZone = new TeleportZone(this.gameArea, 2900, 700, 300, 120, 10200, -200);

            // Second teleporter - Rise up to goal section (spawn from way below so player rises up)
            this.upArrow = new UpArrow(this.gameArea, 16410, 60);
            this.teleportZone2 = new TeleportZone(this.gameArea, 16300, 50, 300, 120, 25200, 900);
        }

        // Create player at start position
        this.player = new MoManPlayer(this.gameArea, 100, 400, this);

        // Create camera
        this.camera = new Camera(this.gameArea);

        // Create TXP NPC for tutorial levels
        if (levelNumber === 1) {
            this.txpNpc = new TxpNpc(this.gameArea, 300, 535, 1);
        } else if (levelNumber === 2) {
            // Level 2: TXP auf der zweiten Plattform (x: 450, width: 280)
            this.txpNpc = new TxpNpc(this.gameArea, 590, 535, 2);
        } else if (levelNumber === 3) {
            // Level 3: TXP erscheint nach ein bisschen Laufstrecke (x: 1380, width: 150)
            this.txpNpc = new TxpNpc(this.gameArea, 1405, 235, 3);
        } else if (levelNumber === 5) {
            // Level 5: TXP erscheint mittig auf der Plattform bei x: 2300
            this.txpNpc = new TxpNpc(this.gameArea, 2500, 435, 5);
        }
    }

    clearLevel() {
        // Destroy all game objects
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }

        this.platforms.forEach(platform => platform.destroy());
        this.platforms = [];

        this.promptPieces.forEach(piece => piece.destroy());
        this.promptPieces = [];

        if (this.note) {
            this.note.destroy();
            this.note = null;
        }

        this.signs.forEach(sign => sign.destroy());
        this.signs = [];

        this.spikes.forEach(spike => spike.destroy());
        this.spikes = [];

        this.enemies.forEach(enemy => enemy.destroy());
        this.enemies = [];

        this.jumpingEnemies.forEach(jumpingEnemy => jumpingEnemy.destroy());
        this.jumpingEnemies = [];

        if (this.goal) {
            this.goal.destroy();
            this.goal = null;
        }

        if (this.fallArrow) {
            this.fallArrow.destroy();
            this.fallArrow = null;
        }

        if (this.txpNpc) {
            this.txpNpc.destroy();
            this.txpNpc = null;
        }

        if (this.upArrow) {
            this.upArrow.destroy();
            this.upArrow = null;
        }

        if (this.teleportZone) {
            this.teleportZone.destroy();
            this.teleportZone = null;
        }

        if (this.teleportZone2) {
            this.teleportZone2.destroy();
            this.teleportZone2 = null;
        }

        this.collectedPieces = [];

        // Hide prompt goal display when leaving level
        const promptGoalDisplay = document.getElementById('promptGoalDisplay');
        if (promptGoalDisplay) {
            promptGoalDisplay.style.display = 'none';
        }
    }

    async startLevel(levelNumber) {
        // Show loading screen
        this.showScreen('loadingScreen');

        // Reset state
        this.lives = GAME_CONFIG.lives;
        this.collectedPieces = [];
        this.isDead = false;

        // Preload all assets with progress tracking
        const loadingBar = document.getElementById('loadingBar');
        const loadingText = document.getElementById('loadingText');
        let progress = 0;

        const updateProgress = (percent) => {
            progress = percent;
            if (loadingBar) loadingBar.style.width = `${percent}%`;
            if (loadingText) loadingText.textContent = `${Math.round(percent)}%`;
        };

        try {
            // Preload player animations (33%)
            updateProgress(0);
            await MoManPlayer.preloadFrames();
            updateProgress(33);

            // Preload enemy animations (66%)
            if (levelNumber === 5) {
                await Enemy.preloadFrames();
                updateProgress(66);
                await JumpingEnemy.preloadFrames();
                updateProgress(100);
            } else {
                updateProgress(100);
            }

            // Preload audio files for Level 5
            if (levelNumber === 5) {
                // Preload lava music to avoid lag when switching
                if (this.lavaMusic) {
                    this.lavaMusic.load();
                }
                if (this.backgroundMusic) {
                    this.backgroundMusic.load();
                }
            }

            // Small delay to show 100%
            await new Promise(resolve => setTimeout(resolve, 300));

        } catch (error) {
            console.error('Asset loading error:', error);
        }

        // Load level
        this.loadLevel(levelNumber);

        // Show game screen
        this.showScreen('gameScreen');

        // Show controls display only in Level 1
        const controlsDisplay = document.getElementById('controlsDisplay');
        if (controlsDisplay) {
            if (levelNumber === 1) {
                controlsDisplay.style.display = 'block';
            } else {
                controlsDisplay.style.display = 'none';
            }
        }

        // Show music toggle button when entering gameplay
        if (this.musicToggleBtn) {
            this.musicToggleBtn.style.display = 'flex';
        }

        // Start game loop
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    gameLoop(currentTime = performance.now()) {
        if (!this.isRunning) return;

        let deltaTime = (currentTime - this.lastTime) / 16.67; // Normalize to 60fps

        // Clamp deltaTime to prevent huge jumps during lag spikes
        if (deltaTime > 3) deltaTime = 1; // Cap at 3x normal speed

        this.lastTime = currentTime;

        if (!this.isDead) {
            // Update player
            const deathStatus = this.player.update(deltaTime, this.platforms);
            if (deathStatus === 'death') {
                this.handleDeath();
            }

            // Update camera
            this.camera.follow(this.player);
            this.camera.apply(this.player);

            // Update TXP NPC (Level 1 only)
            if (this.txpNpc) {
                this.txpNpc.checkProximity(this.player);
                this.txpNpc.applyCamera(this.camera);
            }

            // Update Signs (check proximity for interaction prompt)
            this.signs.forEach(sign => sign.checkProximity(this.player));

            // Apply camera transform to controls display (Level 1 only)
            if (this.currentLevel === 1) {
                const controlsDisplay = document.getElementById('controlsDisplay');
                if (controlsDisplay && controlsDisplay.style.display !== 'none') {
                    controlsDisplay.style.transform = `translateX(${-this.camera.x}px)`;
                }
            }

            // Check if player entered/left lava section (Level 5 only)
            if (this.currentLevel === 5) {
                const playerInLava = this.player.x >= 10000 && this.player.x < 25000;
                if (playerInLava !== this.inLavaSection) {
                    this.switchMusic(playerInLava);
                }
            }

            // Update enemies
            for (let i = this.enemies.length - 1; i >= 0; i--) {
                const enemy = this.enemies[i];
                enemy.update(deltaTime);
                this.checkEnemyCollision(enemy);

                // Remove destroyed enemies
                if (enemy.destroyed) {
                    this.enemies.splice(i, 1);
                }
            }

            // Update jumping enemies
            this.jumpingEnemies.forEach(jumpingEnemy => {
                jumpingEnemy.update(deltaTime);
                this.checkEnemyCollision(jumpingEnemy);
            });

            // Check prompt piece collisions
            for (let i = this.promptPieces.length - 1; i >= 0; i--) {
                const piece = this.promptPieces[i];
                if (!piece.collected) {
                    this.checkPromptCollision(piece);
                }
            }

            // Check note collision (Level 4 only)
            if (this.note && !this.note.collected) {
                this.checkNoteCollision();
            }

            // Check teleport zone collision (Level 5 only)
            if (this.teleportZone) {
                this.checkTeleportCollision(this.teleportZone, 'teleport1');
            }
            if (this.teleportZone2) {
                this.checkTeleportCollision(this.teleportZone2, 'teleport2');
            }

            // Check level complete (reached goal with proper hitbox collision)
            if (this.goal) {
                this.checkGoalCollision();
            }

            // Check TXP collision for Level 4 (TXP acts as goal)
            if (this.currentLevel === 4 && this.txpNpc && this.txpNpc.isGoal) {
                this.checkTxpLevel4Collision();
            }
        }

        this.gameLoopId = requestAnimationFrame((time) => this.gameLoop(time));
    }

    checkPromptCollision(piece) {
        const playerBox = this.player.getHitbox();
        const pieceBox = piece.getHitbox();

        // AABB collision
        const collision = !(
            playerBox.right < pieceBox.left ||
            playerBox.left > pieceBox.right ||
            playerBox.bottom < pieceBox.top ||
            playerBox.top > pieceBox.bottom
        );

        if (collision) {
            this.handlePromptCollected(piece);
        }
    }

    checkNoteCollision() {
        const playerBox = this.player.getHitbox();
        const noteBox = this.note.getHitbox();

        // AABB collision
        const collision = !(
            playerBox.right < noteBox.left ||
            playerBox.left > noteBox.right ||
            playerBox.bottom < noteBox.top ||
            playerBox.top > noteBox.bottom
        );

        if (collision) {
            this.note.collect();
            console.log('📝 Note collected! You can now share your prompt with colleagues!');

            // Show note popup with scroll image
            this.showNotePopup();
        }
    }

    showNotePopup() {
        const notePopup = document.getElementById('notePopup');
        if (notePopup) {
            notePopup.style.display = 'flex';
            this.notePopupVisible = true;

            // Stop Mo Man immediately
            this.player.isMovingLeft = false;
            this.player.isMovingRight = false;
            this.player.velocityX = 0;
        }
    }

    hideNotePopup() {
        const notePopup = document.getElementById('notePopup');
        if (notePopup) {
            notePopup.style.display = 'none';
            this.notePopupVisible = false;

            // Update HUD text after closing scroll in Level 4
            if (this.currentLevel === 4) {
                const promptGoalText = document.getElementById('promptGoalText');
                if (promptGoalText) {
                    promptGoalText.textContent = 'Erreiche das Ende um dein Prompt zu teilen';
                }
            }
        }
    }

    showSignPopup(messageType) {
        const signPopup = document.getElementById('signPopup');
        const signPopupText = document.getElementById('signPopupText');

        if (signPopup && signPopupText) {
            // Set message based on type
            if (messageType === "bad-prompts") {
                signPopupText.innerHTML = `
                    Achtung!<br><br>
                    Laufe nicht gegen die <span style="color: #ff4444;">roten Prompts</span>!<br><br>
                    Das sind Wörter im Prompt, die kein wertvolles Ergebnis liefern.
                `;
            } else if (messageType === "level-end") {
                signPopupText.innerHTML = `
                    Fast geschafft!<br><br>
                    Laufe zum <span style="color: #67C7FF;">Ziel</span> rechts und schau dir an, was dein Prompt bewirkt hat.<br><br>
                    Je besser der Prompt, desto besser das Ergebnis!
                `;
            } else if (messageType === "music-info") {
                signPopupText.innerHTML = `
                    Tipp!<br><br>
                    Drücke oben rechts auf den <span style="color: #67C7FF;">Lautsprecher</span> 🔊<br><br>
                    Das Spiel hat Musik und Soundeffekte!
                `;
            } else if (messageType === "prompt-specificity") {
                signPopupText.innerHTML = `
                    Merke dir!<br><br>
                    Je spezifischer deine Anfrage, desto besser das Ergebnis.<br><br>
                    <span style="color: #67C7FF;">"Filtere nach Farbe"</span> ist besser als <span style="color: #ff4444;">"zeig mir irgendwas"</span>!
                `;
            } else if (messageType === "collect-scroll") {
                signPopupText.innerHTML = `
                    Prompt-Weitergabe<br><br>
                    Sammle die <span style="color: #F5C03B;">Schriftrolle</span> mit deinem fertigen Prompt ein!<br><br>
                    Gute Prompts mit Kollegen teilen spart Zeit, die Entwicklung eines passenden Prompts kann aufwendig sein.
                `;
            } else if (messageType === "enemy-jumping") {
                signPopupText.innerHTML = `
                    Gegner-Tipp<br><br>
                    Du kannst auf <span style="color: #ff4444;">Gegner springen</span>, um sie zu besiegen!<br><br>
                    Spring von oben auf sie drauf, um sicher weiterzukommen.
                `;
            } else if (messageType === "enemy-duck") {
                signPopupText.innerHTML = `
                    Gegner-Tipp 2<br><br>
                    Der Gegner ist zu groß, um auf ihn zu springen.<br><br>
                    Vielleicht findest du ja eine andere Möglichkeit, ihm zu entkommen.
                `;
            } else if (messageType === "final-section") {
                signPopupText.innerHTML = `
                    Letzte Etappe! 🏁<br><br>
                    Du hast das <span style="color: #67C7FF;">Ziel fast erreicht</span>!<br><br>
                    Es sind nur noch die <span style="color: #F5C03B;">letzten Meter</span>.
                `;
            } else if (messageType === "final-motivation") {
                signPopupText.innerHTML = `
                    Fast geschafft! 🎉<br><br>
                    Du bist <span style="color: #67C7FF;">kurz davor</span>, das letzte Level zu meistern!<br><br>
                    Es ist nur noch ein <span style="color: #F5C03B;">ganz einfacher Sprung</span>.<br><br>
                    Du schaffst das! 💪
                `;
            }

            signPopup.style.display = 'flex';
            this.signPopupVisible = true;
        }
    }

    hideSignPopup() {
        const signPopup = document.getElementById('signPopup');
        if (signPopup) {
            signPopup.style.display = 'none';
            this.signPopupVisible = false;
        }
    }

    checkEnemyCollision(enemy) {
        const playerBox = this.player.getHitbox();
        const enemyBox = enemy.getHitbox();

        // AABB collision
        const collision = !(
            playerBox.right < enemyBox.left ||
            playerBox.left > enemyBox.right ||
            playerBox.bottom < enemyBox.top ||
            playerBox.top > enemyBox.bottom
        );

        if (collision) {
            // Check if player is jumping/falling and landing on top of enemy
            const isJumpingOnEnemy = this.player.velocityY > 0 &&
                                     playerBox.bottom <= enemyBox.top + 25;

            if (isJumpingOnEnemy && !enemy.isJumpingEnemy) {
                // Player stomps on normal enemy - squash it first
                if (!enemy.isSquashing) {
                    enemy.squash();

                    // Give player a little bounce
                    this.player.velocityY = -8;
                }

                return 'squashed';
            } else if (!enemy.isSquashing && !enemy.destroyed) {
                // Side/bottom collision or jumping enemy - player dies
                // But only if enemy is not already squashing (to prevent death during bounce-up)
                this.handleDeath();
            }
        }
    }

    checkGoalCollision() {
        const playerBox = this.player.getHitbox();
        const goalBox = this.goal.getHitbox();

        // AABB collision
        const collision = !(
            playerBox.right < goalBox.left ||
            playerBox.left > goalBox.right ||
            playerBox.bottom < goalBox.top ||
            playerBox.top > goalBox.bottom
        );

        if (collision) {
            this.levelComplete();
        }
    }

    checkTxpLevel4Collision() {
        const playerBox = this.player.getHitbox();
        const txpBox = this.txpNpc.getHitbox();

        // AABB collision
        const collision = !(
            playerBox.right < txpBox.left ||
            playerBox.left > txpBox.right ||
            playerBox.bottom < txpBox.top ||
            playerBox.top > txpBox.bottom
        );

        if (collision) {
            // Check if note was collected
            const noteCollected = this.note && this.note.collected;
            const canComplete = this.txpNpc.checkLevel4Completion(noteCollected);

            if (canComplete) {
                this.levelComplete();
            }
        }
    }

    checkTeleportCollision(teleportZone, teleportId) {
        // Check if this specific teleporter has a cooldown
        if (this.teleportCooldowns && this.teleportCooldowns[teleportId]) return;

        const playerBox = this.player.getHitbox();
        const teleportBox = teleportZone.getHitbox();

        // AABB collision
        const collision = !(
            playerBox.right < teleportBox.left ||
            playerBox.left > teleportBox.right ||
            playerBox.bottom < teleportBox.top ||
            playerBox.top > teleportBox.bottom
        );

        if (collision) {
            // Teleport player to target location
            this.player.x = teleportZone.targetX;
            this.player.y = teleportZone.targetY;
            this.player.isMovingLeft = false;
            this.player.isMovingRight = false;

            // Special handling for teleport2 - rise from below with upward velocity
            if (teleportId === 'teleport2') {
                this.player.velocityY = -25; // Strong upward velocity
                this.player.velocityX = 0;
            } else {
                this.player.velocityY = 0;
                this.player.velocityX = 0;
            }

            this.player.updatePosition();

            // Force camera to follow immediately
            this.camera.x = this.player.x - GAME_CONFIG.cameraOffset;
            this.camera.targetX = this.camera.x;
            this.camera.apply(this.player);

            // Set cooldown for this specific teleporter
            if (!this.teleportCooldowns) this.teleportCooldowns = {};
            this.teleportCooldowns[teleportId] = true;
            setTimeout(() => {
                this.teleportCooldowns[teleportId] = false;
            }, 2000); // 2 second cooldown
        }
    }

    handlePromptCollected(piece) {
        // Remove from array first to avoid checking it again
        const index = this.promptPieces.indexOf(piece);
        if (index > -1) {
            this.promptPieces.splice(index, 1);
        }

        // Trigger collection animation
        piece.collect();

        if (piece.type === 'good') {
            // Collect good piece
            this.collectedPieces.push(piece.id);

            // Play coin sound
            this.playCoinSound();

            // Batch DOM updates using requestAnimationFrame
            requestAnimationFrame(() => {
                this.updatePromptDisplay(piece.id);
            });
        } else if (piece.type === 'bad') {
            // Picked up bad piece - instant death (only 1 life)
            this.handleDeath();
        }
    }

    handleDeath() {
        this.isDead = true;

        // Increment death counter
        incrementDeathCounter();

        // Play death sound
        this.playDeathSound();

        // Hide Mo Man when dead
        if (this.player) {
            this.player.hide();
        }

        this.showDeathScreen();
    }

    showDeathScreen() {
        // Random death messages
        const deathMessages = [
            'Error 404: Skills not found',
            'Brain.exe stopped',
            'STRG+Z funktioniert hier nicht',
            'Das war\'s wohl nicht'
        ];

        const randomMessage = deathMessages[Math.floor(Math.random() * deathMessages.length)];

        // Update death message
        const deathOverlay = document.getElementById('deathOverlay');
        const deathText = deathOverlay.querySelector('p');
        if (deathText) {
            deathText.textContent = randomMessage;
        }

        deathOverlay.style.display = 'flex';
    }

    hideDeathScreen() {
        document.getElementById('deathOverlay').style.display = 'none';
    }

    respawn() {
        this.isDead = false;
        this.hideDeathScreen();

        // Reload the entire level to respawn all enemies
        this.loadLevel(this.currentLevel);

        // Reset player position and show again
        this.player.reset(100, 400);
        this.player.show();

        // Reset movement keys
        this.player.isMovingLeft = false;
        this.player.isMovingRight = false;

        // Reset camera
        this.camera.x = 0;
        this.camera.targetX = 0;
        this.camera.apply(this.player);
    }

    levelComplete() {
        this.isRunning = false;
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
        }

        // Check if level is truly completed (for Level 1-3: all good prompts must be collected)
        const isFullyCompleted = this.checkLevelCompletion();

        // Only unlock next level and award points if fully completed
        if (isFullyCompleted) {
            unlockNextLevel(this.currentLevel);
        }

        this.showLevelCompleteScreen();
    }

    checkLevelCompletion() {
        const levelData = LEVEL_DATA[this.currentLevel];

        // Level 1-3: Must collect all required pieces (good prompts)
        if (this.currentLevel >= 1 && this.currentLevel <= 3) {
            if (!levelData.requiredPieces) return true;

            const allCollected = levelData.requiredPieces.every(piece =>
                this.collectedPieces.includes(piece.id)
            );

            if (!allCollected) {
                console.log(`⚠️ Level ${this.currentLevel} not fully completed - missing required prompts`);
                return false;
            }
        }

        // Level 4-5: Reaching the goal is enough
        return true;
    }

    showLevelCompleteScreen() {
        // Build prompt display
        const levelData = LEVEL_DATA[this.currentLevel];
        const promptDisplay = document.getElementById('promptDisplay');

        // Level 4: Show prompt sharing visualization
        if (this.currentLevel === 4) {
            promptDisplay.innerHTML = '';
            this.showPromptSharingVisualization();
        } else if (this.currentLevel === 5) {
            // Level 5: Show prompt standardization visualization
            promptDisplay.innerHTML = '';
            this.showPromptStandardizationVisualization();
        } else {
            // Level 1-3: Show collected pieces list
            promptDisplay.innerHTML = '';
            levelData.requiredPieces.forEach(piece => {
                const wasCollected = this.collectedPieces.includes(piece.id);
                const pieceEl = document.createElement('div');
                pieceEl.style.padding = '5px 10px';
                pieceEl.style.margin = '5px 0';
                pieceEl.style.borderRadius = '5px';
                pieceEl.style.background = wasCollected ? 'rgba(50, 205, 50, 0.2)' : 'rgba(255, 68, 68, 0.2)';
                pieceEl.style.border = wasCollected ? '2px solid #32CD32' : '2px solid #FF4444';
                pieceEl.textContent = `${wasCollected ? '✓' : '✗'} ${piece.text}`;
                promptDisplay.appendChild(pieceEl);
            });
        }

        // Show AI result visualization for Level 1-3
        this.showAIResult();

        // Show hints for next level
        this.showNextLevelHints();

        // Hide "Nächstes Level" button on Level 5 (final level)
        const nextLevelButton = document.querySelector('.next-level-button');
        if (nextLevelButton) {
            if (this.currentLevel === 5) {
                nextLevelButton.style.display = 'none';
            } else {
                nextLevelButton.style.display = 'inline-block';
            }
        }

        this.showScreen('levelCompleteScreen');
    }

    showAIResult() {
        const aiResultContainer = document.getElementById('aiResultContainer');
        const aiResultContent = document.getElementById('aiResultContent');

        // Only show for Level 1-3
        if (this.currentLevel > 3) {
            aiResultContainer.style.display = 'none';
            return;
        }

        aiResultContainer.style.display = 'block';
        aiResultContent.innerHTML = '';

        // Sample data for Werk 040 (Mercedes factory - production components)
        const productionData = {
            // Level 1: All months (no filter)
            allMonths: [
                { month: 'Juni 2025', edrive: 3800, eecomp: 3200, amgmotor: 720, konv: 2100, subassy: 5500 },
                { month: 'Juli 2025', edrive: 4000, eecomp: 3350, amgmotor: 760, konv: 2250, subassy: 5800 },
                { month: 'August 2025', edrive: 4200, eecomp: 3500, amgmotor: 800, konv: 2400, subassy: 6000 },
                { month: 'September 2025', edrive: 3950, eecomp: 3300, amgmotor: 740, konv: 2200, subassy: 5650 }
            ],
            // Level 2 & 3: August only
            august: [
                { category: 'E-Drive Units (komplett)', value: 4200 },
                { category: 'EE-Compartments', value: 3500 },
                { category: 'Hochleistungs-Elektromotoren (AMG)', value: 800 },
                { category: 'Konventionelle Antriebskomponenten', value: 2400 },
                { category: 'Subassemblies / Vormontagen', value: 6000 }
            ]
        };

        if (this.currentLevel === 1) {
            // Level 1: Unformatted raw data table (hard to read)
            const rawTable = document.createElement('div');
            rawTable.className = 'raw-data-table';

            let tableText = 'PRODUKTIONSDATEN WERK 040\n';
            tableText += '================================\n';
            productionData.allMonths.forEach(month => {
                tableText += `${month.month}: `;
                tableText += `EDU=${month.edrive} EEC=${month.eecomp} AMG-EM=${month.amgmotor} KONV=${month.konv} SUB=${month.subassy}\n`;
            });
            tableText += '\n[Hinweis: Daten schwer lesbar - kein Filter, keine Visualisierung]';

            rawTable.textContent = tableText;
            aiResultContent.appendChild(rawTable);

        } else if (this.currentLevel === 2) {
            // Level 2: Simple bar chart (August 2025)
            const simpleChart = document.createElement('div');
            simpleChart.className = 'simple-chart';

            // Title
            const title = document.createElement('div');
            title.style.textAlign = 'center';
            title.style.color = 'var(--accent-color)';
            title.style.marginBottom = '20px';
            title.style.fontSize = '16px';
            title.textContent = 'Produktionsdaten - August 2025';
            simpleChart.appendChild(title);

            // Find max value for scaling
            const maxValue = Math.max(...productionData.august.map(d => d.value));

            // Create chart rows
            productionData.august.forEach(data => {
                const row = document.createElement('div');
                row.className = 'chart-row';

                const label = document.createElement('div');
                label.className = 'chart-label';
                label.textContent = data.category;
                label.style.minWidth = '200px';
                label.style.fontSize = '12px';
                row.appendChild(label);

                const barContainer = document.createElement('div');
                barContainer.className = 'chart-bar-container';

                const bar = document.createElement('div');
                bar.className = 'chart-bar';
                bar.style.width = '0%';
                barContainer.appendChild(bar);

                row.appendChild(barContainer);

                const value = document.createElement('div');
                value.className = 'chart-value';
                value.textContent = data.value;
                row.appendChild(value);

                simpleChart.appendChild(row);

                // Animate bar width
                setTimeout(() => {
                    bar.style.width = `${(data.value / maxValue) * 100}%`;
                }, 100);
            });

            aiResultContent.appendChild(simpleChart);

        } else if (this.currentLevel === 3) {
            // Level 3: Advanced chart (filtered by color, sorted by quantity)
            const advancedChart = document.createElement('div');
            advancedChart.className = 'advanced-chart';

            // Title
            const title = document.createElement('div');
            title.style.textAlign = 'center';
            title.style.color = 'var(--saffron)';
            title.style.marginBottom = '20px';
            title.style.fontSize = '18px';
            title.style.fontWeight = 'bold';
            title.textContent = 'Produktionsdaten - August 2025 (nach Komponente gefiltert, sortiert nach Menge)';
            advancedChart.appendChild(title);

            // Header
            const header = document.createElement('div');
            header.className = 'advanced-chart-header';
            header.innerHTML = `
                <span style="text-align: left;">Komponente</span>
                <span>Produktionsmenge</span>
                <span>Stück</span>
            `;
            advancedChart.appendChild(header);

            // Sort data by value (descending)
            const sortedData = [...productionData.august].sort((a, b) => b.value - a.value);

            // Find max value for scaling
            const maxValue = Math.max(...sortedData.map(d => d.value));

            // Category color mapping
            const categoryMap = {
                'E-Drive Units (komplett)': { class: 'blue', bar: 'bar-blue' },
                'EE-Compartments': { class: 'green', bar: 'bar-green' },
                'Hochleistungs-Elektromotoren (AMG)': { class: 'purple', bar: 'bar-purple' },
                'Konventionelle Antriebskomponenten': { class: 'yellow', bar: 'bar-yellow' },
                'Subassemblies / Vormontagen': { class: 'red', bar: 'bar-red' }
            };

            // Create chart rows
            sortedData.forEach((data, index) => {
                const categoryInfo = categoryMap[data.category];

                const row = document.createElement('div');
                row.className = 'advanced-chart-row';

                // Category indicator
                const categoryIndicator = document.createElement('div');
                categoryIndicator.className = 'color-indicator';
                categoryIndicator.style.minWidth = '260px';
                categoryIndicator.innerHTML = `
                    <div class="color-dot color-${categoryInfo.class}"></div>
                    <span style="font-size: 12px;">${data.category}</span>
                `;
                row.appendChild(categoryIndicator);

                // Bar container
                const barContainer = document.createElement('div');
                barContainer.className = 'advanced-bar-container';

                const bar = document.createElement('div');
                bar.className = `advanced-bar ${categoryInfo.bar}`;
                bar.style.width = '0%';
                barContainer.appendChild(bar);

                row.appendChild(barContainer);

                // Value
                const value = document.createElement('div');
                value.className = 'advanced-value';
                value.textContent = data.value;
                row.appendChild(value);

                advancedChart.appendChild(row);

                // Animate bar width with delay
                setTimeout(() => {
                    bar.style.width = `${(data.value / maxValue) * 100}%`;
                }, 200 + (index * 100));
            });

            aiResultContent.appendChild(advancedChart);
        }
    }

    showPromptSharingVisualization() {
        const promptDisplay = document.getElementById('promptDisplay');
        promptDisplay.innerHTML = '';

        // Create sharing visualization container
        const sharingViz = document.createElement('div');
        sharingViz.className = 'prompt-sharing-viz';
        sharingViz.innerHTML = `
            <div class="sharing-title">Prompt-Weitergabe in Aktion</div>

            <div class="sharing-network">
                <!-- Central user (you) with prompt -->
                <div class="central-user">
                    <div class="user-avatar user-you">
                        <span class="avatar-icon">👤</span>
                        <span class="user-label">Du</span>
                    </div>
                    <div class="prompt-scroll">
                        <span class="scroll-icon">📜</span>
                        <span class="scroll-label">Dein Prompt</span>
                    </div>
                </div>

                <!-- Connection lines (will animate) -->
                <svg class="connection-lines" viewBox="0 0 600 400">
                    <line class="share-line line-1" x1="300" y1="200" x2="150" y2="100" />
                    <line class="share-line line-2" x1="300" y1="200" x2="450" y2="100" />
                    <line class="share-line line-3" x1="300" y1="200" x2="150" y2="300" />
                    <line class="share-line line-4" x1="300" y1="200" x2="450" y2="300" />
                </svg>

                <!-- Colleague avatars (recipients) -->
                <div class="colleague colleague-1">
                    <div class="user-avatar">
                        <span class="avatar-icon">👤</span>
                    </div>
                    <div class="colleague-prompt">📜</div>
                </div>
                <div class="colleague colleague-2">
                    <div class="user-avatar">
                        <span class="avatar-icon">👤</span>
                    </div>
                    <div class="colleague-prompt">📜</div>
                </div>
                <div class="colleague colleague-3">
                    <div class="user-avatar">
                        <span class="avatar-icon">👤</span>
                    </div>
                    <div class="colleague-prompt">📜</div>
                </div>
                <div class="colleague colleague-4">
                    <div class="user-avatar">
                        <span class="avatar-icon">👤</span>
                    </div>
                    <div class="colleague-prompt">📜</div>
                </div>
            </div>

            <div class="sharing-stats">
                <div class="stat-item">
                    <div class="stat-value">1</div>
                    <div class="stat-label">Prompt entwickelt</div>
                </div>
                <div class="stat-arrow">→</div>
                <div class="stat-item stat-highlight">
                    <div class="stat-value">4</div>
                    <div class="stat-label">Kollegen profitieren</div>
                </div>
                <div class="stat-arrow">=</div>
                <div class="stat-item stat-success">
                    <div class="stat-value">5x</div>
                    <div class="stat-label">Effizienz</div>
                </div>
            </div>

            <div class="sharing-message">
                Zeitersparnis durch Teilen: Ein guter Prompt hilft dem ganzen Team!
            </div>
        `;

        promptDisplay.appendChild(sharingViz);
    }

    showPromptStandardizationVisualization() {
        const promptDisplay = document.getElementById('promptDisplay');
        promptDisplay.innerHTML = '';

        const standardizationViz = document.createElement('div');
        standardizationViz.className = 'prompt-standardization-viz';
        standardizationViz.innerHTML = `
            <div class="standardization-title">🎯 Prompt-Standardisierung erfolgreich!</div>

            <div class="standardization-container">
                <!-- Before: Chaotic individual prompts -->
                <div class="before-section">
                    <div class="section-header">
                        <span class="section-icon">😵</span>
                        <span class="section-title">Vorher: Individuelle Prompts</span>
                    </div>
                    <div class="chaotic-prompts">
                        <div class="chaotic-prompt prompt-1">
                            <div class="prompt-bubble">Zeig mir mal die Daten vom August</div>
                            <div class="prompt-author">👤 Mitarbeiter A</div>
                        </div>
                        <div class="chaotic-prompt prompt-2">
                            <div class="prompt-bubble">Produktionszahlen August bitte</div>
                            <div class="prompt-author">👤 Mitarbeiter B</div>
                        </div>
                        <div class="chaotic-prompt prompt-3">
                            <div class="prompt-bubble">Gib Daten für 08/2025</div>
                            <div class="prompt-author">👤 Mitarbeiter C</div>
                        </div>
                        <div class="chaotic-prompt prompt-4">
                            <div class="prompt-bubble">August Werk 040 Zahlen</div>
                            <div class="prompt-author">👤 Mitarbeiter D</div>
                        </div>
                    </div>
                    <div class="problem-indicators">
                        <div class="problem-item">❌ Inkonsistent</div>
                        <div class="problem-item">❌ Fehleranfällig</div>
                        <div class="problem-item">❌ Schwer wartbar</div>
                    </div>
                </div>

                <!-- Arrow transformation -->
                <div class="transformation-arrow">
                    <div class="arrow-container">
                        <div class="arrow-line"></div>
                        <div class="arrow-head">▶</div>
                    </div>
                    <div class="transformation-label">Standardisierung</div>
                </div>

                <!-- After: Standardized template -->
                <div class="after-section">
                    <div class="section-header">
                        <span class="section-icon">✨</span>
                        <span class="section-title">Nachher: Standard-Template</span>
                    </div>
                    <div class="template-card">
                        <div class="template-header">
                            <span class="template-icon">📋</span>
                            <span class="template-name">Produktionsdaten-Abfrage v1.0</span>
                        </div>
                        <div class="template-body">
                            <div class="template-line">
                                <span class="template-label">Zeig mir</span>
                                <span class="template-variable">[Produktionsdaten]</span>
                            </div>
                            <div class="template-line">
                                <span class="template-label">im</span>
                                <span class="template-variable">[August 2025]</span>
                            </div>
                            <div class="template-line">
                                <span class="template-label">für Werk</span>
                                <span class="template-variable">[040]</span>
                            </div>
                            <div class="template-line">
                                <span class="template-label">als</span>
                                <span class="template-variable">[Balkendiagramm]</span>
                            </div>
                            <div class="template-line">
                                <span class="template-label">filtere nach Farbe</span>
                            </div>
                            <div class="template-line">
                                <span class="template-label">sortiert nach Menge</span>
                            </div>
                        </div>
                        <div class="template-users">
                            <span class="template-users-label">Verwendet von:</span>
                            <div class="template-users-list">
                                <span class="user-badge">👤</span>
                                <span class="user-badge">👤</span>
                                <span class="user-badge">👤</span>
                                <span class="user-badge">👤</span>
                                <span class="user-count">+12 weitere</span>
                            </div>
                        </div>
                    </div>
                    <div class="benefit-indicators">
                        <div class="benefit-item">✅ Einheitlich</div>
                        <div class="benefit-item">✅ Zuverlässig</div>
                        <div class="benefit-item">✅ Wartbar</div>
                    </div>
                </div>
            </div>

            <!-- Stats section -->
            <div class="standardization-stats">
                <div class="stat-card">
                    <div class="stat-icon">⚡</div>
                    <div class="stat-content">
                        <div class="stat-value">80%</div>
                        <div class="stat-label">Weniger Fehler</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-content">
                        <div class="stat-value">95%</div>
                        <div class="stat-label">Konsistente Ergebnisse</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🚀</div>
                    <div class="stat-content">
                        <div class="stat-value">60%</div>
                        <div class="stat-label">Zeitersparnis</div>
                    </div>
                </div>
            </div>

            <div class="standardization-message">
                Ein standardisierter Prompt sorgt für verlässliche Ergebnisse im gesamten Unternehmen!
            </div>
        `;

        promptDisplay.appendChild(standardizationViz);
    }

    showNextLevelHints() {
        const dashboard = document.getElementById('legoDashboard');
        dashboard.innerHTML = '';

        const nextLevel = this.currentLevel + 1;

        // Check if there is a next level
        if (!LEVEL_DATA[nextLevel]) {
            // Last level completed
            const message = document.createElement('div');
            message.style.textAlign = 'center';
            message.style.fontSize = '20px';
            message.style.color = 'var(--saffron)';
            message.style.padding = '20px';
            message.textContent = '🎉 Du hast alle Level gemeistert! 🎉';
            dashboard.appendChild(message);
            return;
        }

        // Level-specific hints with learning context
        const hints = {
            2: {
                tip: 'Im nächsten Level lernst du, wie du Zeiträume in deinen Prompts angeben kannst.',
                newConcept: '📅 Zeitfilter'
            },
            3: {
                tip: 'Im nächsten Level lernst du, wie du dir Daten grafisch anzeigen lassen kannst.',
                newConcept: '📊 Visualisierung'
            },
            4: {
                tip: 'Im nächsten Level lernst du, wie du deinen fertigen Prompt mit Kollegen teilen kannst.',
                newConcept: '🤝 Prompt-Weitergabe'
            },
            5: {
                tip: 'Im finalen Level lernst du, alle Konzepte zu kombinieren und einen standardisierten Prompt zu erstellen.',
                newConcept: '⭐ Prompt-Standardisierung'
            }
        };

        const levelHint = hints[nextLevel];

        if (levelHint) {
            // New concept badge
            const conceptBadge = document.createElement('div');
            conceptBadge.style.display = 'inline-block';
            conceptBadge.style.padding = '10px 20px';
            conceptBadge.style.margin = '10px 0';
            conceptBadge.style.background = 'rgba(245, 192, 59, 0.2)';
            conceptBadge.style.border = '2px solid var(--saffron)';
            conceptBadge.style.borderRadius = '20px';
            conceptBadge.style.color = 'var(--saffron)';
            conceptBadge.style.fontWeight = 'bold';
            conceptBadge.style.fontSize = '18px';
            conceptBadge.textContent = `Neues Konzept: ${levelHint.newConcept}`;
            dashboard.appendChild(conceptBadge);

            // Tip box
            const tipBox = document.createElement('div');
            tipBox.style.padding = '12px';
            tipBox.style.marginTop = '15px';
            tipBox.style.background = 'rgba(245, 192, 59, 0.1)';
            tipBox.style.border = '2px dashed var(--saffron)';
            tipBox.style.borderRadius = '8px';

            const tipText = document.createElement('p');
            tipText.innerHTML = `<strong>💬 Hinweis:</strong> ${levelHint.tip}`;
            tipText.style.color = 'var(--text-light)';
            tipText.style.fontSize = '14px';
            tipText.style.margin = '0';
            tipText.style.lineHeight = '1.6';
            tipBox.appendChild(tipText);
            dashboard.appendChild(tipBox);
        }
    }

    showScreen(screenId) {
        const screens = document.querySelectorAll('.game-screen');
        screens.forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');

        // Scroll to top when showing level complete screen
        if (screenId === 'levelCompleteScreen') {
            const completeContent = document.querySelector('.complete-content');
            if (completeContent) {
                completeContent.scrollTop = 0;
            }
        }

        // Show/hide music toggle button based on screen
        const musicToggle = document.getElementById('musicToggle');
        if (musicToggle) {
            // Hide on intro and loading screens, show on level select and gameplay
            if (screenId === 'introScreen' || screenId === 'loadingScreen') {
                musicToggle.style.display = 'none';
            } else {
                musicToggle.style.display = 'flex';
            }
        }

        // Show/hide death counter based on screen
        if (screenId === 'gameScreen' || screenId === 'levelSelectScreen') {
            showDeathCounter();
        } else {
            hideDeathCounter();
        }
    }

    buildPromptDisplay(levelData) {
        const promptGoalText = document.getElementById('promptGoalText');
        const promptGoalLabel = document.getElementById('promptGoalLabel');
        if (!promptGoalText) return;

        // Clear existing content
        promptGoalText.innerHTML = '';

        // Level 4 & 5: Hide "Prompt:" label
        if (promptGoalLabel) {
            if (this.currentLevel === 4 || this.currentLevel === 5) {
                promptGoalLabel.style.display = 'none';
            } else {
                promptGoalLabel.style.display = 'block';
            }
        }

        // Level 4: Show special instruction instead of prompt pieces
        if (this.currentLevel === 4) {
            promptGoalText.textContent = 'Finde die Schriftrolle wo dein fertiger Prompt steht';
            return;
        }

        // Level 5: Show final challenge instruction
        if (this.currentLevel === 5) {
            promptGoalText.textContent = 'Erreiche das Ende um den Prompt zu standardisieren';
            return;
        }

        // Check if this level has prefilled pieces
        const prefilledIds = levelData.prefilledPieces ? levelData.prefilledPieces.map(p => p.id) : [];

        // Build prompt from required pieces
        levelData.requiredPieces.forEach((piece, index) => {
            const span = document.createElement('span');
            span.dataset.pieceId = piece.id;

            // Check if this piece is prefilled from previous level
            if (prefilledIds.includes(piece.id)) {
                span.textContent = piece.text;
                span.classList.add('collected'); // Already filled, show as green
            }
            // Check if already collected in current level
            else if (this.collectedPieces.includes(piece.id)) {
                span.textContent = piece.text;
                span.classList.add('collected');
            }
            // Show as placeholder (long dash)
            else {
                span.textContent = '___________';
                span.classList.add('placeholder');
            }

            promptGoalText.appendChild(span);

            // Add space between pieces
            if (index < levelData.requiredPieces.length - 1) {
                promptGoalText.appendChild(document.createTextNode(' '));
            }
        });
    }

    updatePromptDisplay(pieceId) {
        const promptGoalText = document.getElementById('promptGoalText');
        if (!promptGoalText) return;

        // Find the span with this piece ID
        const spans = promptGoalText.querySelectorAll('span');
        spans.forEach(span => {
            if (span.dataset.pieceId === pieceId) {
                // If it's a placeholder, replace with actual text
                if (span.classList.contains('placeholder')) {
                    // Find the piece text from level data
                    const currentLevelData = LEVEL_DATA[this.currentLevel];
                    const piece = currentLevelData.requiredPieces.find(p => p.id === pieceId);
                    if (piece) {
                        span.textContent = piece.text;
                    }
                    span.classList.remove('placeholder');
                }
                // Mark as collected (green)
                span.classList.add('collected');
            }
        });
    }
}

// ===== GLOBAL FUNCTIONS =====
let game;

function showLevelSelect() {
    const screens = document.querySelectorAll('.game-screen');
    screens.forEach(screen => screen.classList.remove('active'));
    document.getElementById('levelSelectScreen').classList.add('active');
}

function startLevel(levelNumber) {
    if (!game) {
        game = new PlatformerGame();
    }
    game.startLevel(levelNumber);
}

function nextLevel() {
    const nextLevelNum = game.currentLevel + 1;
    if (nextLevelNum <= 5) {
        startLevel(nextLevelNum);
    } else {
        // All levels completed
        goToLevelSelect();
    }
}

function goToLevelSelect(fromCompletedLevel = null) {
    if (game) {
        game.isRunning = false;
        if (game.gameLoopId) {
            cancelAnimationFrame(game.gameLoopId);
        }
        game.clearLevel();
        // Stop music when going to level select
        game.pauseMusic();
        // Hide music toggle button in level select
        if (game.musicToggleBtn) {
            game.musicToggleBtn.style.display = 'none';
        }
    }
    showLevelSelect();
    // Re-initialize world map to show updated progress
    setupLevelCards();

    // Trigger unlock animation if coming from completed level
    if (fromCompletedLevel) {
        animateNextLevelUnlock(fromCompletedLevel);
    }
}

function goToLevelSelectWithAnimation() {
    // Call goToLevelSelect with the current completed level
    const completedLevel = game ? game.currentLevel : null;
    goToLevelSelect(completedLevel);
}

// ===== PAUSE MENU FUNCTIONS =====
function resumeGame() {
    if (game) {
        game.togglePauseMenu();
    }
}

function returnToLevelSelect() {
    const pauseMenu = document.getElementById('pauseMenu');
    if (pauseMenu) {
        pauseMenu.style.display = 'none';
    }
    goToLevelSelect();
}

// ===== TXP CLICK EASTER EGG =====
let txpClickTimeout = null;


// ===== INTRO SCREEN SETUP =====
function setupIntroScreen() {
    const introScreen = document.getElementById('introScreen');
    let introActive = true;

    const startFromIntro = () => {
        if (!introActive || !introScreen.classList.contains('active')) return;

        introActive = false;
        showLevelSelect();

        document.removeEventListener('keydown', handleKeyPress);
        introScreen.removeEventListener('click', handleClick);
    };

    const handleKeyPress = (e) => {
        if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;
        startFromIntro();
    };

    const handleClick = () => {
        startFromIntro();
    };

    document.addEventListener('keydown', handleKeyPress);
    introScreen.addEventListener('click', handleClick);
}

// ===== MOON CLICK HANDLER =====
function setupMoonClickHandler() {
    const moon = document.querySelector('.intro-content .moon');
    if (!moon) return;

    moon.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering intro screen start
        moon.classList.toggle('red');
    });
}

// ===== TXP INTRO ANIMATION =====
function startIntroTxpAnimation() {
    const introTxpImg = document.getElementById('introTxpImg');
    const introTxp = document.querySelector('.intro-txp');
    if (!introTxpImg || !introTxp) return;

    const walkFrames = 24;
    let currentFrame = 0;
    const walkBasePath = 'TXP/TXP_Lauf_Pose/TXP Lauf Loop_';
    const jumpBasePath = 'TXP/TXP_Sprung_Pose/TXP Sprung_';

    let isJumping = false;
    let walkInterval;

    // Walking animation loop
    const startWalkAnimation = () => {
        walkInterval = setInterval(() => {
            if (!isJumping) {
                const frameStr = String(currentFrame).padStart(5, '0');
                introTxpImg.src = `${walkBasePath}${frameStr}.png`;
                currentFrame = (currentFrame + 1) % walkFrames;
            }
        }, 1000 / 36); // 36 FPS (3x faster than 12)
    };

    // Jump animation
    const playJumpAnimation = () => {
        if (isJumping) return;
        isJumping = true;
        introTxp.classList.add('jumping');

        let jumpFrame = 0;
        const totalJumpFrames = 90; // 0-89
        const jumpAnimDuration = 3000; // 3 seconds
        const frameTime = jumpAnimDuration / totalJumpFrames;

        const jumpInterval = setInterval(() => {
            let frameName;
            if (jumpFrame === 14) {
                frameName = '00014A';
            } else if (jumpFrame === 15) {
                frameName = '00015B';
            } else if (jumpFrame < 10) {
                frameName = '0000' + jumpFrame;
            } else if (jumpFrame < 100) {
                frameName = '000' + jumpFrame;
            } else {
                frameName = '00' + jumpFrame;
            }

            introTxpImg.src = `${jumpBasePath}${frameName}.png`;
            jumpFrame++;

            if (jumpFrame >= totalJumpFrames) {
                clearInterval(jumpInterval);
                isJumping = false;
                introTxp.classList.remove('jumping');
                currentFrame = 0; // Reset walk frame
            }
        }, frameTime);
    };

    // Start walking animation
    startWalkAnimation();

    // Click handler for jumping
    introTxp.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering intro screen start
        playJumpAnimation();
    });
}

// ===== WORLD MAP & LEVEL PROGRESSION =====
function setupLevelCards() {
    // Load progress from localStorage
    const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
    // If no levels completed, only level 1 is unlocked
    // Otherwise, highest completed level + 1 is unlocked
    const highestUnlockedLevel = completedLevels.length === 0 ? 1 : Math.max(...completedLevels) + 1;

    updateWorldMapProgress(completedLevels);

    // Show death counter on level selection screen
    showDeathCounter();

    // Show rank badge
    updateRankBadge();

    const mapLevels = document.querySelectorAll('.map-level');
    mapLevels.forEach(mapLevel => {
        const levelNum = parseInt(mapLevel.getAttribute('data-level'));

        // Check if level is unlocked
        const isUnlocked = levelNum <= highestUnlockedLevel;
        const isCompleted = completedLevels.includes(levelNum);

        // Reset all classes first
        mapLevel.classList.remove('locked', 'unlocked', 'completed', 'unlocking');

        const lockEl = mapLevel.querySelector('.map-level-lock');
        const statusEl = mapLevel.querySelector('.map-level-status');
        const pointsEl = mapLevel.querySelector('.map-level-points');

        // Check if points have been awarded for this level
        const levelsAwarded = JSON.parse(localStorage.getItem('levelsAwarded') || '[]');
        const hasPointsForLevel = levelsAwarded.includes(levelNum);

        if (isCompleted) {
            mapLevel.classList.add('completed');
            if (statusEl) statusEl.textContent = '';
            if (lockEl) lockEl.style.display = 'none';
            if (pointsEl) {
                // Show 100/100 if points awarded, otherwise 0/100
                if (hasPointsForLevel) {
                    pointsEl.textContent = '100 / 100 Punkte';
                } else {
                    pointsEl.textContent = '0 / 100 Punkte';
                }
                pointsEl.classList.add('completed');
            }
        } else if (isUnlocked) {
            mapLevel.classList.add('unlocked');
            if (lockEl) lockEl.style.display = 'none';
            if (statusEl) {
                statusEl.textContent = '▶ Spielen';
                statusEl.classList.add('unlocked');
            }
            if (pointsEl) {
                pointsEl.textContent = '0 / 100 Punkte';
                pointsEl.classList.remove('completed');
            }
        } else {
            // Locked
            mapLevel.classList.add('locked');
            if (lockEl) lockEl.style.display = 'none';
            if (statusEl) {
                statusEl.textContent = 'Gesperrt';
                statusEl.classList.remove('unlocked');
            }
            if (pointsEl) {
                pointsEl.textContent = '0 / 100 Punkte';
                pointsEl.classList.remove('completed');
            }
        }

        // Remove old click handlers by cloning the node
        const newMapLevel = mapLevel.cloneNode(true);
        mapLevel.parentNode.replaceChild(newMapLevel, mapLevel);

        // Add click handler to the new node
        newMapLevel.addEventListener('click', () => {
            if (isUnlocked || isCompleted) {
                startLevel(levelNum);
            } else {
                // Show locked message
                showLockedMessage(levelNum);
            }
        });
    });
}



function updateWorldMapProgress(completedLevels) {
    const rankLegendPoints = document.getElementById('rankLegendPoints');
    const currentPoints = getPlayerPoints();

    if (rankLegendPoints) rankLegendPoints.textContent = `${currentPoints} / 500 Punkte`;
}

function showLockedMessage(levelNum) {
    // Level is locked - no action needed
    console.log(`Level ${levelNum} is locked`);
}

function unlockNextLevel(completedLevel) {
    // Load current progress
    let completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');

    // Track which levels have been awarded points (persists across resets)
    let levelsAwarded = JSON.parse(localStorage.getItem('levelsAwarded') || '[]');

    // Add completed level if not already there
    if (!completedLevels.includes(completedLevel)) {
        completedLevels.push(completedLevel);
        completedLevels.sort((a, b) => a - b);
        localStorage.setItem('completedLevels', JSON.stringify(completedLevels));

        // Only award points if this level hasn't been awarded before
        if (!levelsAwarded.includes(completedLevel)) {
            awardPoints(100);
            levelsAwarded.push(completedLevel);
            localStorage.setItem('levelsAwarded', JSON.stringify(levelsAwarded));
        }

        console.log(`✅ Level ${completedLevel} completed! Unlocked Level ${completedLevel + 1}`);
    }
}

// Points and ranking system
function awardPoints(points) {
    let currentPoints = parseInt(localStorage.getItem('playerPoints') || '0');
    currentPoints += points;

    // Cap points at 500 (max possible from 5 levels × 100 points)
    currentPoints = Math.min(currentPoints, 500);

    localStorage.setItem('playerPoints', currentPoints.toString());

    // Update highest rank achieved
    updateHighestRank();

    // Update rank badge display
    updateRankBadge();

    console.log(`🏆 Awarded ${points} points! Total: ${currentPoints}/500`);
}

function getPlayerPoints() {
    return parseInt(localStorage.getItem('playerPoints') || '0');
}

function getRank(points) {
    if (points >= 500) return 'gold';
    if (points >= 400) return 'silver';
    if (points >= 300) return 'bronze';
    return 'none';
}

function updateHighestRank() {
    const currentPoints = getPlayerPoints();
    const currentRank = getRank(currentPoints);
    const highestRank = localStorage.getItem('highestRank') || 'none';

    // Rank hierarchy: gold > silver > bronze > none
    const rankValue = { gold: 3, silver: 2, bronze: 1, none: 0 };

    if (rankValue[currentRank] > rankValue[highestRank]) {
        localStorage.setItem('highestRank', currentRank);
        console.log(`🏆 New rank achieved: ${currentRank.toUpperCase()}!`);
    }
}

function getHighestRank() {
    return localStorage.getItem('highestRank') || 'none';
}

function animateNextLevelUnlock(completedLevel) {
    const nextLevel = completedLevel + 1;

    // Don't animate if there's no next level
    if (nextLevel > 5) return;

    // Wait a bit before starting animation
    setTimeout(() => {
        const nextLevelElement = document.querySelector(`.map-level[data-level="${nextLevel}"]`);
        if (nextLevelElement && nextLevelElement.classList.contains('locked')) {
            // Remove locked state
            nextLevelElement.classList.remove('locked');
            nextLevelElement.classList.add('unlocked', 'unlocking');

            // Remove lock icon
            const lockEl = nextLevelElement.querySelector('.map-level-lock');
            if (lockEl) lockEl.style.display = 'none';

            // Update status
            const statusEl = nextLevelElement.querySelector('.map-level-status');
            if (statusEl) {
                statusEl.textContent = '▶ Spielen';
                statusEl.classList.add('unlocked');
            }

            // Remove unlocking class after animation
            setTimeout(() => {
                nextLevelElement.classList.remove('unlocking');
            }, 1000);
        }
    }, 500); // Reduced delay since no path animation
}

// Update rank badge display
function updateRankBadge() {
    const rankBadge = document.getElementById('rankBadge');
    const rankIcon = document.getElementById('rankIcon');
    const rankLabel = document.getElementById('rankLabel');

    if (!rankBadge || !rankIcon || !rankLabel) return;

    const highestRank = getHighestRank();

    if (highestRank === 'none') {
        rankBadge.style.display = 'none';
        return;
    }

    // Show badge
    rankBadge.style.display = 'flex';
    rankBadge.className = `rank-badge ${highestRank}`;

    // Set label based on rank (no icon)
    const rankData = {
        bronze: 'Bronze',
        silver: 'Silber',
        gold: 'Gold'
    };

    rankLabel.textContent = rankData[highestRank] || '';
    rankIcon.textContent = ''; // No icon

    // Add click event for animation
    rankBadge.onclick = () => {
        rankBadge.classList.add('rank-badge-clicked');
        setTimeout(() => {
            rankBadge.classList.remove('rank-badge-clicked');
        }, 1000);
    };
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Schummeln erlaubt - Platformer initialized!');

    // Intro Screen
    setupIntroScreen();

    // Start TXP walking animation in intro
    startIntroTxpAnimation();

    // Setup moon click handler
    setupMoonClickHandler();

    // Level Card Handlers
    setupLevelCards();

    // Preload images (same as Level 4)
    const preloadImages = [];
    let loadedCount = 0;
    let totalImages = 0;

    // Calculate total images
    Object.keys(ANIMATIONS).forEach(animName => {
        totalImages += ANIMATIONS[animName].frames;
    });
    Object.keys(TXP_ANIMATIONS).forEach(animName => {
        totalImages += TXP_ANIMATIONS[animName].frames;
    });

    console.log(`Preloading ${totalImages} images...`);

    // Preload Mo Man animations
    Object.keys(ANIMATIONS).forEach(animName => {
        const anim = ANIMATIONS[animName];
        for (let i = 0; i < anim.frames; i++) {
            const img = new Image();
            let frameStr;

            // Special handling for enemy animation (4 digits)
            if (animName === 'enemy') {
                frameStr = String(i).padStart(4, '0');
            } else {
                frameStr = String(i).padStart(5, '0');
            }

            if (animName === 'jump') {
                if (i === 27) frameStr = '00027_a';
                else if (i === 28) frameStr = '00028_b';
            }

            img.src = `${anim.path}${frameStr}.png`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    console.log('✅ All images preloaded!');
                }
            };
            img.onerror = () => {
                console.warn(`⚠️ Failed to load: ${img.src}`);
                loadedCount++;
            };
            preloadImages.push(img);
        }
    });

    // Preload TXP animations
    Object.keys(TXP_ANIMATIONS).forEach(animName => {
        const anim = TXP_ANIMATIONS[animName];
        for (let i = 0; i < anim.frames; i++) {
            const img = new Image();
            const frameStr = String(i).padStart(5, '0');

            // Handle special filenames for TXP Sprung frames 14 and 15
            let filename;
            if (animName === 'jump' && i === 14) {
                filename = `${anim.path}${frameStr}A.png`;
            } else if (animName === 'jump' && i === 15) {
                filename = `${anim.path}${frameStr}B.png`;
            } else {
                filename = `${anim.path}${frameStr}.png`;
            }

            img.src = filename;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    console.log('✅ All images preloaded!');
                }
            };
            img.onerror = () => {
                console.warn(`⚠️ Failed to load: ${img.src}`);
                loadedCount++;
            };
            preloadImages.push(img);
        }
    });
});

// ===== DEATH COUNTER SYSTEM =====
function getDeathCount() {
    return parseInt(localStorage.getItem('deathCount') || '0');
}

function setDeathCount(count) {
    localStorage.setItem('deathCount', count.toString());
    updateDeathCounterDisplay();
}

function incrementDeathCounter() {
    const currentCount = getDeathCount();
    setDeathCount(currentCount + 1);
}

function updateDeathCounterDisplay() {
    const deathCountElement = document.getElementById('deathCount');
    if (deathCountElement) {
        deathCountElement.textContent = getDeathCount();
    }
}

function showDeathCounter() {
    const deathCounter = document.getElementById('deathCounter');
    if (deathCounter) {
        deathCounter.style.display = 'flex';
        updateDeathCounterDisplay();
    }
}

function hideDeathCounter() {
    const deathCounter = document.getElementById('deathCounter');
    if (deathCounter) {
        deathCounter.style.display = 'none';
    }
}

// ===== RESET PROGRESS SYSTEM =====
function showResetConfirmation() {
    const resetPopup = document.getElementById('resetPopup');
    if (resetPopup) {
        resetPopup.style.display = 'flex';
    }
}

function hideResetConfirmation() {
    const resetPopup = document.getElementById('resetPopup');
    if (resetPopup) {
        resetPopup.style.display = 'none';
    }
}

function confirmReset() {
    // Clear level progress and death count
    localStorage.removeItem('completedLevels');
    localStorage.removeItem('deathCount');

    // Keep playerPoints and highestRank (they persist)
    // These are NOT removed to preserve the player's rank achievement

    // Hide popup
    hideResetConfirmation();

    // Refresh the level selection to show reset state
    setupLevelCards();
    updateDeathCounterDisplay();
    updateRankBadge(); // Update rank badge display
}


