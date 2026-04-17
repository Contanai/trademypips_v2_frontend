import { useState } from "react";
import { Plus, Play, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type QuickActionsV2Props = {
  onAddAccount?: () => void;
};

const QuickActionsV2 = ({ onAddAccount }: QuickActionsV2Props) => {
  const navigate = useNavigate();
  const [showCopyChoice, setShowCopyChoice] = useState(false);

  return (
    <>
      <section className="col-span-1 flex min-h-0 flex-col gap-3 sm:gap-4 lg:col-span-3">
      <button onClick={onAddAccount} className="flex-1 bg-[#00D1FF] hover:brightness-110 text-[#003543] font-headline font-extrabold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,209,255,0.2)] rounded-sm group">
        <Plus className="group-hover:rotate-90 transition-transform" size={18} />
        <span>Add Account</span>
      </button>
      
      <button
        onClick={() => setShowCopyChoice(true)}
        className="flex-1 bg-[#1C1B1B] hover:bg-[#2A2A2A] text-[#27ff97] font-headline font-extrabold uppercase tracking-widest text-sm flex items-center justify-center gap-2 border border-[#27ff97]/20 transition-all rounded-sm"
      >
        <Play size={18} fill="currentColor" />
        <span>Start Copying</span>
      </button>
      
      <button className="flex-1 bg-[#1c1b1b] hover:bg-[#2A2A2A] text-white font-headline font-extrabold uppercase tracking-widest text-sm flex items-center justify-center gap-2 border border-[#859399]/15 transition-all rounded-sm">
        <UserPlus size={18} />
        <span>Create Group</span>
      </button>
      </section>

      {showCopyChoice ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E0E0E]/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-white/10 bg-[#131b25] p-6 shadow-2xl">
            <h3 className="font-headline text-lg font-bold uppercase tracking-widest text-white">
              How do you want to copy?
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Choose whether to copy between your own accounts or follow a signal provider.
            </p>

            <div className="mt-5 space-y-3">
              <button
                onClick={() => {
                  setShowCopyChoice(false);
                  navigate("/dashboard/groups");
                }}
                className="w-full border border-[#00D1FF]/30 bg-[#00D1FF]/10 px-4 py-3 text-left text-sm font-headline font-bold uppercase tracking-wider text-[#00D1FF] hover:bg-[#00D1FF]/20"
              >
                Copy Between My Accounts (Copy Groups)
              </button>
              <button
                onClick={() => {
                  setShowCopyChoice(false);
                  navigate("/dashboard/signals");
                }}
                className="w-full border border-[#27ff97]/30 bg-[#27ff97]/10 px-4 py-3 text-left text-sm font-headline font-bold uppercase tracking-wider text-[#27ff97] hover:bg-[#27ff97]/20"
              >
                Follow a Signal Provider (Signal Hub)
              </button>
            </div>

            <button
              onClick={() => setShowCopyChoice(false)}
              className="mt-4 w-full px-4 py-2 text-xs font-headline font-bold uppercase tracking-widest text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default QuickActionsV2;
