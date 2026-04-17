import React from 'react';

const LogTerminal = () => {
  return (
    <section className="py-24 px-8 bg-surface relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="font-headline text-4xl font-bold mb-8 tracking-tight">Institutional-Grade Visibility</h2>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary-container mt-1">check_circle</span>
              <div>
                <h4 className="font-headline font-bold text-lg">Real-time tracking</h4>
                <p className="text-on-surface-variant text-sm">Every pip movements mirrored instantly across your network.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary-container mt-1">check_circle</span>
              <div>
                <h4 className="font-headline font-bold text-lg">Master → Copier mapping</h4>
                <p className="text-on-surface-variant text-sm">Complex account relationships simplified into a single visual flow.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary-container mt-1">check_circle</span>
              <div>
                <h4 className="font-headline font-bold text-lg">Detailed Execution logs</h4>
                <p className="text-on-surface-variant text-sm">Full audit trail of every execution attempt and latency metric.</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="bg-surface-container-lowest p-6 ghost-border font-mono text-xs overflow-hidden h-[400px] relative">
          <div className="flex gap-4 border-b border-outline-variant/10 pb-4 mb-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
            </div>
            <span className="text-on-surface-variant">terminal.output.log</span>
          </div>
          <div className="space-y-2 text-on-surface-variant/80">
            <div className="flex gap-4"><span className="text-outline-variant">[14:02:11]</span> <span className="text-primary-container">INFO:</span> MASTER MT5_8271 CONNECTION STABLE</div>
            <div className="flex gap-4"><span className="text-outline-variant">[14:02:13]</span> <span className="text-secondary-container">TRADE:</span> DETECTED NEW ORDER [SELL_LIMIT_EURUSD]</div>
            <div className="flex gap-4"><span className="text-outline-variant">[14:02:13]</span> <span className="text-primary">SYNC:</span> BROADCASTING TO 12 COPIERS...</div>
            <div className="flex gap-4"><span className="text-outline-variant">[14:02:13]</span> <span className="text-secondary-container">COPIER_1:</span> ACKNOWLEDGED - OFFSET 12ms</div>
            <div className="flex gap-4"><span className="text-outline-variant">[14:02:13]</span> <span className="text-secondary-container">COPIER_2:</span> ACKNOWLEDGED - OFFSET 14ms</div>
            <div className="flex gap-4"><span className="text-outline-variant">[14:02:14]</span> <span className="text-secondary-container">SUCCESS:</span> SYNC CYCLE COMPLETE - AVG 13.5ms</div>
            <div className="flex gap-4"><span className="text-outline-variant">[14:05:01]</span> <span className="text-primary-container">HEARTBEAT:</span> CPU 1.2% | RAM 4.5GB | NETWORK 0.2ms</div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-container-lowest to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default LogTerminal;
