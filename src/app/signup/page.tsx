'use client';

import { useState } from 'react';
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
            fontWeight: 900
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
            <Link href="/" style={{ textDecoration: 'none' }}>
              <AnimatedLogo />
            </Link>
          </div>
        </nav>
        
        <div className="flex items-center justify-center" style={{ 
          height: 'calc(100vh - 80px)',
          padding: '2rem'
        }}>
          <div className="success-card" style={{
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center'
          }}>
            <div className="success-icon">✨</div>
            <h2 className="hero-title text-2xl font-bold mb-4" style={{ color: '#23272f' }}>Welcome Aboard!</h2>
            <p className="hero-subtitle mb-8" style={{ color: '#444950' }}>Thanks for joining the waitlist. We'll notify you as soon as we're ready to launch.</p>
            <Link href="/">
              <button className="submit-btn" style={{ 
                background: '#fff',
                color: '#23272f',
                border: '2px solid #23272f',
                padding: '0.9rem 2.2rem',
                borderRadius: '0.5rem',
                fontWeight: 600,
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                width: 'auto',
                display: 'inline-block',
                transition: 'all 0.3s ease'
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
          <Link href="/" style={{ textDecoration: 'none' }}>
            <AnimatedLogo />
          </Link>
          <div className="nav-links" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <Link href="/#mission" style={{ 
              color: '#23272f',
              textDecoration: 'none',
              fontWeight: 500
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
        padding: '2rem'
      }}>
        <div className="signup-card" style={{
          maxWidth: '500px',
          width: '100%'
        }}>
          <div className="card-content w-full">
            <h1 className="hero-title text-3xl font-bold mb-2" style={{ color: '#23272f' }}>Join the Beta</h1>
            <p className="hero-subtitle mb-8" style={{ color: '#444950' }}>Be among the first to experience the future of professional credibility.</p>
            
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="form-input"
                  value={formState.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="form-input"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  autoComplete="email"
                />
              </div>
              
              <div>
                <label htmlFor="aboutYou" className="form-label">About You</label>
                <input
                  id="aboutYou"
                  name="aboutYou"
                  type="text"
                  required
                  className="form-input"
                  value={formState.aboutYou}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  autoComplete="off"
                />
              </div>
              
              <div>
                <button 
                  type="submit" 
                  className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
                  style={{ 
                    background: '#fff',
                    color: '#23272f',
                    border: '2px solid #23272f',
                    padding: '0.9rem 2.2rem',
                    borderRadius: '0.5rem',
                    fontWeight: 600,
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    textTransform: 'none',
                    letterSpacing: '0.5px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Get Early Access'}
                </button>
              </div>

              {formState.error && (
                <div style={{ 
                  color: '#e53e3e', 
                  fontSize: '0.875rem', 
                  marginTop: '0.75rem',
                  padding: '0.5rem',
                  backgroundColor: 'rgba(229, 62, 62, 0.1)',
                  borderRadius: '0.375rem',
                  textAlign: 'center'
                }}>
                  {formState.error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
