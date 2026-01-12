
import React, { useState } from 'react';
import { WebsiteState } from '../types';

interface SidebarProps {
  site: WebsiteState | null;
  loading: boolean;
  onGenerate: (prompt: string) => void;
  onRefine: (instruction: string) => void;
  onReset: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ site, loading, onGenerate, onRefine, onReset }) => {
  const [prompt, setPrompt] = useState('');
  const [refinement, setRefinement] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    onGenerate(prompt);
  };

  const handleRefine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinement.trim() || loading) return;
    onRefine(refinement);
    setRefinement('');
  };

  return (
    <div className="w-full md:w-[400px] border-r border-white/10 flex flex-col h-full bg-[#0d0d0d] overflow-y-auto">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Lumina <span className="text-blue-500">AI</span></h1>
        </div>
        {site && (
          <button 
            onClick={onReset}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            New Project
          </button>
        )}
      </div>

      <div className="flex-1 p-6 space-y-8">
        {!site ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">What are we building today?</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A dark-themed landing page for a coffee subscription service with a focus on quality and community."
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-40 resize-none outline-none text-sm leading-relaxed"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Designing...</span>
                </>
              ) : (
                'Generate Website'
              )}
            </button>
          </form>
        ) : (
          <>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Refine Design</h3>
              <form onSubmit={handleRefine} className="space-y-3">
                <textarea
                  value={refinement}
                  onChange={(e) => setRefinement(e.target.value)}
                  placeholder="e.g. Change the main color to emerald, or add a testimonial section."
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-32 resize-none outline-none text-sm"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !refinement.trim()}
                  className="w-full bg-white/10 hover:bg-white/20 disabled:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-all text-sm"
                >
                  {loading ? 'Refining...' : 'Update Site'}
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Site Outline</h3>
              <div className="space-y-2">
                {site.sections.map((section, idx) => (
                  <div key={section.id} className="flex items-center gap-3 p-3 bg-[#1a1a1a] border border-white/5 rounded-lg">
                    <span className="text-xs text-gray-500 font-mono">0{idx + 1}</span>
                    <span className="text-sm font-medium text-gray-300 capitalize">{section.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-6 border-t border-white/10 bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">G3</div>
          <div>
            <p className="text-sm font-medium text-white">Powered by Gemini 3 Pro</p>
            <p className="text-xs text-gray-500">Advanced Design Intelligence</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
