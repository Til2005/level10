// Level 2 - Power Automate - Flow Editor Game Logic

// ===== CONSTANTS & CONFIGURATION =====
const GAME_CONFIG = {
    gridSize: 40, // Snap-to-grid size in pixels
    totalChallenges: 5,
    basePoints: 100,
    timeBonus: true,
    snapDistance: 20 // Distance for magnetic snap
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
        name: "E-Mail Benachrichtigung",
        difficulty: "Einfach",
        description: "Erstelle einen Flow, der bei neuen E-Mails eine Benachrichtigung sendet",
        task: "Baue einen Flow: Wenn neue E-Mail → Dann Benachrichtigung senden",
        blocks: [
            { id: "trigger-email", icon: "📧", title: "Neue E-Mail", description: "Trigger: Wenn neue E-Mail eintrifft", type: "trigger", puzzleType: "horizontal" },
            { id: "action-notify", icon: "🔔", title: "Benachrichtigung", description: "Aktion: Benachrichtigung senden", type: "action", puzzleType: "horizontal" },
            { id: "wrong-save", icon: "💾", title: "Datei speichern", description: "Aktion: E-Mail als Datei speichern", type: "action", puzzleType: "horizontal" },
            { id: "wrong-delete", icon: "🗑️", title: "E-Mail löschen", description: "Aktion: E-Mail aus Postfach löschen", type: "action", puzzleType: "horizontal" }
        ],
        correctConnections: [
            { from: "trigger-email", to: "action-notify", direction: "horizontal" }
        ],
        tutorialMessages: [
            "Willkommen! Ich bin TXP, dein Assistent. 👋",
            "In diesem Level lernst du, wie man Flows in Power Automate erstellt.",
            "Ziehe die Flow-Bausteine von links ins Whiteboard und baue den richtigen Flow!",
            "Viel Erfolg! 🚀"
        ],
        successMessage: "Super! Dein erster Flow funktioniert perfekt! 🎉"
    },

    2: {
        name: "Daten filtern",
        difficulty: "Mittel",
        description: "Filtere eingehende Daten nach bestimmten Kriterien",
        task: "Stelle sicher, dass die Daten bei neuen Excel-Zeilen gefiltert werden, bevor sie dauerhaft gespeichert werden",
        blocks: [
            { id: "wrong-send-email", icon: "📧", title: "E-Mail senden", description: "Aktion: E-Mail an Empfänger senden", type: "action", puzzleType: "horizontal" },
            { id: "action-save-db", icon: "💾", title: "In DB speichern", description: "Aktion: In Datenbank speichern", type: "action", puzzleType: "horizontal" },
            { id: "trigger-excel", icon: "📊", title: "Excel-Zeile", description: "Trigger: Neue Excel-Zeile", type: "trigger", puzzleType: "horizontal" },
            { id: "action-filter", icon: "🔍", title: "Daten filtern", description: "Aktion: Daten filtern", type: "action", puzzleType: "horizontal" },
            { id: "wrong-delete-row", icon: "🗑️", title: "Zeile löschen", description: "Aktion: Excel-Zeile entfernen", type: "action", puzzleType: "horizontal" }
        ],
        correctConnections: [
            { from: "trigger-excel", to: "action-filter", direction: "horizontal" },
            { from: "action-filter", to: "action-save-db", direction: "horizontal" }
        ],
        tutorialMessages: [
            "Willkommen zu Challenge 2! 📊",
            "Beim Arbeiten mit Daten ist es wichtig, nur relevante Informationen weiterzuverarbeiten.",
            "Denk daran: Erst der Trigger (neue Excel-Zeile), dann filtern, dann speichern!",
            "Tipp: Nicht alle Bausteine gehören in den Flow. Wähle nur die richtigen aus! 💡"
        ],
        successMessage: "Perfekt! Du kannst jetzt Daten filtern! 📊"
    },

    3: {
        name: "Bedingungen & Verzweigungen",
        difficulty: "Mittel-Schwer",
        description: "Verwende Bedingungen um den Flow zu steuern",
        task: "Verarbeite eingehende Formulare automatisch und sorge dafür, dass sie basierend auf einer Prüfung genehmigt oder abgelehnt werden",
        blocks: [
            { id: "trigger-form", icon: "📝", title: "Formular gesendet", description: "Trigger: Neues Formular", type: "trigger", puzzleType: "horizontal" },
            { id: "action-check-data", icon: "🔍", title: "Daten prüfen", description: "Aktion: Ja/Nein-Entscheidung ermitteln", type: "action", puzzleType: "horizontal" },
            { id: "condition-check", icon: "❓", title: "Bedingung", description: "Bedingung: Wert prüfen", type: "condition", puzzleType: "branch" },
            { id: "action-approve", icon: "✅", title: "Genehmigen", description: "Aktion: Genehmigen (Wenn ja)", type: "action", puzzleType: "vertical" },
            { id: "action-reject", icon: "❌", title: "Ablehnen", description: "Aktion: Ablehnen (Wenn nein)", type: "action", puzzleType: "vertical" },
            { id: "wrong-archive", icon: "📁", title: "Archivieren", description: "Aktion: Formular archivieren", type: "action", puzzleType: "vertical" }
        ],
        correctConnections: [
            { from: "trigger-form", to: "action-check-data", direction: "horizontal" },
            { from: "action-check-data", to: "condition-check", direction: "horizontal" },
            { from: "condition-check", to: "action-approve", direction: "vertical-top" },
            { from: "condition-check", to: "action-reject", direction: "vertical-bottom" }
        ],
        tutorialMessages: [
            "Challenge 3 wird spannend! 🌳",
            "Hier lernst du Verzweigungen: Der Flow teilt sich in zwei Pfade, 'Wenn ja' und 'Wenn nein'.",
            "Achte auf die Puzzle-Form: Der Bedingungsblock hat oben und unten Verbindungen!"
        ],
        successMessage: "Toll! Du beherrschst jetzt Verzweigungen! 🌳"
    },

    4: {
        name: "Wiederkehrende Automatisierung",
        difficulty: "Schwer",
        description: "Erstelle automatisierte Flows, die regelmäßig ausgeführt werden",
        task: "Täglich um 9 Uhr sollen alle offenen Tickets aus der SharePoint-Liste abgerufen, verarbeitet und per E-Mail versendet werden",
        blocks: [
            { id: "wrong-create-item", icon: "➕", title: "Eintrag erstellen", description: "Aktion: Neuen Eintrag anlegen", type: "action", puzzleType: "horizontal" },
            { id: "action-process", icon: "⚙️", title: "Daten verarbeiten", description: "Aktion: Ticket-Info formatieren", type: "action", puzzleType: "horizontal" },
            { id: "wrong-delete-list", icon: "🗑️", title: "Liste löschen", description: "Aktion: SharePoint-Liste entfernen", type: "action", puzzleType: "horizontal" },
            { id: "action-email", icon: "📧", title: "E-Mail senden", description: "Aktion: E-Mail an Zuständigen", type: "action", puzzleType: "horizontal" },
            { id: "trigger-scheduled", icon: "🔁", title: "Zeitgesteuert", description: "Wiederholt täglich um 9:00 Uhr", type: "trigger", puzzleType: "horizontal" },
            { id: "wrong-condition", icon: "❓", title: "Bedingung prüfen", description: "Bedingung: Wenn-Dann-Verzweigung", type: "condition", puzzleType: "branch" },
            { id: "action-get-items", icon: "📋", title: "Einträge abrufen", description: "Aktion: SharePoint-Einträge laden", type: "action", puzzleType: "horizontal" },
            { id: "wrong-update-item", icon: "✏️", title: "Eintrag aktualisieren", description: "Aktion: SharePoint-Eintrag bearbeiten", type: "action", puzzleType: "horizontal" }
        ],
        correctConnections: [
            { from: "trigger-scheduled", to: "action-get-items", direction: "horizontal" },
            { from: "action-get-items", to: "action-process", direction: "horizontal" },
            { from: "action-process", to: "action-email", direction: "horizontal" }
        ],
        tutorialMessages: [
            "Jetzt wird's fortgeschritten! 🔁",
            "Zeitgesteuerte Flows sind super praktisch: Sie laufen automatisch zu festgelegten Zeiten!",
            "Der Flow wiederholt sich JEDEN Tag zur gleichen Zeit, das spart viel manuelle Arbeit! 🚀",
            "Wichtig: In diesem Fall ist 'Zeitgesteuert' der Trigger, es startet den Flow. Deshalb kommt es zuerst!",
            "Tipp: Nicht alle Bausteine gehören in den Flow. Wähle nur die richtigen aus! 💡"
        ],
        successMessage: "Perfekt! Du beherrschst wiederkehrende Automatisierung! 🔁"
    },

    5: {
        name: "Komplexer Approval-Flow",
        difficulty: "Sehr Schwer",
        description: "Erstelle einen komplexen Genehmigungsworkflow",
        task: "Baue einen kompletten Approval-Flow mit mehreren Stufen",
        blocks: [
            { id: "wrong-send-email", icon: "📧", title: "E-Mail senden", description: "Aktion: E-Mail versenden", type: "action", puzzleType: "horizontal" },
            { id: "action-notify-yes", icon: "✅", title: "Bestätigung senden", description: "Aktion: Bestätigung an Antragsteller", type: "action", puzzleType: "vertical" },
            { id: "trigger-request", icon: "📬", title: "Antrag erstellt", description: "Trigger: Neuer Antrag", type: "trigger", puzzleType: "horizontal" },
            { id: "wrong-archive", icon: "📁", title: "Archivieren", description: "Aktion: Antrag archivieren", type: "action", puzzleType: "vertical" },
            { id: "action-get-manager", icon: "👤", title: "Manager abrufen", description: "Aktion: Vorgesetzten ermitteln", type: "action", puzzleType: "horizontal" },
            { id: "wrong-save-db", icon: "💾", title: "In DB speichern", description: "Aktion: In Datenbank speichern", type: "action", puzzleType: "horizontal" },
            { id: "condition-approved", icon: "❓", title: "Genehmigt?", description: "Bedingung: Genehmigt?", type: "condition", puzzleType: "branch" },
            { id: "action-approval", icon: "📝", title: "Genehmigung", description: "Aktion: Genehmigung anfordern", type: "action", puzzleType: "horizontal" },
            { id: "action-notify-no", icon: "❌", title: "Ablehnung senden", description: "Aktion: Ablehnung an Antragsteller", type: "action", puzzleType: "vertical" },
            { id: "wrong-forward", icon: "➡️", title: "Weiterleiten", description: "Aktion: An anderen Empfänger weiterleiten", type: "action", puzzleType: "horizontal" },
            { id: "wrong-scheduled", icon: "⏰", title: "Zeitgesteuert", description: "Trigger: Täglich wiederholen", type: "trigger", puzzleType: "horizontal" }
        ],
        correctConnections: [
            { from: "trigger-request", to: "action-get-manager", direction: "horizontal" },
            { from: "action-get-manager", to: "action-approval", direction: "horizontal" },
            { from: "action-approval", to: "condition-approved", direction: "horizontal" },
            { from: "condition-approved", to: "action-notify-yes", direction: "vertical-top" },
            { from: "condition-approved", to: "action-notify-no", direction: "vertical-bottom" }
        ],
        tutorialMessages: [
            "Willkommen zur finalen Challenge! 👑",
            "Ein Approval-Flow ist ein Genehmigungsprozess: Jemand stellt einen Antrag (z.B. Urlaub, Ausgaben), der von einem Vorgesetzten genehmigt oder abgelehnt werden muss.",
            "Baue diesen kompletten Workflow! Je nachdem ob genehmigt oder abgelehnt wurde, bekommt der Antragsteller eine unterschiedliche Nachricht. Viel Erfolg! 🚀"
        ],
        successMessage: "Unglaublich! Du bist ein Power Automate Profi! 👑"
    }
};

