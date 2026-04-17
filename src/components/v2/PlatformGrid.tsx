import React from 'react';

const PlatformGrid = () => {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <h2 className="font-headline text-3xl font-bold mb-16 tracking-tight text-center">Engineered for Connectivity</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Group 1 */}
        <div className="p-8 bg-surface-container-low ghost-border">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs font-mono text-secondary-container uppercase tracking-widest">Live Now</span>
            <span className="material-symbols-outlined text-secondary-container">verified</span>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-headline font-bold text-2xl">MT5</span>
              <span className="text-[10px] font-mono px-2 py-1 bg-secondary-container/10 text-secondary-container">FULLY SUPPORTED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-headline font-bold text-2xl">MT4</span>
              <span className="text-[10px] font-mono px-2 py-1 bg-secondary-container/10 text-secondary-container">FULLY SUPPORTED</span>
            </div>
          </div>
        </div>
        {/* Group 2 */}
        <div className="p-8 bg-surface-container-low ghost-border">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs font-mono text-primary-container uppercase tracking-widest">In Progress</span>
            <span className="material-symbols-outlined text-primary-container">pending</span>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-headline font-bold text-2xl">cTrader</span>
              <span className="text-[10px] font-mono px-2 py-1 bg-primary-container/10 text-primary-container">BETA ACCESS</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-headline font-bold text-2xl">DXTrade</span>
              <span className="text-[10px] font-mono px-2 py-1 bg-primary-container/10 text-primary-container">BETA ACCESS</span>
            </div>
          </div>
        </div>
        {/* Group 3 */}
        <div className="p-8 bg-surface-container-low ghost-border opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Planned</span>
            <span className="material-symbols-outlined text-on-surface-variant">lock</span>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-headline font-bold text-2xl">TradeLocker</span>
              <span className="text-[10px] font-mono px-2 py-1 bg-surface-container-highest text-on-surface-variant">COMING SOON</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformGrid;
