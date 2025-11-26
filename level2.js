// Level 2 Game Logic - Bild-KI: "Auch Bilder sind kein Problem"

// Mo Man Animation System
class MoManHost {
    constructor() {
        this.element = document.getElementById('moHost');
        this.img = this.element.querySelector('.mo-host-img');
        this.speechBubble = document.getElementById('moSpeech');
        this.speechText = this.speechBubble.querySelector('p');

        // Animation properties
        this.currentFrame = 0;
        this.celebrationFrames = 23;
        this.speechFrames = 12;
        this.runFrames = 48;
        this.animationSpeed = 40;
        this.speechAnimationSpeed = 80;
        this.runAnimationSpeed = 18;
        this.animationInterval = null;
        this.speechTimeout = null;

        // Typewriter properties
        this.typewriterInterval = null;
        this.currentText = '';
        this.targetText = '';
        this.typewriterSpeed = 30;

        this.isIdle = true;
        this.isRunning = false;
        this.isDragging = false;

        // Interactive features
        this.autoSpeechTimer = null;
        this.autoSpeechInterval = 14000;
        this.lastAutoSpeechTime = Date.now();
        this.consecutiveCorrect = 0;
        this.totalAttempts = 0;
        this.hasSpokenRecently = false;

        // Preload running animation images
        this.preloadedRunImages = [];
        this.preloadRunningImages();

        this.startIdleAnimation();
        this.setupUnderstoodButton();
        this.startAutoSpeech();
        this.setupEasterEgg();
    }

    preloadRunningImages() {
        for (let i = 0; i < this.runFrames; i++) {
            const frameNumber = String(i).padStart(5, '0');
            const img = new Image();
            img.src = `./Mo%20man%20Lauf%202s%2024fps%2048%20frames/Mo%20man%20Lauf%20Pose_${frameNumber}.png`;
            this.preloadedRunImages.push(img);
        }
    }

