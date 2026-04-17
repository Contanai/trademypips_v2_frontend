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

const RecentTradesV2 = ({ trades = [] }: { trades: Trade[] }) => {
  return (
    <section className="bg-surface-container-low rounded-lg p-6 border border-[#859399]/15 shadow-xl">
      <h3 className="font-headline font-bold text-lg uppercase mb-6 flex items-center justify-between text-white">
        Recent Trades
        <ReceiptText size={20} className="text-slate-500" />
      </h3>
      <div className="space-y-4">
        {trades.length > 0 ? trades.map((trade) => (
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
        )) : (
          <p className="text-center text-slate-500 text-[10px] uppercase font-mono py-8 tracking-widest border border-dashed border-white/10 rounded">
            Scanning transaction history...
          </p>
        )}
      </div>
    </section>
  );
};

export default RecentTradesV2;
