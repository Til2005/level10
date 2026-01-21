// Level 6 - Copilot - Game Logic

// ===== GAME CONFIGURATION =====
const GAME_CONFIG = {
    totalChallenges: 5,
    pointsPerChallenge: 100,
    storageKey: 'aiBytes_level6_progress'
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
        name: "Montag",
        difficulty: "Einfach",
        description: "Erledige einfache Büroaufgaben",
        duration: 60, // seconds
        targetTasks: 20,
        taskSpawnInterval: 10000, // ms - 1 task every 10 seconds
        maxConcurrentTasks: 2,
        availableActions: [
            { id: "email-summary", icon: "📧", title: "E-Mail zusammenfassen" },
            { id: "quick-reply", icon: "⚡", title: "Schnell antworten" }
        ],
        tasks: [
            // E-Mail Summary Variationen - KLAR als E-Mail markiert
            { description: "Lange E-Mail mit 15 Absätzen über Projektupdate", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "E-Mail mit mehreren Beteiligten zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "Ausführliche E-Mail vom Kunden mit vielen Details", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "E-Mail mit 20+ Nachrichten zusammenfassen", correctAction: "email-summary", priority: "urgent", timeLimit: 22 },
            { description: "Lange E-Mail mit mehreren Themen zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "Monatsbericht E-Mail vom Team zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "Technische E-Mail Diskussion zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "Kundenbeschwerde E-Mail mit langer Vorgeschichte", correctAction: "email-summary", priority: "normal", timeLimit: 30 },

            // Quick Reply Variationen - KLAR als kurze Antwort
            { description: "Ja/Nein Frage schnell beantworten", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },
            { description: "Kurze Statusrückmeldung geben", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },
            { description: "Liefertermin Anfrage kurz beantworten", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },
            { description: "Termin Rückfrage kurz bestätigen", correctAction: "quick-reply", priority: "urgent", timeLimit: 18 },
            { description: "Kurze Info an Kollegen schicken", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },
            { description: "Kurze Bestätigung senden", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },
            { description: "Schnelle Antwort auf kurze Frage", correctAction: "quick-reply", priority: "urgent", timeLimit: 18 },
            { description: "Kurzes OK an Kollegen senden", correctAction: "quick-reply", priority: "normal", timeLimit: 30 }
        ],
        tutorialMessages: [
            "Willkommen zum Montag! 🎮",
            "Du hast 2 Copilot Aktionen:",
            "📧 E-Mail zusammenfassen für lange E-Mails mit vielen Details",
            "⚡ Schnell antworten für kurze Ja/Nein Fragen",
            "Klicke auf eine Aufgabe, dann auf die richtige Aktion!",
            "Viel Erfolg! 🚀"
        ],
        successMessage: "Großartig! Du hast den Montag gemeistert! 😊"
    },

    2: {
        name: "Dienstag",
        difficulty: "Mittel",
        description: "Mehr Aufgaben, mehr Tempo!",
        duration: 60,
        targetTasks: 20,
        taskSpawnInterval: 8000,
        maxConcurrentTasks: 3,
        availableActions: [
            { id: "email-summary", icon: "📧", title: "E-Mail zusammenfassen" },
            { id: "quick-reply", icon: "⚡", title: "Schnell antworten" },
            { id: "meeting-find", icon: "📅", title: "Meeting finden" }
        ],
        tasks: [
            // E-Mail Summary Variationen - KLAR als E-Mail
            { description: "Projekt E-Mail mit allen Kollegen zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "Monatsbericht E-Mail vom Team zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "Technische E-Mail Diskussion zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "Kundenbeschwerde E-Mail mit Vorgeschichte zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "E-Mail mit +200 Zeilen zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "E-Mail zur Strategiediskussion zusammenfassen", correctAction: "email-summary", priority: "urgent", timeLimit: 18 },

            // Quick Reply Variationen - KLAR als kurze Antwort
            { description: "Freigabe Anfrage schnell beantworten", correctAction: "quick-reply", priority: "urgent", timeLimit: 15 },
            { description: "Kurze Bestätigung schnell senden", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },
            { description: "Anfrage kurz beantworten", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },
            { description: "Kurzes OK an Kollegen", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },
            { description: "Ja/Nein Entscheidung schnell mitteilen", correctAction: "quick-reply", priority: "urgent", timeLimit: 15 },
            { description: "Kurze Rückmeldung zu Vorschlag geben", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },

            // Meeting Find Variationen - KLAR als Terminkoordination
            { description: "Termin für wöchentliches Team Meeting finden", correctAction: "meeting-find", priority: "normal", timeLimit: 30 },
            { description: "Freien Termin mit 8 Personen finden", correctAction: "meeting-find", priority: "normal", timeLimit: 30 },
            { description: "Doppelbuchung im Kalender auflösen", correctAction: "meeting-find", priority: "urgent", timeLimit: 18 },
            { description: "Freien Slot im Kalender finden", correctAction: "meeting-find", priority: "normal", timeLimit: 30 },
            { description: "Gemeinsamen Termin für 5 Personen finden", correctAction: "meeting-find", priority: "normal", timeLimit: 30 },
            { description: "Neuen Termin finden - alle müssen verfügbar sein", correctAction: "meeting-find", priority: "normal", timeLimit: 30 }
        ],
        tutorialMessages: [
            "Dienstag wird schneller! ⚡",
            "Neue Aktion: 📅 Meeting finden für Termine im Kalender koordinieren",
            "Nutze sie, wenn du einen freien Termin für Meetings finden musst!",
            "⚠️ Rote Aufgaben sind dringend und haben weniger Zeit!",
            "Baue einen Streak auf für Bonus Punkte! 🔥"
        ],
        successMessage: "Fantastisch! Du bist produktiv! 😐"
    },

    3: {
        name: "Mittwoch",
        difficulty: "Mittel-Schwer",
        description: "Multitasking ist gefragt!",
        duration: 60,
        targetTasks: 20,
        taskSpawnInterval: 6000,
        maxConcurrentTasks: 4,
        availableActions: [
            { id: "email-summary", icon: "📧", title: "E-Mail zusammenfassen" },
            { id: "quick-reply", icon: "⚡", title: "Schnell antworten" },
            { id: "meeting-find", icon: "📅", title: "Meeting finden" },
            { id: "chat-points", icon: "💬", title: "Chat analysieren" }
        ],
        tasks: [
            // E-Mail Summary - KLAR als E-Mail markiert
            { description: "E-Mail zur Strategie zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "E-Mail mit verschiedenen Meinungen zusammenfassen", correctAction: "email-summary", priority: "urgent", timeLimit: 15 },
            { description: "E-Mail mit Feedback von 5 Kollegen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "E-Mail mit +700 Zeilen zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "Wichtige E-Mail an alle Kollegen zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },

            // Quick Reply - KLAR als kurze Antwort
            { description: "Ja/Nein Entscheidung kurz beantworten", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },
            { description: "Kurze Rückmeldung zu Vorschlag geben", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },
            { description: "Freigabe kurz bestätigen", correctAction: "quick-reply", priority: "urgent", timeLimit: 12 },
            { description: "Designentwurf kurz kommentieren", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },
            { description: "Go/No-Go schnell entscheiden", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },

            // Meeting Find - KLAR als Terminkoordination
            { description: "5 Kalender Überschneidungen diese Woche auflösen", correctAction: "meeting-find", priority: "normal", timeLimit: 30 },
            { description: "Termin für spontanes Meeting finden", correctAction: "meeting-find", priority: "normal", timeLimit: 30 },
            { description: "Termin für Quartalsplanung mit allen Abteilungen", correctAction: "meeting-find", priority: "normal", timeLimit: 30 },
            { description: "Neuen Termin für wiederkehrendes Meeting finden", correctAction: "meeting-find", priority: "normal", timeLimit: 30 },
            { description: "Termin für Notfall Meeting mit Team Leitern finden", correctAction: "meeting-find", priority: "urgent", timeLimit: 15 },

            // Chat analysieren - KLAR als Teams Chat
            { description: "Langen Teams Chat filtern", correctAction: "chat-points", priority: "normal", timeLimit: 30 },
            { description: "3 parallele Teams Chats zusammenfassen", correctAction: "chat-points", priority: "urgent", timeLimit: 18 },
            { description: "Wichtige Infos aus Projekt Chat herausfiltern", correctAction: "chat-points", priority: "normal", timeLimit: 30 },
            { description: "To-Dos aus Teams Chat finden", correctAction: "chat-points", priority: "normal", timeLimit: 30 },
            { description: "Teams Chat mit 50+ Nachrichten analysieren", correctAction: "chat-points", priority: "normal", timeLimit: 30 }
        ],
        tutorialMessages: [
            "Mittwoch wird intensiv! 😅",
            "Neue Aktion: 💬 Chat analysieren bei Teams Diskussionen",
            "Nutze sie, wenn du wichtige Infos aus langen Chats filtern musst!",
            "Mehrere Aufgaben gleichzeitig, bleib ruhig!",
            "Viel Erfolg! 🚀"
        ],
        successMessage: "Wow! Du beherrschst Multitasking! 😅"
    },

    4: {
        name: "Donnerstag",
        difficulty: "Schwer",
        description: "Ignoriere Störfaktoren!",
        duration: 60,
        targetTasks: 20,
        taskSpawnInterval: 5000,
        maxConcurrentTasks: 5,
        availableActions: [
            { id: "email-summary", icon: "📧", title: "E-Mail zusammenfassen" },
            { id: "quick-reply", icon: "⚡", title: "Schnell antworten" },
            { id: "meeting-find", icon: "📅", title: "Meeting finden" },
            { id: "chat-points", icon: "💬", title: "Chat analysieren" },
            { id: "doc-draft", icon: "✍️", title: "Dokument erstellen" }
        ],
        tasks: [
            // E-Mail Summary - Normal 30s, Urgent 14s
            { description: "Wichtige E-Mail an alle Kollegen zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "Dringende E-Mail mit vielen Empfängern zusammenfassen", correctAction: "email-summary", priority: "urgent", timeLimit: 14 },
            { description: "E-Mail zur Jahresplanung zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "Lieferanten E-Mail mit Historie zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "Feedback E-Mail von 10+ Kollegen zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },

            // Quick Reply - Normal 30s, Urgent 12s
            { description: "Status Frage vom Kollegen sofort beantworten", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },
            { description: "Go/No-Go Entscheidung schnell mitteilen", correctAction: "quick-reply", priority: "urgent", timeLimit: 12 },
            { description: "Software Freigabe kurz erteilen", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },
            { description: "Fehler Einschätzung kurz geben", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },
            { description: "Rückfrage sofort beantworten", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },

            // Meeting Find - Normal 30s, Urgent 14s
            { description: "Doppelbuchung im Kalender JETZT auflösen", correctAction: "meeting-find", priority: "urgent", timeLimit: 14 },
            { description: "Termin für Notfall Meeting mit Geschäftsleitung finden", correctAction: "meeting-find", priority: "normal", timeLimit: 30 },
            { description: "Termin für Krisentreffen mit allen Team Leitern finden", correctAction: "meeting-find", priority: "normal", timeLimit: 30 },
            { description: "Mehrere Termin Kollisionen im Kalender sortieren", correctAction: "meeting-find", priority: "normal", timeLimit: 30 },
            { description: "Termin für Besprechung mit Abteilungen finden", correctAction: "meeting-find", priority: "normal", timeLimit: 30 },

            // Chat analysieren - Normal 30s, Urgent 15s
            { description: "Nach alten Teams Chat suchen", correctAction: "chat-points", priority: "urgent", timeLimit: 15 },
            { description: "Teams Diskussion zusammenfassen", correctAction: "chat-points", priority: "normal", timeLimit: 30 },
            { description: "Teams Nachrichten nach Wörtern filtern", correctAction: "chat-points", priority: "normal", timeLimit: 30 },
            { description: "Wichtige Infos aus chaotischem Teams Chat retten", correctAction: "chat-points", priority: "normal", timeLimit: 30 },
            { description: "Teams Brainstorming Chat zusammenfassen", correctAction: "chat-points", priority: "normal", timeLimit: 30 },

            // Doc Draft - Normal 30s, Urgent 17s
            { description: "Vertrags Dokument erstellen (muss heute raus)", correctAction: "doc-draft", priority: "urgent", timeLimit: 17 },
            { description: "Projekt Bericht Dokument schreiben", correctAction: "doc-draft", priority: "normal", timeLimit: 30 },
            { description: "Regelwerk Dokument erstellen (bis heute Abend)", correctAction: "doc-draft", priority: "normal", timeLimit: 30 },
            { description: "Angebots Dokument erstellen", correctAction: "doc-draft", priority: "normal", timeLimit: 30 },
            { description: "Quartalsbericht Dokument erstellen", correctAction: "doc-draft", priority: "normal", timeLimit: 30 }
        ],
        tutorialMessages: [
            "Es donnert gewaltig am Donnerstag! ⚡😰",
            "Neue Aktion: ✍️ Dokument erstellen für längere Texte und Berichte",
            "Nutze sie für Verträge, Reports und andere Dokumente!",
            "Nutze die 5 Aktionen weise!",
            "Fokus auf die wichtigen Dinge!"
        ],
        successMessage: "Unglaublich! Du behältst den Überblick! 😰"
    },

    5: {
        name: "Freitag",
        difficulty: "Sehr Schwer",
        description: "Mega-Projekt + Tagesgeschäft!",
        duration: 60,
        targetTasks: 20,
        taskSpawnInterval: 4000,
        maxConcurrentTasks: 6,
        megaProject: true,
        availableActions: [
            { id: "email-summary", icon: "📧", title: "E-Mail zusammenfassen" },
            { id: "quick-reply", icon: "⚡", title: "Schnell antworten" },
            { id: "meeting-find", icon: "📅", title: "Meeting finden" },
            { id: "chat-points", icon: "💬", title: "Chat analysieren" },
            { id: "doc-draft", icon: "✍️", title: "Dokument erstellen" },
            { id: "presentation", icon: "📊", title: "Präsentation erstellen" }
        ],
        tasks: [
            // E-Mail Summary - Normal 30s, Urgent 12s
            { description: "E-Mail vom Teamleiter: Sofortiges Update zu allen Projekten", correctAction: "email-summary", priority: "urgent", timeLimit: 12 },
            { description: "E-Mail mit +1300 Zeilen zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "E-Mail zusammenfassen zum Social-Intranet-Update", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "30+ E-Mails zur Vertragsverhandlung zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },
            { description: "E-Mail zur Unternehmens Fusion zusammenfassen", correctAction: "email-summary", priority: "normal", timeLimit: 30 },

            // Quick Reply - Normal 30s, Urgent 10s
            { description: "Frage JETZT kurz beantworten", correctAction: "quick-reply", priority: "urgent", timeLimit: 10 },
            { description: "Produkt Start Entscheidung schnell mitteilen", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },
            { description: "Kunde droht mit Kündigung - kurz reagieren", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },
            { description: "Produktionsstopp: Kurze Freigabe ja/nein?", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },
            { description: "Allgemeine Stellungnahme kurz abgeben", correctAction: "quick-reply", priority: "normal", timeLimit: 30 },

            // Meeting Find - Normal 30s, Urgent 12s
            { description: "Termin für Führungsteam SOFORT finden", correctAction: "meeting-find", priority: "urgent", timeLimit: 12 },
            { description: "10 Kalender Überschneidungen heute auflösen", correctAction: "meeting-find", priority: "normal", timeLimit: 30 },
            { description: "Spontan Termin für Geldgeber finden?", correctAction: "meeting-find", priority: "normal", timeLimit: 30 },
            { description: "Alle Termine nächste Woche neu koordinieren", correctAction: "meeting-find", priority: "normal", timeLimit: 30 },
            { description: "Termin für Krisenmeeting mit Partnern finden", correctAction: "meeting-find", priority: "normal", timeLimit: 30 },

            // Chat analysieren - Normal 30s, Urgent 14s
            { description: "5 parallele Teams Krisen Chats analysieren", correctAction: "chat-points", priority: "urgent", timeLimit: 14 },
            { description: "Teams Chat von einer bestimmten Person suchen", correctAction: "chat-points", priority: "normal", timeLimit: 30 },
            { description: "Kraftausdrücke von meiner Frau in altem Teams Chat suchen", correctAction: "chat-points", priority: "normal", timeLimit: 30 },

            // Doc Draft - Normal 30s, Urgent 16s
            { description: "Vertrags Dokument für großen Deal erstellen", correctAction: "doc-draft", priority: "urgent", timeLimit: 16 },
            { description: "Einfach irgendein Dokument schreiben", correctAction: "doc-draft", priority: "normal", timeLimit: 30 },
            { description: "Geschäftsplan Dokument erstellen", correctAction: "doc-draft", priority: "normal", timeLimit: 30 },
            { description: "Presse Dokument erstellen", correctAction: "doc-draft", priority: "normal", timeLimit: 30 },
            { description: "WIE FINDE ICH EIN MEETING?-Dokument erstellen", correctAction: "doc-draft", priority: "normal", timeLimit: 30 },

            // Presentation - Normal 30s, Urgent 14s
            { description: "Vorstands Präsentation fertigstellen (30 Min!)", correctAction: "presentation", priority: "urgent", timeLimit: 14 },
            { description: "Geldgeber Präsentation Folien komplett umbauen", correctAction: "presentation", priority: "normal", timeLimit: 30 },
            { description: "Krisen Präsentation für Team Meeting erstellen", correctAction: "presentation", priority: "normal", timeLimit: 30 },
            { description: "Quartals-Ergebnis Folien aufbereiten", correctAction: "presentation", priority: "normal", timeLimit: 30 },
            { description: "Strategie Präsentation für Teamleiter überarbeiten", correctAction: "presentation", priority: "normal", timeLimit: 30 }
        ],
        tutorialMessages: [
            "Freitag, der Boss Battle! 🔥",
            "Neue Aktion: 📊 Präsentation erstellen für wichtige Folien",
            "Nutze sie für Vorstands Präsentationen und Geldgeber Meetings!",
            "Heute ist alles dran: Alle 6 Aktionen auf einmal!",
            "Gib alles! Du schaffst das! 💪"
        ],
        successMessage: "LEGENDE! Du bist ein Copilot-Meister! 🔥👑"
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
        this.imgElement = document.getElementById('txpAssistantImg');
        this.speechBubble = document.getElementById('txpSpeech');
        this.speechText = document.getElementById('txpSpeechText');

        this.currentAnimation = 'stand';
        this.currentFrame = 0;
        this.animationInterval = null;

        // Tutorial state
        this.tutorialMessages = [];
        this.currentMessageIndex = 0;
        this.isInTutorialMode = false;
        this.onDialogCompleteCallback = null;

        this.startAnimation('stand');
        this.setupClickHandler();
    }

    setupClickHandler() {
        if (this.element) {
            this.element.addEventListener('click', () => {
                this.nextMessage();
            });
        }

        if (this.speechBubble) {
            this.speechBubble.addEventListener('click', () => {
                this.nextMessage();
            });
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
            this.imgElement.src = frames[this.currentFrame].src;
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
        this.hideSpeech();
    }

    showSpeech(message, showHint = true) {
        if (!this.speechBubble || !this.speechText) return;

        this.speechText.textContent = message;
        this.speechBubble.style.display = 'block';

        const hint = this.speechBubble.querySelector('.speech-continue-hint');
        if (hint) {
            hint.style.display = showHint ? 'block' : 'none';
        }

        this.startAnimation('talk');
    }

    hideSpeech() {
        if (this.speechBubble) {
            this.speechBubble.style.display = 'none';
        }
        this.startAnimation('stand');
    }

    startTutorial(messages, onComplete = null) {
        this.tutorialMessages = messages;
        this.currentMessageIndex = 0;
        this.isInTutorialMode = true;
        this.onDialogCompleteCallback = onComplete;
        if (messages.length > 0) {
            this.showSpeech(messages[0], true);
        }
    }

    showSuccessMessage(message) {
        this.tutorialMessages = [];
        this.currentMessageIndex = 0;
        this.showSpeech(message, false);
    }

    nextMessage() {
        if (this.isInTutorialMode) {
            this.currentMessageIndex++;
            if (this.currentMessageIndex < this.tutorialMessages.length) {
                this.showSpeech(this.tutorialMessages[this.currentMessageIndex], true);
            } else {
                this.hideSpeech();
                this.isInTutorialMode = false;
                // Call the callback when dialog is complete
                if (this.onDialogCompleteCallback) {
                    this.onDialogCompleteCallback();
                    this.onDialogCompleteCallback = null;
                }
            }
        } else {
            if (this.tutorialMessages.length > 0) {
                this.isInTutorialMode = true;
                this.currentMessageIndex = 0;
                this.showSpeech(this.tutorialMessages[0], true);
            }
        }
    }
}

// ===== OFFICE CANVAS ANIMATION =====
class OfficeCanvasAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;

        this.init();
    }

    init() {
        // Set canvas size
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Create particles (floating icons)
        const icons = ['📧', '💬', '📅', '📊', '✍️', '⚡'];
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                icon: icons[Math.floor(Math.random() * icons.length)],
                size: 20 + Math.random() * 20,
                opacity: 0.3 + Math.random() * 0.3
            });
        }

        this.animate();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around screen
            if (p.x < -50) p.x = this.canvas.width + 50;
            if (p.x > this.canvas.width + 50) p.x = -50;
            if (p.y < -50) p.y = this.canvas.height + 50;
            if (p.y > this.canvas.height + 50) p.y = -50;

            // Draw icon
            this.ctx.save();
            this.ctx.globalAlpha = p.opacity;
            this.ctx.font = `${p.size}px Arial`;
            this.ctx.fillText(p.icon, p.x, p.y);
            this.ctx.restore();
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// ===== TASK MANAGER =====
class TaskManager {
    constructor(game) {
        this.game = game;
        this.tasks = [];
        this.nextTaskId = 0;
        this.spawnInterval = null;
        this.taskQueue = document.getElementById('taskQueue');
        this.selectedTask = null;
    }

    start(challengeData) {
        this.challengeData = challengeData;
        this.tasks = [];
        this.nextTaskId = 0;
        this.selectedTask = null;
        this.clearQueue();

        // Start spawning tasks
        this.spawnTask();
        this.spawnInterval = setInterval(() => {
            if (this.tasks.length < this.challengeData.maxConcurrentTasks) {
                this.spawnTask();
            }
        }, this.challengeData.taskSpawnInterval);
    }

    stop() {
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
        this.tasks.forEach(task => {
            if (task.timerInterval) clearInterval(task.timerInterval);
        });
        this.tasks = [];
        this.clearQueue();
    }

    spawnTask() {
        if (!this.challengeData || !this.challengeData.tasks) return;

        // Pick random task
        const taskTemplate = this.challengeData.tasks[Math.floor(Math.random() * this.challengeData.tasks.length)];

        const task = {
            id: this.nextTaskId++,
            ...taskTemplate,
            timeRemaining: taskTemplate.timeLimit,
            element: null,
            timerInterval: null
        };

        this.tasks.push(task);
        this.createTaskElement(task);
        this.startTaskTimer(task);

        // Auto-select first task if none is selected (use requestAnimationFrame to ensure DOM is ready)
        if (!this.selectedTask) {
            requestAnimationFrame(() => {
                if (!this.selectedTask && this.tasks.includes(task)) {
                    this.selectTask(task);
                }
            });
        }
    }

    createTaskElement(task) {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.dataset.taskId = task.id;

        if (task.priority === 'urgent') {
            taskCard.classList.add('urgent');
        }

        taskCard.innerHTML = `
            <div class="task-icon">📋</div>
            <div class="task-description">${task.description}</div>
            <div class="task-timer">${task.timeRemaining}s</div>
        `;

        taskCard.addEventListener('click', () => {
            this.selectTask(task);
        });

        task.element = taskCard;
        this.taskQueue.appendChild(taskCard);
    }

    startTaskTimer(task) {
        task.timerInterval = setInterval(() => {
            task.timeRemaining--;

            if (task.element) {
                const timerEl = task.element.querySelector('.task-timer');
                if (timerEl) {
                    timerEl.textContent = task.timeRemaining + 's';
                }
            }

            if (task.timeRemaining <= 0) {
                this.taskTimeout(task);
            }
        }, 1000);
    }

    selectTask(task) {
        // Deselect previous
        if (this.selectedTask) {
            if (this.selectedTask.element) {
                this.selectedTask.element.classList.remove('selected');
            }
        }

        // Select new
        this.selectedTask = task;
        if (task.element) {
            task.element.classList.add('selected');
        }
    }

    processTaskWithAction(actionId) {
        if (!this.selectedTask) return false;

        const task = this.selectedTask;
        const isCorrect = task.correctAction === actionId || (task.priority === 'ignore' && actionId === 'ignore');

        this.removeTask(task);
        this.selectedTask = null;

        // Auto-select next task if available
        if (this.tasks.length > 0) {
            this.selectTask(this.tasks[0]);
        }

        return isCorrect;
    }

    removeTask(task) {
        if (task.timerInterval) {
            clearInterval(task.timerInterval);
            task.timerInterval = null;
        }

        if (task.element) {
            task.element.remove();
        }

        this.tasks = this.tasks.filter(t => t.id !== task.id);

        // If queue is empty, spawn a new task immediately
        if (this.tasks.length === 0 && this.challengeData) {
            this.spawnTask();
        }
    }

    taskTimeout(task) {
        const wasSelected = this.selectedTask && this.selectedTask.id === task.id;

        this.removeTask(task);

        // If the timed-out task was selected, clear selection and auto-select next
        if (wasSelected) {
            this.selectedTask = null;
            if (this.tasks.length > 0) {
                this.selectTask(this.tasks[0]);
            }
        }

        this.game.onTaskTimeout();
    }

    clearQueue() {
        if (this.taskQueue) {
            this.taskQueue.innerHTML = '';
        }
    }
}

// ===== GAME MANAGER =====
class GameManager {
    constructor() {
        this.currentChallenge = 1;
        this.isPaused = false;
        this.isGameRunning = false;

        // Game stats
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.tasksCompleted = 0;
        this.timeRemaining = 0;
        this.timerInterval = null;

        // Progress tracking
        this.completedChallenges = [];
        this.totalPoints = 0;
        this.challengeScores = {}; // Stores score per challenge (1: 50, 2: 75, etc.)

        // Components
        this.txp = null;
        this.taskManager = null;
        this.canvasAnimation = null;

        // Load progress
        this.loadProgress();

        // Initialize
        this.init();
    }

    init() {
        // Setup event listeners
        this.setupEventListeners();

        // Setup letter hover effects
        this.setupLetterEffects();

        // Show intro
        this.showScreen('introScreen');

        // Setup canvas animation
        const canvas = document.getElementById('officeCanvas');
        if (canvas) {
            this.canvasAnimation = new OfficeCanvasAnimation(canvas);
        }
    }

    setupLetterEffects() {
        const letters = document.querySelectorAll('.letter');

        letters.forEach((letter, index) => {
            letter.addEventListener('mouseenter', () => {
                // Apply effects to ALL letters
                letters.forEach((otherLetter, otherIndex) => {
                    // Remove any existing effect classes
                    otherLetter.className = 'letter';

                    // Add a random effect class
                    const effectNum = (otherIndex % 6) + 1;
                    otherLetter.classList.add(`effect-${effectNum}`);

                    // Remove effect after animation completes
                    setTimeout(() => {
                        otherLetter.classList.remove(`effect-${effectNum}`);
                    }, 800);
                });
            });
        });
    }

    setupEventListeners() {
        // Intro screen - any key to continue
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('introScreen').classList.contains('active')) {
                this.startLoading();
            }
        });

        // Intro screen - click anywhere to continue
        const introScreen = document.getElementById('introScreen');
        if (introScreen) {
            introScreen.addEventListener('click', () => {
                if (introScreen.classList.contains('active')) {
                    this.startLoading();
                }
            });
        }

        // ESC for pause
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isGameRunning) {
                this.togglePause();
            }
        });
    }

    showScreen(screenId) {
        const screens = document.querySelectorAll('.game-screen');
        screens.forEach(screen => screen.classList.remove('active'));

        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }

    async startLoading() {
        this.showScreen('loadingScreen');

        // Preload TXP animations
        await TXPAssistant.preloadFrames();

        const loadingBar = document.getElementById('loadingBar');
        const loadingText = document.getElementById('loadingText');

        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += 5;
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
        this.updateRankBadge();
        this.setupLevelSelectEasterEgg(); // Easter egg: Fireworks on empty clicks
    }

    setupLevelSelectEasterEgg() {
        const levelSelectContainer = document.querySelector('.level-select-container');
        if (!levelSelectContainer) return;

        levelSelectContainer.addEventListener('click', (e) => {
            // Check if click is on empty area (not on a card or button)
            if (e.target.classList.contains('level-select-container') ||
                e.target.closest('.level-select-title') ||
                e.target.closest('.level-select-subtitle') ||
                e.target.closest('.progress-info') ||
                e.target.closest('.rank-info')) {
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
        // Update total points
        const totalPointsDisplay = document.getElementById('totalPointsDisplay');
        if (totalPointsDisplay) {
            totalPointsDisplay.textContent = `${this.totalPoints} / 500`;
        }

        // Update current rank
        const currentRankDisplay = document.getElementById('currentRankDisplay');
        if (currentRankDisplay) {
            const rank = this.calculateTotalRank();
            currentRankDisplay.textContent = rank || 'Kein Rang';
        }

        // Update challenge cards
        for (let i = 1; i <= GAME_CONFIG.totalChallenges; i++) {
            const cardElement = document.querySelector(`.challenge-card[data-level="${i}"]`);
            if (!cardElement) continue;

            const isUnlocked = this.isChallengeUnlocked(i);
            const isCompleted = this.isChallengeCompleted(i);

            // Update points display
            const pointsElement = cardElement.querySelector('.challenge-points');
            if (pointsElement) {
                const score = this.challengeScores[i] || 0;
                pointsElement.textContent = `${score}/100 Punkte`;
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
            }

            // Mark completed
            if (isCompleted) {
                cardElement.classList.add('completed');
                const statusElement = cardElement.querySelector('.challenge-status');
                if (statusElement) {
                    statusElement.textContent = '✅ Abgeschlossen';
                }
            }
        }

        // Show scroll arrow after Challenge 3
        const scrollArrow = document.getElementById('scrollArrow');
        if (scrollArrow) {
            if (this.isChallengeCompleted(3)) {
                scrollArrow.style.display = 'block';
                // Add animation class after a tiny delay to ensure clean start
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        scrollArrow.classList.add('active');
                    });
                });
            } else {
                scrollArrow.style.display = 'none';
                scrollArrow.classList.remove('active');
            }
        }
    }

    setupLevelClickHandlers() {
        const cards = document.querySelectorAll('.challenge-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const level = parseInt(card.dataset.level);
                if (this.isChallengeUnlocked(level)) {
                    this.startChallenge(level);
                }
            });
        });
    }

    isChallengeUnlocked(challengeNum) {
        if (challengeNum === 1) return true;
        // Unlock if previous challenge has at least 50 points
        return (this.challengeScores[challengeNum - 1] || 0) >= 50;
    }

    isChallengeCompleted(challengeNum) {
        // Consider completed if score is 50 or more (at least half)
        return (this.challengeScores[challengeNum] || 0) >= 50;
    }

    calculateTotalRank() {
        if (this.totalPoints >= 500) return 'Gold';
        if (this.totalPoints >= 400) return 'Silber';
        if (this.totalPoints >= 300) return 'Bronze';
        return ''; // Kein Rang bei weniger als 300 Punkten
    }

    updateRankBadge() {
        const rankBadge = document.getElementById('rankBadge');
        const rankIcon = document.getElementById('rankIcon');
        const rankLabel = document.getElementById('rankLabel');

        if (!rankBadge || !rankIcon || !rankLabel) return;

        const rank = this.calculateTotalRank();

        rankBadge.style.display = 'flex';
        rankBadge.className = 'rank-badge';

        if (rank.includes('Gold')) {
            rankBadge.classList.add('gold');
            rankIcon.textContent = '';
            rankLabel.textContent = 'Gold';
        } else if (rank.includes('Silber')) {
            rankBadge.classList.add('silver');
            rankIcon.textContent = '';
            rankLabel.textContent = 'Silber';
        } else if (rank.includes('Bronze')) {
            rankBadge.classList.add('bronze');
            rankIcon.textContent = '';
            rankLabel.textContent = 'Bronze';
        } else {
            rankBadge.style.display = 'none';
        }
    }

    startChallenge(challengeNum) {
        this.currentChallenge = challengeNum;
        this.showScreen('gameplayScreen');

        // Initialize TXP
        if (!this.txp) {
            this.txp = new TXPAssistant();
        }
        this.txp.show();

        // Initialize Task Manager
        if (!this.taskManager) {
            this.taskManager = new TaskManager(this);
        }

        // Load challenge data
        const challengeData = CHALLENGE_DATA[challengeNum];
        this.loadChallengeUI(challengeData);

        // Show overlay to darken screen while TXP talks
        const overlay = document.getElementById('txpIntroOverlay');
        if (overlay) {
            overlay.style.display = 'block';
        }

        // Start TXP dialog with callback to start game when done
        if (challengeData.tutorialMessages && challengeData.tutorialMessages.length > 0) {
            this.txp.startTutorial(challengeData.tutorialMessages, () => {
                this.onTXPDialogComplete(challengeData);
            });
        } else {
            // No dialog, start immediately
            this.onTXPDialogComplete(challengeData);
        }

        // Update HUD
        this.updateHUD();
    }

    loadChallengeUI(challengeData) {
        // Store challenge data for later
        this.pendingChallengeData = challengeData;

        // Load Copilot actions
        const actionsBar = document.getElementById('copilotActionsBar');
        if (actionsBar) {
            actionsBar.innerHTML = '';
            challengeData.availableActions.forEach(action => {
                const actionBtn = document.createElement('div');
                actionBtn.className = 'copilot-action';
                actionBtn.dataset.actionId = action.id;
                actionBtn.innerHTML = `
                    <div class="copilot-action-icon">${action.icon}</div>
                    <div class="copilot-action-title">${action.title}</div>
                `;
                actionBtn.addEventListener('click', () => {
                    this.handleAction(action.id);
                });
                actionsBar.appendChild(actionBtn);
            });
        }

        // Game loop will be started by onTXPDialogComplete() after TXP finishes talking
    }

    onTXPDialogComplete(challengeData) {
        // Hide the overlay
        const overlay = document.getElementById('txpIntroOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }

        // For Challenge 1, show tutorial overlay now (after TXP dialog)
        if (this.currentChallenge === 1) {
            this.showTutorial();
            // closeTutorial() will start the game
        } else {
            // For other challenges, start immediately
            setTimeout(() => {
                this.startGameLoop(challengeData);
            }, 500);
        }
    }

    startGameLoop(challengeData) {
        this.isGameRunning = true;
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.tasksCompleted = 0;
        this.timeRemaining = challengeData.duration;

        // Show HUD
        document.getElementById('timerDisplay').style.display = 'flex';
        document.getElementById('streakDisplay').style.display = 'flex';
        document.getElementById('scoreDisplay').style.display = 'flex';

        // Start task manager
        this.taskManager.start(challengeData);

        // Start timer
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateHUD();

            if (this.timeRemaining <= 0) {
                this.endChallenge(true); // Time's up, success if target reached
            }
        }, 1000);
    }

    handleAction(actionId) {
        if (!this.isGameRunning || this.isPaused) return;

        // Check if a task is selected
        if (!this.taskManager.selectedTask) {
            // Show visual feedback
            this.showNoTaskSelectedFeedback();
            return;
        }

        const isCorrect = this.taskManager.processTaskWithAction(actionId);

        if (isCorrect) {
            this.onTaskSuccess();
        } else {
            this.onTaskFailure();
        }
    }

    showNoTaskSelectedFeedback() {
        // Flash the task queue to indicate user needs to select a task
        const taskQueueArea = document.getElementById('taskQueueArea');
        if (taskQueueArea) {
            taskQueueArea.style.animation = 'none';
            setTimeout(() => {
                taskQueueArea.style.animation = 'pulse 0.5s ease-in-out';
                setTimeout(() => {
                    taskQueueArea.style.animation = '';
                }, 500);
            }, 10);
        }

        // Show hint via TXP
        if (this.txp && !this.txp.isInTutorialMode) {
            this.txp.showSpeech('Wähle erst eine Aufgabe aus!', false);
            setTimeout(() => {
                this.txp.hideSpeech();
            }, 2000);
        }
    }

    onTaskSuccess() {
        this.tasksCompleted++;
        this.streak++;
        if (this.streak > this.bestStreak) {
            this.bestStreak = this.streak;
        }

        // Calculate points (with streak multiplier, max 10 points)
        let points = 5;
        if (this.streak >= 5) points = 10; // Streak bonus: max 10 points

        // Add points but cap at 100
        this.score = Math.min(100, this.score + points);
        this.updateHUD();

        // Show success feedback
        this.showActionFeedback(true, Math.round(points));

        // Check if 100 points reached - level complete!
        if (this.score >= 100) {
            this.endChallenge(true);
        }
    }

    onTaskFailure() {
        this.streak = 0;

        // Deduct 5 points, but not below 0
        this.score = Math.max(0, this.score - 5);

        this.updateHUD();

        // Show failure feedback
        this.showActionFeedback(false, -5);
    }

    showActionFeedback(isCorrect, points) {
        const feedbackEl = document.getElementById('actionFeedback');
        const iconEl = document.getElementById('feedbackIcon');
        const textEl = document.getElementById('feedbackText');

        if (!feedbackEl || !iconEl || !textEl) return;

        // Set content based on result
        if (isCorrect) {
            iconEl.textContent = '✓';
            textEl.textContent = `Richtig! +${points} Punkte`;
            feedbackEl.className = 'action-feedback correct';
        } else {
            iconEl.textContent = '✗';
            textEl.textContent = `Falsch! ${points} Punkte`;
            feedbackEl.className = 'action-feedback incorrect';
        }

        // Show feedback
        feedbackEl.style.display = 'block';
        feedbackEl.classList.add('show');

        // Hide after animation completes
        setTimeout(() => {
            feedbackEl.style.display = 'none';
            feedbackEl.classList.remove('show');
        }, 800);
    }

    onTaskTimeout() {
        this.streak = 0;
        this.updateHUD();
    }

    updateHUD() {
        // Update timer
        const timerText = document.getElementById('timerText');
        if (timerText) {
            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining % 60;
            timerText.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        // Update streak
        const streakCount = document.getElementById('streakCount');
        if (streakCount) {
            streakCount.textContent = this.streak;
        }

        // Update score
        const scoreText = document.getElementById('scoreText');
        if (scoreText) {
            scoreText.textContent = this.score;
        }
    }

    endChallenge(success) {
        this.isGameRunning = false;

        // Stop everything
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        if (this.taskManager) {
            this.taskManager.stop();
        }

        // Hide HUD
        document.getElementById('timerDisplay').style.display = 'none';
        document.getElementById('streakDisplay').style.display = 'none';
        document.getElementById('scoreDisplay').style.display = 'none';

        // Save the score for this challenge (even if failed)
        const currentScore = Math.max(0, this.score);
        const previousScore = this.challengeScores[this.currentChallenge] || 0;

        // Only update if new score is better
        if (currentScore > previousScore) {
            this.challengeScores[this.currentChallenge] = currentScore;

            // Recalculate total points
            this.totalPoints = Object.values(this.challengeScores).reduce((sum, score) => sum + score, 0);

            // Save progress
            this.saveProgress();
        }

        // Check success
        const challengeData = CHALLENGE_DATA[this.currentChallenge];
        if (success && this.tasksCompleted >= challengeData.targetTasks) {
            this.completeChallenge();
        } else {
            // Failed - show retry option
            this.showFailureScreen();
        }
    }

    completeChallenge() {
        // Mark as completed (already saved in endChallenge)
        if (!this.completedChallenges.includes(this.currentChallenge)) {
            this.completedChallenges.push(this.currentChallenge);
        }

        // Show completion screen
        this.showCompletionScreen();
    }

    showCompletionScreen() {
        this.showScreen('challengeCompleteScreen');

        // Update stats
        document.getElementById('tasksCompleted').textContent = this.tasksCompleted;
        document.getElementById('bestStreak').textContent = this.bestStreak;
        document.getElementById('finalScore').textContent = this.score;

        // Success message
        const challengeData = CHALLENGE_DATA[this.currentChallenge];
        document.getElementById('successMessage').textContent = challengeData.successMessage;

        // Update rank badge
        this.updateRankBadge();
    }

    showFailureScreen() {
        // Check if user needs to see unlock requirement popup
        const currentScore = this.challengeScores[this.currentChallenge] || 0;
        const nextChallengeNum = this.currentChallenge + 1;

        // Show popup if: score < 50 AND next level exists AND next level is locked
        if (currentScore < 50 && nextChallengeNum <= GAME_CONFIG.totalChallenges && !this.isChallengeUnlocked(nextChallengeNum)) {
            this.showUnlockRequirementPopup(this.currentChallenge, nextChallengeNum);
        }

        // Go back to level select
        this.showLevelSelect();
    }

    showUnlockRequirementPopup(currentChallenge, nextChallenge) {
        const popup = document.getElementById('unlockRequirementPopup');
        const textElement = document.getElementById('unlockRequirementText');

        if (popup && textElement) {
            const challengeNames = {
                1: "Montag",
                2: "Dienstag",
                3: "Mittwoch",
                4: "Donnerstag",
                5: "Freitag"
            };

            textElement.innerHTML = `<strong>Challenge ${nextChallenge} (${challengeNames[nextChallenge]})</strong> wird freigeschaltet, wenn du in <strong>Challenge ${currentChallenge} (${challengeNames[currentChallenge]})</strong> mindestens <strong>50 Punkte</strong> holst.`;
            popup.style.display = 'flex';
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseMenu = document.getElementById('pauseMenu');
        if (pauseMenu) {
            pauseMenu.style.display = this.isPaused ? 'flex' : 'none';
        }
    }

    showTutorial() {
        const tutorialOverlay = document.getElementById('tutorialOverlay');
        if (tutorialOverlay) {
            tutorialOverlay.style.display = 'flex';
        }
    }

    saveProgress() {
        const progress = {
            completedChallenges: this.completedChallenges,
            totalPoints: this.totalPoints,
            challengeScores: this.challengeScores
        };
        localStorage.setItem(GAME_CONFIG.storageKey, JSON.stringify(progress));
    }

    loadProgress() {
        const saved = localStorage.getItem(GAME_CONFIG.storageKey);
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                this.completedChallenges = progress.completedChallenges || [];
                this.challengeScores = progress.challengeScores || {};

                // Migration: Convert old completedChallenges to challengeScores
                if (this.completedChallenges.length > 0 && Object.keys(this.challengeScores).length === 0) {
                    // Old save format - migrate to new format
                    this.completedChallenges.forEach(challengeNum => {
                        this.challengeScores[challengeNum] = 100; // Assume 100 points for completed challenges
                    });
                }

                // Recalculate total points from challengeScores
                this.totalPoints = Object.values(this.challengeScores).reduce((sum, score) => sum + score, 0);
            } catch (e) {
                console.error('Failed to load progress:', e);
            }
        }
    }
}

