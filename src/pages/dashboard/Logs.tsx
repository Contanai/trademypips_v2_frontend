import DashboardLayoutV2 from "@/components/dashboard/v2/DashboardLayoutV2";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useAccounts, useSystemLogs } from "@/hooks/v2/useDashboardData";

type LogTab = "All" | "Trades" | "Copy Events" | "Errors" | "Warnings" | "System";

const tabs: LogTab[] = ["All", "Trades", "Copy Events", "Errors", "Warnings", "System"];

const toRelativeTime = (iso?: string) => {
  if (!iso) return "Unknown";
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff)) return "Unknown";
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "Just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
};

const toClock = (iso?: string) => {
  if (!iso) return "--:--:--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "--:--:--";
  return d.toLocaleTimeString([], { hour12: false });
};

const LogsPageV2 = () => {
  const ITEMS_PER_PAGE = 12;
  const { userId } = useUser();
  const { data: accounts = [] } = useAccounts(userId);
  const { data: logs = [], isLoading } = useSystemLogs(userId);
  const [activeTab, setActiveTab] = useState<LogTab>("All");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const accountMap = useMemo(() => {
    const map = new Map<string, { name: string; number: string; role: string }>();
    (accounts as any[]).forEach((acc) => {
      map.set(acc.id, {
        name: acc.account_name || `MT5-${String(acc.account_number ?? "").slice(-4)}`,
        number: String(acc.account_number ?? ""),
        role: String(acc.account_type ?? "slave").toLowerCase() === "master" ? "Master" : "Slave",
      });
    });
    return map;
  }, [accounts]);

  const normalizedLogs = useMemo(() => {
    return (logs as any[]).map((row) => {
      const category = String(row.category ?? "system");
      const level = String(row.level ?? "info");
      const source = String(row.source ?? "platform");
      const eventType = String(row.event_type ?? "user_action");
      const message = String(row.message ?? "System activity");
      const createdAt = row.created_at as string | undefined;
      const metadata = (row.metadata ?? {}) as Record<string, unknown>;
      return { category, level, source, eventType, message, createdAt, metadata };
    });
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const byTab = normalizedLogs.filter((l) => {
      if (activeTab === "All") return true;
      if (activeTab === "System") return l.category === "system" || l.level === "info";
      if (activeTab === "Errors") return l.category === "errors" || l.level === "error";
      if (activeTab === "Warnings") return l.category === "warnings" || l.level === "warning";
      if (activeTab === "Trades") return l.category === "trades";
      return l.category === "copy_events";
    });

    if (selectedAccountId === "all") return byTab;

    const selected = accountMap.get(selectedAccountId);
    return byTab.filter((log) => {
      const metadata = log.metadata || {};
      const metadataText = JSON.stringify(metadata).toLowerCase();
      const messageText = log.message.toLowerCase();
      const sourceText = log.source.toLowerCase();

      if (metadataText.includes(selectedAccountId.toLowerCase())) return true;
      if (selected?.number && (metadataText.includes(selected.number.toLowerCase()) || messageText.includes(selected.number.toLowerCase()))) return true;
      if (selected?.name && (metadataText.includes(selected.name.toLowerCase()) || messageText.includes(selected.name.toLowerCase()) || sourceText.includes(selected.name.toLowerCase()))) return true;
      return false;
    });
  }, [activeTab, normalizedLogs, selectedAccountId, accountMap]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  const handleTabChange = (tab: LogTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleAccountChange = (accountId: string) => {
    setSelectedAccountId(accountId);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const errorCount = normalizedLogs.filter((l) => l.level === "error" || l.category === "errors").length;
  const warningCount = normalizedLogs.filter((l) => l.level === "warning" || l.category === "warnings").length;
  const issueCount = errorCount + warningCount;

  const levelUi = (level: string) => {
    if (level === "error") {
      return {
        badge: "ERROR",
        row: "bg-[#93000a]/10 border-[#ffb4ab] hover:bg-[#93000a]/20",
        text: "text-[#ffb4ab]",
      };
    }
    if (level === "warning") {
      return {
        badge: "WARNING",
        row: "bg-orange-500/5 border-orange-500 hover:bg-orange-500/10",
        text: "text-orange-500",
      };
    }
    return {
      badge: "SYSTEM",
      row: "bg-[#a4e6ff]/5 border-[#a4e6ff] hover:bg-[#a4e6ff]/10",
      text: "text-[#a4e6ff]",
    };
  };

  return (
    <DashboardLayoutV2>
      {/* STICKY ALERT BAR - only visible when warning/error logs exist */}
      {issueCount > 0 && (
        <div className="sticky top-[-24px] lg:top-[-32px] z-30 bg-[#93000a] text-[#ffdad6] px-8 py-3 flex items-center justify-between shadow-[0_0_20px_0px_rgba(239,68,68,0.2)] mx-[-16px] sm:mx-[-24px] lg:mx-[-32px] mb-8">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined font-variation-settings-fill-1 text-xl animate-pulse">report</span>
            <span className="font-headline font-semibold text-sm tracking-tight text-white">
              {issueCount} issue(s) detected
            </span>
          </div>
          <button className="bg-[#ffdad6] text-[#93000a] px-4 py-1 text-xs font-bold uppercase tracking-widest hover:brightness-90 transition-all rounded-sm">
            Review
          </button>
        </div>
      )}

      <div className="p-0">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-1">
            <h2 className="text-5xl font-headline font-bold tracking-tighter text-[#e5e2e1]">Logs</h2>
            <p className="text-gray-500 font-body tracking-tight">Monitor system activity, trade execution, and errors</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedAccountId}
                onChange={(e) => handleAccountChange(e.target.value)}
                className="bg-[#1c1b1b] border-none text-sm font-headline font-medium py-3 px-6 pr-10 focus:ring-0 cursor-pointer text-[#a4e6ff] hover:bg-[#2a2a2a] transition-colors appearance-none rounded-sm"
              >
                <option className="bg-[#131313]" value="all">All Accounts</option>
                {(accounts as any[]).map((acc) => {
                  const role = String(acc.account_type ?? "slave").toLowerCase() === "master" ? "Master" : "Slave";
                  const accountName = acc.account_name || `MT5-${String(acc.account_number ?? "").slice(-4)}`;
                  return (
                    <option key={acc.id} className="bg-[#131313]" value={acc.id}>
                      {role}: {accountName}
                    </option>
                  );
                })}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#a4e6ff] pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>

        {/* FILTER PILLS */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-2 text-xs font-headline font-bold uppercase tracking-widest rounded-full transition-all ${
                activeTab === tab
                  ? "bg-[#00d1ff] text-[#003543]"
                  : "bg-[#1c1b1b] text-gray-400 hover:text-[#e5e2e1] hover:bg-[#2a2a2a]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* LOG FEED */}
        <div className="space-y-3 font-mono text-sm">
          {isLoading ? (
            <div className="py-12 text-center text-gray-500 text-xs uppercase tracking-widest">Loading logs...</div>
          ) : filteredLogs.length > 0 ? (
            paginatedLogs.map((log, idx) => {
              const ui = levelUi(log.level);
              return (
                <div
                  key={`${log.createdAt ?? "no-time"}-${idx}`}
                  className={`flex items-center gap-6 p-4 border-l-4 group transition-all duration-300 ${ui.row}`}
                >
                  <div className="flex flex-col items-center min-w-[80px]">
                    <span className={`text-[10px] font-bold uppercase tracking-tighter ${ui.text}`}>{ui.badge}</span>
                    <span className="text-xs text-gray-500">{toClock(log.createdAt)}</span>
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-[#e5e2e1]">{log.eventType.replaceAll("_", " ")}</h4>
                      <p className="text-xs text-gray-400">{log.message}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-gray-600 block mb-1 uppercase">Source: {log.source}</span>
                      <span className="text-xs font-bold text-gray-500 whitespace-nowrap">{toRelativeTime(log.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-gray-500 text-xs uppercase tracking-widest">
              No logs yet for {activeTab}
            </div>
          )}
        </div>
        {filteredLogs.length > ITEMS_PER_PAGE && (
          <div className="mt-6 flex items-center justify-between border-t border-[#3c494e]/10 pt-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded border border-white/10 px-3 py-1.5 text-[10px] font-headline font-bold uppercase tracking-widest text-slate-300 transition-colors hover:border-[#00D1FF]/40 hover:text-[#00D1FF] disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <button
                type="button"
                className="rounded border border-white/10 px-3 py-1.5 text-[10px] font-headline font-bold uppercase tracking-widest text-slate-300 transition-colors hover:border-[#00D1FF]/40 hover:text-[#00D1FF] disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* STREAM STATUS FOOTER */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between py-6 border-t border-[#3c494e]/10 gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-3 h-3">
              <div className="absolute w-full h-full bg-[#27ff97] rounded-full animate-ping opacity-50"></div>
              <div className="w-2 h-2 bg-[#27ff97] rounded-full"></div>
            </div>
            <span className="text-xs font-mono text-[#27ff97] font-medium uppercase tracking-widest">Live Stream Active</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-[10px] font-mono uppercase tracking-tighter">
            <span>Events Processed: 1,482,903</span>
            <span>Uptime: 99.998%</span>
            <span>Server: KINETIC-LDN-01</span>
          </div>
        </div>
      </div>

    </DashboardLayoutV2>
  );
};

export default LogsPageV2;
