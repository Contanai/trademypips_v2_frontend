import React from 'react';

const LiveStrip = () => {
  return (
    <div className="w-full bg-surface-container-lowest border-y border-outline-variant/10 py-4 overflow-hidden relative">
      <div className="flex whitespace-nowrap gap-12 px-8 font-mono text-xs text-on-surface-variant uppercase tracking-widest items-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
          <span>12 Terminals Active</span>
        </div>
        <div className="w-px h-4 bg-outline-variant/20"></div>
        <div>⚡ 220ms Avg Execution</div>
        <div className="w-px h-4 bg-outline-variant/20"></div>
        <div>🔁 1.5M+ Trades Copied</div>
        <div className="w-px h-4 bg-outline-variant/20"></div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
          <span>All Systems Operational</span>
        </div>
        <div className="w-px h-4 bg-outline-variant/20"></div>
        <div>Active Accounts: 48</div>
        <div className="w-px h-4 bg-outline-variant/20"></div>
        <div>Trades Today: 12,483</div>
      </div>
    </div>
  );
};

export default LiveStrip;
