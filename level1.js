// Level 1 Game Logic

// Mo Man Animation System (Enhanced from Level 3)
class MoManHost {
    constructor() {
        this.element = document.getElementById('moHost');
        this.img = this.element.querySelector('.mo-host-img');
        this.speechBubble = document.getElementById('moSpeech');
        this.speechText = this.speechBubble.querySelector('p');
        // Animation properties
        this.currentFrame = 0;
        this.celebrationFrames = 23;
        this.speechFrames = 12; // 00000 to 00011
        this.runFrames = 48; // Running animation frames
        this.animationSpeed = 40;
        this.speechAnimationSpeed = 80; // Separate speed for speech animation
        this.runAnimationSpeed = 18; // Even faster running animation (~55fps)
        this.animationInterval = null;
        this.speechTimeout = null;

        // Typewriter properties
        this.typewriterInterval = null;
        this.currentText = '';
        this.targetText = '';
        this.typewriterSpeed = 30; // milliseconds per character

        this.isIdle = true;
        this.isRunning = false; // Track if Mo Man is running
        this.isDragging = false; // Track if Mo Man is being dragged

        // Interactive features
        this.autoSpeechTimer = null;
        this.autoSpeechInterval = 14000; // 14 seconds
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
        this.setupEasterEgg(); // Easter egg click handler
    }

    preloadRunningImages() {
        // Preload all 48 running animation frames
        for (let i = 0; i < this.runFrames; i++) {
            const frameNumber = String(i).padStart(5, '0');
            const img = new Image();
            img.src = `./Mo%20man%20Lauf%202s%2024fps%2048%20frames/Mo%20man%20Lauf%20Pose_${frameNumber}.png`;
            this.preloadedRunImages.push(img);
        }
        console.log('Preloaded', this.runFrames, 'running animation frames');
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
        // Stop any current speech/animation
        this.stopSpeaking();

        this.targetText = text;
        this.currentText = '';
        this.speechText.textContent = '';
        this.speechBubble.classList.add('visible');

        // Start speech animation
        this.startSpeechAnimation();
        this.hasSpokenRecently = true;
        this.lastAutoSpeechTime = Date.now();

        // Start typewriter effect
        this.startTypewriter();

        // Auto-hide after text is complete + buffer time (unless in persistent mode)
        if (!persistentMode) {
            const totalDuration = (text.length * this.typewriterSpeed) + 4000; // 4 seconds instead of 2
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
        // Stop typewriter
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }

        // Stop speech timeout
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
            this.speechTimeout = null;
        }

        // Hide speech bubble
        this.speechBubble.classList.remove('visible');

        // Hide understood button
        const understoodBtn = document.getElementById('understoodButton');
        if (understoodBtn) {
            understoodBtn.style.display = 'none';
        }

        // Return to idle animation
        this.startIdleAnimation();
    }

    celebrate() {
        this.stopSpeaking();
        this.startCelebrationAnimation();

        // No visual transform applied
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

            // Remove any existing click handlers
            understoodBtn.replaceWith(understoodBtn.cloneNode(true));
            const newBtn = document.getElementById('understoodButton');

            // Add new click handler
            newBtn.addEventListener('click', () => {
                newBtn.style.display = 'none';
                this.stopSpeaking();
                if (callback) callback();
            });
        }
    }

    // Auto-speech system for personality and engagement
    startAutoSpeech() {
        this.autoSpeechTimer = setInterval(() => {
            // Only speak if not already speaking and enough time has passed
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
            // Storytelling & Personality
            "Weißt du, ich hab mal versucht ChatGPT zu fragen 'Mach was Cooles' - das Ergebnis war... interessant! 😅",
            "Meine Oma fragt mich immer: 'Wie redest du denn mit diesen Computern?' Genau das lernst du hier! 👵",
            "Fun Fact: Die ersten AI-Prompts waren nur 'Ja' oder 'Nein'. Wir sind schon weiter gekommen! 🤖",
            "Ich erinnere mich noch an meinen ersten richtig guten Prompt... das war wie Magie! ✨",
            "Zwischen uns: Auch ich mache manchmal noch Prompt-Fehler. Übung macht den Meister! 😊",

            // Encouragement & Tips
            "Pssst... Das Geheimnis guter Prompts? Sei spezifisch, aber nicht übertrieben! 🎯",
            "Tipp von Mo: Denk daran, WEM du schreibst - AI ist wie ein sehr schlauer, aber manchmal verwirrter Freund! 🤔",
            "Du machst das schon richtig! Jeder Prompt-Experte hat mal klein angefangen 💪",
            "Falls du mal nicht weiterweißt: Beschreib die Situation, als würdest du sie einem Freund erklären! 👥",

            // Gamification based on progress
            ...this.getScoreBasedComments(),
            ...this.getStreakComments(),

            // Jokes & Light moments
            "Warum sind gute Prompts wie Pizza? Beide brauchen die richtigen Zutaten! 🍕",
            "AI-Prompting ist wie Kochen: Zu wenig ist langweilig, zu viel ist chaos! 👨‍🍳",
            "Ich sammle schlechte Prompts wie andere Briefmarken. Meine Sammlung ist... beeindruckend! 📮",
            "Manchmal denke ich, AI versteht mich besser als meine Kollegen... ist das normal? 🤪",
        ];

        return allComments;
    }

    getScoreBasedComments() {
        if (totalScore === 0) {
            return [
                "Bereit für dein erstes Prompt-Abenteuer? Los geht's! 🚀",
                "Keine Sorge wenn am Anfang nicht alles perfekt ist - das ist völlig normal! 😌"
            ];
        } else if (totalScore >= 30) {
            return [
                `Wow! ${totalScore} Punkte schon! Du wirst echt gut in dem hier! 🌟`,
                "Du entwickelst ein echtes Gespür für gute Prompts! Weiter so! 🎯"
            ];
        } else if (totalScore >= 15) {
            return [
                `${totalScore} Punkte! Du bist auf dem richtigen Weg! 📈`,
                "Ich sehe schon Fortschritte! Das macht richtig Spaß zu beobachten! 😊"
            ];
        }
        return [];
    }

    getStreakComments() {
        if (this.consecutiveCorrect >= 3) {
            return [
                `${this.consecutiveCorrect} richtige in Folge! Du bist on fire! 🔥`,
                "Das ist eine beeindruckende Serie! Bist du sicher, dass du Anfänger bist? 😎"
            ];
        } else if (this.consecutiveCorrect >= 2) {
            return [
                "Zwei richtige hintereinander! Du kriegst den Dreh raus! 💫"
            ];
        }
        return [];
    }

    // Call this when user gets an answer right/wrong
    updateStats(correct) {
        this.totalAttempts++;
        if (correct) {
            this.consecutiveCorrect++;
        } else {
            this.consecutiveCorrect = 0;
        }
    }

    // Special reactions for specific moments
    celebrateCorrectAnswer() {
        this.celebrate();
        this.updateStats(true);

        const celebrations = [
            "Genau! Das war ein richtig guter Prompt! 🎉",
            "Perfekt! Du verstehst das Prinzip! ⭐",
            "Wow, das hätte ich auch nicht besser machen können! 👏",
            "Das ist ein Prompt wie er im Bilderbuch steht! 📚",
            "Siehst du? Du hast das Zeug zum Prompt-Profi! 🏆"
        ];

        const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];
        this.speak(randomCelebration);
    }

    encourageAfterWrongAnswer() {
        this.updateStats(false);

        const encouragements = [
            "Kein Problem! Aus Fehlern lernt man am besten! 💪",
            "Das passiert den Besten! Lass uns schauen warum... 🤔",
            "Hmm, nicht ganz. Aber du bist nah dran! Weiter so! 🎯",
            "Das war ein guter Versuch! Gleich klappt's bestimmt! 😊",
            "Auch ich hab mal so angefangen. Das wird schon! 🌱"
        ];

        const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        this.speak(randomEncouragement);
    }

    // Setup interactions
    setupEasterEgg() {
        this.element.style.cursor = 'move';

        // Drag & Drop functionality
        this.setupDragAndDrop();

        // Keyboard controls for movement
        this.setupKeyboardControls();
    }

    setupKeyboardControls() {
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.moveSpeed = 5; // pixels per frame

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

        // Start run animation using preloaded images
        this.animationInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.runFrames;
            // Use preloaded image for instant display
            if (this.preloadedRunImages[this.currentFrame]) {
                this.img.src = this.preloadedRunImages[this.currentFrame].src;
            }
        }, this.runAnimationSpeed);

        // Flip horizontally for left direction
        if (direction === 'left') {
            this.img.style.transform = 'scaleX(-1)';
        } else {
            this.img.style.transform = 'scaleX(1)';
        }

        // Start movement loop
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
        let startX, startY;
        let offsetX, offsetY;

        const onMouseDown = (e) => {
            // Prevent dragging during running animation
            if (this.isRunning) return;

            isDragging = true;
            this.isDragging = true;

            // Get current position
            const rect = container.getBoundingClientRect();
            startX = rect.left;
            startY = rect.top;

            // Calculate offset from mouse to container position
            offsetX = e.clientX - startX;
            offsetY = e.clientY - startY;

            // Change cursor
            this.element.style.cursor = 'grabbing';

            // Prevent text selection
            e.preventDefault();
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            // Calculate new position
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;

            // Apply new position
            container.style.left = newX + 'px';
            container.style.top = newY + 'px';
            container.style.bottom = 'auto'; // Override bottom positioning
        };

        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                this.element.style.cursor = 'move';

                // Delay to prevent click event from firing
                setTimeout(() => {
                    this.isDragging = false;
                }, 100);
            }
        };

        // Add event listeners
        this.element.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // Store cleanup function
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
let gameState = 'intro'; // intro, challenge, results, completion
let moHost; // Global MoMan instance
let selectedChallenges = []; // Array für die 5 zufällig ausgewählten Challenges
const MAX_CHALLENGES = 5; // Anzahl der Challenges pro Spiel

