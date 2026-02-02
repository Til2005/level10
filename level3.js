// Level 3 - Gute Ergebnisse sind kein Zufall - Role Prompting Game Logic

// ===== CONSTANTS =====
const GAME_CONFIG = {
    playerSpeed: 7,
    jumpForce: -16,
    gravity: 0.6,
    groundLevel: 50,
    debugHitboxes: false,
    cameraOffset: 400,
    levelWidth: 5000,
    totalChallenges: 5,
    basePoints: 100,
    portalProximity: 120,

    // Base reference height für Skalierung (Design-Höhe)
    baseViewportHeight: 1080,

    // Berechne Skalierungsfaktor basierend auf Viewport-Höhe
    getScale() {
        const vh = window.innerHeight;
        // Minimum 0.65x für kleine Laptops, Maximum 1.0x für große Monitore
        return Math.max(0.65, Math.min(1.0, vh / this.baseViewportHeight));
    },

    // Skalierte Werte
    getPlayerSize() {
        const scale = this.getScale();
        return {
            width: Math.round(150 * scale),
            height: Math.round(150 * scale)
        };
    },

    getTxpSize() {
        const scale = this.getScale();
        return {
            width: Math.round(120 * scale),
            height: Math.round(120 * scale)
        };
    },

    getPortalSize() {
        const scale = this.getScale();
        return {
            frameSize: Math.round(140 * scale),
            ovalWidth: Math.round(120 * scale),
            ovalHeight: Math.round(160 * scale)
        };
    },

    // Verhältnisbasierte Y-Positionen (Prozent der Viewport-Höhe)
    getGamePositions() {
        const vh = window.innerHeight;
        const scale = this.getScale();

        // Alles relativ zur Viewport-Höhe
        return {
            groundY: vh * 0.75,  // 75% der Höhe
            playerY: vh * 0.50,  // 50% der Höhe
            txpY: vh * 0.75 - this.getTxpSize().height,  // Auf dem Boden
            portalY: vh * 0.38,  // 38% der Höhe
            platformHeight: Math.round(50 * scale)
        };
    }
};

// ===== ANIMATION PATHS =====
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

