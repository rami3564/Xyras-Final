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
  const [showInteractionHint, setShowInteractionHint] = useState(false);

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
          // Show interaction hint after a delay
          setTimeout(() => {
            setShowInteractionHint(true);
          }, 1000);
        }, 600); // Slightly shorter pause after letters appear
      }
    }, 180); // Faster animation between letters (180ms)
    
    // Auto-launch timeout if user doesn't interact after 3.5 seconds
    const autoLaunchTimer = setTimeout(() => {
      if (!isLaunching) {
        startMorphTransition();
      }
    }, 3500); // 3.5 seconds timeout (reduced from 4)

    return () => {
      clearInterval(letterTimer);
      clearTimeout(autoLaunchTimer);
    };
  }, [isLaunching]);

  const startMorphTransition = () => {
    if (isLaunching) return;
    
    setIsLaunching(true);
    setShowInteractionHint(false);
    
    // Faster, smoother transition over 1.6 seconds
    let progress = 0;
    const duration = 1600; // Even faster (1.6s)
    const interval = 16; // ~60fps
    const increment = interval / duration;

    const morphAnimation = setInterval(() => {
      progress += increment;
      // Enhanced smooth easing function (cubic bezier approximation)
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
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown') {
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
  
  // Calculate dynamic background gradient based on morph progress
  const getBackgroundStyle = () => {
    const startColor = 'rgba(255, 255, 255, 1)';
    const endColor = 'rgba(255, 255, 255, 1)';
    
    return {
      background: `linear-gradient(to bottom, ${startColor}, ${endColor})`,
      transition: 'background 0.5s ease'
    };
  };
  
  // Enhanced morphing effect for smoother animation
  const getLogoMorphStyle = () => {
    return {
      transform: `scale(${1 + morphProgress * 0.2}) translateY(${morphProgress * -20}px)`,
      opacity: 1 - morphProgress * 0.8,
      filter: `blur(${morphProgress * 8}px)`,
      transition: 'all 0.3s ease'
    };
  };

  return (
    <div 
      className={`${styles.introContainer} ${fadeIn ? styles.fadeIn : ''}`}
      style={{
        ...getBackgroundStyle(),
        color: '#111'
      }}
    >
      <div 
        className={styles.logoContainer}
        style={getLogoMorphStyle()}
      >
        <div className={styles.logoWrapper}>
          {logoLetters.map((letter, index) => (
            <span 
              key={index} 
              className={`${styles.logoLetter} ${index < visibleLetters ? styles.visible : ''}`}
              style={{ 
                transitionDelay: `${index * 0.15}s`,
                color: '#111',
                opacity: isLaunching ? (1 - morphProgress) : 1
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        
        {/* Interaction hint */}
        {showInteractionHint && !isLaunching && (
          <div className={styles.interactionHint}>
            <span className={styles.clickHint}>Click anywhere to continue</span>
            <span className={styles.pulseCircle}></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroPage;