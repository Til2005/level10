
import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizState } from './types';
import { Sparkles, ArrowRight, RotateCcw, Copy, Check, Wand2, PartyPopper } from 'lucide-react';

const QUESTIONS: QuizQuestion[] = [
  { id: 1, question: "In welcher Branche arbeitest du hauptsächlich?", emoji: "🏢", placeholder: "z.B. Software-Entwicklung, Marketing, Handwerk..." },
  { id: 2, question: "Wie soll dein KI-Assistent dich ansprechen?", emoji: "👋", options: ["Locker per 'Du'", "Höflich per 'Sie'", "Kumpelhaft/Bro-mäßig"] },
  { id: 3, question: "Welchen Vibe soll die KI haben?", emoji: "🎭", options: ["Streng professionell", "Kreativ & inspirierend", "Sarkastisch & witzig", "Empathisch & sanft"] },
  { id: 4, question: "Wie lang sollen die Antworten meistens sein?", emoji: "📏", options: ["Kurz & knackig", "Ausführlich mit Details", "Immer nur Stichpunkte"] },
  { id: 5, question: "Was ist deine größte tägliche Aufgabe?", emoji: "🛠️", placeholder: "z.B. E-Mails schreiben, Code debuggen, Konzepte erstellen..." },
  { id: 6, question: "Darf die KI dich korrigieren, wenn du falsch liegst?", emoji: "💡", options: ["Ja, bitte sei gnadenlos!", "Nur wenn es wichtig ist", "Nein, mach einfach was ich sage"] },
  { id: 7, question: "Welches Sprachniveau bevorzugst du?", emoji: "📚", options: ["Einfaches Deutsch", "Fachchinesisch/Expertendeutsch", "Denglisch (Mix aus Deutsch & Englisch)"] },
  { id: 8, question: "Soll die KI Emojis in der Arbeit verwenden?", emoji: "✨", options: ["Ja, bringt Farbe rein! 🌈", "Nur ganz dezent", "Bloß nicht, wir sind hier seriös"] },
  { id: 9, question: "Wie soll die KI mit schwierigen Fragen umgehen?", emoji: "🤔", options: ["Direkt sagen, wenn sie es nicht weiß", "Vorsichtig schätzen", "Immer eine kreative Lösung finden"] },
  { id: 10, question: "Gib deinem neuen KI-Kollegen einen Namen!", emoji: "🤖", placeholder: "z.B. Jarvis, Schlaubi, Work-Buddy..." },
];