// Tutorial Data - One comprehensive intro tutorial
const tutorials = [
    {
        id: 1,
        title: "Tutorial",
        concept: "Die 3 goldenen Regeln für bessere AI-Prompts",
        examples: [
            {
                situation: "Beispiel: E-Mail an Team - Meeting morgen fällt aus, Verschiebung auf nächste Woche 10 Uhr",
                badPrompt: "Schreibe eine E-Mail über ein Meeting",
                badPoints: "0 Punkte",
                whyBad: "Viel zu vage - welches Meeting?<br>Was soll kommuniziert werden?",
                mediumPrompt: "Schreibe eine E-Mail an mein Team, dass das Meeting morgen ausfällt",
                mediumPoints: "3 Punkte",
                whyMedium: "Besser! Aber es fehlt noch der neue Termin und die Zeit.",
                goodPrompt: "E-Mail an mein Team: Meeting morgen 10 Uhr fällt aus, wird auf nächste Woche verschoben.",
                goodPoints: "10 Punkte",
                whyGood: "Perfekt! Spezifisch: Empfänger, Inhalt, Ton und alle wichtigen Details definiert."
            }
        ],
        principle: "Die drei goldenen Regeln: Situation klar definieren • Angemessene Komplexität • Konkretes Ziel"
    }
];

