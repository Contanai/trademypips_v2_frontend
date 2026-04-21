import { useEffect, useMemo, useState } from "react";
import { Circle, Eye } from "lucide-react";

interface Account {
  id: string;
  account_number: string;
  account_name: string;
  balance: number;
  equity: number;
  daily_pnl: number;
  account_type: string;
  status: string;
  vnc_host?: string | null;
  vnc_port?: number | string | null;
}

const AccountsTableV2 = ({
  accounts = [],
  onRowClick,
  onPendingConnectionClick,
  onPendingOverviewClick,
}: {
  accounts: Account[];
  onRowClick?: (account: Account) => void;
  onPendingConnectionClick?: (account: Account) => void;
  onPendingOverviewClick?: (account: Account) => void;
}) => {
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const hasDisconnectedAccounts = accounts.some((account) => account.status === "disconnected");
  const hasPendingAccounts = accounts.some((account) => account.status === "pending");
  const totalPages = Math.max(1, Math.ceil(accounts.length / ITEMS_PER_PAGE));

  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return accounts.slice(start, start + ITEMS_PER_PAGE);
  }, [accounts, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <section className="bg-[#11161D] rounded-lg border border-[#859399]/15 overflow-hidden shadow-2xl">
      <div className="flex flex-col gap-3 border-b border-white/5 bg-[#131b25] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <h3 className="font-headline font-bold text-lg uppercase text-white">Account Infrastructure</h3>
        <button className="text-[#00D1FF] text-[10px] font-bold uppercase tracking-widest hover:underline transition-all">View All Metrics</button>
      </div>

      {(hasDisconnectedAccounts || hasPendingAccounts) && (
        <div className="space-y-2 border-b border-white/5 bg-[#0f1620] px-4 py-3 sm:px-8">
          {hasDisconnectedAccounts && (
            <p className="text-xs text-slate-300">
              Disconnected accounts are still being prepared by the backend. You can continue with other setup steps now, or wait and complete account login when ready.
            </p>
          )}
          {hasPendingAccounts && (
            <p className="text-xs text-[#ffd48a]">
              Pending accounts need your action: click the account, complete the login process, then click <span className="font-semibold">Finalize Setup</span> to finish connecting it.
            </p>
          )}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0E0E0E]">
            <tr>
              <th className="px-8 py-3 text-[10px] font-headline font-bold text-slate-500 uppercase tracking-tighter">ID / Name</th>
              <th className="px-8 py-3 text-[10px] font-headline font-bold text-slate-500 uppercase tracking-tighter">Balance</th>
              <th className="px-8 py-3 text-[10px] font-headline font-bold text-slate-500 uppercase tracking-tighter">Equity</th>
              <th className="px-8 py-3 text-[10px] font-headline font-bold text-slate-500 uppercase tracking-tighter">Daily PnL</th>
              <th className="px-8 py-3 text-[10px] font-headline font-bold text-slate-500 uppercase tracking-tighter">Role</th>
              <th className="px-8 py-3 text-[10px] font-headline font-bold text-slate-500 uppercase tracking-tighter">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {accounts.length > 0 ? paginatedAccounts.map((account) => (
              <tr
                key={account.id}
                role={onRowClick ? "button" : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={() => onRowClick?.(account)}
                onKeyDown={(e) => {
                  if (!onRowClick) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onRowClick(account);
                  }
                }}
                className={`hover:bg-[#1C1B1B] transition-colors group ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {account.status === "pending" ? (
                  <td colSpan={6} className="relative p-0">
                    <div className="grid min-h-[72px] grid-cols-6 divide-x divide-white/5">
                      <div className="px-8 py-4">
                        <p className="text-sm font-bold text-white tracking-tight">#{account.account_number}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-mono tracking-tighter">{account.account_name}</p>
                      </div>
                      <div className="px-8 py-4 font-mono text-sm self-center">${account.balance.toLocaleString()}</div>
                      <div className="px-8 py-4 font-mono text-sm text-[#00D1FF] font-bold self-center">${account.equity.toLocaleString()}</div>
                      <div className={`px-8 py-4 font-mono text-sm self-center ${account.daily_pnl >= 0 ? "text-[#27ff97]" : "text-error"}`}>
                        {account.daily_pnl >= 0 ? "+" : ""}${account.daily_pnl.toLocaleString()}
                      </div>
                      <div className="px-8 py-4 self-center">
                        <span className={`text-[10px] font-bold px-2 py-1 border transition-all ${
                          account.account_type === "MASTER"
                            ? "bg-[#1C1B1B] border-[#00D1FF]/30 text-[#00D1FF]"
                            : "bg-[#1C1B1B] border-slate-700 text-slate-400"
                        }`}>
                          {account.account_type}
                        </span>
                      </div>
                      <div className="px-8 py-4 self-center">
                        <div className="flex items-center gap-2">
                          <Circle size={8} fill="#ffb020" className="text-[#ffb020]" />
                          <span className="text-[10px] font-bold uppercase text-[#ffb020]">{account.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0a0f14]/35 backdrop-blur-[1px] transition-colors group-hover:bg-[#0a0f14]/45">
                      <button
                        type="button"
                        title="View account overview"
                        className="pointer-events-auto absolute right-4 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[#11161D]/90 text-slate-200 transition-colors hover:border-[#00D1FF]/60 hover:text-[#00D1FF]"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPendingOverviewClick?.(account);
                        }}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        type="button"
                        className="pointer-events-auto rounded-sm border border-[#00D1FF]/50 bg-[#00D1FF]/15 px-4 py-2 text-xs font-headline font-bold uppercase tracking-widest text-[#00D1FF] shadow-lg backdrop-blur-sm transition-all hover:border-[#00D1FF]/70 hover:bg-[#00D1FF]/25"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPendingConnectionClick?.(account);
                        }}
                      >
                        Complete Account Connection
                      </button>
                    </div>
                  </td>
                ) : (
                  <>
                <td className="px-8 py-4">
                  <p className="text-sm font-bold text-white tracking-tight">#{account.account_number}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-mono tracking-tighter">{account.account_name}</p>
                </td>
                <td className="px-8 py-4 font-mono text-sm">${account.balance.toLocaleString()}</td>
                <td className="px-8 py-4 font-mono text-sm text-[#00D1FF] font-bold">${account.equity.toLocaleString()}</td>
                <td className={`px-8 py-4 font-mono text-sm ${account.daily_pnl >= 0 ? "text-[#27ff97]" : "text-error"}`}>
                  {account.daily_pnl >= 0 ? "+" : ""}${account.daily_pnl.toLocaleString()}
                </td>
                <td className="px-8 py-4">
                  <span className={`text-[10px] font-bold px-2 py-1 border transition-all ${
                    account.account_type === 'MASTER' 
                      ? "bg-[#1C1B1B] border-[#00D1FF]/30 text-[#00D1FF]" 
                      : "bg-[#1C1B1B] border-slate-700 text-slate-400"
                  }`}>
                    {account.account_type}
                  </span>
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-2">
                    <Circle size={8} fill={account.status === 'connected' ? "#27ff97" : "#ff4d4d"} className={account.status === 'connected' ? "text-[#27ff97]" : "text-error"} />
                    <span className={`text-[10px] font-bold uppercase ${account.status === 'connected' ? "text-[#27ff97]" : "text-error"}`}>
                      {account.status}
                    </span>
                  </div>
                </td>
                  </>
                )}
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center text-slate-500 font-mono text-xs uppercase tracking-widest">
                  No account infrastructure detected
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {accounts.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between border-t border-white/5 bg-[#101820] px-4 py-3 sm:px-8">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
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
    </section>
  );
};

export default AccountsTableV2;