    startIdleAnimation() {
        this.stopAnimation();
        this.isIdle = true;

        this.animationInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.celebrationFrames;
            const frameNumber = String(this.currentFrame).padStart(5, '0');
            this.img.src = `Mo_man_Stand_Pose/Mo man Stand Pose_${frameNumber}.png`;
        }, this.animationSpeed);
    }

    speak(text, persistentMode = false) {
        this.stopSpeaking();

        this.targetText = text;
        this.currentText = '';
        this.speechText.textContent = '';
        this.speechBubble.classList.add('visible');

        this.startSpeechAnimation();
        this.hasSpokenRecently = true;
        this.lastAutoSpeechTime = Date.now();

        this.startTypewriter();

        if (!persistentMode) {
            const totalDuration = (text.length * this.typewriterSpeed) + 4000;
            clearTimeout(this.speechTimeout);
            this.speechTimeout = setTimeout(() => {
                this.stopSpeaking();
                this.hasSpokenRecently = false;
            }, totalDuration);
        }
    }

    startTypewriter() {
        let charIndex = 0;

        this.typewriterInterval = setInterval(() => {
            if (charIndex < this.targetText.length) {
                this.currentText += this.targetText[charIndex];
                this.speechText.textContent = this.currentText;
                charIndex++;
            } else {
                clearInterval(this.typewriterInterval);
                this.typewriterInterval = null;
            }
        }, this.typewriterSpeed);
    }

    startSpeechAnimation() {
        this.stopAnimation();
        this.isIdle = false;

        this.animationInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.speechFrames;
            const frameNumber = String(this.currentFrame).padStart(5, '0');
            this.img.src = `Moman_speech_animation/Moman Rede_${frameNumber}.png`;
        }, this.speechAnimationSpeed);
    }

    startCelebrationAnimation() {
        this.stopAnimation();
        this.isIdle = false;

        this.animationInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.celebrationFrames;
            const frameNumber = String(this.currentFrame).padStart(5, '0');
            this.img.src = `Mo_man_Stand_Pose/Mo man Stand Pose_${frameNumber}.png`;
        }, this.animationSpeed);
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        this.currentFrame = 0;
    }

    stopSpeaking() {
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }

        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
            this.speechTimeout = null;
        }

        this.speechBubble.classList.remove('visible');

        const understoodBtn = document.getElementById('understoodButton');
        if (understoodBtn) {
            understoodBtn.style.display = 'none';
        }

        this.startIdleAnimation();
    }

    celebrate() {
        this.stopSpeaking();
        this.startCelebrationAnimation();

        setTimeout(() => {
            this.startIdleAnimation();
        }, 2000);
    }

    setupUnderstoodButton() {
        const understoodBtn = document.getElementById('understoodButton');
        if (understoodBtn) {
            understoodBtn.addEventListener('click', () => {
                this.stopSpeaking();
            });
        }
    }

    showUnderstoodButton(callback) {
        const understoodBtn = document.getElementById('understoodButton');
        if (understoodBtn) {
            understoodBtn.style.display = 'block';

            understoodBtn.replaceWith(understoodBtn.cloneNode(true));
            const newBtn = document.getElementById('understoodButton');

            newBtn.addEventListener('click', () => {
                newBtn.style.display = 'none';
                this.stopSpeaking();
                if (callback) callback();
            });
        }
    }

    startAutoSpeech() {
        this.autoSpeechTimer = setInterval(() => {
            if (!this.hasSpokenRecently && !this.speechBubble.classList.contains('visible')) {
                this.speakRandomComment();
            }
        }, this.autoSpeechInterval);
    }

    speakRandomComment() {
        const comments = this.getContextualComments();
        if (comments.length > 0) {
            const randomComment = comments[Math.floor(Math.random() * comments.length)];
            this.speak(randomComment);
        }
    }

    getContextualComments() {
        const allComments = [
            // Bild-KI specific comments
            "Wusstest du? KI kann heute nicht nur Bilder erkennen, sondern auch erstellen!",
            "Bei Bild-Prompts ist Präzision alles - je genauer, desto besser das Ergebnis!",
            "Text-zu-Bild KI wird immer besser. Aber Vorsicht bei Markenrechten!",
            "KI-Bilder müssen oft gekennzeichnet werden - Transparenz ist wichtig!",
            "Synthetische Trainingsdaten sparen Zeit und Ressourcen in der Produktion!",

            // Encouragement
            "Du machst das gut! Bild-Prompts sind eine echte Kunst.",
            "Achte auf Details wie Stil, Perspektive und Stimmung!",
            "Denk daran: Ein guter Bild-Prompt beschreibt, was du SIEHST.",

            // Score based
            ...this.getScoreBasedComments(),
            ...this.getStreakComments(),
        ];

        return allComments;
    }

    getScoreBasedComments() {
        if (totalScore === 0) {
            return [
                "Bereit für die Welt der Bild-KI? Los geht's!",
                "Lass uns lernen, wie man perfekte Bild-Prompts schreibt!"
            ];
        } else if (totalScore >= 30) {
            return [
                `${totalScore} Punkte! Du verstehst Bild-KI richtig gut!`,
                "Du entwickelst ein Auge für gute Bild-Prompts!"
            ];
        } else if (totalScore >= 15) {
            return [
                `${totalScore} Punkte! Du lernst schnell!`,
                "Weiter so! Bald bist du Bild-KI Experte!"
            ];
        }
        return [];
    }

    getStreakComments() {
        if (this.consecutiveCorrect >= 3) {
            return [
                `${this.consecutiveCorrect} richtige in Folge! Du hast den Dreh raus!`,
                "Beeindruckend! Du erkennst die Muster!"
            ];
        } else if (this.consecutiveCorrect >= 2) {
            return [
                "Zwei richtige! Du verstehst das Prinzip!"
            ];
        }
        return [];
    }

    updateStats(correct) {
        this.totalAttempts++;
        if (correct) {
            this.consecutiveCorrect++;
        } else {
            this.consecutiveCorrect = 0;
        }
    }

    celebrateCorrectAnswer() {
        this.celebrate();
        this.updateStats(true);

        const celebrations = [
            "Genau richtig! Du erkennst gute Bild-Prompts!",
            "Perfekt! Das ist der richtige Prompt!",
            "Super! Du verstehst die Zusammenhänge!",
            "Exzellent! So sieht Bild-KI Expertise aus!",
            "Wow! Du hast ein gutes Auge dafür!"
        ];

        const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];
        this.speak(randomCelebration);
    }

    encourageAfterWrongAnswer() {
        this.updateStats(false);

        const encouragements = [
            "Nicht ganz! Schau dir die Details genauer an.",
            "Das war knapp! Achte auf die Beschreibungen.",
            "Kein Problem! Lass uns schauen warum...",
            "Fast! Bei Bild-Prompts zählt jedes Detail.",
            "Guter Versuch! Die Unterschiede sind subtil."
        ];

        const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        this.speak(randomEncouragement);
    }

    setupEasterEgg() {
        this.element.style.cursor = 'move';
        this.setupDragAndDrop();
        this.setupKeyboardControls();
    }

    setupKeyboardControls() {
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.moveSpeed = 5;

        document.addEventListener('keydown', (e) => {
            if (this.isDragging) return;

            if (e.key === 'ArrowLeft' && !this.isMovingLeft) {
                this.isMovingLeft = true;
                this.startMovement('left');
            } else if (e.key === 'ArrowRight' && !this.isMovingRight) {
                this.isMovingRight = true;
                this.startMovement('right');
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft') {
                this.isMovingLeft = false;
                if (!this.isMovingRight) this.stopMovement();
            } else if (e.key === 'ArrowRight') {
                this.isMovingRight = false;
                if (!this.isMovingLeft) this.stopMovement();
            }
        });
    }

    startMovement(direction) {
        if (this.isRunning) return;

        this.isRunning = true;
        this.currentDirection = direction;
        this.stopAnimation();

        this.animationInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.runFrames;
            if (this.preloadedRunImages[this.currentFrame]) {
                this.img.src = this.preloadedRunImages[this.currentFrame].src;
            }
        }, this.runAnimationSpeed);

        if (direction === 'left') {
            this.img.style.transform = 'scaleX(-1)';
        } else {
            this.img.style.transform = 'scaleX(1)';
        }

        const move = () => {
            if (!this.isRunning) return;

            const container = this.element.parentElement;
            const currentLeft = parseInt(container.style.left || '60');

            if (direction === 'left' && this.isMovingLeft) {
                const newLeft = Math.max(0, currentLeft - this.moveSpeed);
                container.style.left = newLeft + 'px';
            } else if (direction === 'right' && this.isMovingRight) {
                const maxRight = window.innerWidth - 150;
                const newLeft = Math.min(maxRight, currentLeft + this.moveSpeed);
                container.style.left = newLeft + 'px';
            }

            if (this.isRunning) {
                requestAnimationFrame(move);
            }
        };

        move();
    }

    stopMovement() {
        this.isRunning = false;
        this.stopAnimation();
        this.img.style.transform = 'scaleX(1)';
        this.startIdleAnimation();
    }

    setupDragAndDrop() {
        const container = this.element.parentElement;
        let isDragging = false;
        let offsetX, offsetY;

        const onMouseDown = (e) => {
            if (this.isRunning) return;

            isDragging = true;
            this.isDragging = true;

            const rect = container.getBoundingClientRect();

            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            this.element.style.cursor = 'grabbing';
            e.preventDefault();
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;

            container.style.left = newX + 'px';
            container.style.top = newY + 'px';
            container.style.bottom = 'auto';
        };

        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                this.element.style.cursor = 'move';

                setTimeout(() => {
                    this.isDragging = false;
                }, 100);
            }
        };

        this.element.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        this.dragCleanup = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }

    destroy() {
        this.stopAnimation();
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
        }
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
        }
        if (this.autoSpeechTimer) {
            clearInterval(this.autoSpeechTimer);
        }
        if (this.dragCleanup) {
            this.dragCleanup();
        }
    }
}

let currentChallenge = 0;
let totalScore = 0;
let gameState = 'intro';
let moHost;
let selectedChallenges = [];
const MAX_CHALLENGES = 5;

// Tutorial Data
const tutorials = [
    {
        id: 1,
        title: "Tutorial",
        concept: "Die 3 goldenen Regeln für Bild-KI Prompts",
        examples: [
            {
                situation: "Beispiel: Du möchtest ein Bild einer modernen, nachhaltigen Fabrik für eine Präsentation",
                badPrompt: "Fabrik",
                badPoints: "0 Punkte",
                whyBad: "Viel zu vage - welche Art Fabrik? Welcher Stil? Welche Stimmung?",
                mediumPrompt: "Moderne Autofabrik mit Solardach",
                mediumPoints: "3 Punkte",
                whyMedium: "Besser! Aber Stil, Perspektive und Details fehlen noch.",
                goodPrompt: "Fotorealistische moderne Produktionshalle, nachhaltig mit Solardach und Grünflächen, helle Beleuchtung, Vogelperspektive, Mercedes-Benz Stil",
                goodPoints: "10 Punkte",
                whyGood: "Perfekt! Stil, Perspektive, Stimmung und spezifische Details definiert."
            }
        ],
        principle: "Die drei goldenen Regeln: Visuell konkret sein • Stil & Perspektive definieren • Grenzen kennen (Marken, Kennzeichnung)"
    }
];

