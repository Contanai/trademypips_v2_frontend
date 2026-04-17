import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-[calc(100svh-env(safe-area-inset-top,0px))] lg:min-h-[calc(100vh-env(safe-area-inset-top,0px))] flex items-center overflow-visible lg:overflow-hidden px-8 pt-[calc(env(safe-area-inset-top,0px)+5rem)] pb-10 lg:pb-0">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="z-10">
          <h1 className="font-headline text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
            Copy Trades Across Accounts <span className="text-primary-container">In Real Time.</span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
            Connect MT4/MT5 accounts and execute trades across multiple accounts with millisecond precision. No EAs. No manual setup.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link className="px-8 py-4 bg-primary-container text-on-primary font-headline font-bold text-lg blue-glow active:scale-95 transition-all text-center" to="/signup">Get Started Now</Link>
            <button className="px-8 py-4 border border-outline-variant/30 text-primary font-headline font-bold text-lg hover:bg-white/5 active:scale-95 transition-all">View Live Demo</button>
          </div>
        </div>
        <div className="relative h-[500px] hidden lg:block">
          {/* Trade Flow UI Representation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full bg-surface-container-low p-6 rounded-lg ghost-border overflow-hidden">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary-container animate-pulse"></div>
                  <span className="font-mono text-xs text-secondary-container tracking-widest uppercase">Live Engine Active</span>
                </div>
                <span className="font-mono text-xs text-on-surface-variant">WS_CONNECTED: 200 OK</span>
              </div>
              {/* Master Card */}
              <div className="mb-12 relative z-10">
                <div className="bg-surface-container-highest p-4 ghost-border max-w-[280px]">
                  <div className="flex justify-between text-[10px] text-on-surface-variant mb-2">
                    <span>MASTER_ACCOUNT</span>
                    <span>MT5 #827101</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-primary font-headline font-bold text-xl">SELL EURUSD</div>
                    <div className="text-sm font-mono text-on-surface-variant">1.00 Lot</div>
                  </div>
                </div>
                {/* Connection Lines */}
                <div className="absolute left-1/2 top-full h-12 w-px bg-gradient-to-b from-primary-container to-transparent opacity-50"></div>
              </div>
              {/* Copier Cards */}
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-surface-container p-3 ghost-border">
                  <div className="flex justify-between text-[8px] text-on-surface-variant mb-1">
                    <span>COPIER_01</span>
                    <span className="text-secondary-container">SUCCESS</span>
                  </div>
                  <div className="text-secondary-container font-headline font-bold text-sm">COPIED @ 18ms</div>
                </div>
                <div className="bg-surface-container p-3 ghost-border">
                  <div className="flex justify-between text-[8px] text-on-surface-variant mb-1">
                    <span>COPIER_02</span>
                    <span className="text-secondary-container">SUCCESS</span>
                  </div>
                  <div className="text-secondary-container font-headline font-bold text-sm">COPIED @ 22ms</div>
                </div>
              </div>
              {/* Visual Decoration Background */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/20 blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-container/10 blur-[80px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
