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
}

interface AccountTableProps {
  accounts: Account[];
  onManage: (account: Account) => void;
}

const AccountTable = ({ accounts, onManage }: AccountTableProps) => {
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
