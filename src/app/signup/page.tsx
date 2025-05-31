'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    college: '',
    error: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormState(prev => ({ ...prev, error: '' }));
    
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formState.fullName,
          email: formState.email,
          college: formState.college,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-signup">
        <div className="success-card">
          <div className="success-icon">✨</div>
          <h2 className="text-2xl font-bold mb-4 text-white">Welcome Aboard!</h2>
          <p className="text-gray-200 mb-8">Thanks for joining the waitlist. We'll notify you as soon as we're ready to launch.</p>
          <Link href="/">
            <button className="submit-btn">Return Home</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-signup">
      <Link href="/" className="back-btn">
        ← Back to Home
      </Link>
      
      <div className="signup-card">
        <div className="card-content max-w-md w-full">
          <h1 className="text-3xl font-bold mb-2">Join the Beta</h1>
          <p className="text-gray-400 mb-8">Be among the first to experience the future of professional credibility.</p>
          
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
              <label htmlFor="college" className="form-label">College/University</label>
              <input
                id="college"
                name="college"
                type="text"
                required
                className="form-input"
                value={formState.college}
                onChange={handleChange}
                placeholder="Your institution"
                autoComplete="organization"
              />
            </div>
            
            <div>
              <button 
                type="submit" 
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Get Early Access'}
              </button>
            </div>

            {formState.error && (
              <div className="text-red-500 text-sm mt-2">
                {formState.error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