// ===== CHALLENGE DATA - 5 Challenges =====
const CHALLENGE_DATA = {
    1: {
        name: "Der Koch",
        scenario: "Du brauchst ein 3-Gänge-Menü für deine Gäste. Du willst die KI um Hilfe bitten.",
        portals: [
            { role: "Küchenchef", image: "assets/level3/byteman_koch.png", correct: true },
            { role: "Buchhalter", image: "assets/level3/byteman_buchhalter.png", correct: false },
            { role: "Mechaniker", image: "assets/level3/byteman_mechaniker.png", correct: false }
        ],
        txpMessages: [
            "Willkommen bei Level 3! Hier lernst du, warum Rollen in Prompts wichtig sind.",
            "In diesem Szenario brauchst du Hilfe beim Kochen eines 3-Gänge-Menüs.",
            "Lauf nach rechts und wähle das Portal mit der richtigen Rolle. Drücke E, um ein Portal zu betreten!",
            "Tipp: Wer wäre der beste Experte für diese Aufgabe?"
        ],
        wrongHint: "Ein Buchhalter oder Mechaniker kann kein Menü kochen! Versuche es mit jemandem, der sich in der Küche auskennt.",
        educational: {
            roleImage: "assets/level3/byteman_koch.png",
            roleName: "Küchenchef",
            explanation: "Ein Küchenchef hat das Fachwissen über Zutaten, Zubereitungstechniken und Menüplanung. Wenn du die KI bittest, sich wie ein Küchenchef zu verhalten, bekommst du fachlich fundierte Antworten.",
            promptWithout: "Erstelle ein 3-Gänge-Menü für Gäste.",
            promptWith: "Du bist ein erfahrener Küchenchef. Erstelle ein 3-Gänge-Menü für Gäste.",
            resultWithout: "Allgemeine Vorschläge, evtl. unpassende Kombinationen, wenig Fachtiefe.",
            resultWith: "Professionelles Menü mit abgestimmten Gängen, Zubereitungstipps und Weinempfehlungen.",
            takeaway: "Durch die Zuweisung einer Rolle erhält die KI einen klaren Kontext. Sie 'denkt' dann wie ein Experte auf diesem Gebiet und liefert deutlich bessere, fachspezifische Ergebnisse."
        }
    },
    2: {
        name: "Der Projektmanager",
        scenario: "Du musst einen strukturierten Projektplan mit klaren Verantwortlichkeiten erstellen.",
        portals: [
            { role: "Gärtner", image: "assets/level3/byteman_gärtner.png", correct: false },
            { role: "Projektmanager", image: "assets/level3/byteman_projektmanager.png", correct: true },
            { role: "Musiker", image: "assets/level3/byteman_musiker.png", correct: false }
        ],
        txpMessages: [
            "Super gemacht! Nächstes Szenario:",
            "Du brauchst einen strukturierten Projektplan. Welche Rolle passt am besten?",
            "Denke daran: Wer plant normalerweise Projekte professionell?"
        ],
        wrongHint: "Ein Gärtner oder Musiker hat keine Erfahrung mit Projektplanung! Wähle jemanden mit Organisationstalent.",
        educational: {
            roleImage: "assets/level3/byteman_projektmanager.png",
            roleName: "Projektmanager",
            explanation: "Ein Projektmanager kennt Methoden wie Gantt-Charts, Meilensteine und RACI-Matrizen. Mit dieser Rolle liefert die KI professionelle Projektstrukturpläne.",
            promptWithout: "Erstelle einen Projektplan.",
            promptWith: "Du bist ein erfahrener Projektmanager. Erstelle einen strukturierten Projektplan mit klaren Verantwortlichkeiten.",
            resultWithout: "Eine einfache ToDo-Liste ohne Struktur oder Zeitplanung.",
            resultWith: "Strukturierter Plan mit Phasen, Meilensteinen, Verantwortlichkeiten und Zeitrahmen.",
            takeaway: "Je spezifischer die Rolle, desto strukturierter und fachlich korrekter ist das Ergebnis. Ein 'Projektmanager' liefert bessere Pläne als eine allgemeine Anfrage."
        }
    },
    3: {
        name: "Der Roboter-Techniker",
        scenario: "Du brauchst Sicherheitshinweise für die Programmierung eines Industrieroboters.",
        portals: [
            { role: "Journalist", image: "assets/level3/byte_journalist.png", correct: false },
            { role: "Roboter-Techniker", image: "assets/level3/byteman_industrieroboter.png", correct: true },
            { role: "Designer", image: "assets/level3/byteman_designer.png", correct: false },
            { role: "Tierarzt", image: "assets/level3/byteman_tierarzt.png", correct: false }
        ],
        txpMessages: [
            "Jetzt wird es technischer!",
            "Du brauchst Sicherheitshinweise für Roboter-Programmierung.",
            "Hier gibt es 4 Portale - nur eines ist richtig!"
        ],
        wrongHint: "Sicherheitshinweise für Roboter erfordern technisches Fachwissen! Wähle jemanden aus der Robotik.",
        educational: {
            roleImage: "assets/level3/byteman_industrieroboter.png",
            roleName: "Roboter-Techniker",
            explanation: "Ein Roboter-Techniker kennt Sicherheitsprotokolle, Not-Aus-Systeme und Programmierstandards für Industrieroboter. Diese Expertise fehlt bei anderen Rollen komplett.",
            promptWithout: "Gib mir Sicherheitshinweise für Roboter-Programmierung.",
            promptWith: "Du bist ein erfahrener Roboter-Techniker mit 10 Jahren Erfahrung in der Industrierobotik. Erstelle Sicherheitshinweise für die Programmierung eines Industrieroboters.",
            resultWithout: "Allgemeine, oberflächliche Hinweise ohne Branchen-Spezifik.",
            resultWith: "Detaillierte Sicherheitsprotokolle nach ISO 10218, Not-Aus-Prozeduren, Gefahrenbereiche und Best Practices.",
            takeaway: "Bei sicherheitskritischen Themen ist die richtige Rolle besonders wichtig. Ein Experte liefert branchenspezifische Standards und Normen, die ein Generalist nicht kennt."
        }
    },
    4: {
        name: "Der Software-Entwickler",
        scenario: "Du brauchst einen Python-Code für eine Datenbank-Abfrage mit Fehlerbehandlung.",
        portals: [
            { role: "Gärtner", image: "assets/level3/byteman_gärtner.png", correct: false },
            { role: "Software-Entwickler", image: "assets/level3/byteman_softwareentwickler.png", correct: true },
            { role: "Historiker", image: "assets/level3/byteman_historik.png", correct: false },
            { role: "Designer", image: "assets/level3/byteman_designer.png", correct: false }
        ],
        txpMessages: [
            "Gut gemacht! Weiter geht's.",
            "Jetzt brauchst du funktionierenden Python-Code.",
            "Wer schreibt normalerweise professionellen Code?"
        ],
        wrongHint: "Nur ein Software-Entwickler kann professionellen, funktionierenden Code schreiben!",
        educational: {
            roleImage: "assets/level3/byteman_softwareentwickler.png",
            roleName: "Software-Entwickler",
            explanation: "Ein Software-Entwickler kennt Best Practices, Design Patterns und Fehlerbehandlung. Der Code wird sauber, dokumentiert und produktionsreif.",
            promptWithout: "Schreibe Python-Code für eine Datenbank-Abfrage.",
            promptWith: "Du bist ein Senior Python-Entwickler. Schreibe einen Python-Code für eine Datenbank-Abfrage mit Fehlerbehandlung, Logging und Connection Pooling.",
            resultWithout: "Einfacher Code ohne Fehlerbehandlung, ohne Kommentare, möglicherweise unsicher.",
            resultWith: "Professioneller Code mit Try-Except, Logging, Connection Pooling, Type Hints und Docstrings.",
            takeaway: "Beim Programmieren mit KI macht die Rolle einen enormen Unterschied. Ein 'Senior Entwickler' liefert produktionsreifen Code, während eine allgemeine Anfrage oft nur Beispielcode ergibt."
        }
    },
    5: {
        name: "Der Journalist",
        scenario: "Du musst einen objektiven, faktenbasierten Nachrichtenartikel über ein komplexes Ereignis schreiben.",
        portals: [
            { role: "Koch", image: "assets/level3/byteman_koch.png", correct: false },
            { role: "Musiker", image: "assets/level3/byteman_musiker.png", correct: false },
            { role: "Journalist", image: "assets/level3/byte_journalist.png", correct: true },
            { role: "Mechaniker", image: "assets/level3/byteman_mechaniker.png", correct: false },
            { role: "Tierarzt", image: "assets/level3/byteman_tierarzt.png", correct: false }
        ],
        txpMessages: [
            "Letzte Challenge! Hier wird's knifflig.",
            "Du musst einen objektiven Nachrichtenartikel schreiben.",
            "5 Portale - aber nur eine Rolle passt perfekt. Wer schreibt professionelle Artikel?"
        ],
        wrongHint: "Ein objektiver Nachrichtenartikel erfordert journalistische Fähigkeiten! Wer kennt sich mit Recherche, Objektivität und Nachrichtenstruktur aus?",
        educational: {
            roleImage: "assets/level3/byte_journalist.png",
            roleName: "Journalist",
            explanation: "Ein Journalist versteht die Prinzipien von Objektivität, Faktentreue und der umgekehrten Pyramide (wichtigste Infos zuerst). Er weiß, wie man Quellen zitiert und ausgewogen berichtet.",
            promptWithout: "Schreibe einen Artikel über ein Ereignis.",
            promptWith: "Du bist ein erfahrener Journalist. Schreibe einen objektiven, faktenbasierten Nachrichtenartikel mit Überschrift, Lead-Absatz und strukturiertem Aufbau nach journalistischen Standards.",
            resultWithout: "Subjektiver, unstrukturierter Text ohne Quellenangaben oder klare Nachrichtenstruktur.",
            resultWith: "Professioneller Artikel mit 5-W-Fragen, Zitaten, objektiver Sprache und umgekehrter Pyramide.",
            takeaway: "Die richtige Rolle vermittelt nicht nur Fachwissen, sondern auch professionelle Standards und Methoden. Ein Journalist liefert objektive Berichterstattung, während andere Rollen subjektiv oder unsachlich schreiben würden."
        }
    }
};

