import { Suspense, useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Experience from './components/sections/Experience';
import Overlay from './components/layout/Overlay';
import CustomCursor from './components/layout/CustomCursor';
import SoundManager from './components/core/SoundManager';
import ProfileDOM from './components/dom/ProfileDOM';
import MissionModal from './components/ui/MissionModal';
import BlackBoxModal from './components/ui/BlackBoxModal';
import { useStore } from './hooks/useStore';

import GlobalErrorBoundary from './components/core/GlobalErrorBoundary';
import { LORE } from './data/lore';

function App() {
  const currentScene = useStore((state) => state.currentScene);

  // Always start from boot scene on refresh (no scene param sync on mount)
  // URL sync: only update URL for non-boot scenes
  useEffect(() => {
    if (currentScene !== 'boot') {
      const url = new URL(window.location);
      url.searchParams.set('scene', currentScene);
      window.history.pushState({}, '', url);
    } else {
      // Clear scene param when on boot
      const url = new URL(window.location);
      url.searchParams.delete('scene');
      window.history.replaceState({}, '', url);
    }
  }, [currentScene]);

  return (
    <HelmetProvider>
      <GlobalErrorBoundary>
        <div className="w-full h-screen bg-background text-text selection:bg-primary/30 selection:text-white cursor-none overflow-hidden">
          <Helmet>
            <title>Yesol Heo | Cinematic Metaverse Director</title>
            <meta name="description" content="A Cinematic 3D Portfolio of Yesol Heo, Metaverse & XR Project Manager." />
          </Helmet>

          <CustomCursor />
          <SoundManager />

          {/* 3D Scene Layer */}
          <Suspense fallback={<div className="flex items-center justify-center h-screen text-white font-mono text-xl animate-pulse tracking-widest">{LORE.SYSTEM.LOADING}</div>}>
            <Experience />
          </Suspense>

          {/* UI Overlay Layer */}
          <Overlay />

          {/* DOM Content Layer (For Profile Scroll Reliability) */}
          {currentScene === 'profile' && <ProfileDOM />}

          {/* Phase 34: Mission Modal (Planetary Archives) */}
          <MissionModal />

          {/* Phase 35: Black Box Modal (DevLog) */}
          <BlackBoxModal />
        </div>
      </GlobalErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
