import { ChevronsDown, ChevronsRight } from "lucide-react";

const SignalPipeline = ({ latency = 180 }) => {
  return (
    <section className="group overflow-hidden rounded-lg border border-[#859399]/15 bg-[#1c1b1b] p-4 shadow-2xl transition-all hover:bg-[#202020] sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-4">
          <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-white">Active Signal Pipeline</h3>
          <div className="rounded-sm border border-[#27ff97]/20 bg-[#27ff97]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#27ff97]">
            STABLE
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Terminal Latency</p>
          <p className="font-mono font-bold text-[#27ff97]">{latency}ms</p>
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-6 py-2 sm:flex-row sm:justify-center sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20">
        <div className="z-10 flex flex-col items-center gap-4 transition-transform group-hover:scale-105">
          <div className="flex h-20 w-20 items-center justify-center rounded border border-[#859399]/20 bg-[#353534]/40 shadow-xl backdrop-blur-md">
            <span className="font-headline font-bold tracking-tighter text-[#00D1FF]">MT5-01</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">MASTER</span>
        </div>

        <div className="relative h-12 w-px shrink-0 overflow-hidden bg-[#3c494e]/30 sm:hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00D1FF] to-transparent opacity-50" />
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center bg-[#131313] px-1">
            <ChevronsDown size={20} className="text-[#00D1FF]" />
          </div>
        </div>

        <div className="relative hidden h-px min-w-0 flex-1 max-w-[400px] overflow-hidden bg-[#3c494e]/30 sm:block">
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-[#00D1FF] to-transparent opacity-50">
            <div className="absolute h-full w-20 animate-[pulse_2s_infinite] bg-[#00D1FF] shadow-[0_0_20px_#00D1FF]" />
          </div>
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 bg-[#131313] px-3">
            <ChevronsRight size={20} className="text-[#00D1FF]" />
          </div>
        </div>

        <div className="z-10 flex flex-col items-center gap-4 transition-transform group-hover:scale-105">
          <div className="flex h-20 w-20 items-center justify-center rounded border border-[#859399]/20 bg-[#353534]/40 shadow-xl backdrop-blur-md">
            <span className="font-headline font-bold tracking-tighter text-[#27ff97]">MT5-02</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">SLAVE</span>
        </div>
      </div>
    </section>
  );
};

export default SignalPipeline;
