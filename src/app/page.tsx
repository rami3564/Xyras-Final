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
            fontWeight: 900
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
  
  // Refs for animated elements
  const missionRef = useRef<HTMLHeadingElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

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
  
  // Don't render anything until after client-side hydration
  if (!isMounted) {
    return null;
  }

  return (
    <div style={{ background: '#fff', color: '#23272f', minHeight: '100vh' }}>
      {/* Navigation bar */}
      <nav style={{ 
        background: '#fff', 
        borderBottom: '1px solid #eee', 
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 16px rgba(60,60,60,0.04)'
      }}>
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
            gap: '2rem'
          }}>
            <a href="#mission" className="nav-link" style={{ 
              color: '#23272f',
              textDecoration: 'none',
              fontWeight: 500
            }}>Mission</a>
            <Link href="/signup">
              <button className="btn btn-secondary" style={{ 
                background: '#fff',
                color: '#23272f',
                border: '2px solid #23272f',
                padding: '0.9rem 2.2rem',
                borderRadius: '0.5rem',
                fontWeight: 600,
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
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
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center' 
      }}>
        <div className="hero-text" style={{ 
          color: '#111', 
          maxWidth: '800px', 
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h1 className="hero-title">Professional Identity, Reimagined.</h1>
          <p className="hero-subtitle" style={{ textAlign: 'center', width: '100%' }}>
            Build professional credibility that <strong>breathes with <span style={{ color: '#23272f' }}>YOU.</span></strong>
          </p>
          <div className="hero-cta" style={{ 
            marginTop: '2rem', 
            display: 'flex', 
            justifyContent: 'center', 
            width: '100%', 
            visibility: 'visible' // Ensure visibility
          }}>
            <Link href="/signup">
              <button
                className="btn btn-primary"
                style={{
                  background: '#fff !important',
                  color: '#23272f !important',
                  border: '2px solid #23272f !important',
                  padding: '0.9rem 2.2rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  letterSpacing: '0.5px',
                }}
              >
                Join our waitlist
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mission section */}
      <section className="mission-section" style={{ 
        background: '#fff', 
        color: '#111', 
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div className="mission-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="mission-content">
            <h2 className="mission-title" style={{ 
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '800',
              marginBottom: '3rem',
              color: '#23272f' 
            }}>
              Empowering professionals to showcase real impact and growth in the digital age.
            </h2>
            <div className="mission-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem',
              marginBottom: '3rem' 
            }}>
              <div className="mission-card" style={{ 
                padding: '2rem', 
                borderRadius: '0.75rem', 
                backgroundColor: '#fff',
                boxShadow: '0 2px 16px rgba(60,60,60,0.04)',
                border: '1px solid #eee'
              }}>
                <h3 className="mission-card-title" style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  marginBottom: '1rem',
                  color: '#23272f'
                }}>
                  Our Vision
                </h3>
                <p className="mission-card-text" style={{ color: '#444950' }}>
                  XYRAS is redefining how professional credibility is earned, tracked, and shared in the digital age.
                </p>
              </div>
              <div className="mission-card" style={{ 
                padding: '2rem', 
                borderRadius: '0.75rem', 
                backgroundColor: '#fff',
                boxShadow: '0 2px 16px rgba(60,60,60,0.04)',
                border: '1px solid #eee'
              }}>
                <h3 className="mission-card-title" style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  marginBottom: '1rem',
                  color: '#23272f'
                }}>
                  Our Focus
                </h3>
                <p className="mission-card-text" style={{ color: '#444950' }}>
                  We focus on what you've built, how you've grown, and the value you bring — not just where you've worked.
                </p>
              </div>
            </div>
            <div className="mission-cta" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <Link href="/signup">
                <button className="btn btn-primary" style={{ 
                  background: '#fff',
                  color: '#23272f',
                  border: '2px solid #23272f',
                  padding: '0.9rem 2.2rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
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
        padding: '2rem',
        textAlign: 'center',
        color: '#444950'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1rem' }}>
            <AnimatedLogo />
          </div>
          <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
            © {new Date().getFullYear()} XYRAS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
