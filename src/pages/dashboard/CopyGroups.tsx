import React, { useState, useMemo } from "react";
import DashboardLayoutV2 from "@/components/dashboard/v2/DashboardLayoutV2";
import GroupSummary from "@/components/dashboard/v2/groups/GroupSummary";
import GroupFilters from "@/components/dashboard/v2/groups/GroupFilters";
import GroupCard from "@/components/dashboard/v2/groups/GroupCard";
import CreateGroupWizard from "@/components/dashboard/v2/groups/CreateGroupWizard";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  useAccounts, 
  useCopyConfigurations, 
  useCopyTradesToday 
} from "@/hooks/v2/useDashboardData";
import { useQueryClient } from "@tanstack/react-query";
import { writeSystemLog } from "@/lib/systemLogs";

type GroupStatus = "active" | "paused" | "error";

const CopyGroupsPageV2 = () => {
  const queryClient = useQueryClient();
  const { userId } = useUser();
  const { data: accounts = [], isLoading: loadingAccounts } = useAccounts(userId);
  const { data: configs = [], isLoading: loadingConfigs } = useCopyConfigurations(userId);
  const { data: tradesToday = [], isLoading: loadingTrades } = useCopyTradesToday(userId);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardMasterPreset, setWizardMasterPreset] = useState<string | null>(null);
  const [wizardCopierPresets, setWizardCopierPresets] = useState<string[]>([]);
  const [wizardStepPreset, setWizardStepPreset] = useState<1 | 2 | 3>(1);

  const groups = useMemo(() => {
    // Group configurations by Master Account
    const groupMap = new Map();

    configs.forEach((config: any) => {
      const masterId = config.master_account_id;
      if (!groupMap.has(masterId)) {
        groupMap.set(masterId, {
          id: masterId,
          masterAccount: config.master_account,
          copiers: [],
          copierIds: [],
          configs: [],
        });
      }
      const group = groupMap.get(masterId);
      group.copiers.push(config.copier_account);
      group.copierIds.push(config.copier_account_id);
      group.configs.push(config);
    });

    return Array.from(groupMap.values()).map(group => {
      const isActive = group.configs.some((c: any) => c.active);
      const isError = group.copiers.some((c: any) => c.status !== 'connected');
      
      const status: GroupStatus = !isActive ? "paused" : (isError ? "error" : "active");
      return {
        id: group.id,
        name: `${group.masterAccount?.account_name || "Account"} → ${group.copiers.length} Accounts`,
        status,
        latency: 180, // Mocked latency
        masterAccount: group.masterAccount?.account_name || group.masterAccount?.account_number || "Unknown",
        copiers: group.copiers.map((c: any) => c.status !== 'connected' ? `${c.account_name} (ERR)` : (c.account_name || c.account_number)),
        mode: "Proportional (1.0x)", // Mocked mode
        maxLot: group.configs[0]?.max_lot_size || 1.0,
        tradesToday: tradesToday.filter((t: any) => t.copy_configurations.master_account_id === group.id).length,
        errorMessage: isError ? "Connection lost on one or more slave nodes" : undefined,
        copierIds: group.copierIds as string[],
      };
    }).filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(search.toLowerCase()) || 
                          group.masterAccount.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "All" || 
                          (filter === "Active" && group.status === "active") ||
                          (filter === "Paused" && group.status === "paused") ||
                          (filter === "Errors" && group.status === "error");
      return matchesSearch && matchesFilter;
    });
  }, [configs, tradesToday, search, filter]);

  const totalCopiers = configs.length;
  const activeGroups = groups.filter(g => g.status === 'active').length;

  const openCreateWizard = () => {
    setWizardMasterPreset(null);
    setWizardCopierPresets([]);
    setWizardStepPreset(1);
    setIsWizardOpen(true);
  };

  const openAddCopierWizard = (masterId: string, selectedCopierIds: string[] = []) => {
    setWizardMasterPreset(masterId);
    setWizardCopierPresets(selectedCopierIds);
    setWizardStepPreset(2);
    setIsWizardOpen(true);
  };

  const openEditWizard = (masterId: string) => {
    setWizardMasterPreset(masterId);
    setWizardCopierPresets([]);
    setWizardStepPreset(3);
    setIsWizardOpen(true);
  };

  const handleDeleteGroup = async (masterId: string) => {
    if (!userId) return;
    const confirmed = window.confirm("Delete this group and all copier relationships for this master?");
    if (!confirmed) return;

    const { data: rpcData, error: rpcError } = await (supabase as any).rpc("delete_copy_group", {
      p_master_account_id: masterId,
      p_user_id: userId,
    });
    if (rpcError) {
      await writeSystemLog({
        userId,
        level: "error",
        source: "copy_groups",
        category: "errors",
        eventType: "group_delete_failed",
        message: `Failed to delete copy group: ${rpcError.message}`,
        metadata: { masterId },
      });
      alert(rpcError.message);
      return;
    }

    await writeSystemLog({
      userId,
      level: "info",
      source: "copy_groups",
      category: "system",
      eventType: "group_deleted",
      message: "Copy group deleted",
      metadata: { masterId },
    });

    const result = Array.isArray(rpcData) ? rpcData[0] : null;
    if (result?.demoted) {
      await writeSystemLog({
        userId,
        level: "info",
        source: "copy_groups",
        category: "system",
        eventType: "account_role_changed",
        message: "Master account role changed to slave after group deletion",
        metadata: { accountId: masterId, previousRole: "master", newRole: "slave" },
      });
    }

    void queryClient.invalidateQueries({ queryKey: ["copy-configurations", userId] });
    void queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
  };

  const handleSetGroupActive = async (masterId: string, active: boolean) => {
    if (!userId) return;

    const { error } = await (supabase as any)
      .from("copy_configurations")
      .update({ active })
      .eq("user_id", userId)
      .eq("master_account_id", masterId);

    if (error) {
      await writeSystemLog({
        userId,
        level: "error",
        source: "copy_groups",
        category: "errors",
        eventType: active ? "group_resume_failed" : "group_pause_failed",
        message: `Failed to ${active ? "resume" : "pause"} copy group: ${error.message}`,
        metadata: { masterId, active },
      });
      alert(error.message);
      return;
    }

    await writeSystemLog({
      userId,
      level: "info",
      source: "copy_groups",
      category: "system",
      eventType: active ? "group_resumed" : "group_paused",
      message: `Copy group ${active ? "resumed" : "paused"}`,
      metadata: { masterId, active },
    });

    void queryClient.invalidateQueries({ queryKey: ["copy-configurations", userId] });
  };

  const handleManageCopiers = (group: { id: string; copierIds: string[] }) => {
    openAddCopierWizard(group.id, group.copierIds);
  };

  if (loadingAccounts || loadingConfigs || loadingTrades) {
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
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold font-headline tracking-tight text-white uppercase">Copy Groups</h1>
            <p className="text-gray-500 mt-2 font-light">Manage how trades are orchestrated between your nodes</p>
          </div>
          <button 
            onClick={openCreateWizard}
            className="bg-[#00D1FF] text-[#003543] px-6 py-3 rounded-sm font-bold flex items-center gap-2 blue-glow hover:brightness-110 active:scale-95 transition-all uppercase text-xs tracking-widest font-headline"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            CREATE COPY GROUP
          </button>
        </header>

        <GroupSummary 
          activeGroups={activeGroups}
          totalCopiers={totalCopiers}
          tradesToday={tradesToday.length}
          avgLatency={180}
        />

        <GroupFilters 
          activeFilter={filter}
          onFilterChange={setFilter}
          onSearchChange={setSearch}
          onCreateGroup={openCreateWizard}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-12">
          {groups.length > 0 ? groups.map((group) => (
            <GroupCard
              key={group.id}
              {...group}
              onPause={() => void handleSetGroupActive(group.id, false)}
              onResume={() => void handleSetGroupActive(group.id, true)}
              onAddCopier={() => openAddCopierWizard(group.id, group.copierIds)}
              onManageCopiers={() => handleManageCopiers(group)}
              onEdit={() => openEditWizard(group.id)}
              onDelete={() => void handleDeleteGroup(group.id)}
            />
          )) : (
            <div className="col-span-2 py-20 text-center border border-dashed border-white/5 rounded-lg bg-surface-container-low/30 cursor-default">
              <p className="text-gray-600 font-mono text-[10px] uppercase tracking-widest">No active copy pipelines detected</p>
            </div>
          )}
        </div>

        <CreateGroupWizard 
          accounts={accounts}
          userId={userId}
          isOpen={isWizardOpen}
          initialMasterId={wizardMasterPreset}
          initialSelectedCopierIds={wizardCopierPresets}
          initialStep={wizardStepPreset}
          onClose={() => setIsWizardOpen(false)}
          onProgress={() => {
            void queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
            void queryClient.invalidateQueries({ queryKey: ["copy-configurations", userId] });
          }}
        />
      </div>
    </DashboardLayoutV2>
  );
};

export default CopyGroupsPageV2;
