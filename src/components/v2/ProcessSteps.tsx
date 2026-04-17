import React from 'react';

const ProcessSteps = () => {
  return (
    <section className="py-24 bg-surface-container-low relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="mb-20 max-w-2xl">
          <h2 className="font-headline text-4xl font-bold mb-6 tracking-tight">Three Steps to Synchronization.</h2>
          <p className="text-on-surface-variant">Zero complex installation. Our distributed architecture handles the heavy lifting.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Step 1 */}
          <div className="group">
            <div className="font-mono text-4xl text-primary-container/20 mb-4 font-bold group-hover:text-primary-container transition-colors">01</div>
            <h3 className="font-headline text-2xl font-bold mb-4">CONNECT</h3>
            <p className="text-on-surface-variant leading-relaxed">Securely connect your MT4/MT5 accounts via our infrastructure portal. Encryption at rest and in transit.</p>
          </div>
          {/* Step 2 */}
          <div className="group">
            <div className="font-mono text-4xl text-primary-container/20 mb-4 font-bold group-hover:text-primary-container transition-colors">02</div>
            <h3 className="font-headline text-2xl font-bold mb-4">CONFIGURE</h3>
            <p className="text-on-surface-variant leading-relaxed">Set precise lot scaling, risk limits, and account mappings. Every parameter is controllable via dashboard.</p>
          </div>
          {/* Step 3 */}
          <div className="group">
            <div className="font-mono text-4xl text-primary-container/20 mb-4 font-bold group-hover:text-primary-container transition-colors">03</div>
            <h3 className="font-headline text-2xl font-bold mb-4">COPY</h3>
            <p className="text-on-surface-variant leading-relaxed">Execute trades in real time with ultra-low latency. Automated error handling ensures consistency.</p>
          </div>
        </div>
      </div>
      {/* Decorative Visual */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
        <span className="material-symbols-outlined text-[400px]" style={{ fontVariationSettings: "'FILL' 1" }}>sync_alt</span>
      </div>
    </section>
  );
};

export default ProcessSteps;