// Challenge Data - 8 Challenges for random selection
const challenges = [
    {
        id: 1,
        title: "Challenge 1: Nachhaltige Fabrik der Zukunft",
        description: "Du siehst ein KI-generiertes Bild einer modernen, nachhaltigen Produktionshalle. Welcher Prompt hat dieses Bild erzeugt?",
        image: "placeholder_factory.png",
        imageDescription: "Moderne Produktionshalle mit Solardach, viel Glas, grünen Pflanzen, heller Beleuchtung, saubere Linien",
        prompts: [
            {
                text: "Fabrik mit Autos",
                quality: "poor",
                score: 0,
                explanation: "Viel zu vage! 'Fabrik mit Autos' sagt nichts über Stil, Nachhaltigkeit, Beleuchtung oder Perspektive. Die KI würde ein völlig anderes, generisches Bild erzeugen."
            },
            {
                text: "Moderne Autofabrik, nachhaltig",
                quality: "good",
                score: 3,
                explanation: "Auf dem richtigen Weg! Aber es fehlen wichtige visuelle Details: Welcher Stil? Welche Perspektive? Welche Beleuchtung? Das Ergebnis wäre unvorhersehbar."
            },
            {
                text: "Fotorealistische moderne Produktionshalle mit Solardach, Glasfassade, integrierten Grünflächen, helle natürliche Beleuchtung, saubere Architektur, Weitwinkel-Perspektive",
                quality: "excellent",
                score: 10,
                explanation: "Perfekt! Alle visuellen Elemente sind definiert: Stil (fotorealistisch), Architektur (Solardach, Glas, Grünflächen), Beleuchtung (hell, natürlich), Perspektive (Weitwinkel). So entsteht genau dieses Bild!"
            }
        ],
        hint: "Achte auf die visuellen Details im Bild: Beleuchtung, Architekturelemente, Perspektive. Ein guter Prompt beschreibt all das!"
    },
    {
        id: 2,
        title: "Challenge 2: Produktionshalle mit Robotern",
        description: "Dieses Bild zeigt eine futuristische Produktionshalle mit Robotern und holografischen Displays. Welcher Prompt passt?",
        image: "placeholder_robots.png",
        imageDescription: "Futuristische Halle mit Industrierobotern, holografischen Anzeigen, blaues Licht, High-Tech Atmosphäre",
        prompts: [
            {
                text: "Futuristische Mercedes-Benz Produktionshalle, Industrieroboter bei der Arbeit, holografische Displays mit Produktionsdaten, blaue LED-Beleuchtung, High-Tech Atmosphäre, cinematische Perspektive",
                quality: "excellent",
                score: 10,
                explanation: "Exzellent! Der Prompt beschreibt exakt das Bild: Roboter, Holografie, blaue Beleuchtung, High-Tech Stil, und sogar die cinematische Perspektive. Alle visuellen Elemente sind abgedeckt!"
            },
            {
                text: "Roboter in Fabrik",
                quality: "poor",
                score: 0,
                explanation: "Viel zu simpel! Welche Art Roboter? Welche Fabrik? Welche Atmosphäre? Das Ergebnis wäre komplett zufällig und würde nicht so aussehen."
            },
            {
                text: "Moderne Fabrikhalle mit Robotern und Displays",
                quality: "good",
                score: 3,
                explanation: "Okay, aber zu unspezifisch! Es fehlen: Beleuchtungsfarbe, Stil (futuristisch), Art der Displays (holografisch), Perspektive. Das Bild würde anders aussehen."
            }
        ],
        hint: "Schau dir die Beleuchtung und Atmosphäre genau an - das sind wichtige Hinweise für den richtigen Prompt!"
    },
    {
        id: 3,
        title: "Challenge 3: Was kann schiefgehen?",
        description: "Dieses Bild zeigt einen 'Mercedes Sportwagen' - aber etwas stimmt nicht. Das Auto sieht nicht wirklich nach Mercedes aus. Welcher Prompt hat das verursacht?",
        image: "placeholder_wrong_car.png",
        imageDescription: "Sportwagen der entfernt wie ein Mercedes aussehen soll, aber falsche Details hat (falsches Logo-Design, untypische Proportionen)",
        prompts: [
            {
                text: "Mercedes Sportwagen, sportlich, schnell",
                quality: "poor",
                score: 0,
                explanation: "Das ist das Problem! Ohne genaue Markenspezifikationen erfindet die KI etwas, das 'wie Mercedes aussehen soll' - aber Markendetails falsch interpretiert. KI kennt keine Markenrechte!"
            },
            {
                text: "Generischer Sportwagen im Premium-Segment, elegantes Design, silbermetallic, Studiobeleuchtung",
                quality: "excellent",
                score: 10,
                explanation: "Das ist der sichere Weg! Statt Markennamen zu verwenden, beschreibst du den STIL: Premium, elegant, Farbe, Beleuchtung. So vermeidest du Markenrechtsprobleme und bekommst trotzdem ein hochwertiges Ergebnis!"
            },
            {
                text: "Sportwagen",
                quality: "good",
                score: 3,
                explanation: "Zu vage, aber immerhin ohne Markenrisiko. Das Ergebnis wäre sehr zufällig - könntest jeden Sportwagen bekommen."
            }
        ],
        hint: "Vorsicht bei Markennamen! KI kann Logos und markenspezifische Details falsch darstellen. Beschreibe lieber den STIL!"
    },
    {
        id: 4,
        title: "Challenge 4: Synthetische Fehlerbilder",
        description: "Dieses Bild zeigt einen Lackschaden auf einer Motorhaube - aber es ist KI-generiert für Trainingszwecke. Welcher Prompt erzeugt solche synthetischen Trainingsdaten?",
        image: "placeholder_scratch.png",
        imageDescription: "Nahaufnahme einer Motorhaube mit realistischem Kratzer, professionelle Studiobeleuchtung, technische Dokumentationsperspektive",
        prompts: [
            {
                text: "Kratzer auf Auto",
                quality: "poor",
                score: 0,
                explanation: "Viel zu unspezifisch für Trainingsdaten! Wo genau? Welche Perspektive? Welche Beleuchtung? Für KI-Training braucht man konsistente, präzise Bilder."
            },
            {
                text: "Fotorealistische Nahaufnahme einer schwarzen Motorhaube mit linearem Kratzer (5cm), Studiobeleuchtung von links, technische Dokumentationsperspektive, hohe Auflösung, für QS-Training",
                quality: "excellent",
                score: 10,
                explanation: "Perfekt für Trainingsdaten! Exakte Spezifikationen: Bauteil (Motorhaube), Fehlerart (linearer Kratzer), Größe (5cm), Beleuchtung, Perspektive, Zweck. So entstehen konsistente Trainingsbilder!"
            },
            {
                text: "Motorhaube mit Kratzer, Nahaufnahme",
                quality: "good",
                score: 3,
                explanation: "Grundidee stimmt, aber für Trainingsdaten zu ungenau. Welche Kratzergröße? Welche Beleuchtung? Trainingsdaten müssen konsistent sein!"
            }
        ],
        hint: "Für synthetische Trainingsdaten braucht man sehr präzise Prompts - Bauteil, Fehlerart, Größe, Beleuchtung, Perspektive!"
    },
    {
        id: 5,
        title: "Challenge 5: KI-Kennzeichnung",
        description: "Du siehst zwei Bilder: Eine fotorealistische Büro-Szene und eine Comic-Stil Illustration. Welches Bild muss als KI-generiert gekennzeichnet werden?",
        image: "placeholder_office.png",
        imageDescription: "Zwei Bilder nebeneinander: Links fotorealistisches Büro, rechts Comic-Stil Büro",
        prompts: [
            {
                text: "Nur das fotorealistische Bild - bei offensichtlich künstlerischen Darstellungen wie Comic-Stil kann die Kennzeichnung entfallen",
                quality: "excellent",
                score: 10,
                explanation: "Richtig! Fotorealistische KI-Bilder müssen gekennzeichnet werden, da sie mit echten Fotos verwechselt werden können. Bei offensichtlich künstlerischen Stilen (Comic, Illustration) ist die KI-Herkunft erkennbar - Kennzeichnung kann entfallen."
            },
            {
                text: "Beide Bilder müssen immer gekennzeichnet werden",
                quality: "good",
                score: 3,
                explanation: "Nicht ganz! Generell ist Transparenz wichtig, aber bei offensichtlich künstlerischen Darstellungen (Comic, Cartoon) ist die Nicht-Echtheit erkennbar. Die Kennzeichnungspflicht bezieht sich vor allem auf fotorealistische Inhalte."
            },
            {
                text: "Keines - KI-Bilder müssen nie gekennzeichnet werden",
                quality: "poor",
                score: 0,
                explanation: "Falsch! KI-generierte Inhalte müssen in vielen Kontexten gekennzeichnet werden - besonders fotorealistische Bilder. Transparenz verhindert Missverständnisse und erfüllt gesetzliche Vorschriften!"
            }
        ],
        hint: "Denke darüber nach, wann jemand ein Bild für 'echt' halten könnte - das ist der Schlüssel zur Kennzeichnungspflicht!"
    },
    {
        id: 6,
        title: "Challenge 6: Studio-Erweiterung mit KI",
        description: "Ein Foto aus einem Studio wurde mit KI nach links und rechts erweitert. Welcher Prompt erzeugt eine passende, konsistente Erweiterung?",
        image: "placeholder_studio.png",
        imageDescription: "Studiofoto in der Mitte, links und rechts KI-generierte Erweiterungen mit passenden Elementen, gleichem Stil und Beleuchtung",
        prompts: [
            {
                text: "Erweitere das Bild",
                quality: "poor",
                score: 0,
                explanation: "Viel zu vage! Die KI weiß nicht, in welchem Stil, mit welcher Beleuchtung oder welchen Elementen. Das Ergebnis würde nicht zum Originalbild passen."
            },
            {
                text: "Erweitere das Studiofoto horizontal, behalte gleiche Beleuchtung (Softbox von oben), füge passende Studio-Equipment hinzu, gleicher Hintergrund-Farbton, konsistenter fotografischer Stil",
                quality: "excellent",
                score: 10,
                explanation: "Perfekt! Alle wichtigen Konsistenz-Faktoren sind definiert: Richtung (horizontal), Beleuchtung (Softbox), Inhalt (Studio-Equipment), Farbton, Stil. So passt die Erweiterung nahtlos!"
            },
            {
                text: "Studio-Erweiterung mit Equipment",
                quality: "good",
                score: 3,
                explanation: "Richtige Idee, aber zu wenig Details! Ohne Beleuchtungs- und Stilangaben könnte die Erweiterung visuell abweichen und nicht zum Original passen."
            }
        ],
        hint: "Bei Bild-Erweiterungen ist Konsistenz alles - Beleuchtung, Stil und Farbton müssen zum Original passen!"
    },
    {
        id: 7,
        title: "Challenge 7: Qualitätskontrolle - Kabelbaum",
        description: "Dieses Bild zeigt einen Kabelbaum zur Qualitätsprüfung. Ein Kabel ist falsch verlegt. Welcher Prompt würde die KI trainieren, solche Fehler zu erkennen?",
        image: "placeholder_cables.png",
        imageDescription: "Kabelbaum im Fahrzeug, ein Kabel ist sichtbar falsch verlegt, technische Beleuchtung, Inspektionsperspektive",
        prompts: [
            {
                text: "Technische Aufnahme Kabelbaum in Fahrzeug-Innenraum, ein Kabel fehlerhaft verlegt (überkreuzt), Rest korrekt, gleichmäßige Inspektionsbeleuchtung, Dokumentationsperspektive, für QS-Training",
                quality: "excellent",
                score: 10,
                explanation: "Perfekt für QS-Training! Präzise Spezifikation: Bauteil (Kabelbaum), Fehlerart (überkreuzt), Kontext (Rest korrekt), Beleuchtung, Perspektive und Zweck. So lernt die KI genau diese Fehlerart!"
            },
            {
                text: "Kabel im Auto",
                quality: "poor",
                score: 0,
                explanation: "Viel zu unspezifisch! Für Qualitätskontroll-Training braucht man exakte Fehlerbeschreibungen, Perspektiven und Kontexte. 'Kabel im Auto' ist nutzlos für Training."
            },
            {
                text: "Kabelbaum mit Fehler, Nahaufnahme",
                quality: "good",
                score: 3,
                explanation: "Grundidee stimmt, aber: Welcher Fehler genau? Welche Beleuchtung? Für konsistentes Training braucht man mehr Details über die Fehlerart."
            }
        ],
        hint: "Für Qualitätskontroll-Training muss die Fehlerart exakt beschrieben werden - sonst lernt die KI das Falsche!"
    },
    {
        id: 8,
        title: "Challenge 8: Heatmap-Analyse",
        description: "Du siehst eine Heatmap, die zeigt, wo auf einer Motorhaube die meisten Kratzer auftreten. Welcher Prompt hat diese Visualisierung erzeugt?",
        image: "placeholder_heatmap.png",
        imageDescription: "Motorhauben-Silhouette mit farbiger Heatmap (rot = häufige Kratzer, blau = selten), klare Legende, technischer Stil",
        prompts: [
            {
                text: "Motorhaube mit Kratzern",
                quality: "poor",
                score: 0,
                explanation: "Das würde ein Foto mit Kratzern erzeugen - keine Heatmap! Für Datenvisualisierungen braucht man völlig andere Prompts."
            },
            {
                text: "Technische Heatmap-Visualisierung einer Motorhauben-Silhouette, Farbskala rot-gelb-blau für Kratzer-Häufigkeit, klare Legende, weißer Hintergrund, Daten-Analyse Stil",
                quality: "excellent",
                score: 10,
                explanation: "Perfekt! Der Prompt beschreibt eine VISUALISIERUNG, nicht ein Foto: Heatmap-Typ, Farbskala, Legende, Hintergrund, Stil. So entsteht eine klare Datenvisualisierung!"
            },
            {
                text: "Kratzer-Statistik Motorhaube",
                quality: "good",
                score: 3,
                explanation: "Richtige Richtung - es geht um Daten, nicht Fotos. Aber ohne Angabe des Visualisierungstyps (Heatmap), Farbskala und Stil wäre das Ergebnis unvorhersehbar."
            }
        ],
        hint: "Für Datenvisualisierungen (Heatmaps, Diagramme) brauchst du andere Prompts als für Fotos - beschreibe den VISUALISIERUNGSTYP!"
    }
];