// Smart Template-based Prompt Generator
function generateSmartPrompt(answers: Record<number, string>): string {
  const branche = answers[1] || "verschiedenen Bereichen";
  const ansprache = answers[2] || "Locker per 'Du'";
  const vibe = answers[3] || "Kreativ & inspirierend";
  const länge = answers[4] || "Ausführlich mit Details";
  const aufgabe = answers[5] || "verschiedenen Aufgaben";
  const korrektur = answers[6] || "Ja, bitte sei gnadenlos!";
  const sprachniveau = answers[7] || "Einfaches Deutsch";
  const emojis = answers[8] || "Nur ganz dezent";
  const schwierigeFragen = answers[9] || "Direkt sagen, wenn sie es nicht weiß";
  const name = answers[10] || "KI-Assistent";

  // Tonalität bestimmen
  let tonalität = "";
  let persönlichkeit = "";

  if (vibe.includes("professionell")) {
    tonalität = "streng professionell und sachlich";
    persönlichkeit = "Du bist fokussiert, effizient und gehst direkt auf den Punkt.";
  } else if (vibe.includes("kreativ")) {
    tonalität = "kreativ, inspirierend und motivierend";
    persönlichkeit = "Du denkst über den Tellerrand hinaus und bringst frische Perspektiven ein.";
  } else if (vibe.includes("Sarkastisch")) {
    tonalität = "witzig, leicht sarkastisch aber immer hilfreich";
    persönlichkeit = "Du hast einen trockenen Humor, bleibst aber konstruktiv und lösungsorientiert.";
  } else if (vibe.includes("Empathisch")) {
    tonalität = "empathisch, verständnisvoll und sanft";
    persönlichkeit = "Du nimmst Rücksicht auf Gefühle und gehst behutsam auf Anliegen ein.";
  }

  // Antwortlänge
  let antwortStil = "";
  if (länge.includes("Kurz")) {
    antwortStil = "Halte deine Antworten kurz und prägnant. Maximal 2-3 Sätze, wenn möglich.";
  } else if (länge.includes("Stichpunkte")) {
    antwortStil = "Antworte immer in Stichpunkten oder kurzen Listen. Vermeide lange Fließtexte.";
  } else {
    antwortStil = "Gib ausführliche, detaillierte Antworten mit Hintergrundinformationen und Beispielen.";
  }

  // Anrede
  let anredeStil = "";
  if (ansprache.includes("Sie")) {
    anredeStil = "Sprich den Nutzer mit 'Sie' an und bleibe formell höflich.";
  } else if (ansprache.includes("Kumpel")) {
    anredeStil = "Sprich den Nutzer locker per 'Du' an, wie ein guter Kumpel. Sei entspannt und authentisch.";
  } else {
    anredeStil = "Sprich den Nutzer freundlich per 'Du' an.";
  }

  // Emoji-Nutzung
  let emojiRegel = "";
  if (emojis.includes("Ja")) {
    emojiRegel = "Nutze Emojis großzügig, um deine Antworten lebendiger zu machen. 🎨✨";
  } else if (emojis.includes("dezent")) {
    emojiRegel = "Nutze gelegentlich ein passendes Emoji, aber übertreibe es nicht.";
  } else {
    emojiRegel = "Verzichte komplett auf Emojis. Bleibe rein textbasiert.";
  }

  // Korrekturverhalten
  let korrekturVerhalten = "";
  if (korrektur.includes("gnadenlos")) {
    korrekturVerhalten = "Wenn der Nutzer falsch liegt oder einen Fehler macht, korrigiere ihn direkt und deutlich. Sachlichkeit geht vor Höflichkeit.";
  } else if (korrektur.includes("wichtig")) {
    korrekturVerhalten = "Korrigiere den Nutzer nur bei wirklich wichtigen Fehlern. Bei Kleinigkeiten lass es durchgehen.";
  } else {
    korrekturVerhalten = "Setze immer die Anweisungen des Nutzers um, auch wenn du anderer Meinung bist. Keine Korrekturen.";
  }

  // Sprachniveau
  let sprache = "";
  if (sprachniveau.includes("Einfaches")) {
    sprache = "Nutze einfache, verständliche Sprache. Vermeide Fachbegriffe oder erkläre sie sofort.";
  } else if (sprachniveau.includes("Fachchinesisch")) {
    sprache = "Nutze Fachsprache und technische Begriffe. Der Nutzer ist Experte und erwartet präzise Terminologie.";
  } else {
    sprache = "Mische deutsches und englisches Vokabular natürlich (Denglisch). Nutze gängige englische Fachbegriffe.";
  }

  // Umgang mit schwierigen Fragen
  let unsicherheit = "";
  if (schwierigeFragen.includes("nicht weiß")) {
    unsicherheit = "Wenn du etwas nicht weißt oder unsicher bist, sag das ehrlich und transparent.";
  } else if (schwierigeFragen.includes("schätzen")) {
    unsicherheit = "Bei Unsicherheit darfst du vorsichtig schätzen, weise aber darauf hin dass es eine Vermutung ist.";
  } else {
    unsicherheit = "Finde immer eine kreative Lösung oder Annäherung, auch wenn du nicht 100% sicher bist.";
  }

  // Finaler Prompt
  return `Du bist ${name}, ein spezialisierter KI-Assistent für ${branche}.

# DEINE PERSÖNLICHKEIT
${persönlichkeit}
Dein Kommunikationsstil ist ${tonalität}.

# KOMMUNIKATIONSREGELN
${anredeStil}
${antwortStil}
${sprache}
${emojiRegel}

# KERNAUFGABE
Deine Hauptaufgabe ist es, bei folgenden Tätigkeiten zu unterstützen: ${aufgabe}
Konzentriere dich darauf, in diesem Bereich maximalen Mehrwert zu liefern.

# VERHALTEN BEI FEHLERN
${korrekturVerhalten}

# UMGANG MIT UNSICHERHEIT
${unsicherheit}

# WICHTIG
- Bleibe immer in deiner definierten Rolle als ${name}
- Passe deine Antworten an die Bedürfnisse im Bereich ${branche} an
- Sei konsistent in deinem ${vibe.toLowerCase()} Stil

Starte jetzt deine Arbeit als ${name}!`;
}

const App: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    currentStep: 0, // 0 is intro
    answers: {},
    isGenerating: false,
    finalPrompt: null,
  });
  const [inputValue, setInputValue] = useState("");
  const [copied, setCopied] = useState(false);

  const currentQuestion = QUESTIONS[state.currentStep - 1];
  const progress = (state.currentStep / QUESTIONS.length) * 100;

  const handleNext = (answer?: string) => {
    const finalAnswer = answer || inputValue;
    if (!finalAnswer && state.currentStep > 0) return;

    const newAnswers = { ...state.answers, [state.currentStep]: finalAnswer };
    
    if (state.currentStep === QUESTIONS.length) {
      generatePrompt(newAnswers);
    } else {
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        answers: newAnswers
      }));
      setInputValue("");
    }
  };

  const generatePrompt = async (answers: Record<number, string>) => {
    setState(prev => ({ ...prev, isGenerating: true, currentStep: QUESTIONS.length + 1 }));

    // Simulate "thinking" time for better UX
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Generate prompt using smart template
    const generatedPrompt = generateSmartPrompt(answers);

    setState(prev => ({ ...prev, isGenerating: false, finalPrompt: generatedPrompt }));
  };

  const reset = () => {
    setState({ currentStep: 0, answers: {}, isGenerating: false, finalPrompt: null });
    setInputValue("");
  };

  const copyToClipboard = () => {
    if (state.finalPrompt) {
      navigator.clipboard.writeText(state.finalPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Intro Screen
  if (state.currentStep === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-10 text-center card-bounce border-4 border-indigo-200">
          <div className="text-6xl mb-6 floating-emoji">🚀</div>
          <h1 className="text-4xl font-bold text-indigo-900 mb-4 tracking-tight">KI für DICH!</h1>
          <p className="text-slate-600 mb-8 text-lg leading-relaxed font-medium">
            Beantworte 10 kurze Fragen und ich "backe" dir deinen perfekten persönlichen KI-Arbeitsassistenten!
          </p>
          <button
            onClick={() => setState(prev => ({ ...prev, currentStep: 1 }))}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-2 group"
          >
            Spiel starten <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (state.isGenerating) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="relative inline-block">
            <div className="text-8xl animate-bounce">🧑‍🍳</div>
            <Wand2 className="absolute -top-2 -right-2 w-10 h-10 text-indigo-400 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-white drop-shadow-md">Magie wird gewirkt...</h2>
          <p className="text-indigo-200 font-medium">Ich vermische deine Antworten zu einem meisterhaften System-Prompt.</p>
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-3 h-3 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Result Screen
  if (state.finalPrompt) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border-4 border-green-100 animate-in fade-in zoom-in duration-500">
          <div className="flex items-center justify-center gap-3 mb-6">
            <PartyPopper className="w-10 h-10 text-green-500" />
            <h2 className="text-3xl font-bold text-slate-800">Fertig gebacken!</h2>
          </div>
          <p className="text-slate-500 mb-6 text-center">Dein maßgeschneiderter Prompt von <b>KI für DICH!</b> ist bereit. Kopiere ihn einfach in dein KI-Tool.</p>
          
          <div className="relative group">
            <div className="bg-slate-50 rounded-3xl p-6 border-2 border-slate-100 font-medium text-slate-700 leading-relaxed text-sm md:text-base max-h-[40vh] overflow-y-auto mb-8 whitespace-pre-wrap">
              {state.finalPrompt}
            </div>
            <button
              onClick={copyToClipboard}
              className={`absolute top-4 right-4 p-3 rounded-xl transition-all shadow-sm flex items-center gap-2 ${
                copied ? 'bg-green-500 text-white' : 'bg-white text-slate-400 hover:text-indigo-600'
              }`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={copyToClipboard}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Copy className="w-5 h-5" /> Prompt kopieren
            </button>
            <button
              onClick={reset}
              className="sm:w-1/3 border-2 border-slate-200 text-slate-400 hover:bg-slate-50 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> Neu starten
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Question Screen
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-lg w-full mb-8">
        <div className="flex justify-between items-end mb-2 px-2">
          <span className="text-indigo-200 font-bold text-lg">Frage {state.currentStep} von {QUESTIONS.length}</span>
          <span className="text-slate-300 font-medium opacity-70">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-4 bg-slate-900/30 rounded-full overflow-hidden shadow-inner border border-slate-700/50">
          <div 
            className="h-full bg-gradient-to-r from-indigo-400 to-violet-400 progress-bar shadow-[0_0_15px_rgba(129,140,248,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="max-w-lg w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 border-4 border-white/10 animate-in slide-in-from-right-10 duration-300">
        <div className="text-5xl mb-6 text-center">{currentQuestion.emoji}</div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-8 leading-tight">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options ? (
            currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleNext(opt)}
                className="w-full p-4 text-left rounded-2xl border-2 border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all font-semibold text-slate-600 hover:text-indigo-700 flex items-center justify-between group"
              >
                {opt}
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
              </button>
            ))
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                placeholder={currentQuestion.placeholder}
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-400 focus:bg-white transition-all text-lg font-medium text-slate-700"
              />
              <button
                onClick={() => handleNext()}
                disabled={!inputValue.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Weiter <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <button 
        onClick={reset}
        className="mt-8 text-slate-300 hover:text-rose-300 transition-colors flex items-center gap-1 font-medium text-sm opacity-60 hover:opacity-100"
      >
        <RotateCcw className="w-4 h-4" /> Quiz abbrechen
      </button>
    </div>
  );
};

export default App;
