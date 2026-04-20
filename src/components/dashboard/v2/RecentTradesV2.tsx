import React from "react";
import { ReceiptText } from "lucide-react";

interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  open_price: number;
  profit: number;
  time_ago: string;
}

const renderTradeRows = (items: Trade[], emptyLabel: string) => {
  if (items.length === 0) {
    return (
      <p className="text-center text-slate-500 text-[10px] uppercase font-mono py-8 tracking-widest border border-dashed border-white/10 rounded">
        {emptyLabel}
      </p>
    );
  }

  return items.map((trade) => (
    <div key={trade.id} className="flex items-center justify-between p-3 bg-[#0E0E0E] border border-white/5 rounded transition-all hover:bg-[#1C1B1B]">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 flex items-center justify-center font-bold font-headline text-xs ${
          trade.type === 'BUY' ? "text-[#27ff97] bg-[#27ff97]/10" : "text-error bg-error/10"
        }`}>
          {trade.type}
        </div>
        <div>
          <p className="text-xs font-bold text-white uppercase tracking-wider">{trade.symbol}</p>
          <p className="text-[10px] font-mono text-slate-500">{trade.volume.toFixed(2)} Lots • {trade.open_price}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-xs font-bold ${trade.profit >= 0 ? "text-[#27ff97]" : "text-error"}`}>
          {trade.profit >= 0 ? "+" : ""}${trade.profit.toLocaleString()}
        </p>
        <p className="text-[10px] font-mono text-slate-500">{trade.time_ago}</p>
      </div>
    </div>
  ));
};

const RecentTradesV2 = ({ openTrades = [], trades = [] }: { openTrades?: Trade[]; trades: Trade[] }) => {
  return (
    <section className="bg-surface-container-low rounded-lg p-6 border border-[#859399]/15 shadow-xl">
      <h3 className="font-headline font-bold text-lg uppercase mb-4 flex items-center justify-between text-white">
        Open Trades
        <ReceiptText size={20} className="text-slate-500" />
      </h3>
      <div className="space-y-4">
        {renderTradeRows(openTrades, "No open trades")}
      </div>

      <div className="my-6 border-t border-white/10" />

      <h3 className="font-headline font-bold text-lg uppercase mb-6 flex items-center justify-between text-white">
        Recent Trades
        <ReceiptText size={20} className="text-slate-500" />
      </h3>
      <div className="space-y-4">
        {renderTradeRows(trades, "Scanning transaction history...")}
      </div>
    </section>
  );
};

export default RecentTradesV2;
