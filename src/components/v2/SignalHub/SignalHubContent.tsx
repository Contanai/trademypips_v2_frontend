import React from 'react';

interface SignalHubContentProps {
  title: string;
  description: string;
}

const SignalHubContent: React.FC<SignalHubContentProps> = ({ title, description }) => {
  const featuredTraders = [
    {
      name: "AlphaFX",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXo9iiCGvPZDKDUsx-OWWsI5pm3GvlTrQrVPdhHhjGtncILqSpseqJdzGRWejevspLZ4Jk-uicVewFKy8JvFRaUyldAXxayt9NSGKmXHDYVxvSG8avE9JSWCiPdoVLb_LsGWqI_n4spB35OUO3Wn9wAG6dWgsHozzKdBV2wkgYjle6m9jQtnoaOKzkodQJFCjOP7iyq-jLsV0NJv3xELFwXQ7g3BhuAwcvi3Kd5ZT-iKkpDoEFwRdMb6asM4-9JwcOr3wMZGCFFyQ",
      roi: "+124.8%",
      winRate: "78%",
      drawdown: "12.4%",
      followers: "1,240",
    },
    {
      name: "QuantQueen",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBXuZXjYWILGR06K01MmIB1OAA2ZjMY-ZM5FI7SOyIfSZO-Q4KaFYslhFOy0YLXg6DE5Ctl4E7USgS0BCCd_Gw8NEfLAxcTm8kMT6Ln5k3SRuzokiQOahBWp63iBsVgyDSJcnxasZJkhMC9gxLBEOqWNyV-rr-xk0mnPZlh93lGn7YBK5xRB4smh1Q0yNZtH4e4K4LAV09s-fix1H9-zuj9JISLGoKaCy3zceR3K4_QM1pquz-ztsQwAHWF0HWCVL7BpLndohQC4w",
      roi: "+98.2%",
      winRate: "82%",
      drawdown: "8.1%",
      followers: "2,105",
    },
    {
      name: "MacroNode",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjGtcPtUW3g8eo8pUaXFgqAImIZ1zQxWP6I34ZgcWHs2qRXmAuaegrPn2J4WB3JoC7uJNwIuaYL5VZfMHvPiLxcxvC4BZY6DdySQDygieeBF2e4AIyiLG3-Ox2o1BRotfhL8RVO7ZBg52UW6ralvq7OG7WjdWfuLDju4u5Ypun4YvDnwSRIk1vg9F4mjfIpWiemWxDFMhrCAhuOmz8j2JV_aUmAv47n_w8i5IWLYOdIohGMCiejio3TQ_8ltyGSSw0HXr8ocNJ7wg",
      roi: "+156.4%",
      winRate: "69%",
      drawdown: "18.2%",
      followers: "942",
    },
  ];

  const standardTraders = [
    {
      name: "DeltaPips",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBp1Gql5V_H0PWj_bzWMneHfLkWZSwaE7H_QO4Q6tiCzO96asd-SnOKsdd8UEmhxjryLmRmWDIhh31FkWkZOhyxk0qzjwe3NBj3Jms2d2xsU7nM4zkjMG-MqOizxpa0tXJV16Xvp10xSuw_2WNUwAIpqsQ7FiNC2U5BM4s-clNTVGf1dbXEIRa_sh3k2fmtwt2t2AKX2Vi0oUWS2D-HJosdsO41ErD9NeKArbsSx6GV5Zsl3Vxamu7dQTBz9IqvmrQnBZXdmS3JL64",
      roi: "+42.1%",
      drawdown: "4.2%",
      winRate: "65%",
      followers: "482",
    },
    {
      name: "ZenTrade",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBW7NtcCOFO9u8vKGhfmS0hRa_ri0drohlaFyed6gp_tfw4bwPIz2vINZbG-Vy6FMHrq8y8Cg-WSWITo6QrK1QFGmEGZaXtQSL30q_B7GhQwuNyveHFVep8ZNEod37Il2oQxcaXQn13B4Jya0yFxRj4Wx3l2K3WXNRaqVhdpApsxVmqcqhZj0l_x5ZGHpWBi2O9IloHaLX3gL-BUEkv2WKKkt_nOjuAB0MyMbGN67-m47bx-ggc971jH3K8UX6GwSoe1sFV4a6_RpQ",
      roi: "+18.5%",
      drawdown: "1.8%",
      winRate: "89%",
      followers: "156",
    },
    {
      name: "Hyperion",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2lWVqBTUEWmrtVzXR-2HJqf_XFurYhZGV4cjzqoE-PGmEhB7MEXoRYwdzI74cDozDwpvjk2fSjQlufIE4zW_qwmlkTuGB72xazva87KWLCJr1FFVszYMgWdo0z_GeWK2x6czEZgVrPGzSZFE-RP89NoF5Kh13zQ-pGrTblJi80Opnz2EyQvQU77S9yjeIftzBSIUAdYiJritRYgMv0SarRcHWCmkhHVfsts6WIQ-6nSyUJm3yauWYcySwBFEaVr_m1u5ekSWS2XM",
      roi: "+65.9%",
      drawdown: "9.5%",
      winRate: "71%",
      followers: "890",
    },
    {
      name: "VaultQuant",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjRctJafSVz_YB934lBiZKMmHJj7H2REENhqAT1cE2U3-YuZjf4b7ToW10OJBZ5btAfRFbXyhLMxucQjccKA9jKW629vFc4weuRe0YESxla5S-SimOwhjGhFko_dVa6gEYiddaexbbAeOQKDnswvWDgQPzIHUh4ipiP3M_RdNI92jsBA__ZUGPkGmtWCzpWH-63IrJpVi7zpIPzthGOLZMTLE0VNKwlCdEOhw1s0Y9IjO5oKNhJ8FzVQzIj19xyLkNJ094WwNWvx4",
      roi: "+31.2%",
      drawdown: "5.1%",
      winRate: "77%",
      followers: "342",
    },
    {
      name: "Echelon",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGdUYu1Ft2xYxKzGwPTXQHEBcFdNchIFooAMXxT40mlxhvOnIh-bpmL9aquHmNdDWB-RaUNpT7S56wIBeFML9w2MrzLQANZKHAh8uGNw8SsBSlURPpni8mOJYOsfxonkLbfaEzZ-XsyaVNtFE4AB4hpRyo44_09XyZxZ7AR9lqXrUAl0YNDe-RkdFt-Sr3vfqM1MEI7-AAmqTy9YrNAuvThvvwAixSi5iMGf63nQuB-i8wlyaxlYYtrwkQYZtjwM2M9g7ePwhFrSw",
      roi: "+112.4%",
      drawdown: "15.2%",
      winRate: "62%",
      followers: "1,120",
    },
    {
      name: "PrimeScalp",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbRSgVEnbrq5n-bGv5UtD6qS3gNnp4z2lC6TKLlYicQ-IulBjTsNY7mE4T-jq8NONdFDfY1Ji6qUNxeUoCPDxyzptAnrIxGO0RhfnzrJGMSSY-6UXkw6qQPuL-e9WwYWqBgKKymhv0clhuH9Xw3nKC0c-0BQn52039Wk6gRWEdrRUPS-Yfh7ZtpxYlRQJSVvgiSePM-iDncSrdVS_jDUddORy-mLf3NOkwy5FUswedwtE4K_M1KBTdtA4ha1GX4l0I8hasVJfD8UY",
      roi: "+27.4%",
      drawdown: "2.9%",
      winRate: "92%",
      followers: "631",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Header */}
      <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="font-headline text-5xl font-bold tracking-tighter text-on-background">{title}</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">{description}</p>
        </div>
        <div className="flex gap-3">
          <button className="ghost-border px-6 py-3 font-semibold hover:bg-surface-container-high transition-all text-primary">Global Stats</button>
          <button className="bg-secondary-container text-on-secondary-container px-6 py-3 font-bold active:scale-95 transition-all">Create Signal</button>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-5 relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
          <input 
            className="w-full bg-surface-container-low ghost-border py-4 pl-12 pr-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface" 
            placeholder="Search by trader name or strategy..." 
            type="text"
          />
        </div>
        <div className="lg:col-span-7 flex flex-wrap gap-4 items-center justify-end">
          <div className="flex items-center gap-2 bg-surface-container-lowest p-1 rounded-sm">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant px-3 font-bold">ROI</span>
            <button className="px-4 py-2 text-sm bg-surface-container-highest text-primary font-bold transition-all rounded-sm">10%+</button>
            <button className="px-4 py-2 text-sm hover:bg-surface-container-high text-on-surface-variant transition-all rounded-sm">50%+</button>
            <button className="px-4 py-2 text-sm hover:bg-surface-container-high text-on-surface-variant transition-all rounded-sm">100%+</button>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-lowest p-1 rounded-sm">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant px-3 font-bold">Risk</span>
            <button className="px-4 py-2 text-sm hover:bg-surface-container-high text-on-surface-variant transition-all rounded-sm">Low</button>
            <button className="px-4 py-2 text-sm bg-surface-container-highest text-primary font-bold transition-all rounded-sm">Med</button>
            <button className="px-4 py-2 text-sm hover:bg-surface-container-high text-on-surface-variant transition-all rounded-sm">High</button>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-lowest p-2 rounded-sm cursor-pointer hover:bg-surface-container-low transition-colors">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">7D Window</span>
            <span className="material-symbols-outlined text-on-surface-variant text-lg">expand_more</span>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-headline text-2xl font-bold tracking-tight">Top Performers This Month</h2>
          <div className="h-[1px] flex-grow bg-surface-container-highest"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredTraders.map((trader, idx) => (
            <div key={idx} className="bg-surface-container-low border-l-4 border-primary p-6 blue-glow relative overflow-hidden group">
              <div className="absolute top-4 right-4 bg-error/20 text-error px-3 py-1 text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span> Trending
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-surface-container-highest relative overflow-hidden">
                  <img alt={trader.name} className="w-full h-full object-cover" src={trader.image} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline text-xl font-bold">{trader.name}</h3>
                    <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                  <span className="text-[10px] font-mono text-secondary-container bg-on-secondary-container/20 px-2 py-0.5">LIVE ACCOUNT</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Total ROI</p>
                  <p className="font-headline text-3xl font-bold text-secondary-container">{trader.roi}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Win Rate</p>
                  <p className="font-headline text-3xl font-bold">{trader.winRate}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Drawdown</p>
                  <p className="text-lg font-bold text-error">{trader.drawdown}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Followers</p>
                  <p className="text-lg font-bold">{trader.followers}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-primary-container text-on-primary-container font-bold py-3 active:scale-95 transition-all">Copy</button>
                <button className="px-4 bg-surface-container-highest hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">Active Strategists</h2>
          <div className="flex gap-2">
            <button className="p-2 bg-surface-container-high text-primary"><span className="material-symbols-outlined">grid_view</span></button>
            <button className="p-2 hover:bg-surface-container-low transition-colors"><span className="material-symbols-outlined text-on-surface-variant">list</span></button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standardTraders.map((trader, idx) => (
            <div key={idx} className="bg-surface-container-low p-6 ghost-border hover:bg-surface-container-high transition-all group rounded-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-surface-container-lowest overflow-hidden">
                    <img alt={trader.name} className="w-full h-full object-cover" src={trader.image} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="font-bold">{trader.name}</h4>
                      <span className="material-symbols-outlined text-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </div>
                    <span className="text-[10px] text-on-secondary-container font-bold">LIVE</span>
                  </div>
                </div>
                <span className="text-secondary-container font-headline font-bold text-lg">{trader.roi}</span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Drawdown</span>
                  <span className="font-mono text-error">{trader.drawdown}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Win Rate</span>
                  <span className="font-mono">{trader.winRate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Followers</span>
                  <span className="font-mono">{trader.followers}</span>
                </div>
              </div>
              <div className="flex gap-2 border-t border-outline-variant pt-4 opacity-70 group-hover:opacity-100 transition-opacity">
                <button className="flex-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary py-2 transition-colors">View Profile</button>
                <button className="flex-1 bg-surface-container-highest text-primary text-[10px] font-bold uppercase tracking-widest py-2 active:bg-primary-container active:text-on-primary-container transition-all">Copy Trader</button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination/Load More */}
        <div className="mt-16 flex flex-col items-center gap-6">
          <button className="group flex items-center gap-4 bg-surface-container-lowest ghost-border px-12 py-4 font-bold uppercase tracking-widest hover:bg-surface-container-low transition-all">
            Load More Analysts
            <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">keyboard_double_arrow_down</span>
          </button>
          <p className="text-on-surface-variant text-[10px] font-mono italic">Showing 6 of 1,248 verified traders</p>
        </div>
      </section>

      {/* Global Floating Action */}
      <div className="fixed bottom-8 right-8 z-40 hidden md:block">
        <button className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full blue-glow flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>add_chart</span>
        </button>
      </div>
    </div>
  );
};

export default SignalHubContent;