// ===== TXP ANIMATION CLASS =====
class TXPAssistant {
    static preloadedAnimations = {};

    static async preloadFrames() {
        if (Object.keys(TXPAssistant.preloadedAnimations).length > 0) {
            return Promise.resolve();
        }

        const animations = ['stand', 'talk'];
        const promises = [];

        for (const animName of animations) {
            const anim = TXP_ANIMATIONS[animName];
            TXPAssistant.preloadedAnimations[animName] = [];

            for (let i = 0; i < anim.frames; i++) {
                const img = new Image();
                const paddedNumber = String(i).padStart(5, '0');
                img.src = `${anim.path}${paddedNumber}.png`;
                TXPAssistant.preloadedAnimations[animName][i] = img;

                promises.push(new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                }));
            }
        }

        return Promise.all(promises);
    }

    constructor() {
        this.element = document.getElementById('txpAssistant');
        this.img = document.getElementById('txpAssistantImg');
        this.speechElement = document.getElementById('txpSpeech');
        this.speechText = document.getElementById('txpSpeechText');
        this.speechContinueHint = this.speechElement ? this.speechElement.querySelector('.speech-continue-hint') : null;

        this.currentAnimation = 'stand';
        this.currentFrame = 0;
        this.animationInterval = null;

        this.tutorialMessages = [];
        this.currentMessageIndex = 0;
        this.isInTutorialMode = false;

        this.startAnimation('stand');
        this.setupClickHandler();
    }

    setupClickHandler() {
        if (this.element) {
            this.element.addEventListener('click', () => {
                this.nextMessage();
            });
        }
        // Also allow clicking on the speech bubble itself
        if (this.speechElement) {
            this.speechElement.addEventListener('click', () => {
                this.nextMessage();
            });
            this.speechElement.style.cursor = 'pointer';
        }
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
        const frames = TXPAssistant.preloadedAnimations[this.currentAnimation];
        if (frames && frames[this.currentFrame]) {
            this.img.src = frames[this.currentFrame].src;
        }
    }

    show() {
        if (this.element) {
            this.element.style.display = 'block';
        }
    }

    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
    }

    showSpeech(message, showContinueHint = true) {
        if (this.speechElement && this.speechText) {
            this.speechText.textContent = message;
            this.speechElement.style.display = 'block';
            this.startAnimation('talk');

            // Show/hide continue hint based on parameter
            if (this.speechContinueHint) {
                this.speechContinueHint.style.display = showContinueHint ? 'block' : 'none';
            }
        }
    }

    hideSpeech() {
        if (this.speechElement) {
            this.speechElement.style.display = 'none';
            this.startAnimation('stand');
        }
    }

    startTutorial(messages) {
        this.isInTutorialMode = true;
        this.tutorialMessages = messages;
        this.currentMessageIndex = 0;
        if (messages.length > 0) {
            this.showSpeech(messages[0], true);
        }
    }

    showSuccessMessage(message) {
        this.isInTutorialMode = false;
        this.tutorialMessages = [];
        this.currentMessageIndex = 0;
        this.showSpeech(message, false); // No continue hint for success messages
    }

    nextMessage() {
        if (this.isInTutorialMode) {
            this.currentMessageIndex++;
            if (this.currentMessageIndex < this.tutorialMessages.length) {
                this.showSpeech(this.tutorialMessages[this.currentMessageIndex], true);
            } else {
                this.hideSpeech();
                this.isInTutorialMode = false;
            }
        } else {
            // If not in tutorial mode, restart tutorial from beginning
            if (this.tutorialMessages.length > 0) {
                this.isInTutorialMode = true;
                this.currentMessageIndex = 0;
                this.showSpeech(this.tutorialMessages[0], true);
            }
        }
    }
}

