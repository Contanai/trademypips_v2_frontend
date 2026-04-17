import DashboardLayoutV2 from "@/components/dashboard/v2/DashboardLayoutV2";

const HistoryPageV2 = () => {
  return (
    <DashboardLayoutV2>
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-headline font-bold tracking-tighter text-on-surface mb-2 text-[#e5e2e1]">History</h2>
          <p className="text-gray-400 font-body text-sm tracking-wide">Track performance and trade activity across your accounts</p>
        </div>
        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#1c1b1b] px-3 py-2 rounded-sm border border-[#3c494e]/10">
            <span className="text-[10px] font-headline text-gray-500 uppercase mr-3">Account</span>
            <select className="bg-transparent border-none focus:ring-0 text-sm font-headline text-[#a4e6ff] p-0 pr-8 cursor-pointer appearance-none">
              <option className="bg-[#131313]">All Accounts</option>
              <option className="bg-[#131313]">MT5-001</option>
              <option className="bg-[#131313]">MT5-002</option>
            </select>
          </div>
          <div className="flex items-center bg-[#1c1b1b] px-3 py-2 rounded-sm border border-[#3c494e]/10">
            <span className="material-symbols-outlined text-sm text-gray-500 mr-2">calendar_today</span>
            <span className="text-sm font-headline text-[#e5e2e1]">Jan 01 - Mar 25, 2024</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#353534] hover:bg-[#2a2a2a] transition-colors text-xs font-headline font-bold tracking-widest text-[#a4e6ff] uppercase border border-[#a4e6ff]/20 rounded-sm">
            <span className="material-symbols-outlined text-sm">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Analytics Overview: Metric Monoliths */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-[#1c1b1b] p-6 border-l-2 border-[#00d1ff] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-6xl">payments</span>
          </div>
          <p className="text-[10px] font-headline font-bold text-gray-500 tracking-[0.2em] uppercase mb-1">Total Profit</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-headline font-bold text-[#27ff97]">+$2,340</h3>
            <span className="text-[10px] font-headline text-[#f5fff3] mb-1.5">+14.2%</span>
          </div>
        </div>
        <div className="bg-[#1c1b1b] p-6 border-l-2 border-[#a4e6ff] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-6xl">target</span>
          </div>
          <p className="text-[10px] font-headline font-bold text-gray-500 tracking-[0.2em] uppercase mb-1">Win Rate</p>
          <h3 className="text-3xl font-headline font-bold text-[#a4e6ff]">68%</h3>
        </div>
        <div className="bg-[#1c1b1b] p-6 border-l-2 border-[#3c494e] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-6xl">swap_horiz</span>
          </div>
          <p className="text-[10px] font-headline font-bold text-gray-500 tracking-[0.2em] uppercase mb-1">Trades</p>
          <h3 className="text-3xl font-headline font-bold text-[#e5e2e1]">142</h3>
        </div>
        <div className="bg-[#1c1b1b] p-6 border-l-2 border-[#ffb4ab] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-6xl">trending_down</span>
          </div>
          <p className="text-[10px] font-headline font-bold text-gray-500 tracking-[0.2em] uppercase mb-1">Max Drawdown</p>
          <h3 className="text-3xl font-headline font-bold text-[#ffb4ab]">-12%</h3>
        </div>
      </div>

      {/* Performance Chart & Equity Curve */}
      <div className="mb-10 grid grid-cols-1 gap-6">
        <div className="w-full min-w-0 rounded-sm bg-[#1c1b1b] p-6 sm:p-8">
          <div className="mb-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h4 className="text-sm font-headline font-bold tracking-widest text-[#e5e2e1] uppercase flex items-center gap-2">
                Equity Curve
                <span className="w-2 h-2 rounded-full bg-[#27ff97] inline-block shadow-[0_0_8px_#27FF97]"></span>
              </h4>
              <p className="text-[10px] font-body text-gray-500 mt-1">Net cumulative return over selected period</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input defaultChecked className="w-3 h-3 bg-transparent border-[#a4e6ff]/40 rounded-sm text-[#a4e6ff] focus:ring-0 checked:bg-[#a4e6ff]" type="checkbox"/>
                  <span className="text-[10px] font-headline text-gray-400 group-hover:text-[#a4e6ff] transition-colors uppercase">Show Balance</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input defaultChecked className="w-3 h-3 bg-transparent border-[#27ff97]/40 rounded-sm text-[#27ff97] focus:ring-0 checked:bg-[#27ff97]" type="checkbox"/>
                  <span className="text-[10px] font-headline text-gray-400 group-hover:text-[#27ff97] transition-colors uppercase">Show Equity</span>
                </label>
              </div>
              <div className="inline-flex flex-wrap items-center gap-[2px] rounded-sm bg-[#0e0e0e] p-1 text-[#e5e2e1]">
                <button className="px-4 py-1 text-[10px] font-headline font-bold text-gray-500 hover:text-[#e5e2e1] transition-colors uppercase">7D</button>
                <button className="px-4 py-1 text-[10px] font-headline font-bold text-[#a4e6ff] bg-[#353534] rounded-sm uppercase">30D</button>
                <button className="px-4 py-1 text-[10px] font-headline font-bold text-gray-500 hover:text-[#e5e2e1] transition-colors uppercase">90D</button>
                <button className="px-4 py-1 text-[10px] font-headline font-bold text-gray-500 hover:text-[#e5e2e1] transition-colors uppercase">All</button>
              </div>
            </div>
          </div>
          {/* Simulated Equity Chart — horizontal pan on small screens */}
          <div className="min-w-0 overflow-x-auto overscroll-x-contain">
            <div className="relative h-[280px] w-full min-w-[880px] md:min-w-0 md:h-[340px]">
            {/* Y-Axis Labels */}
            <div className="pointer-events-none absolute left-0 top-0 flex h-full flex-col justify-between font-headline text-[10px] text-gray-600">
              <span>$50,000</span>
              <span>$45,000</span>
              <span>$40,000</span>
              <span>$35,000</span>
              <span>$30,000</span>
            </div>
            {/* Chart Graphic (SVG Implementation) */}
            <div className="relative ml-12 h-full min-w-0">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-1">
                <div className="w-full h-px bg-white/5"></div>
                <div className="w-full h-px bg-white/5"></div>
                <div className="w-full h-px bg-white/5"></div>
                <div className="w-full h-px bg-white/5"></div>
                <div className="w-full h-px bg-white/5"></div>
              </div>
              {/* Equity Line (Main) */}
              <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00D1FF" stopOpacity="0.1"></stop>
                    <stop offset="100%" stopColor="#00D1FF" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M 0 300 L 100 280 L 200 290 L 300 250 L 400 260 L 500 200 L 600 220 L 700 180 L 800 150 L 900 100 L 1000 120" fill="none" stroke="#00D1FF" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                <path d="M 0 300 L 100 280 L 200 290 L 300 250 L 400 260 L 500 200 L 600 220 L 700 180 L 800 150 L 900 100 L 1000 120 L 1000 340 L 0 340 Z" fill="url(#chartGradient)" vectorEffect="non-scaling-stroke"></path>
                {/* Current Price Marker */}
                <circle cx="1000" cy="120" fill="#00D1FF" r="4"></circle>
              </svg>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trade History Section */}
      <div className="bg-[#1c1b1b] rounded-sm">
        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5">
          <h4 className="text-sm font-headline font-bold tracking-widest text-[#e5e2e1] uppercase">Trade Log</h4>
          <div className="flex items-center gap-1 bg-[#0e0e0e] p-1 rounded-sm text-[#e5e2e1]">
            <button className="px-4 py-1 text-[10px] font-headline font-bold text-[#a4e6ff] bg-[#353534] rounded-sm uppercase">All Trades</button>
            <button className="px-4 py-1 text-[10px] font-headline font-bold text-gray-500 hover:text-[#e5e2e1] transition-colors uppercase">Wins</button>
            <button className="px-4 py-1 text-[10px] font-headline font-bold text-gray-500 hover:text-[#e5e2e1] transition-colors uppercase">Losses</button>
            <button className="px-4 py-1 text-[10px] font-headline font-bold text-gray-500 hover:text-[#e5e2e1] transition-colors uppercase">Open</button>
          </div>
        </div>
        {/* Trade History Table */}
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
              {/* Trade Row 1 */}
              <tr className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-5 whitespace-nowrap text-gray-400">Mar 24, 2024 14:22</td>
                <td className="px-6 py-5 whitespace-nowrap font-bold text-[#b7eaff]">MT5-001</td>
                <td className="px-6 py-5 whitespace-nowrap font-bold">XAUUSD</td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="px-2 py-1 bg-[#27ff97]/10 text-[#27ff97] text-[10px] font-bold rounded-sm uppercase">Buy</span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right font-mono">1.25</td>
                <td className="px-6 py-5 whitespace-nowrap text-right font-bold text-[#27ff97]">+$1,420.50</td>
                <td className="px-8 py-5 text-center">
                  <span className="material-symbols-outlined text-[#27ff97] text-lg">check_circle</span>
                </td>
              </tr>
              {/* Trade Row 2 */}
              <tr className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-5 whitespace-nowrap text-gray-400">Mar 24, 2024 10:15</td>
                <td className="px-6 py-5 whitespace-nowrap font-bold text-[#b7eaff]">MT5-001</td>
                <td className="px-6 py-5 whitespace-nowrap font-bold">EURUSD</td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="px-2 py-1 bg-[#93000a]/20 text-[#ffb4ab] text-[10px] font-bold rounded-sm uppercase">Sell</span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right font-mono">0.50</td>
                <td className="px-6 py-5 whitespace-nowrap text-right font-bold text-[#ffb4ab]">-$340.20</td>
                <td className="px-8 py-5 text-center">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-lg">cancel</span>
                </td>
              </tr>
              {/* Trade Row 3 */}
              <tr className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-5 whitespace-nowrap text-gray-400">Mar 23, 2024 22:40</td>
                <td className="px-6 py-5 whitespace-nowrap font-bold text-[#b7eaff]">MT5-002</td>
                <td className="px-6 py-5 whitespace-nowrap font-bold">BTCUSD</td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="px-2 py-1 bg-[#27ff97]/10 text-[#27ff97] text-[10px] font-bold rounded-sm uppercase">Buy</span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right font-mono">0.10</td>
                <td className="px-6 py-5 whitespace-nowrap text-right font-bold text-[#27ff97]">+$890.15</td>
                <td className="px-8 py-5 text-center">
                  <span className="material-symbols-outlined text-[#27ff97] text-lg">check_circle</span>
                </td>
              </tr>
              {/* Trade Row 4 */}
              <tr className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-5 whitespace-nowrap text-gray-400">Mar 23, 2024 18:12</td>
                <td className="px-6 py-5 whitespace-nowrap font-bold text-[#b7eaff]">MT5-001</td>
                <td className="px-6 py-5 whitespace-nowrap font-bold">GBPUSD</td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="px-2 py-1 bg-[#27ff97]/10 text-[#27ff97] text-[10px] font-bold rounded-sm uppercase">Buy</span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right font-mono">2.00</td>
                <td className="px-6 py-5 whitespace-nowrap text-right font-bold text-[#a4e6ff]">+$12.50</td>
                <td className="px-8 py-5 text-center">
                  <span className="px-2 py-0.5 border border-[#a4e6ff]/40 text-[#a4e6ff] text-[8px] font-bold tracking-tighter uppercase rounded-full">Active</span>
                </td>
              </tr>
              {/* Trade Row 5 */}
              <tr className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-5 whitespace-nowrap text-gray-400">Mar 22, 2024 09:30</td>
                <td className="px-6 py-5 whitespace-nowrap font-bold text-[#b7eaff]">MT5-002</td>
                <td className="px-6 py-5 whitespace-nowrap font-bold">US30</td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="px-2 py-1 bg-[#93000a]/20 text-[#ffb4ab] text-[10px] font-bold rounded-sm uppercase">Sell</span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right font-mono">0.05</td>
                <td className="px-6 py-5 whitespace-nowrap text-right font-bold text-[#ffb4ab]">-$1,120.00</td>
                <td className="px-8 py-5 text-center">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-lg">cancel</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Table Footer/Pagination */}
        <div className="p-6 flex justify-between items-center text-[10px] font-headline text-gray-500 uppercase tracking-widest border-t border-white/5">
          <span>Showing 1-10 of 142 Trades</span>
          <div className="flex items-center gap-4">
            <button className="hover:text-[#a4e6ff] transition-colors disabled:opacity-30" disabled>
              <span className="material-symbols-outlined text-sm">arrow_back_ios</span>
            </button>
            <div className="flex gap-2">
              <button className="text-[#a4e6ff] font-bold underline">1</button>
              <button className="hover:text-[#a4e6ff]">2</button>
              <button className="hover:text-[#a4e6ff]">3</button>
              <span>...</span>
              <button className="hover:text-[#a4e6ff]">15</button>
            </div>
            <button className="hover:text-[#a4e6ff] transition-colors">
              <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayoutV2>
  );
};

export default HistoryPageV2;
