
import React, { useEffect, useRef } from 'react';
import { WebsiteState, ViewportMode } from '../types';

interface PreviewProps {
  site: WebsiteState | null;
  mode: ViewportMode;
}

const Preview: React.FC<PreviewProps> = ({ site, mode }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && site) {
      const doc = iframeRef.current.contentDocument;
      if (!doc) return;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              body { font-family: 'Inter', sans-serif; overflow-x: hidden; }
              html { scroll-behavior: smooth; }
            </style>
          </head>
          <body class="bg-white">
            <div id="site-root">
              ${site.sections.map(s => `
                <section id="${s.id}" data-type="${s.type}">
                  ${s.html}
                </section>
              `).join('')}
            </div>
          </body>
        </html>
      `;

      doc.open();
      doc.write(htmlContent);
      doc.close();
    }
  }, [site]);

  const viewportClasses = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-full mx-auto shadow-2xl rounded-xl border-x border-gray-800',
    mobile: 'w-[375px] h-full mx-auto shadow-2xl rounded-xl border-x border-gray-800'
  };

  return (
    <div className="flex-1 bg-[#121212] overflow-hidden p-4 md:p-8 flex flex-col items-center justify-center transition-all duration-300">
      {site ? (
        <div className={`transition-all duration-500 bg-white rounded-lg overflow-hidden ${viewportClasses[mode]}`}>
          <iframe
            ref={iframeRef}
            title="Website Preview"
            className="w-full h-full border-none"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="w-24 h-24 bg-gray-800/50 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-3">Ready to Build?</h2>
          <p className="text-gray-400">Describe your business, project, or personal brand on the left and Lumina will handle the design.</p>
        </div>
      )}
    </div>
  );
};

export default Preview;
