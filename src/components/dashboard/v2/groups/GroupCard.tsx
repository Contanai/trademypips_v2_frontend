import React from "react";
import { Pause, Edit, StopCircle, Play, AlertTriangle, Landmark, Plus } from "lucide-react";

interface GroupCardProps {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'error';
  latency: number;
  masterAccount: string;
  copiers: string[];
  mode: string;
  tradesToday: number;
  errorMessage?: string;
  onPause?: () => void;
  onResume?: () => void;
  onEdit?: () => void;
  onAddCopier?: () => void;
  onManageCopiers?: () => void;
  onDelete?: () => void;
}

const GroupCard = ({
  name,
  status,
  latency,
  masterAccount,
  copiers,
  mode,
  tradesToday,
  errorMessage,
  onPause,
  onResume,
  onEdit,
  onAddCopier,
  onManageCopiers,
  onDelete,
}: GroupCardProps) => {
  return (
    <article className={`bg-surface-container-low p-6 border-l-4 relative group overflow-hidden transition-all hover:bg-surface-container-high shadow-lg ${
      status === 'active' ? "border-[#27ff97]" : 
      status === 'paused' ? "border-orange-500" : 
      "border-error"
    }`}>
      {status === 'error' && <div className="absolute inset-0 bg-error/5 pointer-events-none"></div>}
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-headline font-bold text-on-surface group-hover:text-[#00D1FF] transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {status === 'active' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#27ff97] shadow-[0_0_8px_#27ff97] animate-pulse"></span>
                <span className="text-[#27ff97] text-[10px] font-bold uppercase tracking-widest">Active</span>
              </>
            ) : status === 'paused' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span className="text-orange-500 text-[10px] font-bold uppercase tracking-widest">Paused</span>
              </>
            ) : (
              <>
                <AlertTriangle size={12} className="text-error" />
                <span className="text-error text-[10px] font-bold uppercase tracking-widest">Error: {errorMessage || "System Exception"}</span>
              </>
            )}
            <span className="text-gray-600 px-2 text-[10px]">•</span>
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Latency: {latency}ms</span>
          </div>
        </div>

        <div className="flex gap-2 relative z-10">
          {status === 'paused' ? (
            <button
              title="Resume copying"
              onClick={onResume}
              className="p-2 hover:bg-white/5 rounded text-[#27ff97] hover:brightness-110 transition-all"
            >
              <Play size={18} fill="currentColor" />
            </button>
          ) : (
            <button
              title="Pause copying"
              onClick={onPause}
              className="p-2 hover:bg-white/5 rounded text-gray-400 hover:text-[#00D1FF] transition-all"
            >
              <Pause size={18} />
            </button>
          )}
          <button
            title="Add more copiers"
            onClick={onAddCopier}
            className="p-2 hover:bg-white/5 rounded text-gray-400 hover:text-[#00D1FF] transition-all"
          >
            <Plus size={18} />
          </button>
          <button
            title="Delete group"
            onClick={onDelete}
            className="p-2 hover:bg-white/5 rounded text-gray-400 hover:text-error transition-all"
          >
            <StopCircle size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <div className="text-gray-600 text-[10px] uppercase font-bold tracking-tighter mb-2 font-headline">Master Account</div>
          <div className={`flex items-center gap-3 bg-surface-container-lowest p-3 rounded-sm border border-white/5 transition-all ${status === 'paused' ? "opacity-60" : ""}`}>
            <Landmark size={18} className="text-[#00D1FF]" />
            <span className="font-headline font-bold text-on-surface tracking-tight">{masterAccount}</span>
          </div>
        </div>
        <div>
          <div className="text-gray-600 text-[10px] uppercase font-bold tracking-tighter mb-2 font-headline">Copiers</div>
          <div className={`flex flex-wrap gap-1 transition-all ${status === 'paused' ? "opacity-60" : ""}`}>
            {copiers.slice(0, 2).map((copier) => (
              <span key={copier} className={`bg-surface-variant/40 px-2 py-1 text-[10px] font-mono border border-white/5 ${status === 'error' && copier.includes('ERR') ? "border-error/40 text-error" : "text-on-surface-variant"}`}>
                {copier}
              </span>
            ))}
            {copiers.length > 2 && (
              <span className="bg-surface-variant/40 px-2 py-1 text-[10px] font-mono text-[#00D1FF] font-bold border border-[#00D1FF]/20">
                +{copiers.length - 2} more
              </span>
            )}
            <button
              type="button"
              title="Add or remove copiers in this group"
              onClick={onManageCopiers}
              className="inline-flex items-center rounded-sm border border-[#00D1FF]/30 bg-[#00D1FF]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#00D1FF] transition-colors hover:bg-[#00D1FF]/20"
            >
              Add / Remove
            </button>
          </div>
        </div>
      </div>

      {status === 'error' && errorMessage && (
        <div className="bg-error/10 p-3 rounded-sm flex items-start gap-3 mt-4 border border-error/20 mb-6 group-hover:bg-error/20 transition-all">
          <AlertTriangle size={14} className="text-error shrink-0" />
          <p className="text-[10px] text-error font-medium leading-tight font-mono">{errorMessage}</p>
        </div>
      )}

      <div className="flex justify-between items-center py-4 border-t border-white/5 mt-auto">
        <div className="flex gap-6">
          <div>
            <span className="text-gray-600 text-[10px] uppercase font-bold block mb-0.5 tracking-widest font-headline">Mode</span>
            <span className="text-on-surface text-sm font-medium tracking-tight">{mode}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-gray-600 text-[10px] uppercase font-bold block mb-0.5 tracking-widest font-headline">Pipeline Today</span>
          <span className="text-[#27ff97] text-sm font-bold font-headline tracking-tighter">{tradesToday} trades executed</span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          title="Edit group settings (master, copiers, risk rules)"
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-sm border border-[#00D1FF]/40 bg-[#00D1FF]/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#00D1FF] transition-colors hover:bg-[#00D1FF]/20"
        >
          <Edit size={14} />
          Edit Group
        </button>
        <button
          title="Add copier accounts to this group"
          onClick={onAddCopier}
          className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-colors hover:bg-white/5"
        >
          <Plus size={14} />
          Add Copiers
        </button>
        <button
          title="Delete this copy group"
          onClick={onDelete}
          className="ml-auto inline-flex items-center gap-2 rounded-sm border border-error/40 bg-error/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-error transition-colors hover:bg-error/20"
        >
          <StopCircle size={14} />
          Delete Group
        </button>
      </div>
    </article>
  );
};

export default GroupCard;