// Challenge Data - 5 realistic everyday scenarios
const challenges = [
    {
        id: 1,
        title: "Challenge 1: Mercedes-Benz LinkedIn-Post",
        description: "Das Mercedes-Benz Werk Sindelfingen hat heute das 50.000ste vollelektrische EQS-Fahrzeug in diesem Jahr produziert - ein wichtiger Meilenstein für die Elektromobilität. Das Marketing-Team braucht einen LinkedIn-Post, der professionell und stolz klingt, aber nicht übertrieben wirkt. Die Zielgruppe sind Automobilindustrie-Professionals, potenzielle Mitarbeiter und Partner.",
        scenario: "⚡ Wichtiger Meilenstein - Post muss heute noch online!",
        prompts: [
            {
                text: "Schreibe einen LinkedIn-Post über Elektroautos",
                quality: "poor",
                score: 0,
                response: "Elektroautos sind die Zukunft der Mobilität. Sie sind umweltfreundlich und effizient. Immer mehr Hersteller setzen auf elektrische Antriebe.\n\n#Elektromobilität #Zukunft\n\n*[Viel zu allgemein - keine spezifischen Informationen zum Meilenstein]*",
                explanation: "Viel zu vage! Der Prompt enthält keine der wichtigen Informationen: Weder das Werk, noch die 50.000 Fahrzeuge, noch die Zielgruppe. Die AI kann nicht wissen, WORUM es konkret geht!"
            },
            {
                text: "Erstelle einen LinkedIn-Post für Mercedes-Benz Werk Sindelfingen. Heute wurde das 50.000ste vollelektrische EQS-Fahrzeug in diesem Jahr produziert. Ton: Professionell, stolz aber nicht übertrieben. Zielgruppe: Automobilindustrie-Professionals, potenzielle Mitarbeiter, Partner. Betone: Meilenstein Elektromobilität, Teamleistung, Zukunft der Mobilität.",
                quality: "excellent",
                score: 10,
                response: "🎉 Meilenstein in Sindelfingen: 50.000 EQS in 2025!\n\nHeute haben wir am Standort Sindelfingen das 50.000ste vollelektrische EQS-Fahrzeug in diesem Jahr vom Band rollen lassen. Dieser Erfolg ist das Ergebnis der außergewöhnlichen Teamleistung unserer Mitarbeiterinnen und Mitarbeiter.\n\nMit jedem EQS gestalten wir aktiv die Zukunft der Mobilität – elektrisch, nachhaltig und innovativ. Danke an alle, die diesen Meilenstein möglich gemacht haben!\n\n#MercedesBenz #Elektromobilität #EQS #Sindelfingen #ZukunftDerMobilität #Teamwork\n\n*[Perfekt: Alle wichtigen Infos enthalten, professioneller Ton, richtige Zielgruppe]*",
                explanation: "Exzellent! Du hast alle wichtigen Informationen in den Prompt gepackt: Ort, Meilenstein, Ton, Zielgruppe und Kernbotschaften. Das Ergebnis ist präzise und professionell!"
            },
            {
                text: "LinkedIn-Post für Mercedes-Benz: 50.000 EQS produziert in Sindelfingen. Professionell und stolz.",
                quality: "good",
                score: 3,
                response: "Heute haben wir im Mercedes-Benz Werk Sindelfingen das 50.000ste EQS-Fahrzeug produziert. Ein wichtiger Meilenstein für unser Team.\n\n#MercedesBenz #EQS #Elektromobilität\n\n*[Okay, aber zu knapp - fehlen Kontext, Zielgruppe und wichtige Details]*",
                explanation: "Auf dem richtigen Weg! Die Grundinformationen sind da, aber es fehlen wichtige Details wie 'vollelektrisch', 'in diesem Jahr', die genaue Zielgruppe und was betont werden soll. Mehr Details = besseres Ergebnis!"
            }
        ],
        hint: "Je mehr relevante Details du der AI gibst (Kontext, Zielgruppe, Ton, Kernbotschaften), desto präziser wird das Ergebnis!"
    },
    {
        id: 2,
        title: "Challenge 2: WhatsApp-Nachricht Chaos",
        description: "Du willst deiner Oma (78) erklären, wie sie Fotos in WhatsApp verschicken kann. Sie ist nervös und hat wenig Technik-Erfahrung.",
        scenario: "📱 Oma wartet am Telefon - Erklärung muss sofort verständlich sein!",
        prompts: [
            {
                text: "Erkläre WhatsApp Foto-Funktion",
                quality: "poor",
                score: 0,
                response: "Um Fotos in WhatsApp zu senden, nutzen Sie die Kamera-Funktion der App und wählen dann die gewünschten Bilder aus der Galerie aus.\n\n*[Viel zu technisch und unverständlich für Oma]*",
                explanation: "Ups! Dieser Prompt war zu allgemein. Oma braucht einfache Sprache und kleine Schritte, nicht technische Begriffe!"
            },
            {
                text: "Du bist ein Senior Digital Consultant mit Expertise in Senior-friendly User Experience Design und 15 Jahren Erfahrung in generationenübergreifender Technologie-Vermittlung. Erstelle eine vollständige, barrierefreie Schritt-für-Schritt-Anleitung mit psychologischen Beruhigungsstrategien für eine 78-jährige Dame...",
                quality: "poor",
                score: 0,
                response: "Als Senior Technology Consultant analysiere ich zunächst die kognitiven Barrieren und entwickle eine altersgerechte Benutzerführung...\n\n**SENIOR-OPTIMIERTE DIGITAL LITERACY STRATEGIE:**\n- Phase 1: Technologie-Angst-Reduktion\n- Phase 2: Motorik-Anpassung\n- Phase 3: Interface-Familiarisierung\n\n*[Oma ist nach 10 Sekunden völlig verwirrt und legt auf]*",
                explanation: "Viel zu übertrieben! Ein einfacher WhatsApp-Tipp braucht keinen 'Senior Digital Consultant'. Weniger ist manchmal mehr!"
            },
            {
                text: "Erkläre einer 78-jährigen Oma in ganz einfachen Schritten, wie sie ein Foto per WhatsApp schickt. Beruhigend und geduldig, als würdest du neben ihr stehen.",
                quality: "excellent",
                score: 10,
                response: "**Fotos schicken - ganz einfach, liebe Oma!**\n\n**Schritt 1:** WhatsApp öffnen (das grüne Symbol mit dem Telefon)\n**Schritt 2:** Den Namen antippen, dem du das Foto schicken willst\n**Schritt 3:** Das kleine Kamera-Symbol unten drücken\n**Schritt 4:** 'Kamera' oder 'Galerie' wählen (Galerie = schon gemachte Fotos)\n**Schritt 5:** Foto auswählen und auf den blauen Pfeil drücken\n\n**Fertig!** Das war's schon. Du schaffst das! ❤️\n\n*[Perfekt: Einfach, beruhigend, Schritt-für-Schritt]*",
                explanation: "Perfekt! Du hast verstanden: Der beste Prompt passt sich der PERSON an. Oma braucht Geduld und einfache Worte, keine Technologie-Expertise. Empathie schlägt Fachwissen!"
            }
        ],
        hint: "Bei älteren Menschen: Einfache Sprache, kleine Schritte, viel Ermutigung! Vergiss die Fachbegriffe."
    },
    {
        id: 3,
        title: "Challenge 3: Bewerbungs-Stress",
        description: "Dein Freund Max (26) bewirbt sich als Grafikdesigner. Er hat 3 Jahre Berufserfahrung, kann Photoshop/Illustrator und hat das Rebranding einer lokalen Bäckerei gemacht. Sein Anschreiben ist langweilig. Wie hilfst du ihm?",
        scenario: "🕐 Bewerbungsfrist läuft morgen ab - muss heute fertig werden!",
        prompts: [
            {
                text: "Verbessere mein Anschreiben",
                quality: "poor",
                score: 0,
                response: "Hier sind einige Verbesserungsvorschläge für Ihr Anschreiben:\n\n- Verwenden Sie aktivere Sprache\n- Fügen Sie mehr Details hinzu\n- Strukturieren Sie den Text besser\n- Korrigieren Sie Rechtschreibfehler\n\n*[Viel zu allgemein - was soll konkret verbessert werden?]*",
                explanation: "Zu vage! 'Verbessere mein Anschreiben' ist wie 'Mach es besser' - die AI weiß nicht, WAS verbessert werden soll. Kontext ist King!"
            },
            {
                text: "Du bist ein zertifizierter HR-Experte mit 25 Jahren Erfahrung mit Expertise in modernen Bewerbungsstrategien. Analysiere das Anschreiben meines Freundes für eine Grafikdesigner-Position und optimiere es nach neuesten HR-Trends, sodass es nicht so langweilig wirkt. Er hat 3 Jahre Erfahrung, kann Photoshop/Illustrator und hat das Rebranding einer lokalen Bäckerei gemacht.",
                quality: "excellent",
                score: 10,
                response: "**Überarbeitetes Anschreiben - Grafikdesigner:**\n\nSehr geehrte Damen und Herren,\n\nDesign ist für mich mehr als schöne Bilder – es löst Probleme. Als ich letztes Jahr das Rebranding für die lokale Bäckerei Schmidt entwickelte, stieg deren Umsatz um 30%. Das war der Moment, wo ich wusste: Gutes Design verändert wirklich etwas.\n\nMeine 3-jährige Berufserfahrung mit Photoshop und Illustrator ermöglicht es mir, vielseitige Lösungen zu entwickeln. Von Plakat-Kampagnen bis zu digitalen Web-Experiences – ich denke immer daran, wie Menschen mit Design interagieren.\n\nIhre Stellenausschreibung hat mich sofort angesprochen, weil Sie nach jemandem suchen, der 'über den Tellerrand blickt'. Genau das mache ich: Ich verbinde kreative Vision mit strategischem Denken.\n\nIch würde gerne zeigen, wie meine Erfahrung und Leidenschaft Ihr Team bereichern kann.\n\nMit freundlichen Grüßen\nMax\n\n*[Perfekt: Konkret, authentisch, zeigt Erfahrung und Erfolge]*",
                explanation: "Exzellent! Du hast verstanden: Gib der AI eine Expertenrolle und alle wichtigen Details. Spezifische Verbesserungsanweisungen führen zu viel besseren Ergebnissen!"
            },
            {
                text: "Überarbeite das Anschreiben für die Grafikdesigner-Stelle. Mach es persönlicher und weniger langweilig.",
                quality: "good",
                score: 3,
                response: "**Überarbeitetes Anschreiben:**\n\nSehr geehrte Damen und Herren,\n\nich interessiere mich sehr für Ihre Grafikdesigner-Position. Design ist meine große Leidenschaft und ich bringe viel Kreativität mit.\n\nIn meiner bisherigen Berufslaufbahn konnte ich bereits verschiedene Projekte erfolgreich umsetzen. Dabei habe ich gelernt, kundenorientiert zu arbeiten und Deadlines einzuhalten.\n\nIch würde mich freuen, meine Fähigkeiten in Ihrem Team einzusetzen und freue mich auf ein persönliches Gespräch.\n\nMit freundlichen Grüßen\n[Name]\n\n*[Etwas persönlicher, aber immer noch zu allgemein und ohne konkrete Beispiele]*",
                explanation: "Gut, aber nicht optimal! Du warst auf dem richtigen Weg mit 'persönlicher', aber die AI brauchte mehr Details über Max und seine Projekte."
            },
        ],
        hint: "Bei Bewerbungen: Sei spezifisch über WER dir helfen soll! Wen würdest du um Rat fragen - einen Freund oder einen Experten?"
    },
    {
        id: 4,
        title: "Challenge 4: Sicherheitsrichtlinien-Schulung",
        description: "In der Mercedes-Benz Produktion wurden neue Sicherheitsrichtlinien für die Arbeit an Hochvolt-Batterien eingeführt. Diese müssen allen 450 Mitarbeitern der Elektromontage erklärt werden - viele davon haben unterschiedliche technische Vorkenntnisse. Die Schulungsabteilung braucht eine verständliche Zusammenfassung für eine 15-minütige Sicherheitsunterweisung.",
        scenario: "⚠️ Neue Sicherheitsrichtlinien - Schulung startet morgen!",
        prompts: [
            {
                text: "Erkläre Sicherheitsrichtlinien für Batterien",
                quality: "poor",
                score: 0,
                response: "**Sicherheitsrichtlinien für Batterien:**\n\nBatterien können gefährlich sein. Tragen Sie Schutzausrüstung. Vermeiden Sie Kurzschlüsse. Bei Problemen Vorgesetzten informieren.\n\n*[Viel zu allgemein und oberflächlich]*",
                explanation: "Viel zu vage! 'Batterien' sagt nicht, dass es um Hochvolt-Batterien geht. Keine Zielgruppe definiert, keine Struktur, keine konkreten Verhaltensregeln."
            },
            {
                text: "Erstelle eine verständliche Zusammenfassung der neuen Sicherheitsrichtlinien für Hochvolt-Batterien in der Mercedes-Benz Elektromontage. Zielgruppe: 450 Produktionsmitarbeiter mit unterschiedlichem Erfahrungslevel. Dauer: 15-minütige Sicherheitsunterweisung.",
                quality: "excellent",
                score: 10,
                response: "**SICHERHEITSUNTERWEISUNG: HOCHVOLT-BATTERIEN**\n**Mercedes-Benz Elektromontage | 15-Minuten-Schulung**\n\n**1. HAUPTGEFAHREN:**\n• Hochspannung (400V+) - Lebensgefahr bei Kontakt\n• Chemische Gefahren bei Beschädigung\n• Brandgefahr bei unsachgemäßer Handhabung\n\n**2. PFLICHT-SCHUTZAUSRÜSTUNG:**\n✓ Isolierte Handschuhe (geprüft)\n✓ Schutzbrille\n✓ Sicherheitsschuhe\n\n**3. WICHTIGSTE VERHALTENSREGELN:**\n• VOR jeder Arbeit: System spannungsfrei schalten\n• NIEMALS alleine an Hochvolt-Systemen arbeiten\n• Bei Unsicherheit: STOPP - Vorgesetzten fragen\n• Beschädigte Batterien NICHT berühren\n\n**4. DOS & DON'TS:**\n✓ DO: Werkzeuge vor Nutzung prüfen\n✓ DO: Arbeitsbereich absichern\n✗ DON'T: Schmuck/Metallgegenstände tragen\n✗ DON'T: Mit nassen Händen arbeiten\n\n**NOTFALL:** Roten Notaus-Schalter drücken → Bereich räumen → Ersthelfer rufen\n\n*[Perfekt: Klar strukturiert, verständlich, praxisnah]*",
                explanation: "Exzellent! Alle wichtigen Infos: Kontext (Hochvolt), Zielgruppe (450 MA, unterschiedliches Level), Format (15 Min) und gewünschte Struktur. Sofort einsetzbar!"
            },
            {
                text: "Sicherheitsunterweisung Hochvolt-Batterien für Mercedes Mitarbeiter. Verständlich erklären.",
                quality: "good",
                score: 3,
                response: "**Sicherheit bei Hochvolt-Batterien:**\n\nHochvolt-Batterien sind gefährlich. Tragen Sie immer Schutzkleidung. Arbeiten Sie nur an spannungsfreien Systemen. Bei Fragen wenden Sie sich an Ihren Vorgesetzten.\n\nWichtige Punkte:\n- Schutzausrüstung tragen\n- System vor Arbeit abschalten\n- Keine beschädigten Batterien anfassen\n\n*[Grundlagen sind da, aber zu knapp und unstrukturiert]*",
                explanation: "Auf dem richtigen Weg! Es fehlen wichtige Details: Anzahl Mitarbeiter, unterschiedliches Level, 15-Min-Format, Struktur. Mehr Kontext = besseres Ergebnis!"
            }
        ],
        hint: "Bei Schulungen: Definiere Zielgruppe, Wissensstand, Dauer und gewünschte Struktur - dann wird die Erklärung perfekt zugeschnitten!"
    },
    {
        id: 5,
        title: "Challenge 5: Mitarbeiter-Newsletter - Neue Kantine",
        description: "Das Mercedes-Benz Werk Rastatt hat seine Kantine komplett renoviert und um einen neuen veganen Bereich erweitert. Die interne Kommunikation braucht einen Newsletter-Artikel für die 6.500 Mitarbeiter. Der Ton soll informativ, freundlich und inklusiv sein - es sollen sich alle Mitarbeiter angesprochen fühlen.",
        scenario: "🍽️ Kantine öffnet morgen - Newsletter muss heute raus!",
        prompts: [
            {
                text: "Schreibe über eine neue Kantine",
                quality: "poor",
                score: 0,
                response: "Unsere neue Kantine ist jetzt eröffnet. Es gibt verschiedene Essensangebote. Besuchen Sie uns während der Mittagspause.\n\n*[Viel zu allgemein - kein Bezug zu Mercedes, Standort oder den neuen Features]*",
                explanation: "Viel zu vage! Wo ist die Kantine? Was ist neu? Für wen ist das? Die AI hat keine Informationen, um einen relevanten Text zu schreiben!"
            },
            {
                text: "Newsletter für Mercedes-Benz Werk Rastatt: Neue Kantine mit veganem Bereich. Freundlich schreiben.",
                quality: "good",
                score: 3,
                response: "Liebe Kolleginnen und Kollegen,\n\nunsere Kantine im Werk Rastatt wurde renoviert und hat jetzt auch einen veganen Bereich. Schauen Sie vorbei!\n\nIhr Team der internen Kommunikation\n\n*[Basics sind da, aber zu knapp und uninspirierend]*",
                explanation: "Okay, aber zu simpel! Es fehlen: 6.500 Mitarbeiter, was renoviert wurde, Öffnungszeiten, und dass sich ALLE angesprochen fühlen sollen. Mehr Context!"
            },
            {
                text: "Erstelle einen Newsletter-Artikel für Mercedes-Benz Werk Rastatt. Die Kantine wurde komplett renoviert und um einen veganen Bereich erweitert. Zielgruppe: 6.500 Mitarbeiter. Ton: Informativ, freundlich, inklusiv - alle sollen sich angesprochen fühlen.",
                quality: "excellent",
                score: 10,
                response: "🎉 Eure neue Kantine ist da!\n\nLiebe Kolleginnen und Kollegen im Werk Rastatt,\n\nab morgen erwartet euch ein komplett neues Kantine-Erlebnis! Nach mehrwöchiger Renovierung öffnen wir mit frischem Design, mehr Platz und einem erweiterten Angebot.\n\n**Was ist neu?**\n✓ Modernes, helles Ambiente zum Wohlfühlen\n✓ Neuer veganer Bereich mit täglich wechselnden Gerichten\n✓ Klassiker bleiben: Schnitzel, Currywurst & Co.\n✓ Erweiterte vegetarische Auswahl\n✓ Frische Salatbar und Snack-Station\n\n**Für jeden was dabei!** Ob Fleischliebhaber, Veggie-Fan oder vegan – bei uns findet jeder sein Lieblingsessen.\n\n📍 **Öffnungszeiten:** Mo-Fr, 11:30-14:00 Uhr\n🍴 **Ab morgen:** Kommt vorbei und überzeugt euch selbst!\n\nWir freuen uns auf euch!\nEuer Kantine-Team & Interne Kommunikation\n\n*[Perfekt: Alle Infos, inklusiv, motivierend, strukturiert]*",
                explanation: "Exzellent! An alles gedacht: Standort, Zielgruppe (6.500 MA), was neu ist, ALLE Essenstypen berücksichtigt, Ton (freundlich + inklusiv) und Call-to-Action. Top!"
            }
        ],
        hint: "Bei interner Kommunikation: Zielgruppe genau definieren, inklusiv sein (niemand soll sich ausgeschlossen fühlen), und konkrete Details nennen!"
    },
    {
        id: 6,
        title: "Challenge 6: Lautsprecher-Durchsage Staplerverkehr",
        description: "In der Produktionshalle 3 des Mercedes-Benz Werks Sindelfingen finden heute außerplanmäßig Materialtransporte mit Gabelstaplern statt. Du bist Schichtleiter und musst eine kurze Durchsage über die Lautsprecher-Anlage machen, um die 180 Mitarbeiter in der Halle zu warnen. Eine Durchsage sollte maximal 15 Sekunden dauern - knapp, klar, und direkt verständlich.",
        scenario: "📢 Stapler fahren gleich los - Durchsage muss JETZT gemacht werden!",
        prompts: [
            {
                text: "Schreibe eine Durchsage über Stapler",
                quality: "poor",
                score: 0,
                response: "Achtung, Staplerverkehr. Bitte aufpassen.\n\n*[Viel zu vage - welche Halle? Wie lange? Was genau beachten?]*",
                explanation: "Viel zu vage! WELCHE Halle? Wie LANGE dauert der Staplerverkehr? Was sollen Mitarbeiter konkret TUN? Keine hilfreichen Informationen!"
            },
            {
                text: "Erstelle Lautsprecher-Durchsage für Mercedes Werk Sindelfingen, Produktionshalle 3. Inhalt: Außerplanmäßiger Staplerverkehr, 180 Mitarbeiter warnen. Durchsage maximal 15 Sekunden - knapp, klar, direkt verständlich während der Arbeit. Betone: Welche Halle, was beachten (Wege freihalten).",
                quality: "excellent",
                score: 10,
                response: "Achtung Halle 3! In den nächsten 30 Minuten außerplanmäßiger Staplerverkehr. Bitte Hauptwege freihalten und auf Warnsignale achten. Danke!\n\n*[Perfekt: 12 Sekunden, alle wichtigen Infos, klar und knapp]*",
                explanation: "Perfekt! In 12 Sekunden alle Infos: Welche Halle (Halle 3), wie lange (30 Min), was tun (Wege freihalten, Signale beachten). Knapp, klar, schnell erfassbar!"
            },
            {
                text: "Du bist Sicherheitsbeauftragter mit 15 Jahren Erfahrung im Arbeitsschutz bei Mercedes-Benz, spezialisiert auf Staplerverkehr, Gefährdungsbeurteilung und Unfallprävention. Erstelle eine professionelle, rechtlich einwandfreie, umfassende Lautsprecher-Durchsage für Produktionshalle 3 in Werk Sindelfingen. 180 Mitarbeiter müssen über außerplanmäßigen Staplerverkehr informiert werden.",
                quality: "good",
                score: 3,
                response: "Achtung an alle Mitarbeiterinnen und Mitarbeiter in Produktionshalle 3!\n\nDies ist eine wichtige Sicherheitsdurchsage gemäß DGUV Vorschrift 68, Betrieb von Flurförderzeugen.\n\nIn den kommenden 30 bis 45 Minuten findet außerplanmäßiger Staplerverkehr in Ihrer Halle statt. Zu Ihrer eigenen Sicherheit beachten Sie bitte folgende Verhaltensregeln:\n\nErstens: Halten Sie mindestens 1,5 Meter Abstand zu Fahrwegen.\n\nZweitens: Achten Sie auf akustische und optische Warnsignale.\n\nDrittens: Überqueren Sie Fahrwege nur an gekennzeichneten Übergängen.\n\nViertens: Bei Unsicherheiten stehen bleiben und Stapler vorbeifahren lassen.\n\nBei Fragen wenden Sie sich an Ihren Schichtleiter, Durchwahl 4521. Vielen Dank!\n\n*[Viel zu lang - über 90 Sekunden! Niemand hört bis zum Ende zu]*",
                explanation: "Totaler Overkill! 90 Sekunden - viermal zu lang! Mitten in der Arbeit hört niemand DGUV-Vorschriften zu. Die wichtigste Info geht unter. Regel: So kurz wie möglich!"
            }
        ],
        hint: "Bei Lautsprecher-Durchsagen: Maximal 15 Sekunden! Nur die absolut wichtigsten Infos: WO, WAS, WIE LANGE, was TUN. Menschen arbeiten gerade - keine Zeit für Details!"
    },
    {
        id: 7,
        title: "Challenge 7: E-Mail Betreff-Zeile Meeting-Verlegung",
        description: "Du bist Assistent der Geschäftsführung im Mercedes-Benz Werk Berlin. Ein wichtiges Projekt-Meeting mit 12 Teilnehmern muss kurzfristig von morgen 10 Uhr auf morgen 15 Uhr verlegt werden. Der Raum ändert sich auch (von Konferenzraum 201 zu 304). Du sollst die Betreff-Zeile für die Änderungs-E-Mail schreiben. Die Betreff-Zeile muss alle wichtigen Infos enthalten - die Teilnehmer sollen im Posteingang SOFORT sehen was Sache ist, ohne die E-Mail öffnen zu müssen.",
        scenario: "📧 Meeting-Änderung muss sofort kommuniziert werden!",
        prompts: [
            {
                text: "Schreibe einen E-Mail Betreff über ein Meeting",
                quality: "poor",
                score: 3,
                response: "Meeting-Änderung\n\n*[Zu vage - welches Meeting? Was wurde geändert?]*",
                explanation: "Zu vage! WELCHES Meeting? Was geändert - Datum? Zeit? Raum? Abgesagt? Teilnehmer müssen die Mail öffnen um zu wissen, was los ist!"
            },
            {
                text: "Schreibe E-Mail Betreff-Zeile für Meeting-Änderung Mercedes Werk Berlin. Meeting morgen von 10 Uhr auf 15 Uhr verlegt, Raum von 201 zu 304 geändert. Betreff muss alle wichtigen Infos enthalten - maximal 10 Wörter, Teilnehmer sollen im Posteingang sofort sehen was Sache ist ohne E-Mail zu öffnen.",
                quality: "excellent",
                score: 10,
                response: "GEÄNDERT: Projekt-Meeting morgen 15 Uhr (statt 10 Uhr), Raum 304\n\n*[Perfekt: 10 Wörter, alle wichtigen Infos auf einen Blick]*",
                explanation: "Perfekt! In 10 Wörtern alle Infos: 'GEÄNDERT' = Aufmerksamkeit, 'Projekt-Meeting' = Identifikation, '15 Uhr (statt 10)' = neue Zeit, 'Raum 304' = neue Location. Alles klar ohne Mail zu öffnen!"
            },
            {
                text: "Erstelle eine professionelle, vollständige E-Mail für Meeting-Änderung im Mercedes-Benz Werk Berlin. Meeting morgen muss von 10 Uhr auf 15 Uhr verlegt werden, 12 Teilnehmer, Raum ändert sich von 201 zu 304. Ton: Professionell, klar, entschuldigend für Unannehmlichkeit. Betone: Neue Zeit, neuer Raum, Grund der Verlegung, Kontaktperson bei Fragen.",
                quality: "good",
                score: 0,
                response: "Betreff: Wichtige Terminänderung - Projekt-Meeting Elektromobilität Strategie 2025 - Bitte beachten Sie die geänderte Uhrzeit und den neuen Besprechungsraum aufgrund kurzfristiger Raumverfügbarkeit\n\nSehr geehrte Teilnehmerinnen und Teilnehmer,\n\naufgrund kurzfristiger Raumverfügbarkeitsprobleme muss ich Sie über eine Terminänderung informieren.\n\n**NEUE MEETING-DETAILS:**\nDatum: Morgen | Uhrzeit: 15:00 Uhr (statt 10:00 Uhr)\nRaum: Konferenzraum 304 (statt 201) | Dauer: 90 Min\n\nAgenda unverändert: Quartalszahlen Q3, Strategieplanung 2025, Budget-Review\n\nIch entschuldige mich für die kurzfristige Änderung.\n\nBitte bestätigen Sie kurz Ihre Teilnahme.\n\nBei Fragen stehe ich zur Verfügung.\n\nMit freundlichen Grüßen\n[Name]\n\n*[Der Betreff ist 33 Wörter lang - viel zu lang! Wird in Posteingang abgeschnitten]*",
                explanation: "Katastrophe! Aufgabe war NUR die Betreff-Zeile, nicht die ganze Mail! Der Betreff hat 33 Wörter, wird nach 10 abgeschnitten. Teilnehmer sehen nur 'Wichtige Terminänderung...' Total am Ziel vorbei!"
            }
        ],
        hint: "Bei E-Mail Betreff-Zeilen: Maximal 10 Wörter! Wichtigste Infos zuerst, klar und scanbar. Empfänger sollen ohne Öffnen der Mail wissen, worum es geht!"
    },
    {
        id: 8,
        title: "Challenge 8: KI-Textzusammenfassung - Meeting-Protokoll",
        description: "Im Mercedes-Benz Werk Berlin fand gestern ein 3-stündiges Strategie-Meeting zur E-Mobilität statt. Es gibt ein 8-seitiges Protokoll mit vielen Details. Die Geschäftsführung hat keine Zeit, 8 Seiten zu lesen - sie braucht eine Zusammenfassung der wichtigsten Punkte. Du sollst im Mercedes-Benz Direct Chat passend prompten, um das Protokoll auf maximal 5 Bullet Points zusammenzufassen.",
        scenario: "📄 Geschäftsführung braucht Zusammenfassung bis heute Nachmittag!",
        prompts: [
            {
                text: "Fasse das Meeting-Protokoll zusammen",
                quality: "poor",
                score: 0,
                response: "Das Meeting behandelte verschiedene Themen zur E-Mobilität. Es wurden mehrere Punkte diskutiert und Entscheidungen getroffen. Die Teilnehmer sprachen über Strategie und Umsetzung. Es gab verschiedene Meinungen zu den vorgestellten Maßnahmen.\n\n*[Viel zu vage - keine konkreten Inhalte, keine Entscheidungen, keine Struktur]*",
                explanation: "Viel zu vage! 'Verschiedene Themen' hilft niemandem. WELCHE Entscheidungen? WAS ist wichtig? Die Geschäftsführung weiß nach dieser Zusammenfassung nichts! Kein Ziel vorgegeben."
            },
            {
                text: "Fasse das 8-seitige Protokoll vom E-Mobilität Strategie-Meeting im Werk Berlin zusammen für die Geschäftsführung. Sie brauchen maximal 5 Bullet Points mit den wichtigsten Entscheidungen.",
                quality: "excellent",
                score: 10,
                response: "**Meeting-Zusammenfassung: E-Mobilität Strategie (8-seitiges Protokoll)**\n\n• **Investitionsentscheidung:** 45 Mio. € Budget für Ausbau Ladeinfrastruktur am Standort Berlin bis Q2 2025 genehmigt\n\n• **Produktionsziel:** Ab Januar 2025 Umstellung auf 60% E-Antriebssysteme-Produktion (aktuell 35%), neue Schichtmodelle erforderlich\n\n• **Lieferanten-Verträge:** Drei neue Batterie-Lieferanten qualifiziert, Vertragsabschluss bis 15. Dezember (kritische Deadline!)\n\n• **Schulungsbedarf:** 1.200 Mitarbeiter benötigen Hochvolt-Schulung bis März 2025, externes Trainingsunternehmen wird beauftragt (Budget: 2,8 Mio. €)\n\n• **Risiko identifiziert:** Engpass bei Elektromotoren-Komponenten aus China - Alternative Lieferanten werden bis Januar evaluiert\n\n*[Perfekt: 5 konkrete Punkte, Entscheidungen klar, Budget/Deadlines genannt]*",
                explanation: "Perfekt! 5 Bullet Points mit allen geschäftsrelevanten Infos: Entscheidungen mit Zahlen (45 Mio. €), Ziele (60% E-Antriebe), Deadlines (15. Dez), Budget (2,8 Mio. €), Risiken. Geschäftsführung weiß sofort alles Wichtige!"
            },
            {
                text: "Fasse das Meeting-Protokoll professionell zusammen. Erstelle eine strukturierte Zusammenfassung mit Executive Summary, detailliertem Hauptteil gegliedert nach Themenblöcken, Teilnehmer-Statements mit Zitaten und Hintergrundinformationen zum Kontext",
                quality: "good",
                score: 0,
                response: "**EXECUTIVE SUMMARY**\n\nDas gestrige Strategie-Meeting zur Elektromobilität im Mercedes-Benz Werk Berlin umfasste ein breites Spektrum an Diskussionspunkten.\n\n**HAUPTTEIL**\n\n**1. Einführung und Kontextualisierung**\nBereits im vorherigen Quartal wurde die strategische Ausrichtung definiert. Im Vergleich zum Meeting vom September zeigt sich eine Verschiebung der Prioritäten.\n\n**2. Themenblock A: Investitionsplanung**\nDie Diskussion begann mit dem Vorschlag der Finanzabteilung. Herr Müller und Frau Schmidt vertraten unterschiedliche Positionen zur Budgetallokation. Nach intensiver Debatte wurde ein Kompromiss gefunden.\n\n**3. Themenblock B: Produktionsumstellung**\nDie Produktionsleitung präsentierte einen mehrstufigen Plan. Verschiedene Implementierungsstrategien wurden diskutiert.\n\n[...Die Zusammenfassung geht noch weitere Seiten mit Details zu Lieferanten, Schulungen, Risikobewertung und kritischer Würdigung...]\n\n*[Viel zu lang - aus 8 Seiten wurden 6 Seiten! Keine echte Zusammenfassung]*",
                explanation: "Totaler Overkill! Aufgabe: 5 Bullet Points. Ergebnis: 6 Seiten mit Executive Summary, Glossar, Würdigung. Keine Zusammenfassung, sondern ein zweites Dokument! Anforderung komplett ignoriert."
            }
        ],
        hint: "Bei KI-Zusammenfassungen: Definiere KLAR die Länge (z.B. 5 Bullet Points) und den Fokus (nur Entscheidungen? nur Zahlen?). Ohne klare Vorgaben produziert KI oft zu viel Text!"
    },
    {
        id: 9,
        title: "Challenge 9: KI-Schulungskonzept - Neue Produktionstechnologie",
        description: "Im Mercedes-Benz Werk Berlin wird ein neues KI-gestütztes Assistenzsystem für die Montage von E-Antrieben eingeführt. Das System führt Mitarbeiter Schritt-für-Schritt durch die Montage und erkennt Fehler automatisch. 250 Produktionsmitarbeiter müssen geschult werden - das Alter reicht von 22 bis 62 Jahren.",
        scenario: "📋 Präsentation vor Geschäftsführung ist übermorgen!",
        prompts: [
            {
                text: "Erstelle ein Schulungskonzept für das neue KI-System in der Produktion",
                quality: "poor",
                score: 0,
                response: "**Schulungskonzept KI-System:**\n\n- Woche 1: Theoretische Einführung ins System\n- Woche 2: Praktische Anwendung\n- Woche 3: Tests und Zertifizierung\n\nDie Mitarbeiter lernen das System in drei Wochen kennen und können es dann anwenden.\n\n*[Viel zu oberflächlich - keine konkreten Inhalte oder Struktur]*",
                explanation: "Viel zu vage! Der Prompt ignoriert alle wichtigen Details aus der Aufgabe: Wo? Wie viele Mitarbeiter? Unterschiedliche Altersgruppen? Verschiedene Vorkenntnisse? Die AI weiß nicht, WORUM es konkret geht!"
            },
            {
                text: "Erstelle ein Schulungskonzept für Mercedes-Benz Werk Berlin. 250 Produktionsmitarbeiter müssen das neue KI-Assistenzsystem für E-Antriebe-Montage lernen. Gliedere das Konzept nach Schulungstagen und beschreibe die Inhalte.",
                quality: "good",
                score: 3,
                response: "**Schulungskonzept: KI-Assistenzsystem E-Antriebe-Montage**\n**Mercedes-Benz Werk Berlin**\n\n**Tag 1 - Grundlagen (7 Stunden):**\n- Vormittag: Was ist KI? Wie funktioniert das neue System?\n- Nachmittag: Sicherheitseinweisung und erste Bedienung am Tablet\n\n**Tag 2 - Praxistraining (7 Stunden):**\n- Vormittag: Montageabläufe mit KI-Unterstützung durchführen\n- Nachmittag: Übungen an echten Bauteilen\n\n**Tag 3 - Vertiefung (7 Stunden):**\n- Vormittag: Fehlererkennung und Qualitätskontrolle\n- Nachmittag: Abschlusstest (Theorie + Praxis)\n\n**Durchführung:**\nGruppen à 25 Personen, 10 Durchgänge über 2 Monate\n\n*[Okay, aber zu simpel - keine Differenzierung nach Vorkenntnissen, keine Methodenvielfalt]*",
                explanation: "Schon besser! Aber: Was ist mit unterschiedlichen Vorkenntnissen (22 vs. 62 Jahre)? Wie lernen verschiedene Altersgruppen? Wie wird Erfolg gemessen? Für GF-Präsentation fehlen strategische Antworten!"
            },
            {
                text: "Erstelle ein professionelles Schulungskonzept für die Geschäftsführung Mercedes-Benz Werk Berlin. 250 Produktionsmitarbeiter (Alter 22-62 Jahre, sehr unterschiedliche digitale Vorkenntnisse) müssen das neue KI-Assistenzsystem für E-Antriebe-Montage lernen. Das System führt Schritt-für-Schritt durch Montage und erkennt Fehler automatisch.",
                quality: "excellent",
                score: 10,
                response: "**SCHULUNGSKONZEPT: KI-ASSISTENZSYSTEM E-ANTRIEBE-MONTAGE**\n**Mercedes-Benz Werk Berlin | Geschäftsführungspräsentation**\n\n**1. VORKENNTNISSE:**\n✓ Einstufungstest (10 Min)\n✓ 3 Gruppen: Digital Natives (2,5 Tage), Standard (3,5 Tage), Intensiv (4,5 Tage)\n\n**2. METHODEN:**\n25% Theorie • 50% Praxis • 15% Peer-Learning • 10% E-Learning\n\n**3. ZEITPLAN (3,5 Tage):**\nTag 1: System verstehen | Tag 2-3: Praxis-Training | Tag 4: Prüfung\n\n**4. ERFOLGSMESSUNG:**\nPraktische Prüfung (70%) + Theorietest (60%)\n\n**5. RESSOURCEN:**\n6 Haupttrainer + 4 Assistenten | 13 Durchgänge über 3 Monate\n\n**6. BUDGET:** 350.000€ (1.400€/Person)\nTrainer: 180.000€ | Material: 90.000€ | Ausfall: 80.000€\n\n*[Perfekt: Alle Fragen beantwortet, strategisch durchdacht, präsentationsreif]*",
                explanation: "Exzellent! DAS ist ein GF-Konzept! Alle kritischen Fragen beantwortet: 3 Altersgruppen, vielfältige Methoden (Peer-Learning!), Zeitplan, Erfolgsmessung, Trainer-Bedarf UND Budget. Lektion: Bei komplexen Business-Konzepten führen nur detaillierte Prompts zu professionellen Ergebnissen!"
            }
        ],
        hint: "Bei Schulungs- und Strategiekonzepten für Management: Je detaillierter dein Prompt die W-Fragen beantwortet (WER? WIE? WIE VIELE? WIE LANGE? WAS KOSTET'S?), desto professioneller und präsentationsreifer das Ergebnis!"
    },
    {
        id: 10,
        title: "Challenge 10: Türschild-Text für neuen Meetingraum",
        description: "Im Mercedes-Benz Werk Berlin wurde ein neuer Meetingraum eingerichtet: das 'Innovation Lab'. Dieser Raum ist speziell ausgestattet für kreative Workshops, Brainstorming-Sessions und agile Team-Meetings. Er hat Whiteboards, flexible Möbel und moderne Technik. Jetzt braucht der Raum ein Türschild mit einer kurzen Beschreibung, damit Mitarbeiter wissen, wofür der Raum gedacht ist.",
        scenario: "🚪 Türschild muss heute noch gedruckt werden!",
        prompts: [
            {
                text: "Schreibe einen Text für ein Türschild",
                quality: "poor",
                score: 0,
                response: "Innovation Lab\nMeetingraum\n\n*[Zu vage - wofür ist der Raum? Was macht ihn besonders?]*",
                explanation: "Viel zu vage! Der Prompt sagt nicht WELCHER Raum, WO, oder WOFÜR. 'Meetingraum' könnte alles sein. Mitarbeiter wissen nach dem Schild nicht, ob sie hier normale Meetings oder kreative Workshops machen können!"
            },
            {
                text: "Erstelle einen Türschild-Text für das neue 'Innovation Lab' im Mercedes-Benz Werk Berlin. Der Raum ist für kreative Workshops, Brainstorming und agile Team-Meetings gedacht. Hat Whiteboards, flexible Möbel, moderne Technik. Maximal 3 Zeilen - muss auf einen Blick verständlich sein.",
                quality: "excellent",
                score: 10,
                response: "**Innovation Lab**\nKreativ-Raum für Workshops, Brainstorming & agile Meetings\nWhiteboards • Flexible Möbel • Moderne Technik\n\n*[Perfekt: 3 Zeilen, alle wichtigen Infos, sofort erfassbar]*",
                explanation: "Perfekt! In 3 kompakten Zeilen alles Wichtige: Name, Zweck (Workshops, Brainstorming, agile Meetings) und Ausstattung. Auf einen Blick erfassbar!"
            },
            {
                text: "Du bist ein professioneller Workplace Experience Spezialist mit 20 Jahren Erfahrung in modernen Office-Konzepten. Erstelle einen umfassenden, detaillierten Türschild-Text für das neue Innovation Lab im Mercedes-Benz Werk Berlin. Ausstattung: 6 Whiteboards, höhenverstellbare Tische, 75-Zoll-Touchscreen, Videokonferenz-System, Sticky Notes. Ton: Professionell, inspirierend, einladend.",
                quality: "good",
                score: 3,
                response: "**Innovation Lab – Ihr Raum für kreative Exzellenz**\n\nWillkommen im Innovation Lab, dem Herzstück kreativer Kollaboration im Mercedes-Benz Werk Berlin!\n\n**Raum-Philosophie:**\nSpeziell konzipiert, um innovative Denkprozesse und interdisziplinäre Zusammenarbeit zu fördern.\n\n**Zielgruppe:**\nIdeal für Entwicklungsteams, Marketing, HR. Perfekt für Design Thinking, Sprint Plannings, Brainstorming-Workshops und Hackathons.\n\n**Premium-Ausstattung:**\n• 6 Whiteboards • Höhenverstellbare Tische • Flexible Möbel\n• 75-Zoll Touchscreen • Videokonferenz-System • Creative-Supply-Kit\n\n**Buchung:**\nOutlook-Kalender oder Workplace-App. Max. 4h, 24h Vorlauf.\n\n**Regeln:**\nWhiteboards löschen • Möbel zurückstellen • Kits auffüllen\n\n**Kontakt:** Facility Management, 4856\n\n*[Viel zu lang - das ist ein A4-Blatt, kein Türschild!]*",
                explanation: "Katastrophe! Das ist kein Türschild, das ist ein Handbuch! Die wichtigste Info geht im Wortschwall unter. Ein Türschild muss in 3 Sekunden erfassbar sein - hier braucht man 3 Minuten!"
            }
        ],
        hint: "Bei Türschildern, Aushängen und Beschilderungen gilt: Kurz und knackig, auf einen Blick erfassbar! Kerninfo rein, fertig!"
    }
];

