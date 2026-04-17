import { useState } from "react";
import { X, PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { writeSystemLog } from "@/lib/systemLogs";

interface AddAccountModalProps {
  isOpen: boolean;
  userId: string | null;
  onClose: () => void;
  onCreated: () => void;
}

const AddAccountModal = ({ isOpen, userId, onClose, onCreated }: AddAccountModalProps) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [brokerServer, setBrokerServer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const reset = () => {
    setAccountNumber("");
    setBrokerServer("");
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError("You must be logged in to add an account.");
      return;
    }
    if (!accountNumber.trim() || !brokerServer.trim()) {
      setError("Enter account number and broker server.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: insertError } = await supabase.from("trading_accounts").insert({
        user_id: userId,
        account_number: accountNumber.trim(),
        broker_server: brokerServer.trim(),
        platform: "mt5",
        account_type: "slave",
        status: "disconnected",
        account_name: `MT5-${accountNumber.trim().slice(-4)}`,
      } as any);

      if (insertError) {
        await writeSystemLog({
          userId,
          level: "error",
          source: "accounts",
          category: "errors",
          eventType: "account_create_failed",
          message: `Failed to add account ${accountNumber.trim()}: ${insertError.message}`,
          metadata: { brokerServer: brokerServer.trim() },
        });
        if (insertError.message.toLowerCase().includes("row-level security")) {
          setError("Insert blocked by RLS policy. Allow INSERT on trading_accounts where user_id = auth.uid().");
        } else {
          setError(insertError.message);
        }
        return;
      }

      await writeSystemLog({
        userId,
        level: "info",
        source: "accounts",
        category: "system",
        eventType: "account_created",
        message: `Account MT5-${accountNumber.trim().slice(-4)} added`,
        metadata: { brokerServer: brokerServer.trim() },
      });

      handleClose();
      onCreated();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Failed to add account. Please try again.";
      await writeSystemLog({
        userId,
        level: "error",
        source: "accounts",
        category: "errors",
        eventType: "account_create_exception",
        message,
      });
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-[#0E0E0E]/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />
      <aside className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-white/5 bg-surface-container shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 bg-[#131b25] p-6">
          <div>
            <span className="mb-1 block text-[10px] font-headline font-bold uppercase tracking-widest text-[#00D1FF]">
              Account Onboarding
            </span>
            <h3 className="font-headline text-2xl font-bold tracking-tight text-white">Add Account</h3>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-2 text-gray-500 transition-all hover:bg-white/5 hover:text-white"
            aria-label="Close add account modal"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#11161D] p-6">
          <div className="rounded-sm border border-white/5 bg-surface-container-low p-4">
            <p className="mb-3 text-[10px] font-headline font-bold uppercase tracking-widest text-gray-500">Platform</p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-sm bg-white p-1">
                <img src="/platform-logos/mt5.png" alt="MetaTrader 5 logo" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="font-headline text-sm font-bold uppercase tracking-wider text-white">MetaTrader 5</p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Only available platform for now</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/60">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="e.g. 12345678"
              className="w-full rounded-sm border border-white/5 bg-[#0e0e0e] p-3 text-sm text-white outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/60">Broker Server</label>
            <input
              type="text"
              value={brokerServer}
              onChange={(e) => setBrokerServer(e.target.value)}
              placeholder="e.g. ICMarkets-Demo"
              className="w-full rounded-sm border border-white/5 bg-[#0e0e0e] p-3 text-sm text-white outline-none"
            />
          </div>

          {error ? <p className="text-xs text-[#ffb4ab]">{error}</p> : null}

          <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-headline font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-sm bg-[#00D1FF] px-5 py-2 text-xs font-headline font-bold uppercase tracking-widest text-[#003543] transition-all hover:brightness-110 disabled:opacity-60"
            >
              <PlusCircle size={14} />
              {submitting ? "Adding..." : "Add Account"}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
};

export default AddAccountModal;
