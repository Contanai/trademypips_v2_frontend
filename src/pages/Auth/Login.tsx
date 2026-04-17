import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/v2/Logo';
import { supabase } from '@/integrations/supabase/client';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }

    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);

    if (signInError) {
      const raw = signInError.message || "Login failed.";
      if (raw.toLowerCase().includes("email not confirmed")) {
        setError("Your email is not verified yet. Check your inbox and click the confirmation link, then login again.");
      } else {
        setError(raw);
      }
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  return (
    <main className="flex min-h-screen w-full bg-background selection:bg-primary-container selection:text-on-primary">
      {/* Left Panel: Visual & Brand Branding */}
      <section className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative overflow-hidden bg-surface-container-lowest">
        {/* Animated Background Element */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container/10 via-transparent to-transparent opacity-50"></div>
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary-container/5 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10">
          <Logo iconSize="text-3xl" textSize="text-2xl" />
          
          <div className="mt-24 max-w-xl">
            <h1 className="font-headline text-5xl font-bold leading-tight tracking-tight text-on-surface">
              Copy trades across accounts — <span className="text-primary-container">effortlessly</span>
            </h1>
            
            <ul className="mt-12 space-y-6">
              {[
                { icon: "bolt", title: "Real-time execution", desc: "Sub-millisecond latency for ultra-fast copying." },
                { icon: "layers", title: "Multi-account management", desc: "Control 50+ accounts from a single master dashboard." },
                { icon: "shield", title: "Secure infrastructure", desc: "Bank-grade encryption for all trade signals." }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary-container">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-on-surface">{item.title}</h3>
                    <p className="text-sm text-on-surface-variant">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dashboard Preview Visual */}
        <div className="relative z-10 mt-12 bg-surface-container rounded-lg p-6 ghost-border blue-glow">
          <img 
            alt="Trading Terminal UI" 
            className="rounded opacity-90" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuApJhoS-cPVgMVhcyNJWexvcjihKUUggIqJSQjnfYceCJFSunr7zv-1Yj39oxdsWZDv-ZE2eynFbMK5GWESdmsEhSvSdJxbyUjfcwKAVHPrxYEOlDbpyNO1ShxbP41b6AlwWhjhcwurFdCIVy74nFki6XdiVT4a0RMeUOczZlsQ_Nwl6gz3KT-7ZBB1tz0ZJul5jShdDStzwrghw8rkS058lK6u2JED3EEM5owRJKzcZ1u-_Ifp7DXAHuCl8zu-uT0Ul2S-HgcQN9w"
          />
          <div className="absolute -right-4 -top-4 px-3 py-1 bg-secondary-container text-on-secondary-container font-mono text-xs rounded-full flex items-center gap-2">
            <span className="w-2 h-2 bg-on-secondary-container rounded-full animate-pulse"></span>
            SYSTEMS ACTIVE
          </div>
        </div>

        <div className="relative z-10 flex gap-8 text-xs font-mono text-on-surface-variant uppercase tracking-widest">
          <span>EST. 2024</span>
          <span>v4.2.0-STABLE</span>
        </div>
      </section>

      {/* Right Panel: Auth Form */}
      <section className="flex flex-col justify-start items-center w-full lg:w-1/2 p-8 pt-16 lg:pt-24 bg-surface overflow-y-auto">
        {/* Mobile Brand Header */}
        <div className="lg:hidden mb-8">
          <Logo iconSize="text-3xl" textSize="text-2xl" />
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="font-headline text-3xl font-bold text-on-surface">Welcome back</h2>
            <p className="text-on-surface-variant mt-2 text-sm">Log in to manage your high-performance trade nodes.</p>
          </div>

          {/* Form Card */}
          <div className="bg-surface-container-low p-8 rounded-xl ghost-border space-y-6">
            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-2" htmlFor="email">Email Address</label>
                <input 
                  className="w-full h-11 bg-surface-container-lowest border-none ring-1 ring-outline-variant/30 focus:ring-primary-container text-on-surface rounded-lg px-4 transition-all duration-200 outline-none" 
                  id="email" 
                  placeholder="operator@kinetic.io" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant" htmlFor="password">Access Token</label>
                  <Link className="text-xs text-primary-container hover:underline" to="/forgot-password">Forgot password?</Link>
                </div>
                <input 
                  className="w-full h-11 bg-surface-container-lowest border-none ring-1 ring-outline-variant/30 focus:ring-primary-container text-on-surface rounded-lg px-4 transition-all duration-200 outline-none" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error ? (
                <p className="text-xs text-[#ffb4ab]">{error}</p>
              ) : null}

              <button 
                className="w-full h-11 bg-primary-container text-on-primary-container font-bold uppercase tracking-widest text-sm rounded-lg hover:brightness-110 active:scale-[0.98] transition-all duration-200 blue-glow" 
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="relative flex items-center justify-center py-2">
              <div className="w-full h-px bg-outline-variant/20"></div>
              <span className="absolute bg-surface-container-low px-4 text-[10px] font-mono text-on-surface-variant uppercase tracking-tighter">OR EXECUTE WITH</span>
            </div>

            <button className="w-full h-11 flex items-center justify-center gap-3 bg-surface-container-lowest border border-outline-variant/30 text-on-surface rounded-lg hover:bg-surface-container transition-colors duration-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span className="text-sm font-medium">Continue with Google</span>
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-on-surface-variant">Don't have an operator account?</span>
            <Link className="text-primary-container font-semibold ml-1 hover:underline" to="/signup">Sign up</Link>
          </div>

          <footer className="pt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-full ghost-border">
              <span className="material-symbols-outlined text-[14px] text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">Your data is secure</span>
            </div>
            <div className="flex gap-4 text-[10px] font-mono text-on-surface-variant uppercase tracking-widest opacity-50">
              <a className="hover:text-on-surface" href="#">Privacy</a>
              <a className="hover:text-on-surface" href="#">Security</a>
              <a className="hover:text-on-surface" href="#">Status</a>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
