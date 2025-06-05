'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Animated Logo component (matching home page)
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
            fontSize: '1.6rem', /* Increased size */
            padding: '0 2px' /* Added small spacing between letters */
          }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SignupPage() {
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    aboutYou: '',
    error: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isNavSticky, setIsNavSticky] = useState(false);

  // Handle scroll for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsNavSticky(true);
      } else {
        setIsNavSticky(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormState(prev => ({ ...prev, error: '' }));
    
    try {
      const { fullName, email, aboutYou } = formState;
      const { error } = await supabase
        .from('waitlist')
        .insert([{ full_name: fullName, email, about_you: aboutYou }]);
      
      if (error) {
        throw new Error(error.message);
      }

      setIsSuccess(true);
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to submit form'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSuccess) {
    return (
      <div style={{ background: '#fff', color: '#23272f', minHeight: '100vh' }}>
        {/* Navigation bar */}
        <nav className={isNavSticky ? 'sticky' : ''} style={{ 
          background: '#fff', 
          borderBottom: isNavSticky ? '1px solid #eee' : 'none', 
          padding: '1.2rem 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: isNavSticky ? '0 2px 16px rgba(60,60,60,0.04)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <div className="nav-container" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <AnimatedLogo />
            </Link>
            <div className="nav-links" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2.5rem' /* Increased from 2rem to match main page */
            }}>
              <Link href="/#mission" className="nav-link" style={{ 
                color: '#23272f',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '1.1rem',
                position: 'relative',
                transition: 'color 0.3s ease'
              }}>
                Mission
              </Link>
            </div>
          </div>
        </nav>
        
        <div className="flex items-center justify-center" style={{ 
          height: 'calc(100vh - 90px)',
          padding: '3rem 2rem', /* Increased top padding */
          marginTop: '1.5rem' /* Added margin to move down content */
        }}>
          <div className="success-card" style={{
            maxWidth: '550px',
            width: '100%',
            textAlign: 'center',
            padding: '3.5rem 2rem',
            animation: 'fadeInSuccess 0.8s ease-out',
            boxShadow: '0 2px 16px rgba(60,60,60,0.04)', /* Added shadow to match card style */
            border: '1px solid #eee', /* Added border to match card style */
            borderRadius: '0.75rem' /* Added border radius to match card style */
          }}>
            <div className="success-icon" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✨</div>
            <h2 className="hero-title text-2xl font-bold mb-4" style={{ 
              color: '#23272f',
              fontSize: '2.4rem',
              marginBottom: '1.2rem'
            }}>Welcome Aboard!</h2>
            <p className="hero-subtitle mb-8" style={{ 
              color: '#444950',
              fontSize: '1.3rem',
              lineHeight: '1.5',
              marginBottom: '2rem'
            }}>Thanks for joining the waitlist. We'll notify you as soon as we're ready to launch.</p>
            <Link href="/">
              <button className="btn submit-btn" style={{ 
                background: '#fff',
                color: '#23272f',
                border: '2px solid #23272f',
                padding: '1rem 2.5rem',
                borderRadius: '0.5rem',
                fontWeight: 600,
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                width: 'auto',
                display: 'inline-block',
                transition: 'all 0.3s ease',
                fontSize: '1.2rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                Return Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', color: '#23272f', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation bar */}
      <nav className={isNavSticky ? 'sticky' : ''} style={{ 
        background: '#fff', 
        borderBottom: isNavSticky ? '1px solid #eee' : 'none', 
        padding: '1.2rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: isNavSticky ? '0 2px 16px rgba(60,60,60,0.04)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div className="nav-container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <AnimatedLogo />
          </Link>
          <div className="nav-links" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.5rem' /* Increased from 2rem to match main page */
          }}>
            <Link href="/#mission" className="nav-link" style={{ 
              color: '#23272f',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '1.1rem',
              position: 'relative',
              transition: 'color 0.3s ease'
            }}>
              Mission
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="flex items-center justify-center" style={{ 
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem', /* Increased padding from 2rem to 3rem */
        marginTop: '2rem' /* Added margin to move content down */
      }}>
        <div className="signup-card" style={{
          maxWidth: '550px',
          width: '100%',
          animation: 'fadeInUp 0.8s ease-out',
          padding: '2.5rem', /* Added padding */
          boxShadow: '0 2px 16px rgba(60,60,60,0.04)', /* Added shadow to match card style */
          border: '1px solid #eee', /* Added border to match card style */
          borderRadius: '0.75rem' /* Added border radius to match card style */
        }}>
          <div className="card-content w-full">
            <h1 className="hero-title text-3xl font-bold mb-3" style={{ 
              color: '#23272f',
              fontSize: '2.2rem',
              marginBottom: '1rem',
              fontWeight: '800'
            }}>Join the Beta</h1>
            <p className="hero-subtitle mb-6" style={{ 
              color: '#444950',
              fontSize: '1.2rem',
              lineHeight: '1.5',
              marginBottom: '2rem'
            }}>Be among the first to experience the future of professional credibility.</p>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}> {/* Increased from 1.2rem */}
                <label htmlFor="fullName" className="form-label" style={{ 
                  fontSize: '1.1rem', 
                  marginBottom: '0.5rem', 
                  display: 'block', 
                  textAlign: 'left',
                  fontWeight: 600, /* Added font weight */
                  color: '#23272f' /* Matching text color */
                }}>Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formState.fullName}
                  onChange={handleChange}
                  className="form-input"
                  style={{ 
                    width: '100%', 
                    padding: '1rem', /* Increased from 0.9rem */
                    borderRadius: '0.5rem',
                    border: '1px solid #ddd',
                    fontSize: '1.1rem',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}> {/* Increased from 1.2rem */}
                <label htmlFor="email" className="form-label" style={{ 
                  fontSize: '1.1rem', 
                  marginBottom: '0.5rem', 
                  display: 'block', 
                  textAlign: 'left',
                  fontWeight: 600, /* Added font weight */
                  color: '#23272f' /* Matching text color */
                }}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formState.email}
                  onChange={handleChange}
                  className="form-input"
                  style={{ 
                    width: '100%', 
                    padding: '1rem', /* Increased from 0.9rem */
                    borderRadius: '0.5rem',
                    border: '1px solid #ddd',
                    fontSize: '1.1rem',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '2rem' }}> {/* Increased from 1.5rem */}
                <label htmlFor="aboutYou" className="form-label" style={{ 
                  fontSize: '1.1rem', 
                  marginBottom: '0.5rem', 
                  display: 'block', 
                  textAlign: 'left',
                  fontWeight: 600, /* Added font weight */
                  color: '#23272f' /* Matching text color */
                }}>Tell us about you (optional)</label>
                <textarea
                  id="aboutYou"
                  name="aboutYou"
                  value={formState.aboutYou}
                  onChange={handleChange}
                  className="form-input"
                  style={{ 
                    width: '100%', 
                    padding: '1rem', /* Increased from 0.9rem */
                    borderRadius: '0.5rem',
                    border: '1px solid #ddd',
                    fontSize: '1.1rem',
                    minHeight: '120px', /* Increased from 100px */
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>
              
              {formState.error && (
                <div className="error-message" style={{ 
                  color: '#e53e3e', 
                  marginBottom: '1.5rem', /* Increased from 1rem */
                  fontSize: '1.05rem',
                  backgroundColor: 'rgba(229,62,62,0.1)',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem'
                }}>
                  {formState.error}
                </div>
              )}
              
              <button 
                type="submit" 
                className="btn submit-btn" 
                disabled={isSubmitting}
                style={{ 
                  width: '100%', 
                  padding: '1rem',
                  backgroundColor: '#fff',
                  color: '#23272f',
                  border: '2px solid #23272f',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Simple Footer */}
      <footer style={{ 
        background: '#fff', 
        borderTop: '1px solid #eee',
        padding: '2rem',
        textAlign: 'center',
        color: '#444950',
        marginTop: 'auto',
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
            gap: '2.5rem',
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
            
            <Link href="/#mission" className="nav-link" style={{
              color: '#23272f',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '1.1rem',
              position: 'relative',
              transition: 'color 0.3s ease'
            }}>
              Mission
            </Link>
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
