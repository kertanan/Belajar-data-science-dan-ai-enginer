import { useState } from "react";
import { Outlet, useLocation, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Icon from "./Icon";
import { useStore } from "../store/StoreContext";

const TITLES = {
  "/dashboard": "Dashboard",
  "/documents": "Documents",
  "/chat": "Chat",
  "/evaluations": "Evaluations",
  "/profile": "Profile",
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Proteksi: harus login (PRD FR01)
  if (!user) return <Navigate to="/login" replace />;

  const title = TITLES[location.pathname] || "RAG Docs";

  return (
    <div className="min-h-screen bg-page-gradient">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 backdrop-blur-md bg-navy-900/60 border-b border-white/5">
          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden vui-btn-ghost !px-2.5 !py-2.5"
                onClick={() => setSidebarOpen(true)}
                aria-label="Buka menu"
              >
                <Icon name="menu" className="w-5 h-5" />
              </button>
              <div>
                <p className="text-[11px] text-slate-400">Platform Dokumen RAG</p>
                <h1 className="text-xl font-bold text-white leading-tight">{title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
                <p className="text-[11px] text-slate-400 capitalize">{user.role}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0) || "U"}
              </div>
              <button
                className="vui-btn-ghost !px-2.5 !py-2.5"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                aria-label="Keluar"
                title="Keluar"
              >
                <Icon name="logout" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Konten */}
        <main className="p-4 sm:p-6 max-w-7xl mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
