import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mergeCopyTradeSettings, type CopyRulesState } from "@/lib/copyTradeSettings";

export function useServers(userId: string | null) {
  return useQuery({
    queryKey: ["servers", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase.from("servers").select("*").eq("user_id", userId);
      return data || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAccounts(userId: string | null) {
  return useQuery({
    queryKey: ["accounts", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase.from("trading_accounts").select("*").eq("user_id", userId);
      return data || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 10,
    refetchInterval: 1000 * 10,
  });
}

export function useAccountAnalytics(userId: string | null) {
  return useQuery({
    queryKey: ["account-analytics", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from("account_analytics")
        .select(`
          *,
          trading_accounts!inner(user_id)
        `)
        .eq("trading_accounts.user_id", userId);
      return data || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useRecentPositions(userId: string | null) {
  return useQuery({
    queryKey: ["recent-positions", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from("positions")
        .select(`
          *,
          trading_accounts!inner(user_id, account_name)
        `)
        .eq("trading_accounts.user_id", userId)
        // Note: Using 'active' or similar status depending on DB schema
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useRecentTrades(userId: string | null) {
  return useQuery({
    queryKey: ["recent-trades", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from("trade_history")
        .select(`
          *,
          trading_accounts!inner(user_id, account_name)
        `)
        .eq("trading_accounts.user_id", userId)
        .order("close_time", { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useSystemLogs(userId: string | null) {
  return useQuery({
    queryKey: ["system-logs", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await (supabase as any)
        .from("system_logs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("system_logs fetch failed", error);
        return [];
      }

      return data || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 15,
  });
}

export function useSubscription(userId: string | null) {
  return useQuery({
    queryKey: ["subscription", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase
        .from("subscriptions")
        .select(`
          *,
          subscription_plans(*)
        `)
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/** Merged platform defaults + `user_trading_preferences.copy_trade_settings` for Settings + wizard. */
export function useUserTradeSettings(userId: string | null) {
  return useQuery({
    queryKey: ["user-trade-settings", userId],
    queryFn: async (): Promise<CopyRulesState | null> => {
      if (!userId) return null;
      // Database types stub omits these tables until `supabase gen types` is run after migration.
      const db = supabase as any;

      const { data: platformRow, error: platformError } = await db
        .from("platform_trade_settings_defaults")
        .select("settings")
        .eq("id", 1)
        .maybeSingle();

      if (platformError) throw platformError;

      const { data: userRow, error: userError } = await db
        .from("user_trading_preferences")
        .select("copy_trade_settings")
        .eq("user_id", userId)
        .maybeSingle();

      if (userError) throw userError;

      return mergeCopyTradeSettings(platformRow?.settings ?? null, userRow?.copy_trade_settings ?? null);
    },
    enabled: !!userId,
    staleTime: 1000 * 60,
  });
}

export function useCopyConfigurations(userId: string | null) {
  return useQuery({
    queryKey: ["copy-configurations", userId],
    queryFn: async () => {
      if (!userId) return [];
      // Note: We're fetching configurations where the user owns either the master or copier account
      const { data: accounts } = await supabase.from("trading_accounts").select("id").eq("user_id", userId);
      const accountIds = accounts?.map(a => a.id) || [];
      
      if (accountIds.length === 0) return [];

      const { data } = await supabase
        .from("copy_configurations")
        .select(`
          *,
          master_account:trading_accounts!copy_configurations_master_account_id_fkey(*),
          copier_account:trading_accounts!copy_configurations_copier_account_id_fkey(*)
        `)
        .or(`master_account_id.in.(${accountIds.join(',')}),copier_account_id.in.(${accountIds.join(',')})`);
      
      return data || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useCopyTradesToday(userId: string | null) {
  return useQuery({
    queryKey: ["copy-trades-today", userId],
    queryFn: async () => {
      if (!userId) return [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data } = await supabase
        .from("copy_trades")
        .select(`
          *,
          copy_configurations!inner(
            master_account:trading_accounts!copy_configurations_master_account_id_fkey(user_id)
          )
        `)
        .eq("copy_configurations.master_account.user_id", userId)
        .gte("created_at", today.toISOString());
      
      return data || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60,
  });
}
