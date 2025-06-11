'use client'

import { useState, useEffect, useRef } from "react";
import Link from 'next/link';

// Minimal Animated Logo (no rocket, just 'A')
const AnimatedLogo = () => {
  const letters = ['X', 'Y', 'R', 'A', 'S'];
  return (
    <div className="logo-container flex items-center">
      {letters.map((letter, index) => (
        <span 
          key={index} 
          className="logo-letter"
          style={{ 
            animationDelay: `${index * 0.2 + 0.5}s`,
            animationDuration: '0.5s',
            color: '#111',
            fontWeight: 900,
            fontSize: '1.6rem', /* Added larger font size */
            padding: '0 2px' /* Added small spacing between letters */
          }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
};

export default function HomePage() {
  const [pageTransitioned, setPageTransitioned] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  
  // Refs for animated elements
  const missionRef = useRef<HTMLHeadingElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Check localStorage after mount
  useEffect(() => {
    setIsMounted(true);
    const introData = localStorage.getItem('introData');
    if (introData) {
      try {
        const { timestamp } = JSON.parse(introData);
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        if (Date.now() - timestamp <= thirtyDaysInMs) {
          setPageLoaded(true);
          setPageTransitioned(true);
        }
      } catch (e) {
        console.error('Error parsing introData:', e);
      }
    }
  }, []);
  
  // Set up intersection observer for scroll animations
  useEffect(() => {
    if (!pageLoaded) return;
    
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -10% 0px', // Adjusted to ensure better scroll behavior
      threshold: 0.1, // Lower threshold to trigger earlier
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Set active section for nav highlighting
          if (entry.target.id) {
            setActiveSection(entry.target.id);
          }
        } else {
          // If it's the mission title, remove animation when not in viewport
          if (entry.target === missionRef.current) {
            entry.target.classList.remove('animate-in');
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe mission title - ensure it only appears on scroll
    if (missionRef.current) {
      observer.observe(missionRef.current);
    }
    
    // Observe other elements
    const animatedElements = document.querySelectorAll('.mission-card, .mission-cta');
    animatedElements.forEach(el => observer.observe(el));
    
    if (heroTextRef.current) {
      observer.observe(heroTextRef.current);
    }
    
    // Observe sections for nav highlighting
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      observer.disconnect();
    };
  }, [pageLoaded]);
  
  // Handle scroll for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsNavSticky(true);
      } else {
        setIsNavSticky(false);
      }

      // Control mission title visibility
      if (missionRef.current) {
        const missionRect = missionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Only show title when it's in the viewport and user has scrolled to it
        if (missionRect.top < windowHeight * 0.75 && window.scrollY > windowHeight * 0.3) {
          missionRef.current.classList.add('animate-in');
        } else {
          missionRef.current.classList.remove('animate-in');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Smooth scroll to mission section
  const scrollToMission = (e: React.MouseEvent) => {
    e.preventDefault();
    const missionSection = document.getElementById('mission');
    if (missionSection) {
      missionSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Don't render anything until after client-side hydration
  if (!isMounted) {
    return null;
  }

  return (
    <div style={{ background: '#fff', color: '#23272f', minHeight: '100vh' }}>
      {/* Navigation bar */}
      <nav 
        ref={navRef}
        className={isNavSticky ? 'sticky' : ''}
        style={{ 
          background: '#fff', 
          borderBottom: isNavSticky ? '1px solid #eee' : 'none', 
          padding: '1.2rem 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: isNavSticky ? '0 2px 16px rgba(60,60,60,0.04)' : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        <div className="nav-container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <AnimatedLogo />
          <div className="nav-links" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.5rem'
          }}>
            <a 
              href="#mission" 
              className={`nav-link ${activeSection === 'mission' ? 'active' : ''}`} 
              onClick={scrollToMission} 
              style={{ 
                color: activeSection === 'mission' ? '#000' : '#23272f',
                textDecoration: 'none',
                fontWeight: activeSection === 'mission' ? 600 : 500,
                fontSize: '1.1rem'
              }}
            >
              Mission
            </a>
            <Link href="/signup">
              <button className="btn btn-secondary" style={{ 
                background: '#fff',
                color: '#23272f',
                border: '2px solid #23272f',
                padding: '0.9rem 2.2rem',
                borderRadius: '0.5rem',
                fontWeight: 600,
                fontSize: '1.1rem',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}>
                Join BETA
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main hero content */}
      <div className="hero-content" style={{ 
        background: '#fff', 
        color: '#111', 
        minHeight: '80vh', /* Increased from 75vh */
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center',
        padding: '4rem 1rem 2rem', /* Increased top padding from 3rem */
        marginTop: '3rem' /* Increased from 2rem */
      }}>
        <div 
          ref={heroTextRef}
          className="hero-text" 
          style={{ 
            color: '#111', 
            maxWidth: '900px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <h1 className="hero-title" style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: '900',
            marginBottom: '1.5rem',
            lineHeight: '1.1'
          }}>Professional Identity, Reimagined.</h1>
          <p className="hero-subtitle" style={{ 
            textAlign: 'center', 
            width: '100%',
            fontSize: 'clamp(1.3rem, 3vw, 2rem)',
            lineHeight: '1.4',
            marginBottom: '1rem'
          }}>
            Build professional credibility that <strong>breathes with <span style={{ color: '#23272f' }}>YOU.</span></strong>
          </p>
          <div className="hero-cta" style={{ 
            marginTop: '2.8rem', /* Increased from 2.5rem */
            display: 'flex', 
            justifyContent: 'center', 
            width: '100%', 
            visibility: 'visible'
          }}>
            <Link href="/signup">
              <button
                className="btn btn-primary"
                style={{
                  background: '#fff',
                  color: '#23272f',
                  border: '2px solid #23272f',
                  padding: '1rem 2.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  letterSpacing: '0.5px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                Join our waitlist
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mission section */}
      <section id="mission" className="mission-section" style={{ 
        background: '#fff', 
        color: '#111', 
        padding: '7rem 2rem 4rem', /* Increased top padding from 6rem */
        textAlign: 'center',
        marginTop: '22vh', /* Increased from 18vh */
        scrollMarginTop: '120px', /* Increased from 100px */
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="mission-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="mission-content">
            <h2 
              ref={missionRef} 
              className="mission-title" 
              style={{ 
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                fontWeight: '800',
                marginBottom: '3rem',
                color: '#23272f',
                lineHeight: '1.2',
                opacity: 0, /* Start hidden */
                transform: 'translateY(30px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                position: 'relative'
              }}
            >
              Empowering professionals to showcase real impact and growth in the digital age.
            </h2>
            <div className="mission-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              marginBottom: '2.5rem'
            }}>
              <div className="mission-card" style={{ 
                padding: '2.5rem',
                borderRadius: '0.75rem', 
                backgroundColor: '#fff',
                boxShadow: '0 2px 16px rgba(60,60,60,0.04)',
                border: '1px solid #eee',
                opacity: 1, /* Changed from 0 to 1 */
                transform: 'translateY(0)', /* Changed from translateY(20px) */
                transition: 'box-shadow 0.3s ease, transform 0.3s ease'
              }}>
                <h3 className="mission-card-title" style={{ 
                  fontSize: '1.75rem',
                  fontWeight: '700', 
                  marginBottom: '1rem',
                  color: '#23272f'
                }}>
                  Our Vision
                </h3>
                <p className="mission-card-text" style={{ 
                  color: '#444950',
                  fontSize: '1.15rem',
                  lineHeight: '1.6'
                }}>
                  XYRAS is redefining how professional credibility is earned, tracked, and shared in the digital age.
                </p>
              </div>
              <div className="mission-card" style={{ 
                padding: '2.5rem',
                borderRadius: '0.75rem', 
                backgroundColor: '#fff',
                boxShadow: '0 2px 16px rgba(60,60,60,0.04)',
                border: '1px solid #eee',
                opacity: 1, /* Changed from 0 to 1 */
                transform: 'translateY(0)', /* Changed from translateY(20px) */
                transition: 'box-shadow 0.3s ease, transform 0.3s ease'
              }}>
                <h3 className="mission-card-title" style={{ 
                  fontSize: '1.75rem',
                  fontWeight: '700', 
                  marginBottom: '1rem',
                  color: '#23272f'
                }}>
                  Our Focus
                </h3>
                <p className="mission-card-text" style={{ 
                  color: '#444950',
                  fontSize: '1.15rem',
                  lineHeight: '1.6'
                }}>
                  We focus on what you've built, how you've grown, and the value you bring — not just where you've worked.
                </p>
              </div>
            </div>
            <div className="mission-cta" style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginTop: '3rem',
              opacity: 1, /* Changed from 0 to 1 */
              transform: 'translateY(0)', /* Changed from translateY(20px) */
              transition: 'transform 0.3s ease'
            }}>
              <Link href="/signup">
                <button className="btn btn-primary" style={{ 
                  background: '#fff',
                  color: '#23272f',
                  border: '2px solid #23272f',
                  padding: '1rem 2.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  Start Your Journey
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer style={{ 
        background: '#fff', 
        borderTop: '1px solid #eee',
        padding: '2rem', /* Reduced from 3rem for better match with header */
        textAlign: 'center',
        color: '#444950',
        boxShadow: '0 -2px 16px rgba(60,60,60,0.04)' /* Added shadow to match header */
      }}>
        <div className="footer-container" style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ marginBottom: '1.8rem' }}>
            <AnimatedLogo />
          </div>
          
          <div className="footer-links" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2.5rem', /* Increased from 2rem to match header */
            marginBottom: '2rem'
          }}>
            <a 
              href="https://www.linkedin.com/company/xyras/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#23272f',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="#23272f"
                style={{ transition: 'all 0.3s ease' }}
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn
            </a>
            
            <a 
              href="#mission" 
              onClick={scrollToMission}
              className="nav-link"
              style={{
                color: '#23272f',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '1.1rem',
                position: 'relative',
                transition: 'color 0.3s ease'
              }}
            >
              Mission
            </a>
          </div>
          
          <p style={{ 
            fontSize: '1rem', 
            marginTop: '1rem',
            color: '#666' 
          }}>
            © {new Date().getFullYear()} XYRAS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