// Function to select 5 random challenges from the pool
function selectRandomChallenges() {
    // Create a copy of all challenges
    const allChallenges = [...challenges];

    // Shuffle array using Fisher-Yates algorithm
    for (let i = allChallenges.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allChallenges[i], allChallenges[j]] = [allChallenges[j], allChallenges[i]];
    }

    // Select first 5 challenges
    selectedChallenges = allChallenges.slice(0, MAX_CHALLENGES);
}

// Game Functions
function startGame() {
    currentChallenge = 0;
    totalScore = 0;
    gameState = 'tutorial';

    // Select 5 random challenges
    selectRandomChallenges();

    // MoMan welcome message
    if (moHost) {
        moHost.speak("Perfekt! Lass uns zusammen die Geheimnisse des Promptens entdecken! 🚀");
    }

    updateScore(0);
    showTutorial();
}

function showTutorial() {
    // Only show tutorial at the very beginning (currentChallenge = 0)
    const tutorial = tutorials[0];

    // Hide all screens
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show tutorial screen
    document.getElementById('tutorialScreen').classList.add('active');

    // Update tutorial content
    document.getElementById('tutorialTitle').textContent = tutorial.title;
    document.getElementById('tutorialConcept').textContent = tutorial.concept;

    // Create examples
    createTutorialExamples(tutorial);

    // Create golden rule cards
    createGoldenRules();

    // Update progress
    updateProgress();
}

