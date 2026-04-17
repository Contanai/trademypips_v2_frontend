import React from "react";
import { Search, RotateCw, Plus } from "lucide-react";

interface AccountFiltersProps {
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: string) => void;
  onAddAccount: () => void;
  activeFilter: string;
}

const AccountFilters = ({ onSearchChange, onFilterChange, onAddAccount, activeFilter }: AccountFiltersProps) => {
  const filters = ["All", "Masters", "Copiers", "Active", "Disconnected"];

  return (
    <div className="mb-6 flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`rounded-full border border-transparent px-3 py-1.5 text-xs font-bold transition-all sm:px-4 ${
              activeFilter === filter
                ? "bg-primary-container bg-[#00D1FF] text-on-primary text-[#003543]"
                : "bg-surface-container-high text-gray-400 hover:bg-surface-variant hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex min-w-0 w-full flex-wrap items-center gap-2 sm:gap-3 md:w-auto md:flex-nowrap md:justify-end">
        <div className="group relative min-w-0 flex-1 basis-[min(100%,12rem)] sm:basis-auto md:w-48 md:flex-none">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-[#00D1FF]">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Filter accounts..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full min-w-0 rounded-sm border-none bg-surface-container-lowest py-2 pl-9 pr-4 text-xs outline-none transition-all placeholder:text-gray-600 focus:ring-1 focus:ring-primary-container md:w-48"
          />
        </div>
        <button
          type="button"
          className="shrink-0 rounded-sm border border-transparent bg-surface-container-high p-2 text-gray-400 transition-all hover:border-white/10 hover:text-primary"
        >
          <RotateCw size={14} className="transition-transform duration-500 hover:rotate-180" />
        </button>
        <button
          type="button"
          onClick={onAddAccount}
          className="flex shrink-0 items-center gap-2 rounded-sm bg-[#00D1FF] px-4 py-2 font-headline text-xs font-bold text-[#003543] blue-glow transition-all hover:scale-[0.98]"
        >
          <Plus size={14} />
          Add Account
        </button>
      </div>
    </div>
  );
};

export default AccountFilters;
