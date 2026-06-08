import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance animation shortly after mounting
    const mountTimer = setTimeout(() => setIsMounted(true), 100);
    const endTimer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onComplete();
      }, 1000); // 1s
    }, 2800);

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ease-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>

      {/* Expanding Ambient Glow */}
      <div
        className={`absolute w-[400px] md:w-[800px] h-[300px] md:h-[600px] bg-purple-900/40 blur-[100px] rounded-full transition-all duration-[3000ms] ease-out pointer-events-none ${isMounted ? 'scale-150 opacity-60' : 'scale-50 opacity-0'}`}
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <h1
          className={`text-5xl sm:text-7xl md:text-9xl font-bold text-white tracking-[0.1em] sm:tracking-[0.15em] mb-4 sm:mb-6 transition-all duration-[2000ms] ease-out drop-shadow-[0_0_30px_rgba(168,85,247,0.7)] ${isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
        >
          SYNAPSE
        </h1>

        <div className={`flex items-center justify-center gap-4 sm:gap-8 transition-all duration-[2000ms] delay-[600ms] ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="h-[2px] w-12 sm:w-20 md:w-32 bg-gradient-to-r from-transparent to-purple-500 rounded-full" />
          <h2 className="text-lg sm:text-2xl md:text-4xl text-purple-200 tracking-[0.4em] sm:tracking-[0.6em] uppercase drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            Society
          </h2>
          <div className="h-[2px] w-12 sm:w-20 md:w-32 bg-gradient-to-l from-transparent to-purple-500 rounded-full" />
        </div>
      </div>

    </div>
  );
};

export default SplashScreen;
