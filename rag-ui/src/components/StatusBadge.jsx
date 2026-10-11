import Icon from "./Icon";

// Status dokumen sesuai PRD bagian 5 (FR04)
const STATUS = {
  Queued: { label: "Queued", color: "text-slate-300 bg-slate-500/15 border-slate-400/20", icon: "clock" },
  Processing: { label: "Processing", color: "text-brand-400 bg-brand-500/15 border-brand-400/20", icon: "layers", pulse: true },
  Retrying: { label: "Retrying", color: "text-accent-amber bg-amber-500/15 border-amber-400/20", icon: "retry", pulse: true },
  Ready: { label: "Ready", color: "text-accent-teal bg-emerald-500/15 border-emerald-400/20", icon: "check" },
  Failed: { label: "Failed", color: "text-accent-red bg-red-500/15 border-red-400/20", icon: "warning" },
  Deleting: { label: "Deleting", color: "text-slate-400 bg-slate-600/20 border-slate-500/20", icon: "trash", pulse: true },
  Deleted: { label: "Deleted", color: "text-slate-500 bg-slate-700/20 border-slate-600/20", icon: "trash" },
};

export default function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.Queued;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${s.color}`}
    >
      <Icon name={s.icon} className={`w-3.5 h-3.5 ${s.pulse ? "animate-pulse-dot" : ""}`} />
      {s.label}
    </span>
  );
}

export { STATUS };