// Function to select 5 random challenges from the pool
function selectRandomChallenges() {
    const allChallenges = [...challenges];

    // Shuffle array using Fisher-Yates algorithm
    for (let i = allChallenges.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allChallenges[i], allChallenges[j]] = [allChallenges[j], allChallenges[i]];
    }

    selectedChallenges = allChallenges.slice(0, MAX_CHALLENGES);
}

// Game Functions
function startGame() {
    currentChallenge = 0;
    totalScore = 0;
    gameState = 'tutorial';

    selectRandomChallenges();

    if (moHost) {
        moHost.speak("Super! Lass uns die Welt der Bild-KI erkunden!");
    }

    updateScore(0);
    showTutorial();
}

function showTutorial() {
    const tutorial = tutorials[0];

    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    document.getElementById('tutorialScreen').classList.add('active');

    document.getElementById('tutorialTitle').textContent = tutorial.title;
    document.getElementById('tutorialConcept').textContent = tutorial.concept;

    createTutorialExamples(tutorial);
    createGoldenRules();
    updateProgress();
}

function createTutorialExamples(tutorial) {
    const container = document.getElementById('tutorialExamples');
    container.innerHTML = '';

    tutorial.examples.forEach((example) => {
        const exampleCard = document.createElement('div');
        exampleCard.className = 'example-card';

        exampleCard.innerHTML = `
            <div class="example-situation">${example.situation}</div>
            <div class="prompt-comparison">
                <div class="bad-prompt">
                    <div class="prompt-label">❌ Schlechter Prompt:</div>
                    <div class="prompt-text">"${example.badPrompt}"</div>
                    <div class="prompt-explanation">${example.whyBad}</div>
                    <div class="prompt-points">${example.badPoints}</div>
                </div>
                <div class="medium-prompt">
                    <div class="prompt-label">⚠️ Mittlerer Prompt:</div>
                    <div class="prompt-text">"${example.mediumPrompt}"</div>
                    <div class="prompt-explanation">${example.whyMedium}</div>
                    <div class="prompt-points">${example.mediumPoints}</div>
                </div>
                <div class="good-prompt">
                    <div class="prompt-label">✅ Guter Prompt:</div>
                    <div class="prompt-text">"${example.goodPrompt}"</div>
                    <div class="prompt-explanation">${example.whyGood}</div>
                    <div class="prompt-points">${example.goodPoints}</div>
                </div>
            </div>
        `;

        container.appendChild(exampleCard);
    });
}

