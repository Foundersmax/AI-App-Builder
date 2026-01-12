
import React, { useState, useEffect } from 'react';
import { WebsiteState, ViewportMode } from './types';
import Sidebar from './components/Sidebar';
import Preview from './components/Preview';
import LandingPage from './components/LandingPage';
import { generateWebsite, refineWebsite, saveWebsite, loadSites } from './services/apiService';

type AppView = 'landing' | 'editor';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [site, setSite] = useState<WebsiteState | null>(null);
  const [recentSites, setRecentSites] = useState<WebsiteState[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<ViewportMode>('desktop');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch recent projects on mount and when returning to landing
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const sites = await loadSites();
        setRecentSites(sites);
      } catch (err) {
        console.error("Failed to load recent projects", err);
      }
    };
    fetchSites();
  }, [view]);

  const handleGenerate = async (prompt: string) => {
    setLoading(true);
    setError(null);
    setView('editor');
    try {
      const newSite = await generateWebsite(prompt);
      setSite(newSite);
    } catch (err: any) {
      setError(err.message || 'Connection to backend failed. Check Render server.');
      setView('landing');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSite = (selectedSite: WebsiteState) => {
    setSite(selectedSite);
    setView('editor');
  };

  const handleRefine = async (instruction: string) => {
    if (!site) return;
    setLoading(true);
    setError(null);
    try {
      const updatedSite = await refineWebsite(site, instruction);
      setSite(updatedSite);
    } catch (err: any) {
      setError(err.message || 'Failed to refine website.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!site) return;
    setSaving(true);
    setError(null);
    try {
      const saved = await saveWebsite(site);
      setSite(saved);
      setSuccessMsg('Changes synced to MongoDB Atlas');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError('Database save failed. Check backend connection.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Return to home? Unsaved changes will be lost.')) {
      setSite(null);
      setView('landing');
    }
  };

  const downloadCode = () => {
    if (!site) return;
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${site.metadata.title}</title>
    <meta name="description" content="${site.metadata.description}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; scroll-behavior: smooth; margin: 0; }</style>
</head>
<body>${site.sections.map(s => s.html).join('\n')}</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${site.metadata.title.toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (view === 'landing') {
    return (
      <LandingPage 
        onStart={handleGenerate} 
        onSelectSite={handleSelectSite}
        loading={loading} 
        recentSites={recentSites}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen h-[100dvh] bg-[#0a0a0a]">
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0a] z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={handleReset}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <span className="text-white font-bold">L</span>
            </div>
            <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Lumina Editor</span>
          </div>
          <div className="h-6 w-px bg-white/10 hidden md:block" />
          <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-lg">
            {(['desktop', 'tablet', 'mobile'] as ViewportMode[]).map((v) => (
              <button key={v} onClick={() => setMode(v)} className={`p-1.5 rounded-md transition-all ${mode === v ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}>
                {v === 'desktop' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                {v === 'tablet' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                {v === 'mobile' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {site && (
            <>
              <button onClick={handleSave} disabled={saving} className="bg-white/5 hover:bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all border border-white/10 flex items-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>}
                <span>Save</span>
              </button>
              <button onClick={downloadCode} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                <span className="hidden sm:inline">Export Code</span>
              </button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <Sidebar site={site} loading={loading} onGenerate={handleGenerate} onRefine={handleRefine} onReset={handleReset} />
        <Preview site={site} mode={mode} />

        {error && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-red-500/90 backdrop-blur text-white px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-red-400">
             <span className="text-sm font-medium">{error}</span>
             <button onClick={() => setError(null)}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        )}
        {successMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-500/90 backdrop-blur text-white px-6 py-2 rounded-full shadow-2xl z-50 animate-fade-in-down border border-emerald-400 text-sm font-medium">
            {successMsg}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
