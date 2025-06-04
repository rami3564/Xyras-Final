'use client'

import { useState, useEffect } from 'react';
import styles from './IntroPage.module.css';

interface IntroPageProps {
  onComplete: () => void;
}

const IntroPage = ({ onComplete }: IntroPageProps) => {
  const [fadeIn, setFadeIn] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [canLaunch, setCanLaunch] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [morphProgress, setMorphProgress] = useState(0);
  const [visibleLetters, setVisibleLetters] = useState(0);

  // Replace rocket with 'A' in logo
  const logoLetters = ['X', 'Y', 'R', 'A', 'S'];

  useEffect(() => {
    // Initial fade in
    setFadeIn(true);
    
    // Animate letters sequentially with better timing
    let letterIndex = 0;
    const letterTimer = setInterval(() => {
      if (letterIndex <= logoLetters.length) {
        setVisibleLetters(letterIndex);
        letterIndex++;
      } else {
        clearInterval(letterTimer);
        
        // Enable launching after all letters appear with a slight pause
        setTimeout(() => {
          setCanLaunch(true);
        }, 800); // Longer pause after letters appear
      }
    }, 250); // Slightly faster animation between letters (250ms)
    
    // Auto-launch timeout if user doesn't interact after 5 seconds
    const autoLaunchTimer = setTimeout(() => {
      if (!isLaunching) {
        startMorphTransition();
      }
    }, 5000); // 5 seconds timeout

    return () => {
      clearInterval(letterTimer);
      clearTimeout(autoLaunchTimer);
    };
  }, [isLaunching]);

  const startMorphTransition = () => {
    if (isLaunching) return;
    
    setIsLaunching(true);
    
    // Faster, smoother transition over 2 seconds
    let progress = 0;
    const duration = 2000;
    const interval = 16; // ~60fps
    const increment = interval / duration;

    const morphAnimation = setInterval(() => {
      progress += increment;
      // Smooth easing function (ease-in-out)
      const easedProgress = progress < 0.5 
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      if (progress >= 1) {
        progress = 1;
        clearInterval(morphAnimation);
        // Complete transition immediately - no delay
        setTimeout(() => {
          onComplete();
        }, 100);
      }
      
      setMorphProgress(easedProgress);
    }, interval);
  };

  useEffect(() => {
    if (!canLaunch || isLaunching) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        startMorphTransition();
      }
    };

    const handleClick = () => {
      startMorphTransition();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, [canLaunch, isLaunching]);

  // Calculate dynamic styles based on morph progress
  const introOpacity = Math.max(0, 1 - morphProgress * 1.5);
  const landingOpacity = Math.min(1, morphProgress * 1.2);
  
  // Enhanced background transition that matches your main page
  const getBackgroundStyle = () => {
    if (morphProgress === 0) {
      // Initial intro background - dark space
      return {
        background: 'linear-gradient(180deg, #050510 0%, #060612 30%, #0a0918 70%, #0c0b20 100%)'
      };
    } else if (morphProgress < 1) {
      // Transitioning to main page background
      const t = morphProgress;
      return {
        background: `linear-gradient(180deg, 
          rgb(${Math.floor(5 + t * 7)}, ${Math.floor(5 + t * 4)}, ${Math.floor(16 + t * 2)}) 0%, 
          rgb(${Math.floor(6 + t * 3)}, ${Math.floor(6 + t * 3)}, ${Math.floor(18 + t * 0)}) 20%, 
          rgb(${Math.floor(10 + t * -7)}, ${Math.floor(9 + t * -6)}, ${Math.floor(24 + t * -16)}) 60%, 
          rgb(${Math.floor(12 + t * -12)}, ${Math.floor(11 + t * -11)}, ${Math.floor(32 + t * -32)}) 100%)`
      };
    } else {
      // Final background matching main page exactly
      return {
        background: 'linear-gradient(180deg, #0c0918 0%, #090912 20%, #030308 60%, #000000 100%)'
      };
    }
  };

  return (
    <div 
      className={`${styles.introContainer} ${fadeIn ? styles.fadeIn : ''}`}
      style={{ textAlign: 'center' }}
    >
      <div className={styles.introContent}>
        <div className={styles.logoText}>
          {logoLetters.slice(0, visibleLetters).map((letter, index) => (
            <span 
              key={index} 
              className={styles.letter}
              style={{ 
                animationDelay: `${index * 0.25}s`,
                color: '#23272f',
                textShadow: '0 2px 16px rgba(60,60,60,0.04)'
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        
        {canLaunch && (
          <div 
            className={styles.continueContainer}
            style={{ 
              opacity: isLaunching ? 0 : 1, 
              transition: 'opacity 0.5s ease',
              marginTop: '3rem'
            }}
          >
            <button 
              className={styles.continueButton}
              onClick={startMorphTransition}
              style={{
                background: '#fff',
                color: '#23272f',
                padding: '0.9rem 2.2rem',
                borderRadius: '0.5rem',
                border: '2px solid #23272f',
                fontWeight: 600,
                fontSize: '1rem',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroPage;