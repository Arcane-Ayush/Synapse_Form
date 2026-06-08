import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import MainForm from './components/MainForm';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-purple-500/30">
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <div className="animate-fade-in relative min-h-screen flex flex-col">
          <div className="fixed inset-0 premium-bg opacity-30 pointer-events-none"></div>
          <div className="flex-grow pt-10">
            <MainForm />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
