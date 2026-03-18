
export interface QuizQuestion {
  id: number;
  question: string;
  emoji: string;
  options?: string[];
  placeholder?: string;
}

export interface QuizState {
  currentStep: number;
  answers: Record<number, string>;
  isGenerating: boolean;
  finalPrompt: string | null;
}

// Added to fix module errors and provide types for Persona Sandbox components
export interface WorkPersona {
  id: string;
  name: string;
  role: string;
  tone: string;
  knowledge: string;
  boundaries: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type ImageSize = '1K' | '2K' | '4K';

export interface GeneratedImage {
  url: string;
  prompt: string;
  size: ImageSize;
  timestamp: number;
}
