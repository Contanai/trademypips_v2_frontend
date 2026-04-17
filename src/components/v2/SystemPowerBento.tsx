import React from 'react';

const SystemPowerBento = () => {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <h2 className="font-headline text-3xl font-bold mb-16 tracking-tight text-center">Built for Heavy Loads.</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-surface-container p-8 ghost-border">
          <span className="material-symbols-outlined text-primary-container mb-4">terminal</span>
          <h4 className="font-headline font-bold text-lg mb-2">Multi-Terminal Engine</h4>
          <p className="text-on-surface-variant text-sm">Process thousands of trades simultaneously without queue blocks.</p>
        </div>
        <div className="bg-surface-container p-8 ghost-border">
          <span className="material-symbols-outlined text-primary-container mb-4">dns</span>
          <h4 className="font-headline font-bold text-lg mb-2">Distributed Worker Servers</h4>
          <p className="text-on-surface-variant text-sm">Globally distributed infrastructure to ensure minimal distance to brokers.</p>
        </div>
        <div className="bg-surface-container p-8 ghost-border">
          <span className="material-symbols-outlined text-primary-container mb-4">cached</span>
          <h4 className="font-headline font-bold text-lg mb-2">Real-Time Sync via Redis</h4>
          <p className="text-on-surface-variant text-sm">Sub-millisecond data propagation using in-memory high-speed caching.</p>
        </div>
        <div className="bg-surface-container p-8 ghost-border">
          <span className="material-symbols-outlined text-primary-container mb-4">health_and_safety</span>
          <h4 className="font-headline font-bold text-lg mb-2">Auto-Recovery System</h4>
          <p className="text-on-surface-variant text-sm">Instant failover protocols if any connection cluster experiences drop-outs.</p>
        </div>
        <div className="bg-surface-container p-8 ghost-border">
          <span className="material-symbols-outlined text-primary-container mb-4">route</span>
          <h4 className="font-headline font-bold text-lg mb-2">Smart Trade Mapping</h4>
          <p className="text-on-surface-variant text-sm">Intelligent lot calculation based on relative equity and risk parameters.</p>
        </div>
        <div className="bg-surface-container p-8 ghost-border">
          <span className="material-symbols-outlined text-primary-container mb-4">hub</span>
          <h4 className="font-headline font-bold text-lg mb-2">Cross-Server Copying</h4>
          <p className="text-on-surface-variant text-sm">Seamlessly copy from an MT4 master on Server A to an MT5 copier on Server B.</p>
        </div>
      </div>
    </section>
  );
};

export default SystemPowerBento;
