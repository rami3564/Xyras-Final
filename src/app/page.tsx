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
                color: '#23272f',
                border: '1px solid rgba(35, 39, 47, 0.1)',
                padding: '0.9rem 2.2rem',
                borderRadius: '0.5rem',
                fontWeight: 600,
                fontSize: '1.1rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
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
        minHeight: '85vh',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '4rem 2rem 2rem',
        marginTop: '2rem'
      }}>
        <div className="hero-container" style={{
          maxWidth: '1400px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center'
        }}>
          {/* Left Column - Text Content */}
          <div 
            ref={heroTextRef}
            className="hero-text" 
            style={{ 
              color: '#111'
            }}
          >
            <h1 className="hero-title" style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '900',
              marginBottom: '1.5rem',
              lineHeight: '1.1',
              textAlign: 'left'
            }}>Your Professional Score Shows It All.</h1>
            <p className="hero-subtitle" style={{ 
              textAlign: 'left',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              lineHeight: '1.6',
              marginBottom: '2rem',
              color: '#444950'
            }}>
              Build your professional identity for the future.
            </p>
            
            <div className="hero-cta" style={{
              marginTop: '1.5rem',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%'
            }}>
              <a 
                href="#mission" 
                onClick={scrollToMission}
                style={{
                  color: '#23272f',
                  background: 'transparent',
                  border: '2px solid #23272f',
                  textDecoration: 'none',
                  fontSize: '1.08rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  borderRadius: '0.5rem',
                  padding: '0.85rem 2.2rem',
                  boxShadow: '0 2px 8px rgba(35, 39, 47, 0.06)',
                  transition: 'background 0.3s, color 0.3s, border 0.3s',
                  cursor: 'pointer',
                  letterSpacing: '0.01em',
                  marginLeft: '0',
                }}
              >
                Learn More <span style={{ fontSize: '1.2em', display: 'inline-block', transform: 'translateY(1px)' }}>→</span>
              </a>
            </div>
          </div>

          {/* Right Column - App Preview */}
          <div className="app-preview" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            background: '#fff',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.10)',
            minWidth: '320px',
            minHeight: '320px',
          }}>
            <img 
              src="/assets/image.png" 
              alt="XYRAS Professional Score App Preview" 
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '1rem',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.10)',
                maxHeight: '500px',
                objectFit: 'contain',
                background: '#fff',
                position: 'relative',
                zIndex: 2
              }}
            />
            {/* Beta Progress Announcement under image */}
            <div className="beta-announcement" style={{
              background: '#fff',
              color: '#23272f',
              padding: '1.2rem',
              borderRadius: '1rem',
              marginTop: '1.5rem',
              fontSize: '1rem',
              fontWeight: 500,
              boxShadow: '0 2px 12px rgba(60,60,60,0.06)',
              border: '1px solid #e9ecef',
              maxWidth: '320px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              <div style={{ marginBottom: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.05rem' }}>
                <span role="img" aria-label="rocket">🚀</span> Beta Launch Progress
              </div>
              <div style={{
                background: '#f1f5f9',
                borderRadius: '8px',
                height: '8px',
                marginBottom: '0.5rem',
                width: '100%',
                overflow: 'hidden',
                border: '1px solid #e9ecef'
              }}>
                <div style={{
                  background: 'linear-gradient(90deg, #23272f 0%, #444950 100%)',
                  height: '100%',
                  width: '87%',
                  borderRadius: '8px',
                  transition: 'width 0.6s cubic-bezier(.4,2,.6,1)'
                }}></div>
              </div>
              <div style={{ fontSize: '0.95rem', opacity: 0.8, fontWeight: 500 }}>
                87% complete
              </div>
            </div>
            {/* Badge overlay */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'linear-gradient(135deg, #23272f, #444950)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '2rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              zIndex: 3,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}>
              Beta Preview
            </div>
          </div>
        </div>
      </div>
      {/* Mission section (Introducing the XYRAS Professional Score) */}
      <section id="mission" className="mission-section" style={{ 
        background: '#fff', 
        color: '#111', 
        padding: '7rem 2rem 4rem', /* Increased top padding from 6rem */
        textAlign: 'center',
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
              Introducing the XYRAS Professional Score (XPS)
            </h2>
            <div style={{ 
              textAlign: 'center',
              marginBottom: '3rem'
            }}>
              <p style={{ 
                fontSize: '1.3rem',
                color: '#444950',
                lineHeight: '1.6',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                The first comprehensive system that captures your professional growth, 
                impact, and credibility in a single, dynamic score.
              </p>
            </div>
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
                opacity: 1,
                transform: 'translateY(0)',
                transition: 'all 0.5s ease',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  opacity: 0,
                  transition: 'opacity 0.5s ease',
                  zIndex: 0
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                  <h3 className="mission-card-title" style={{ 
                    fontSize: '1.75rem',
                    fontWeight: '700', 
                    marginBottom: '1rem',
                    color: '#23272f',
                    transition: 'color 0.5s ease'
                  }}>
                    Dynamic Growth
                  </h3>
                  <p className="mission-card-text" style={{ 
                    color: '#444950',
                    fontSize: '1.15rem',
                    lineHeight: '1.6',
                    transition: 'color 0.5s ease'
                  }}>
                    Your XPS evolves as you do. Track skill development, project outcomes, and career milestones in real-time.
                  </p>
                </div>
              </div>
              <div className="mission-card" style={{ 
                padding: '2.5rem',
                borderRadius: '0.75rem', 
                backgroundColor: '#fff',
                boxShadow: '0 2px 16px rgba(60,60,60,0.04)',
                border: '1px solid #eee',
                opacity: 1,
                transform: 'translateY(0)',
                transition: 'all 0.5s ease',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                  opacity: 0,
                  transition: 'opacity 0.5s ease',
                  zIndex: 0
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                  <h3 className="mission-card-title" style={{ 
                    fontSize: '1.75rem',
                    fontWeight: '700', 
                    marginBottom: '1rem',
                    color: '#23272f',
                    transition: 'color 0.5s ease'
                  }}>
                    Verified Impact
                  </h3>
                  <p className="mission-card-text" style={{ 
                    color: '#444950',
                    fontSize: '1.15rem',
                    lineHeight: '1.6',
                    transition: 'color 0.5s ease'
                  }}>
                    Move beyond job titles. Showcase quantifiable contributions and peer-verified achievements that demonstrate real value.
                  </p>
                </div>
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
                  color: '#23272f',
                  border: '1px solid rgba(35, 39, 47, 0.1)',
                  padding: '1rem 2.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}>
                  Get Early Access
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="demo-section" style={{ 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
        color: '#111', 
        padding: '6rem 2rem',
        textAlign: 'center',
        marginTop: '5rem'
      }}>
        <div className="demo-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '800',
            marginBottom: '1rem',
            color: '#23272f'
          }}>
            See Your XPS in Action
          </h2>
          <p style={{ 
            fontSize: '1.2rem',
            color: '#444950',
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem auto'
          }}>
            Watch how your professional identity evolves beyond traditional metrics
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{ 
              background: '#fff',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e9ecef',
              position: 'relative',
              overflow: 'hidden',
              filter: 'blur(6px)',
              opacity: 0.7
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)',
                animation: 'shimmer 2s ease-in-out infinite'
              }}></div>
              <h3 style={{ 
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#23272f'
              }}>
                📊 Growth Tracking
              </h3>
              <p style={{ 
                color: '#444950',
                fontSize: '1rem',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                Track your skill development, project impact, and professional milestones in real-time
              </p>
              <div style={{
                background: '#f8f9fa',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #e9ecef',
                textAlign: 'center'
              }}>
                {/* Metric placeholder intentionally blurred */}
              </div>
            </div>
            
            <div style={{ 
              background: '#fff',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e9ecef',
              position: 'relative',
              overflow: 'hidden',
              filter: 'blur(6px)',
              opacity: 0.7
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #764ba2, #667eea)',
                animation: 'shimmer 2s ease-in-out infinite 0.5s'
              }}></div>
              <h3 style={{ 
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#23272f'
              }}>
                🎯 Impact Measurement
              </h3>
              <p style={{ 
                color: '#444950',
                fontSize: '1rem',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                Quantify your real-world contributions and the value you create for organizations
              </p>
              <div style={{
                background: '#f8f9fa',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #e9ecef',
                textAlign: 'center'
              }}>
                {/* Metric placeholder intentionally blurred */}
              </div>
            </div>
            
            <div style={{ 
              background: '#fff',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e9ecef',
              position: 'relative',
              overflow: 'hidden',
              filter: 'blur(6px)',
              opacity: 0.7
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #f093fb, #f5576c)',
                animation: 'shimmer 2s ease-in-out infinite 1s'
              }}></div>
              <h3 style={{ 
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#23272f'
              }}>
                🤝 Credibility Network
              </h3>
              <p style={{ 
                color: '#444950',
                fontSize: '1rem',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                Build verified professional relationships and peer endorsements that matter
              </p>
              <div style={{
                background: '#f8f9fa',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #e9ecef',
                textAlign: 'center'
              }}>
                {/* Metric placeholder intentionally blurred */}
              </div>
            </div>
          </div>
          {/* Add a single line below the grid of blurred cards */}
          <div style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            color: '#888',
            fontSize: '1.08rem',
            fontWeight: 500,
            letterSpacing: '0.01em'
          }}>
            Join the beta to find out more
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      {/* Interactive Demo Section */}

      {/* FAQ Section */}
      <section className="faq-section" style={{ 
        background: '#f8f9fa', 
        color: '#111', 
        padding: '6rem 2rem',
        textAlign: 'center'
      }}>
        <div className="faq-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '800',
            marginBottom: '1rem',
            color: '#23272f'
          }}>
            Frequently Asked Questions
          </h2>
          <p style={{ 
            fontSize: '1.2rem',
            color: '#444950',
            marginBottom: '4rem'
          }}>
            Everything you need to know about the XYRAS Professional Score
          </p>
          
          <div style={{ textAlign: 'left' }}>
            <div style={{ 
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
              marginBottom: '1.5rem',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ 
                fontSize: '1.3rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#23272f'
              }}>
                🤔 How is XPS different from LinkedIn or traditional resumes?
              </h3>
              <p style={{ 
                color: '#444950',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                While LinkedIn shows your network and resumes list your jobs, XPS measures your actual impact and growth. 
                It tracks verified contributions, peer endorsements, and quantifiable achievements that demonstrate real professional value.
              </p>
            </div>
            
            <div style={{ 
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
              marginBottom: '1.5rem',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ 
                fontSize: '1.3rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#23272f'
              }}>
                📊 How is my XYRAS Professional Score calculated?
              </h3>
              <p style={{ 
                color: '#444950',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                Your XYRAS Professional Score is calculated using multiple factors: project impact, skill development, peer verification, 
                contribution quality, and growth trajectory. Our algorithm weighs real outcomes over titles or tenure.
              </p>
            </div>
            
            <div style={{ 
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
              marginBottom: '1.5rem',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ 
                fontSize: '1.3rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#23272f'
              }}>
                🔒 Is my professional data secure?
              </h3>
              <p style={{ 
                color: '#444950',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                Absolutely. We use enterprise-grade security and only you control what information is shared. Your XPS is calculated from verified, aggregated data without exposing sensitive details.
              </p>
            </div>
            
            <div style={{ 
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
              marginBottom: '1.5rem',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ 
                fontSize: '1.3rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#23272f'
              }}>
                ⏰ When will the beta be available?
              </h3>
              <p style={{ 
                color: '#444950',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                We're launching the beta in phases starting July 2025. Join our waitlist to get priority access and be among the first to build your XYRAS profile.
              </p>
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