// ===== MO MAN PLAYER CLASS =====
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

    constructor(gameArea, startX = 100, startY = 0) {
        this.gameArea = gameArea;
        this.element = document.getElementById('moPlayer');
        this.img = document.getElementById('moPlayerImg');

        // Get dynamic size
        const size = GAME_CONFIG.getPlayerSize();
        this.width = size.width;
        this.height = size.height;

        // Apply size to element
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;

        this.x = startX;
        this.y = startY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.isGrounded = false;

        this.currentAnimation = 'stand';
        this.currentFrame = 0;
        this.animationInterval = null;

        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.facingRight = true;

        this.startAnimation('stand');
        this.updatePosition();
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
        }
    }

    update(deltaTime, platforms) {
        // Horizontal movement
        if (this.isMovingLeft) {
            this.velocityX = -GAME_CONFIG.playerSpeed;
            this.facingRight = false;
        } else if (this.isMovingRight) {
            this.velocityX = GAME_CONFIG.playerSpeed;
            this.facingRight = true;
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

        // Prevent moving left of level start
        if (this.x < 0) this.x = 0;

        const previousBottom = this.y + this.height;

        // Apply gravity
        this.velocityY += GAME_CONFIG.gravity * deltaTime;
        this.y += this.velocityY * deltaTime;

        // Platform collision
        this.isGrounded = false;

        for (const platform of platforms) {
            const playerBox = this.getHitbox();
            const platformBox = {
                left: platform.x,
                right: platform.x + platform.width,
                top: platform.y,
                bottom: platform.y + platform.height
            };

            if (
                playerBox.right > platformBox.left &&
                playerBox.left < platformBox.right &&
                playerBox.bottom >= platformBox.top &&
                playerBox.bottom <= platformBox.bottom &&
                previousBottom <= platformBox.top &&
                this.velocityY > 0
            ) {
                this.y = platformBox.top - this.height;
                this.velocityY = 0;
                this.isGrounded = true;
                this.isJumping = false;

                if (this.velocityX !== 0) {
                    this.startAnimation('run');
                } else {
                    this.startAnimation('stand');
                }
                break;
            }
        }

        // Death if fall too low (dynamisch basierend auf Viewport)
        const deathY = window.innerHeight * 0.9; // 90% der Viewport-Höhe
        if (this.y > deathY) {
            return 'death';
        }

        this.updatePosition();
        return null;
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    getHitbox() {
        const hitboxWidth = this.width * 0.6;
        return {
            left: this.x + (this.width - hitboxWidth) / 2,
            right: this.x + (this.width + hitboxWidth) / 2,
            top: this.y,
            bottom: this.y + this.height,
            centerX: this.x + this.width / 2,
            centerY: this.y + this.height / 2
        };
    }

    hide() {
        this.element.style.display = 'none';
    }

    show() {
        this.element.style.display = 'block';
        this.updatePosition();
    }

    reset(startX, startY) {
        this.x = startX;
        this.y = startY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.isGrounded = false;
        this.facingRight = true;
        this.startAnimation('stand');
        this.updatePosition();
        this.show();
    }

    destroy() {
        this.stopAnimation();
    }
}

// ===== PLATFORM CLASS (Simplified - green ground only) =====
class Platform {
    constructor(gameArea, x, y, width, height) {
        this.gameArea = gameArea;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.createElement();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'platform green-platform';
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;

        document.getElementById('platformsContainer').appendChild(this.element);
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// ===== CAMERA CLASS (extended for portalsContainer) =====
class Camera {
    constructor(gameArea) {
        this.gameArea = gameArea;
        this.x = 0;
        this.targetX = 0;
    }

    follow(player) {
        this.targetX = player.x - GAME_CONFIG.cameraOffset;
        this.targetX = Math.max(0, this.targetX);
        this.targetX = Math.min(GAME_CONFIG.levelWidth - this.gameArea.offsetWidth, this.targetX);

        // Smooth camera movement - höhere Smoothness für weniger Ruckeln
        this.x += (this.targetX - this.x) * 0.15;
    }

    apply(player) {
        const containers = [
            document.getElementById('platformsContainer'),
            document.getElementById('portalsContainer')
        ];

        containers.forEach(container => {
            if (container) {
                container.style.transform = `translateX(${-this.x}px)`;
            }
        });

        // Apply to player
        const moPlayer = document.getElementById('moPlayer');
        if (moPlayer && player) {
            const scaleX = player.facingRight ? 1 : -1;
            moPlayer.style.transform = `translateX(${-this.x}px) scaleX(${scaleX})`;
        }
    }
}

// ===== PORTAL CLASS (New for Level 3) =====
class Portal {
    constructor(gameArea, x, y, data, index) {
        this.gameArea = gameArea;
        this.x = x;
        this.y = y;
        this.role = data.role;
        this.image = data.image;
        this.isCorrect = data.correct;
        this.index = index;
        this.isActive = false;

        // Get skalierte Größe
        const portalSize = GAME_CONFIG.getPortalSize();
        this.width = portalSize.frameSize;
        this.frameSize = portalSize.frameSize;
        this.ovalWidth = portalSize.ovalWidth;
        this.ovalHeight = portalSize.ovalHeight;
        this.totalHeight = this.frameSize + this.ovalHeight + 60; // frame + oval + label + margins

        this.createElement();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'portal';
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        // Interaction prompt (hidden by default) - OVER the frame now
        this.interactPrompt = document.createElement('div');
        this.interactPrompt.className = 'portal-interact-prompt';
        this.interactPrompt.textContent = 'Drücke [E]';
        this.interactPrompt.style.display = 'none';

        // Picture frame with character image
        const frame = document.createElement('div');
        frame.className = 'portal-frame';
        frame.style.width = `${this.frameSize}px`;
        frame.style.height = `${this.frameSize}px`;

        if (this.image) {
            const img = document.createElement('img');
            img.src = this.image;
            img.className = 'portal-character-image';
            frame.appendChild(img);
        }

        // Oval portal with particles
        const oval = document.createElement('div');
        oval.className = 'portal-oval';
        oval.style.width = `${this.ovalWidth}px`;
        oval.style.height = `${this.ovalHeight}px`;

        // Add particle elements
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'portal-particle';
            particle.style.animationDelay = `${i * 0.2}s`;
            oval.appendChild(particle);
        }

        // Label with role name
        const label = document.createElement('div');
        label.className = 'portal-label';
        label.textContent = this.role;

        this.element.appendChild(this.interactPrompt);
        this.element.appendChild(frame);
        this.element.appendChild(oval);
        this.element.appendChild(label);

        document.getElementById('portalsContainer').appendChild(this.element);
    }

    checkProximity(player) {
        const playerCenterX = player.x + player.width / 2;
        const portalCenterX = this.x + this.width / 2;
        const distance = Math.abs(playerCenterX - portalCenterX);

        const wasActive = this.isActive;
        this.isActive = distance < GAME_CONFIG.portalProximity;

        if (this.isActive && !wasActive) {
            this.element.classList.add('active');
            this.interactPrompt.style.display = 'block';
        } else if (!this.isActive && wasActive) {
            this.element.classList.remove('active');
            this.interactPrompt.style.display = 'none';
        }

        return this.isActive;
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// ===== TXP NPC CLASS (Simplified for Level 3) =====
class TxpNpc {
    constructor(gameArea, x, y) {
        this.gameArea = gameArea;
        this.x = x;
        this.y = y;

        // Get skalierte Größe
        const txpSize = GAME_CONFIG.getTxpSize();
        this.width = txpSize.width;
        this.height = txpSize.height;
        this.proximityRange = 150;
        this.isPlayerNear = false;
        this.hasShownTutorial = false;
        this.tutorialStep = 0;
        this.tutorialMessages = [];

        this.element = document.getElementById('txpNpc');
        this.img = document.getElementById('txpNpcImg');
        this.speechElement = document.getElementById('txpNpcSpeech');
        this.speechText = document.getElementById('txpNpcSpeechText');

        this.currentAnimation = null;
        this.currentFrame = 0;
        this.animationInterval = null;
        this.facingRight = true;

        this.show();
        this.startAnimation('stand');
    }

    show() {
        if (this.element) {
            this.element.style.display = 'block';
            this.element.style.width = `${this.width}px`;
            this.element.style.height = `${this.height}px`;
            this.updatePosition();
        }
    }

    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
        this.stopAnimation();
        this.hideSpeech();
    }

    destroy() {
        this.hide();
        this.element = null;
        this.img = null;
        this.speechElement = null;
        this.speechText = null;
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
        if (this.img) {
            this.img.src = `${anim.path}${frameStr}.png`;
        }
    }

    updatePosition() {
        if (this.element) {
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
        }
    }

    setMessages(messages) {
        this.tutorialMessages = messages;
        this.tutorialStep = 0;
        this.hasShownTutorial = false;
    }

    checkProximity(player) {
        const distance = Math.abs(player.x - this.x);
        const wasNear = this.isPlayerNear;
        this.isPlayerNear = distance < this.proximityRange && Math.abs(player.y - this.y) < 100;

        // Face toward player
        if (player.x < this.x) {
            this.facingRight = false;
        } else {
            this.facingRight = true;
        }

        if (this.isPlayerNear && !wasNear && !this.hasShownTutorial) {
            this.showTutorial();
        }

        if (!this.isPlayerNear && wasNear) {
            this.hideSpeech();
            if (this.currentAnimation === 'talk') {
                this.startAnimation('stand');
            }
        }
    }

    showTutorial() {
        if (this.tutorialStep < this.tutorialMessages.length) {
            this.showSpeech(this.tutorialMessages[this.tutorialStep]);
            this.startAnimation('talk');
        } else {
            this.hasShownTutorial = true;
            this.hideSpeech();
            this.startAnimation('stand');
        }
    }

    advanceTutorial() {
        if (this.isPlayerNear) {
            if (this.hasShownTutorial) {
                this.tutorialStep = 0;
                this.hasShownTutorial = false;
                this.showSpeech(this.tutorialMessages[this.tutorialStep]);
                this.startAnimation('talk');
            } else {
                this.tutorialStep++;
                if (this.tutorialStep < this.tutorialMessages.length) {
                    this.showSpeech(this.tutorialMessages[this.tutorialStep]);
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
            this.speechElement.style.left = `${this.x - 140}px`;
            this.speechElement.style.top = `${this.y - 150}px`;
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
            const scaleX = this.facingRight ? 1 : -1;
            this.img.style.transform = `scaleX(${scaleX})`;
            this.element.style.transform = `translateX(${-camera.x}px)`;
        }
        if (this.speechElement) {
            this.speechElement.style.transform = `translateX(${-camera.x}px)`;
        }
    }
}

// ===== FLOW CANVAS ANIMATION (Background particles) =====
class FlowCanvasAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;

        this.resize();
        this.init();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // Create floating particles
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 1,
                color: ['#67C7FF', '#A86AFF', '#F5C03B'][Math.floor(Math.random() * 3)],
                alpha: Math.random() * 0.5 + 0.2
            });
        }
    }

    start() {
        const animate = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around
                if (p.x < 0) p.x = this.canvas.width;
                if (p.x > this.canvas.width) p.x = 0;
                if (p.y < 0) p.y = this.canvas.height;
                if (p.y > this.canvas.height) p.y = 0;

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.alpha;
                this.ctx.fill();
            });

            // Draw connections between nearby particles
            this.ctx.globalAlpha = 0.1;
            this.ctx.strokeStyle = '#67C7FF';
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.stroke();
                    }
                }
            }

            this.ctx.globalAlpha = 1;
            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// ===== MAIN GAME CLASS =====
