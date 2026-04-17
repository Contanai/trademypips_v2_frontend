import React from 'react';
import { Link } from 'react-router-dom';

const FinalCTA = () => {
  return (
    <section className="py-24 px-8 text-center bg-gradient-to-b from-surface to-surface-container-low">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-headline text-5xl font-bold mb-6 tracking-tight">Start Copying Trades in Minutes</h2>
        <p className="text-on-surface-variant text-lg mb-12">Connect your accounts and automate your trading instantly with our production-ready infrastructure.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link className="px-8 py-4 bg-primary-container text-on-primary font-headline font-bold text-lg blue-glow active:scale-95 transition-all text-center" to="/signup">Get Started Now</Link>
          <button className="px-8 py-4 border border-outline-variant/30 text-primary font-headline font-bold text-lg hover:bg-white/5 active:scale-95 transition-all">View Pricing</button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
