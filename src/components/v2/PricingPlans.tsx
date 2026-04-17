import React from 'react';
import { Link } from 'react-router-dom';

const PricingPlans = () => {
  return (
    <section className="py-24 px-8 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl font-bold mb-4">Scaled for Professional Operations.</h2>
          <p className="text-on-surface-variant">Choose the infrastructure that matches your trading volume.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan 1 */}
          <div className="bg-surface p-8 ghost-border flex flex-col">
            <div className="mb-8">
              <span className="text-[10px] font-mono font-bold tracking-widest text-on-surface-variant uppercase bg-surface-container-highest px-3 py-1 mb-4 inline-block">Best for Beginners</span>
              <h3 className="font-headline text-2xl font-bold mb-2">MT Hub</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-headline font-bold">$29</span>
                <span className="text-on-surface-variant">/mo</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-grow text-sm">
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary-container text-sm">done</span> Up to 5 accounts</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary-container text-sm">done</span> Standard server</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary-container text-sm">done</span> &lt; 500ms latency</li>
              <li className="flex items-center gap-3 text-on-surface-variant/40"><span className="material-symbols-outlined text-sm">close</span> Dedicated IP</li>
            </ul>
            <Link className="w-full py-3 border border-outline-variant/30 font-headline font-bold hover:bg-white/5 transition-all text-center block" to="/signup">Get Started</Link>
          </div>
          {/* Plan 2 (Highlighted) */}
          <div className="bg-surface-container-highest p-8 ghost-border flex flex-col md:scale-105 shadow-2xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary font-mono text-[10px] font-bold px-4 py-1 tracking-widest whitespace-nowrap">MOST POPULAR</div>
            <div className="mb-8 pt-4">
              <span className="text-[10px] font-mono font-bold tracking-widest text-primary-container uppercase bg-primary-container/10 px-3 py-1 mb-4 inline-block">For Growing Firms</span>
              <h3 className="font-headline text-2xl font-bold mb-2">Multi-Platform Hub</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-headline font-bold text-primary-container">$89</span>
                <span className="text-on-surface-variant">/mo</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-grow text-sm">
              <li className="flex items-center gap-3 font-bold text-primary"><span className="material-symbols-outlined text-primary-container text-sm">bolt</span> Up to 20 accounts</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary-container text-sm">done</span> Optimized servers</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary-container text-sm">done</span> &lt; 150ms latency</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary-container text-sm">done</span> Alpha MT/DX support</li>
            </ul>
            <Link className="w-full py-3 bg-primary-container text-on-primary font-headline font-bold blue-glow transition-all text-center block" to="/signup">Select Pro Plan</Link>
          </div>
          {/* Plan 3 */}
          <div className="bg-surface p-8 ghost-border flex flex-col">
            <div className="mb-8">
              <span className="text-[10px] font-mono font-bold tracking-widest text-on-surface-variant uppercase bg-surface-container-highest px-3 py-1 mb-4 inline-block">For Power Users</span>
              <h3 className="font-headline text-2xl font-bold mb-2">Premium Hub</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-headline font-bold">$199</span>
                <span className="text-on-surface-variant">/mo</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-grow text-sm">
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary-container text-sm">done</span> Unlimited accounts</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary-container text-sm">done</span> Bare-metal servers</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary-container text-sm">done</span> Ultra-low latency (&lt;50ms)</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary-container text-sm">done</span> Dedicated static IP</li>
            </ul>
            <button className="w-full py-3 border border-outline-variant/30 font-headline font-bold hover:bg-white/5 transition-all">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
