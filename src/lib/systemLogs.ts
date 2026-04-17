import { supabase } from "@/integrations/supabase/client";

export type LogLevel = "info" | "warning" | "error";

interface WriteSystemLogInput {
  userId: string | null;
  message: string;
  level?: LogLevel;
  source?: string;
  category?: string;
  eventType?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Best-effort write to `system_logs` with schema-tolerant fallbacks.
 * We intentionally swallow final errors so app workflows aren't blocked by logging.
 */
export async function writeSystemLog({
  userId,
  message,
  level = "info",
  source = "platform",
  category = "system",
  eventType = "user_action",
  metadata = {},
}: WriteSystemLogInput): Promise<boolean> {
  if (!userId || !message.trim()) return false;

  // Keep payload aligned to app schema to avoid 400s from probing unknown columns.
  const payload = {
    user_id: userId,
    level,
    category,
    event_type: eventType,
    message,
    source,
    metadata,
  };

  const { error } = await (supabase as any).from("system_logs").insert([payload]);
  if (!error) return true;

  // Fallback minimal payload for stricter schemas.
  const { error: minimalError } = await (supabase as any)
    .from("system_logs")
    .insert([{ user_id: userId, message }]);
  if (!minimalError) return true;

  // Keep business actions non-blocking but visible during debugging.
  console.error("system_logs insert failed", minimalError);
  return false;
}
