import {
  LayoutDashboard,
  Wallet,
  Share2,
  History,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import Logo from "../../v2/Logo";

type SidebarV2Props = {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
};

const SidebarV2 = ({ expanded, onExpandedChange }: SidebarV2Props) => {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { label: "Accounts", icon: <Wallet size={20} />, path: "/dashboard/accounts" },
    { label: "Copy Groups", icon: <span className="material-symbols-outlined text-[20px]">group_work</span>, path: "/dashboard/groups" },
    { label: "Signal Hub", icon: <Share2 size={20} />, path: "/dashboard/signals" },
    { label: "History", icon: <History size={20} />, path: "/dashboard/history" },
    { label: "Logs", icon: <span className="material-symbols-outlined text-[20px]">terminal</span>, path: "/dashboard/logs" },
    { label: "Settings", icon: <span className="material-symbols-outlined text-[20px]">settings</span>, path: "/dashboard/settings" },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-[#353534]/10 bg-[#0E0E0E] transition-[width] duration-200 ease-out",
        "w-14 overflow-hidden lg:w-[260px] lg:overflow-visible",
        expanded && "max-lg:w-[260px] max-lg:overflow-visible max-lg:shadow-[4px_0_24px_rgba(0,0,0,0.45)]"
      )}
    >
      <div className="flex shrink-0 flex-col px-3 py-6 lg:p-8">
        <Logo 
          iconSize="text-2xl" 
          textSize="text-xl" 
          showText={true}
          textClassName={cn(!expanded && "max-lg:sr-only")}
          className={cn("lg:flex", !expanded && "max-lg:flex max-lg:justify-center")}
        />
      </div>

      <nav className="mt-2 flex flex-1 flex-col space-y-1 px-2 lg:mt-4 lg:space-y-2 lg:px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              title={item.label}
              aria-label={item.label}
              onClick={() => onExpandedChange(false)}
              className={cn(
                "flex items-center gap-4 rounded-sm px-2 py-3 font-headline text-sm uppercase tracking-widest transition-all duration-200 lg:px-4",
                expanded ? "justify-start" : "max-lg:justify-center lg:justify-start",
                isActive
                  ? "border-l-2 border-[#00D1FF] bg-[#1C1B1B] font-bold text-[#00D1FF]"
                  : "border-l-2 border-transparent text-slate-500 hover:bg-[#1C1B1B] hover:text-slate-200"
              )}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className={cn(!expanded && "max-lg:sr-only")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col border-t border-white/5">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 py-3 text-[#00D1FF] hover:bg-[#1C1B1B] lg:hidden"
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() => onExpandedChange(!expanded)}
        >
          {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          <span className="sr-only">{expanded ? "Collapse" : "Expand"} menu</span>
        </button>

        <div className="p-3 lg:p-6">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg border border-white/5 bg-[#1C1B1B] p-3 shadow-lg",
              !expanded && "max-lg:justify-center max-lg:p-2 lg:justify-start"
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-[#353534]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhPlX1Obq87664vqvEIW1AaNrzoo3wqboPTQWZw2exY94OdkPy6OYfKn4PXd3DLfwkl7d_GfQdWuW7B1mFiuDW3W3oxHiZSAx30Zr5m6G8GApBXB2p5pA-HWywrYpBiOqjCGyMHdeyoBsdDqzocxI6Ac3d6VFsrkOwPr0Y4RYfjhe_TK4quR5YkiJmCCiJbEP3-cv7B0LQcKGcjZBNlUE5pCwwAy-LEOLE7lOzq9nXjmJh-9BsT_7YZw_zWROlmkxqYSmcrcsegG0"
                alt=""
                className="h-full w-full object-cover opacity-80"
              />
            </div>
            <div className={cn("min-w-0", !expanded && "max-lg:hidden")}>
              <p className="text-xs font-bold tracking-tight text-white">INSTITUTIONAL_ID</p>
              <p className="font-headline text-[10px] uppercase text-slate-500">Tier 3 Operator</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarV2;