function createGoldenRules() {
    const container = document.getElementById('goldenRules');
    container.innerHTML = '';

    const rules = [
        {
            number: 1,
            title: "Visuell konkret sein"
        },
        {
            number: 2,
            title: "Stil & Perspektive definieren"
        },
        {
            number: 3,
            title: "Grenzen kennen"
        }
    ];

    rules.forEach((rule) => {
        const ruleCard = document.createElement('div');
        ruleCard.className = 'golden-rule-card';

        ruleCard.innerHTML = `
            <div class="golden-rule-number">Regel ${rule.number}:</div>
            <div class="golden-rule-title">${rule.title}</div>
        `;

        container.appendChild(ruleCard);
    });
}

function startChallenge() {
    gameState = 'challenge';
    document.getElementById('tutorialScreen').classList.remove('active');
    showChallenge();
}

function showChallenge() {
    if (currentChallenge >= selectedChallenges.length) {
        showCompletion();
        return;
    }

    const challenge = selectedChallenges[currentChallenge];

    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    document.getElementById('challengeScreen').classList.add('active');

    // Update challenge content
    const displayNumber = currentChallenge + 1;
    const titleWithCorrectNumber = challenge.title.replace(/Challenge \d+:/, `Challenge ${displayNumber}:`);

    const titleElement = document.getElementById('challengeTitle');
    titleElement.innerHTML = titleWithCorrectNumber.split('').map(char => {
        if (char === ' ') {
            return '<span class="letter-space">&nbsp;</span>';
        }
        return `<span class="letter-char">${char}</span>`;
    }).join('');

    document.getElementById('challengeDescription').textContent = challenge.description;

    // Show image placeholder with description
    const imagePlaceholder = document.getElementById('imagePlaceholder');
    const generatedImage = document.getElementById('generatedImage');

    // For now, show description as placeholder (would be replaced with actual images)
    imagePlaceholder.innerHTML = `
        <div class="image-icon">🖼️</div>
        <p style="font-size: 0.8rem; padding: 10px; text-align: left;">${challenge.imageDescription}</p>
    `;
    imagePlaceholder.style.display = 'block';
    generatedImage.style.display = 'none';

    updateProgress();
    createPromptOptions(challenge);
    hideHint();

    // Reset submit button
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.textContent = 'Auswahl bestätigen';
        submitButton.classList.remove('continue-btn-style');
        submitButton.onclick = submitPrompt;
        disableSubmitButton();
    }
}

