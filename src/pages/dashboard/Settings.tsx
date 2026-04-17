import { useState, useEffect, useRef, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import DashboardLayoutV2 from "@/components/dashboard/v2/DashboardLayoutV2";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { useUserTradeSettings } from "@/hooks/v2/useDashboardData";
import {
  initialCopyRules,
  copyRulesToPersist,
  type CopyRulesState,
  type TradeType,
  type CloseBehavior,
} from "@/lib/copyTradeSettings";

const DISABLED_HINT = "Enable to edit";

const SettingsPageV2 = () => {
  const queryClient = useQueryClient();
  const { user, logout, signOutOthers } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [securitySuccess, setSecuritySuccess] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [sessionActionLoading, setSessionActionLoading] = useState(false);
  const [copyRules, setCopyRules] = useState<CopyRulesState>(initialCopyRules);
  const [tradePrefsError, setTradePrefsError] = useState("");
  const [savingTradePrefs, setSavingTradePrefs] = useState(false);
  const tradePrefsHydrated = useRef(false);

  const {
    data: mergedTradeSettings,
    refetch: refetchTradeSettings,
    isLoading: tradeSettingsLoading,
  } = useUserTradeSettings(user?.id ?? null);

  useEffect(() => {
    if (!mergedTradeSettings || tradePrefsHydrated.current) return;
    setCopyRules(mergedTradeSettings);
    tradePrefsHydrated.current = true;
  }, [mergedTradeSettings]);

  useEffect(() => {
    if (!user?.id) tradePrefsHydrated.current = false;
  }, [user?.id]);

  const handleSaveTradePreferences = async () => {
    if (!user?.id) return;
    setTradePrefsError("");
    setSavingTradePrefs(true);
    const payload = copyRulesToPersist(copyRules);
    const { error } = await (supabase as any).from("user_trading_preferences").upsert(
      {
        user_id: user.id,
        copy_trade_settings: payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    setSavingTradePrefs(false);
    if (error) {
      setTradePrefsError(error.message);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["user-trade-settings"] });
  };

  const handleDiscardTradePreferences = async () => {
    setTradePrefsError("");
    const res = await refetchTradeSettings();
    if (res.data) setCopyRules(res.data);
  };

  const handlePasswordUpdate = async () => {
    setSecurityError("");
    setSecuritySuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setSecurityError("Fill all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityError("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setSecurityError("New password must be at least 6 characters.");
      return;
    }

    setUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setUpdatingPassword(false);

    if (error) {
      setSecurityError(error.message);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSecuritySuccess("Password updated successfully.");
  };

  const handleLogoutCurrent = async () => {
    setSecurityError("");
    setSecuritySuccess("");
    setSessionActionLoading(true);
    await logout();
    setSessionActionLoading(false);
  };

  const handleLogoutOthers = async () => {
    setSecurityError("");
    setSecuritySuccess("");
    setSessionActionLoading(true);
    const errorMessage = await signOutOthers();
    setSessionActionLoading(false);

    if (errorMessage) {
      setSecurityError(errorMessage);
      return;
    }
    setSecuritySuccess("All other active sessions were signed out.");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "person" },
    { id: "security", label: "Security", icon: "shield" },
    { id: "preferences", label: "Preferences", icon: "settings_input_component" },
    { id: "api", label: "API Keys", icon: "vpn_key" },
    { id: "integrations", label: "Integrations", icon: "hub" },
    { id: "notifications", label: "Notifications", icon: "campaign" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
              <h2 className="text-4xl font-headline font-bold text-white tracking-tight">Profile Settings</h2>
              <div className="text-[#27ff97] text-xs font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#27ff97] animate-pulse"></span>
                STATUS: NODE_SYNCHRONIZED
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#1c1b1b] p-8 rounded-xl border-l-4 border-[#00d1ff] space-y-6">
                <div className="relative group w-32 h-32 mx-auto">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#00d1ff]/30">
                    <img alt="User avatar" className="object-cover w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpZK3GX9pDYqpoI1cCLlYPFHqbcLYSnUXLGnA9SgtJqyhLs4KvlFhWqhNedjL9eVQ7jNT4JA_wI4LsZK3QyyCKDBP838kbCeIJba5L-Ksrz0zfL__GiUZ0MS6AcRjqQ4UToCXBTX-msgDUmQ0d27dPRjy_EJFhj8KempXY7Q7aYUELE_-Hs18YJjNv-2-8YtHEDJshWGMzgcMRUq8hgWZrfxftEl_n1xAJk6MunYG3-BzNqB1RHxrA9KATM4DaoLlJAsxVkEISJ5I" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-[#00d1ff] text-[#003543] p-2 rounded-full material-symbols-outlined text-sm hover:scale-110 transition-transform shadow-lg">edit</button>
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-headline font-bold text-white">Promise Nzereogu</h3>
                  <p className="text-[#a4e6ff] text-sm font-mono">@trademaster</p>
                </div>
              </div>
              <div className="md:col-span-2 bg-[#1c1b1b] p-8 rounded-xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Full Name</label>
                    <input className="w-full bg-[#0e0e0e] border border-white/5 focus:ring-1 focus:ring-[#00d1ff] rounded-sm text-sm p-3 text-white outline-none" type="text" defaultValue="Promise Nzereogu" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Email Address</label>
                    <input className="w-full bg-[#0e0e0e] border border-white/5 focus:ring-1 focus:ring-[#00d1ff] rounded-sm text-sm p-3 text-white outline-none" type="email" defaultValue="example@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Bio</label>
                  <textarea className="w-full bg-[#0e0e0e] border border-white/5 focus:ring-1 focus:ring-[#00d1ff] rounded-sm text-sm p-3 text-white h-24 resize-none outline-none">Institutional trader specializing in HFT and kinetic infrastructure analysis.</textarea>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#0e0e0e] rounded-sm border border-white/5">
                  <div>
                    <h4 className="text-sm font-bold text-white">Copy Trade Visibility</h4>
                    <p className="text-xs text-white/40">Allow others to copy my trades in the marketplace</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input defaultChecked className="sr-only peer" type="checkbox" />
                    <div className="w-11 h-6 bg-[#353534] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d1ff]"></div>
                  </label>
                </div>
              </div>
            </div>
          </section>
        );
      case "security":
        return (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-xl">
            <h2 className="text-2xl font-headline font-bold text-white tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-[#00d1ff]">shield</span> Security Protocols
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#1c1b1b] p-8 rounded-xl space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Access Control</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/60">Current Password</label>
                    <input className="w-full bg-[#0e0e0e] border border-white/5 rounded-sm text-sm p-3 text-white outline-none" placeholder="••••••••" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/60">New Password</label>
                    <input className="w-full bg-[#0e0e0e] border border-white/5 rounded-sm text-sm p-3 text-white outline-none" placeholder="••••••••" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/60">Confirm Password</label>
                    <input className="w-full bg-[#0e0e0e] border border-white/5 rounded-sm text-sm p-3 text-white outline-none" placeholder="••••••••" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                  {securityError ? <p className="text-xs text-[#ffb4ab]">{securityError}</p> : null}
                  {securitySuccess ? <p className="text-xs text-[#27ff97]">{securitySuccess}</p> : null}
                  <button onClick={handlePasswordUpdate} className="w-full py-3 bg-[#353534] text-white font-headline font-bold text-xs rounded-sm hover:bg-[#3a3939] transition-colors uppercase tracking-widest" disabled={updatingPassword}>
                    {updatingPassword ? "Updating..." : "Update Credentials"}
                  </button>
                </div>
              </div>
              <div className="bg-[#1c1b1b] p-8 rounded-xl space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Active Sessions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#0e0e0e] rounded-sm border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-white/40">browser_updated</span>
                      <div>
                        <div className="text-sm font-bold text-white">{user?.email || "Current Device Session"}</div>
                        <div className="text-[10px] text-[#27ff97] font-mono">CURRENT_SESSION</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogoutCurrent}
                      disabled={sessionActionLoading}
                      className="text-white/20 hover:text-[#ffb4ab] transition-colors material-symbols-outlined"
                    >
                      logout
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#0e0e0e] rounded-sm border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-white/40">dns</span>
                      <div>
                        <div className="text-sm font-bold text-white">Other Devices</div>
                        <div className="text-[10px] text-white/40 font-mono">REVOKE_ALL_REMOTE_SESSIONS</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogoutOthers}
                      disabled={sessionActionLoading}
                      className="text-white/20 hover:text-[#ffb4ab] transition-colors material-symbols-outlined"
                    >
                      logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      case "preferences":
        return (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-xl">
            <h2 className="text-2xl font-headline font-bold text-white tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-[#00d1ff]">settings_input_component</span> Trading Preferences
            </h2>
            {tradeSettingsLoading && user?.id ? (
              <p className="text-xs text-gray-500">Loading saved trade settings…</p>
            ) : null}
            {tradePrefsError ? <p className="mb-2 text-xs text-[#ffb4ab]">{tradePrefsError}</p> : null}
            <div className="space-y-5 rounded-xl bg-[#1c1b1b] p-5 sm:p-8">
              <section className="rounded-sm border border-white/5 bg-surface-container-lowest p-5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-[#00D1FF]">
                    1. Core Risk Configuration
                  </h4>
                  <label className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Enable</span>
                    <input
                      type="checkbox"
                      checked={copyRules.coreRiskEnabled}
                      onChange={(e) =>
                        setCopyRules((prev) => ({ ...prev, coreRiskEnabled: e.target.checked }))
                      }
                      className="h-4 w-4 rounded-sm border-white/20 bg-transparent text-[#00D1FF] focus:ring-0"
                    />
                  </label>
                  </div>
                <div
                  title={!copyRules.coreRiskEnabled ? DISABLED_HINT : undefined}
                  className={`mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 ${
                    !copyRules.coreRiskEnabled ? "cursor-not-allowed opacity-60" : ""
                  }`}
                >
                  <label className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Risk Mode</span>
                    <select
                      disabled={!copyRules.coreRiskEnabled}
                      title={!copyRules.coreRiskEnabled ? DISABLED_HINT : undefined}
                      value={copyRules.riskMode}
                      onChange={(e) =>
                        setCopyRules((prev) => ({
                          ...prev,
                          riskMode: e.target.value as CopyRulesState["riskMode"],
                        }))
                      }
                      className="w-full rounded-sm border border-white/10 bg-[#0E0E0E] px-3 py-2 text-xs text-slate-200 outline-none focus:border-[#00D1FF]/40 disabled:cursor-not-allowed"
                    >
                      <option value="proportional">Proportional (Equity-based scaling)</option>
                      <option value="fixed">Fixed (Exact lot copy)</option>
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Lot Multiplier</span>
                    <input
                      disabled={!copyRules.coreRiskEnabled}
                      title={!copyRules.coreRiskEnabled ? DISABLED_HINT : undefined}
                      type="number"
                      min={0.01}
                      step={0.01}
                      value={copyRules.lotMultiplier}
                      onChange={(e) =>
                        setCopyRules((prev) => ({ ...prev, lotMultiplier: e.target.value }))
                      }
                      placeholder="1"
                      className="w-full rounded-sm border border-white/10 bg-[#0E0E0E] px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-gray-600 focus:border-[#00D1FF]/40 disabled:cursor-not-allowed"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Min Lot Size</span>
                    <input
                      disabled={!copyRules.coreRiskEnabled}
                      title={!copyRules.coreRiskEnabled ? DISABLED_HINT : undefined}
                      type="number"
                      min={0.01}
                      step={0.01}
                      value={copyRules.minLot}
                      onChange={(e) =>
                        setCopyRules((prev) => ({ ...prev, minLot: e.target.value }))
                      }
                      placeholder="0.01"
                      className="w-full rounded-sm border border-white/10 bg-[#0E0E0E] px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-gray-600 focus:border-[#00D1FF]/40 disabled:cursor-not-allowed"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Max Lot Size</span>
                    <input
                      disabled={!copyRules.coreRiskEnabled}
                      title={!copyRules.coreRiskEnabled ? DISABLED_HINT : undefined}
                      type="number"
                      min={0.01}
                      step={0.01}
                      value={copyRules.maxLot}
                      onChange={(e) =>
                        setCopyRules((prev) => ({ ...prev, maxLot: e.target.value }))
                      }
                      placeholder="2"
                      className="w-full rounded-sm border border-white/10 bg-[#0E0E0E] px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-gray-600 focus:border-[#00D1FF]/40 disabled:cursor-not-allowed"
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-sm border border-white/5 bg-surface-container-lowest p-5">
                <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-[#00D1FF]">
                  2. Trade Filtering Rules
                </h4>
                <div className="mt-4 space-y-4">
                  <div className="rounded-sm border border-white/5 bg-[#0E0E0E] p-3">
                    <label className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Enable Symbol Filter</span>
                      <input
                        type="checkbox"
                        checked={copyRules.symbolFilterEnabled}
                        onChange={(e) =>
                          setCopyRules((prev) => ({ ...prev, symbolFilterEnabled: e.target.checked }))
                        }
                        className="h-4 w-4 rounded-sm border-white/20 bg-transparent text-[#00D1FF] focus:ring-0"
                      />
                    </label>
                    <div
                      title={!copyRules.symbolFilterEnabled ? DISABLED_HINT : undefined}
                      className={`grid grid-cols-1 gap-3 md:grid-cols-2 ${
                        !copyRules.symbolFilterEnabled ? "cursor-not-allowed opacity-50" : ""
                      }`}
                    >
                      <label className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Filter Mode</span>
                        <select
                          disabled={!copyRules.symbolFilterEnabled}
                          title={!copyRules.symbolFilterEnabled ? DISABLED_HINT : undefined}
                          value={copyRules.symbolFilterMode}
                          onChange={(e) =>
                            setCopyRules((prev) => ({
                              ...prev,
                              symbolFilterMode: e.target.value as CopyRulesState["symbolFilterMode"],
                            }))
                          }
                          className="w-full rounded-sm border border-white/10 bg-[#131313] px-3 py-2 text-xs text-slate-200 outline-none disabled:cursor-not-allowed"
                        >
                          <option value="include">Include only symbols</option>
                          <option value="exclude">Exclude symbols</option>
                        </select>
                      </label>
                      <label className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Symbols (comma-separated)</span>
                        <input
                          disabled={!copyRules.symbolFilterEnabled}
                          title={!copyRules.symbolFilterEnabled ? DISABLED_HINT : undefined}
                          type="text"
                          value={copyRules.symbols}
                          onChange={(e) =>
                            setCopyRules((prev) => ({ ...prev, symbols: e.target.value }))
                          }
                          placeholder="EURUSD, XAUUSD"
                          className="w-full rounded-sm border border-white/10 bg-[#131313] px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-gray-600 disabled:cursor-not-allowed"
                        />
                      </label>
                    </div>
                  </div>

                  <label className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Trade Type Filter</span>
                    <select
                      value={copyRules.tradeType}
                      onChange={(e) =>
                        setCopyRules((prev) => ({
                          ...prev,
                          tradeType: e.target.value as TradeType,
                        }))
                      }
                      className="w-full rounded-sm border border-white/10 bg-[#0E0E0E] px-3 py-2 text-xs text-slate-200 outline-none focus:border-[#00D1FF]/40"
                    >
                      <option value="both">Both (default)</option>
                      <option value="buy">Buy only</option>
                      <option value="sell">Sell only</option>
                    </select>
                  </label>
                </div>
              </section>

              <section className="rounded-sm border border-white/5 bg-surface-container-lowest p-5">
                <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-[#00D1FF]">
                  3. Execution Control
                </h4>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-sm border border-white/5 bg-[#0E0E0E] p-3">
                    <label className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Max Slippage</span>
                      <input
                        type="checkbox"
                        checked={copyRules.maxSlippageEnabled}
                        onChange={(e) =>
                          setCopyRules((prev) => ({ ...prev, maxSlippageEnabled: e.target.checked }))
                        }
                        className="h-4 w-4 rounded-sm border-white/20 bg-transparent text-[#00D1FF] focus:ring-0"
                      />
                    </label>
                    <input
                      disabled={!copyRules.maxSlippageEnabled}
                      title={!copyRules.maxSlippageEnabled ? DISABLED_HINT : undefined}
                      type="number"
                      min={0}
                      step={0.1}
                      value={copyRules.maxSlippage}
                      onChange={(e) =>
                        setCopyRules((prev) => ({ ...prev, maxSlippage: e.target.value }))
                      }
                      placeholder="2"
                      className="w-full rounded-sm border border-white/10 bg-[#131313] px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-gray-600 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="rounded-sm border border-white/5 bg-[#0E0E0E] p-3">
                    <label className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Max Spread Filter</span>
                      <input
                        type="checkbox"
                        checked={copyRules.maxSpreadEnabled}
                        onChange={(e) =>
                          setCopyRules((prev) => ({ ...prev, maxSpreadEnabled: e.target.checked }))
                        }
                        className="h-4 w-4 rounded-sm border-white/20 bg-transparent text-[#00D1FF] focus:ring-0"
                      />
                    </label>
                    <input
                      disabled={!copyRules.maxSpreadEnabled}
                      title={!copyRules.maxSpreadEnabled ? DISABLED_HINT : undefined}
                      type="number"
                      min={0}
                      step={0.1}
                      value={copyRules.maxSpread}
                      onChange={(e) =>
                        setCopyRules((prev) => ({ ...prev, maxSpread: e.target.value }))
                      }
                      placeholder="25"
                      className="w-full rounded-sm border border-white/10 bg-[#131313] px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-gray-600 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-sm border border-white/5 bg-surface-container-lowest p-5">
                <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-[#00D1FF]">
                  4. Risk Protection Rules
                </h4>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <RuleToggleRowSettings
                    label="Max Risk Per Trade (%)"
                    enabled={copyRules.maxRiskPerTradeEnabled}
                    onToggle={(checked) =>
                      setCopyRules((prev) => ({ ...prev, maxRiskPerTradeEnabled: checked }))
                    }
                  >
                    <input
                      disabled={!copyRules.maxRiskPerTradeEnabled}
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={copyRules.maxRiskPerTrade}
                      onChange={(e) =>
                        setCopyRules((prev) => ({ ...prev, maxRiskPerTrade: e.target.value }))
                      }
                      placeholder="2"
                      className="w-full rounded-sm border border-white/10 bg-[#131313] px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-gray-600 disabled:cursor-not-allowed"
                    />
                  </RuleToggleRowSettings>
                  <RuleToggleRowSettings
                    label="Daily Drawdown Limit (%)"
                    enabled={copyRules.dailyDrawdownEnabled}
                    onToggle={(checked) =>
                      setCopyRules((prev) => ({ ...prev, dailyDrawdownEnabled: checked }))
                    }
                  >
                    <input
                      disabled={!copyRules.dailyDrawdownEnabled}
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={copyRules.dailyDrawdown}
                      onChange={(e) =>
                        setCopyRules((prev) => ({ ...prev, dailyDrawdown: e.target.value }))
                      }
                      placeholder="5"
                      className="w-full rounded-sm border border-white/10 bg-[#131313] px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-gray-600 disabled:cursor-not-allowed"
                    />
                  </RuleToggleRowSettings>
                  <RuleToggleRowSettings
                    label="Total Drawdown Protection (%)"
                    enabled={copyRules.totalDrawdownEnabled}
                    onToggle={(checked) =>
                      setCopyRules((prev) => ({ ...prev, totalDrawdownEnabled: checked }))
                    }
                  >
                    <input
                      disabled={!copyRules.totalDrawdownEnabled}
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={copyRules.totalDrawdown}
                      onChange={(e) =>
                        setCopyRules((prev) => ({ ...prev, totalDrawdown: e.target.value }))
                      }
                      placeholder="12"
                      className="w-full rounded-sm border border-white/10 bg-[#131313] px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-gray-600 disabled:cursor-not-allowed"
                    />
                  </RuleToggleRowSettings>
                  <RuleToggleRowSettings
                    label="Equity Stop (Kill Switch)"
                    enabled={copyRules.equityStopEnabled}
                    onToggle={(checked) =>
                      setCopyRules((prev) => ({ ...prev, equityStopEnabled: checked }))
                    }
                  >
                    <input
                      disabled={!copyRules.equityStopEnabled}
                      type="number"
                      min={0}
                      step={1}
                      value={copyRules.equityStop}
                      onChange={(e) =>
                        setCopyRules((prev) => ({ ...prev, equityStop: e.target.value }))
                      }
                      placeholder="1000"
                      className="w-full rounded-sm border border-white/10 bg-[#131313] px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-gray-600 disabled:cursor-not-allowed"
                    />
                  </RuleToggleRowSettings>
                  <RuleToggleRowSettings
                    label="Max Concurrent Trades"
                    enabled={copyRules.maxConcurrentTradesEnabled}
                    onToggle={(checked) =>
                      setCopyRules((prev) => ({ ...prev, maxConcurrentTradesEnabled: checked }))
                    }
                  >
                    <input
                      disabled={!copyRules.maxConcurrentTradesEnabled}
                      type="number"
                      min={1}
                      step={1}
                      value={copyRules.maxConcurrentTrades}
                      onChange={(e) =>
                        setCopyRules((prev) => ({ ...prev, maxConcurrentTrades: e.target.value }))
                      }
                      placeholder="5"
                      className="w-full rounded-sm border border-white/10 bg-[#131313] px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-gray-600 disabled:cursor-not-allowed"
                    />
                  </RuleToggleRowSettings>
                </div>
              </section>

              <section className="rounded-sm border border-white/5 bg-surface-container-lowest p-5">
                <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-[#00D1FF]">
                  5. Trade Synchronization Rules
                </h4>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Close Behavior</span>
                    <select
                      value={copyRules.closeBehavior}
                      onChange={(e) =>
                        setCopyRules((prev) => ({
                          ...prev,
                          closeBehavior: e.target.value as CloseBehavior,
                        }))
                      }
                      className="w-full rounded-sm border border-white/10 bg-[#0E0E0E] px-3 py-2 text-xs text-slate-200 outline-none focus:border-[#00D1FF]/40"
                    >
                      <option value="master_close">Close when master closes (default)</option>
                      <option value="independent">Independent management on copier</option>
                    </select>
                  </label>
                  <div className="rounded-sm border border-white/5 bg-[#0E0E0E] p-3">
                    <label className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Reverse Master Direction</span>
                      <input
                        type="checkbox"
                        checked={copyRules.reverseMasterEnabled}
                        onChange={(e) =>
                          setCopyRules((prev) => ({ ...prev, reverseMasterEnabled: e.target.checked }))
                        }
                        className="h-4 w-4 rounded-sm border-white/20 bg-transparent text-[#00D1FF] focus:ring-0"
                      />
                    </label>
                  </div>
                </div>
              </section>
            </div>
          </section>
        );
      case "api":
        return (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-headline font-bold text-white tracking-tight flex items-center gap-3">
                <span className="material-symbols-outlined text-[#00d1ff]">key</span> API Infrastructure
              </h2>
              <button className="px-4 py-2 bg-[#353534] border border-[#00d1ff]/20 text-[#00d1ff] text-xs font-headline font-bold rounded-sm active:scale-95 transition-transform">+ Generate New Key</button>
            </div>
            <div className="overflow-hidden rounded-xl bg-[#1c1b1b]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0e0e0e] border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">Key Label</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">Created</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">Last Activity</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-headline font-bold text-white">Trading Bot</td>
                    <td className="px-6 py-4 text-xs font-mono text-white/60">Apr 1, 2024</td>
                    <td className="px-6 py-4 text-xs font-mono text-[#27ff97]">2 hours ago</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button className="material-symbols-outlined text-white/40 hover:text-[#00d1ff] transition-colors text-lg">content_copy</button>
                      <button className="material-symbols-outlined text-white/40 hover:text-[#ffb4ab] transition-colors text-lg">delete_forever</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        );
      case "integrations":
        return (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-xl">
            <h2 className="text-2xl font-headline font-bold text-white tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-[#00d1ff]">link</span> Integrations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#1c1b1b] p-8 rounded-xl flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#24A1DE]/10 flex items-center justify-center text-[#24A1DE]">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                  </div>
                  <div>
                    <h3 className="text-white font-headline font-bold">Telegram</h3>
                    <p className="text-xs text-white/40 mb-4">Execute trades via telegram bot alerts</p>
                    <span className="px-2 py-1 bg-[#0e0e0e] text-[10px] font-bold text-white/40 rounded-sm uppercase tracking-widest border border-white/5">Not Connected</span>
                  </div>
                </div>
                <button className="text-[#a4e6ff] text-xs font-headline font-bold hover:underline">Connect</button>
              </div>
              <div className="bg-[#1c1b1b] p-8 rounded-xl space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#00d1ff]/10 flex items-center justify-center text-[#00d1ff]">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>webhook</span>
                    </div>
                    <div>
                      <h3 className="text-white font-headline font-bold">TradingView Webhook</h3>
                      <p className="text-xs text-white/40">Direct execution from chart alerts</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-[#27ff97]/10 text-[10px] font-bold text-[#27ff97] rounded-sm uppercase tracking-widest">Active</span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase">Webhook URL</label>
                    <div className="flex gap-2">
                      <input className="flex-1 bg-[#0e0e0e] border border-white/5 rounded-sm text-[10px] font-mono p-2 text-white outline-none" readOnly type="text" defaultValue="https://api.tradepips.io/v1/webhook/389a-41..." />
                      <button className="material-symbols-outlined text-white/40 hover:text-white">content_copy</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase">Secret Key</label>
                    <div className="flex gap-2">
                      <input className="flex-1 bg-[#0e0e0e] border border-white/5 rounded-sm text-[10px] font-mono p-2 text-white outline-none" readOnly type="password" defaultValue="••••••••••••••••••••" />
                      <button className="material-symbols-outlined text-white/40 hover:text-white">visibility</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      case "notifications":
        return (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-xl">
            <h2 className="text-2xl font-headline font-bold text-white tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-[#00d1ff]">campaign</span> Notification Layer
            </h2>
            <div className="bg-[#1c1b1b] p-8 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Event Alerts</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[#e5e2e1]">
                      <span className="text-sm">Trade Activity</span>
                      <input defaultChecked className="rounded-sm bg-[#0e0e0e] border border-white/5 text-[#00d1ff] focus:ring-[#00d1ff]" type="checkbox" />
                    </div>
                    <div className="flex items-center justify-between text-[#e5e2e1]">
                      <span className="text-sm">Copy Events</span>
                      <input defaultChecked className="rounded-sm bg-[#0e0e0e] border border-white/5 text-[#00d1ff] focus:ring-[#00d1ff]" type="checkbox" />
                    </div>
                    <div className="flex items-center justify-between text-[#e5e2e1]">
                      <span className="text-sm">System Alerts</span>
                      <input defaultChecked className="rounded-sm bg-[#0e0e0e] border border-white/5 text-[#00d1ff] focus:ring-[#00d1ff]" type="checkbox" />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Delivery Methods</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[#e5e2e1]">
                      <span className="text-sm">Email Notifications</span>
                      <input defaultChecked className="rounded-sm bg-[#0e0e0e] border border-white/5 text-[#00d1ff] focus:ring-[#00d1ff]" type="checkbox" />
                    </div>
                    <div className="flex items-center justify-between text-[#e5e2e1]">
                      <span className="text-sm">Telegram Push</span>
                      <input className="rounded-sm bg-[#0e0e0e] border border-white/5 text-[#00d1ff] focus:ring-[#00d1ff]" type="checkbox" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayoutV2>
      <div className="max-w-5xl mx-auto pb-20">
        {/* Horizontal Tab Bar */}
        <div className="flex flex-wrap items-center gap-1 bg-[#1c1b1b] p-1 rounded-lg border border-white/5 mb-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 text-xs font-headline font-bold uppercase tracking-widest transition-all duration-300 rounded-md whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-[#00d1ff] text-[#003543] shadow-[0_0_15px_rgba(0,209,255,0.3)]"
                  : "text-white/40 hover:text-white hover:bg-[#353534]/50"
              )}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[500px]">
          {renderContent()}
        </div>

        {/* Global Action Bar — persists Trading Preferences (copy trade rules) to Supabase */}
        <div className="mt-12 flex min-w-0 w-full flex-col gap-3 border-t border-white/5 pt-12 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-4">
          <button
            type="button"
            disabled={tradeSettingsLoading}
            onClick={() => void handleDiscardTradePreferences()}
            className="order-2 w-full px-6 py-3 font-headline text-sm font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-white disabled:opacity-50 sm:order-1 sm:w-auto sm:px-8"
          >
            Discard Changes
          </button>
          <button
            type="button"
            disabled={savingTradePrefs || tradeSettingsLoading || !user?.id}
            onClick={() => void handleSaveTradePreferences()}
            className="order-1 w-full rounded-sm bg-[#00d1ff] px-6 py-3 font-headline text-sm font-bold uppercase tracking-tighter text-[#003543] shadow-[0_0_20px_rgba(0,209,255,0.2)] transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:order-2 sm:w-auto sm:px-10"
          >
            {savingTradePrefs ? "Saving…" : "Commit Synchronous Updates"}
          </button>
        </div>
      </div>
    </DashboardLayoutV2>
  );
};

export default SettingsPageV2;

const RuleToggleRowSettings = ({
  label,
  enabled,
  onToggle,
  children,
}: {
  label: string;
  enabled: boolean;
  onToggle: (checked: boolean) => void;
  children: ReactNode;
}) => (
  <div
    title={!enabled ? DISABLED_HINT : undefined}
    className={`rounded-sm border border-white/5 bg-[#0E0E0E] p-3 ${!enabled ? "cursor-not-allowed opacity-90" : ""}`}
  >
    <label className="mb-3 flex items-center justify-between gap-3">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{label}</span>
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onToggle(e.target.checked)}
        className="h-4 w-4 rounded-sm border-white/20 bg-transparent text-[#00D1FF] focus:ring-0"
      />
    </label>
    {children}
  </div>
);
