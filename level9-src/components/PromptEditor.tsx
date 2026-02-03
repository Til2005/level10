
import React, { useState, useEffect } from 'react';
import { WorkPersona } from '../types';
import { Save, Trash2, Info } from 'lucide-react';

interface Props {
  persona: WorkPersona;
  onSave: (p: WorkPersona) => void;
  onDelete: (id: string) => void;
  isOnly: boolean;
}

export const PromptEditor: React.FC<Props> = ({ persona, onSave, onDelete, isOnly }) => {
  const [formData, setFormData] = useState<WorkPersona>(persona);

  useEffect(() => {
    setFormData(persona);
  }, [persona]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Persona Configuration</h2>
          <p className="text-slate-500">Define how your AI counterpart should behave and communicate.</p>
        </div>
        <div className="flex items-center gap-3">
          {!isOnly && (
            <button
              onClick={() => onDelete(persona.id)}
              className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Delete Persona"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-md"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Display Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Code Review Master"
              className="mt-1 block w-full rounded-xl border-slate-200 bg-white border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-3 outline-none"
            />
          </label>
          
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Role / Identity</span>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g., Senior Full Stack Engineer"
              className="mt-1 block w-full rounded-xl border-slate-200 bg-white border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-3 outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Communication Tone</span>
            <input
              type="text"
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              placeholder="e.g., Concise, slightly snarky but highly helpful"
              className="mt-1 block w-full rounded-xl border-slate-200 bg-white border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-3 outline-none"
            />
          </label>
        </div>

        <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 h-full flex flex-col">
          <div className="flex items-center gap-2 text-indigo-700 font-bold mb-3">
            <Info className="w-5 h-5" /> Live Preview (Instruction)
          </div>
          <div className="bg-white p-4 rounded-xl border border-indigo-200 flex-1 mono text-sm leading-relaxed text-indigo-900/80">
            <p className="mb-2">Your role is <span className="font-bold text-indigo-700">{formData.role || '...'}</span>.</p>
            <p className="mb-2">Maintain a <span className="font-bold text-indigo-700">{formData.tone || '...'}</span> tone.</p>
            <p className="mb-2">Knowledge scope: <span className="font-bold text-indigo-700">{formData.knowledge || '...'}</span>.</p>
            <p>Rules: <span className="font-bold text-indigo-700">{formData.boundaries || '...'}</span>.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Knowledge Base / Skills</span>
          <textarea
            name="knowledge"
            value={formData.knowledge}
            onChange={handleChange}
            rows={4}
            placeholder="List specific technologies, internal processes, or industry standards..."
            className="mt-1 block w-full rounded-xl border-slate-200 bg-white border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-3 outline-none resize-none"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Boundaries & Style Rules</span>
          <textarea
            name="boundaries"
            value={formData.boundaries}
            onChange={handleChange}
            rows={4}
            placeholder="e.g., Always use TypeScript for code, never apologize, use bullet points..."
            className="mt-1 block w-full rounded-xl border-slate-200 bg-white border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-3 outline-none resize-none"
          />
        </label>
      </div>
    </div>
  );
};
