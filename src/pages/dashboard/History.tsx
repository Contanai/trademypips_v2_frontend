import DashboardLayoutV2 from "@/components/dashboard/v2/DashboardLayoutV2";
import { useMemo, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useAccounts, useOpenPositionsHistory, useTradeHistory } from "@/hooks/v2/useDashboardData";

type TradeFilter = "All" | "Wins" | "Losses" | "Open";

const HistoryPageV2 = () => {
  const { userId } = useUser();
  const { data: accounts = [] } = useAccounts(userId);
  const { data: tradesRaw = [], isLoading } = useTradeHistory(userId);
  const { data: openPositionsRaw = [], isLoading: isLoadingOpenPositions } = useOpenPositionsHistory(userId);
  const [activeFilter, setActiveFilter] = useState<TradeFilter>("All");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");

  const closedTrades = useMemo(() => {
    return (tradesRaw as any[]).map((row) => {
      const account = row.trading_accounts ?? {};
      const profit = Number(row.profit ?? 0);
      const type = String(row.side ?? "buy").toUpperCase() === "SELL" ? "SELL" : "BUY";
      const accountNumber = String(account.account_number ?? "");

      return {
        id: String(row.id),
        accountId: String(account.id ?? ""),
        accountLabel: account.account_name || `MT5-${accountNumber.slice(-4)}`,
        symbol: String(row.symbol ?? "N/A").toUpperCase(),
        type,
        volume: Number(row.volume ?? 0),
        profit,
        status: "closed" as const,
        closeTime: (row.close_time as string | undefined) ?? (row.created_at as string | undefined),
      };
    });
  }, [tradesRaw]);

  const openPositions = useMemo(() => {
    return (openPositionsRaw as any[]).map((row) => {
      const account = row.trading_accounts ?? {};
      const accountNumber = String(account.account_number ?? "");
      const profit = Number(row.unrealized_pnl ?? row.profit ?? 0);
      const type = String(row.side ?? row.type ?? "buy").toUpperCase() === "SELL" ? "SELL" : "BUY";

      return {
        id: `open-${String(row.id)}`,
        accountId: String(row.account_id ?? ""),
        accountLabel: account.account_name || `MT5-${accountNumber.slice(-4)}`,
        symbol: String(row.symbol ?? "N/A").toUpperCase(),
        type,
        volume: Number(row.volume ?? 0),
        profit,
        status: "open" as const,
        closeTime: (row.open_time as string | undefined) ?? (row.created_at as string | undefined),
      };
    });
  }, [openPositionsRaw]);

  const trades = useMemo(() => {
    return [...openPositions, ...closedTrades].sort((a, b) => {
      const at = a.closeTime ? new Date(a.closeTime).getTime() : 0;
      const bt = b.closeTime ? new Date(b.closeTime).getTime() : 0;
      return bt - at;
    });
  }, [openPositions, closedTrades]);

  const filteredTrades = useMemo(() => {
    let rows = trades;
    if (selectedAccountId !== "all") rows = rows.filter((row) => row.accountId === selectedAccountId);
    if (activeFilter === "Wins") rows = rows.filter((row) => row.profit > 0);
    if (activeFilter === "Losses") rows = rows.filter((row) => row.profit < 0);
    if (activeFilter === "Open") rows = rows.filter((row) => row.status === "open");
    return rows;
  }, [trades, selectedAccountId, activeFilter]);

  const stats = useMemo(() => {
    const closed = filteredTrades.filter((trade) => trade.status === "closed");
    const totalProfit = closed.reduce((sum, trade) => sum + trade.profit, 0);
    const wins = closed.filter((trade) => trade.profit > 0).length;
    const winRate = closed.length > 0 ? (wins / closed.length) * 100 : 0;
    return { totalProfit, winRate, totalTrades: filteredTrades.length };
  }, [filteredTrades]);

  const formatDate = (value?: string) => {
    if (!value) return "Unknown";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "Unknown";
    return d.toLocaleString([], { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <DashboardLayoutV2>
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-headline font-bold tracking-tighter text-on-surface mb-2 text-[#e5e2e1]">History</h2>
          <p className="text-gray-400 font-body text-sm tracking-wide">Track performance and trade activity across your accounts</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#1c1b1b] px-3 py-2 rounded-sm border border-[#3c494e]/10">
            <span className="text-[10px] font-headline text-gray-500 uppercase mr-3">Account</span>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-headline text-[#a4e6ff] p-0 pr-8 cursor-pointer appearance-none"
            >
              <option className="bg-[#131313]" value="all">All Accounts</option>
              {(accounts as any[]).map((account) => (
                <option key={account.id} className="bg-[#131313]" value={account.id}>
                  {account.account_name || `MT5-${String(account.account_number ?? "").slice(-4)}`}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center bg-[#1c1b1b] px-3 py-2 rounded-sm border border-[#3c494e]/10">
            <span className="material-symbols-outlined text-sm text-gray-500 mr-2">calendar_today</span>
            <span className="text-sm font-headline text-[#e5e2e1]">Live history range</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#1c1b1b] p-6 border-l-2 border-[#00d1ff]">
          <p className="text-[10px] font-headline font-bold text-gray-500 tracking-[0.2em] uppercase mb-1">Total Profit</p>
          <h3 className={`text-3xl font-headline font-bold ${stats.totalProfit >= 0 ? "text-[#27ff97]" : "text-[#ffb4ab]"}`}>
            {stats.totalProfit >= 0 ? "+" : ""}${stats.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="bg-[#1c1b1b] p-6 border-l-2 border-[#a4e6ff]">
          <p className="text-[10px] font-headline font-bold text-gray-500 tracking-[0.2em] uppercase mb-1">Win Rate</p>
          <h3 className="text-3xl font-headline font-bold text-[#a4e6ff]">{stats.winRate.toFixed(1)}%</h3>
        </div>
        <div className="bg-[#1c1b1b] p-6 border-l-2 border-[#3c494e]">
          <p className="text-[10px] font-headline font-bold text-gray-500 tracking-[0.2em] uppercase mb-1">Trades</p>
          <h3 className="text-3xl font-headline font-bold text-[#e5e2e1]">{stats.totalTrades}</h3>
        </div>
      </div>

      <div className="bg-[#1c1b1b] rounded-sm">
        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5">
          <h4 className="text-sm font-headline font-bold tracking-widest text-[#e5e2e1] uppercase">Trade Log</h4>
          <div className="flex items-center gap-1 bg-[#0e0e0e] p-1 rounded-sm text-[#e5e2e1]">
            {(["All", "Wins", "Losses", "Open"] as TradeFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1 text-[10px] font-headline font-bold rounded-sm uppercase transition-colors ${
                  activeFilter === filter ? "text-[#a4e6ff] bg-[#353534]" : "text-gray-500 hover:text-[#e5e2e1]"
                }`}
              >
                {filter === "All" ? "All Trades" : filter}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto text-[#e5e2e1]">
          <table className="w-full text-left font-headline">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-widest">
                <th className="px-8 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Account</th>
                <th className="px-6 py-4 font-medium">Symbol</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium text-right">Lot</th>
                <th className="px-6 py-4 font-medium text-right">Profit</th>
                <th className="px-8 py-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {isLoading || isLoadingOpenPositions ? (
                <tr><td colSpan={7} className="px-8 py-8 text-center text-gray-500">Loading trade history...</td></tr>
              ) : filteredTrades.length === 0 ? (
                <tr><td colSpan={7} className="px-8 py-8 text-center text-gray-500">No trade records match the current filters.</td></tr>
              ) : (
                filteredTrades.map((trade) => {
                  const isProfit = trade.profit >= 0;
                  return (
                    <tr key={trade.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-5 whitespace-nowrap text-gray-400">{formatDate(trade.closeTime)}</td>
                      <td className="px-6 py-5 whitespace-nowrap font-bold text-[#b7eaff]">{trade.accountLabel}</td>
                      <td className="px-6 py-5 whitespace-nowrap font-bold">{trade.symbol}</td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-sm uppercase ${trade.type === "BUY" ? "bg-[#27ff97]/10 text-[#27ff97]" : "bg-[#93000a]/20 text-[#ffb4ab]"}`}>
                          {trade.type}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right font-mono">{trade.volume.toFixed(2)}</td>
                      <td className={`px-6 py-5 whitespace-nowrap text-right font-bold ${isProfit ? "text-[#27ff97]" : "text-[#ffb4ab]"}`}>
                        {isProfit ? "+" : ""}${trade.profit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-8 py-5 text-center">
                        {trade.status === "open" ? (
                          <span className="px-2 py-0.5 border border-[#a4e6ff]/40 text-[#a4e6ff] text-[8px] font-bold tracking-tighter uppercase rounded-full">Open</span>
                        ) : (
                          <span className={`material-symbols-outlined text-lg ${isProfit ? "text-[#27ff97]" : "text-[#ffb4ab]"}`}>
                            {isProfit ? "check_circle" : "cancel"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 flex justify-between items-center text-[10px] font-headline text-gray-500 uppercase tracking-widest border-t border-white/5">
          <span>Showing {filteredTrades.length} trade(s)</span>
        </div>
      </div>
    </DashboardLayoutV2>
  );
};

export default HistoryPageV2;
