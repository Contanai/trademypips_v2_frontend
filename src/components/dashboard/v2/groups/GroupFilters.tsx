import React from "react";
import { Search, Plus } from "lucide-react";

interface GroupFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onSearchChange: (value: string) => void;
  onCreateGroup: () => void;
}

const GroupFilters = ({ activeFilter, onFilterChange, onSearchChange, onCreateGroup }: GroupFiltersProps) => {
  const filters = ["All", "Active", "Paused", "Errors"];

  return (
    <div className="mb-8 flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 max-w-full flex-wrap gap-1 rounded-sm bg-surface-container-lowest p-1 shadow-inner">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`rounded-sm px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all sm:px-4 ${
              activeFilter === filter
                ? "bg-surface-container-high text-[#00D1FF] shadow-sm"
                : "text-gray-500 hover:bg-white/5 hover:text-on-surface"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex min-w-0 w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 md:max-w-full md:flex-1 md:flex-nowrap md:justify-end">
        <div className="group relative min-w-0 w-full flex-1 sm:min-w-[12rem] md:min-w-0 md:max-w-md md:flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-[#00D1FF]">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by account or group name..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full min-w-0 rounded-sm border-none bg-surface-container-low py-2 pl-10 pr-4 text-sm text-on-surface outline-none transition-all placeholder:text-gray-600 focus:ring-1 focus:ring-[#00D1FF]/40"
          />
        </div>
        <button
          type="button"
          onClick={onCreateGroup}
          className="flex w-full shrink-0 items-center justify-center gap-2 rounded-sm bg-primary-container px-4 py-3 font-bold text-xs uppercase tracking-tight text-[#003543] blue-glow transition-all hover:brightness-110 active:scale-95 sm:w-auto sm:px-6"
        >
          <Plus size={16} />
          CREATE COPY GROUP
        </button>
      </div>
    </div>
  );
};

export default GroupFilters;
