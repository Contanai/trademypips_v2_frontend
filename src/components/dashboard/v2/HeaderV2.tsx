import { Bell, Settings, User } from "lucide-react";

const HeaderV2 = () => {
  return (
    <header className="sticky top-0 z-40 flex h-16 min-w-0 w-full items-center justify-between gap-3 border-b border-[#353534]/15 bg-[#131313]/60 px-4 backdrop-blur-xl shadow-[0_20px_20px_rgba(0,209,255,0.05)] sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <h2 className="truncate font-headline text-lg font-black text-white sm:text-xl lg:text-2xl">Dashboard</h2>
        <div className="hidden h-4 w-px shrink-0 bg-slate-800 sm:block" />
        <div className="hidden items-center gap-2 text-[10px] font-mono uppercase tracking-tighter text-[#27ff97] sm:flex">
          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#27ff97] shadow-[0_0_8px_rgba(39,255,151,0.5)]" />
          <span className="hidden md:inline">Market Live</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-6">

        <div className="flex items-center gap-2 text-slate-400 sm:gap-4">
          <button type="button" className="transition-all hover:text-[#00D1FF]" aria-label="Notifications">
            <Bell size={20} />
          </button>
          <button type="button" className="transition-all hover:text-[#00D1FF]" aria-label="Settings">
            <Settings size={20} />
          </button>
          <button type="button" className="transition-all hover:text-[#00D1FF]" aria-label="Account">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderV2;
