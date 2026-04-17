import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/v2/Logo';
import { supabase } from '@/integrations/supabase/client';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Enter your account email.");
      return;
    }

    setSubmitting(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dashboard/settings`,
    });
    setSubmitting(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSuccess("Recovery email sent. Check your inbox.");
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row h-screen w-full bg-surface selection:bg-primary-container selection:text-on-primary-container overflow-hidden">
      {/* Left Branding Panel */}
      <section className="relative hidden md:flex md:w-1/2 lg:w-3/5 bg-surface-container-lowest overflow-hidden flex-col justify-between p-12">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover opacity-20 grayscale brightness-50" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_XUt_tGoQrdDaEEJM3QJqLuOiBUb_HboR2okC_CUEvhZKl7I2s79AogzQdFilnlraDf8RtqZxawKUsa883_r1oKkwY7fTUzZUcL_47G8KckH0IRslzPHqgd7H1qAOzFFYz7yVDMCTLajxv5lSjDjOh-2z8Ex2-fcxBO13uTH7Br4YFg8ZIz3Bii1h8O4rM7-ky9xVLI6j9JXuI3TVVABRalx5vEEctU9acH4feHHJwrNPKyvUHtgLwMq1DdnmCAj8-o7yktPrgAM" 
            alt="Abstract architectural infrastructure"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-surface via-transparent to-primary-container/5"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <Logo iconSize="text-3xl" textSize="text-2xl" />
        </div>
        
        <div className="relative z-10 mt-auto">
          <h1 className="font-headline text-5xl lg:text-7xl font-bold tracking-tighter text-on-surface leading-none mb-6">
            INSTITUTIONAL <br/>
            <span className="text-primary-container">RECOVERY.</span>
          </h1>
          <p className="max-w-md text-on-surface-variant text-lg font-light leading-relaxed">
            Securely regain access to your high-frequency trading infrastructure through our encrypted recovery protocol.
          </p>
          <div className="mt-12 flex gap-8">
            <div className="flex flex-col">
              <span className="font-headline text-primary-container text-2xl font-bold leading-none">0.2ms</span>
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-2">Execution Latency</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label text-primary-container text-2xl font-bold leading-none uppercase">AES-256</span>
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-2">End-to-End Vault</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Auth Card Section */}
      <section className="flex-1 flex flex-col justify-start items-center p-6 md:p-12 lg:p-24 pt-20 md:pt-32 bg-surface overflow-y-auto">
        {/* Mobile Branding Header */}
        <div className="md:hidden mb-12">
          <Logo iconSize="text-2xl" textSize="text-xl" />
        </div>

        <div className="w-full max-w-md space-y-8">
          <header className="space-y-3">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">Reset your password</h2>
            <p className="text-on-surface-variant font-light text-sm">Enter your email and we'll send you a recovery link to access your infrastructure.</p>
          </header>

          <form className="space-y-6" onSubmit={onSubmit}>
            {/* Email Input */}
            <div className="space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant" htmlFor="email">Infrastructure ID (Email)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary-container transition-colors">
                  <span className="material-symbols-outlined text-lg">alternate_email</span>
                </div>
                <input 
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-sm py-3.5 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary-container/50 focus:border-primary-container/50 transition-all font-body text-sm outline-none" 
                  id="email" 
                  placeholder="name@terminal.access" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {error ? <p className="text-xs text-[#ffb4ab]">{error}</p> : null}
            {success ? <p className="text-xs text-[#27ff97]">{success}</p> : null}

            {/* Reset Button */}
            <button 
              className="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-sm flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.98] blue-glow uppercase tracking-widest text-sm" 
              type="submit"
              disabled={submitting}
            >
              <span>{submitting ? "Sending..." : "Send Reset Link"}</span>
              <span className="material-symbols-outlined text-xl">keyboard_double_arrow_right</span>
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-6 border-t border-outline-variant/10 flex flex-col items-center gap-4">
            <Link className="flex items-center gap-2 text-on-surface-variant hover:text-primary-container transition-colors group" to="/login">
              <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
              <span className="font-label text-xs uppercase tracking-widest">Back to login</span>
            </Link>
          </div>
        </div>

        {/* Terminal Visual Utility (Subtle) */}
        <div className="absolute bottom-8 right-8 hidden lg:block opacity-20">
          <div className="flex items-center gap-2 font-mono text-[10px] text-on-surface-variant uppercase tracking-tighter">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary-container"></div>
            <span>Auth Terminal Connected</span>
            <span className="ml-4">PID: 4882</span>
          </div>
        </div>
      </section>

      {/* Footer Overlay Component */}
      <footer className="w-full py-6 absolute bottom-0 left-0 bg-transparent px-12 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center opacity-40">
          <div className="flex gap-8">
            <a className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors" href="#">Security</a>
            <a className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors" href="#">Privacy</a>
          </div>
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">© 2024 TRADEMYPIPS INFRASTRUCTURE. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </main>
  );
};

export default ForgotPasswordPage;
