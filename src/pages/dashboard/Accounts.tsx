import React, { useEffect, useMemo, useRef, useState } from "react";
import DashboardLayoutV2 from "@/components/dashboard/v2/DashboardLayoutV2";
import AccountSummary from "@/components/dashboard/v2/accounts/AccountSummary";
import AccountFilters from "@/components/dashboard/v2/accounts/AccountFilters";
import AccountTable from "@/components/dashboard/v2/accounts/AccountTable";
import AccountDrawer from "@/components/dashboard/v2/accounts/AccountDrawer";
import AddAccountModal from "@/components/dashboard/v2/accounts/AddAccountModal";
import { useUser } from "@/contexts/UserContext";
import { useAccounts, useAccountAnalytics } from "@/hooks/v2/useDashboardData";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { writeSystemLog } from "@/lib/systemLogs";

const AccountsPageV2 = () => {
  const queryClient = useQueryClient();
  const { userId } = useUser();
  const { data: accountsRaw = [], isLoading: loadingAccounts } = useAccounts(userId);
  const { data: analytics = [], isLoading: loadingAnalytics } = useAccountAnalytics(userId);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const previousAccountStateRef = useRef<Map<string, { status: string; role: string; name: string }>>(new Map());
  const hasHydratedRef = useRef(false);

  const totalBalance = accountsRaw.reduce((sum: number, acc: any) => sum + (acc.balance || 0), 0);
  const totalEquity = accountsRaw.reduce((sum: number, acc: any) => sum + (acc.equity || 0), 0);
  const totalPnL = analytics.reduce((sum: number, entry: any) => sum + (entry.total_pnl || 0), 0);
  const connectedCount = accountsRaw.filter((acc: any) => acc.status === 'connected').length;

  const accounts = useMemo(() => {
    return accountsRaw.map((acc: any) => {
      const accountAnalytics = analytics.find((a: any) => a.account_id === acc.id) || {};
      return {
        id: acc.id,
        account_name: acc.account_name || `Account ${(acc.account_number || "").slice(-4)}`,
        account_number: acc.account_number || "",
        broker: acc.broker_server?.split('-')[0] || "MetaTrader",
        balance: acc.balance || 0,
        equity: acc.equity || 0,
        pnl: accountAnalytics.daily_pnl || 0,
        status: acc.status || 'disconnected',
        role: acc.account_type === 'master' ? 'Master' : 'Copier',
        relationship: acc.account_type === 'master' ? "3 accounts copying" : "Copying MT5-001", // Placeholders as per design
      };
    }).filter((acc: any) => {
      const matchesSearch = acc.account_name.toLowerCase().includes(search.toLowerCase()) || 
                          acc.account_number.includes(search);
      const matchesFilter = filter === "All" || 
                          (filter === "Masters" && acc.role === "Master") ||
                          (filter === "Copiers" && acc.role === "Copier") ||
                          (filter === "Active" && acc.status === "connected") ||
                          (filter === "Disconnected" && acc.status !== "connected");
      return matchesSearch && matchesFilter;
    });
  }, [accountsRaw, analytics, search, filter]);

  const handleManage = (account: any) => {
    setSelectedAccount(account);
    setIsDrawerOpen(true);
  };

  const handleAddAccount = () => {
    setIsAddModalOpen(true);
  };

  const handleAccountCreated = async () => {
    await queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
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
      await writeSystemLog({
        userId,
        level: "error",
        source: "accounts",
        category: "errors",
        eventType: "account_remove_failed",
        message: `Failed to remove account: ${error.message}`,
        metadata: { accountId },
      });
      alert(error.message);
      return;
    }

    await writeSystemLog({
      userId,
      level: "info",
      source: "accounts",
      category: "system",
      eventType: "account_removed",
      message: `Account removed from dashboard`,
      metadata: { accountId },
    });

    setIsDrawerOpen(false);
    setSelectedAccount(null);
    await queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
    await queryClient.invalidateQueries({ queryKey: ["account-analytics", userId] });
  };

  useEffect(() => {
    if (!userId) return;

    const currentMap = new Map<string, { status: string; role: string; name: string }>();
    (accountsRaw as any[]).forEach((acc) => {
      currentMap.set(acc.id, {
        status: String(acc.status ?? "disconnected"),
        role: String(acc.account_type ?? "slave"),
        name: String(acc.account_name ?? `MT5-${String(acc.account_number ?? "").slice(-4)}`),
      });
    });

    if (!hasHydratedRef.current) {
      previousAccountStateRef.current = currentMap;
      hasHydratedRef.current = true;
      return;
    }

    const previousMap = previousAccountStateRef.current;
    currentMap.forEach((curr, accountId) => {
      const prev = previousMap.get(accountId);
      if (!prev) return;

      if (prev.status !== curr.status) {
        void writeSystemLog({
          userId,
          level: "info",
          source: "accounts",
          category: "system",
          eventType: "account_status_changed",
          message: `${curr.name} status changed: ${prev.status} -> ${curr.status}`,
          metadata: { accountId, previousStatus: prev.status, newStatus: curr.status },
        });
      }

      if (prev.role !== curr.role) {
        void writeSystemLog({
          userId,
          level: "info",
          source: "accounts",
          category: "system",
          eventType: "account_role_changed",
          message: `${curr.name} role changed: ${prev.role} -> ${curr.role}`,
          metadata: { accountId, previousRole: prev.role, newRole: curr.role },
        });
      }
    });

    previousAccountStateRef.current = currentMap;
  }, [accountsRaw, userId]);

  if (loadingAccounts || loadingAnalytics) {
    return (
      <DashboardLayoutV2>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-4 border-[#00D1FF] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayoutV2>
    );
  }

  return (
    <DashboardLayoutV2>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-4xl font-bold font-headline tracking-tighter text-on-surface mb-1 uppercase text-white">Accounts</h2>
            <p className="text-gray-500 font-label text-sm tracking-wide">Manage and monitor your trading infrastructure</p>
          </div>
        </div>

        <AccountSummary 
          totalBalance={totalBalance}
          totalEquity={totalEquity}
          totalPnL={totalPnL}
          activeAccounts={accountsRaw.length}
          connectedCount={connectedCount}
        />

        <AccountFilters 
          activeFilter={filter}
          onFilterChange={setFilter}
          onSearchChange={setSearch}
          onAddAccount={handleAddAccount}
        />

        <AccountTable 
          accounts={accounts}
          onManage={handleManage}
        />

        <AccountDrawer 
          account={selectedAccount}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onDisconnect={handleDisconnectAccount}
          disconnecting={disconnecting}
        />

        <AddAccountModal
          isOpen={isAddModalOpen}
          userId={userId}
          onClose={() => setIsAddModalOpen(false)}
          onCreated={handleAccountCreated}
        />
      </div>
    </DashboardLayoutV2>
  );
};

export default AccountsPageV2;