// ===== FLOW CANVAS ANIMATION (Titlescreen Background) =====
class FlowCanvasAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.animationId = null;

        this.resize();
        this.init();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // Create animated flow nodes
        const nodeCount = 15;
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: 20 + Math.random() * 20,
                color: this.getRandomColor()
            });
        }

        // Create connections
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                if (Math.random() > 0.7) {
                    this.connections.push({ from: i, to: j, opacity: Math.random() });
                }
            }
        }
    }

    getRandomColor() {
        const colors = ['#67C7FF', '#A86AFF', '#F5C03B'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw connections
        this.connections.forEach(conn => {
            const from = this.nodes[conn.from];
            const to = this.nodes[conn.to];

            this.ctx.beginPath();
            this.ctx.moveTo(from.x, from.y);
            this.ctx.lineTo(to.x, to.y);
            this.ctx.strokeStyle = `rgba(103, 199, 255, ${conn.opacity * 0.3})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Animate opacity
            conn.opacity += (Math.random() - 0.5) * 0.02;
            conn.opacity = Math.max(0.1, Math.min(1, conn.opacity));
        });

        // Update and draw nodes
        this.nodes.forEach(node => {
            // Update position
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;

            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = node.color + '40';
            this.ctx.fill();
            this.ctx.strokeStyle = node.color;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// ===== DRAG & DROP MANAGER =====
class DragDropManager {
    constructor(game) {
        this.game = game;
        this.draggedElement = null;
        this.draggedBlockId = null;
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.placedBlocks = []; // Blocks placed in whiteboard
        this.nextInstanceId = 0; // Counter for unique instance IDs

        // Multi-select
        this.selectedBlocks = [];
        this.isSelecting = false;
        this.selectionBox = null;
        this.selectionStart = { x: 0, y: 0 };

        // Easter egg: Track block placement/removal
        this.blockPlacementCounter = {}; // {blockId: count}
        this.easterEggTriggered = {};

        this.setupEventListeners();
        this.createSelectionBox();
    }

    setupEventListeners() {
        // Mouse events
        document.addEventListener('mousedown', (e) => this.handleDragStart(e));
        document.addEventListener('mousemove', (e) => this.handleDrag(e));
        document.addEventListener('mouseup', (e) => this.handleDragEnd(e));

        // Touch events for mobile
        document.addEventListener('touchstart', (e) => this.handleDragStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.handleDrag(e), { passive: false });
        document.addEventListener('touchend', (e) => this.handleDragEnd(e));
    }

    handleDragStart(e) {
        const target = e.target.closest('.flow-block');
        if (!target) return;

        // Prevent dragging if game is paused
        if (this.game.isPaused) return;

        e.preventDefault();

        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const rect = target.getBoundingClientRect();
        this.offsetX = clientX - rect.left;
        this.offsetY = clientY - rect.top;

        // Clone the block for dragging
        this.draggedElement = target.cloneNode(true);
        this.draggedElement.classList.add('dragging');
        this.draggedElement.style.position = 'fixed';
        this.draggedElement.style.width = rect.width + 'px';
        this.draggedElement.style.pointerEvents = 'none';
        this.draggedElement.style.zIndex = '9999';
        this.draggedElement.style.transition = 'none'; // Disable CSS transitions for instant movement
        document.body.appendChild(this.draggedElement);

        this.draggedBlockId = target.dataset.blockId;
        this.isDragging = true;

        this.updateDragPosition(clientX, clientY);
    }

    handleDrag(e) {
        if (!this.isDragging || !this.draggedElement) return;

        e.preventDefault();

        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        this.updateDragPosition(clientX, clientY);
    }

    updateDragPosition(clientX, clientY) {
        if (!this.draggedElement) return;

        this.draggedElement.style.left = (clientX - this.offsetX) + 'px';
        this.draggedElement.style.top = (clientY - this.offsetY) + 'px';
    }

    handleDragEnd(e) {
        if (!this.isDragging || !this.draggedElement) return;

        e.preventDefault();

        const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
        const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);

        // Check if dropped on whiteboard
        const whiteboard = document.getElementById('whiteboardContent');
        const whiteboardRect = whiteboard.getBoundingClientRect();

        if (this.isPointInRect(clientX, clientY, whiteboardRect)) {
            // Calculate position relative to whiteboard
            const x = clientX - whiteboardRect.left - this.offsetX;
            const y = clientY - whiteboardRect.top - this.offsetY;

            // Snap to grid
            const snappedX = this.snapToGrid(x);
            const snappedY = this.snapToGrid(y);

            this.placeBlock(this.draggedBlockId, snappedX, snappedY);
        }

        // Cleanup
        if (this.draggedElement && this.draggedElement.parentNode) {
            this.draggedElement.parentNode.removeChild(this.draggedElement);
        }
        this.draggedElement = null;
        this.draggedBlockId = null;
        this.isDragging = false;
    }

    isPointInRect(x, y, rect) {
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }

    snapToGrid(value) {
        return Math.round(value / GAME_CONFIG.gridSize) * GAME_CONFIG.gridSize;
    }

    checkAndConnectBlocks(instanceId) {
        const draggedBlock = this.placedBlocks.find(b => b.instanceId === instanceId);
        if (!draggedBlock) return;

        const SNAP_THRESHOLD = 150; // Detection distance
        const SNAP_TOLERANCE = 5; // Precision for connected state

        let bestSnapTarget = null;
        let bestSnapDistance = SNAP_THRESHOLD;
        let bestSnapType = null;

        // Find the best snap target
        this.placedBlocks.forEach(targetBlock => {
            if (targetBlock.instanceId === draggedBlock.instanceId) return;

            const yDiff = Math.abs(draggedBlock.y - targetBlock.y);

            // HORIZONTAL SNAPPING: Check if dragged can snap to LEFT of target
            if ((draggedBlock.puzzleType === 'horizontal' || draggedBlock.puzzleType === 'branch') && yDiff < 30) {
                const draggedRight = draggedBlock.x + draggedBlock.element.offsetWidth;
                const targetLeft = targetBlock.x;
                const xDistance = Math.abs(draggedRight - targetLeft);

                if (xDistance < bestSnapDistance) {
                    bestSnapDistance = xDistance;
                    bestSnapTarget = targetBlock;
                    bestSnapType = 'snap-to-left-of-target';
                }
            }

            // HORIZONTAL SNAPPING: Check if dragged can snap to RIGHT of target
            if ((targetBlock.puzzleType === 'horizontal' || targetBlock.puzzleType === 'branch') && yDiff < 30) {
                const targetRight = targetBlock.x + targetBlock.element.offsetWidth;
                const draggedLeft = draggedBlock.x;
                const xDistance = Math.abs(targetRight - draggedLeft);

                if (xDistance < bestSnapDistance) {
                    bestSnapDistance = xDistance;
                    bestSnapTarget = targetBlock;
                    bestSnapType = 'snap-to-right-of-target';
                }
            }

            // VERTICAL SNAPPING
            const draggedCenterX = draggedBlock.x + draggedBlock.element.offsetWidth / 2;
            const targetCenterX = targetBlock.x + targetBlock.element.offsetWidth / 2;
            const xDiff = Math.abs(draggedCenterX - targetCenterX);

            // VERTICAL SNAPPING: Vertical Block to Branch Top Tab
            if (draggedBlock.puzzleType === 'vertical' && targetBlock.puzzleType === 'branch' && xDiff < 50) {
                const targetTop = targetBlock.y;
                const draggedBottom = draggedBlock.y + draggedBlock.element.offsetHeight;
                const yDistance = Math.abs(targetTop - draggedBottom);

                if (yDistance < bestSnapDistance) {
                    bestSnapDistance = yDistance;
                    bestSnapTarget = targetBlock;
                    bestSnapType = 'snap-vertical-to-branch-top';
                }
            }

            // VERTICAL SNAPPING: Vertical Block to Branch Bottom Tab
            if (draggedBlock.puzzleType === 'vertical' && targetBlock.puzzleType === 'branch' && xDiff < 50) {
                const targetBottom = targetBlock.y + targetBlock.element.offsetHeight;
                const draggedTop = draggedBlock.y;
                const yDistance = Math.abs(targetBottom - draggedTop);

                if (yDistance < bestSnapDistance) {
                    bestSnapDistance = yDistance;
                    bestSnapTarget = targetBlock;
                    bestSnapType = 'snap-vertical-to-branch-bottom';
                }
            }
        });

        // Apply snap if we found a good target
        if (bestSnapTarget && bestSnapType) {
            // Add visual feedback
            draggedBlock.element.classList.add('snapping');

            setTimeout(() => {
                switch (bestSnapType) {
                    case 'snap-to-left-of-target':
                        // Position dragged block to the LEFT of target
                        draggedBlock.x = bestSnapTarget.x - draggedBlock.element.offsetWidth;
                        draggedBlock.y = bestSnapTarget.y;
                        break;
                    case 'snap-to-right-of-target':
                        // Position dragged block to the RIGHT of target
                        draggedBlock.x = bestSnapTarget.x + bestSnapTarget.element.offsetWidth;
                        draggedBlock.y = bestSnapTarget.y;
                        break;
                    case 'snap-vertical-to-branch-top':
                        // Vertical block connects ABOVE the branch block (to the top tab)
                        draggedBlock.y = bestSnapTarget.y - draggedBlock.element.offsetHeight;
                        draggedBlock.x = bestSnapTarget.x + (bestSnapTarget.element.offsetWidth / 2) - (draggedBlock.element.offsetWidth / 2);
                        break;
                    case 'snap-vertical-to-branch-bottom':
                        // Vertical block connects BELOW the branch block (to the bottom tab)
                        draggedBlock.y = bestSnapTarget.y + bestSnapTarget.element.offsetHeight;
                        draggedBlock.x = bestSnapTarget.x + (bestSnapTarget.element.offsetWidth / 2) - (draggedBlock.element.offsetWidth / 2);
                        break;
                }

                draggedBlock.element.style.left = draggedBlock.x + 'px';
                draggedBlock.element.style.top = draggedBlock.y + 'px';
                draggedBlock.element.classList.remove('snapping');
                draggedBlock.element.classList.add('snap-animation');

                setTimeout(() => draggedBlock.element.classList.remove('snap-animation'), 300);

                // Rebuild connections AFTER snap position is updated
                this.rebuildAllConnections();
            }, 50);
        } else {
            // No snap happened, rebuild connections immediately
            this.rebuildAllConnections();
        }
    }

    rebuildAllConnections() {
        // Clear all connections
        this.placedBlocks.forEach(b => b.connectedTo = []);

        // Very tight tolerance - blocks must be perfectly aligned (within 5px)
        // This ensures only snapped blocks are considered connected
        const CONNECTION_TOLERANCE = 5;

        console.log('=== REBUILD CONNECTIONS ===');

        // Build connections based on precise positioning
        this.placedBlocks.forEach(currentBlock => {
            this.placedBlocks.forEach(otherBlock => {
                if (otherBlock.instanceId === currentBlock.instanceId) return;

                // Horizontal connections
                if (currentBlock.puzzleType === 'horizontal' || currentBlock.puzzleType === 'branch') {
                    const rightEdge = currentBlock.x + currentBlock.element.offsetWidth;
                    const leftEdge = otherBlock.x;
                    const yAlign = Math.abs(currentBlock.y - otherBlock.y);
                    const xDiff = Math.abs(rightEdge - leftEdge);

                    console.log(`Checking ${currentBlock.id} -> ${otherBlock.id}:`, {
                        currentX: currentBlock.x,
                        currentWidth: currentBlock.element.offsetWidth,
                        rightEdge: rightEdge,
                        otherX: otherBlock.x,
                        leftEdge: leftEdge,
                        xDiff: xDiff,
                        yAlign: yAlign,
                        connected: xDiff < CONNECTION_TOLERANCE && yAlign < CONNECTION_TOLERANCE
                    });

                    if (xDiff < CONNECTION_TOLERANCE && yAlign < CONNECTION_TOLERANCE) {
                        currentBlock.connectedTo.push({ instanceId: otherBlock.instanceId, direction: 'horizontal' });
                        console.log(`✓ Connection added: ${currentBlock.id} -> ${otherBlock.id}`);
                    }
                }

                // Vertical connections from branch blocks
                if (currentBlock.puzzleType === 'branch') {
                    const currentCenterX = currentBlock.x + currentBlock.element.offsetWidth / 2;
                    const otherCenterX = otherBlock.x + otherBlock.element.offsetWidth / 2;
                    const xAlign = Math.abs(currentCenterX - otherCenterX);

                    // Top connection
                    const currentBottom = currentBlock.y + currentBlock.element.offsetHeight;
                    const otherTop = otherBlock.y;
                    if (Math.abs(currentBottom - otherTop) < CONNECTION_TOLERANCE && xAlign < CONNECTION_TOLERANCE) {
                        currentBlock.connectedTo.push({ instanceId: otherBlock.instanceId, direction: 'vertical-bottom' });
                    }

                    // Bottom connection - FIXED: dragged block is ABOVE
                    const currentTop = currentBlock.y;
                    const otherBottom = otherBlock.y + otherBlock.element.offsetHeight;
                    if (Math.abs(currentTop - otherBottom) < CONNECTION_TOLERANCE && xAlign < CONNECTION_TOLERANCE) {
                        currentBlock.connectedTo.push({ instanceId: otherBlock.instanceId, direction: 'vertical-top' });
                    }
                }
            });
        });

        // Update visual connection states (hide tabs/notches at connections)
        this.updateConnectionVisuals();
    }

    updateConnectionVisuals() {
        // First, remove all connection classes
        this.placedBlocks.forEach(block => {
            block.element.classList.remove('connected-right', 'connected-left', 'connected-top', 'connected-bottom');
        });

        // Then add connection classes based on current connections
        this.placedBlocks.forEach(block => {
            block.connectedTo.forEach(connection => {
                if (connection.direction === 'horizontal') {
                    // Current block is connected on the right
                    block.element.classList.add('connected-right');

                    // Find the connected block and mark its left as connected
                    const connectedBlock = this.placedBlocks.find(b => b.instanceId === connection.instanceId);
                    if (connectedBlock) {
                        connectedBlock.element.classList.add('connected-left');
                    }
                } else if (connection.direction === 'vertical-top') {
                    // Current block (branch) is connected on top
                    block.element.classList.add('connected-top');

                    // Find the connected block and mark its bottom as connected
                    const connectedBlock = this.placedBlocks.find(b => b.instanceId === connection.instanceId);
                    if (connectedBlock) {
                        connectedBlock.element.classList.add('connected-bottom');
                    }
                } else if (connection.direction === 'vertical-bottom') {
                    // Current block (branch) is connected on bottom
                    block.element.classList.add('connected-bottom');

                    // Find the connected block and mark its top as connected
                    const connectedBlock = this.placedBlocks.find(b => b.instanceId === connection.instanceId);
                    if (connectedBlock) {
                        connectedBlock.element.classList.add('connected-top');
                    }
                }
            });
        });
    }

    placeBlock(blockId, x, y) {
        const challengeData = CHALLENGE_DATA[this.game.currentChallenge];
        const blockData = challengeData.blocks.find(b => b.id === blockId);
        if (!blockData) return;

        // Create unique instance ID
        const instanceId = `instance-${this.nextInstanceId++}`;

        // Create placed block element using game's createPuzzleBlockElement
        const blockElement = this.game.createPuzzleBlockElement(blockData);
        blockElement.classList.add('placed');
        blockElement.style.position = 'absolute';
        blockElement.style.left = x + 'px';
        blockElement.style.top = y + 'px';
        blockElement.dataset.instanceId = instanceId; // Store unique instance ID

        // Remove description from placed blocks (keep icon and title only)
        const description = blockElement.querySelector('.flow-block-description');
        if (description) description.remove();

        // Make it moveable
        this.makePlacedBlockDraggable(blockElement);

        // Add to whiteboard
        const whiteboard = document.getElementById('whiteboardContent');
        whiteboard.appendChild(blockElement);

        // Track placed block
        this.placedBlocks.push({
            id: blockId, // Original block type ID
            instanceId: instanceId, // Unique instance ID
            element: blockElement,
            x: x,
            y: y,
            puzzleType: blockData.puzzleType,
            connectedTo: [] // Track connections
        });

        // Easter egg: Track block placement
        if (!this.blockPlacementCounter[blockId]) {
            this.blockPlacementCounter[blockId] = 0;
        }
        this.blockPlacementCounter[blockId]++;

        // Easter egg: Trigger when same block placed 2+ times
        if (this.blockPlacementCounter[blockId] >= 2 && !this.easterEggTriggered[blockId]) {
            this.easterEggTriggered[blockId] = true;
            this.triggerBlockEasterEgg(blockId);
        }

        // Try to auto-connect nearby blocks
        this.checkAndConnectBlocks(instanceId);
    }

    makePlacedBlockDraggable(element) {
        let isDragging = false;
        let startX, startY, initialX, initialY;
        let onMouseMove, onMouseUp;

        const onMouseDown = (e) => {
            if (this.game.isPaused) return;
            isDragging = true;
            startX = e.clientX || (e.touches && e.touches[0].clientX);
            startY = e.clientY || (e.touches && e.touches[0].clientY);
            initialX = parseInt(element.style.left);
            initialY = parseInt(element.style.top);
            element.style.zIndex = '100';
            element.style.cursor = 'grabbing';
            element.style.transition = 'none'; // Disable transition for instant movement
            e.preventDefault();
            e.stopPropagation();

            // Add move and up listeners only when dragging starts
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('touchmove', onMouseMove, { passive: false });
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('touchend', onMouseUp);
        };

        onMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const currentX = e.clientX || (e.touches && e.touches[0].clientX);
            const currentY = e.clientY || (e.touches && e.touches[0].clientY);
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;

            // Calculate new position
            let newX = initialX + deltaX;
            let newY = initialY + deltaY;

            // Get whiteboard bounds
            const whiteboard = document.getElementById('whiteboardContent');
            const whiteboardRect = whiteboard.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            // Check if this block is selected and move all selected blocks together
            const instanceId = element.dataset.instanceId;
            const currentBlock = this.placedBlocks.find(b => b.instanceId === instanceId && b.element === element);
            const isSelected = currentBlock && this.selectedBlocks.includes(currentBlock);

            // Constrain within whiteboard boundaries
            const minX = 0;
            const minY = 0;
            const maxX = whiteboardRect.width - elementRect.width;
            const maxY = whiteboardRect.height - elementRect.height;

            newX = Math.max(minX, Math.min(maxX, newX));
            newY = Math.max(minY, Math.min(maxY, newY));

            // Use transform for smoother performance
            const constrainedDeltaX = newX - initialX;
            const constrainedDeltaY = newY - initialY;
            element.style.transform = `translate(${constrainedDeltaX}px, ${constrainedDeltaY}px)`;

            // If block is selected, move all selected blocks together
            if (isSelected && this.selectedBlocks.length > 1) {
                this.selectedBlocks.forEach(block => {
                    if (block.element !== element) {
                        const blockNewX = block.x + constrainedDeltaX;
                        const blockNewY = block.y + constrainedDeltaY;
                        block.element.style.transform = `translate(${constrainedDeltaX}px, ${constrainedDeltaY}px)`;
                    }
                });
            }

            // Check if over trash zone
            this.checkTrashZoneHover(currentX, currentY);
        };

        onMouseUp = (e) => {
            if (!isDragging) return;
            isDragging = false;

            // Remove listeners immediately
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('touchmove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('touchend', onMouseUp);

            // Calculate final position
            const currentX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
            const currentY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);

            // Check if dropped on trash zone
            const trashZone = document.getElementById('trashZone');
            if (trashZone) {
                trashZone.classList.remove('drag-over');
                const trashRect = trashZone.getBoundingClientRect();
                if (currentX >= trashRect.left && currentX <= trashRect.right &&
                    currentY >= trashRect.top && currentY <= trashRect.bottom) {
                    // Element dropped on trash zone - remove it
                    const instanceId = element.dataset.instanceId;
                    const block = this.placedBlocks.find(b => b.instanceId === instanceId && b.element === element);
                    const isSelected = block && this.selectedBlocks.includes(block);

                    // If block is selected, remove all selected blocks
                    if (isSelected && this.selectedBlocks.length > 1) {
                        const blocksToRemove = [...this.selectedBlocks];
                        blocksToRemove.forEach(selectedBlock => {
                            this.removeBlock(selectedBlock.element);
                        });
                    } else {
                        this.removeBlock(element);
                    }
                    return;
                }
            }

            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            let newX = initialX + deltaX;
            let newY = initialY + deltaY;

            // Get whiteboard bounds for constraining
            const whiteboard = document.getElementById('whiteboardContent');
            const whiteboardRect = whiteboard.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            // Constrain within boundaries
            const minX = 0;
            const minY = 0;
            const maxX = whiteboardRect.width - elementRect.width;
            const maxY = whiteboardRect.height - elementRect.height;

            newX = Math.max(minX, Math.min(maxX, newX));
            newY = Math.max(minY, Math.min(maxY, newY));

            // Snap to grid
            const snappedX = this.snapToGrid(newX);
            const snappedY = this.snapToGrid(newY);

            // Apply final position and remove transform
            element.style.transform = '';
            element.style.left = snappedX + 'px';
            element.style.top = snappedY + 'px';
            element.style.zIndex = '1';
            element.style.cursor = 'move';
            element.style.transition = ''; // Re-enable transitions

            // Update placed blocks array
            const instanceId = element.dataset.instanceId;
            const block = this.placedBlocks.find(b => b.instanceId === instanceId && b.element === element);
            if (block) {
                block.x = snappedX;
                block.y = snappedY;
            }

            // If block is selected, update all selected blocks positions
            const isSelected = block && this.selectedBlocks.includes(block);
            if (isSelected && this.selectedBlocks.length > 1) {
                const deltaX = snappedX - initialX;
                const deltaY = snappedY - initialY;

                this.selectedBlocks.forEach(selectedBlock => {
                    if (selectedBlock.element !== element) {
                        const newBlockX = this.snapToGrid(selectedBlock.x + deltaX);
                        const newBlockY = this.snapToGrid(selectedBlock.y + deltaY);

                        selectedBlock.element.style.transform = '';
                        selectedBlock.element.style.left = newBlockX + 'px';
                        selectedBlock.element.style.top = newBlockY + 'px';
                        selectedBlock.x = newBlockX;
                        selectedBlock.y = newBlockY;
                    }
                });
            }

            // Check for connections with other blocks
            this.checkAndConnectBlocks(instanceId);
        };

        element.addEventListener('mousedown', onMouseDown);
        element.addEventListener('touchstart', onMouseDown, { passive: false });

        // Double-click to remove
        element.addEventListener('dblclick', () => {
            if (this.game.isPaused) return;
            this.removeBlock(element);
        });
    }

    removeBlock(element) {
        const instanceId = element.dataset.instanceId;
        const block = this.placedBlocks.find(b => b.instanceId === instanceId && b.element === element);

        // Remove from selected blocks if selected
        if (block && this.selectedBlocks.includes(block)) {
            this.deselectBlock(block);
        }

        this.placedBlocks = this.placedBlocks.filter(b => b.element !== element);
        element.remove();
        // Rebuild connections after removing
        this.rebuildAllConnections();
    }

    triggerBlockEasterEgg(blockId) {
        if (this.game.txp) {
            const messages = [
                "Du magst diesen Block wohl besonders! 😉",
                "Dieser Block gefällt dir, oder? 🤔",
                "Vielleicht probierst du mal einen anderen Block? 😄",
                "Okay, ich habe verstanden - das ist dein Lieblingsblock! ❤️"
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            this.game.txp.showSuccessMessage(randomMessage);
            setTimeout(() => {
                if (this.game.txp) this.game.txp.hideSpeech();
            }, 3000);
        }
    }

    checkTrashZoneHover(mouseX, mouseY) {
        const trashZone = document.getElementById('trashZone');
        if (!trashZone) return;

        const trashRect = trashZone.getBoundingClientRect();
        const isOver = mouseX >= trashRect.left && mouseX <= trashRect.right &&
                       mouseY >= trashRect.top && mouseY <= trashRect.bottom;

        if (isOver) {
            trashZone.classList.add('drag-over');
        } else {
            trashZone.classList.remove('drag-over');
        }
    }

    getPlacedSequence() {
        // Sort blocks by X position (left to right) for horizontal flows
        const sortedBlocks = [...this.placedBlocks].sort((a, b) => a.x - b.x);
        return sortedBlocks.map(block => block.id);
    }

    clearWhiteboard() {
        this.placedBlocks.forEach(block => {
            if (block.element && block.element.parentNode) {
                block.element.remove();
            }
        });
        this.placedBlocks = [];
        this.clearSelection();
    }

    // ===== MULTI-SELECT FUNCTIONALITY =====
    createSelectionBox() {
        this.selectionBox = document.createElement('div');
        this.selectionBox.className = 'selection-box';
        const whiteboard = document.getElementById('whiteboardContent');
        if (whiteboard) {
            whiteboard.appendChild(this.selectionBox);

            // Add mousedown listener to whiteboard for selection
            whiteboard.addEventListener('mousedown', (e) => {
                // Only start selection if clicking on whiteboard itself (not on a block)
                if (e.target.closest('.flow-block') || this.game.isPaused) return;
                this.startSelection(e);
            });
        }
    }

    startSelection(e) {
        const whiteboard = document.getElementById('whiteboardContent');
        const rect = whiteboard.getBoundingClientRect();

        this.isSelecting = true;
        this.selectionStart = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        // Clear previous selection
        this.clearSelection();

        this.selectionBox.style.left = this.selectionStart.x + 'px';
        this.selectionBox.style.top = this.selectionStart.y + 'px';
        this.selectionBox.style.width = '0px';
        this.selectionBox.style.height = '0px';
        this.selectionBox.style.display = 'block';

        // Add move and up listeners
        const onMove = (e) => this.updateSelection(e);
        const onUp = (e) => {
            this.endSelection(e);
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }

    updateSelection(e) {
        if (!this.isSelecting) return;

        const whiteboard = document.getElementById('whiteboardContent');
        const rect = whiteboard.getBoundingClientRect();

        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const width = Math.abs(currentX - this.selectionStart.x);
        const height = Math.abs(currentY - this.selectionStart.y);
        const left = Math.min(currentX, this.selectionStart.x);
        const top = Math.min(currentY, this.selectionStart.y);

        this.selectionBox.style.left = left + 'px';
        this.selectionBox.style.top = top + 'px';
        this.selectionBox.style.width = width + 'px';
        this.selectionBox.style.height = height + 'px';
    }

    endSelection(e) {
        if (!this.isSelecting) return;

        this.isSelecting = false;
        this.selectionBox.style.display = 'none';

        // Get selection box bounds
        const selectionRect = {
            left: parseFloat(this.selectionBox.style.left),
            top: parseFloat(this.selectionBox.style.top),
            width: parseFloat(this.selectionBox.style.width),
            height: parseFloat(this.selectionBox.style.height)
        };
        selectionRect.right = selectionRect.left + selectionRect.width;
        selectionRect.bottom = selectionRect.top + selectionRect.height;

        // Check which blocks are in selection
        this.placedBlocks.forEach(block => {
            const blockRect = {
                left: block.x,
                top: block.y,
                width: block.element.offsetWidth,
                height: block.element.offsetHeight
            };
            blockRect.right = blockRect.left + blockRect.width;
            blockRect.bottom = blockRect.top + blockRect.height;

            // Check if block intersects with selection
            const intersects = !(
                blockRect.right < selectionRect.left ||
                blockRect.left > selectionRect.right ||
                blockRect.bottom < selectionRect.top ||
                blockRect.top > selectionRect.bottom
            );

            if (intersects) {
                this.selectBlock(block);
            }
        });
    }

    selectBlock(block) {
        if (!this.selectedBlocks.includes(block)) {
            this.selectedBlocks.push(block);
            block.element.classList.add('selected');
        }
    }

    deselectBlock(block) {
        const index = this.selectedBlocks.indexOf(block);
        if (index > -1) {
            this.selectedBlocks.splice(index, 1);
            block.element.classList.remove('selected');
        }
    }

    clearSelection() {
        this.selectedBlocks.forEach(block => {
            block.element.classList.remove('selected');
        });
        this.selectedBlocks = [];
    }
}

// ===== MAIN GAME CLASS =====
class PowerAutomateGame {
    constructor() {
        // Game state
        this.currentChallenge = 1;
        this.currentScreen = 'intro';
        this.isPaused = false;
        this.totalPoints = 0;
        this.startTime = null;
        this.challengeStartTime = null;
        this.completedChallenges = [];

        // Game objects
        this.txp = null;
        this.dragDropManager = null;
        this.flowCanvas = null;

        this.setupInputHandlers();
        this.loadProgress();
        this.init();
    }

    async init() {
        // Show intro screen
        this.showScreen('introScreen');

        // Initialize flow canvas animation
        const canvas = document.getElementById('flowCanvas');
        if (canvas) {
            this.flowCanvas = new FlowCanvasAnimation(canvas);
            this.flowCanvas.start();
        }

        // Setup intro screen interactions (keyboard + mouse/touch)
        this.setupIntroHandlers();

        // Update rank badge on init
        this.updateRankBadge();
    }

    setupIntroHandlers() {
        const introContent = document.querySelector('.intro-content');
        const pressKeyElement = document.getElementById('pressKey');

        const startGame = async () => {
            // Remove event listeners
            document.removeEventListener('keydown', onKeyPress);
            if (introContent) {
                introContent.removeEventListener('click', onIntroClick);
            }
            if (pressKeyElement) {
                pressKeyElement.removeEventListener('click', onPressKeyClick);
            }

            if (this.flowCanvas) this.flowCanvas.stop();
            await this.startLoading();
        };

        const onKeyPress = (e) => {
            startGame();
        };

        const onIntroClick = () => {
            startGame();
        };

        const onPressKeyClick = (e) => {
            e.stopPropagation();
            startGame();
        };

        // Keyboard
        document.addEventListener('keydown', onKeyPress);

        // Mouse/Touch on whole intro content
        if (introContent) {
            introContent.addEventListener('click', onIntroClick);
        }

        // Extra listener on press-key element for clarity
        if (pressKeyElement) {
            pressKeyElement.addEventListener('click', onPressKeyClick);
            pressKeyElement.style.cursor = 'pointer';
        }
    }

    async startLoading() {
        this.showScreen('loadingScreen');

        // Preload TXP animations
        await TXPAssistant.preloadFrames();

        // Simulate loading
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

    showLevelSelect() {
        this.showScreen('levelSelectScreen');
        this.updateLevelSelectUI();
        this.setupLevelClickHandlers();
        this.updateRankBadge(); // Show rank badge in level select
        this.setupLevelSelectEasterEgg(); // Easter egg: Fireworks on empty clicks
    }

    setupLevelSelectEasterEgg() {
        const levelSelectContainer = document.querySelector('.level-select-container');
        if (!levelSelectContainer) return;

        levelSelectContainer.addEventListener('click', (e) => {
            // Check if click is on empty area (not on a card or button)
            if (e.target.classList.contains('level-select-container') ||
                e.target.closest('.level-select-title') ||
                e.target.closest('.level-select-subtitle')) {
                this.createFireworks(e.clientX, e.clientY);
            }
        });
    }

    createFireworks(x, y) {
        const colors = ['#67C7FF', '#A86AFF', '#F5C03B'];
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            particle.style.boxShadow = `0 0 10px ${particle.style.backgroundColor}`;

            document.body.appendChild(particle);

            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 3 + Math.random() * 2;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            let posX = x;
            let posY = y;
            let opacity = 1;
            let velocityY = vy;

            const animate = () => {
                posX += vx;
                posY += velocityY;
                velocityY += 0.2; // gravity
                opacity -= 0.02;

                particle.style.left = posX + 'px';
                particle.style.top = posY + 'px';
                particle.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };

            animate();
        }
    }

    updateLevelSelectUI() {
        console.log('=== UPDATE LEVEL SELECT UI ===');
        console.log('Total Points:', this.totalPoints);
        console.log('Completed Challenges:', this.completedChallenges);

        // Update total points display
        const totalPointsDisplay = document.getElementById('totalPointsDisplay');
        const currentRankDisplay = document.getElementById('currentRankDisplay');

        if (totalPointsDisplay) {
            totalPointsDisplay.textContent = `${this.totalPoints} / 500`;
        }

        if (currentRankDisplay) {
            const rank = this.calculateTotalRank();
            currentRankDisplay.textContent = rank;
        }

        // Update challenge cards status
        for (let i = 1; i <= GAME_CONFIG.totalChallenges; i++) {
            const cardElement = document.querySelector(`.challenge-card[data-level="${i}"]`);
            if (!cardElement) continue;

            const isUnlocked = this.isChallengeUnlocked(i);
            const isCompleted = this.isChallengeCompleted(i);

            console.log(`Challenge ${i}: unlocked=${isUnlocked}, completed=${isCompleted}`);

            // Update points display
            const pointsElement = cardElement.querySelector('.challenge-points');
            if (pointsElement) {
                pointsElement.textContent = isCompleted ? '100/100 Punkte' : '0/100 Punkte';
            }

            // Update unlock status
            if (isUnlocked) {
                cardElement.classList.remove('locked');
                cardElement.classList.add('unlocked');
                cardElement.style.opacity = '1';
                cardElement.style.filter = 'none';
                cardElement.style.cursor = 'pointer';
                cardElement.style.pointerEvents = 'auto';

                const statusElement = cardElement.querySelector('.challenge-status');
                if (statusElement && !isCompleted) {
                    statusElement.textContent = '▶ Starten';
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
                    statusElement.textContent = '🔒 Gesperrt';
                    statusElement.style.color = 'rgba(255, 255, 255, 0.5)';
                }
            }

            // Update completed status
            if (isCompleted) {
                cardElement.classList.add('completed');
                const statusElement = cardElement.querySelector('.challenge-status');
                if (statusElement) {
                    statusElement.textContent = '✓ Abgeschlossen';
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
            cardElement.addEventListener('click', () => {
                const level = parseInt(cardElement.dataset.level);
                if (this.isChallengeUnlocked(level)) {
                    this.startChallenge(level);
                }
            });
        });
    }

    startChallenge(challengeNum) {
        this.currentChallenge = challengeNum;
        this.challengeStartTime = Date.now();

        // Show editor screen
        this.showScreen('editorScreen');

        // Initialize TXP
        if (!this.txp) {
            this.txp = new TXPAssistant();
        }
        this.txp.show();

        // Initialize drag & drop
        if (!this.dragDropManager) {
            this.dragDropManager = new DragDropManager(this);
        } else {
            this.dragDropManager.clearWhiteboard();
        }

        // Load challenge data
        this.loadChallengeUI();

        // Show tutorial messages if available
        const challengeData = CHALLENGE_DATA[challengeNum];
        if (challengeData.tutorialMessages && challengeData.tutorialMessages.length > 0) {
            // Show tutorial overlay only for Challenge 1
            if (challengeNum === 1) {
                this.showTutorial();
            }
            this.txp.startTutorial(challengeData.tutorialMessages);
        }

        // Update HUD
        this.updateHUD();
    }

    createPuzzleBlockElement(blockData) {
        const blockElement = document.createElement('div');
        blockElement.className = 'flow-block puzzle-' + blockData.puzzleType;
        blockElement.dataset.blockId = blockData.id;
        blockElement.dataset.puzzleType = blockData.puzzleType;

        // Background layer - rendered first so z-index works correctly
        let innerHTML = `<div class="flow-block-background"></div>`;

        // Base content
        innerHTML += `
            <div class="flow-block-icon">${blockData.icon}</div>
            <div class="flow-block-title">${blockData.title}</div>
            <div class="flow-block-description">${blockData.description}</div>
        `;

        // Add branch labels for condition blocks
        if (blockData.puzzleType === 'branch') {
            innerHTML += `
                <div class="branch-labels">
                    <div>↑ Wenn ja</div>
                    <div>↓ Wenn nein</div>
                </div>
            `;
        }

        // Add tabs for branch type
        if (blockData.puzzleType === 'branch') {
            innerHTML += `
                <div class="branch-tab-top"></div>
                <div class="branch-tab-bottom"></div>
            `;
        }

        // Add notches for vertical type
        if (blockData.puzzleType === 'vertical') {
            innerHTML += `
                <div class="vertical-notch-top"></div>
                <div class="vertical-notch-bottom"></div>
            `;
        }

        blockElement.innerHTML = innerHTML;
        return blockElement;
    }

    loadChallengeUI() {
        const challengeData = CHALLENGE_DATA[this.currentChallenge];

        // Update challenge display
        const challengeDisplay = document.getElementById('challengeDisplay');
        const challengeText = document.getElementById('challengeText');
        if (challengeDisplay && challengeText) {
            challengeDisplay.style.display = 'flex';
            challengeText.textContent = challengeData.task;
        }

        // Load flow blocks into palette
        const paletteItems = document.getElementById('paletteItems');
        if (paletteItems) {
            paletteItems.innerHTML = '';
            challengeData.blocks.forEach(block => {
                const blockElement = this.createPuzzleBlockElement(block);
                paletteItems.appendChild(blockElement);
            });
        }

        // Setup buttons
        const clearBtn = document.getElementById('clearBtn');
        const validateBtn = document.getElementById('validateBtn');

        if (clearBtn) {
            clearBtn.onclick = () => this.clearWhiteboard();
        }

        if (validateBtn) {
            validateBtn.onclick = () => this.validateFlow();
        }
    }

    showTutorial() {
        const tutorialOverlay = document.getElementById('tutorialOverlay');
        if (tutorialOverlay) {
            tutorialOverlay.style.display = 'flex';
        }
    }

    clearWhiteboard() {
        if (this.dragDropManager) {
            this.dragDropManager.clearWhiteboard();
        }
    }

    validateFlow() {
        if (!this.dragDropManager) return;

        const challengeData = CHALLENGE_DATA[this.currentChallenge];

        // DEBUG: Log placed blocks and their connections
        console.log('=== VALIDATION DEBUG ===');
        console.log('Placed blocks:', this.dragDropManager.placedBlocks.map(b => ({
            id: b.id,
            x: b.x,
            y: b.y,
            connectedTo: b.connectedTo
        })));
        console.log('Required connections:', challengeData.correctConnections);

        // All levels now use connections validation
        const isCorrect = this.validateConnections(challengeData.correctConnections);

        console.log('Validation result:', isCorrect);
        console.log('======================');

        if (isCorrect) {
            this.onChallengeSuccess();
        } else {
            this.onChallengeFail();
        }
    }

    validateConnections(correctConnections) {
        const placedBlocks = this.dragDropManager.placedBlocks;

        // Check if all required connections exist
        for (const required of correctConnections) {
            const fromBlock = placedBlocks.find(b => b.id === required.from);
            if (!fromBlock) return false;

            // Check if this block has the required connection
            // Note: connections now use instanceId, so we need to look up the block type
            const hasConnection = fromBlock.connectedTo.some(conn => {
                const connectedBlock = placedBlocks.find(b => b.instanceId === conn.instanceId);
                return connectedBlock && connectedBlock.id === required.to && conn.direction === required.direction;
            });

            if (!hasConnection) return false;
        }

        return true;
    }

    arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    onChallengeSuccess() {
        // Award 100 points only if challenge not yet completed
        const wasAlreadyCompleted = this.isChallengeCompleted(this.currentChallenge);
        let points = 0;

        if (!wasAlreadyCompleted) {
            points = 100; // Always 100 points per level
            this.totalPoints += points;
        }

        // Show success message from TXP
        const challengeData = CHALLENGE_DATA[this.currentChallenge];
        if (this.txp) {
            this.txp.showSuccessMessage(challengeData.successMessage);
            setTimeout(() => {
                this.txp.hideSpeech();
                this.showChallengeComplete();
            }, 2000);
        } else {
            this.showChallengeComplete();
        }

        // Save progress (mark as completed) - this also saves to localStorage
        this.markChallengeCompleted(this.currentChallenge);
    }

    onChallengeFail() {
        // Show error feedback
        if (this.txp) {
            this.txp.showSuccessMessage("❌ Das ist noch nicht richtig. Überprüfe die Reihenfolge!");
            setTimeout(() => {
                this.txp.hideSpeech();
            }, 2000);
        }

        // Visual feedback
        const whiteboard = document.getElementById('whiteboardContent');
        if (whiteboard) {
            whiteboard.style.borderColor = '#FF4444';
            setTimeout(() => {
                whiteboard.style.borderColor = '';
            }, 500);
        }
    }

    showChallengeComplete() {
        this.showScreen('challengeCompleteScreen');

        // Show flow visualization
        this.showFlowVisualization();

        // Update rank badge
        this.updateRankBadge();

        // Hide "Next Challenge" button if this is the last challenge
        const nextChallengeBtn = document.querySelector('.next-level-button');
        const menuButton = document.querySelector('.menu-button');

        if (this.currentChallenge >= GAME_CONFIG.totalChallenges) {
            // Last challenge - hide next button, center menu button
            if (nextChallengeBtn) {
                nextChallengeBtn.style.display = 'none';
            }
            if (menuButton) {
                menuButton.style.margin = '0 auto';
            }
        } else {
            // Not last challenge - show both buttons
            if (nextChallengeBtn) {
                nextChallengeBtn.style.display = 'flex';
            }
            if (menuButton) {
                menuButton.style.margin = '';
            }
        }
    }

    showFlowVisualization() {
        const flowVisualization = document.getElementById('flowVisualization');
        if (!flowVisualization || !this.dragDropManager) return;

        flowVisualization.innerHTML = '';

        const placedSequence = this.dragDropManager.getPlacedSequence();
        const challengeData = CHALLENGE_DATA[this.currentChallenge];

        placedSequence.forEach((blockId, index) => {
            const blockData = challengeData.blocks.find(b => b.id === blockId);
            if (!blockData) return;

            // Create flow step
            const stepElement = document.createElement('div');
            stepElement.className = 'flow-step';
            stepElement.innerHTML = `
                <div class="flow-step-icon">${blockData.icon}</div>
                <div class="flow-step-text">${blockData.title}</div>
            `;
            flowVisualization.appendChild(stepElement);

            // Add arrow between steps
            if (index < placedSequence.length - 1) {
                const arrow = document.createElement('div');
                arrow.className = 'flow-arrow';
                arrow.textContent = '⬇';
                flowVisualization.appendChild(arrow);
            }
        });
    }

    updateHUD() {
        // Update rank badge
        this.updateRankBadge();
    }

    updateRankBadge() {
        // Update rank badge - 1:1 from Level 5
        const rankBadge = document.getElementById('rankBadge');
        const rankIcon = document.getElementById('rankIcon');
        const rankLabel = document.getElementById('rankLabel');

        if (!rankBadge || !rankIcon || !rankLabel) return;

        const rank = this.calculateTotalRank();
        const rankClass = rank.toLowerCase(); // 'gold', 'silber', 'bronze', 'kein rang'

        if (rank === 'Kein Rang') {
            rankBadge.style.display = 'none';
            return;
        }

        // Show badge
        rankBadge.style.display = 'flex';
        rankBadge.className = `rank-badge ${rankClass}`;

        // Set label based on rank (no icon, just like Level 5)
        rankLabel.textContent = rank;
        rankIcon.textContent = ''; // No icon

        // Add click event for animation
        rankBadge.onclick = () => {
            rankBadge.classList.add('rank-badge-clicked');
            setTimeout(() => {
                rankBadge.classList.remove('rank-badge-clicked');
            }, 1000);
        };
    }

    calculateTotalRank() {
        if (this.totalPoints >= 500) return 'Gold';
        if (this.totalPoints >= 400) return 'Silber';
        if (this.totalPoints >= 300) return 'Bronze';
        return 'Kein Rang';
    }

    getRankIcon(rank) {
        const icons = {
            'Gold': '🥇',
            'Silber': '🥈',
            'Bronze': '🥉',
            'Kein Rang': ''
        };
        return icons[rank] || '';
    }

    markChallengeCompleted(challengeNum) {
        const progress = this.getProgress();
        if (!progress.completedChallenges) {
            progress.completedChallenges = [];
        }
        if (!progress.completedChallenges.includes(challengeNum)) {
            progress.completedChallenges.push(challengeNum);
        }

        // Update the game instance's completedChallenges
        this.completedChallenges = progress.completedChallenges;

        // Save to localStorage
        localStorage.setItem('powerAutomateProgress', JSON.stringify({
            currentChallenge: this.currentChallenge,
            totalPoints: this.totalPoints,
            completedChallenges: this.completedChallenges
        }));
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

        // Show/hide HUD based on screen
        const hudWrapper = document.querySelector('.hud-wrapper');
        if (hudWrapper) {
            hudWrapper.style.display = (screenId === 'editorScreen') ? 'flex' : 'none';
        }
    }

    // ===== INPUT HANDLERS =====
    setupInputHandlers() {
        document.addEventListener('keydown', (e) => {
            // Escape to toggle pause
            if (e.key === 'Escape' && this.currentScreen === 'editorScreen') {
                this.togglePauseMenu();
            }
        });
    }

    togglePauseMenu() {
        const pauseMenu = document.getElementById('pauseMenu');
        if (!pauseMenu) return;

        this.isPaused = !this.isPaused;
        pauseMenu.style.display = this.isPaused ? 'flex' : 'none';
    }

    // ===== PROGRESS MANAGEMENT =====
    saveProgress() {
        const progress = {
            currentChallenge: this.currentChallenge,
            totalPoints: this.totalPoints,
            completedChallenges: this.getProgress().completedChallenges || []
        };
        localStorage.setItem('powerAutomateProgress', JSON.stringify(progress));
    }

    loadProgress() {
        const saved = localStorage.getItem('powerAutomateProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.currentChallenge = progress.currentChallenge || 1;
            this.totalPoints = progress.totalPoints || 0;
            this.completedChallenges = progress.completedChallenges || [];
        }
    }

    getProgress() {
        const saved = localStorage.getItem('powerAutomateProgress');
        return saved ? JSON.parse(saved) : {};
    }

    resetProgress() {
        localStorage.removeItem('powerAutomateProgress');
        this.currentChallenge = 1;
        this.totalPoints = 0;
        this.completedChallenges = [];
        location.reload();
    }
}

// ===== GLOBAL FUNCTIONS (Called from HTML) =====
function closeTutorial() {
    const tutorialOverlay = document.getElementById('tutorialOverlay');
    if (tutorialOverlay) {
        tutorialOverlay.style.display = 'none';
    }
}

function resumeGame() {
    if (window.gameInstance) {
        window.gameInstance.togglePauseMenu();
    }
}

function returnToLevelSelect() {
    if (window.gameInstance) {
        window.gameInstance.showLevelSelect();
        window.gameInstance.isPaused = false;
        const pauseMenu = document.getElementById('pauseMenu');
        if (pauseMenu) pauseMenu.style.display = 'none';
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
    if (window.gameInstance) {
        window.gameInstance.resetProgress();
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new PowerAutomateGame();
});