function createTutorialExamples(tutorial) {
    const container = document.getElementById('tutorialExamples');
    container.innerHTML = '';

    tutorial.examples.forEach((example, index) => {
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
            title: "Situation klar definieren"
        },
        {
            number: 2,
            title: "Angemessene Komplexität"
        },
        {
            number: 3,
            title: "Konkretes Ziel"
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

    // Hide tutorial screen
    document.getElementById('tutorialScreen').classList.remove('active');

    // Show challenge
    showChallenge();
}

function showChallenge() {
    if (currentChallenge >= selectedChallenges.length) {
        showCompletion();
        return;
    }

    const challenge = selectedChallenges[currentChallenge];

    // Reset current prompt index for new challenge
    currentPromptIndex = null;

    // Hide all screens
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show challenge screen
    document.getElementById('challengeScreen').classList.add('active');

    // Update challenge content - Replace challenge number with current position (1-5)
    const displayNumber = currentChallenge + 1;
    const titleWithCorrectNumber = challenge.title.replace(/Challenge \d+:/, `Challenge ${displayNumber}:`);

    // Wrap each character in a span for individual hover animation
    const titleElement = document.getElementById('challengeTitle');
    titleElement.innerHTML = titleWithCorrectNumber.split('').map(char => {
        if (char === ' ') {
            return '<span class="letter-space">&nbsp;</span>';
        }
        return `<span class="letter-char">${char}</span>`;
    }).join('');

    document.getElementById('challengeDescription').textContent = challenge.description;

    // Update progress
    updateProgress();

    // Create prompt options
    createPromptOptions(challenge);

    // Reset AI response and hint
    showTypingIndicator();
    hideHint();

    // Show submit button again and disable it
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.style.visibility = 'visible';
        submitButton.textContent = 'Prompt senden';
        submitButton.classList.remove('continue-btn-style');
        submitButton.onclick = submitPrompt;
        // Reset button styling from previous "Weiter" state
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
        disableSubmitButton();
    }

    // Show tutorial for first challenge (always)
    if (currentChallenge === 0) {
        setTimeout(() => {
            startChallengeTutorial();
        }, 500);
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
            // Remove selected class from all options
            document.querySelectorAll('.prompt-option').forEach(opt => {
                opt.classList.remove('selected');
            });

            // Add selected class and check radio
            option.classList.add('selected');
            option.querySelector('input[type="radio"]').checked = true;

            // Check if AI response has already been shown
            const submitButton = document.getElementById('submitButton');
            const selectedIndex = parseInt(option.querySelector('input[type="radio"]').value);

            if (currentPromptIndex !== null) {
                // AI response was already shown
                if (selectedIndex === currentPromptIndex) {
                    // Back to original prompt - show "Weiter"
                    if (submitButton) {
                        submitButton.textContent = 'Weiter';
                        submitButton.style.visibility = 'visible';
                        submitButton.classList.remove('enabled', 'disabled');
                        submitButton.classList.add('continue-btn-style');
                        submitButton.disabled = false;
                        submitButton.style.opacity = '1';
                        submitButton.style.cursor = 'pointer';
                        submitButton.onclick = () => {
                            submitButton.disabled = true;
                            submitButton.style.opacity = '0.6';
                            submitButton.style.cursor = 'not-allowed';
                            const chosenPrompt = selectedChallenges[currentChallenge].prompts[currentPromptIndex];
                            showResults(chosenPrompt.score, chosenPrompt);
                        };
                    }
                } else {
                    // Different prompt selected - show "Prompt verändern"
                    if (submitButton) {
                        submitButton.textContent = 'Prompt verändern';
                        submitButton.style.visibility = 'visible';
                        submitButton.classList.add('enabled');
                        submitButton.classList.remove('continue-btn-style', 'disabled');
                        submitButton.disabled = false;
                        submitButton.style.opacity = '1';
                        submitButton.style.cursor = 'pointer';
                        submitButton.onclick = submitPrompt;
                    }
                }
            } else {
                // Initial selection
                enableSubmitButton();
            }
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

let currentPromptIndex = null; // Track currently selected prompt

function submitPrompt() {
    const selectedPrompt = document.querySelector('input[name="promptChoice"]:checked');

    if (!selectedPrompt) {
        alert('Bitte wähle einen Prompt aus!');
        return;
    }

    const promptIndex = parseInt(selectedPrompt.value);
    currentPromptIndex = promptIndex; // Store current prompt
    const chosenPrompt = selectedChallenges[currentChallenge].prompts[promptIndex];
    const score = chosenPrompt.score;

    // Hide submit button temporarily
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.style.visibility = 'hidden';
    }

    // Show AI response with typing effect
    showAIResponse(chosenPrompt.response, () => {
        // After AI response is shown, allow prompt change
        enablePromptChange();
    });
}


function showAIResponse(response, callback) {
    const responseElement = document.getElementById('aiResponse');
    responseElement.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span><p>AI denkt nach...</p></div>';

    setTimeout(() => {
        responseElement.innerHTML = '<div class="response-text"></div>';
        typeWriter(response, responseElement.querySelector('.response-text'), () => {
            // Add continue button after AI response is finished
            showContinueButton(callback);
        });
    }, 800);
}

function enablePromptChange() {
    // Show continue button immediately
    showContinueButton();
}

function showContinueButton() {
    // Replace submit button with continue button
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.textContent = 'Weiter';
        submitButton.style.visibility = 'visible';
        submitButton.classList.remove('enabled', 'disabled');
        submitButton.classList.add('continue-btn-style');
        submitButton.disabled = false;

        // Remove old onclick and add new one with one-time execution
        submitButton.onclick = () => {
            // Disable button immediately to prevent double-clicking
            submitButton.disabled = true;
            submitButton.style.opacity = '0.6';
            submitButton.style.cursor = 'not-allowed';

            const chosenPrompt = selectedChallenges[currentChallenge].prompts[currentPromptIndex];
            showResults(chosenPrompt.score, chosenPrompt);
        };
    }
}

function typeWriter(text, element, callback) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 8); // Viel schneller: 8ms statt 30ms
        } else if (callback) {
            callback();
        }
    }

    type();
}