// ===== GLOBAL FUNCTIONS (for HTML onclick handlers) =====
function closeTutorial() {
    const tutorialOverlay = document.getElementById('tutorialOverlay');
    if (tutorialOverlay) {
        tutorialOverlay.style.display = 'none';
    }

    // Hide the TXP intro overlay as well
    const txpOverlay = document.getElementById('txpIntroOverlay');
    if (txpOverlay) {
        txpOverlay.style.display = 'none';
    }

    // Start the game after closing tutorial
    if (window.game && window.game.pendingChallengeData) {
        setTimeout(() => {
            window.game.startGameLoop(window.game.pendingChallengeData);
        }, 500);
    }
}

function resumeGame() {
    if (window.game) {
        window.game.togglePause();
    }
}

function returnToLevelSelect() {
    if (window.game) {
        window.game.isGameRunning = false;
        if (window.game.timerInterval) {
            clearInterval(window.game.timerInterval);
        }
        if (window.game.taskManager) {
            window.game.taskManager.stop();
        }
        window.game.showLevelSelect();
    }
}

function nextChallenge() {
    if (window.game) {
        const nextLevel = window.game.currentChallenge + 1;
        if (nextLevel <= GAME_CONFIG.totalChallenges && window.game.isChallengeUnlocked(nextLevel)) {
            window.game.startChallenge(nextLevel);
        } else {
            window.game.showLevelSelect();
        }
    }
}

function goToLevelSelect() {
    if (window.game) {
        window.game.showLevelSelect();
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

function hideUnlockRequirementPopup() {
    const popup = document.getElementById('unlockRequirementPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

function confirmReset() {
    if (window.game) {
        // Reset progress but keep total points for rank
        window.game.completedChallenges = [];
        window.game.challengeScores = {}; // Reset individual challenge scores to lock challenges
        // Keep totalPoints for rank display
        window.game.saveProgress();
        window.game.updateLevelSelectUI();
        hideResetConfirmation();
    }
}

// ===== INITIALIZATION =====
window.addEventListener('DOMContentLoaded', () => {
    window.game = new GameManager();
});
