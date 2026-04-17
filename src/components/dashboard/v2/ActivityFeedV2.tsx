import React from "react";
import { Radio, RefreshCw, CheckCircle, Info } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'sync' | 'success' | 'info';
  details: string;
}

const ActivityFeedV2 = ({ logs = [] }: { logs: LogEntry[] }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'sync': return <RefreshCw size={14} className="text-[#00D1FF]" />;
      case 'success': return <CheckCircle size={14} className="text-[#27ff97]" />;
      default: return <Info size={14} className="text-slate-400" />;
    }
  };

  return (
    <section className="bg-surface-container-low rounded-lg p-6 border border-[#859399]/15 shadow-xl">
      <h3 className="font-headline font-bold text-lg uppercase mb-6 flex items-center justify-between text-white">
        Activity Feed
        <Radio size={20} className="text-slate-500 animate-pulse" />
      </h3>
      <div className="space-y-6">
        {logs.length > 0 ? logs.map((log) => (
          <div key={log.id} className="flex gap-4 relative group">
            <div className="z-10 mt-1 transition-transform group-hover:scale-110">
              {getIcon(log.type)}
            </div>
            <div className="flex flex-col">
              <p className="text-[10px] font-mono text-slate-500 tracking-widest">{log.timestamp}</p>
              <p className="text-xs text-on-surface leading-relaxed">
                {log.message} <span className="font-bold">{log.details}</span>
              </p>
            </div>
          </div>
        )) : (
          <p className="text-center text-slate-500 text-[10px] uppercase font-mono py-8 tracking-widest border border-dashed border-white/10 rounded">
            Monitoring system streams...
          </p>
        )}
      </div>
    </section>
  );
};

export default ActivityFeedV2;
