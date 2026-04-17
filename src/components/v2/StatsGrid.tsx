import React from 'react';

const StatsGrid = () => {
  return (
    <section className="py-24 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="text-center p-8 bg-surface-container-highest ghost-border">
          <div className="text-4xl md:text-5xl font-headline font-bold text-secondary-container mb-2">1.5M+</div>
          <div className="font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.2em]">Trades Executed</div>
        </div>
        <div className="text-center p-8 bg-surface-container-highest ghost-border">
          <div className="text-4xl md:text-5xl font-headline font-bold text-primary-container mb-2">&lt;250ms</div>
          <div className="font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.2em]">Avg Execution</div>
        </div>
        <div className="text-center p-8 bg-surface-container-highest ghost-border">
          <div className="text-4xl md:text-5xl font-headline font-bold text-secondary-container mb-2">99.9%</div>
          <div className="font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.2em]">Uptime Status</div>
        </div>
        <div className="text-center p-8 bg-surface-container-highest ghost-border">
          <div className="text-4xl md:text-5xl font-headline font-bold text-primary-container mb-2">300+</div>
          <div className="font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.2em]">Active Terminals</div>
        </div>
      </div>
    </section>
  );
};

export default StatsGrid;
