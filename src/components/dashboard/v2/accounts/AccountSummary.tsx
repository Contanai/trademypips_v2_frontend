import React from "react";

interface AccountSummaryProps {
  totalBalance: number;
  totalEquity: number;
  totalPnL: number;
  activeAccounts: number;
  connectedCount: number;
}

const AccountSummary = ({
  totalBalance = 0,
  totalEquity = 0,
  totalPnL = 0,
  activeAccounts = 0,
  connectedCount = 0,
}: AccountSummaryProps) => {
  const items = [
    { label: "Total Balance", value: `$${totalBalance.toLocaleString()}`, subValue: "+2.4% today", subColor: "text-secondary" },
    { label: "Total Equity", value: `$${totalEquity.toLocaleString()}` },
    { label: "Total PnL", value: `${totalPnL >= 0 ? "+" : ""}$${totalPnL.toLocaleString()}`, valueColor: "text-secondary-container" },
    { label: "Active Accounts", value: `${activeAccounts} Accounts` },
    { label: "Status", value: `${connectedCount} Connected`, isStatus: true },
  ];

  return (
    <div className="mb-10 grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="min-w-0 bg-surface-container-low p-4 ghost-border shadow-soft transition-all hover:bg-surface-container-high sm:p-5"
        >
          <p className="mb-2 font-headline text-[10px] uppercase tracking-widest text-gray-500">{item.label}</p>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {item.isStatus && (
              <div className="h-2 w-2 shrink-0 rounded-full bg-secondary-container shadow-[0_0_10px_#27FF97] animate-pulse" />
            )}
            <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2">
              <span
                className={`break-words text-xl font-bold font-headline sm:text-2xl ${item.valueColor || "text-on-surface"}`}
              >
                {item.value}
              </span>
              {item.subValue && (
                <span className={`shrink-0 font-label text-[10px] ${item.subColor}`}>{item.subValue}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountSummary;