function showTypingIndicator() {
    const responseElement = document.getElementById('aiResponse');
    responseElement.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span><p>Bereit für deinen Prompt...</p></div>';
}

function showResults(score, chosenPrompt) {
    totalScore += score;
    updateScore(totalScore);

    // MoMan reactions based on result
    if (moHost) {
        if (score > 0) {
            moHost.celebrateCorrectAnswer();
        } else {
            moHost.encourageAfterWrongAnswer();
        }
    }

    // Hide challenge screen
    document.getElementById('challengeScreen').classList.remove('active');

    // Show results screen
    document.getElementById('resultsScreen').classList.add('active');

    // Update results content
    const challenge = selectedChallenges[currentChallenge];
    document.getElementById('resultsTitle').textContent = `Challenge ${currentChallenge + 1} Abgeschlossen!`;
    document.getElementById('scoreEarned').textContent = `+${score} Punkte!`;
    document.getElementById('explanationText').textContent = chosenPrompt.explanation || challenge.explanation;

    // Enable submit button again
    document.querySelector('.submit-button').disabled = false;
}

function nextChallenge() {
    currentChallenge++;

    // MoMan transition messages
    if (moHost) {
        const transitionMessages = [
            "Sehr gut! Bereit für die nächste Challenge? 💪",
            "Du lernst schnell! Lass uns weitermachen! 🎯",
            "Das war stark! Die nächste wird noch interessanter! ✨",
            "Perfekt! Ich hab schon die nächste Challenge vorbereitet! 🚀",
            "Du bist auf einem guten Weg! Weiter geht's! 📈"
        ];
        const randomMessage = transitionMessages[Math.floor(Math.random() * transitionMessages.length)];
        moHost.speak(randomMessage);
    }

    // Hide results screen
    document.getElementById('resultsScreen').classList.remove('active');

    // Show next challenge or completion (no more tutorials)
    showChallenge();
}

