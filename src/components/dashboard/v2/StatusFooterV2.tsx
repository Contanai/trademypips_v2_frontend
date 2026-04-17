import React from "react";

const StatusFooterV2 = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="mt-auto flex w-full min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-white/5 bg-[#0E0E0E] px-4 py-2 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#27ff97] shadow-[0_0_8px_#27ff97] animate-pulse"></span>
          <span className="text-[9px] font-headline font-bold text-[#27ff97] uppercase tracking-widest">All Systems Operational</span>
        </div>
        <div className="h-3 w-[1px] bg-slate-800"></div>
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">API Server: 0.002ms</span>
      </div>
      
      <div className="flex items-center gap-6">
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">TRADEMYPIPS v2.4.0-STABLE</span>
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">GMT +0 ({time.toLocaleTimeString([], { hour12: false })})</span>
      </div>
    </footer>
  );
};

export default StatusFooterV2;