function createPromptOptions(challenge) {
    const container = document.getElementById('promptOptions');
    container.innerHTML = '';

    challenge.prompts.forEach((prompt, index) => {
        const option = document.createElement('div');
        option.className = 'prompt-option';
        option.innerHTML = `
            <input type="radio" name="promptChoice" value="${index}" id="prompt${index}">
            <label for="prompt${index}">${prompt.text}</label>
        `;

        option.addEventListener('click', () => {
            document.querySelectorAll('.prompt-option').forEach(opt => {
                opt.classList.remove('selected');
            });

            option.classList.add('selected');
            option.querySelector('input[type="radio"]').checked = true;
            enableSubmitButton();
        });

        container.appendChild(option);
    });
}

function enableSubmitButton() {
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.classList.remove('disabled');
        submitButton.classList.add('enabled');
        submitButton.disabled = false;
    }
}

function disableSubmitButton() {
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.classList.remove('enabled');
        submitButton.classList.add('disabled');
        submitButton.disabled = true;
    }
}

function submitPrompt() {
    const selectedPrompt = document.querySelector('input[name="promptChoice"]:checked');

    if (!selectedPrompt) {
        alert('Bitte wähle einen Prompt aus!');
        return;
    }

    const promptIndex = parseInt(selectedPrompt.value);
    const chosenPrompt = selectedChallenges[currentChallenge].prompts[promptIndex];
    const score = chosenPrompt.score;

    showResults(score, chosenPrompt);
}

function showResults(score, chosenPrompt) {
    totalScore += score;
    updateScore(totalScore);

    if (moHost) {
        if (score > 0) {
            moHost.celebrateCorrectAnswer();
        } else {
            moHost.encourageAfterWrongAnswer();
        }
    }

    document.getElementById('challengeScreen').classList.remove('active');
    document.getElementById('resultsScreen').classList.add('active');

    document.getElementById('resultsTitle').textContent = `Challenge ${currentChallenge + 1} Abgeschlossen!`;
    document.getElementById('scoreEarned').textContent = `+${score} Punkte!`;
    document.getElementById('explanationText').textContent = chosenPrompt.explanation;
}

function nextChallenge() {
    currentChallenge++;

    if (moHost) {
        const transitionMessages = [
            "Weiter geht's! Die nächste Bild-Challenge wartet!",
            "Du lernst schnell! Bereit für mehr?",
            "Sehr gut! Lass uns weitermachen!",
            "Auf zur nächsten Challenge!",
            "Du wirst immer besser!"
        ];
        const randomMessage = transitionMessages[Math.floor(Math.random() * transitionMessages.length)];
        moHost.speak(randomMessage);
    }

    document.getElementById('resultsScreen').classList.remove('active');
    showChallenge();
}