class RolePromptingGame {
    constructor() {
        this.gameArea = document.getElementById('gameArea');

        // Game state
        this.currentScreen = 'intro';
        this.currentChallenge = 1;
        this.isRunning = false;
        this.isPaused = false;
        this.isDead = false;
        this.totalPoints = 0;
        this.completedChallenges = [];

        // Game objects
        this.player = null;
        this.platforms = [];
        this.portals = [];
        this.camera = null;
        this.txpNpc = null;

        // UI
        this.flowCanvas = null;

        // Game loop
        this.lastTime = 0;
        this.gameLoopId = null;

        // Input
        this.keys = {};
        this.setupInputHandlers();

        // Resize handler
        this.setupResizeHandler();

        // Load progress
        this.loadProgress();

        // Init
        this.init();
    }

    async init() {
        this.showScreen('introScreen');

        // Initialize background animation
        const canvas = document.getElementById('flowCanvas');
        if (canvas) {
            this.flowCanvas = new FlowCanvasAnimation(canvas);
            this.flowCanvas.start();
        }

        this.setupIntroHandlers();
        this.updateRankBadge();
    }

    // ===== INTRO SCREEN =====
    setupIntroHandlers() {
        const introContent = document.querySelector('.intro-content');
        const pressKeyElement = document.getElementById('pressKey');

        const startGame = async () => {
            document.removeEventListener('keydown', onKeyPress);
            if (introContent) introContent.removeEventListener('click', onIntroClick);
            if (pressKeyElement) pressKeyElement.removeEventListener('click', onPressKeyClick);

            if (this.flowCanvas) this.flowCanvas.stop();
            await this.startLoading();
        };

        const onKeyPress = () => startGame();
        const onIntroClick = () => startGame();
        const onPressKeyClick = (e) => { e.stopPropagation(); startGame(); };

        document.addEventListener('keydown', onKeyPress);
        if (introContent) introContent.addEventListener('click', onIntroClick);
        if (pressKeyElement) {
            pressKeyElement.addEventListener('click', onPressKeyClick);
            pressKeyElement.style.cursor = 'pointer';
        }
    }

