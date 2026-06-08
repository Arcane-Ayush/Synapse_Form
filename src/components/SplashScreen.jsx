import React, { useEffect, useRef, useState } from 'react';
import synapseVideo from '../assets/New_Splash.mp4';

const SplashScreen = ({ onComplete }) => {
  const videoRef = useRef(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(e => {
        console.error("Autoplay prevented", e);
        // Fallback if autoplay is blocked by browser
        handleVideoEnd();
      });
    }
  }, []);

  const handleVideoEnd = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 800); // match duration of CSS transition
  };

  return (
    <div className={`fixed inset-0 z-50 bg-[#0b0c10] flex items-center justify-center transition-opacity duration-1000 ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      <video
        ref={videoRef}
        src={synapseVideo}
        className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${isFadingOut ? 'opacity-0 scale-125 brightness-150 blur-sm' : 'opacity-100 scale-100 brightness-100 blur-0'}`}
        muted
        playsInline
        onEnded={handleVideoEnd}
      />
    </div>
  );
};

export default SplashScreen;