function showCompletion() {
    gameState = 'completion';

    if (moHost) {
        let finalMessage = "";
        if (totalScore >= 45) {
            finalMessage = `Unglaublich! ${totalScore} Punkte! Du bist ein Bild-KI Experte!`;
        } else if (totalScore >= 35) {
            finalMessage = `Sehr gut! ${totalScore} Punkte! Du verstehst Bild-KI richtig gut!`;
        } else if (totalScore >= 25) {
            finalMessage = `Gut gemacht! ${totalScore} Punkte! Solide Grundlagen!`;
        } else {
            finalMessage = `${totalScore} Punkte - ein guter Start! Übung macht den Meister!`;
        }
        moHost.speak(finalMessage);
    }

    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    document.getElementById('completionScreen').classList.add('active');

    updateProgress();

    document.getElementById('finalScore').textContent = totalScore;
    document.getElementById('rankValue').textContent = getRank(totalScore).title;

    saveProgress();
    triggerCelebration();
}

function getRank(score) {
    if (score >= 50) return { title: "Gold", description: "Bild-KI Meister!" };
    if (score >= 40) return { title: "Silber", description: "Sehr gute Leistung!" };
    if (score >= 25) return { title: "Bronze", description: "Solide Grundlagen!" };
    return { title: "Kein Rang", description: "Weiter üben!" };
}

function triggerCelebration() {
    document.querySelector('.completion-title').style.animation = 'celebration 2s ease-in-out infinite alternate';
    createConfetti();
}

function createConfetti() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = ['#F5C03B', '#00CED1', '#20B2AA'][Math.floor(Math.random() * 3)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = 'fall 3s linear forwards';

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 100);
    }
}

// Add CSS for confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function restartGame() {
    currentChallenge = 0;
    totalScore = 0;
    gameState = 'intro';
    selectedChallenges = [];

    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    document.getElementById('introScreen').classList.add('active');

    updateScore(0);
    updateProgress();
    displayRankBadge();
}

function updateScore(score) {
    const scoreElement = document.getElementById('scoreValue');
    scoreElement.textContent = score;

    scoreElement.classList.add('updated');
    setTimeout(() => {
        scoreElement.classList.remove('updated');
    }, 500);
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    if (gameState === 'intro' || gameState === 'tutorial') {
        progressText.textContent = '';
        progressFill.style.width = '0%';
        return;
    }

    const progress = ((currentChallenge) / MAX_CHALLENGES) * 100;
    progressFill.style.width = progress + '%';

    if (currentChallenge >= MAX_CHALLENGES) {
        progressText.textContent = 'Geschafft!';
    } else {
        const displayChallenge = Math.min(currentChallenge + 1, MAX_CHALLENGES);
        progressText.textContent = `Challenge ${displayChallenge}/${MAX_CHALLENGES}`;
    }
}

function showHint() {
    const hintBox = document.getElementById('hintBox');
    const hintText = document.getElementById('hintText');

    hintText.textContent = selectedChallenges[currentChallenge].hint;
    hintBox.classList.add('show');
}

function hideHint() {
    const hintBox = document.getElementById('hintBox');
    hintBox.classList.remove('show');
}

function saveProgress() {
    const currentRank = getRank(totalScore);
    const existingProgress = loadProgress();

    const rankValues = {
        "Kein Rang": 0,
        "Bronze": 1,
        "Silber": 2,
        "Gold": 3
    };

    let rankToSave = currentRank.title;
    let scoreToSave = totalScore;

    if (existingProgress && existingProgress.rank) {
        const existingRankValue = rankValues[existingProgress.rank] || 0;
        const currentRankValue = rankValues[currentRank.title] || 0;

        if (existingRankValue > currentRankValue) {
            rankToSave = existingProgress.rank;
        }

        if (existingProgress.score > totalScore) {
            scoreToSave = existingProgress.score;
        }
    }

    const progress = {
        level: 2,
        completed: true,
        score: scoreToSave,
        rank: rankToSave,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('aiBytes_level2_progress', JSON.stringify(progress));
}

function loadProgress() {
    const saved = localStorage.getItem('aiBytes_level2_progress');
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}

function displayRankBadge() {
    const progress = loadProgress();
    const rankBadge = document.getElementById('rankBadge');

    if (!rankBadge) return;

    if (progress && progress.rank && progress.rank !== "Kein Rang") {
        rankBadge.style.display = 'inline-block';

        let rankText = progress.rank;
        rankBadge.textContent = rankText;

        rankBadge.classList.remove('bronze', 'silver', 'gold');

        if (rankText === 'Bronze') {
            rankBadge.classList.add('bronze');
        } else if (rankText === 'Silber') {
            rankBadge.classList.add('silver');
        } else if (rankText === 'Gold') {
            rankBadge.classList.add('gold');
        }
    } else {
        rankBadge.style.display = 'none';
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    moHost = new MoManHost();

    // Show welcome message
    setTimeout(() => {
        moHost.speak("Hey! Willkommen zum Bild-KI Training! Hier lernst du, wie KI Bilder versteht und generiert!", true);
        moHost.showUnderstoodButton(() => {
            // Button clicked, speech will be hidden
        });
    }, 500);

    // Display rank badge if player has played before
    displayRankBadge();
});
