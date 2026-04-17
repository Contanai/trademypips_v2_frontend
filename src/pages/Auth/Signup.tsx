import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/v2/Logo';
import { supabase } from '@/integrations/supabase/client';

const SignupPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName || !email || !password) {
      setError("Fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!acceptedTerms) {
      setError("Accept the terms to continue.");
      return;
    }

    setSubmitting(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSuccess("Account created. Check your email to verify before logging in.");
    setTimeout(() => navigate("/login", { replace: true }), 1200);
  };

  return (
    <main className="flex h-screen w-full bg-surface selection:bg-primary-container selection:text-on-primary">
      {/* LEFT PANEL: BRANDING & INFRASTRUCTURE VISUAL */}
      <section className="hidden lg:flex w-1/2 relative bg-surface-container-lowest overflow-hidden items-center justify-center p-12">
        {/* Background Texture Layer */}
        <div 
          className="absolute inset-0 z-0 opacity-20 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDCJnVFFbUTSJRt3AmTttRPbbpbX-j_xyG-bOrh9Of43VEh4_rXWZ8TWWk51c3Sq0o0vxU5c48tMbYZ--eEidP13zvcoLp6gwtxR_c3CfHQAYPM6MqVEv5LeBvrSfGJP71hrELlbksuT6SPlP6pe8i-W9XCpPX5j1C-E4d3x_4D5oDQDuyhgKqWRXvU9rDwTZNsOl7OKxqW2UrImiUL_pKrGULoKXaaT9cOXhkSsrJbve80RYf7oZA1fyYMJxEHFuK8f6o3bjP_57k')" }}
        />
        
        {/* Branding Content */}
        <div className="relative z-10 w-full max-w-lg">
          <div className="flex items-center gap-3 mb-12">
            <Logo iconSize="text-4xl" textSize="text-3xl" />
          </div>
          
          <div className="space-y-8">
            <h2 className="font-headline text-5xl font-bold leading-tight tracking-tight text-on-surface">
              Precision Execution. <br/>
              <span className="text-primary-container">Institutional Grade.</span>
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
              Join the high-frequency ecosystem. Deploy capital with the speed of server-side execution and institutional risk management.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-12">
              <div className="p-4 bg-surface-container-low ghost-border">
                <p className="font-headline text-2xl font-bold text-secondary-container">0.02ms</p>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium">Latency</p>
              </div>
              <div className="p-4 bg-surface-container-low ghost-border">
                <p className="font-headline text-2xl font-bold text-secondary-container">99.9%</p>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium">Uptime</p>
              </div>
            </div>
          </div>
          
          {/* Footer elements inside branding panel */}
          <div className="absolute bottom-12 left-12">
            <p className="font-headline text-[10px] uppercase tracking-[0.2em] text-on-surface-variant opacity-50">
              © 2024 TRADEMYPIPS INFRASTRUCTURE. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -right-24 w-64 h-64 bg-primary-container/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-secondary-container/5 blur-[120px] rounded-full"></div>
      </section>

      {/* RIGHT PANEL: AUTH CARD */}
      <section className="w-full lg:w-1/2 flex flex-col justify-start items-center p-6 sm:p-12 lg:pt-24 bg-surface overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Branding */}
          <div className="lg:hidden mb-8">
            <Logo iconSize="text-3xl" textSize="text-xl" />
          </div>

          <div className="space-y-2">
            <h3 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Create your account</h3>
            <p className="text-on-surface-variant text-sm">Initialize your trading terminal and secure your node.</p>
          </div>

          {/* Signup Form */}
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="name">Full Name</label>
              <input 
                className="w-full bg-surface-container-low ghost-border text-on-surface px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-container/50 transition-all placeholder:text-on-surface/20 text-sm outline-none" 
                id="name" 
                placeholder="John Doe" 
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
              <input 
                className="w-full bg-surface-container-low ghost-border text-on-surface px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-container/50 transition-all placeholder:text-on-surface/20 text-sm outline-none" 
                id="email" 
                placeholder="operator@kinetic.io" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="password">Password</label>
                <input 
                  className="w-full bg-surface-container-low ghost-border text-on-surface px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-container/50 transition-all placeholder:text-on-surface/20 text-sm outline-none" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="confirm-password">Confirm</label>
                <input 
                  className="w-full bg-surface-container-low ghost-border text-on-surface px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-container/50 transition-all placeholder:text-on-surface/20 text-sm outline-none" 
                  id="confirm-password" 
                  placeholder="••••••••" 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input className="w-4 h-4 rounded-sm border-outline-variant bg-surface-container text-primary-container focus:ring-primary-container/30 outline-none" id="terms" type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
              <label className="text-xs text-on-surface-variant" htmlFor="terms">
                I agree to the <a className="text-primary-container hover:underline" href="#">Terms of Service</a> and <a className="text-primary-container hover:underline" href="#">Privacy Policy</a>.
              </label>
            </div>

            {error ? <p className="text-xs text-[#ffb4ab]">{error}</p> : null}
            {success ? <p className="text-xs text-[#27ff97]">{success}</p> : null}

            <button 
              className="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 blue-glow active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 uppercase tracking-widest text-sm" 
              type="submit"
              disabled={submitting}
            >
              {submitting ? "CREATING..." : "CREATE ACCOUNT"}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-outline-variant/10"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">OR CONTINUE WITH</span>
            <div className="flex-grow border-t border-outline-variant/10"></div>
          </div>

          <button className="w-full ghost-border py-4 bg-surface-container-low hover:bg-surface-container text-on-surface font-headline font-medium transition-colors flex items-center justify-center gap-3 text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.24.81-.6z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            GOOGLE ARCHIVE
          </button>

          <p className="text-center text-sm text-on-surface-variant">
            Already have an account? 
            <Link className="text-primary-container font-medium hover:text-primary transition-colors ml-1" to="/login">Login</Link>
          </p>
        </div>
      </section>

      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-container/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-container/5 blur-[150px] rounded-full"></div>
      </div>
    </main>
  );
};

export default SignupPage;
