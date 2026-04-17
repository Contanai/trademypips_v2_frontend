import { useEffect, useState, type ReactNode } from "react";
import SidebarV2 from "./SidebarV2";
import HeaderV2 from "./HeaderV2";
import StatusFooterV2 from "./StatusFooterV2";

const DashboardLayoutV2 = ({ children }: { children: ReactNode }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) setSidebarExpanded(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="flex min-h-screen min-w-0 overflow-x-hidden bg-[#131313] text-[#e5e2e1]">
      <SidebarV2 expanded={sidebarExpanded} onExpandedChange={setSidebarExpanded} />

      {sidebarExpanded ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarExpanded(false)}
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col pl-14 transition-[padding] duration-200 ease-out lg:pl-0 lg:ml-[260px]">
        <HeaderV2 />
        <main className="mx-auto min-w-0 w-full max-w-[1600px] flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <StatusFooterV2 />
      </div>
    </div>
  );
};

export default DashboardLayoutV2;
