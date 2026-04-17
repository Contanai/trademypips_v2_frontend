import { useState, useEffect, useRef, type ReactNode } from "react";
import { X, Search, CheckCircle, ArrowRight, ArrowLeft, Landmark } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  initialCopyRules,
  copyRulesToPersist,
  parseOptionalNumber,
  type CopyRulesState,
  type TradeType,
  type CloseBehavior,
} from "@/lib/copyTradeSettings";
import { useUserTradeSettings } from "@/hooks/v2/useDashboardData";
import { writeSystemLog } from "@/lib/systemLogs";

interface CreateGroupWizardProps {
  accounts: any[];
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  initialMasterId?: string | null;
  initialSelectedCopierIds?: string[];
  initialStep?: 1 | 2 | 3;
  /** Called after master role is promoted (step 2 → 3) and when wizard finishes */
  onProgress?: () => void;
}

const normalizeRole = (accountType: unknown) =>
  String(accountType ?? "slave").toLowerCase();
const DISABLED_HINT = "Enable to edit";

const isCopierAccount = (acc: any, masterId: string | null) => {
  if (!acc?.id || acc.id === masterId) return false;
  return normalizeRole(acc.account_type) !== "master";
};

const CreateGroupWizard = ({
  accounts = [],
  userId,
  isOpen,
  onClose,
  initialMasterId = null,
  initialSelectedCopierIds = [],
  initialStep = 1,
  onProgress,
}: CreateGroupWizardProps) => {
  const [step, setStep] = useState(1);
  const [selectedMasterId, setSelectedMasterId] = useState<string | null>(null);
  const [selectedCopierIds, setSelectedCopierIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copyRules, setCopyRules] = useState<CopyRulesState>(initialCopyRules);
  const { data: mergedTradeSettings } = useUserTradeSettings(userId);
  const seedTradeSettings = useRef(true);

  useEffect(() => {
    if (!isOpen) return;
    setStep(initialStep);
    setSelectedMasterId(initialMasterId);
    setSelectedCopierIds(initialSelectedCopierIds);
    setSearch("");
    setError("");
    setSubmitting(false);
    setCopyRules(initialCopyRules);
    seedTradeSettings.current = true;
  }, [isOpen, initialMasterId, initialSelectedCopierIds, initialStep]);

  useEffect(() => {
    if (!isOpen || !seedTradeSettings.current || mergedTradeSettings == null) return;
    setCopyRules(mergedTradeSettings);
    seedTradeSettings.current = false;
  }, [isOpen, mergedTradeSettings]);

  if (!isOpen) return null;

  const matchesSearch = (acc: any) => {
    const q = search.toLowerCase();
    const name = acc.account_name?.toLowerCase() ?? "";
    const number = String(acc.account_number ?? "");
    return name.includes(q) || number.includes(search);
  };

  const filteredStep1 = accounts.filter(matchesSearch);
  const filteredStep2 = accounts.filter(
    (acc) => isCopierAccount(acc, selectedMasterId) && matchesSearch(acc)
  );

  const goStep1Next = () => {
    if (!selectedMasterId) return;
    setError("");
    setStep(2);
  };

  const goStep2Next = async () => {
    const isCreateFlow = initialStep === 1;
    if (!selectedMasterId || !userId) {
      setError(!userId ? "You must be logged in." : "Select a master account.");
      return;
    }
    if (isCreateFlow && selectedCopierIds.length === 0) {
      setError("Select at least one copier account.");
      return;
    }
    setError("");
    setSubmitting(true);

    const master = accounts.find((a) => a.id === selectedMasterId);
    const masterRole = normalizeRole(master?.account_type);

    if (masterRole !== "master") {
      const { error: updateError } = await supabase
        .from("trading_accounts")
        .update({ account_type: "master" } as any)
        .eq("id", selectedMasterId)
        .eq("user_id", userId);

      if (updateError) {
        setSubmitting(false);
        setError(updateError.message);
        return;
      }
      await writeSystemLog({
        userId,
        level: "info",
        source: "copy_groups",
        category: "system",
        eventType: "account_role_changed",
        message: "Master account role enabled for copy group",
        metadata: { accountId: selectedMasterId, previousRole: masterRole, newRole: "master" },
      });
      onProgress?.();
    }

    setSubmitting(false);
    setStep(3);
  };

  const handleFinish = async () => {
    if (!userId || !selectedMasterId) {
      setError("Select a master account before finishing.");
      return;
    }
    setError("");
    setSubmitting(true);
    const selectedUnique = Array.from(new Set(selectedCopierIds));
    const { data: existingRows, error: fetchError } = await (supabase as any)
      .from("copy_configurations")
      .select("id, copier_account_id, active, trade_settings, copy_mode, lot_multiplier, max_lot_size")
      .eq("user_id", userId)
      .eq("master_account_id", selectedMasterId);

    if (fetchError) {
      await writeSystemLog({
        userId,
        level: "error",
        source: "copy_groups",
        category: "errors",
        eventType: "group_sync_fetch_failed",
        message: `Failed to load existing group links: ${fetchError.message}`,
        metadata: { masterId: selectedMasterId },
      });
      setSubmitting(false);
      setError(fetchError.message);
      return;
    }

    const existing = Array.isArray(existingRows) ? existingRows : [];
    const existingIdSet = new Set<string>(existing.map((row: any) => row.copier_account_id));

    // Clean duplicate rows for the same copier in this master group.
    const seenCopierIds = new Set<string>();
    const duplicateRowIdsToDelete: string[] = [];
    existing.forEach((row: any) => {
      const copierId = row.copier_account_id as string;
      if (seenCopierIds.has(copierId)) duplicateRowIdsToDelete.push(row.id as string);
      else seenCopierIds.add(copierId);
    });

    if (duplicateRowIdsToDelete.length > 0) {
      const { error: duplicateDeleteError } = await (supabase as any)
        .from("copy_configurations")
        .delete()
        .in("id", duplicateRowIdsToDelete);
      if (duplicateDeleteError) {
        await writeSystemLog({
          userId,
          level: "error",
          source: "copy_groups",
          category: "errors",
          eventType: "group_duplicate_cleanup_failed",
          message: `Failed cleaning duplicate copier links: ${duplicateDeleteError.message}`,
          metadata: { masterId: selectedMasterId, duplicateCount: duplicateRowIdsToDelete.length },
        });
        setSubmitting(false);
        setError(duplicateDeleteError.message);
        return;
      }
    }

    const copierIdsToRemove = Array.from(existingIdSet).filter((id) => !selectedUnique.includes(id));
    if (copierIdsToRemove.length > 0) {
      const { error: removeError } = await (supabase as any)
        .from("copy_configurations")
        .delete()
        .eq("user_id", userId)
        .eq("master_account_id", selectedMasterId)
        .in("copier_account_id", copierIdsToRemove);
      if (removeError) {
        await writeSystemLog({
          userId,
          level: "error",
          source: "copy_groups",
          category: "errors",
          eventType: "group_copier_remove_failed",
          message: `Failed removing copiers from group: ${removeError.message}`,
          metadata: { masterId: selectedMasterId, removeCount: copierIdsToRemove.length },
        });
        setSubmitting(false);
        setError(removeError.message);
        return;
      }
    }

    const copierIdsToAdd = selectedUnique.filter((id) => !existingIdSet.has(id));
    if (copierIdsToAdd.length > 0) {
      const template = existing[0];
      const persisted = copyRulesToPersist(copyRules);
      const lot = parseOptionalNumber(copyRules.lotMultiplier);
      const maxLot = parseOptionalNumber(copyRules.maxLot);
      const rows = copierIdsToAdd.map((copierId) => ({
        user_id: userId,
        master_account_id: selectedMasterId,
        copier_account_id: copierId,
        active: template?.active ?? true,
        trade_settings: template?.trade_settings ?? persisted,
        copy_mode: template?.copy_mode ?? (copyRules.riskMode === "fixed" ? "fixed" : "proportional"),
        ...(template?.lot_multiplier != null ? { lot_multiplier: template.lot_multiplier } : lot != null ? { lot_multiplier: lot } : {}),
        ...(template?.max_lot_size != null ? { max_lot_size: template.max_lot_size } : maxLot != null ? { max_lot_size: maxLot } : {}),
      }));

      const { error: insertError } = await (supabase as any).from("copy_configurations").insert(rows);
      if (insertError) {
        await writeSystemLog({
          userId,
          level: "error",
          source: "copy_groups",
          category: "errors",
          eventType: "group_copier_add_failed",
          message: `Failed adding copiers to group: ${insertError.message}`,
          metadata: { masterId: selectedMasterId, addCount: copierIdsToAdd.length },
        });
        setSubmitting(false);
        setError(insertError.message);
        return;
      }
    }

    await writeSystemLog({
      userId,
      level: "info",
      source: "copy_groups",
      category: "system",
      eventType: "group_synced",
      message: "Copy group copiers updated",
      metadata: {
        masterId: selectedMasterId,
        totalSelected: selectedUnique.length,
        added: copierIdsToAdd.length,
        removed: copierIdsToRemove.length,
      },
    });

    setSubmitting(false);
    onProgress?.();
    onClose();
  };

  const renderAccountCard = (
    acc: any,
    selected: boolean,
    onSelect: () => void
  ) => {
    const role = normalizeRole(acc.account_type);
    const isMasterRole = role === "master";
    return (
      <div
        key={acc.id}
        onClick={onSelect}
        className={`relative cursor-pointer rounded-sm border-2 p-4 transition-all group ${
          selected
            ? "border-[#00D1FF] bg-[#00D1FF]/5 shadow-[0_0_15px_rgba(0,209,255,0.1)]"
            : "border-white/5 bg-surface-container-lowest hover:border-[#00D1FF]/30 hover:bg-white/5"
        }`}
      >
        {selected && (
          <div className="absolute right-3 top-3 animate-in zoom-in duration-200 text-[#00D1FF]">
            <CheckCircle size={20} />
          </div>
        )}
        <div
          className={`mb-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${
            selected ? "text-[#00D1FF]" : "text-gray-500"
          }`}
        >
          {acc.broker_server?.split("-")[0] || "MetaTrader"}
        </div>
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`rounded-sm border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
              isMasterRole
                ? "border-[#00D1FF]/40 bg-[#00D1FF]/10 text-[#00D1FF]"
                : "border-slate-600 bg-surface-container-low text-slate-400"
            }`}
          >
            {isMasterRole ? "Master" : "Copier"}
          </span>
        </div>
        <div
          className={`mb-3 font-headline text-xl font-bold transition-colors ${
            selected ? "text-white" : "text-slate-200"
          }`}
        >
          {acc.account_name || `MT5-${(acc.account_number ?? "").slice(-3)}`}
        </div>
        <div className="flex items-end justify-between border-t border-white/5 pt-3">
          <div>
            <span className="block font-headline text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Balance
            </span>
            <span
              className={`font-mono text-sm font-bold ${
                selected ? "text-[#27ff97]" : "text-slate-400"
              }`}
            >
              ${acc.balance?.toLocaleString() || "0.00"}
            </span>
          </div>
          <div className="text-right">
            <span className="font-mono text-[10px] uppercase tracking-tighter text-gray-500">
              ID: {acc.account_number}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const stepTitle =
    step === 1
      ? "Step 1: Select Master Account"
      : step === 2
        ? "Step 2: Select Copier Account(s)"
        : "Step 3: Copy Rules";

  const stepSubtitle =
    step === 1
      ? "This account will be the source of all copied trades."
      : step === 2
        ? "Only copier (slave) accounts are shown. Select one or more accounts."
        : "Configure risk, filters, execution safety, and synchronization behavior.";

  const emptyMessageStep1 =
    accounts.length === 0 ? "No accounts linked yet" : "No accounts match your search";
  const emptyMessageStep2 =
    accounts.filter((a) => isCopierAccount(a, selectedMasterId)).length === 0
      ? "No copier accounts available (add slave accounts or pick a different master)."
      : "No copier accounts match your search";

  return (
    <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-[#131313]/90 backdrop-blur-md duration-300 fade-in">
      <div className="flex min-h-0 max-h-[90vh] w-full max-w-[720px] flex-col overflow-hidden rounded-sm border border-white/5 bg-surface-container-low shadow-2xl">
        <div className="shrink-0 border-b border-white/5 bg-[#131b25] p-6 sm:p-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-headline text-2xl font-bold uppercase tracking-widest text-white">
              Create New Copy Group
            </h2>
            <button 
              onClick={onClose}
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <StepIndicator step={1} currentStep={step} label="MASTER" />
            <div className="h-[1px] w-12 bg-white/10" />
            <StepIndicator step={2} currentStep={step} label="COPIERS" />
            <div className="h-[1px] w-12 bg-white/10" />
            <StepIndicator step={3} currentStep={step} label="RULES" />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#11161D] p-6 sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-white">{stepTitle}</h3>
              <p className="mt-1 font-body text-sm text-gray-500">{stepSubtitle}</p>
            </div>
            {(step === 1 || step === 2) && (
              <div className="group relative w-full sm:w-64">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 transition-colors group-focus-within:text-[#00D1FF]">
                <Search size={14} />
              </span>
              <input 
                type="text" 
                placeholder="Filter accounts..." 
                  value={search}
                onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-sm border-none bg-surface-container-lowest py-2 pl-8 text-xs text-on-surface outline-none transition-all placeholder:text-gray-700 focus:ring-1 focus:ring-[#00D1FF]/40"
              />
            </div>
            )}
          </div>

          {error ? <p className="mb-4 text-xs text-[#ffb4ab]">{error}</p> : null}

          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              {filteredStep1.length > 0 ? (
                filteredStep1.map((acc) =>
                  renderAccountCard(acc, selectedMasterId === acc.id, () => setSelectedMasterId(acc.id))
                )
              ) : (
                <div className="col-span-2 rounded border border-dashed border-white/5 py-20 text-center">
                  <Landmark size={24} className="mx-auto mb-2 opacity-50 text-gray-700" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-gray-600">{emptyMessageStep1}</p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <>
              <p className="mb-3 text-[10px] uppercase tracking-widest text-gray-500">
                Selected copiers: <span className="text-[#00D1FF]">{selectedCopierIds.length}</span>
              </p>
              <div className="grid grid-cols-2 gap-4">
              {filteredStep2.length > 0 ? (
                filteredStep2.map((acc) =>
                  renderAccountCard(acc, selectedCopierIds.includes(acc.id), () =>
                    setSelectedCopierIds((prev) =>
                      prev.includes(acc.id) ? prev.filter((id) => id !== acc.id) : [...prev, acc.id]
                    )
                  )
                )
              ) : (
                <div className="col-span-2 rounded border border-dashed border-white/5 py-20 text-center">
                  <Landmark size={24} className="mx-auto mb-2 opacity-50 text-gray-700" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-gray-600">{emptyMessageStep2}</p>
                </div>
              )}
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-5">
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
                  <RuleToggleRow
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
                  </RuleToggleRow>
                  <RuleToggleRow
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
                  </RuleToggleRow>
                  <RuleToggleRow
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
                  </RuleToggleRow>
                  <RuleToggleRow
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
                  </RuleToggleRow>
                  <RuleToggleRow
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
                  </RuleToggleRow>
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
            )}
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-white/5 bg-[#131b25] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <button 
            onClick={onClose}
            className="order-2 px-2 py-2 font-headline text-[10px] font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-white sm:order-1 sm:px-6"
          >
            Cancel Execution
          </button>
          <div className="order-1 flex min-w-0 flex-wrap items-center justify-end gap-2 sm:order-2 sm:gap-3">
            {step > 1 && step < 3 && (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep((s) => s - 1);
                }}
                className="flex items-center gap-2 rounded-sm border border-white/10 px-6 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-colors hover:bg-white/5"
              >
                <ArrowLeft size={14} />
                Back
              </button>
            )}
            {step === 1 && (
            <button 
                type="button"
              disabled={!selectedMasterId}
                onClick={goStep1Next}
                title="Go to copier selection"
                className={`flex items-center gap-2 rounded-sm bg-[#00D1FF] px-6 py-3 font-headline text-xs font-bold uppercase tracking-widest text-[#003543] transition-all blue-glow sm:px-10 sm:text-[10px] ${
                  !selectedMasterId ? "cursor-not-allowed opacity-50 grayscale" : "hover:brightness-110 active:scale-95"
                }`}
              >
                Next
                <ArrowRight size={14} />
              </button>
            )}
            {step === 2 && (
              <button
                type="button"
                disabled={(initialStep === 1 && selectedCopierIds.length === 0) || submitting}
                onClick={() => void goStep2Next()}
                title="Save master role and continue"
                className={`flex items-center gap-2 rounded-sm bg-[#00D1FF] px-6 py-3 font-headline text-xs font-bold uppercase tracking-widest text-[#003543] transition-all blue-glow sm:px-10 sm:text-[10px] ${
                  (initialStep === 1 && selectedCopierIds.length === 0) || submitting ? "cursor-not-allowed opacity-50 grayscale" : "hover:brightness-110 active:scale-95"
                }`}
              >
                {submitting ? "Saving..." : "Next"}
                {!submitting && <ArrowRight size={14} />}
              </button>
            )}
            {step === 3 && (
              <button
                type="button"
                disabled={submitting}
                onClick={() => void handleFinish()}
                className={`flex items-center gap-2 rounded-sm bg-[#00D1FF] px-10 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-[#003543] transition-all blue-glow ${
                  submitting ? "cursor-not-allowed opacity-60" : "hover:brightness-110 active:scale-95"
                }`}
              >
                {submitting ? "Saving…" : "Finish"}
                {!submitting && <ArrowRight size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StepIndicator = ({
  step: stepNum,
  currentStep,
  label,
}: {
  step: number;
  currentStep: number;
  label: string;
}) => (
  <div className={`flex items-center gap-2 ${currentStep < stepNum ? "opacity-40" : "opacity-100"}`}>
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
        currentStep === stepNum
        ? "bg-[#00D1FF] text-[#003543] shadow-[0_0_10px_rgba(0,209,255,0.3)]" 
        : "border border-white/20 text-gray-500"
      }`}
    >
      {stepNum}
    </div>
    <span
      className={`font-headline text-xs font-bold uppercase tracking-widest ${
        currentStep === stepNum ? "text-[#00D1FF]" : "text-gray-500"
      }`}
    >
      {label}
    </span>
  </div>
);

const RuleToggleRow = ({
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

export default CreateGroupWizard;
