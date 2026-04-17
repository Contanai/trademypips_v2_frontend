interface PortfolioStripProps {
  balance: number;
  equity: number;
  todayPnL: number;
  totalPnL: number;
  winRate: number;
  activeAccounts: number;
}

const PortfolioStrip = ({ 
  balance = 0, 
  equity = 0, 
  todayPnL = 0, 
  totalPnL = 0, 
  winRate = 0, 
  activeAccounts = 0 
}: PortfolioStripProps) => {
  const metrics = [
    { label: "Net Balance", value: `$${balance.toLocaleString()}`, color: "text-white" },
    { label: "Equity", value: `$${equity.toLocaleString()}`, color: "text-[#00D1FF]" },
    { label: "Today PnL", value: `${todayPnL >= 0 ? "+" : ""}$${todayPnL.toLocaleString()}`, color: "text-[#27ff97]" },
    { label: "Total PnL", value: `${totalPnL >= 0 ? "+" : ""}$${totalPnL.toLocaleString()}`, color: "text-[#27ff97]" },
    { label: "Win Rate", value: `${winRate}%`, color: "text-white" },
    { label: "Accounts", value: `${activeAccounts} Active`, color: "text-white" },
  ];

  return (
    <section className="grid min-h-[100px] grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#859399]/15 bg-[#1A1F2A] shadow-2xl sm:grid-cols-3 lg:grid-cols-6">
      {metrics.map((metric) => (
        <div key={metric.label} className="flex flex-col justify-center bg-[#11161D] px-4 py-3 transition-all hover:bg-[#151a23] sm:px-6">
          <span className="text-[10px] font-mono uppercase text-slate-500 mb-1 tracking-wider">{metric.label}</span>
          <span className={`text-xl font-headline font-bold ${metric.color}`}>
            {metric.value}
          </span>
        </div>
      ))}
    </section>
  );
};

export default PortfolioStrip;