function showCompletion() {
    gameState = 'completion';

    // MoMan final celebration
    if (moHost) {
        let finalMessage = "";
        if (totalScore >= 45) {
            finalMessage = `WOW! Du bist ein echtes Prompt-Talent! ${totalScore} Punkte sind fantastisch! 🏆⭐`;
        } else if (totalScore >= 35) {
            finalMessage = `Sehr beeindruckend! Du hast das Prompting richtig gut drauf! ${totalScore} Punkte! 🌟💫`;
        } else if (totalScore >= 25) {
            finalMessage = `Gut gemacht! Du hast die Grundlagen verstanden! ${totalScore} Punkte! 👏🎯`;
        } else {
            finalMessage = `Hey, das war ein guter Start! ${totalScore} Punkte - Übung macht den Meister! 💪😊`;
        }
        moHost.speak(finalMessage);
    }

    // Hide all screens
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show completion screen
    document.getElementById('completionScreen').classList.add('active');

    // Update progress to 100%
    updateProgress();

    // Update completion content with current game data
    document.getElementById('finalScore').textContent = totalScore;
    document.getElementById('rankValue').textContent = getRank(totalScore).title;

    // Save progress after showing current results
    saveProgress();

    // Trigger celebration animation
    triggerCelebration();
}

function getRank(score) {
    if (score >= 50) return { title: "Gold", description: "Perfekte Prompt-Meisterschaft!" };
    if (score >= 40) return { title: "Silber", description: "Sehr gute Leistung!" };
    if (score >= 25) return { title: "Bronze", description: "Solider Prompt-Anfang!" };
    return { title: "Kein Rang", description: "Weiter üben!" };
}

