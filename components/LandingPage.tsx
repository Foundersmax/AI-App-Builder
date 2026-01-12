
import React, { useState } from 'react';
import { WebsiteState } from '../types';

interface LandingPageProps {
  onStart: (prompt: string) => void;
  onSelectSite: (site: WebsiteState) => void;
  loading: boolean;
  recentSites: WebsiteState[];
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onSelectSite, loading, recentSites }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onStart(prompt);
    }
  };

  const suggestions = [
    "SaaS platform for crypto traders",
    "Photography portfolio with dark theme",
    "Modern coffee shop in Tokyo",
    "AI startup with neon accents"
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Header */}
      <header className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Lumina <span className="text-blue-500">AI</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com" target="_blank" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Documentation</a>
          <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all border border-white/10">Sign In</button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 max-w-5xl mx-auto text-center py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] uppercase tracking-widest font-bold text-blue-400 mb-8 animate-pulse">
          Next Gen Site Builder
        </div>
        
        <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
          Design anything. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
            Instant Deployment.
          </span>
        </h2>
        
        <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          Lumina leverages Gemini 3 Pro to understand your vision and build fully functional, responsive websites using the Tailwind ecosystem.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl relative group mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
          <div className="relative flex bg-[#141414] border border-white/10 rounded-2xl p-2 focus-within:border-blue-500/50 transition-all shadow-2xl">
            <input 
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your project idea..."
              className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-white placeholder-gray-600 text-lg"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading || !prompt.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-xl flex items-center gap-2 whitespace-nowrap active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'Generate'}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-3 mb-24">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setPrompt(s)}
              className="text-xs font-medium text-gray-500 hover:text-white hover:bg-white/5 border border-white/5 px-4 py-2 rounded-full transition-all"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Recent Projects Section */}
        {recentSites.length > 0 && (
          <div className="w-full text-left space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-xl font-semibold text-white">Recent Projects</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Persisted on MongoDB</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentSites.map((site) => (
                <div 
                  key={site._id}
                  onClick={() => onSelectSite(site)}
                  className="group bg-[#141414] border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-3xl group-hover:bg-blue-600/10 transition-colors"></div>
                  <div className="relative z-10">
                    <h4 className="text-lg font-bold text-white mb-2 truncate">{site.metadata.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{site.metadata.description}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase">
                      <span>View Project</span>
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 px-8 py-10 max-w-7xl mx-auto w-full border-t border-white/5 opacity-50 text-center">
        <p className="text-sm text-gray-500">© 2024 Lumina AI Site Builder. Powered by Google Gemini & MongoDB Atlas.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
