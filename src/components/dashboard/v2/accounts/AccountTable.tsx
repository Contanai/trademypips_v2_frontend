import React from "react";
import { Circle } from "lucide-react";

interface Account {
  id: string;
  account_number: string;
  account_name: string;
  broker: string;
  balance: number;
  equity: number;
  pnl: number;
  status: string;
  role: string;
  relationship: string;
  vnc_host?: string | null;
  vnc_port?: number | string | null;
}

interface AccountTableProps {
  accounts: Account[];
  onManage: (account: Account) => void;
  onPendingConnectionClick?: (account: Account) => void;
}

const AccountTable = ({ accounts, onManage, onPendingConnectionClick }: AccountTableProps) => {
  return (
    <div className="bg-surface-container-low ghost-border shadow-2xl min-w-0 max-w-full overflow-x-auto overscroll-x-contain">
      <table className="w-full min-w-[920px] text-left font-label text-xs">
        <thead className="bg-[#0E0E0E] text-slate-500 font-headline uppercase tracking-tighter border-none">
          <tr>
            <th className="px-6 py-4 font-bold">Account</th>
            <th className="px-6 py-4 font-bold">Broker</th>
            <th className="px-6 py-4 text-right font-bold">Balance</th>
            <th className="px-6 py-4 text-right font-bold">Equity</th>
            <th className="px-6 py-4 text-right font-bold">PnL</th>
            <th className="px-6 py-4 font-bold">Status</th>
            <th className="px-6 py-4 font-bold">Role</th>
            <th className="px-6 py-4 font-bold">Relationship</th>
            <th className="px-6 py-4 text-right font-bold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {accounts.length > 0 ? accounts.map((account) => (
            <tr 
              key={account.id} 
              className="hover:bg-surface-container-high transition-all cursor-pointer group"
              onClick={() => onManage(account)}
            >
              {account.status === "pending" ? (
                <td colSpan={9} className="relative p-0">
                  <div className="grid min-h-[88px] grid-cols-9 divide-x divide-white/5">
                    <div className="min-w-0 px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface font-headline text-sm tracking-tight">{account.account_name}</span>
                        <span className="text-[10px] text-gray-500 font-mono tracking-tighter uppercase">{account.account_number}</span>
                      </div>
                    </div>
                    <div className="px-6 py-5 text-gray-400 font-medium self-center">{account.broker || "MetaTrader"}</div>
                    <div className="px-6 py-5 text-right font-headline font-medium text-white self-center">${account.balance.toLocaleString()}</div>
                    <div className="px-6 py-5 text-right font-headline font-medium text-white self-center">${account.equity.toLocaleString()}</div>
                    <div className={`px-6 py-5 text-right font-headline font-bold self-center ${account.pnl >= 0 ? "text-secondary-container" : "text-error"}`}>
                      {account.pnl >= 0 ? "+" : ""}${account.pnl.toLocaleString()}
                    </div>
                    <div className="px-6 py-5 self-center">
                      <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#ffb020]/30 bg-surface-container-lowest px-2 py-0.5 text-[10px] font-bold text-[#ffb020]">
                        <Circle size={6} fill="currentColor" />
                        {account.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="px-6 py-5 self-center">
                      <span className={`rounded-sm border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${
                        account.role === "Master"
                          ? "border-primary-container/20 bg-primary-container/10 text-primary-container"
                          : "border-tertiary-container/20 bg-tertiary-container/10 text-tertiary-container"
                      }`}>
                        {account.role}
                      </span>
                    </div>
                    <div className="px-6 py-5 self-center text-slate-500 font-mono text-[10px] italic">{account.relationship}</div>
                    <div className="px-6 py-5 text-right self-center">
                      <span className="font-headline font-bold text-[#00D1FF]/50">Manage →</span>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0a0f14]/35 backdrop-blur-[1px] transition-colors group-hover:bg-[#0a0f14]/45">
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
              <td className="px-6 py-5">
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface font-headline text-sm tracking-tight">{account.account_name}</span>
                  <span className="text-[10px] text-gray-500 font-mono tracking-tighter uppercase">{account.account_number}</span>
                </div>
              </td>
              <td className="px-6 py-5 text-gray-400 font-medium">{account.broker || "MetaTrader"}</td>
              <td className="px-6 py-5 text-right font-headline font-medium text-white">${account.balance.toLocaleString()}</td>
              <td className="px-6 py-5 text-right font-headline font-medium text-white">${account.equity.toLocaleString()}</td>
              <td className={`px-6 py-5 text-right font-headline font-bold ${account.pnl >= 0 ? "text-secondary-container" : "text-error"}`}>
                {account.pnl >= 0 ? "+" : ""}${account.pnl.toLocaleString()}
              </td>
              <td className="px-6 py-5">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-surface-container-lowest text-[10px] font-bold border transition-colors ${
                  account.status === 'connected' 
                    ? "text-secondary-container border-[#27ff97]/20" 
                    : "text-error border-[#ffb4ab]/20"
                }`}>
                  <Circle size={6} fill="currentColor" className={account.status === 'connected' ? "animate-pulse" : ""} />
                  {account.status.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-5">
                <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-widest uppercase border ${
                  account.role === 'Master' 
                    ? "bg-primary-container/10 text-primary-container border-primary-container/20" 
                    : "bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20"
                }`}>
                  {account.role}
                </span>
              </td>
              <td className="px-6 py-5 text-slate-500 italic font-mono text-[10px]">
                {account.relationship}
              </td>
              <td className="px-6 py-5 text-right">
                <button 
                  className="text-primary-container font-headline font-bold hover:underline hover:scale-105 transition-all text-[#00D1FF]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onManage(account);
                  }}
                >
                  Manage →
                </button>
              </td>
                </>
              )}
            </tr>
          )) : (
            <tr>
              <td colSpan={9} className="px-6 py-20 text-center text-slate-600 font-mono text-[10px] uppercase tracking-widest border border-dashed border-white/5 rounded-lg m-4">
                Scanning institutional data streams...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AccountTable;
