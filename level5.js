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
    }
};

// ===== LEVEL DATA - 5 Fixed Levels (Progressiv schwieriger) =====
const LEVEL_DATA = {
    1: {
        name: "Erste Anfrage",
        difficulty: "Tutorial - Sehr Einfach",
        prompt: "Zeig mir Produktionsdaten für Werk 0500",
        requiredPieces: [
            { id: "zeig-mir", text: "Zeig mir", type: "good" },
            { id: "produktionsdaten", text: "Produktionsdaten", type: "good" },
            { id: "werk-0500", text: "für Werk 0500", type: "good" }
        ],
        platforms: [
            // SEHR BREITE Plattformen, KLEINE Gaps - Tutorial Level
            { x: 0, y: 650, width: 500, height: 50 },
            { x: 550, y: 650, width: 450, height: 50 },
            { x: 1050, y: 650, width: 500, height: 50 },
            { x: 1600, y: 650, width: 450, height: 50 },
            { x: 2100, y: 650, width: 500, height: 50 },
            { x: 2650, y: 650, width: 450, height: 50 },
            { x: 3150, y: 650, width: 500, height: 50 },
            { x: 3700, y: 650, width: 1300, height: 50 },
            // Wenige, einfache erhöhte Plattformen
            { x: 700, y: 500, width: 250, height: 30 },
            { x: 1700, y: 500, width: 250, height: 30 },
            { x: 2800, y: 500, width: 250, height: 30 }
        ],
        promptPieces: [
            // Good pieces auf einfachen Positionen
            { x: 800, y: 370, id: "zeig-mir", text: "Zeig mir", type: "good" },
            { x: 1800, y: 370, id: "produktionsdaten", text: "Produktionsdaten", type: "good" },
            { x: 2900, y: 370, id: "werk-0500", text: "für Werk 0500", type: "good" },
            // NUR 2 falsche Prompts - wenig Ablenkung
            { x: 1300, y: 520, id: "gib-daten", text: "Gib Daten", type: "bad" },
            { x: 2400, y: 520, id: "zeig-was", text: "Zeig was", type: "bad" }
        ],
        goalX: 4700
    },

    2: {
        name: "Zeitfilter",
        difficulty: "Leicht",
        prompt: "Zeig mir Produktionsdaten im August 2025 für Werk 0500",
        requiredPieces: [
            { id: "zeig-mir", text: "Zeig mir", type: "good" },
            { id: "produktionsdaten", text: "Produktionsdaten", type: "good" },
            { id: "august-2025", text: "im August 2025", type: "good" },
            { id: "werk-0500", text: "für Werk 0500", type: "good" }
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
            // Good pieces höher platziert (80px höher)
            { x: 640, y: 370, id: "zeig-mir", text: "Zeig mir", type: "good" },
            { x: 1010, y: 320, id: "produktionsdaten", text: "Produktionsdaten", type: "good" },
            { x: 1790, y: 370, id: "august-2025", text: "im August 2025", type: "good" },
            { x: 3010, y: 370, id: "werk-0500", text: "für Werk 0500", type: "good" },
            // MEHR Bad pieces (6 statt 4) - mehr Ablenkung (80px höher)
            { x: 1100, y: 520, id: "irgendwann", text: "irgendwann", type: "bad" },
            { x: 1500, y: 520, id: "letzte-woche", text: "letzte Woche", type: "bad" },
            { x: 2000, y: 520, id: "bald", text: "bald", type: "bad" },
            { x: 2300, y: 520, id: "neulich", text: "neulich", type: "bad" },
            { x: 2700, y: 520, id: "mal-schauen", text: "mal schauen", type: "bad" },
            { x: 3400, y: 520, id: "später", text: "später", type: "bad" }
        ],
        goalX: 4700
    },

    3: {
        name: "Visualisierung",
        difficulty: "Mittel",
        prompt: "Zeig mir Produktionsdaten im August 2025 als Balkendiagramm für Werk 0500",
        requiredPieces: [
            { id: "zeig-mir", text: "Zeig mir", type: "good" },
            { id: "produktionsdaten", text: "Produktionsdaten", type: "good" },
            { id: "august-2025", text: "im August 2025", type: "good" },
            { id: "balkendiagramm", text: "als Balkendiagramm", type: "good" },
            { id: "werk-0500", text: "für Werk 0500", type: "good" }
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
            { x: 1980, y: 480, width: 130, height: 30 },
            { x: 2600, y: 480, width: 130, height: 30 },
            { x: 2910, y: 430, width: 130, height: 30 },
            { x: 3200, y: 380, width: 130, height: 30 }
        ],
        promptPieces: [
            // Good pieces höher und schwieriger platziert (80px höher)
            { x: 590, y: 350, id: "zeig-mir", text: "Zeig mir", type: "good" },
            { x: 1180, y: 250, id: "produktionsdaten", text: "Produktionsdaten", type: "good" },
            { x: 1470, y: 220, id: "august-2025", text: "im August 2025", type: "good" },
            { x: 2070, y: 350, id: "balkendiagramm", text: "als Balkendiagramm", type: "good" },
            { x: 3290, y: 250, id: "werk-0500", text: "für Werk 0500", type: "good" },
            // Bad pieces verteilt auf verschiedenen Höhen
            { x: 500, y: 550, id: "als-tabelle", text: "als Tabelle", type: "bad" },
            { x: 750, y: 520, id: "als-text", text: "als Text", type: "bad" },
            { x: 1050, y: 480, id: "ohne-visual", text: "ohne Visualisierung", type: "bad" },
            { x: 1500, y: 450, id: "zeig-alles", text: "zeig alles", type: "bad" },
            { x: 1900, y: 520, id: "als-liste", text: "als Liste", type: "bad" },
            { x: 2300, y: 480, id: "nur-zahlen", text: "nur Zahlen", type: "bad" },
            { x: 2650, y: 550, id: "keine-grafik", text: "keine Grafik", type: "bad" },
            { x: 2950, y: 520, id: "zeig-irgendwas", text: "zeig irgendwas", type: "bad" },
            { x: 3400, y: 480, id: "als-excel", text: "als Excel", type: "bad" }
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
            { x: 0, y: 650, width: 200, height: 40 },
            // Schwieriger Zickzack-Parcours mit precision jumps
            { x: 350, y: 600, width: 140, height: 35 },
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
            // Good pieces auf sehr schwierigen Positionen (80px höher)
            { x: 570, y: 290, id: "zeig-mir", text: "Zeig mir", type: "good" },
            { x: 1170, y: 190, id: "produktionsdaten", text: "Produktionsdaten", type: "good" },
            { x: 1770, y: 150, id: "august-2025", text: "im August 2025", type: "good" },
            { x: 2050, y: 200, id: "filter-farbe", text: "filtere nach Farbe", type: "good" },
            { x: 3720, y: 420, id: "sortiert-menge", text: "sortiert nach Menge", type: "good" },
            // Bad pieces auf variierten Höhen verteilt
            { x: 350, y: 230, id: "keine-filter", text: "ohne Filter", type: "bad" },
            { x: 650, y: 400, id: "unsortiert", text: "unsortiert", type: "bad" },
            { x: 950, y: 360, id: "random", text: "zufällig", type: "bad" },
            { x: 1200, y: 310, id: "alles-zeigen", text: "alles anzeigen", type: "bad" },
            { x: 1500, y: 260, id: "keine-sortierung", text: "keine Sortierung", type: "bad" },
            { x: 1830, y: 310, id: "zeig-alles", text: "zeig alles", type: "bad" },
            { x: 2120, y: 360, id: "egal-wie", text: "egal wie", type: "bad" },
            { x: 2420, y: 410, id: "mach-was", text: "mach was", type: "bad" },
            { x: 2720, y: 480, id: "irgendwie", text: "irgendwie", type: "bad" },
            { x: 4400, y: 430, id: "ohne-details", text: "ohne Details", type: "bad" }
        ],
        goalX: 4700
    },

    5: {
        name: "Cheat-Sheet Master",
        difficulty: "Extrem Schwer",
        prompt: "Zeig mir Produktionsdaten im August 2025 für Werk 0500 als Balkendiagramm filtere nach Farbe",
        requiredPieces: [
            { id: "zeig-mir", text: "Zeig mir", type: "good" },
            { id: "produktionsdaten", text: "Produktionsdaten", type: "good" },
            { id: "august-2025", text: "im August 2025", type: "good" },
            { id: "werk-0500", text: "für Werk 0500", type: "good" },
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
            { x: 2280, y: 490, width: 130, height: 30 },

            // Section 4: Plattform vor dem Fall (mit Pfeil-Markierung)
            { x: 2720, y: 550, width: 150, height: 30 },
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
            // Good pieces verteilt über das ganze Level - hoch positioniert und schwer zu erreichen
            { x: 1630, y: 250, id: "zeig-mir", text: "Zeig mir", type: "good" },
            { x: 2500, y: 280, id: "produktionsdaten", text: "Produktionsdaten", type: "good" },
            { x: 11000, y: 500, id: "august-2025", text: "im August 2025", type: "good" },
            { x: 13450, y: 400, id: "werk-0500", text: "für Werk 0500", type: "good" },
            { x: 15650, y: 270, id: "balkendiagramm", text: "als Balkendiagramm", type: "good" },
            { x: 28100, y: 300, id: "filter-farbe", text: "filtere nach Farbe", type: "good" },

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
            { x: 10700, y: 520, width: 115, height: 115, speed: 1.7, platformX: 10700, platformWidth: 600 },
            // Plattform 3: x: 11700, y: 650, width: 500
            { x: 11700, y: 520, width: 115, height: 115, speed: 1.7, platformX: 11700, platformWidth: 500 },
            // Plattform 4: x: 12550, y: 600, width: 400
            { x: 12550, y: 470, width: 115, height: 115, speed: 1.7, platformX: 12550, platformWidth: 400 },
            // Plattform 5: x: 13300, y: 550, width: 400
            { x: 13300, y: 420, width: 115, height: 115, speed: 1.7, platformX: 13300, platformWidth: 400 }
        ],
        jumpingEnemies: [
            // Großer springender Enemy auf langer Plattform: x: 14700, y: 450, width: 1000
            // Mittig: platformX (14700) + (platformWidth (1000) - enemyWidth (400)) / 2 = 14700 + 300 = 15000
            { x: 15000, y: 50, width: 400, height: 400, platformX: 14700, platformWidth: 1000 }
        ],
        goalX: 28400
    }
};

