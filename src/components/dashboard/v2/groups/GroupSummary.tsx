import React from "react";

interface GroupSummaryProps {
  activeGroups: number;
  totalCopiers: number;
  tradesToday: number;
  avgLatency: number;
}

const GroupSummary = ({
  activeGroups = 0,
  totalCopiers = 0,
  tradesToday = 0,
  avgLatency = 0,
}: GroupSummaryProps) => {
  const items = [
    { label: "Active Groups", value: activeGroups },
    { label: "Copiers", value: totalCopiers },
    { label: "Trades Today", value: tradesToday },
    { label: "Avg Latency", value: `${avgLatency}ms`, isHighlight: true },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {items.map((item) => (
        <div 
          key={item.label} 
          className="bg-surface-container-low p-6 rounded-sm border-l-2 border-primary/20 transition-all hover:bg-surface-container-high hover:border-primary/40 cursor-default"
        >
          <div className="text-gray-500 text-xs uppercase font-label tracking-widest mb-2 font-headline">{item.label}</div>
          <div className={`text-3xl font-headline tracking-tighter ${item.isHighlight ? "text-[#00D1FF]" : "text-secondary font-bold"}`}>
            {item.value}
          </div>
        </div>
      ))}
    </section>
  );
};

export default GroupSummary;
