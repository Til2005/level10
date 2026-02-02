// ===============================
//   CONSTANTS & CONFIGURATION
// ===============================
const CONFIG = {
    PATHS: {
        TXP_STAND: 'TXP/TXP_Stand_Pose/',
        TXP_TALK: 'TXP/TXP_Talk_Pose/',
        TXP_LAUF: 'TXP/TXP_Lauf_Pose/',
        TXP_SPRUNG: 'TXP/TXP_Sprung_Pose/'
    }
};

// ===============================
//   GAME STATE
// ===============================
const GameState = {
    dom: {
        // Cached DOM elements
        container: null,
        mainTitle: null,
        levelsTitle: null
    }
};

// ===============================
//   DOM CACHE INITIALIZATION
// ===============================
function initDOMCache() {
    GameState.dom.container = document.querySelector('.container');
    GameState.dom.mainTitle = document.querySelector('.main-title');
    GameState.dom.levelsTitle = document.querySelector('.levels-title');
}

// Settings popup functionality
function openSettings() {
    const settingsPopup = document.getElementById('settingsPopup');
    if (settingsPopup) {
        settingsPopup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeSettings() {
    const settingsPopup = document.getElementById('settingsPopup');
    if (settingsPopup) {
        settingsPopup.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Feedback popup functionality
function openFeedback() {
    const feedbackPopup = document.getElementById('feedbackPopup');
    if (feedbackPopup) {
        feedbackPopup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }
}

function closeFeedback() {
    const feedbackPopup = document.getElementById('feedbackPopup');
    if (feedbackPopup) {
        feedbackPopup.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    }
}

// Calendar popup functionality
function openCalendar() {
    const calendarPopup = document.getElementById('calendarPopup');
    const calendarBtn = document.querySelector('.calendar-btn');

    if (calendarPopup) {
        calendarPopup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }

    // Stop blinking and save that user has clicked
    if (calendarBtn) {
        calendarBtn.classList.remove('blink');
        localStorage.setItem('calendarClicked', 'true');
    }
}

// Initialize calendar button blink
function initCalendarBlink() {
    const calendarBtn = document.querySelector('.calendar-btn');
    const hasClicked = localStorage.getItem('calendarClicked');

    if (calendarBtn && !hasClicked) {
        calendarBtn.classList.add('blink');
    }
}

function closeCalendar() {
    const calendarPopup = document.getElementById('calendarPopup');
    if (calendarPopup) {
        calendarPopup.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    }
}

// Credits popup functionality
function openCredits() {
    const creditsPopup = document.getElementById('creditsPopup');
    if (creditsPopup) {
        creditsPopup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }
}

function closeCredits() {
    const creditsPopup = document.getElementById('creditsPopup');
    if (creditsPopup) {
        creditsPopup.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    }
}

function downloadCalendar() {
    // Get next 10 Fridays starting from today
    const fridays = getNextFridays(10);

    // Generate ICS file content
    let icsContent = 'BEGIN:VCALENDAR\r\n';
    icsContent += 'VERSION:2.0\r\n';
    icsContent += 'PRODID:-//AI-Bytes//Calendar//DE\r\n';
    icsContent += 'CALSCALE:GREGORIAN\r\n';
    icsContent += 'METHOD:PUBLISH\r\n';
    icsContent += 'X-WR-CALNAME:AI-Bytes Training\r\n';
    icsContent += 'X-WR-TIMEZONE:Europe/Berlin\r\n';

    // Add each Friday as an event
    fridays.forEach((friday, index) => {
        const startTime = formatICSDate(friday, 9, 0); // 09:00
        const endTime = formatICSDate(friday, 9, 15);   // 09:15
        const uid = `ai-bytes-${friday.getTime()}-${index}@ai-bytes.de`;
        const now = formatICSDate(new Date(), null, null, true);

        icsContent += 'BEGIN:VEVENT\r\n';
        icsContent += `UID:${uid}\r\n`;
        icsContent += `DTSTAMP:${now}\r\n`;
        icsContent += `DTSTART:${startTime}\r\n`;
        icsContent += `DTEND:${endTime}\r\n`;
        icsContent += 'SUMMARY:AI-Bytes Training\r\n';
        icsContent += 'DESCRIPTION:Hey!\\n\\nDie Lerneinheiten dauern nur wenige Minuten.\\nDafür halten wir dir dieses Zeitfenster frei\\, natürlich kannst du die AI Bytes Level auch jederzeit flexibel starten.\\n\\n👉 Starten: https://les.mo360cp.i.mercedes-benz.com/cms/aibytes?sesskey=r59vhX43Qm\\n\\nViel Spaß beim Leveln! 🚀\\nDein AI-Bytes Team\\n\\nℹ️ Hinweis: Wenn du die Erinnerung nicht mehr brauchst\\,\\nkannst du den Serientermin einfach aus deinem Kalender löschen.\r\n';
        icsContent += 'STATUS:CONFIRMED\r\n';
        icsContent += 'SEQUENCE:0\r\n';
        icsContent += 'BEGIN:VALARM\r\n';
        icsContent += 'TRIGGER:-PT15M\r\n';
        icsContent += 'ACTION:DISPLAY\r\n';
        icsContent += 'DESCRIPTION:AI-Bytes Training startet in 15 Minuten!\r\n';
        icsContent += 'END:VALARM\r\n';
        icsContent += 'END:VEVENT\r\n';
    });

    icsContent += 'END:VCALENDAR\r\n';

    // Create blob and download
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'AI-Bytes-Training.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    // Close popup after download
    setTimeout(() => closeCalendar(), 500);
}

function getNextFridays(count) {
    const fridays = [];
    const today = new Date();
    let currentDate = new Date(today);

    // Find next Friday
    const daysUntilFriday = (5 - currentDate.getDay() + 7) % 7;
    if (daysUntilFriday === 0 && currentDate.getHours() >= 14) {
        // If it's Friday after 14:00, start from next Friday
        currentDate.setDate(currentDate.getDate() + 7);
    } else if (daysUntilFriday > 0) {
        currentDate.setDate(currentDate.getDate() + daysUntilFriday);
    }

    // Get the next 'count' Fridays
    for (let i = 0; i < count; i++) {
        fridays.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 7);
    }

    return fridays;
}

function formatICSDate(date, hours, minutes, isTimestamp = false) {
    const d = new Date(date);

    if (!isTimestamp) {
        d.setHours(hours, minutes, 0, 0);
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    const second = String(d.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}T${hour}${minute}${second}`;
}

// Background switching functionality
function changeBackground(backgroundName) {
    const body = document.body;

    // Remove any existing background classes
    body.classList.remove('bg-gradient', 'bg-image');

    if (backgroundName === 'gradient') {
        // Use CSS gradient
        body.classList.add('bg-gradient');
        body.style.backgroundImage = 'none';
    } else {
        // Use image background
        body.classList.add('bg-image');
        body.style.backgroundImage = `url('assets/images/${backgroundName}')`;
    }

    // Update active selection (only if bg-options exist)
    document.querySelectorAll('.bg-option').forEach(option => {
        option.classList.remove('active');
    });

    const bgOption = document.querySelector(`[data-bg="${backgroundName}"]`);
    if (bgOption) {
        bgOption.classList.add('active');
    }

    // Save selection to localStorage
    localStorage.setItem('selectedBackground', backgroundName);

    // Close settings (only if settings popup exists)
    const settingsPopup = document.getElementById('settingsPopup');
    if (settingsPopup) {
        closeSettings();
    }
}

// Load background on page load - always use Til 1.png
function loadSavedBackground() {
    changeBackground('Til 1.png');
}

// Close popup when clicking outside
document.addEventListener('click', function(event) {
    const popup = document.getElementById('settingsPopup');
    const popupContent = document.querySelector('.popup-content');
    const settingsBtn = document.querySelector('.settings-btn');

    if (event.target === popup && !popupContent.contains(event.target)) {
        closeSettings();
    }
});

// Prevent popup close when clicking inside popup content (only if popup exists)
const popupContent = document.querySelector('.popup-content');
if (popupContent) {
    popupContent.addEventListener('click', function(event) {
        event.stopPropagation();
    });
}

// Function to get level rank from stored progress
function getRank(score) {
    if (score >= 50) return { title: "Gold 🥇", description: "Perfekte Prompt-Meisterschaft!" };
    if (score >= 40) return { title: "Silber 🥈", description: "Sehr gute Leistung!" };
    if (score >= 25) return { title: "Bronze 🥉", description: "Solider Prompt-Anfang!" };
    return { title: "Kein Rang", description: "Weiter üben!" };
}

// Calculate Power Automate rank based on total points
function calculatePowerAutomateRank(totalPoints) {
    if (totalPoints >= 500) return 'Gold 🥇';
    if (totalPoints >= 400) return 'Silber 🥈';
    if (totalPoints >= 300) return 'Bronze 🥉';
    return 'Kein Rang';
}

// Calculate rank from points (500 point system)
function calculateRankFromPoints(points) {
    if (points >= 500) return 'Gold 🥇';
    if (points >= 400) return 'Silber 🥈';
    if (points >= 300) return 'Bronze 🥉';
    return 'Kein Rang';
}

// Calculate total rank from all levels (4200 point system)
function calculateTotalRank(totalPoints) {
    if (totalPoints >= 4200) return { rank: 'AI-Bytes Champion', icon: '🏆', class: 'champion' };
    if (totalPoints >= 3000) return { rank: 'AI-Experte', icon: '⚡', class: 'expert' };
    if (totalPoints >= 1800) return { rank: 'KI-Enthusiast', icon: '🌟', class: 'enthusiast' };
    if (totalPoints >= 900) return { rank: 'Prompt-Lehrling', icon: '🎓', class: 'apprentice' };
    return { rank: 'Kein Rang', icon: '⭐', class: 'no-rank' };
}

// Update total progress display
function updateTotalProgress() {
    // Collect all level points
    const level1Points = parseInt(localStorage.getItem('playerPoints')) || 0;
    const level2Points = Math.min(JSON.parse(localStorage.getItem('aiBytes_level4_progress') || '{}').score || 0, 500);
    const level3Points = JSON.parse(localStorage.getItem('aiBytes_level1_progress') || '{}').score || 0;
    const level4Points = JSON.parse(localStorage.getItem('powerAutomateProgress') || '{}').totalPoints || 0;
    const level5Points = JSON.parse(localStorage.getItem('aiBytes_level6_progress') || '{}').totalPoints || 0;
    const level6Points = JSON.parse(localStorage.getItem('aiBytes_level6_progress_data') || '{}').totalPoints || 0;
    const level7Points = JSON.parse(localStorage.getItem('aiBytes_level7_progress') || '{}').totalPoints || 0;
    const level8Points = JSON.parse(localStorage.getItem('aiBytes_level3_progress') || '{}').totalPoints || 0;
    const level9Points = JSON.parse(localStorage.getItem('aiBytes_level9_progress') || '{}').totalPoints || 0;

    const totalPoints = level1Points + level2Points + level3Points + level4Points + level5Points +
                       level6Points + level7Points + level8Points + level9Points;

    // Update progress bar
    const progressFill = document.getElementById('totalProgressFill');
    const progressText = document.getElementById('totalProgressText');
    const percentage = Math.min((totalPoints / 4200) * 100, 100);

    if (progressFill && progressText) {
        progressFill.style.width = percentage + '%';
        progressText.textContent = `${totalPoints}/4200 Punkte`;
    }

    // Update rank badge
    const rankBadge = document.getElementById('totalRankBadge');
    const rankIcon = document.querySelector('.total-rank-icon');
    const rankText = document.getElementById('totalRankText');
    const rankBadgeWrapper = document.getElementById('rankBadgeWrapper');

    if (rankBadge && rankIcon && rankText) {
        const rankInfo = calculateTotalRank(totalPoints);

        // Remove old rank classes
        rankBadge.classList.remove('no-rank', 'apprentice', 'enthusiast', 'expert', 'champion');

        // Add new rank class
        rankBadge.classList.add(rankInfo.class);

        // Update icon and text
        rankIcon.textContent = rankInfo.icon;
        rankText.textContent = rankInfo.rank;
    }

    // Position rank badge above current progress
    if (rankBadgeWrapper) {
        // Ensure minimum position so badge doesn't go off-screen on the left
        const minPercentage = 2;
        const positionPercentage = Math.max(percentage, minPercentage);
        rankBadgeWrapper.style.left = positionPercentage + '%';
    }
}

// Update visual progress bar
function updateLevelProgress(levelCard, points, maxPoints = 500) {
    if (!levelCard) return;

    const progressFill = levelCard.querySelector('.level-progress-fill');
    const progressText = levelCard.querySelector('.level-progress-text');

    if (progressFill && progressText) {
        const percentage = Math.min((points / maxPoints) * 100, 100);
        progressFill.style.width = percentage + '%';
        progressFill.setAttribute('data-progress', points);

        const rank = calculateRankFromPoints(points);
        progressText.textContent = `${points}/${maxPoints} Punkte - ${rank}`;
    }
}

// Load and display level ranks
function loadLevelRanks() {
    // Level 1: Schummeln erlaubt (level5.html)
    const playerPoints = localStorage.getItem('playerPoints');
    const highestRank = localStorage.getItem('highestRank');
    const level1Card = document.querySelector('.level-card[data-level="level5"]');

    if (playerPoints) {
        const points = parseInt(playerPoints) || 0;
        updateLevelProgress(level1Card, points);
    } else {
        updateLevelProgress(level1Card, 0);
    }

    // Level 2: Auch Bilder sind kein Problem (level4.html)
    const level4Progress = localStorage.getItem('aiBytes_level4_progress');
    const level2Card = document.querySelector('.level-card[data-level="level4"]');

    if (level4Progress) {
        const progress = JSON.parse(level4Progress);
        const points = Math.min(progress.score || 0, 500);
        updateLevelProgress(level2Card, points);
    } else {
        updateLevelProgress(level2Card, 0);
    }

    // Level 3: Nicht suchen, Prompten! (level1.html)
    const level1Progress = localStorage.getItem('aiBytes_level1_progress');
    const level3Card = document.querySelector('.level-card[data-level="level1"]');

    if (level1Progress) {
        const progress = JSON.parse(level1Progress);
        const points = progress.score || 0;
        updateLevelProgress(level3Card, points);
    } else {
        updateLevelProgress(level3Card, 0);
    }

    // Level 4: Automatisiere deinen Alltag (level2.html)
    const level2Progress = localStorage.getItem('powerAutomateProgress');
    const level4Card = document.querySelector('.level-card[data-level="level2"]');

    if (level2Progress) {
        const progress = JSON.parse(level2Progress);
        const points = progress.totalPoints || 0;
        updateLevelProgress(level4Card, points);
    } else {
        updateLevelProgress(level4Card, 0);
    }

    // Level 5: Copilot (level6.html)
    const level6Progress = localStorage.getItem('aiBytes_level6_progress');
    const level5Card = document.querySelector('.level-card[data-level="level6"]');

    if (level6Progress) {
        const progress = JSON.parse(level6Progress);
        const points = progress.totalPoints || 0;
        updateLevelProgress(level5Card, points);
    } else {
        updateLevelProgress(level5Card, 0);
    }

    // Level 6: Advanced Prompting
    const level6ProgressData = localStorage.getItem('aiBytes_level6_progress_data');
    const level6Card = document.querySelector('.level-card[data-level="level7"]');

    if (level6ProgressData) {
        const progress = JSON.parse(level6ProgressData);
        const points = progress.totalPoints || progress.score || 0;
        updateLevelProgress(level6Card, points);
    } else {
        updateLevelProgress(level6Card, 0);
    }

    // Level 7: Daten-Spezialist
    const level7Progress = localStorage.getItem('aiBytes_level7_progress');
    const level7Card = document.querySelector('.level-card[data-level="level8"]');

    if (level7Progress) {
        const progress = JSON.parse(level7Progress);
        const points = progress.totalPoints || progress.score || 0;
        updateLevelProgress(level7Card, points);
    } else {
        updateLevelProgress(level7Card, 0);
    }

    // Level 8: Gute Ergebnisse sind kein Zufall (level3.html)
    const level8Progress = localStorage.getItem('aiBytes_level3_progress');
    const level8Card = document.querySelector('.level-card[data-level="level9"]');

    if (level8Progress) {
        const progress = JSON.parse(level8Progress);
        const points = progress.totalPoints || progress.score || 0;
        updateLevelProgress(level8Card, points);
    } else {
        updateLevelProgress(level8Card, 0);
    }

    // Level 9: KI für Dich!
    const level9Progress = localStorage.getItem('aiBytes_level9_progress');
    const level9Card = document.querySelector('.level-card[data-level="level10"]');

    if (level9Progress) {
        const progress = JSON.parse(level9Progress);
        const points = progress.totalPoints || progress.score || 0;
        updateLevelProgress(level9Card, points);
    } else {
        updateLevelProgress(level9Card, 0);
    }

    // Check if secret level should be unlocked
    checkSecretLevel();

    // Update mystery level 10
    updateMysteryLevel();

    // Update level unlock status
    updateLevelLocks();

    // Update total progress display
    updateTotalProgress();
}

// Update level card locks based on completion
function updateLevelLocks() {
    // Level 1 is always unlocked
    const level1Card = document.querySelector('.level-1');
    if (level1Card) {
        level1Card.classList.remove('locked');
        level1Card.classList.add('available');
    }

    // Level 2 is now always available
    const level2Card = document.querySelector('.level-2');
    if (level2Card) {
        level2Card.classList.remove('locked');
        level2Card.classList.add('available');
    }

    // Level 3 is now always available
    const level3Card = document.querySelector('.level-3');
    if (level3Card) {
        level3Card.classList.remove('locked');
        level3Card.classList.add('available');
    }

    // Update locked cards style (except mystery card)
    const lockedCards = document.querySelectorAll('.level-card.locked:not(.mystery)');
    lockedCards.forEach(card => {
        card.style.opacity = '0.5';
        card.style.filter = 'grayscale(80%)';
        card.style.cursor = 'not-allowed';
        card.style.pointerEvents = 'none';

        const levelStatus = card.querySelector('.level-status');
        if (levelStatus) {
            levelStatus.textContent = '🔒 Gesperrt';
            levelStatus.style.background = '';
            levelStatus.style.color = '';
        }
    });

    // Update available cards style
    const availableCards = document.querySelectorAll('.level-card.available');
    availableCards.forEach(card => {
        card.style.opacity = '1';
        card.style.filter = 'none';
        card.style.cursor = 'pointer';
        card.style.pointerEvents = 'auto';
    });
}

// Check if all levels have Gold rank to unlock secret level
function checkSecretLevel() {
    const secretLevel = document.querySelector('.level-10.mystery');
    if (!secretLevel) return;

    // For now, only check Level 1 since it's the only one implemented
    // Later this can be expanded to check all levels 1-8
    const level1Progress = localStorage.getItem('aiBytes_level1_progress');
    let hasAllGold = false;

    if (level1Progress) {
        const progress = JSON.parse(level1Progress);
        // Check if Level 1 has Gold rank
        hasAllGold = progress.rank === "Gold 🥇";
    }

    // Update secret level appearance
    if (hasAllGold) {
        secretLevel.classList.remove('locked');
        secretLevel.classList.add('unlocked');
        secretLevel.style.cursor = 'pointer';

        const status = secretLevel.querySelector('.level-status');
        if (status) {
            status.textContent = 'Freigeschaltet!';
            status.style.background = 'linear-gradient(45deg, var(--saffron), var(--amethyst))';
            status.style.color = 'var(--russian-blue)';
        }

        const description = secretLevel.querySelector('.level-description');
        if (description) {
            description.textContent = '🎉 Herzlichen Glückwunsch! Du hast das geheime Level freigeschaltet!';
        }

        // Add click handler for unlocked secret level
        secretLevel.onclick = function() {
            alert('🎉 Das geheime Level ist noch in Entwicklung! Bleib dran für mehr Prompt-Abenteuer!');
        };
    } else {
        // Keep locked state
        secretLevel.onclick = function() {
            alert('🔒 Erreiche erst Gold-Rang in allen Leveln um dieses geheime Level freizuschalten!');
        };
    }
}

// Update Mystery Level 10
function updateMysteryLevel() {
    const mysteryLevel = document.querySelector('.level-10.mystery');
    if (!mysteryLevel) return;

    // Calculate total points
    const level1Points = parseInt(localStorage.getItem('playerPoints')) || 0;
    const level2Points = Math.min(JSON.parse(localStorage.getItem('aiBytes_level4_progress') || '{}').score || 0, 500);
    const level3Points = JSON.parse(localStorage.getItem('aiBytes_level1_progress') || '{}').score || 0;
    const level4Points = JSON.parse(localStorage.getItem('powerAutomateProgress') || '{}').totalPoints || 0;
    const level5Points = JSON.parse(localStorage.getItem('aiBytes_level6_progress') || '{}').totalPoints || 0;
    const level6Points = JSON.parse(localStorage.getItem('aiBytes_level6_progress_data') || '{}').totalPoints || 0;
    const level7Points = JSON.parse(localStorage.getItem('aiBytes_level7_progress') || '{}').totalPoints || 0;
    const level8Points = JSON.parse(localStorage.getItem('aiBytes_level3_progress') || '{}').totalPoints || 0;
    const level9Points = JSON.parse(localStorage.getItem('aiBytes_level9_progress') || '{}').totalPoints || 0;

    const totalPoints = level1Points + level2Points + level3Points + level4Points + level5Points +
                       level6Points + level7Points + level8Points + level9Points;

    // Check if 4200 points reached
    if (totalPoints >= 4200) {
        mysteryLevel.classList.remove('locked');
        mysteryLevel.classList.add('unlocked');
        mysteryLevel.style.cursor = 'pointer';

        const title = mysteryLevel.querySelector('.level-title');
        if (title) {
            title.textContent = '🌟 Meister Level 🌟';
        }

        const description = mysteryLevel.querySelector('.level-description');
        if (description) {
            description.textContent = '🎉 Du hast es geschafft! Bereit für die ultimative Herausforderung?';
        }

        const progressText = mysteryLevel.querySelector('.level-progress-text');
        if (progressText) {
            progressText.textContent = '✨ Freigeschaltet!';
            progressText.style.color = 'var(--saffron)';
        }

        const progressFill = mysteryLevel.querySelector('.level-progress-fill');
        if (progressFill) {
            progressFill.style.width = '100%';
        }

        // Add click handler for unlocked mystery level
        mysteryLevel.onclick = function() {
            alert('🎉 Das Meister Level ist noch in Entwicklung! Du bist ein wahrer AI-Meister!');
        };
    } else {
        // Keep locked state
        mysteryLevel.classList.add('locked');
        mysteryLevel.classList.remove('unlocked');
        mysteryLevel.style.cursor = 'not-allowed';

        const pointsNeeded = 4200 - totalPoints;

        const title = mysteryLevel.querySelector('.level-title');
        if (title) {
            title.textContent = '???';
        }

        const description = mysteryLevel.querySelector('.level-description');
        if (description) {
            description.textContent = 'Das ultimative Level wartet auf dich!';
        }

        const progressText = mysteryLevel.querySelector('.level-progress-text');
        if (progressText) {
            progressText.textContent = `🔒 Noch ${pointsNeeded} Punkte benötigt`;
            progressText.style.color = '#ff6b6b';
        }

        const progressFill = mysteryLevel.querySelector('.level-progress-fill');
        if (progressFill) {
            progressFill.style.width = '0%';
        }

        mysteryLevel.onclick = function(e) {
            e.preventDefault();
            alert(`🔒 Du benötigst noch ${pointsNeeded} Punkte um dieses mysteriöse Level freizuschalten!\n\nAktuell: ${totalPoints}/4200 Punkte`);
        };
    }
}

// ===============================
//   MO MAN CHARACTER SYSTEM
// ===============================
// Mo Man Character Controls - Mario Bros style with Animation and Physics
// (All state now managed in GameState object)

// ===============================
//   EVENT LISTENERS
// ===============================
const EventHandlers = {
    keydown: null,
    keyup: null,
    settingsClick: null
};

function initEventListeners() {
    // Key down handler (M key easter egg preserved)
    EventHandlers.keydown = function(event) {
        if (event.key.toLowerCase() === 'm') {
            // M key pressed - easter egg trigger point
        }
    };

    document.addEventListener('keydown', EventHandlers.keydown);
}

function cleanupEventListeners() {
    if (EventHandlers.keydown) {
        document.removeEventListener('keydown', EventHandlers.keydown);
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanupEventListeners);

// ===============================
//   INITIALIZATION
// ===============================
function initializeGame() {
    try {
        // Initialize DOM cache first
        initDOMCache();

        // Initialize event listeners
        initEventListeners();

        // Load saved data
        loadSavedBackground();
        loadLevelRanks();
        updateMysteryLevel();

        // Initialize calendar blink
        initCalendarBlink();

        // Initialize logo easter egg
        initializeLogoAnimation();
    } catch (error) {
        console.error('Game initialization failed:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeGame);

// Professional Logo Animation Easter Egg
function initializeLogoAnimation() {
    const logoContainer = document.querySelector('.logo-container');
    if (!logoContainer) return;

    logoContainer.addEventListener('click', triggerRandomLogoAnimation);
}

function triggerRandomLogoAnimation() {
    const animations = [
        'explodeConfetti',
        'matrixRain',
        'cosmicWarp',
        'glitchMode',
        'fireworks',
        'particleWave'
    ];

    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];

    // Prevent rapid clicking
    const logoContainer = document.querySelector('.logo-container');
    logoContainer.style.pointerEvents = 'none';

    // Execute the chosen animation
    switch(randomAnimation) {
        case 'explodeConfetti':
            explodeConfettiAnimation();
            break;
        case 'matrixRain':
            matrixRainAnimation();
            break;
        case 'cosmicWarp':
            cosmicWarpAnimation();
            break;
        case 'glitchMode':
            glitchModeAnimation();
            break;
        case 'fireworks':
            fireworksAnimation();
            break;
        case 'particleWave':
            particleWaveAnimation();
            break;
    }

    // Re-enable clicking after animation
    setTimeout(() => {
        logoContainer.style.pointerEvents = 'auto';
    }, 4000);
}

// Animation 1: Confetti Explosion
function explodeConfettiAnimation() {
    const container = document.body;
    const colors = ['#F5C03B', '#A86AFF', '#67C7FF', '#4b0074', '#3c3aa5'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: 50%;
                left: 50%;
                z-index: 9999;
                pointer-events: none;
                transform: translate(-50%, -50%);
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            `;

            container.appendChild(confetti);

            const angle = (Math.PI * 2 * i) / 50;
            const velocity = 200 + Math.random() * 200;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            confetti.animate([
                { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
                { transform: `translate(calc(-50% + ${vx}px), calc(-50% + ${vy}px)) scale(1) rotate(720deg)`, opacity: 0 }
            ], {
                duration: 2000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => confetti.remove();
        }, i * 20);
    }
}

// Animation 2: Matrix Rain
function matrixRainAnimation() {
    const container = document.body;
    const chars = '10AI🤖💡⚡🚀';

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const drop = document.createElement('div');
            drop.textContent = chars[Math.floor(Math.random() * chars.length)];
            drop.style.cssText = `
                position: fixed;
                color: #00ff00;
                font-family: 'Courier New', monospace;
                font-size: ${16 + Math.random() * 16}px;
                top: -50px;
                left: ${Math.random() * 100}vw;
                z-index: 9999;
                pointer-events: none;
                text-shadow: 0 0 10px #00ff00;
                font-weight: bold;
            `;

            container.appendChild(drop);

            drop.animate([
                { transform: 'translateY(-50px)', opacity: 0 },
                { transform: 'translateY(50px)', opacity: 1 },
                { transform: 'translateY(100vh)', opacity: 0 }
            ], {
                duration: 2000 + Math.random() * 2000,
                easing: 'linear'
            }).onfinish = () => drop.remove();
        }, i * 100);
    }
}

// Animation 3: Cosmic Warp
function cosmicWarpAnimation() {
    const container = document.body;
    const overlay = document.createElement('div');

    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: radial-gradient(circle at center, transparent 0%, #4b0074 50%, #000 100%);
        z-index: 9998;
        pointer-events: none;
        opacity: 0;
    `;

    container.appendChild(overlay);

    // Create warp lines
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const line = document.createElement('div');
            line.style.cssText = `
                position: fixed;
                width: 2px;
                height: 100vh;
                background: linear-gradient(to bottom, transparent, #67C7FF, transparent);
                top: 0;
                left: ${Math.random() * 100}vw;
                z-index: 9999;
                pointer-events: none;
                transform: scaleY(0);
            `;

            container.appendChild(line);

            line.animate([
                { transform: 'scaleY(0) translateX(0)', opacity: 1 },
                { transform: 'scaleY(1) translateX(-200px)', opacity: 1 },
                { transform: 'scaleY(0) translateX(-400px)', opacity: 0 }
            ], {
                duration: 1500,
                easing: 'ease-out'
            }).onfinish = () => line.remove();
        }, i * 50);
    }

    // Animate overlay
    overlay.animate([
        { opacity: 0 },
        { opacity: 0.8 },
        { opacity: 0 }
    ], {
        duration: 3000,
        easing: 'ease-in-out'
    }).onfinish = () => overlay.remove();
}

// Animation 4: Glitch Mode
function glitchModeAnimation() {
    const logo = document.querySelector('.logo-container');
    const originalHTML = document.body.innerHTML;

    // Create glitch overlay
    const glitchOverlay = document.createElement('div');
    glitchOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,0,0,0.1) 2px,
            rgba(255,0,0,0.1) 4px
        );
        z-index: 9999;
        pointer-events: none;
        animation: glitchScan 0.5s infinite;
    `;

    document.body.appendChild(glitchOverlay);

    // Glitch the logo
    if (logo) {
        logo.style.animation = 'logoGlitch 2s ease-in-out';
    }

    // Add random glitch effects
    const intervals = [];
    for (let i = 0; i < 10; i++) {
        intervals.push(setInterval(() => {
            document.body.style.filter = `hue-rotate(${Math.random() * 360}deg) contrast(${1 + Math.random()}`;
            setTimeout(() => {
                document.body.style.filter = 'none';
            }, 50);
        }, 200 + Math.random() * 300));
    }

    // Cleanup
    setTimeout(() => {
        intervals.forEach(interval => clearInterval(interval));
        glitchOverlay.remove();
        document.body.style.filter = 'none';
        if (logo) logo.style.animation = 'none';
    }, 3000);
}

// Animation 5: Fireworks
function fireworksAnimation() {
    const container = document.body;
    const colors = ['#F5C03B', '#A86AFF', '#67C7FF', '#ff6b6b', '#51cf66'];

    for (let firework = 0; firework < 5; firework++) {
        setTimeout(() => {
            const x = 20 + Math.random() * 60; // 20% to 80% of screen width
            const y = 20 + Math.random() * 40; // 20% to 60% of screen height

            // Create firework explosion
            for (let particle = 0; particle < 12; particle++) {
                const spark = document.createElement('div');
                spark.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    top: ${y}vh;
                    left: ${x}vw;
                    z-index: 9999;
                    pointer-events: none;
                    border-radius: 50%;
                    box-shadow: 0 0 10px currentColor;
                `;

                container.appendChild(spark);

                const angle = (Math.PI * 2 * particle) / 12;
                const distance = 100 + Math.random() * 100;
                const dx = Math.cos(angle) * distance;
                const dy = Math.sin(angle) * distance;

                spark.animate([
                    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                    { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }
                ], {
                    duration: 1000 + Math.random() * 500,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }).onfinish = () => spark.remove();
            }
        }, firework * 400);
    }
}

// Animation 6: Particle Wave
function particleWaveAnimation() {
    const container = document.body;

    for (let wave = 0; wave < 3; wave++) {
        setTimeout(() => {
            for (let i = 0; i < 40; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.style.cssText = `
                        position: fixed;
                        width: 6px;
                        height: 6px;
                        background: linear-gradient(45deg, #A86AFF, #67C7FF);
                        top: 50%;
                        left: -10px;
                        z-index: 9999;
                        pointer-events: none;
                        border-radius: 50%;
                        box-shadow: 0 0 15px #A86AFF;
                    `;

                    container.appendChild(particle);

                    const amplitude = 100 + wave * 50;
                    const frequency = 0.02;
                    const waveOffset = wave * Math.PI / 3;

                    particle.animate([
                        {
                            transform: 'translate(0, 0) scale(0)',
                            opacity: 0
                        },
                        {
                            transform: `translate(calc(50vw), ${Math.sin(waveOffset) * amplitude}px) scale(1)`,
                            opacity: 1
                        },
                        {
                            transform: `translate(calc(100vw + 10px), ${Math.sin(Math.PI + waveOffset) * amplitude}px) scale(0)`,
                            opacity: 0
                        }
                    ], {
                        duration: 2000,
                        easing: 'ease-in-out'
                    }).onfinish = () => particle.remove();
                }, i * 30);
            }
        }, wave * 200);
    }
}

// Keyboard shortcuts and easter eggs
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeSettings();
        closeCredits();
        closeCalendar();
        closeFeedback();
    }

    // Matrix Rain Easter Egg - Press 'M'
    if (event.key === 'M' || event.key === 'm') {
        // Prevent if user is typing in an input field
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        event.preventDefault();
        matrixRainAnimation();
    }
});

// ===============================
//   TXP Character Animation
// ===============================
class TXPCharacter {
    constructor() {
        this.img = document.querySelector('.txp-character-img');
        this.character = document.getElementById('txpCharacter');
        this.speechBubble = document.getElementById('txpSpeech');
        this.speechText = document.getElementById('txpSpeechText');

        this.currentFrame = 0;
        this.totalFrames = 24; // Stand/Talk frames
        this.laufFrames = 24; // Lauf animation frames
        this.sprungFrames = 120; // Sprung animation frames

        this.animationSpeed = 40; // milliseconds per frame (50% faster: 80 → 40)
        this.speechAnimationSpeed = 42; // 70% of original: 60 → 42
        this.laufAnimationSpeed = 36; // 40% faster: 60 → 36
        this.sprungAnimationSpeed = 40; // jumping speed (unchanged)

        this.animationInterval = null;
        this.movementInterval = null;
        this.isAnimating = false;
        this.isSpeaking = false;
        this.isMoving = false;
        this.isJumping = false;

        this.currentAnimation = 'stand'; // stand, talk, lauf, sprung
        this.position = { x: 0, y: 400 }; // centered position (x offset from center)
        this.direction = 1; // 1 = right, -1 = left
        this.movementDistance = 150; // pixels to move (reduced)

        this.speeches = [
            "Hey! Ich bin TXP, dein KI-Assistent! 🤖",
            "Bereit für deine AI-Bytes Reise? 🚀",
            "Diese Levels bringen dir AI richtig bei! 💡",
            "Vergiss nicht: Übung macht den Meister! 💪",
            "KI ist die Zukunft - und du bist dabei! ⭐",
            "Klick mich wieder für mehr Motivation! 😊",
            "Du schaffst das! Weiter so! 🎯",
            "AI-Bytes macht KI lernen zum Vergnügen! 🎮",
            "Benutze die Pfeiltasten um MoMan zu bewegen! ⬅️➡️⬆️⬇️",
            "Klick auf das Logo für Überraschungen! ✨"
        ];


        this.init();
    }

    init() {
        if (this.img && this.character) {
            this.startStandAnimation();
            this.character.addEventListener('click', () => this.speak());
            this.setupLogoClick();
            this.startAutomaticBehavior();
        }
    }

    startAutomaticBehavior() {
        // Start automatic movement every 8-15 seconds (much slower)
        setInterval(() => {
            if (!this.isSpeaking && !this.isMoving && !this.isJumping) {
                if (Math.random() < 0.3) {
                    this.jump();
                } else {
                    this.moveRandomly();
                }
            }
        }, 8000 + Math.random() * 7000);
    }

    setupLogoClick() {
        const logos = document.querySelectorAll('.logo');
        logos.forEach(logo => {
            logo.addEventListener('click', () => {
                this.logoClicked();
            });
            logo.style.cursor = 'pointer';
        });
    }

    logoClicked() {
        const logoSpeeches = [
            "Du hast das AI-Bytes Logo entdeckt! 🎯",
            "AI-Bytes - Deine Zukunft beginnt hier! 🚀",
            "Willkommen in der Welt der künstlichen Intelligenz! 🤖",
            "Logo-Geheimnis entdeckt! Du bist aufmerksam! 👁️",
            "AI-Bytes: Wo Lernen auf Innovation trifft! ⚡"
        ];

        if (!this.isSpeaking) {
            const randomLogoSpeech = logoSpeeches[Math.floor(Math.random() * logoSpeeches.length)];
            this.speechBubble.style.display = 'block';
            this.startSpeechAnimation();
            this.typewriterEffect(randomLogoSpeech);
        }
    }

    startStandAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }

        this.currentAnimation = 'stand';
        this.isAnimating = true;
        this.currentFrame = 0;

        this.animationInterval = setInterval(() => {
            const frameNumber = String(this.currentFrame).padStart(5, '0');
            this.img.src = `TXP/TXP_Stand_Pose/TXP Stand Pose_${frameNumber}.png`;

            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
        }, this.animationSpeed);
    }

    startSpeechAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }

        this.currentAnimation = 'talk';
        this.isSpeaking = true;
        this.isAnimating = true;
        this.currentFrame = 0;

        this.animationInterval = setInterval(() => {
            const frameNumber = String(this.currentFrame).padStart(5, '0');
            this.img.src = `TXP/TXP_Talk_Pose/TXP_Talk Pose_${frameNumber}.png`;

            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
        }, this.speechAnimationSpeed);
    }

    startLaufAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }

        this.currentAnimation = 'lauf';
        this.isAnimating = true;
        this.currentFrame = 0;

        this.animationInterval = setInterval(() => {
            const frameNumber = String(this.currentFrame).padStart(5, '0');
            this.img.src = `TXP/TXP_Lauf_Pose/TXP Lauf Loop_${frameNumber}.png`;

            this.currentFrame = (this.currentFrame + 1) % this.laufFrames;
        }, this.laufAnimationSpeed);
    }

    startSprungAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }

        this.currentAnimation = 'sprung';
        this.isJumping = true;
        this.isAnimating = true;
        this.currentFrame = 0;

        this.animationInterval = setInterval(() => {
            const frameNumber = String(this.currentFrame).padStart(5, '0');

            // Handle special filenames for frames 14 and 15
            let filename;
            if (this.currentFrame === 14) {
                filename = `TXP/TXP_Sprung_Pose/TXP Sprung_${frameNumber}A.png`;
            } else if (this.currentFrame === 15) {
                filename = `TXP/TXP_Sprung_Pose/TXP Sprung_${frameNumber}B.png`;
            } else {
                filename = `TXP/TXP_Sprung_Pose/TXP Sprung_${frameNumber}.png`;
            }

            this.img.src = filename;

            this.currentFrame++;
            if (this.currentFrame >= this.sprungFrames) {
                // Jump animation finished, return to stand
                this.isJumping = false;
                // Don't call startStandAnimation() here - just set the first stand frame directly
                clearInterval(this.animationInterval);
                this.currentAnimation = 'stand';
                this.currentFrame = 0;
                this.img.src = `TXP/TXP_Stand_Pose/TXP Stand Pose_00000.png`;

                // Start normal stand animation after a brief delay
                setTimeout(() => {
                    this.startStandAnimation();
                }, this.animationSpeed);
            }
        }, this.sprungAnimationSpeed);
    }

    speak() {
        if (this.isSpeaking) return; // Prevent overlapping speeches

        // Show speech bubble with typewriter effect
        const randomSpeech = this.speeches[Math.floor(Math.random() * this.speeches.length)];
        this.speechBubble.style.display = 'block';

        // Start speech animation
        this.startSpeechAnimation();

        // Start typewriter effect
        this.typewriterEffect(randomSpeech);
    }

    typewriterEffect(text) {
        this.speechText.textContent = '';
        let charIndex = 0;
        const typingSpeed = 50; // milliseconds per character

        const typeChar = () => {
            if (charIndex < text.length) {
                this.speechText.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, typingSpeed);
            } else {
                // Add blinking cursor at the end
                this.speechText.innerHTML += '<span class="typing-cursor"></span>';

                // Hide speech bubble and return to stand animation after text is complete
                setTimeout(() => {
                    this.speechBubble.style.display = 'none';
                    this.isSpeaking = false;
                    this.startStandAnimation();
                }, 2000); // Show complete text for 2 seconds
            }
        };

        typeChar();
    }

    moveRandomly() {
        if (this.isMoving || this.isSpeaking || this.isJumping) return;

        this.isMoving = true;
        this.direction = Math.random() < 0.5 ? 1 : -1; // Random direction
        const targetX = this.position.x + (this.direction * this.movementDistance);

        // Ensure we don't move too far from center (centered position, so -250 to +250 from center)
        const maxOffset = 250;
        const clampedX = Math.max(-maxOffset, Math.min(maxOffset, targetX));
        this.direction = clampedX > this.position.x ? 1 : -1;

        // Update CSS transform for direction
        this.updateDirection();

        // Start lauf animation
        this.startLaufAnimation();

        // Move TXP smoothly
        const moveStep = 2; // pixels per step
        const moveInterval = setInterval(() => {
            if (this.direction === 1) {
                this.position.x += moveStep;
                if (this.position.x >= clampedX) {
                    this.position.x = clampedX;
                    this.finishMovement(moveInterval);
                }
            } else {
                this.position.x -= moveStep;
                if (this.position.x <= clampedX) {
                    this.position.x = clampedX;
                    this.finishMovement(moveInterval);
                }
            }

            this.updatePosition();
        }, 20);
    }

    updateDirection() {
        if (this.direction === -1) {
            this.img.style.transform = 'scaleX(-1)'; // Face left
        } else {
            this.img.style.transform = 'scaleX(1)'; // Face right
        }
    }

    updatePosition() {
        // Keep centered with CSS (left: 50%), only adjust horizontal offset with transform
        // Bottom position stays fixed in CSS, we only move horizontally
        this.character.parentElement.style.transform = `translateX(calc(-50% + ${this.position.x}px))`;
    }

    finishMovement(moveInterval) {
        clearInterval(moveInterval);
        this.isMoving = false;
        this.startStandAnimation();
    }

    jump() {
        if (this.isJumping || this.isSpeaking || this.isMoving) return;
        this.startSprungAnimation();
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        this.isAnimating = false;
        this.currentAnimation = 'stand';
    }
}

// Initialize TXP Character when page loads
let txpCharacter;
document.addEventListener('DOMContentLoaded', function() {
    txpCharacter = new TXPCharacter();
});

// ===============================
//   FULLSCREEN IMAGE VIEWER
// ===============================
function openFullscreen(event, imageSrc) {
    // Prevent the link from navigating
    event.preventDefault();
    event.stopPropagation();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-overlay';
    overlay.onclick = closeFullscreen;

    // Create image
    const img = document.createElement('img');
    img.src = imageSrc;
    img.onclick = (e) => e.stopPropagation(); // Prevent closing when clicking image

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'fullscreen-close';
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = closeFullscreen;

    // Append to overlay
    overlay.appendChild(img);
    overlay.appendChild(closeBtn);

    // Add to body
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Close with ESC key
    document.addEventListener('keydown', escapeCloseFullscreen);
}

function closeFullscreen() {
    const overlay = document.querySelector('.fullscreen-overlay');
    if (overlay) {
        overlay.remove();
        document.body.style.overflow = 'auto';
        document.removeEventListener('keydown', escapeCloseFullscreen);
    }
}

function escapeCloseFullscreen(event) {
    if (event.key === 'Escape') {
        closeFullscreen();
    }
}

// ===============================
//   RANK LEGEND POPUP
// ===============================
function openRankLegend() {
    const popup = document.getElementById('rankLegendPopup');
    if (popup) {
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeRankLegend() {
    const popup = document.getElementById('rankLegendPopup');
    if (popup) {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close rank legend with ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const rankPopup = document.getElementById('rankLegendPopup');
        if (rankPopup && rankPopup.style.display === 'flex') {
            closeRankLegend();
        }
    }
});

// Close rank legend when clicking outside
document.addEventListener('click', function(event) {
    const rankPopup = document.getElementById('rankLegendPopup');
    const popupContent = rankPopup?.querySelector('.popup-content');

    if (event.target === rankPopup && !popupContent?.contains(event.target)) {
        closeRankLegend();
    }
});

// ===============================
//   SECRET TXP CHEAT CODE
// ===============================
(function() {
    const secretSequence = ['t', 'x', 'p'];
    let currentSequence = [];
    let resetTimeout;
    let unlocked = false;

    function unlockMysteryLevel() {
        if (unlocked) return; // Verhindere mehrfaches Aufrufen
        unlocked = true;

        const mysteryLevel = document.querySelector('.level-10.mystery');
        if (!mysteryLevel) return;

        // Remove locked state
        mysteryLevel.classList.remove('locked');
        mysteryLevel.classList.add('unlocked');
        mysteryLevel.style.cursor = 'pointer';
        mysteryLevel.style.opacity = '1';
        mysteryLevel.style.filter = 'none';

        // Update title
        const title = mysteryLevel.querySelector('.level-title');
        if (title) {
            title.textContent = '🌟 TXP Geheim-Level 🌟';
        }

        // Update progress text
        const progressText = mysteryLevel.querySelector('.level-progress-text');
        if (progressText) {
            progressText.textContent = '✨ Freigeschaltet mit TXP Code!';
            progressText.style.color = 'var(--saffron)';
        }

        // Update progress fill
        const progressFill = mysteryLevel.querySelector('.level-progress-fill');
        if (progressFill) {
            progressFill.style.width = '100%';
        }

        // Add click handler
        mysteryLevel.onclick = function() {
            alert('🎉 Du hast den geheimen TXP Code gefunden! Das Meister Level ist noch in Entwicklung!');
        };

        // Show TXP celebration
        if (window.txpCharacter) {
            window.txpCharacter.speak('🎉 TXP CODE AKTIVIERT! Du hast mich gefunden! Das geheime Level ist jetzt freigeschaltet!');
        }

        // Visual feedback
        mysteryLevel.style.animation = 'pulse 0.5s ease-in-out 3';
    }

    // Listen for key presses (sequence only)
    document.addEventListener('keydown', function(event) {
        // Ignore if user is typing in an input field
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        const key = event.key.toLowerCase();

        // Only track if it's one of our secret keys
        if (secretSequence.includes(key)) {
            currentSequence.push(key);

            // Keep only last 3 keys
            if (currentSequence.length > 3) {
                currentSequence.shift();
            }

            // Clear timeout and set new one
            clearTimeout(resetTimeout);
            resetTimeout = setTimeout(() => {
                currentSequence = [];
            }, 2000); // Reset after 2 seconds

            // Check if sequence matches T-X-P
            if (currentSequence.length === 3 &&
                currentSequence[0] === 't' &&
                currentSequence[1] === 'x' &&
                currentSequence[2] === 'p') {

                unlockMysteryLevel();
                currentSequence = [];
                clearTimeout(resetTimeout);
            }
        }
    });
})();

// ===============================
//   DEVELOPER CHEAT CODE (5x T)
// ===============================
(function() {
    let tPresses = [];
    let cheatActivated = false;

    function activateDebugCheat() {
        if (cheatActivated) return;
        cheatActivated = true;

        // Set points for all 9 levels
        // Level 1: 500 Punkte (playerPoints)
        localStorage.setItem('playerPoints', '500');

        // Level 2: 485 Punkte (aiBytes_level4_progress)
        localStorage.setItem('aiBytes_level4_progress', JSON.stringify({ score: 485 }));

        // Level 3: 400 Punkte (aiBytes_level1_progress)
        localStorage.setItem('aiBytes_level1_progress', JSON.stringify({ score: 400 }));

        // Level 4: 300 Punkte (powerAutomateProgress)
        localStorage.setItem('powerAutomateProgress', JSON.stringify({ totalPoints: 300 }));

        // Level 5: 425 Punkte (aiBytes_level6_progress)
        localStorage.setItem('aiBytes_level6_progress', JSON.stringify({ totalPoints: 425 }));

        // Level 6: 500 Punkte (aiBytes_level6_progress_data - level8.html Advanced Prompting)
        localStorage.setItem('aiBytes_level6_progress_data', JSON.stringify({ totalPoints: 500 }));

        // Level 7: 400 Punkte (aiBytes_level7_progress - level7.html Daten-Spezialist)
        localStorage.setItem('aiBytes_level7_progress', JSON.stringify({ totalPoints: 400 }));

        // Level 8: 300 Punkte (aiBytes_level3_progress - level3.html)
        localStorage.setItem('aiBytes_level3_progress', JSON.stringify({ totalPoints: 300 }));

        // Level 9: 500 Punkte (aiBytes_level9_progress)
        localStorage.setItem('aiBytes_level9_progress', JSON.stringify({ totalPoints: 500 }));

        // Update UI
        loadLevelRanks();

        // TXP celebration
        if (window.txpCharacter) {
            window.txpCharacter.speak('🎮 DEBUG CHEAT AKTIVIERT! Alle Level-Punkte wurden gesetzt! 🚀');
        }

        // Visual feedback
        const levelCards = document.querySelectorAll('.level-card');
        levelCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'pulse 0.5s ease-in-out';
                setTimeout(() => {
                    card.style.animation = '';
                }, 500);
            }, index * 100);
        });

        // Reset after 2 seconds
        setTimeout(() => {
            cheatActivated = false;
        }, 2000);
    }

    document.addEventListener('keydown', function(event) {
        // Ignore if user is typing in an input field
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        const key = event.key.toLowerCase();

        if (key === 't') {
            const now = Date.now();

            // Remove old presses (older than 1 second)
            tPresses = tPresses.filter(timestamp => now - timestamp < 1000);

            // Add new press
            tPresses.push(now);

            // Check if 5 presses within 1 second
            if (tPresses.length >= 5) {
                activateDebugCheat();
                tPresses = []; // Reset
            }
        }
    });
})();