import { Circle } from "lucide-react";

interface Account {
  id: string;
  account_number: string;
  account_name: string;
  balance: number;
  equity: number;
  daily_pnl: number;
  account_type: string;
  status: string;
}

const AccountsTableV2 = ({
  accounts = [],
  onRowClick,
}: {
  accounts: Account[];
  onRowClick?: (account: Account) => void;
}) => {
  return (
    <section className="bg-[#11161D] rounded-lg border border-[#859399]/15 overflow-hidden shadow-2xl">
      <div className="flex flex-col gap-3 border-b border-white/5 bg-[#131b25] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <h3 className="font-headline font-bold text-lg uppercase text-white">Account Infrastructure</h3>
        <button className="text-[#00D1FF] text-[10px] font-bold uppercase tracking-widest hover:underline transition-all">View All Metrics</button>
      </div>
      
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
            {accounts.length > 0 ? accounts.map((account) => (
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
    </section>
  );
};

export default AccountsTableV2;
