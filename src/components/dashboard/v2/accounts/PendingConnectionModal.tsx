import { X } from "lucide-react";

interface PendingConnectionModalProps {
  isOpen: boolean;
  accountName: string;
  connectionUrl: string | null;
  onClose: () => void;
}

const PendingConnectionModal = ({
  isOpen,
  accountName,
  connectionUrl,
  onClose,
}: PendingConnectionModalProps) => {
  if (!isOpen || !connectionUrl) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#0E0E0E]/75 backdrop-blur-sm" onClick={onClose} />
      <section className="fixed left-1/2 top-[42%] z-50 h-[88vh] w-[96vw] max-w-6xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border border-white/10 bg-[#11161D] shadow-2xl">
        <header className="flex items-center justify-between border-b border-white/10 bg-[#131b25] px-5 py-4">
          <div>
            <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-[#00D1FF]">
              Pending Account
            </p>
            <h3 className="font-headline text-sm font-bold uppercase tracking-wide text-white">
              Complete Account Connection - {accountName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Close connection modal"
          >
            <X size={18} />
          </button>
        </header>

        <div className="h-[calc(88vh-65px)] w-full bg-black">
          <iframe
            title={`Pending connection for ${accountName}`}
            src={connectionUrl}
            className="h-full w-full border-0"
            allow="clipboard-read; clipboard-write"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>
    </>
  );
};

export default PendingConnectionModal;