// ===== TXP HOST CLASS (From Level 4) =====
class TXPHost {
    constructor() {
        this.element = document.getElementById('txpHost');
        this.img = document.getElementById('txpHostImg');
        this.currentAnimation = null;
        this.currentFrame = 0;
        this.animationInterval = null;
        this.canTalk = false;

        this.startAnimation('stand');
    }

    startAnimation(animName) {
        if (this.currentAnimation === animName && this.animationInterval) return;

        this.stopAnimation();
        this.currentAnimation = animName;
        this.currentFrame = 0;
        const anim = TXP_ANIMATIONS[animName];

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
        const anim = TXP_ANIMATIONS[this.currentAnimation];
        const frameStr = String(this.currentFrame).padStart(5, '0');
        this.img.src = `${anim.path}${frameStr}.png`;
    }

    enableTalking() {
        this.canTalk = true;
    }

    talk(duration = 3000) {
        if (!this.canTalk) return;

        this.startAnimation('talk');
        setTimeout(() => {
            this.startAnimation('stand');
        }, duration);
    }

    destroy() {
        this.stopAnimation();
    }
}

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

        this.x += this.velocityX;

        // Store previous bottom position (feet position)
        const previousBottom = this.y + GAME_CONFIG.playerHeight;

        // Apply gravity
        this.velocityY += GAME_CONFIG.gravity;
        this.y += this.velocityY;

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
    constructor(gameArea, x, y, width, height, isLava = false) {
        this.gameArea = gameArea;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isLava = isLava;

        this.createElement();
        this.debugHitbox = null;
        this.createDebugHitbox();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = this.isLava ? 'platform lava-platform' : 'platform';
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
        this.element.textContent = this.text;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        document.getElementById('promptPiecesContainer').appendChild(this.element);

        // Cache dimensions after element is added to DOM
        requestAnimationFrame(() => {
            const rect = this.element.getBoundingClientRect();
            this.width = rect.width;
            this.height = rect.height;

            // Update debug hitbox with actual dimensions
            if (this.debugHitbox) {
                this.debugHitbox.style.width = `${this.width}px`;
                this.debugHitbox.style.height = `${this.height}px`;
            }

            // Add lego studs dynamically based on width
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
        // Fixed stud spacing like real LEGO bricks
        const studWidth = 12;
        const fixedSpacing = 40; // Fester Abstand zwischen Noppen (Mitte zu Mitte)

        // Calculate how many studs fit with fixed spacing
        const numStuds = Math.max(1, Math.floor((this.width - 20) / fixedSpacing) + 1);

        // Calculate total width needed for all studs
        const totalWidth = (numStuds - 1) * fixedSpacing;

        // Center the studs horizontally
        const startX = (this.width - totalWidth) / 2;

        // Create studs
        for (let i = 0; i < numStuds; i++) {
            const stud = document.createElement('div');
            stud.className = 'lego-stud';
            // Position with fixed spacing, centered on stud
            stud.style.left = `${startX + (i * fixedSpacing) - (studWidth / 2)}px`;

            // Inherit background color from parent
            const bgColor = window.getComputedStyle(this.element).background;
            stud.style.background = bgColor;

            this.element.appendChild(stud);
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

        this.createElement();
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

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
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
            const paddedNumber = String(i).padStart(5, '0');
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
        const offsetY = (this.height - hitboxHeight) / 2;

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

        // Apply squash animation
        this.element.style.transition = 'transform 0.1s ease-out';
        this.element.style.transform = 'scaleY(0.3) scaleX(1.2)';
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

        for (let i = 0; i < ANIMATIONS.enemy.frames; i++) {
            const img = new Image();
            const paddedNumber = String(i).padStart(5, '0');
            img.src = `${ANIMATIONS.enemy.path}${paddedNumber}.png`;
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
        const offsetY = (this.height - hitboxHeight) / 2;

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
        return `${ANIMATIONS.enemy.path}${paddedNumber}.png`;
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
        if (this.frameCounter >= ANIMATIONS.enemy.speed) {
            this.frameCounter = 0;
            this.currentFrame = (this.currentFrame + 1) % ANIMATIONS.enemy.frames;
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

// ===== MAIN PLATFORMER GAME CLASS =====
class PlatformerGame {
    constructor() {
        this.gameArea = document.getElementById('gameArea');

        // Game state
        this.isRunning = false;
        this.currentLevel = 1;
        this.lives = GAME_CONFIG.lives;

        // Game objects
        this.player = null;
        this.platforms = [];
        this.promptPieces = [];
        this.spikes = [];
        this.enemies = [];
        this.jumpingEnemies = [];
        this.goal = null;
        this.fallArrow = null;
        this.teleportZone = null;
        this.camera = null;

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

        // Speech bubble
        this.speechBubble = document.getElementById('moSpeech');
        this.speechText = document.getElementById('moSpeechText');

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

            if (!this.isRunning || this.isDead) return;

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

            if (!this.isRunning || this.isDead) return;

            // Stop movement
            if (e.key === 'ArrowLeft') {
                this.player.isMovingLeft = false;
            } else if (e.key === 'ArrowRight') {
                this.player.isMovingRight = false;
            }
        });
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

        // Create platforms
        levelData.platforms.forEach(platformData => {
            const platform = new Platform(
                this.gameArea,
                platformData.x,
                platformData.y,
                platformData.width,
                platformData.height,
                platformData.lava || false
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

        // Create goal at end of level
        this.goal = new Goal(this.gameArea, levelData.goalX, 450);

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

        // Show level prompt from TXP
        this.showSpeech(levelData.prompt, 4000);
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

        // Enable TXP talking
        if (txpHost) txpHost.enableTalking();

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

            // Check teleport zone collision (Level 5 only)
            if (this.teleportZone) {
                this.checkTeleportCollision(this.teleportZone, 'teleport1');
            }
            if (this.teleportZone2) {
                this.checkTeleportCollision(this.teleportZone2, 'teleport2');
            }

            // Check level complete (reached goal)
            if (this.player.x >= LEVEL_DATA[this.currentLevel].goalX) {
                this.levelComplete();
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
                this.showSpeech(`Richtig! "${piece.text}" eingesammelt!`, 2000);
            });
        } else if (piece.type === 'bad') {
            // Picked up bad piece - instant death (only 1 life)
            requestAnimationFrame(() => {
                this.showSpeech(`Falsch! "${piece.text}" ist ein schlechter Prompt!`, 2000);
            });
            this.handleDeath();
        }
    }

    handleDeath() {
        this.isDead = true;

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

        this.showLevelCompleteScreen();
    }

    showLevelCompleteScreen() {
        // Calculate how many required pieces were collected
        const requiredCollected = this.collectedPieces.filter(id =>
            this.requiredPieces.includes(id)
        ).length;

        const totalRequired = this.requiredPieces.length;

        // Update UI
        document.getElementById('completeCollected').textContent = `${requiredCollected}/${totalRequired}`;

        // Rating
        let rating = '';
        if (requiredCollected === totalRequired) {
            rating = '⭐⭐⭐ Perfekt!';
        } else if (requiredCollected >= totalRequired * 0.7) {
            rating = '⭐⭐ Gut!';
        } else {
            rating = '⭐ OK!';
        }
        document.getElementById('completeRating').textContent = rating;

        // Build prompt display
        const levelData = LEVEL_DATA[this.currentLevel];
        const promptDisplay = document.getElementById('promptDisplay');
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

        this.showScreen('levelCompleteScreen');
    }

    showScreen(screenId) {
        const screens = document.querySelectorAll('.game-screen');
        screens.forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');

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
    }

    showSpeech(text, duration = 3000) {
        this.speechText.textContent = text;
        this.speechBubble.style.display = 'block';

        if (txpHost) txpHost.talk(duration);

        setTimeout(() => {
            this.speechBubble.style.display = 'none';
        }, duration);
    }



    buildPromptDisplay(levelData) {
        const promptGoalText = document.getElementById('promptGoalText');
        if (!promptGoalText) return;

        // Clear existing content
        promptGoalText.innerHTML = '';

        // Build prompt from required pieces
        levelData.requiredPieces.forEach((piece, index) => {
            const span = document.createElement('span');
            span.dataset.pieceId = piece.id;
            span.textContent = piece.text;

            // Check if already collected
            if (this.collectedPieces.includes(piece.id)) {
                span.classList.add('collected');
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

        // Find the span with this piece ID and mark it as collected (green)
        const spans = promptGoalText.querySelectorAll('span');
        spans.forEach(span => {
            if (span.dataset.pieceId === pieceId) {
                span.classList.add('collected');
            }
        });
    }
}

// ===== GLOBAL FUNCTIONS =====
let game;
let txpHost;

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

function goToLevelSelect() {
    if (game) {
        game.isRunning = false;
        if (game.gameLoopId) {
            cancelAnimationFrame(game.gameLoopId);
        }
        game.clearLevel();
    }
    showLevelSelect();
}

// ===== TXP CLICK EASTER EGG =====
let txpClickTimeout = null;

function setupTXPClickHandler() {
    const txpElement = document.getElementById('txpHost');
    if (!txpElement) return;

    const aiJokes = [
        "Warum ging die KI zum Arzt? Sie hatte einen Bug! 🐛",
        "Was sagt eine KI beim Aufwachen? 'Guten Mor-gen!' 🌅",
        "Wie nennt man eine faule KI? Artificial Unintelligence! 😴",
        "Warum mag die KI keine Cookies? Sie bevorzugt Cache! 🍪",
        "Was ist der Lieblingssport einer KI? Neural Networking! 🏐",
        "Warum wurde die KI zum Lehrer? Sie hatte zu viele Trainings-Daten! 📚",
        "Was trinkt eine KI? Java-Script! ☕",
        "Warum ist die KI so ordentlich? Sie sortiert ihre Arrays! 📊"
    ];

    let lastJokeIndex = -1;

    txpElement.addEventListener('click', () => {
        if (!txpHost) return;

        let jokeIndex;
        do {
            jokeIndex = Math.floor(Math.random() * aiJokes.length);
        } while (jokeIndex === lastJokeIndex && aiJokes.length > 1);

        lastJokeIndex = jokeIndex;

        const speechBubble = document.getElementById('moSpeech');
        const speechText = document.getElementById('moSpeechText');

        if (speechBubble && speechText) {
            if (txpClickTimeout) {
                clearTimeout(txpClickTimeout);
            }

            if (game && game.isRunning) {
                game.showSpeech(aiJokes[jokeIndex], 5000);
            } else {
                speechText.textContent = aiJokes[jokeIndex];
                speechBubble.style.display = 'block';

                txpHost.startAnimation('talk');
                setTimeout(() => {
                    txpHost.startAnimation('stand');
                }, 4000);

                txpClickTimeout = setTimeout(() => {
                    speechBubble.style.display = 'none';
                    txpClickTimeout = null;
                }, 5000);
            }
        }
    });

    txpElement.style.cursor = 'pointer';
}

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

// ===== LEVEL CARD CLICK HANDLERS =====
function setupLevelCards() {
    const levelCards = document.querySelectorAll('.level-card');
    levelCards.forEach(card => {
        card.addEventListener('click', () => {
            const levelNum = parseInt(card.getAttribute('data-level'));
            startLevel(levelNum);
        });
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Schummeln erlaubt - Platformer initialized!');

    // Initialize TXP Host
    txpHost = new TXPHost();
    txpHost.enableTalking();

    // Easter Egg: TXP Click
    setupTXPClickHandler();

    // Intro Screen
    setupIntroScreen();

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
            let frameStr = String(i).padStart(5, '0');

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
});

