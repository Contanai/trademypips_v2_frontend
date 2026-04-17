/**
 * Copy trade / risk rules: shared shape for Settings (global user prefs),
 * Create Copy Group wizard (defaults from prefs), and DB jsonb columns.
 */

export type TradeType = "both" | "buy" | "sell";
export type CloseBehavior = "master_close" | "independent";

export interface CopyRulesState {
  coreRiskEnabled: boolean;
  riskMode: "proportional" | "fixed";
  lotMultiplier: string;
  minLot: string;
  maxLot: string;
  symbolFilterEnabled: boolean;
  symbolFilterMode: "include" | "exclude";
  symbols: string;
  tradeType: TradeType;
  maxSlippageEnabled: boolean;
  maxSlippage: string;
  maxSpreadEnabled: boolean;
  maxSpread: string;
  maxRiskPerTradeEnabled: boolean;
  maxRiskPerTrade: string;
  dailyDrawdownEnabled: boolean;
  dailyDrawdown: string;
  totalDrawdownEnabled: boolean;
  totalDrawdown: string;
  equityStopEnabled: boolean;
  equityStop: string;
  maxConcurrentTradesEnabled: boolean;
  maxConcurrentTrades: string;
  closeBehavior: CloseBehavior;
  reverseMasterEnabled: boolean;
}

export const initialCopyRules: CopyRulesState = {
  coreRiskEnabled: false,
  riskMode: "proportional",
  lotMultiplier: "",
  minLot: "",
  maxLot: "",
  symbolFilterEnabled: false,
  symbolFilterMode: "include",
  symbols: "",
  tradeType: "both",
  maxSlippageEnabled: false,
  maxSlippage: "",
  maxSpreadEnabled: false,
  maxSpread: "",
  maxRiskPerTradeEnabled: false,
  maxRiskPerTrade: "",
  dailyDrawdownEnabled: false,
  dailyDrawdown: "",
  totalDrawdownEnabled: false,
  totalDrawdown: "",
  equityStopEnabled: false,
  equityStop: "",
  maxConcurrentTradesEnabled: false,
  maxConcurrentTrades: "",
  closeBehavior: "master_close",
  reverseMasterEnabled: false,
};

function strField(r: Record<string, unknown>, key: string): string {
  const v = r[key];
  if (typeof v === "string") return v;
  if (typeof v === "number" && !Number.isNaN(v)) return String(v);
  return "";
}

function boolField(r: Record<string, unknown>, key: keyof CopyRulesState, fallback: boolean): boolean {
  const v = r[key as string];
  return typeof v === "boolean" ? v : fallback;
}

/** Coerce unknown JSON (platform defaults, user row, copy_config snapshot) into a full UI state. */
export function normalizeCopyRules(raw: unknown): CopyRulesState {
  const r = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const risk = r.riskMode === "fixed" ? "fixed" : "proportional";
  const tradeType: TradeType =
    r.tradeType === "buy" || r.tradeType === "sell" ? r.tradeType : "both";
  const closeBehavior: CloseBehavior =
    r.closeBehavior === "independent" ? "independent" : "master_close";
  const symbolFilterMode: "include" | "exclude" =
    r.symbolFilterMode === "exclude" ? "exclude" : "include";

  return {
    coreRiskEnabled: boolField(r, "coreRiskEnabled", initialCopyRules.coreRiskEnabled),
    riskMode: risk,
    lotMultiplier: strField(r, "lotMultiplier"),
    minLot: strField(r, "minLot"),
    maxLot: strField(r, "maxLot"),
    symbolFilterEnabled: boolField(r, "symbolFilterEnabled", initialCopyRules.symbolFilterEnabled),
    symbolFilterMode,
    symbols: typeof r.symbols === "string" ? r.symbols : "",
    tradeType,
    maxSlippageEnabled: boolField(r, "maxSlippageEnabled", initialCopyRules.maxSlippageEnabled),
    maxSlippage: strField(r, "maxSlippage"),
    maxSpreadEnabled: boolField(r, "maxSpreadEnabled", initialCopyRules.maxSpreadEnabled),
    maxSpread: strField(r, "maxSpread"),
    maxRiskPerTradeEnabled: boolField(r, "maxRiskPerTradeEnabled", initialCopyRules.maxRiskPerTradeEnabled),
    maxRiskPerTrade: strField(r, "maxRiskPerTrade"),
    dailyDrawdownEnabled: boolField(r, "dailyDrawdownEnabled", initialCopyRules.dailyDrawdownEnabled),
    dailyDrawdown: strField(r, "dailyDrawdown"),
    totalDrawdownEnabled: boolField(r, "totalDrawdownEnabled", initialCopyRules.totalDrawdownEnabled),
    totalDrawdown: strField(r, "totalDrawdown"),
    equityStopEnabled: boolField(r, "equityStopEnabled", initialCopyRules.equityStopEnabled),
    equityStop: strField(r, "equityStop"),
    maxConcurrentTradesEnabled: boolField(
      r,
      "maxConcurrentTradesEnabled",
      initialCopyRules.maxConcurrentTradesEnabled
    ),
    maxConcurrentTrades: strField(r, "maxConcurrentTrades"),
    closeBehavior,
    reverseMasterEnabled: boolField(r, "reverseMasterEnabled", initialCopyRules.reverseMasterEnabled),
  };
}

/** Merge platform defaults with user row; user keys win. */
export function mergeCopyTradeSettings(platformRaw: unknown, userRaw: unknown): CopyRulesState {
  const p = platformRaw && typeof platformRaw === "object" ? (platformRaw as Record<string, unknown>) : {};
  const u = userRaw && typeof userRaw === "object" ? (userRaw as Record<string, unknown>) : {};
  return normalizeCopyRules({ ...initialCopyRules, ...p, ...u });
}

export function copyRulesToPersist(state: CopyRulesState): CopyRulesState {
  return normalizeCopyRules(state);
}

export function parseOptionalNumber(s: string): number | null {
  if (s === "" || s === undefined) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
