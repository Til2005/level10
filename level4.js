// Level 4 - Bild-KI Puzzle Lauf Game Logic

// ===== CONSTANTS =====
const GAME_CONFIG = {
    playerSpeed: 12, // Increased from 8 for faster movement
    playerWidth: 150,
    playerHeight: 150,
    jumpForce: -20,
    gravity: 0.8,
    groundLevel: 50,
    cardSpeed: 0.8, // Base speed - very slow start for easier beginning
    cardSpawnInterval: 4000, // Spawn interval - very slow start for easier beginning
    cardWidth: 180,
    cardHeight: 220, // Image container + caption
    lives: 3,
    debugHitboxes: false // Toggle with 'H' key during gameplay
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
        peakFrames: [27, 28] // Peak of jump at frames 27_a and 28_b
    },
    speech: {
        path: 'Moman_speech_animation/Moman Rede_',
        frames: 12,
        speed: 80
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

// ===== IMAGE PROMPTS - GOOD AND BAD =====
// 10 Themen-Paare: jeweils guter und schlechter Prompt zum selben Thema
const IMAGE_PROMPTS = {
    good: [
        {
            description: "Industrieroboter schweißt Metallteile, Funkenflug, dramatische Beleuchtung, Weitwinkel",
            caption: "✓ Guter Prompt",
            icon: "🤖",
            image: "assets/level4/01_roboter_good.png"
        },
        {
            description: "Produktfotografie-Studio, weißer Infinity-Hintergrund, Softboxen, Hasselblad Kamera, minimalistisch",
            caption: "✓ Guter Prompt",
            icon: "📸",
            image: "assets/level4/02_fotostudio_good.png"
        },
        {
            description: "Qualitätskontrolle: Prüfstand mit LED-Ringlicht, Kabelbaum, Monitor zeigt KI-Analyse, technisch",
            caption: "✓ Guter Prompt",
            icon: "🔍",
            image: "assets/level4/03_qualitaetskontrolle_good.png"
        },
        {
            description: "KI-Trainings-Interface: Split-Screen, 3D-Grid mit Trainingsbildern, Datenströme, futuristisch",
            caption: "✓ Guter Prompt",
            icon: "🧠",
            image: "assets/level4/04_ki-training_good.png"
        },
        {
            description: "Nachhaltige Produktionshalle, große Fenster, natürliches Licht, Solarpanels, grüne Architektur",
            caption: "✓ Guter Prompt",
            icon: "🌱",
            image: "assets/level4/05_green-fabric_good.png"
        },
        {
            description: "Content-Studio: Greenscreen-Wand, Softbox-Setup, Sony Alpha Kamera auf Stativ, professionell",
            caption: "✓ Guter Prompt",
            icon: "🎬",
            image: "assets/level4/06_content_studio_good.png"
        },
        {
            description: "Inspektionsarbeitsplatz: Lupe, LED-Panel, Mikrokamera, Monitor mit Fehleranalyse, präzise Beleuchtung",
            caption: "✓ Guter Prompt",
            icon: "🔬",
            image: "assets/level4/07_arbeitsplatz_good.png"
        },
        {
            description: "Automatisierte Montage: Roboterarme montieren Elektronik-Platinen, sterile Umgebung, blaues Licht",
            caption: "✓ Guter Prompt",
            icon: "⚡",
            image: "assets/level4/08_montage_good.png"
        },
        {
            description: "Datenanalyse-Dashboard: 4K Monitor, Grid aus 100 Fehlerbildern, Server-Racks im Hintergrund, LEDs blinken",
            caption: "✓ Guter Prompt",
            icon: "💾",
            image: "assets/level4/09_datenanalyse_good.png"
        },
        {
            description: "Moderne Lagerhalle: Hochregale, fahrerlose Transportsysteme, Drohnen, strukturierte LED-Beleuchtung",
            caption: "✓ Guter Prompt",
            icon: "📦",
            image: "assets/level4/10_lagerhalle_good.png"
        }
    ],
    bad: [
        {
            description: "Roboter schweißt",
            caption: "✗ Schlechter Prompt",
            icon: "🤖",
            image: "assets/level4/01_roboter_bad.png"
        },
        {
            description: "Studio mit Kamera",
            caption: "✗ Schlechter Prompt",
            icon: "📸",
            image: "assets/level4/02_fotostudio_bad.png"
        },
        {
            description: "Qualitätskontrolle",
            caption: "✗ Schlechter Prompt",
            icon: "🔍",
            image: "assets/level4/03_qualitaetskontrolle_bad.png"
        },
        {
            description: "KI Training",
            caption: "✗ Schlechter Prompt",
            icon: "🧠",
            image: "assets/level4/04_ki-training_bad.png"
        },
        {
            description: "Grüne Fabrik",
            caption: "✗ Schlechter Prompt",
            icon: "🌱",
            image: "assets/level4/05_green-fabric_bad.png"
        },
        {
            description: "Irgendein Studio",
            caption: "✗ Schlechter Prompt",
            icon: "🎬",
            image: "assets/level4/06_content_studio_bad.png"
        },
        {
            description: "Arbeitsplatz mit Licht",
            caption: "✗ Schlechter Prompt",
            icon: "🔬",
            image: "assets/level4/07_arbeitsplatz_bad.png"
        },
        {
            description: "Roboter bauen Sachen",
            caption: "✗ Schlechter Prompt",
            icon: "⚡",
            image: "assets/level4/08_montage_bad.png"
        },
        {
            description: "Computer mit Daten",
            caption: "✗ Schlechter Prompt",
            icon: "💾",
            image: "assets/level4/09_datenanalyse_bad.png"
        },
        {
            description: "Lagerhalle",
            caption: "✗ Schlechter Prompt",
            icon: "📦",
            image: "assets/level4/10_lagerhalle_bad.png"
        }
    ]
};

// ===== TXP HOST CLASS =====
class TXPHost {
    constructor() {
        this.element = document.getElementById('txpHost');
        this.img = document.getElementById('txpHostImg');
        this.currentAnimation = null;
        this.currentFrame = 0;
        this.animationInterval = null;
        this.canTalk = false; // Only allow talk animation when game starts

        // Start with stand animation
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
        // Enable talk animation (called when game starts)
        this.canTalk = true;
    }

    talk(duration = 3000) {
        if (!this.canTalk) return; // Don't talk if game hasn't started

        this.startAnimation('talk');
        setTimeout(() => {
            this.startAnimation('stand');
        }, duration);
    }

    destroy() {
        this.stopAnimation();
    }
}

// ===== MO MAN PLAYER CLASS =====
class MoManPlayer {
    constructor(gameArea) {
        this.gameArea = gameArea;
        this.element = document.getElementById('moPlayer');
        this.img = document.getElementById('moPlayerImg');

        // Position and physics - start in center of game area
        this.x = this.gameArea.offsetWidth / 2;
        this.y = 0; // Relative to bottom
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.isGrounded = true;

        // Animation state
        this.currentAnimation = 'stand';
        this.currentFrame = 0;
        this.animationInterval = null;
        this.frameAccumulator = 0;

        // Movement state
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.lastDirection = null; // Track last pressed direction for priority
        this.facingRight = true;

        // Debug hitbox - always create, but hide/show based on config
        this.debugHitbox = null;
        this.createDebugHitbox();

        this.startAnimation('stand');
        this.updatePosition();
    }

    createDebugHitbox() {
        this.debugHitbox = document.createElement('div');
        this.debugHitbox.className = 'debug-hitbox player';
        this.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';

        const label = document.createElement('div');
        label.className = 'debug-hitbox-label';
        label.textContent = 'Mo Man';
        this.debugHitbox.appendChild(label);

        // Add to game area, not body, so it scales with container
        this.gameArea.appendChild(this.debugHitbox);
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

        // Handle special jump frames (27_a and 28_b)
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

    update(deltaTime) {
        // Horizontal movement - prioritize most recent input for instant direction change
        if (this.isMovingLeft && this.isMovingRight) {
            // Both keys pressed - use last pressed direction for priority
            if (this.lastDirection === 'left') {
                this.velocityX = -GAME_CONFIG.playerSpeed;
                if (this.facingRight) {
                    this.facingRight = false;
                    this.element.style.transform = `translateX(-50%) scaleX(-1)`;
                }
            } else if (this.lastDirection === 'right') {
                this.velocityX = GAME_CONFIG.playerSpeed;
                if (!this.facingRight) {
                    this.facingRight = true;
                    this.element.style.transform = `translateX(-50%) scaleX(1)`;
                }
            }
        } else if (this.isMovingLeft) {
            this.velocityX = -GAME_CONFIG.playerSpeed;
            if (this.facingRight) {
                this.facingRight = false;
                this.element.style.transform = `translateX(-50%) scaleX(-1)`;
            }
        } else if (this.isMovingRight) {
            this.velocityX = GAME_CONFIG.playerSpeed;
            if (!this.facingRight) {
                this.facingRight = true;
                this.element.style.transform = `translateX(-50%) scaleX(1)`;
            }
        } else {
            this.velocityX = 0;
            this.lastDirection = null; // Reset when no keys pressed
        }

        // Update animation based on movement
        if (this.isGrounded) {
            if (this.velocityX !== 0 && this.currentAnimation !== 'run') {
                this.startAnimation('run');
            } else if (this.velocityX === 0 && this.currentAnimation === 'run') {
                this.startAnimation('stand');
            }
        }

        this.x += this.velocityX;

        // Boundary checking - keep player within game area
        const gameAreaWidth = this.gameArea.offsetWidth;
        const minX = GAME_CONFIG.playerWidth / 2;
        const maxX = gameAreaWidth - GAME_CONFIG.playerWidth / 2;
        this.x = Math.max(minX, Math.min(maxX, this.x));

        // Vertical movement (jumping)
        if (!this.isGrounded) {
            this.velocityY += GAME_CONFIG.gravity; // Gravity pulls DOWN
            this.y -= this.velocityY; // Subtract to move UP (since y=0 is ground, higher y = higher position)

            // Landing
            if (this.y <= 0) {
                this.y = 0;
                this.velocityY = 0;
                this.isGrounded = true;
                this.isJumping = false;

                // Return to appropriate animation
                if (this.velocityX !== 0) {
                    this.startAnimation('run');
                } else {
                    this.startAnimation('stand');
                }
            }
        }

        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.bottom = `${GAME_CONFIG.groundLevel + this.y}px`;

        // Update debug hitbox
        if (GAME_CONFIG.debugHitboxes && this.debugHitbox) {
            const hitbox = this.getHitbox();

            // Position debug box using same method as player element (bottom-based)
            this.debugHitbox.style.left = `${hitbox.left}px`;
            this.debugHitbox.style.bottom = `${GAME_CONFIG.groundLevel + this.y}px`;
            this.debugHitbox.style.width = `${hitbox.right - hitbox.left}px`;
            this.debugHitbox.style.height = `${GAME_CONFIG.playerHeight}px`;
        }
    }

    getHitbox() {
        // Return hitbox in screen coordinates (using bottom as reference like CSS)
        // top and bottom are distances from BOTTOM of screen
        const screenBottom = GAME_CONFIG.groundLevel + this.y;
        const screenTop = screenBottom + GAME_CONFIG.playerHeight;

        // Narrower hitbox - reduce width by 40% for more forgiving gameplay
        const hitboxWidth = GAME_CONFIG.playerWidth * 0.6;

        return {
            left: this.x - hitboxWidth / 2,
            right: this.x + hitboxWidth / 2,
            bottomDist: screenBottom, // Distance from bottom of screen
            topDist: screenTop, // Distance from bottom of screen
            centerX: this.x,
            centerY: screenBottom + GAME_CONFIG.playerHeight / 2
        };
    }

    destroy() {
        this.stopAnimation();
        if (this.debugHitbox) {
            this.debugHitbox.remove();
        }
    }
}

// ===== FALLING CARD CLASS =====
class FallingCard {
    constructor(gameArea, imageData, quality, difficultyMultiplier = 1.0) {
        this.gameArea = gameArea;
        this.imageData = imageData; // { description, caption, icon }
        this.quality = quality; // 'good' or 'bad'
        this.collected = false;

        // Random spawn position - keep within game area boundaries
        const gameAreaWidth = this.gameArea.offsetWidth;
        this.x = Math.random() * (gameAreaWidth - GAME_CONFIG.cardWidth);
        this.y = -GAME_CONFIG.cardHeight; // Start above screen

        // Speed varies slightly and increases with difficulty
        this.speed = (GAME_CONFIG.cardSpeed + (Math.random() * 1.5)) * difficultyMultiplier;

        // Debug hitbox - always create, but hide/show based on config
        this.debugHitbox = null;

        this.createElement();
        this.createDebugHitbox();
    }

    createDebugHitbox() {
        this.debugHitbox = document.createElement('div');
        this.debugHitbox.className = 'debug-hitbox card';
        this.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';

        const label = document.createElement('div');
        label.className = 'debug-hitbox-label';
        label.textContent = `Card (${this.quality})`;
        this.debugHitbox.appendChild(label);

        // Add to game area, not body, so it scales with container
        this.gameArea.appendChild(this.debugHitbox);
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = `falling-card quality-${this.quality}`;

        // Image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'card-image-container';

        // Quality badge (overlays image)
        const badge = document.createElement('span');
        badge.className = 'card-quality-badge';
        badge.textContent = this.getQualityLabel();

        // Real image
        const img = document.createElement('img');
        img.className = 'card-image';
        img.src = this.imageData.image;
        img.alt = this.imageData.description;

        imageContainer.appendChild(img);
        imageContainer.appendChild(badge);

        // Caption below image (shows the actual prompt text)
        const caption = document.createElement('div');
        caption.className = 'card-caption';
        caption.textContent = this.imageData.description;

        this.element.appendChild(imageContainer);
        this.element.appendChild(caption);

        this.updatePosition();
        document.getElementById('cardsContainer').appendChild(this.element);
    }

    getQualityLabel() {
        const labels = {
            good: '+10',
            bad: '-1 ❤️'
        };
        return labels[this.quality] || '?';
    }

    update(deltaTime) {
        this.y += this.speed;
        this.updatePosition();

        // Check if off screen (use actual element height)
        const gameAreaHeight = this.gameArea.offsetHeight;
        const actualHeight = this.element ? this.element.offsetHeight : GAME_CONFIG.cardHeight;
        return this.y > gameAreaHeight + actualHeight;
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        // Update debug hitbox
        if (GAME_CONFIG.debugHitboxes && this.debugHitbox) {
            const hitbox = this.getHitbox();
            this.debugHitbox.style.left = `${hitbox.left}px`;
            this.debugHitbox.style.top = `${hitbox.top}px`;
            this.debugHitbox.style.width = `${hitbox.right - hitbox.left}px`;
            this.debugHitbox.style.height = `${hitbox.bottom - hitbox.top}px`;
        }
    }

    getHitbox() {
        // Use actual element height instead of fixed cardHeight to account for varying caption lengths
        const actualHeight = this.element ? this.element.offsetHeight : GAME_CONFIG.cardHeight;

        return {
            left: this.x,
            right: this.x + GAME_CONFIG.cardWidth,
            top: this.y,
            bottom: this.y + actualHeight,
            centerX: this.x + GAME_CONFIG.cardWidth / 2,
            centerY: this.y + actualHeight / 2
        };
    }

    collect() {
        this.collected = true;

        // Use will-change to optimize animation
        this.element.style.willChange = 'transform, opacity';
        this.element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

        // Use requestAnimationFrame for smoother animation
        requestAnimationFrame(() => {
            this.element.style.transform = 'scale(1.2)';
            this.element.style.opacity = '0';

            if (this.debugHitbox) {
                this.debugHitbox.style.opacity = '0';
            }
        });

        setTimeout(() => {
            if (this.element && this.element.parentNode) {
                this.element.style.willChange = 'auto';
                this.element.parentNode.removeChild(this.element);
            }
        }, 300);
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

// ===== MAIN GAME CLASS =====
class BildPuzzleGame {
    constructor() {
        this.gameArea = document.getElementById('gameArea');
        this.cardsContainer = document.getElementById('cardsContainer');

        // Game state
        this.isRunning = false;
        this.isPaused = false;
        this.gameTime = 0; // Time in seconds, counts up

        // Player & Cards
        this.player = null;
        this.cards = [];
        this.cardSpawnTimer = 0;

        // Score & Stats
        this.score = 0;
        this.lives = GAME_CONFIG.lives;
        this.collected = 0;
        this.avoided = 0;
        this.mistakes = 0;

        // Easter Eggs
        this.jumpHistory = []; // Track jumps for spam detection
        this.lastActivityTime = Date.now();
        this.idleWarningShown = false;
        this.celebratedScores = new Set(); // Track which milestone scores we've celebrated
        this.speechTimeout = null; // Track speech bubble timeout
        this.achievementShownThisRun = false; // Track if achievement was shown this game session

        // Difficulty scaling
        this.difficultyMultiplier = 1.0; // Increases over time

        // Input handling
        this.keys = {};
        this.setupInputHandlers();

        // Game loop
        this.lastTime = 0;
        this.gameLoopId = null;

        // Speech bubble
        this.speechBubble = document.getElementById('moSpeech');
        this.speechText = document.getElementById('moSpeechText');
    }

    setupInputHandlers() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            // Toggle hitboxes with 'H' key (works anytime)
            if (e.key === 'h' || e.key === 'H') {
                this.toggleHitboxes();
                return;
            }

            // Pause/Resume with ESC (works anytime when game is running)
            if (e.key === 'Escape' && this.isRunning) {
                this.togglePause();
                return;
            }

            if (!this.isRunning || this.isPaused) return;

            // Movement - track last direction for priority
            if (e.key === 'ArrowLeft') {
                this.player.isMovingLeft = true;
                this.player.lastDirection = 'left';
                this.resetIdleTimer(); // Track activity
            } else if (e.key === 'ArrowRight') {
                this.player.isMovingRight = true;
                this.player.lastDirection = 'right';
                this.resetIdleTimer(); // Track activity
            }

            // Jump
            if (e.key === 'ArrowUp' || e.key === ' ') {
                this.onPlayerJump(); // Easter egg: spam jump detection (count all attempts)

                if (this.player.isGrounded) {
                    this.player.jump();
                }
                e.preventDefault();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;

            if (!this.isRunning || this.isPaused) return;

            // Stop movement - update flags directly
            if (e.key === 'ArrowLeft') {
                this.player.isMovingLeft = false;
            } else if (e.key === 'ArrowRight') {
                this.player.isMovingRight = false;
            }
        });

        // Auto-pause when page/tab loses focus
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isRunning && !this.isPaused) {
                this.togglePause();
            }
        });

        // Also listen to blur event as fallback
        window.addEventListener('blur', () => {
            if (this.isRunning && !this.isPaused) {
                this.togglePause();
            }
        });
    }

    toggleHitboxes() {
        GAME_CONFIG.debugHitboxes = !GAME_CONFIG.debugHitboxes;

        // Show/hide player hitbox
        if (this.player && this.player.debugHitbox) {
            this.player.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
        }

        // Show/hide card hitboxes
        this.cards.forEach(card => {
            if (card.debugHitbox) {
                card.debugHitbox.style.display = GAME_CONFIG.debugHitboxes ? 'block' : 'none';
            }
        });

        console.log('Hitboxes:', GAME_CONFIG.debugHitboxes ? 'ON' : 'OFF');
    }

    startGame() {
        // Reset everything
        this.score = 0;
        this.lives = GAME_CONFIG.lives;
        this.collected = 0;
        this.avoided = 0;
        this.mistakes = 0;
        this.gameTime = 0;
        this.achievementShownThisRun = false;

        // Clear any existing cards
        this.cards.forEach(card => card.destroy());
        this.cards = [];

        // Show game screen
        this.showScreen('gameScreen');

        // Enable TXP talking when game starts
        if (txpHost) txpHost.enableTalking();

        // Create player
        this.player = new MoManPlayer(this.gameArea);

        // Update UI
        this.updateUI();

        // Start game loop
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();

        // Initial speech
        this.showSpeech("Los geht's! Sammle die guten Prompts!");
    }


    gameLoop(currentTime = performance.now()) {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastTime) / 16.67; // Normalize to 60fps
        this.lastTime = currentTime;

        if (!this.isPaused) {
            // Update game time
            this.gameTime += deltaTime / 60; // Convert to seconds (60fps)
            this.updateTimeDisplay();

            // Progressive difficulty - increases speed by 4% every second
            // Caps at 10x speed (after 225 seconds / 3.75 minutes)
            this.difficultyMultiplier = Math.min(10.0, 1.0 + this.gameTime * 0.04);

            // Update player
            this.player.update(deltaTime);

            // Update cards
            for (let i = this.cards.length - 1; i >= 0; i--) {
                const card = this.cards[i];
                const isOffScreen = card.update(deltaTime);

                if (isOffScreen) {
                    // Card missed
                    if (card.quality === 'good') {
                        // Good card missed - no penalty
                        this.avoided++;
                    }
                    card.destroy();
                    this.cards.splice(i, 1);
                } else if (!card.collected) {
                    // Check collision
                    this.checkCollision(card);
                }
            }

            // Spawn cards continuously - spawn rate increases with difficulty
            // Higher difficulty = shorter interval between spawns
            this.cardSpawnTimer += deltaTime;
            const adjustedSpawnInterval = GAME_CONFIG.cardSpawnInterval / this.difficultyMultiplier;
            if (this.cardSpawnTimer >= adjustedSpawnInterval / 16.67) {
                this.spawnCard();
                this.cardSpawnTimer = 0;
            }

            // Easter egg: Check for idle player
            this.checkIdleState();

            // Check survival achievement during gameplay (only once when reaching 250s)
            if (!this.achievementShownThisRun && Math.floor(this.gameTime) >= 250) {
                this.checkSurvivalAchievement();
                this.achievementShownThisRun = true;
            }

            // Check game over
            if (this.lives <= 0) {
                this.gameOver();
            }
        }

        this.gameLoopId = requestAnimationFrame((time) => this.gameLoop(time));
    }

    spawnCard() {
        // Random quality distribution - 50% good, 50% bad
        const rand = Math.random();
        let quality, imageData;

        if (rand < 0.5) {
            // 50% bad
            quality = 'bad';
            imageData = IMAGE_PROMPTS.bad[Math.floor(Math.random() * IMAGE_PROMPTS.bad.length)];
        } else {
            // 50% good
            quality = 'good';
            imageData = IMAGE_PROMPTS.good[Math.floor(Math.random() * IMAGE_PROMPTS.good.length)];
        }

        const card = new FallingCard(this.gameArea, imageData, quality, this.difficultyMultiplier);
        this.cards.push(card);
    }

    checkCollision(card) {
        const playerBox = this.player.getHitbox();
        const cardBox = card.getHitbox();

        // Get game area height for proper conversion
        const gameAreaHeight = this.gameArea.offsetHeight;

        // Convert player's bottom-based coordinates to top-based (like cards)
        const playerTopPos = gameAreaHeight - playerBox.topDist;
        const playerBottomPos = gameAreaHeight - playerBox.bottomDist;

        // Simple AABB collision (both in top-based coordinates now)
        const collision = !(
            playerBox.right < cardBox.left ||
            playerBox.left > cardBox.right ||
            playerBottomPos < cardBox.top ||
            playerTopPos > cardBox.bottom
        );

        if (collision) {
            this.handleCardCollected(card);
        }
    }

    handleCardCollected(card) {
        // Mark as collected immediately to prevent double-collection
        card.collected = true;

        // Visual collection effect
        card.collect();

        // Update score based on quality
        if (card.quality === 'good') {
            this.score += 10;
            this.collected++;
            this.checkScoreMilestone(this.score); // Easter egg: milestone celebration
            this.showSpeech("Richtig! +10 Punkte!", 1500);
        } else if (card.quality === 'bad') {
            this.lives--;
            this.mistakes++;
            this.showSpeech("Falsch! Schlechter Prompt! -1 Leben", 1500);
            this.updateLivesDisplay();
        }

        // Remove from cards array immediately
        const index = this.cards.indexOf(card);
        if (index > -1) {
            this.cards.splice(index, 1);
        }

        this.updateUI();
    }


    gameOver() {
        this.isRunning = false;
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
        }

        this.showResults();
    }

    showResults() {
        // Clean up
        if (this.player) {
            this.player.destroy();
        }
        this.cards.forEach(card => card.destroy());
        this.cards = [];

        // Calculate rank
        let rank, rankName;
        if (this.score >= 500) {
            rank = 'gold';
            rankName = 'Gold';
        } else if (this.score >= 300) {
            rank = 'silver';
            rankName = 'Silber';
        } else if (this.score >= 150) {
            rank = 'bronze';
            rankName = 'Bronze';
        } else {
            rank = 'none';
            rankName = 'Kein Rang';
        }

        // Get previous highscore
        const previousProgress = loadProgress();
        const previousHighscore = previousProgress ? previousProgress.score : 0;
        const isNewHighscore = this.score > previousHighscore;

        // Save progress
        saveProgress(this.score, rankName);

        // Update HUD rank badge
        displayRankBadge();

        // Check and update Level 4 survival achievement
        this.checkSurvivalAchievement();

        // Calculate accuracy
        const totalCards = this.collected + this.mistakes;
        const accuracy = totalCards > 0 ? Math.round((this.collected / totalCards) * 100) : 0;

        // Update results screen - change title if new highscore
        if (isNewHighscore) {
            document.getElementById('resultsTitle').textContent = '🎉 Neuer Highscore!';
        } else {
            document.getElementById('resultsTitle').textContent = '💔 Game Over!';
        }

        document.getElementById('finalScoreValue').textContent = this.score;
        document.getElementById('rankName').textContent = rankName;

        // Display highscore
        const highscoreValue = Math.max(this.score, previousHighscore);
        document.getElementById('highscoreValue').textContent = highscoreValue;

        // Update the rank display in results (not the HUD badge)
        const resultRankBadge = document.querySelector('#resultsScreen .rank-badge');
        if (resultRankBadge) {
            resultRankBadge.className = `rank-badge ${rank}`;
        }

        // Stats
        document.getElementById('statCollected').textContent = this.collected;
        document.getElementById('statAvoided').textContent = this.avoided;
        document.getElementById('statAccuracy').textContent = `${accuracy}%`;

        this.showScreen('resultsScreen');
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseOverlay = document.getElementById('pauseOverlay');
        pauseOverlay.style.display = this.isPaused ? 'flex' : 'none';

        // When pausing, reset all player movement states to prevent bugs
        if (this.isPaused) {
            // Clear all key states
            this.keys = {};

            // Reset player movement flags
            if (this.player) {
                this.player.isMovingLeft = false;
                this.player.isMovingRight = false;
                this.player.lastDirection = null;
                this.player.velocityX = 0;

                // If player is jumping, let them finish the jump but reset to stand animation when grounded
                if (this.player.isGrounded) {
                    this.player.startAnimation('stand');
                }
            }
        }
    }

    showScreen(screenId) {
        const screens = document.querySelectorAll('.game-screen');
        screens.forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    showSpeech(text, duration = 3000) {
        // Clear any existing speech timeout
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
        }

        this.speechText.textContent = text;
        this.speechBubble.style.display = 'block';

        // Animate TXP talking
        if (txpHost) txpHost.talk(duration);

        // Auto-hide after duration
        this.speechTimeout = setTimeout(() => {
            this.speechBubble.style.display = 'none';
            this.speechTimeout = null;
        }, duration);
    }

    updateUI() {
        document.getElementById('scoreValue').textContent = this.score;
        this.updateLivesDisplay();
    }

    updateTimeDisplay() {
        const seconds = Math.floor(this.gameTime);
        document.getElementById('timeValue').textContent = `${seconds}s`;
    }

    updateLivesDisplay() {
        const hearts = '❤️'.repeat(Math.max(0, this.lives));
        const emptyHearts = '🖤'.repeat(Math.max(0, GAME_CONFIG.lives - this.lives));
        document.getElementById('livesValue').textContent = hearts + emptyHearts;
    }

    // ===== EASTER EGGS =====

    // Spam Jump Easter Egg - detect rapid jumping
    onPlayerJump() {
        const now = Date.now();
        this.jumpHistory.push(now);

        // Keep only jumps from last 1 second
        this.jumpHistory = this.jumpHistory.filter(time => now - time < 1000);

        // If 6+ jumps in 1 second, trigger special animation
        if (this.jumpHistory.length >= 6) {
            this.triggerSpamJumpAnimation();
            this.jumpHistory = []; // Reset to prevent spam
        }

        this.resetIdleTimer();
    }

    triggerSpamJumpAnimation() {
        // Create particle explosion effect
        const playerEl = this.player.element;
        const rect = playerEl.getBoundingClientRect();

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = `${rect.left + rect.width / 2}px`;
            particle.style.top = `${rect.top + rect.height / 2}px`;
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = ['#67C7FF', '#A86AFF', '#F5C03B'][Math.floor(Math.random() * 3)];
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '999';

            const angle = (Math.PI * 2 * i) / 20;
            const velocity = 100 + Math.random() * 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            document.body.appendChild(particle);

            let px = rect.left + rect.width / 2;
            let py = rect.top + rect.height / 2;
            let life = 1;

            const animateParticle = () => {
                px += vx * 0.016;
                py += vy * 0.016;
                life -= 0.02;

                particle.style.left = `${px}px`;
                particle.style.top = `${py}px`;
                particle.style.opacity = life;

                if (life > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                }
            };

            animateParticle();
        }

        this.showSpeech("Wow! So viel Energie! 🎉", 2000);
    }

    // Perfect Score Celebration
    checkScoreMilestone(newScore) {
        const milestones = [100, 200, 300];

        for (const milestone of milestones) {
            if (newScore >= milestone && !this.celebratedScores.has(milestone)) {
                this.celebratedScores.add(milestone);
                this.celebrateScoreMilestone(milestone);
                break; // Only celebrate one at a time
            }
        }
    }

    celebrateScoreMilestone(score) {
        // Show celebration message
        const messages = {
            100: "🎉 100 Punkte! Fantastisch!",
            200: "🌟 200 Punkte! Du bist ein Profi!",
            300: "🏆 300 Punkte! Unglaublich!"
        };

        this.showSpeech(messages[score], 3000);

        // Visual celebration effect
        const scoreEl = document.getElementById('scoreValue');
        scoreEl.style.animation = 'none';
        setTimeout(() => {
            scoreEl.style.animation = 'scoreClickCelebrate 1s ease';
        }, 10);
    }

    // Check and update survival achievement
    checkSurvivalAchievement() {
        // Get current time in seconds
        const currentTime = Math.floor(this.gameTime);

        // Load achievement data from localStorage
        const savedData = localStorage.getItem('aiBytes_achievementData');
        let achievementData = savedData ? JSON.parse(savedData) : {};

        // Initialize level4MaxTime if it doesn't exist
        if (!achievementData.level4MaxTime) {
            achievementData.level4MaxTime = 0;
        }

        // Update max time if current time is higher
        if (currentTime > achievementData.level4MaxTime) {
            achievementData.level4MaxTime = currentTime;

            // Save updated achievement data
            localStorage.setItem('aiBytes_achievementData', JSON.stringify(achievementData));

            // Load and update achievements
            const savedAchievements = localStorage.getItem('aiBytes_achievements');
            let achievements = savedAchievements ? JSON.parse(savedAchievements) : { easy: [], normal: [], hard: [] };

            // Ensure hard category exists
            if (!achievements.hard) {
                achievements.hard = [];
            }

            // Find or create survivor achievement
            let survivorIndex = achievements.hard.findIndex(a => a.id === 'survivor');
            let wasJustUnlocked = false;

            if (survivorIndex === -1) {
                // Create achievement if it doesn't exist
                const newAchievement = {
                    id: 'survivor',
                    name: 'Überlebenskünstler',
                    description: 'Überlebe 250 Sekunden in Level 4',
                    icon: '⏱️',
                    progress: achievementData.level4MaxTime,
                    target: 250,
                    unlocked: achievementData.level4MaxTime >= 250
                };
                achievements.hard.push(newAchievement);

                // Check if unlocked on creation
                if (newAchievement.unlocked) {
                    wasJustUnlocked = true;
                }
            } else {
                // Check if this is the moment of unlocking
                const wasUnlocked = achievements.hard[survivorIndex].unlocked;

                // Update existing achievement
                achievements.hard[survivorIndex].progress = achievementData.level4MaxTime;
                achievements.hard[survivorIndex].target = 250;
                achievements.hard[survivorIndex].description = 'Überlebe 250 Sekunden in Level 4';

                // Check if unlocked (250 seconds or more)
                if (achievementData.level4MaxTime >= 250 && !wasUnlocked) {
                    achievements.hard[survivorIndex].unlocked = true;
                    wasJustUnlocked = true;
                }
            }

            // Save updated achievements
            localStorage.setItem('aiBytes_achievements', JSON.stringify(achievements));

            // Show achievement unlock animation if just unlocked
            if (wasJustUnlocked) {
                const achievement = achievements.hard.find(a => a.id === 'survivor');
                if (achievement) {
                    showAchievementUnlock(achievement, 'HARD');
                }
            }
        }
    }

    // Idle Detection
    resetIdleTimer() {
        this.lastActivityTime = Date.now();
        this.idleWarningShown = false;
    }

    checkIdleState() {
        if (this.isPaused || !this.isRunning) return;

        const idleTime = Date.now() - this.lastActivityTime;

        // After 15 seconds of no input, show reminder
        if (idleTime > 15000 && !this.idleWarningShown) {
            this.idleWarningShown = true;
            this.showSpeech("Du musst dich mit den Pfeiltasten bewegen! ⬅️➡️", 4000);
        }
    }
}

