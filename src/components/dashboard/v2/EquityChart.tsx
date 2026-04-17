const EquityChart = ({ data: _data = [] }: { data?: unknown[] }) => {
  return (
    <section className="relative col-span-1 min-h-[300px] overflow-hidden rounded-lg border border-[#859399]/15 bg-[#11161D] p-4 shadow-xl sm:p-6 lg:col-span-9 lg:min-h-[380px]">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-headline font-bold text-lg uppercase tracking-tight text-white">Equity Performance</h3>
        <div className="flex bg-[#0E0E0E] p-1 rounded">
          <button className="px-3 py-1 text-[10px] font-bold text-[#00D1FF] bg-[#1C1B1B] rounded-sm">7D</button>
          <button className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-white transition-colors">30D</button>
          <button className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-white transition-colors">ALL</button>
        </div>
      </div>

      <div className="h-[260px] w-full flex items-end gap-1 px-4 relative mt-4">
        {/* Abstract Grid Lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <div className="w-full h-[1px] bg-[#00D1FF]/20 absolute top-1/4"></div>
          <div className="w-full h-[1px] bg-[#00D1FF]/20 absolute top-1/2"></div>
          <div className="w-full h-[1px] bg-[#00D1FF]/20 absolute top-3/4"></div>
        </div>

        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#00D1FF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00D1FF" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Chart Path */}
          <path 
            d="M0,250 C100,240 200,280 300,220 C400,160 500,200 600,140 C700,80 800,100 900,40 L1000,20 L1000,300 L0,300 Z" 
            fill="url(#chartGradient)" 
          />
          <path 
            className="drop-shadow-[0_0_8px_rgba(0,209,255,0.6)]" 
            d="M0,250 C100,240 200,280 300,220 C400,160 500,200 600,140 C700,80 800,100 900,40 L1000,20" 
            fill="none" 
            stroke="#00D1FF" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
        </svg>
        
        {/* Annotations */}
        <div className="absolute right-2 top-16 max-w-[min(100%,12rem)] rounded bg-[#00D1FF] px-2 py-1 text-[10px] font-bold text-[#003543] shadow-[0_0_15px_#00D1FF33] animate-pulse sm:right-10 sm:top-20 md:right-40">
          $1,244,110.15 (Peak)
        </div>
      </div>
    </section>
  );
};

export default EquityChart;
