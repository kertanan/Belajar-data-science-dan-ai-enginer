import Icon from "./Icon";

export default function StatCard({ label, value, sub, icon, accent = "brand" }) {
  const accents = {
    brand: "bg-brand-gradient",
    teal: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    amber: "bg-gradient-to-br from-amber-400 to-amber-600",
    purple: "bg-gradient-to-br from-purple-400 to-purple-600",
  };
  return (
    <div className="vui-card p-5 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-white mt-1 truncate">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
      <div className={`shrink-0 w-12 h-12 rounded-xl ${accents[accent]} flex items-center justify-center shadow-glow`}>
        <Icon name={icon} className="w-6 h-6 text-white" />
      </div>
    </div>
  );
}