function triggerCelebration() {
    // Add celebration class for animations
    document.querySelector('.completion-title').style.animation = 'celebration 2s ease-in-out infinite alternate';

    // You could add particle effects here
    createConfetti();
}

function createConfetti() {
    // Simple confetti effect
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = ['#F5C03B', '#A86AFF', '#67C7FF'][Math.floor(Math.random() * 3)];
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
    selectedChallenges = []; // Reset selected challenges

    // Hide all screens
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show intro screen
    document.getElementById('introScreen').classList.add('active');

    // Reset UI
    updateScore(0);
    updateProgress();

    // Update rank badge to show current highest rank
    displayRankBadge();
}

function updateScore(score) {
    const scoreElement = document.getElementById('scoreValue');
    scoreElement.textContent = score;

    // Add animation class
    scoreElement.classList.add('updated');
    setTimeout(() => {
        scoreElement.classList.remove('updated');
    }, 500);
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    // Only show progress if we're in challenge mode (gameState === 'challenge')
    if (gameState === 'intro' || gameState === 'tutorial') {
        progressText.textContent = '';
        progressFill.style.width = '0%';
        return;
    }

    const progress = ((currentChallenge) / MAX_CHALLENGES) * 100;
    progressFill.style.width = progress + '%';

    // Show "Geschafft" when all challenges are completed
    if (currentChallenge >= MAX_CHALLENGES) {
        progressText.textContent = 'Geschafft!';
    } else {
        // Don't show more than total challenges
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

    // Define rank hierarchy (higher number = better rank)
    const rankValues = {
        "Kein Rang": 0,
        "Bronze": 1,
        "Silber": 2,
        "Gold": 3
    };

    let rankToSave = currentRank.title;
    let scoreToSave = totalScore;

    // If there's existing progress, only upgrade rank if new one is better
    if (existingProgress && existingProgress.rank) {
        const existingRankValue = rankValues[existingProgress.rank] || 0;
        const currentRankValue = rankValues[currentRank.title] || 0;

        // Keep the better rank and higher score
        if (existingRankValue > currentRankValue) {
            rankToSave = existingProgress.rank;
        }

        // Always keep the higher score
        if (existingProgress.score > totalScore) {
            scoreToSave = existingProgress.score;
        }
    }

    const progress = {
        level: 1,
        completed: true,
        score: scoreToSave,
        rank: rankToSave,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('aiBytes_level1_progress', JSON.stringify(progress));
}

function loadProgress() {
    const saved = localStorage.getItem('aiBytes_level1_progress');
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}

// Function to display rank badge
function displayRankBadge() {
    const progress = loadProgress();
    const rankBadge = document.getElementById('rankBadge');

    if (!rankBadge) return;

    if (progress && progress.rank && progress.rank !== "Kein Rang") {
        // Show the rank badge
        rankBadge.style.display = 'inline-block';

        // Remove emojis from rank text
        let rankText = progress.rank.replace(/🥇|🥈|🥉/g, '').trim();
        rankBadge.textContent = rankText;

        // Remove all rank classes first
        rankBadge.classList.remove('bronze', 'silver', 'gold');

        // Add appropriate class based on rank
        if (rankText.includes('Bronze')) {
            rankBadge.classList.add('bronze');
        } else if (rankText.includes('Silber')) {
            rankBadge.classList.add('silver');
        } else if (rankText.includes('Gold')) {
            rankBadge.classList.add('gold');
        }
    } else {
        // Hide the badge if no rank
        rankBadge.style.display = 'none';
    }
}

// Initialize progress on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize MoMan Host
    moHost = new MoManHost();

    updateProgress();

    // Display rank badge if player has achieved a rank
    displayRankBadge();

    // Add click animation to score value
    const scoreElement = document.getElementById('scoreValue');
    if (scoreElement) {
        scoreElement.addEventListener('click', function() {
            // Add ripple effect
            scoreElement.classList.add('clicked');
            setTimeout(() => {
                scoreElement.classList.remove('clicked');
            }, 600);

            // Add celebrate animation
            scoreElement.classList.add('celebrate');
            setTimeout(() => {
                scoreElement.classList.remove('celebrate');
            }, 800);
        });
    }
});

// ===============================
// Challenge Tutorial System
// ===============================

let tutorialStep = 0;
let tutorialActive = false;

function startChallengeTutorial() {
    tutorialActive = true;
    tutorialStep = 0;

    const overlay = document.getElementById('tutorialOverlay');
    const spotlight = document.getElementById('tutorialSpotlight');
    const instruction = document.getElementById('tutorialInstruction');

    // Show overlay
    overlay.classList.add('active');

    // Setup next button
    const nextButton = document.getElementById('tutorialNextButton');
    nextButton.onclick = onTutorialNextClick;

    // Start step 1
    showTutorialStep1();
}

function showTutorialStep1() {
    tutorialStep = 1;

    const spotlight = document.getElementById('tutorialSpotlight');
    const instruction = document.getElementById('tutorialInstruction');
    const arrow = instruction.querySelector('.instruction-arrow');
    const nextButton = document.getElementById('tutorialNextButton');

    // Update instruction text
    document.getElementById('instructionStep').textContent = 'Schritt 1/2';
    document.getElementById('instructionText').textContent = 'Wähle einen der drei Prompts aus!';
    nextButton.textContent = 'Weiter';

    // Get prompt options container position (viewport coordinates)
    const promptOptions = document.getElementById('promptOptions');
    const rect = promptOptions.getBoundingClientRect();

    // Position spotlight on prompt options (absolute viewport position)
    spotlight.style.left = (rect.left - 20) + 'px';
    spotlight.style.top = (rect.top - 20) + 'px';
    spotlight.style.width = (rect.width + 40) + 'px';
    spotlight.style.height = (rect.height + 40) + 'px';

    // Position instruction above prompts
    arrow.className = 'instruction-arrow arrow-down';
    instruction.style.left = (rect.left + rect.width / 2) + 'px';
    instruction.style.top = (rect.top - 180) + 'px';
    instruction.style.transform = 'translateX(-50%)';
}

function onTutorialNextClick() {
    if (tutorialStep === 1) {
        // Move to step 2
        showTutorialStep2();
    } else if (tutorialStep === 2) {
        // End tutorial
        endTutorial();
    }
}

function showTutorialStep2() {
    tutorialStep = 2;

    const spotlight = document.getElementById('tutorialSpotlight');
    const instruction = document.getElementById('tutorialInstruction');
    const arrow = instruction.querySelector('.instruction-arrow');
    const nextButton = document.getElementById('tutorialNextButton');

    // Update instruction text
    document.getElementById('instructionStep').textContent = 'Schritt 2/2';
    document.getElementById('instructionText').textContent = 'Klicke danach auf "Prompt senden"!';
    nextButton.textContent = 'Tutorial beenden';

    // Get submit button position (viewport coordinates)
    const submitButton = document.getElementById('submitButton');
    const rect = submitButton.getBoundingClientRect();

    // Position spotlight on submit button (absolute viewport position)
    spotlight.style.left = (rect.left - 20) + 'px';
    spotlight.style.top = (rect.top - 20) + 'px';
    spotlight.style.width = (rect.width + 40) + 'px';
    spotlight.style.height = (rect.height + 40) + 'px';

    // Position instruction to the left of button
    arrow.className = 'instruction-arrow arrow-right';
    instruction.style.left = (rect.left - 430) + 'px';
    instruction.style.top = (rect.top + rect.height / 2) + 'px';
    instruction.style.transform = 'translateY(-50%)';

    // Make submit button clickable through spotlight
    submitButton.style.position = 'relative';
    submitButton.style.zIndex = '10000';
}

function endTutorial() {
    tutorialActive = false;

    const overlay = document.getElementById('tutorialOverlay');
    overlay.classList.remove('active');

    // Reset submit button z-index
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.style.zIndex = '';
    }
}