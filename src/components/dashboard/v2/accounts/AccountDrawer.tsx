import React from "react";
import { X, TrendingUp, Cpu, Settings as SettingsIcon, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Account {
  id: string;
  account_name: string;
  account_number: string;
  balance: number;
  equity: number;
  pnl: number;
}

interface AccountDrawerProps {
  account: Account | null;
  isOpen: boolean;
  onClose: () => void;
  onDisconnect?: (accountId: string) => void;
  disconnecting?: boolean;
}

interface OpenTrade {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  volume: number;
  open_price: number;
  profit: number;
}

const AccountDrawer = ({ account, isOpen, onClose, onDisconnect, disconnecting = false }: AccountDrawerProps) => {
  if (!account) return null;

  const { data: openTrades = [], isLoading: loadingOpenTrades, isError: openTradesError } = useQuery({
    queryKey: ["account-open-trades", account.id],
    queryFn: async (): Promise<OpenTrade[]> => {
      const { data, error } = await supabase
        .from("positions")
        .select(`
          id,
          symbol,
          side,
          volume,
          open_price,
          profit
        `)
        .eq("account_id", account.id)
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return (data || []).map((trade: any) => ({
        id: trade.id,
        symbol: trade.symbol || "N/A",
        type: (String(trade.side || "buy").toUpperCase() === "SELL" ? "SELL" : "BUY") as "BUY" | "SELL",
        volume: Number(trade.volume || 0),
        open_price: Number(trade.open_price || 0),
        profit: Number(trade.profit || 0),
      }));
    },
    enabled: isOpen && !!account.id,
    staleTime: 1000 * 30,
  });

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-[#0E0E0E]/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-[400px] flex-col border-l border-white/5 bg-surface-container shadow-2xl transition-transform duration-500 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/5 bg-[#131b25] p-6">
          <div className="min-w-0 flex flex-1 flex-col pr-2">
            <span className="mb-1 font-headline text-[10px] font-bold uppercase tracking-widest text-[#00D1FF]">
              Account Overview
            </span>
            <h3 className="break-words text-2xl font-bold font-headline tracking-tight text-white">
              {account.account_name}
            </h3>
            <span className="text-[10px] text-gray-500 font-mono tracking-tighter uppercase">ID: {account.account_number}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 text-gray-500 transition-all hover:bg-white/5 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#11161D]">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-4 rounded-sm border border-white/5 shadow-soft">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-headline">Balance</p>
              <p className="text-xl font-bold font-headline text-white">${account.balance.toLocaleString()}</p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-sm border border-white/5 shadow-soft">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-headline">Equity</p>
              <p className="text-xl font-bold font-headline text-white">${account.equity.toLocaleString()}</p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-sm border border-white/5 col-span-2 shadow-soft">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-headline">Floating PnL</p>
              <p className={`${account.pnl >= 0 ? "text-secondary-container" : "text-error"} text-xl font-bold font-headline`}>
                {account.pnl >= 0 ? "+" : ""}${account.pnl.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Performance Chart Placeholder */}
          <div className="space-y-3">
            <p className="text-xs font-headline font-bold uppercase tracking-widest text-[#bbc9cf]/80 flex items-center gap-2">
              <TrendingUp size={14} />
              24H Performance
            </p>
            <div className="h-32 w-full bg-surface-container-lowest flex items-end px-2 overflow-hidden relative border border-white/5 shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-t from-[#00D1FF]/10 to-transparent"></div>
              {/* Sparklines */}
              {[20, 25, 22, 35, 45, 55, 48, 65, 80, 75, 85, 95].map((h, i) => (
                <div 
                  key={i} 
                  className={`flex-1 mx-[1px] bg-[#00D1FF] transition-all hover:brightness-110 ${i > 7 ? "bg-[#00D1FF]" : "bg-[#00D1FF]/40"}`} 
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Open Trades Summary */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs font-headline font-bold uppercase tracking-widest text-[#bbc9cf]/80 flex items-center gap-2">
                <Cpu size={14} />
                Open Trades ({openTrades.length})
              </p>
              <button className="text-[10px] text-[#00D1FF] hover:underline font-headline font-bold uppercase tracking-wider">View All</button>
            </div>
            <div className="space-y-2">
              {loadingOpenTrades ? (
                <p className="text-center text-slate-500 text-[10px] uppercase font-mono py-5 tracking-widest border border-dashed border-white/10 rounded">
                  Loading open trades...
                </p>
              ) : openTradesError ? (
                <p className="text-center text-error text-[10px] uppercase font-mono py-5 tracking-widest border border-dashed border-error/30 rounded">
                  Failed to load open trades
                </p>
              ) : openTrades.length > 0 ? (
                openTrades.map((trade) => (
                  <TradeItem
                    key={trade.id}
                    symbol={trade.symbol}
                    type={trade.type}
                    lot={trade.volume}
                    price={trade.open_price}
                    profit={trade.profit}
                  />
                ))
              ) : (
                <p className="text-center text-slate-500 text-[10px] uppercase font-mono py-5 tracking-widest border border-dashed border-white/10 rounded">
                  No open trades
                </p>
              )}
            </div>
          </div>

          {/* Copy Settings Toggle */}
          <div className="space-y-4">
            <p className="text-xs font-headline font-bold uppercase tracking-widest text-[#bbc9cf]/80 flex items-center gap-2">
              <SettingsIcon size={14} />
              Execution Settings
            </p>
            <div className="space-y-4 bg-surface-container-low p-4 rounded-sm border border-white/5">
              <ToggleRow label="Allow Copying" description="Broadcast signals from this account" active />
              <ToggleRow label="Sync Orders" description="Real-time execution synchronization" active />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 mt-auto border-t border-white/5 bg-[#131b25]">
          <button className="w-full bg-[#353534] text-white font-headline font-bold py-3 rounded-sm text-xs mb-3 hover:bg-[#3C494E] border border-white/5 shadow-soft tracking-widest transition-all uppercase">
            Configure Risk Engine
          </button>
          <button
            onClick={() => account?.id && onDisconnect?.(account.id)}
            disabled={disconnecting}
            className="w-full bg-error/10 text-error font-headline font-bold py-3 rounded-sm text-xs border border-error/20 hover:bg-error/20 tracking-widest transition-all uppercase flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <AlertTriangle size={14} />
            {disconnecting ? "Removing..." : "Disconnect Account"}
          </button>
        </div>
      </aside>
    </>
  );
};

const TradeItem = ({ symbol, type, lot, price, profit }: any) => (
  <div className="p-3 bg-surface-container-lowest flex items-center justify-between border border-white/5 rounded-sm hover:border-[#00D1FF]/20 transition-all transition-colors cursor-default">
    <div className="flex items-center gap-3">
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${type === 'BUY' ? "bg-secondary-container/10 text-secondary-container" : "bg-error/10 text-error"}`}>{type}</span>
      <div className="flex flex-col">
        <span className="text-xs font-bold font-headline text-white">{symbol}</span>
        <span className="text-[10px] text-slate-500 font-mono tracking-tight">{lot} Lot • @{price}</span>
      </div>
    </div>
    <span className={`text-xs font-bold font-headline animate-pulse tracking-tight ${profit >= 0 ? "text-secondary-container" : "text-error"}`}>
      {profit >= 0 ? "+" : ""}${profit.toLocaleString()}
    </span>
  </div>
);

const ToggleRow = ({ label, description, active }: any) => (
  <div className="flex items-center justify-between group">
    <div className="flex flex-col">
      <span className="text-xs font-bold text-white tracking-tight">{label}</span>
      <span className="text-[10px] text-gray-500 font-mono tracking-tight">{description}</span>
    </div>
    <div className={`w-8 h-4 rounded-full relative flex items-center px-0.5 transition-colors cursor-pointer ${active ? "bg-[#00D1FF]" : "bg-slate-700"}`}>
      <div className={`w-3 h-3 rounded-full shadow-lg transition-transform ${active ? "bg-[#003543] ml-auto" : "bg-slate-400"}`}></div>
    </div>
  </div>
);

export default AccountDrawer;