    // ===== LOADING SCREEN =====
    async startLoading() {
        this.showScreen('loadingScreen');

        // Preload MoMan + TXP sprites
        await MoManPlayer.preloadFrames();

        // Also preload TXP frames
        const txpPromises = [];
        for (const animName of ['stand', 'talk']) {
            const anim = TXP_ANIMATIONS[animName];
            for (let i = 0; i < anim.frames; i++) {
                const img = new Image();
                const paddedNumber = String(i).padStart(5, '0');
                img.src = `${anim.path}${paddedNumber}.png`;
                txpPromises.push(new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                }));
            }
        }
        await Promise.all(txpPromises);

        // Simulate loading bar
        const loadingBar = document.getElementById('loadingBar');
        const loadingText = document.getElementById('loadingText');

        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                setTimeout(() => this.showLevelSelect(), 500);
            }
            if (loadingBar) loadingBar.style.width = progress + '%';
            if (loadingText) loadingText.textContent = Math.floor(progress) + '%';
        }, 100);
    }

    // ===== LEVEL SELECT =====
    showLevelSelect() {
        this.showScreen('levelSelectScreen');
        this.updateLevelSelectUI();
        this.setupLevelClickHandlers();
        this.updateRankBadge();

        // Stop game if running
        this.stopGameLoop();
        this.isRunning = false;
    }

    updateLevelSelectUI() {
        const totalPointsDisplay = document.getElementById('totalPointsDisplay');
        const currentRankDisplay = document.getElementById('currentRankDisplay');

        if (totalPointsDisplay) {
            totalPointsDisplay.textContent = `${this.totalPoints} / 500`;
        }

        if (currentRankDisplay) {
            currentRankDisplay.textContent = this.calculateTotalRank();
        }

        for (let i = 1; i <= GAME_CONFIG.totalChallenges; i++) {
            const cardElement = document.querySelector(`.challenge-card[data-level="${i}"]`);
            if (!cardElement) continue;

            const isUnlocked = this.isChallengeUnlocked(i);
            const isCompleted = this.isChallengeCompleted(i);

            // Price tag
            const priceTag = cardElement.querySelector('.challenge-price-tag');
            if (priceTag) {
                priceTag.style.display = isCompleted ? 'block' : 'none';
            }

            if (isUnlocked) {
                cardElement.classList.remove('locked');
                cardElement.classList.add('unlocked');
                cardElement.style.opacity = '1';
                cardElement.style.filter = 'none';
                cardElement.style.cursor = 'pointer';
                cardElement.style.pointerEvents = 'auto';

                const statusElement = cardElement.querySelector('.challenge-status');
                if (statusElement && !isCompleted) {
                    statusElement.textContent = '\u25B6 Starten';
                    statusElement.style.color = 'var(--success-color)';
                }
            } else {
                cardElement.classList.add('locked');
                cardElement.classList.remove('unlocked');
                cardElement.style.opacity = '0.5';
                cardElement.style.filter = 'grayscale(80%)';
                cardElement.style.cursor = 'not-allowed';
                cardElement.style.pointerEvents = 'none';

                const statusElement = cardElement.querySelector('.challenge-status');
                if (statusElement) {
                    statusElement.textContent = '\uD83D\uDD12 Gesperrt';
                    statusElement.style.color = 'rgba(255, 255, 255, 0.5)';
                }
            }

            if (isCompleted) {
                cardElement.classList.add('completed');
                const statusElement = cardElement.querySelector('.challenge-status');
                if (statusElement) {
                    statusElement.textContent = '\u2713 Abgeschlossen';
                    statusElement.style.color = 'var(--success-color)';
                }
            }
        }
    }

    isChallengeUnlocked(challengeNum) {
        if (challengeNum === 1) return true;
        return this.isChallengeCompleted(challengeNum - 1);
    }

    isChallengeCompleted(challengeNum) {
        return this.completedChallenges && this.completedChallenges.includes(challengeNum);
    }

    setupLevelClickHandlers() {
        const challengeCards = document.querySelectorAll('.challenge-card');
        challengeCards.forEach(cardElement => {
            // Remove old listeners by cloning
            const newCard = cardElement.cloneNode(true);
            cardElement.parentNode.replaceChild(newCard, cardElement);

            newCard.addEventListener('click', () => {
                const level = parseInt(newCard.dataset.level);
                if (this.isChallengeUnlocked(level)) {
                    this.startChallenge(level);
                }
            });
        });
    }

    // ===== START CHALLENGE =====
    startChallenge(challengeNum) {
        this.currentChallenge = challengeNum;
        this.isDead = false;

        // Clean up previous game objects
        this.cleanupGameObjects();

        // Show game screen
        this.showScreen('gameScreen');

        // Show HUD
        const scenarioDisplay = document.getElementById('scenarioDisplay');
        const scenarioText = document.getElementById('scenarioText');
        if (scenarioDisplay && scenarioText) {
            const challengeData = CHALLENGE_DATA[challengeNum];
            scenarioDisplay.style.display = 'flex';
            scenarioText.textContent = challengeData.scenario;
        }

        // Show controls for challenge 1
        const controlsDisplay = document.getElementById('controlsDisplay');
        if (controlsDisplay) {
            controlsDisplay.style.display = challengeNum === 1 ? 'block' : 'none';
        }

        // Hide death overlay
        const deathOverlay = document.getElementById('deathOverlay');
        if (deathOverlay) deathOverlay.style.display = 'none';

        // Create game objects
        this.createGameObjects(challengeNum);

        // Start game loop
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }

    createGameObjects(challengeNum) {
        const challengeData = CHALLENGE_DATA[challengeNum];
        const gameArea = document.getElementById('gameArea');

        // Get verhältnisbasierte Positionen
        const positions = GAME_CONFIG.getGamePositions();

        // Create ground platform
        this.platforms = [
            new Platform(gameArea, 0, positions.groundY, 5000, positions.platformHeight)
        ];

        // Create portals - evenly distributed
        const portalCount = challengeData.portals.length;
        const startX = 800;
        const spacing = (4000 - startX) / (portalCount + 1);

        this.portals = challengeData.portals.map((portalData, index) => {
            const portalX = startX + spacing * (index + 1) - 70; // center portal
            return new Portal(gameArea, portalX, positions.portalY, portalData, index);
        });

        // Create player
        this.player = new MoManPlayer(gameArea, 100, positions.playerY);
        this.player.show();

        // Create camera
        this.camera = new Camera(gameArea);

        // Create TXP NPC
        this.txpNpc = new TxpNpc(gameArea, 200, positions.txpY);
        this.txpNpc.setMessages(challengeData.txpMessages);
    }

    cleanupGameObjects() {
        // Destroy platforms
        this.platforms.forEach(p => p.destroy());
        this.platforms = [];

        // Destroy portals
        this.portals.forEach(p => p.destroy());
        this.portals = [];

        // Destroy TXP
        if (this.txpNpc) {
            this.txpNpc.destroy();
            this.txpNpc = null;
        }

        // Hide player
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }

        // Clear containers
        const platformsContainer = document.getElementById('platformsContainer');
        if (platformsContainer) platformsContainer.innerHTML = '';
        const portalsContainer = document.getElementById('portalsContainer');
        if (portalsContainer) portalsContainer.innerHTML = '';

        this.stopGameLoop();
    }

    // ===== GAME LOOP =====
    gameLoop(currentTime) {
        if (!this.isRunning) return;

        // Besseres Frame-Timing für smootheres Gameplay
        const deltaTime = Math.min((currentTime - this.lastTime) / 16.67, 2); // Cap at 2x statt 3x
        this.lastTime = currentTime;

        if (!this.isPaused && !this.isDead) {
            this.update(deltaTime);
        }

        this.gameLoopId = requestAnimationFrame((t) => this.gameLoop(t));
    }

    stopGameLoop() {
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
            this.gameLoopId = null;
        }
    }

    update(deltaTime) {
        if (!this.player || !this.camera) return;

        // Update player
        const platformData = this.platforms.map(p => ({
            x: p.x, y: p.y, width: p.width, height: p.height
        }));

        const result = this.player.update(deltaTime, platformData);

        if (result === 'death') {
            this.onPlayerDeath("Du bist gefallen! Versuche es nochmal.");
            return;
        }

        // Update camera
        this.camera.follow(this.player);
        this.camera.apply(this.player);

        // Update TXP
        if (this.txpNpc) {
            this.txpNpc.checkProximity(this.player);
            this.txpNpc.applyCamera(this.camera);
        }

        // Check portal proximity
        for (const portal of this.portals) {
            portal.checkProximity(this.player);
        }
    }

    // ===== PORTAL INTERACTION =====
    interactWithPortal() {
        const activePortal = this.portals.find(p => p.isActive);
        if (!activePortal) return;

        if (activePortal.isCorrect) {
            // Correct portal!
            this.onChallengeSuccess();
        } else {
            // Wrong portal!
            const challengeData = CHALLENGE_DATA[this.currentChallenge];
            this.onPlayerDeath(challengeData.wrongHint);
        }
    }

    onPlayerDeath(hintText) {
        this.isDead = true;

        const deathOverlay = document.getElementById('deathOverlay');
        const deathHintText = document.getElementById('deathHintText');
        if (deathOverlay) deathOverlay.style.display = 'flex';
        if (deathHintText) deathHintText.textContent = hintText;
    }

    respawn() {
        this.isDead = false;

        const deathOverlay = document.getElementById('deathOverlay');
        if (deathOverlay) deathOverlay.style.display = 'none';

        // Get verhältnisbasierte Position
        const positions = GAME_CONFIG.getGamePositions();

        // Reset player position
        if (this.player) {
            this.player.reset(100, positions.playerY);
        }

        // Reset TXP
        if (this.txpNpc) {
            this.txpNpc.hasShownTutorial = false;
            this.txpNpc.tutorialStep = 0;
        }

        // Reset portal states
        this.portals.forEach(p => {
            p.isActive = false;
            p.element.classList.remove('active');
            p.interactPrompt.style.display = 'none';
        });
    }

    // ===== CHALLENGE SUCCESS =====
    onChallengeSuccess() {
        this.isRunning = false;
        this.stopGameLoop();

        // Award points (nur einmalig pro Challenge)
        const wasAlreadyCompleted = this.isChallengeCompleted(this.currentChallenge);
        if (!wasAlreadyCompleted) {
            this.totalPoints += 100;
            // Cap bei 500 Punkten
            this.totalPoints = Math.min(this.totalPoints, 500);
        }

        // Mark completed
        this.markChallengeCompleted(this.currentChallenge);

        // Show complete screen
        this.showChallengeComplete();
    }

    showChallengeComplete() {
        this.showScreen('challengeCompleteScreen');

        const challengeData = CHALLENGE_DATA[this.currentChallenge];
        const edu = challengeData.educational;

        // Correct Role Display
        const correctRoleDisplay = document.getElementById('correctRoleDisplay');
        if (correctRoleDisplay) {
            const imageHtml = edu.roleImage ? `<img src="${edu.roleImage}" class="role-image" />` : '';
            correctRoleDisplay.innerHTML = `
                <h3>Richtige Rolle</h3>
                ${imageHtml}
                <div class="role-name">${edu.roleName}</div>
                <div class="role-explanation">${edu.explanation}</div>
            `;
        }

        // Prompt Comparison
        const promptComparison = document.getElementById('promptComparison');
        if (promptComparison) {
            promptComparison.innerHTML = `
                <div class="prompt-comparison-card without-role">
                    <h4>Ohne Rolle</h4>
                    <div class="prompt-text">${edu.promptWithout}</div>
                    <div class="prompt-result">${edu.resultWithout}</div>
                </div>
                <div class="prompt-comparison-card with-role">
                    <h4>Mit Rolle</h4>
                    <div class="prompt-text">${edu.promptWith}</div>
                    <div class="prompt-result">${edu.resultWith}</div>
                </div>
            `;
        }

        // Learning Takeaway
        const learningTakeaway = document.getElementById('learningTakeaway');
        if (learningTakeaway) {
            learningTakeaway.innerHTML = `
                <h4>Lerneffekt</h4>
                <p>${edu.takeaway}</p>
            `;
        }

        // Update buttons
        const nextChallengeBtn = document.querySelector('.next-level-button');
        const menuButton = document.querySelector('.menu-button');

        if (this.currentChallenge >= GAME_CONFIG.totalChallenges) {
            if (nextChallengeBtn) nextChallengeBtn.style.display = 'none';
            if (menuButton) menuButton.style.margin = '0 auto';
        } else {
            if (nextChallengeBtn) nextChallengeBtn.style.display = 'flex';
            if (menuButton) menuButton.style.margin = '';
        }

        // Update rank badge
        this.updateRankBadge();

        // Hide HUD
        const scenarioDisplay = document.getElementById('scenarioDisplay');
        if (scenarioDisplay) scenarioDisplay.style.display = 'none';
    }

    // ===== SCREEN MANAGEMENT =====
    showScreen(screenId) {
        const screens = document.querySelectorAll('.game-screen');
        screens.forEach(screen => screen.classList.remove('active'));

        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
        }

        // Show/hide HUD
        const hudWrapper = document.querySelector('.hud-wrapper');
        if (hudWrapper) {
            hudWrapper.style.display = (screenId === 'gameScreen') ? 'flex' : 'none';
        }
    }

    // ===== RESIZE HANDLER =====
    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            // Debounce resize events
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.isRunning && this.currentScreen === 'gameScreen') {
                    this.handleResize();
                }
            }, 100);
        });
    }

    handleResize() {
        if (!this.player || !this.platforms.length || !this.portals.length || !this.txpNpc) {
            return;
        }

        // Get neue Positionen und Größen
        const positions = GAME_CONFIG.getGamePositions();
        const playerSize = GAME_CONFIG.getPlayerSize();
        const txpSize = GAME_CONFIG.getTxpSize();
        const portalSize = GAME_CONFIG.getPortalSize();

        // Update Player Größe und Position
        this.player.width = playerSize.width;
        this.player.height = playerSize.height;
        this.player.element.style.width = `${playerSize.width}px`;
        this.player.element.style.height = `${playerSize.height}px`;

        // Berechne neue Y basierend auf altem Verhältnis
        const oldGroundY = this.platforms[0].y;
        const oldPlayerRelativeY = oldGroundY - (this.player.y + this.player.height);
        this.player.y = positions.groundY - this.player.height - oldPlayerRelativeY;

        // Update Platform
        this.platforms[0].y = positions.groundY;
        this.platforms[0].height = positions.platformHeight;
        this.platforms[0].element.style.top = `${positions.groundY}px`;
        this.platforms[0].element.style.height = `${positions.platformHeight}px`;

        // Update TXP Größe und Position
        this.txpNpc.width = txpSize.width;
        this.txpNpc.height = txpSize.height;
        this.txpNpc.y = positions.txpY;
        this.txpNpc.element.style.width = `${txpSize.width}px`;
        this.txpNpc.element.style.height = `${txpSize.height}px`;
        this.txpNpc.updatePosition();

        // Update Portale Größe und Position
        this.portals.forEach(portal => {
            portal.y = positions.portalY;
            portal.width = portalSize.frameSize;
            portal.frameSize = portalSize.frameSize;
            portal.ovalWidth = portalSize.ovalWidth;
            portal.ovalHeight = portalSize.ovalHeight;

            // Update DOM elements
            const frame = portal.element.querySelector('.portal-frame');
            const oval = portal.element.querySelector('.portal-oval');
            if (frame) {
                frame.style.width = `${portalSize.frameSize}px`;
                frame.style.height = `${portalSize.frameSize}px`;
            }
            if (oval) {
                oval.style.width = `${portalSize.ovalWidth}px`;
                oval.style.height = `${portalSize.ovalHeight}px`;
            }
            portal.element.style.top = `${portal.y}px`;
        });

        // Force redraw
        this.player.updatePosition();
        if (this.camera) {
            this.camera.follow(this.player);
            this.camera.apply(this.player);
        }
    }

    // ===== INPUT HANDLERS =====
    setupInputHandlers() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            // Intro screen - any key to start (handled by setupIntroHandlers)

            // Game screen controls
            if (this.currentScreen === 'gameScreen' && this.isRunning) {
                if (this.isDead) {
                    if (e.key === 'r' || e.key === 'R') {
                        this.respawn();
                    }
                    return;
                }

                if (this.isPaused) {
                    if (e.key === 'Escape') {
                        this.togglePause();
                    }
                    return;
                }

                // Player movement
                if (this.player) {
                    if (e.key === 'ArrowLeft' || e.key === 'a') {
                        this.player.isMovingLeft = true;
                    }
                    if (e.key === 'ArrowRight' || e.key === 'd') {
                        this.player.isMovingRight = true;
                    }
                    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
                        e.preventDefault();
                        this.player.jump();
                    }
                }

                // E key - interact with portal or advance TXP dialog
                if (e.key === 'e' || e.key === 'E') {
                    // Check if TXP is talking first
                    if (this.txpNpc && this.txpNpc.isPlayerNear && !this.txpNpc.hasShownTutorial) {
                        this.txpNpc.advanceTutorial();
                    } else {
                        this.interactWithPortal();
                    }
                }

                // Escape - pause
                if (e.key === 'Escape') {
                    this.togglePause();
                }
            }

            // Escape in other screens
            if (this.currentScreen === 'gameScreen' && !this.isRunning) {
                if (e.key === 'Escape') {
                    this.togglePause();
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;

            if (this.player) {
                if (e.key === 'ArrowLeft' || e.key === 'a') {
                    this.player.isMovingLeft = false;
                }
                if (e.key === 'ArrowRight' || e.key === 'd') {
                    this.player.isMovingRight = false;
                }
            }
        });
    }

    togglePause() {
        const pauseMenu = document.getElementById('pauseMenu');
        if (!pauseMenu) return;

        this.isPaused = !this.isPaused;
        pauseMenu.style.display = this.isPaused ? 'flex' : 'none';
    }

    // ===== RANK SYSTEM =====
    calculateTotalRank() {
        if (this.totalPoints >= 500) return 'Gold';
        if (this.totalPoints >= 400) return 'Silber';
        if (this.totalPoints >= 300) return 'Bronze';
        return 'Kein Rang';
    }

    updateRankBadge() {
        const rankBadge = document.getElementById('rankBadge');
        const rankIcon = document.getElementById('rankIcon');
        const rankLabel = document.getElementById('rankLabel');

        if (!rankBadge || !rankIcon || !rankLabel) return;

        const rank = this.calculateTotalRank();

        if (rank === 'Kein Rang') {
            rankBadge.style.display = 'none';
            return;
        }

        rankBadge.style.display = 'flex';
        rankBadge.className = `rank-badge ${rank.toLowerCase()}`;
        rankLabel.textContent = rank;
        rankIcon.textContent = '';

        rankBadge.onclick = () => {
            rankBadge.classList.add('rank-badge-clicked');
            setTimeout(() => rankBadge.classList.remove('rank-badge-clicked'), 1000);
        };
    }

    // ===== PROGRESS MANAGEMENT =====
    markChallengeCompleted(challengeNum) {
        if (!this.completedChallenges.includes(challengeNum)) {
            this.completedChallenges.push(challengeNum);
        }

        this.saveProgress();
    }

    saveProgress() {
        const progress = {
            totalPoints: this.totalPoints,
            completedChallenges: this.completedChallenges,
            currentRank: this.calculateTotalRank()
        };
        localStorage.setItem('aiBytes_level3_progress', JSON.stringify(progress));
    }

    loadProgress() {
        const saved = localStorage.getItem('aiBytes_level3_progress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.totalPoints = progress.totalPoints || 0;
            this.completedChallenges = progress.completedChallenges || [];
        }
    }

    resetProgress() {
        localStorage.removeItem('aiBytes_level3_progress');
        this.totalPoints = 0;
        this.completedChallenges = [];
        location.reload();
    }
}

// ===== GLOBAL FUNCTIONS (Called from HTML) =====
function resumeGame() {
    if (window.gameInstance) {
        window.gameInstance.togglePause();
    }
}

function returnToLevelSelect() {
    if (window.gameInstance) {
        window.gameInstance.isPaused = false;
        const pauseMenu = document.getElementById('pauseMenu');
        if (pauseMenu) pauseMenu.style.display = 'none';

        window.gameInstance.showLevelSelect();
    }
}

function nextChallenge() {
    if (window.gameInstance) {
        const nextLevel = window.gameInstance.currentChallenge + 1;
        if (nextLevel <= GAME_CONFIG.totalChallenges) {
            window.gameInstance.startChallenge(nextLevel);
        } else {
            window.gameInstance.showLevelSelect();
        }
    }
}

function goToLevelSelectWithAnimation() {
    if (window.gameInstance) {
        window.gameInstance.showLevelSelect();
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new RolePromptingGame();
});
