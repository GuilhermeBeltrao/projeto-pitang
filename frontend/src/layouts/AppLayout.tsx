import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import MobileNav from "../components/MobileNav";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen flex">
      <SideNav />
      <div className="flex-1 flex flex-col">
        <TopNav onMenuToggle={() => setMobileOpen(true)} />
        <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <main className="flex-1 px-6 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
