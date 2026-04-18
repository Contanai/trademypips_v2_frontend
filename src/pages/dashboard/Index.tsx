import { useEffect, useState } from "react";
import DashboardLayoutV2 from "@/components/dashboard/v2/DashboardLayoutV2";
import PortfolioStrip from "@/components/dashboard/v2/PortfolioStrip";
import EquityChart from "@/components/dashboard/v2/EquityChart";
import QuickActionsV2 from "@/components/dashboard/v2/QuickActionsV2";
import SignalPipeline from "@/components/dashboard/v2/SignalPipeline";
import AccountsTableV2 from "@/components/dashboard/v2/AccountsTableV2";
import RecentTradesV2 from "@/components/dashboard/v2/RecentTradesV2";
import ActivityFeedV2 from "@/components/dashboard/v2/ActivityFeedV2";
import AddAccountModal from "@/components/dashboard/v2/accounts/AddAccountModal";
import AccountDrawer from "@/components/dashboard/v2/accounts/AccountDrawer";
import PendingConnectionModal from "@/components/dashboard/v2/accounts/PendingConnectionModal";
import { useUser } from "@/contexts/UserContext";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  useAccounts, 
  useAccountAnalytics, 
  useRecentTrades, 
  useSystemLogs 
} from "@/hooks/v2/useDashboardData";

