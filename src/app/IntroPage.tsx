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

  // Define the letters to animate 
  const logoLetters = ['X', 'Y', 'R', 'rocket', 'S'];

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
    
    // Auto-launch timeout if user doesn't interact
    const autoLaunchTimer = setTimeout(() => {
      if (!isLaunching) {
        startMorphTransition();
      }
    }, 8000); // 8 seconds timeout

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

  // Enhanced rocket movement with smoother and more dramatic animation
  const rocketTransform = isLaunching 
    ? `translateY(${-morphProgress * 300}px) translateX(${morphProgress * 80}px) scale(${1 - morphProgress * 0.3}) rotate(${morphProgress * 15}deg)`
    : 'translateY(0px) scale(1)';

  return (
    <div 
      className={`${styles.introContainer} ${fadeIn ? styles.fadeIn : ''}`}
      style={getBackgroundStyle()}
    >
      {/* Enhanced Star Field */}
      <div className={styles.starField}>
        {/* Intro Stars - fade out */}
        <div className={styles.introStars} style={{ opacity: introOpacity }}>
          <div className={styles.starsLayer1}></div>
          <div className={styles.starsLayer2}></div>
          <div className={styles.twinklingLayer}></div>
        </div>
        
        {/* Landing Stars - fade in to match main page */}
        <div className={styles.landingStars} style={{ opacity: landingOpacity }}>
          <div className={styles.mainStarsSmall}></div>
          <div className={styles.mainStarsMedium}></div>
          <div className={styles.mainDeepStars}></div>
          <div className={styles.mainTwinklingStars}></div>
        </div>
        
        {/* Shooting stars throughout */}
        <div className={styles.shootingStars}>
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className={styles.shootingStar} 
              style={{ 
                '--delay': `${i * 2}s`,
                '--rotation': `${15 + i * 10 - (i % 2) * 30}deg`,
                '--duration': `${6 + i}s`
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* Intro Content */}
      <div className={styles.introContent} style={{ opacity: introOpacity }}>
        <div className={`${styles.introText} ${fadeIn ? styles.textVisible : ''}`}>
          {/* Animated XYRAS logo with individual letters */}
          <div className={styles.logoText}>
            {logoLetters.map((letter, index) => (
              <span 
                key={index} 
                className={styles.letter} 
                style={{ 
                  animationDelay: `${index * 0.3}s`,
                  opacity: visibleLetters > index ? 1 : 0,
                  transform: visibleLetters > index ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)'
                }}
              >
                {letter === 'rocket' ? (
                  <div 
                    className={`${styles.introRocket} ${isLaunching ? styles.launching : ''}`}
                    style={{ transform: letter === 'rocket' && isLaunching ? rocketTransform : undefined }}
                  >
                    <img 
                      src="/assets/xyras-rocket.png"
                      alt="Rocket"
                      width="80"
                      height="80"
                      className={styles.rocketImage}
                    />
                    
                    {/* Enhanced rocket flames during liftoff - positioned based on the rocket image */}
                    {isLaunching && (
                      <div className={`${styles.rocketFlames} ${styles.active}`}>
                        <div className={`${styles.flame} ${styles.flame1}`}></div>
                        <div className={`${styles.flame} ${styles.flame2}`}></div>
                        <div className={`${styles.flame} ${styles.flame3}`}></div>
                      </div>
                    )}
                  </div>
                ) : (
                  letter
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Improved scroll hint positioning */}
        {canLaunch && !isLaunching && (
          <div className={styles.scrollHint}>
            <p>Press SPACE to launch</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroPage;