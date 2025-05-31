import astronautLogo from './assets/AstronautLogo.svg';
'use client'

import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import IntroPage from './IntroPage';

// Get Early Access button component (inside the astronaut helmet)
const HelmetButton = () => {
  return (
    <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
      <Link href="/signup">
        <button className="helmet-cta-btn">
          Get Early Access
        </button>
      </Link>
    </div>
  );
};

// Animated XYRAS logo with rocket for the navigation
const AnimatedLogo = ({ rocketLanded = false }: { rocketLanded?: boolean }) => {
  const letters = ['X', 'Y', 'R', 'rocket', 'S'];
  
  return (
    <div className="logo-container flex items-center">
      {letters.map((letter, index) => (
        <span 
          key={index} 
          className={`logo-letter ${letter === 'rocket' ? 'rocket-letter' : ''}`}
          style={{ 
            animationDelay: `${index * 0.2 + 0.5}s`,
            animationDuration: '0.5s'
          }}
        >
          {letter === 'rocket' ? (
            <div className="rocket-wrapper">
              <img 
                src="/assets/xyras-rocket.png"
                alt="Rocket"
                width="32" 
                height="32" 
                className={`inline-block ${rocketLanded ? 'rocket-landing' : ''}`}
              />
              {rocketLanded && (
                <div className="rocket-flame-nav">
                  <div className="flame-nav flame-nav1"></div>
                  <div className="flame-nav flame-nav2"></div>
                </div>
              )}
            </div>
          ) : (
            letter
          )}
        </span>
      ))}
    </div>
  );
};

// Enhanced Astronaut component using imported SVG
const AstronautLogo = () => (
  <div className="astronaut-wrapper">
    <div className="helmet-glow"></div>
    <img 
      src="/assets/AstronautLogo.svg"
      alt="Astronaut Helmet"
      className="astronaut-image animate-float"
      width="600"
      height="600"
    />
    {/* Removed helmet-accents for no color hue animation */}
    <div className="helmet-text-overlay">
      <div className="launching-text">Launching soon<span className="dot-animation">...</span></div>
    </div>
  </div>
);

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
  const [rocketLanded, setRocketLanded] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Refs for animated elements
  const missionRef = useRef<HTMLHeadingElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  
  // Set up intersection observer for scroll animations
  useEffect(() => {
    if (!pageLoaded) return;
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe elements
    if (missionRef.current) {
      observer.observe(missionRef.current);
    }
    
    const animatedElements = document.querySelectorAll('.mission-card, .mission-cta, .hero-title, .hero-subtitle');
    animatedElements.forEach(el => observer.observe(el));
    
    if (heroTextRef.current) {
      observer.observe(heroTextRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [pageLoaded]);
  
  const handleIntroComplete = () => {
    setIsTransitioning(true);
    
    // Quick transition for smooth UX
    setTimeout(() => {
      setShowIntro(false);
      setPageLoaded(true);
      
      // Small delay for rocket landing animation
      setTimeout(() => {
        setRocketLanded(true);
        setIsTransitioning(false);
      }, 400);
    }, 50);
  };

  // Show intro page first
  if (showIntro) {
    return <IntroPage onComplete={handleIntroComplete} />;
  }

  return (
    <div className={`font-sans main-page ${pageLoaded ? 'page-loaded' : ''} ${isTransitioning ? 'transitioning' : ''}`}>
      {/* Hero section with space background */}
      <section className="hero-section">
        {/* Enhanced space background for smooth transition */}
        <div className="section-gradient-bg-enhanced">
          <div className="stars-small"></div>
          <div className="stars-medium"></div>
          <div className="deep-stars"></div>
          <div className="twinkling-stars"></div>
          <div className="glowing-stars"></div>
          
          {/* Reduced number of shooting stars that appear randomly */}
          <div className="shooting-stars">
            <div className="shooting-star" style={{"--rotation": "15deg"} as React.CSSProperties}></div>
            <div className="shooting-star" style={{"--rotation": "-20deg"} as React.CSSProperties}></div>
            <div className="shooting-star" style={{"--rotation": "30deg"} as React.CSSProperties}></div>
          </div>
        </div>
        
        {/* Navigation bar */}
        <nav className="hero-nav">
          <div className="nav-container">
            <AnimatedLogo rocketLanded={rocketLanded} />
            <div className="nav-links">
              <a href="#mission" className="nav-link">Mission</a>
              <Link href="/signup">
                <button className="btn btn-cyan">Join BETA</button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Main hero content */}
        <div className="hero-content">
          {/* Left side - text content */}
          <div className="hero-text scroll-animate" ref={heroTextRef}>
            <h1 className="hero-title animate-item">Professional Identity, Reimagined.</h1>
            <p className="hero-subtitle animate-item">
              Build professional credibility that <br />
              <strong>breathes with <span className="hero-emphasis">YOU.</span></strong>
            </p>
            <div className="hero-cta animate-item flex justify-center">
              <Link href="/signup">
                <button className="helmet-cta-btn">Get Early Access</button>
              </Link>
            </div>
          </div>

          {/* Right side - Large astronaut helmet */}
          <div className="astronaut-container">
            <AstronautLogo />
          </div>
        </div>
      </section>
      
      {/* Mission section */}
      <section id="mission" className="mission-section">
        <div className="section-gradient-bg-3">
          <div className="stars-small"></div>
          <div className="stars-medium"></div>
        </div>
        
        <div className="mission-container">
          <div className="mission-content">
            <h2 className="mission-title scroll-animate" ref={missionRef}>
              Empowering professionals to showcase real impact and growth in the digital age.
            </h2>
            
            <div className="mission-grid">
              <div className="mission-card scroll-animate">
                <h3 className="mission-card-title">Our Vision</h3>
                <p className="mission-card-text">
                  XYRAS is redefining how professional credibility is earned, tracked, and shared in the digital age.
                </p>
              </div>
              
              <div className="mission-card scroll-animate">
                <h3 className="mission-card-title">Our Focus</h3>
                <p className="mission-card-text">
                  We focus on what you've built, how you've grown, and the value you bring — not just where you've worked.
                </p>
              </div>
            </div>
            
            <div className="mission-cta scroll-animate">
              <Link href="/signup">
                <button className="mission-cta-btn">
                  Start Your Journey
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
