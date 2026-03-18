
import React, { useState, useRef, useEffect } from 'react';
import { WorkPersona, ChatMessage } from '../types';
import { GoogleGenAI } from '@google/genai';
import { Send, Loader2, User, Bot, AlertCircle } from 'lucide-react';

export const ChatSandbox: React.FC<{ persona: WorkPersona }> = ({ persona }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const generateInstruction = () => {
    return `
      ACT AS: ${persona.role}
      TONE: ${persona.tone}
      KNOWLEDGE: ${persona.knowledge}
      RULES: ${persona.boundaries}
      SYSTEM: You are the user's customized work persona. 
      Always adhere to these instructions. 
      Do not break character.
    `.trim();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...messages, userMessage].map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: generateInstruction(),
          temperature: 0.7,
        }
      });

      const aiText = response.text || 'No response received.';
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (err: any) {
      console.error(err);
      setError('Connection failed. Please ensure your environment is correctly configured.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-400">
            <Bot className="w-12 h-12 opacity-20" />
            <div>
              <p className="font-medium">Sandbox Session Started</p>
              <p className="text-sm">Say something to test "{persona.name}"</p>
            </div>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
              m.role === 'user' ? 'bg-slate-100 text-slate-600' : 'bg-indigo-100 text-indigo-600'
            }`}>
              {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm border ${
              m.role === 'user' 
                ? 'bg-slate-50 border-slate-100' 
                : 'bg-white border-indigo-50 text-slate-800'
            }`}>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-indigo-300 animate-spin" />
            </div>
            <div className="bg-indigo-50 h-12 w-48 rounded-2xl" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${persona.name}...`}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl px-6 py-3 font-medium transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </div>
      </div>
    </div>
  );
};
