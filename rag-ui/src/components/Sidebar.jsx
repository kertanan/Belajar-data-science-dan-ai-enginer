import { NavLink } from "react-router-dom";
import Icon from "./Icon";
import { useStore } from "../store/StoreContext";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/documents", label: "Documents", icon: "documents" },
  { to: "/chat", label: "Chat", icon: "chat" },
  { to: "/evaluations", label: "Evaluations", icon: "evaluations", evaluatorOnly: true },
  { to: "/profile", label: "Profile", icon: "profile" },
];

export default function Sidebar({ open, onClose }) {
  const { user } = useStore();

  return (
    <>
      {/* Overlay untuk mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 p-4 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full vui-card flex flex-col p-5">
          {/* Logo */}
          <div className="flex items-center gap-3 pb-5 mb-5 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow">
              <Icon name="layers" className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white leading-tight">RAG Docs</p>
              <p className="text-[11px] text-slate-400">Platform Dokumen</p>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 space-y-1.5" aria-label="Navigasi utama">
            {NAV.filter((n) => !n.evaluatorOnly || user?.role === "evaluator").map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand-gradient text-white shadow-glow"
                      : "text-slate-400 hover:text-white hover:bg-navy-700"
                  }`
                }
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-lg bg-navy-900/40`}
                >
                  <Icon name={item.icon} className="w-4 h-4" />
                </span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Kartu bantuan */}
          <div className="mt-5 rounded-2xl bg-brand-gradient p-4 text-white">
            <Icon name="spark" className="w-6 h-6 mb-2" />
            <p className="text-sm font-semibold leading-tight">Butuh bantuan?</p>
            <p className="text-[11px] text-white/80 mt-1">
              Lihat panduan unggah PDF dan evaluasi retrieval.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