const DashboardIndexV2 = () => {
  const queryClient = useQueryClient();
  const { userId } = useUser();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<{
    id: string;
    account_name: string;
    account_number: string;
    balance: number;
    equity: number;
    pnl: number;
  } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [pendingModalAccountId, setPendingModalAccountId] = useState<string | null>(null);

  const { data: accounts = [], isLoading: loadingAccounts, error: accountsError } = useAccounts(userId);
  const { data: analytics = [], isLoading: loadingAnalytics, error: analyticsError } = useAccountAnalytics(userId);
  const { data: trades = [] } = useRecentTrades(userId);
  const { data: logs = [] } = useSystemLogs(userId);

  const safeTime = (value: unknown, fallback = "--:--") => {
    if (!value) return fallback;
    const date = new Date(String(value));
    if (Number.isNaN(date.getTime())) return fallback;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Derived metrics for PortfolioStrip
  const totalBalance = accounts.reduce((sum: number, acc: any) => sum + (acc.balance || 0), 0);
  const totalEquity = accounts.reduce((sum: number, acc: any) => sum + (acc.equity || 0), 0);
  const todayPnL = analytics.reduce((sum: number, entry: any) => sum + (entry.daily_pnl || 0), 0);
  const totalPnL = analytics.reduce((sum: number, entry: any) => sum + (entry.total_pnl || 0), 0);
  const avgWinRate = analytics.length > 0 
    ? (analytics.reduce((sum: number, entry: any) => sum + (entry.win_rate || 0), 0) / analytics.length).toFixed(1)
    : 0;

  // Format trades for the V2 component
  const formattedTrades = trades.map((t: any) => ({
    id: t.id,
    symbol: t.symbol || "N/A",
    type: ((t.type || t.side || "BUY").toUpperCase() === "SELL" ? "SELL" : "BUY") as "BUY" | "SELL",
    volume: Number(t.volume || 0),
    open_price: Number(t.open_price || 0),
    profit: Number(t.profit || 0),
    time_ago: safeTime(t.close_time, "N/A"),
  }));

  // Format logs for the V2 component
  const formattedLogs = logs.map((l: any) => ({
    id: l.id,
    timestamp: safeTime(l.created_at, "00:00"),
    message: l.message || "System event",
    type: l.level === 'info' ? 'info' : l.level === 'error' ? 'info' : 'success', // Simplified mapping
    details: l.details ? JSON.stringify(l.details).substring(0, 30) : ""
  }));

  const tableAccounts = accounts.map((a: any) => {
    const accountAnalytics = analytics.find((entry: any) => entry.account_id === a.id) || {};
    const dailyPnl = Number(accountAnalytics.daily_pnl ?? a.daily_pnl ?? 0);
    return {
      ...a,
      account_number: a.account_number || "N/A",
      account_name: a.account_name || `Account ${(a.account_number || "").slice(-4)}`,
      balance: Number(a.balance || 0),
      equity: Number(a.equity || 0),
      daily_pnl: dailyPnl,
      status: a.status || "disconnected",
      account_type: a.account_type?.toUpperCase() || "SLAVE",
      vnc_host: a.vnc_host ?? null,
      vnc_port: a.vnc_port ?? null,
    };
  });

  const pendingModalAccount = tableAccounts.find((account) => account.id === pendingModalAccountId) ?? null;
  const buildPendingConnectionUrl = (account: (typeof tableAccounts)[number] | null): string | null => {
    if (!account) return null;
    if (account.status !== "pending") return null;
    const host = String(account.vnc_host ?? "").trim();
    const port = String(account.vnc_port ?? "").trim();
    if (!host || !port) return null;
    return `http://${host}:${port}/vnc_overlay.html?autoconnect=true&resize=scale`;
  };
  const pendingConnectionUrl = buildPendingConnectionUrl(pendingModalAccount);

  useEffect(() => {
    if (!pendingModalAccountId) return;
    const account = tableAccounts.find((row) => row.id === pendingModalAccountId);
    if (!account || account.status === "connected" || account.status !== "pending") {
      setPendingModalAccountId(null);
    }
  }, [tableAccounts, pendingModalAccountId]);

  if (loadingAccounts || loadingAnalytics) {
    return (
      <DashboardLayoutV2>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-4 border-[#00D1FF] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayoutV2>
    );
  }

  if (accountsError || analyticsError) {
    return (
      <DashboardLayoutV2>
        <div className="flex h-[60vh] items-center justify-center px-6 text-center">
          <div>
            <p className="text-sm font-headline font-bold uppercase tracking-widest text-[#ffb4ab]">Dashboard Data Unavailable</p>
            <p className="mt-2 text-xs text-slate-400">Check Supabase table access (RLS) for `trading_accounts` and `account_analytics`.</p>
          </div>
        </div>
      </DashboardLayoutV2>
    );
  }

  const handleAccountCreated = async () => {
    await queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
  };

  const handleInfrastructureRowClick = (row: (typeof tableAccounts)[number]) => {
    if (row.status === "pending") {
      setPendingModalAccountId(row.id);
      return;
    }
    setSelectedAccount({
      id: row.id,
      account_name: row.account_name,
      account_number: row.account_number,
      balance: row.balance,
      equity: row.equity,
      pnl: row.daily_pnl,
    });
    setIsDrawerOpen(true);
  };

  const handlePendingConnectionClick = (row: (typeof tableAccounts)[number]) => {
    setPendingModalAccountId(row.id);
  };

  const handleDisconnectAccount = async (accountId: string) => {
    if (!userId) return;
    const confirmed = window.confirm("Remove this account from your dashboard?");
    if (!confirmed) return;

    setDisconnecting(true);
    const { error } = await supabase
      .from("trading_accounts")
      .delete()
      .eq("id", accountId)
      .eq("user_id", userId);
    setDisconnecting(false);

    if (error) {
      alert(error.message);
      return;
    }

    setIsDrawerOpen(false);
    setSelectedAccount(null);
    await queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
    await queryClient.invalidateQueries({ queryKey: ["account-analytics", userId] });
  };

  return (
    <DashboardLayoutV2>
      <div className="space-y-8 animate-in fade-in duration-700">
        <PortfolioStrip 
          balance={totalBalance}
          equity={totalEquity}
          todayPnL={todayPnL}
          totalPnL={totalPnL}
          winRate={Number(avgWinRate)}
          activeAccounts={accounts.length}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 min-h-0">
          <EquityChart data={analytics} />
          <QuickActionsV2 onAddAccount={() => setIsAddModalOpen(true)} />
        </div>

        <SignalPipeline />

        <AccountsTableV2
          accounts={tableAccounts}
          onRowClick={handleInfrastructureRowClick}
          onPendingConnectionClick={handlePendingConnectionClick}
        />

        <AccountDrawer
          account={selectedAccount}
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedAccount(null);
          }}
          onDisconnect={handleDisconnectAccount}
          disconnecting={disconnecting}
        />

        <div className="grid grid-cols-1 gap-8 pb-12 lg:grid-cols-2">
          <RecentTradesV2 trades={formattedTrades} />
          <ActivityFeedV2 logs={formattedLogs} />
        </div>

        <AddAccountModal
          isOpen={isAddModalOpen}
          userId={userId}
          onClose={() => setIsAddModalOpen(false)}
          onCreated={handleAccountCreated}
        />

        <PendingConnectionModal
          isOpen={!!pendingModalAccountId}
          accountName={pendingModalAccount?.account_name ?? "MT5 Account"}
          connectionUrl={pendingConnectionUrl}
          onClose={() => setPendingModalAccountId(null)}
        />
      </div>
    </DashboardLayoutV2>
  );
};

export default DashboardIndexV2;