// ===== ACHIEVEMENT UNLOCK ANIMATION =====
// Show achievement unlock animation (same as index.html)
function showAchievementUnlock(achievement, category) {
    if (!achievement) return;

    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(145deg, #4b0074, #3c3aa5);
        border: 3px solid #F5C03B;
        border-radius: 20px;
        padding: 30px;
        text-align: center;
        z-index: 10000;
        color: white;
        font-family: 'Ithaca', serif;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(20px);
        animation: achievementPop 6s ease-out forwards;
        min-width: 350px;
    `;

    notification.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 15px;">${achievement.icon || '🏆'}</div>
        <div style="font-size: 1.5rem; color: #F5C03B; margin-bottom: 10px;">Achievement Unlocked!</div>
        <div style="font-size: 1.2rem; margin-bottom: 8px;">${achievement.name || 'Achievement'}</div>
        <div style="color: #67C7FF; font-size: 0.9rem; text-transform: uppercase;">${category || ''}</div>
        <div style="color: #67C7FF; font-size: 0.9rem; margin-top: 5px;">${achievement.description || ''}</div>
    `;

    document.body.appendChild(notification);

    // Confetti effect
    createConfettiEffect();

    setTimeout(() => {
        notification.remove();
    }, 6000);
}

// Create confetti effect for achievement unlock
function createConfettiEffect() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${['#A86AFF', '#67C7FF', '#F5C03B', '#FF4500'][Math.floor(Math.random() * 4)]};
                top: 30%;
                left: ${50 + (Math.random() - 0.5) * 20}%;
                z-index: 9999;
                animation: confettiFall 2s ease-out forwards;
                transform: rotate(${Math.random() * 360}deg);
            `;
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 2000);
        }, i * 20);
    }
}

// ===== TUTORIAL DEMO ANIMATION =====
class TutorialDemo {
    constructor() {
        this.demoPlayer = document.getElementById('demoPlayer');
        this.demoPlayerImg = document.getElementById('demoPlayerImg');
        this.demoCardsContainer = document.getElementById('demoCardsContainer');
        this.demoHint = document.getElementById('demoHint');
        this.isRunning = false;
        this.animationInterval = null;
        this.currentAnimation = 'stand';
        this.currentFrame = 0;
        this.frameInterval = null;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.startAnimation('stand');
        this.runDemo();
    }

    stop() {
        this.isRunning = false;
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
        if (this.frameInterval) {
            clearInterval(this.frameInterval);
        }
        // Clear all demo cards
        if (this.demoCardsContainer) {
            this.demoCardsContainer.innerHTML = '';
        }
    }

    startAnimation(animName) {
        if (this.currentAnimation === animName && this.frameInterval) return;

        this.stopAnimation();
        this.currentAnimation = animName;
        this.currentFrame = 0;
        const anim = ANIMATIONS[animName];

        this.frameInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % anim.frames;
            this.updateFrame();
        }, anim.speed);
    }

    stopAnimation() {
        if (this.frameInterval) {
            clearInterval(this.frameInterval);
            this.frameInterval = null;
        }
    }

    updateFrame() {
        const anim = ANIMATIONS[this.currentAnimation];
        let frameStr = String(this.currentFrame).padStart(5, '0');

        // Handle special jump frames (if needed)
        if (this.currentAnimation === 'jump') {
            if (this.currentFrame === 27) frameStr = '00027_a';
            else if (this.currentFrame === 28) frameStr = '00028_b';
        }

        this.demoPlayerImg.src = `${anim.path}${frameStr}.png`;
    }

    showHint(text) {
        this.demoHint.textContent = text;
        this.demoHint.classList.add('show');
    }

    hideHint() {
        this.demoHint.classList.remove('show');
    }

    async runDemo() {
        // Clear any existing cards
        this.demoCardsContainer.innerHTML = '';
        this.hideHint();

        // Wait a bit before starting
        await this.sleep(500);

        // Phase 1: Good card falls from left, Mo Man moves left to catch it
        await this.showCardFalling('good', 30, async (card) => {
            await this.sleep(400);
            this.showHint('Sammel die guten Prompts ein');
            await this.sleep(400);
            await this.moveDemoPlayer(30, 50); // Move from 50% to 30% (left)
            await this.sleep(400);
            this.collectCard(card);
        });

        await this.sleep(1000);
        this.hideHint();

        // Phase 2: Bad card falls from right, Mo Man stays still and lets it pass
        await this.showCardFalling('bad', 70, async (card) => {
            await this.sleep(400);
            this.showHint('Weiche den schlechten Prompts aus');
            await this.sleep(1600);
            this.removeCard(card);
        });

        await this.sleep(1000);
        this.hideHint();

        // Reset player position
        await this.moveDemoPlayer(50, 30); // Move from 30% to 50% (right)

        // Loop the demo
        if (this.isRunning) {
            this.runDemo();
        }
    }

    async showCardFalling(quality, xPercent, callback) {
        const card = document.createElement('div');
        card.className = `demo-card quality-${quality}`;

        const imageContainer = document.createElement('div');
        imageContainer.className = 'demo-card-image';

        const badge = document.createElement('span');
        badge.className = 'demo-card-badge';
        badge.textContent = quality === 'good' ? '+10' : '-1 ❤️';

        const img = document.createElement('img');
        const promptData = quality === 'good' ? IMAGE_PROMPTS.good[0] : IMAGE_PROMPTS.bad[0];
        img.src = promptData.image;
        img.alt = promptData.description;

        imageContainer.appendChild(img);
        imageContainer.appendChild(badge);

        const caption = document.createElement('div');
        caption.className = 'demo-card-caption';
        caption.textContent = promptData.description.substring(0, 50) + '...';

        card.appendChild(imageContainer);
        card.appendChild(caption);

        card.style.left = `${xPercent}%`;
        card.style.top = '-150px';
        card.style.transform = 'translateX(-50%)';

        this.demoCardsContainer.appendChild(card);

        // Animate card falling
        let currentTop = -150;
        const targetTop = 120;
        const fallInterval = setInterval(() => {
            currentTop += 2;
            card.style.top = `${currentTop}px`;

            if (currentTop >= targetTop) {
                clearInterval(fallInterval);
            }
        }, 16);

        // Execute callback when card reaches player
        await this.sleep(1200);
        if (callback) await callback(card);
    }

    async moveDemoPlayer(xPercent, fromPercent = null) {
        // Determine direction (if fromPercent is provided)
        if (fromPercent !== null) {
            if (xPercent < fromPercent) {
                // Moving left - flip
                this.demoPlayer.style.transform = 'translateX(-50%) scaleX(-1)';
            } else if (xPercent > fromPercent) {
                // Moving right - normal
                this.demoPlayer.style.transform = 'translateX(-50%) scaleX(1)';
            }
        }

        // Start run animation
        this.startAnimation('run');

        this.demoPlayer.style.left = `${xPercent}%`;
        await this.sleep(500);

        // Return to stand animation
        this.startAnimation('stand');
    }

    collectCard(card) {
        // Animate collection
        card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        card.style.transform = 'translateX(-50%) scale(1.3)';
        card.style.opacity = '0';

        setTimeout(() => {
            if (card.parentNode) {
                card.parentNode.removeChild(card);
            }
        }, 300);
    }

    removeCard(card) {
        // Card continues falling off screen
        let currentTop = parseFloat(card.style.top);
        const removeInterval = setInterval(() => {
            currentTop += 3;
            card.style.top = `${currentTop}px`;

            if (currentTop > 300) {
                clearInterval(removeInterval);
                if (card.parentNode) {
                    card.parentNode.removeChild(card);
                }
            }
        }, 16);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

let tutorialDemo = null;

// ===== GLOBAL FUNCTIONS (Called from HTML) =====
let game;
let txpHost; // Global TXP instance

function showTutorial() {
    const screens = document.querySelectorAll('.game-screen');
    screens.forEach(screen => screen.classList.remove('active'));
    document.getElementById('tutorialScreen').classList.add('active');

    // Start tutorial demo
    if (!tutorialDemo) {
        tutorialDemo = new TutorialDemo();
    }
    tutorialDemo.start();
}

function startGame() {
    // Stop tutorial demo
    if (tutorialDemo) {
        tutorialDemo.stop();
    }

    if (!game) {
        game = new BildPuzzleGame();
    }
    game.startGame();
}

function resumeGame() {
    if (game) {
        game.togglePause();
    }
}

function quitGame() {
    if (game) {
        game.isRunning = false;
        if (game.gameLoopId) {
            cancelAnimationFrame(game.gameLoopId);
        }
    }

    const screens = document.querySelectorAll('.game-screen');
    screens.forEach(screen => screen.classList.remove('active'));
    document.getElementById('introScreen').classList.add('active');
}

function restartGame() {
    if (game) {
        game.startGame();
    } else {
        game = new BildPuzzleGame();
        game.startGame();
    }
}

function goToMenu() {
    window.location.href = 'index.html';
}

// ===== PROGRESS MANAGEMENT =====
function saveProgress(score, rankName) {
    const existingProgress = loadProgress();

    // Define rank hierarchy (higher number = better rank)
    const rankValues = {
        "Kein Rang": 0,
        "Bronze": 1,
        "Silber": 2,
        "Gold": 3
    };

    let rankToSave = rankName;
    let scoreToSave = score;

    // If there's existing progress, only upgrade rank if new one is better
    if (existingProgress && existingProgress.rank) {
        const existingRankValue = rankValues[existingProgress.rank] || 0;
        const currentRankValue = rankValues[rankName] || 0;

        // Keep the better rank
        if (existingRankValue > currentRankValue) {
            rankToSave = existingProgress.rank;
        }

        // Always keep the higher score
        if (existingProgress.score > score) {
            scoreToSave = existingProgress.score;
        }
    }

    const progress = {
        level: 'level4',
        completed: true,
        score: scoreToSave,
        rank: rankToSave,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('aiBytes_level4_progress', JSON.stringify(progress));
}

function loadProgress() {
    const saved = localStorage.getItem('aiBytes_level4_progress');
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}

// Function to display rank badge in HUD
function displayRankBadge() {
    const progress = loadProgress();
    const rankBadge = document.getElementById('rankBadge');

    if (!rankBadge) return;

    if (progress && progress.rank && progress.rank !== "Kein Rang") {
        // Show the rank badge
        rankBadge.style.display = 'inline-block';

        // Set rank text
        rankBadge.textContent = progress.rank;

        // Remove all rank classes first
        rankBadge.classList.remove('bronze', 'silver', 'gold');

        // Add appropriate class based on rank
        if (progress.rank.includes('Bronze')) {
            rankBadge.classList.add('bronze');
        } else if (progress.rank.includes('Silber')) {
            rankBadge.classList.add('silver');
        } else if (progress.rank.includes('Gold')) {
            rankBadge.classList.add('gold');
        }
    } else {
        // Hide the badge if no rank
        rankBadge.style.display = 'none';
    }
}

// ===== TXP CLICK EASTER EGG =====
let txpClickTimeout = null; // Track TXP click speech timeout

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
        "Warum ist die KI so ordentlich? Sie sortiert ihre Arrays! 📊",
        "Was macht eine KI im Winter? Sie friert ihre Weights ein! ❄️",
        "Warum ging die KI zum Psychologen? Sie hatte zu viele Layer! 🧠",
        "Wie flirtet eine KI? 'Hey Baby, willst du meine Loss-Function minimieren?' 💕",
        "Was ist das Lieblingsessen einer Bild-KI? Pixel-Pizza! 🍕",
        "Warum wurde DALL-E zum Künstler? Es hatte viel Imagination! 🎨",
        "Was sagt eine KI zu ihrem Trainer? 'Danke für das Feedback!' 🙏"
    ];

    let lastJokeIndex = -1;

    txpElement.addEventListener('click', () => {
        // Check if TXP exists
        if (!txpHost) return;

        // Get a random joke (different from last one)
        let jokeIndex;
        do {
            jokeIndex = Math.floor(Math.random() * aiJokes.length);
        } while (jokeIndex === lastJokeIndex && aiJokes.length > 1);

        lastJokeIndex = jokeIndex;

        // Show the joke
        const speechBubble = document.getElementById('moSpeech');
        const speechText = document.getElementById('moSpeechText');

        if (speechBubble && speechText) {
            // Clear any existing timeout
            if (txpClickTimeout) {
                clearTimeout(txpClickTimeout);
            }

            // If game is running, use game's showSpeech method
            if (game && game.isRunning) {
                game.showSpeech(aiJokes[jokeIndex], 5000);
            } else {
                // Otherwise handle manually (tutorial, results screen, etc.)
                speechText.textContent = aiJokes[jokeIndex];
                speechBubble.style.display = 'block';

                // Animate TXP talking (works in all screens)
                txpHost.startAnimation('talk');
                setTimeout(() => {
                    txpHost.startAnimation('stand');
                }, 4000);

                // Hide after 5 seconds
                txpClickTimeout = setTimeout(() => {
                    speechBubble.style.display = 'none';
                    txpClickTimeout = null;
                }, 5000);
            }
        }
    });

    // Add cursor pointer to show it's clickable
    txpElement.style.cursor = 'pointer';
}

// Setup Intro Screen - Press any key or click to continue
function setupIntroScreen() {
    const introScreen = document.getElementById('introScreen');
    let introActive = true;

    const startFromIntro = () => {
        if (!introActive || !introScreen.classList.contains('active')) return;

        introActive = false;
        showTutorial();

        // Remove event listeners after use
        document.removeEventListener('keydown', handleKeyPress);
        introScreen.removeEventListener('click', handleClick);
    };

    const handleKeyPress = (e) => {
        // Ignore modifier keys
        if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;

        startFromIntro();
    };

    const handleClick = () => {
        startFromIntro();
    };

    document.addEventListener('keydown', handleKeyPress);
    introScreen.addEventListener('click', handleClick);
}

// Starfield is now pure CSS - no JS generation needed

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Bild-KI Puzzle Lauf initialized!');

    // Initialize TXP Host (independent of game)
    txpHost = new TXPHost();

    // Display rank badge if there's a saved rank
    displayRankBadge();

    // Easter Egg: TXP Click for AI jokes
    setupTXPClickHandler();

    // Intro Screen: Press any key to start
    setupIntroScreen();

    // Preload all game images for instant display
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
    totalImages += IMAGE_PROMPTS.good.length + IMAGE_PROMPTS.bad.length;

    console.log(`Preloading ${totalImages} images...`);

    // Preload ALL frames of Mo Man animations (not just first 5)
    Object.keys(ANIMATIONS).forEach(animName => {
        const anim = ANIMATIONS[animName];
        for (let i = 0; i < anim.frames; i++) {
            const img = new Image();
            let frameStr = String(i).padStart(5, '0');

            // Handle special jump frames (27_a and 28_b)
            if (animName === 'jump') {
                if (i === 27) frameStr = '00027_a';
                else if (i === 28) frameStr = '00028_b';
            }

            img.src = `${anim.path}${frameStr}.png`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    console.log('✅ All images preloaded successfully!');
                }
            };
            img.onerror = () => {
                console.warn(`⚠️ Failed to load: ${img.src}`);
                loadedCount++;
            };
            preloadImages.push(img);
        }
    });

    // Preload ALL frames of TXP animations
    Object.keys(TXP_ANIMATIONS).forEach(animName => {
        const anim = TXP_ANIMATIONS[animName];
        for (let i = 0; i < anim.frames; i++) {
            const img = new Image();
            const frameStr = String(i).padStart(5, '0');
            img.src = `${anim.path}${frameStr}.png`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    console.log('✅ All images preloaded successfully!');
                }
            };
            img.onerror = () => {
                console.warn(`⚠️ Failed to load: ${img.src}`);
                loadedCount++;
            };
            preloadImages.push(img);
        }
    });

    // Preload all card images (good and bad prompts)
    IMAGE_PROMPTS.good.forEach(prompt => {
        const img = new Image();
        img.src = prompt.image;
        img.onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                console.log('✅ All images preloaded successfully!');
            }
        };
        img.onerror = () => {
            console.warn(`⚠️ Failed to load: ${img.src}`);
            loadedCount++;
        };
        preloadImages.push(img);
    });

    IMAGE_PROMPTS.bad.forEach(prompt => {
        const img = new Image();
        img.src = prompt.image;
        img.onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                console.log('✅ All images preloaded successfully!');
            }
        };
        img.onerror = () => {
            console.warn(`⚠️ Failed to load: ${img.src}`);
            loadedCount++;
        };
        preloadImages.push(img);
    });
});
