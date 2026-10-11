import { Link } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import Icon from "../components/Icon";

export default function Dashboard() {
  const { documents, evalRuns, user } = useStore();

  const ready = documents.filter((d) => d.status === "Ready");
  const totalChunks = ready.reduce((s, d) => s + (d.chunk_count || 0), 0);
  const processing = documents.filter((d) =>
    ["Queued", "Processing", "Retrying"].includes(d.status)
  );
  // Run terpilih = run terbaru yang selesai (PRD: nilai dari run terpilih)
  const latestRun = evalRuns.find((r) => r.status === "Completed");

  const pct = (v) => `${Math.round(v * 100)}%`;

  return (
    <div className="space-y-6">
      {/* Kartu metrik */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Dokumen Siap" value={ready.length} sub={`${documents.length} total dokumen`} icon="documents" accent="teal" />
        <StatCard label="Total Chunk" value={totalChunks.toLocaleString("id-ID")} sub="pada dokumen siap" icon="layers" accent="brand" />
        <StatCard
          label="Hit Rate@5"
          value={latestRun ? pct(latestRun.metrics.hit_rate_5) : "—"}
          sub={latestRun ? `run ${latestRun.run_id}` : "belum ada run"}
          icon="evaluations"
          accent="purple"
        />
        <StatCard
          label="TTFT p95"
          value={latestRun ? `${(latestRun.metrics.ttft_p95_ms / 1000).toFixed(1)} dtk` : "—"}
          sub={latestRun ? "waktu token pertama" : "belum ada run"}
          icon="clock"
          accent="amber"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Status pemrosesan */}
        <div className="vui-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white">Status Pemrosesan</h2>
              <p className="text-sm text-slate-400">Dokumen yang sedang atau menunggu diproses.</p>
            </div>
            <Link to="/documents" className="vui-btn-ghost text-sm">
              Lihat semua
              <Icon name="chevronRight" className="w-4 h-4" />
            </Link>
          </div>

          {processing.length === 0 ? (
            <EmptyRow text="Tidak ada dokumen dalam antrean pemrosesan." />
          ) : (
            <ul className="space-y-3">
              {processing.map((d) => (
                <li key={d.document_id} className="flex items-center gap-4 rounded-xl bg-navy-900/40 p-3.5">
                  <div className="w-10 h-10 rounded-lg bg-navy-700 flex items-center justify-center shrink-0">
                    <Icon name="file" className="w-5 h-5 text-brand-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">{d.name}</p>
                    <p className="text-xs text-slate-400">
                      {d.pages} halaman{d.stage ? ` · tahap: ${d.stage}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={d.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Ringkasan evaluasi */}
        <div className="vui-card p-6">
          <h2 className="text-lg font-bold text-white mb-1">Kualitas Retrieval</h2>
          <p className="text-sm text-slate-400 mb-5">Dari run evaluasi terpilih.</p>

          {!latestRun ? (
            // PRD FR12: belum ada run berarti belum ada nilai (bukan nol)
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-navy-700 flex items-center justify-center mx-auto mb-4">
                <Icon name="evaluations" className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-sm text-slate-300 font-medium">Belum ada run evaluasi</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">Nilai belum tersedia, bukan nol.</p>
              {user?.role === "evaluator" && (
                <Link to="/evaluations" className="vui-btn-primary text-sm">
                  Jalankan evaluasi
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Metric label="Hit Rate@5" value={pct(latestRun.metrics.hit_rate_5)} bar={latestRun.metrics.hit_rate_5} />
              <Metric label="Abstention (unanswerable)" value={pct(latestRun.metrics.abstention_rate)} bar={latestRun.metrics.abstention_rate} />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <MiniStat label="Retrieval p95" value={`${latestRun.metrics.retrieval_p95_ms} ms`} />
                <MiniStat label="Jawaban p95" value={`${(latestRun.metrics.answer_p95_ms / 1000).toFixed(1)} dtk`} />
                <MiniStat label="Pertanyaan" value={latestRun.metrics.total_questions} />
                <MiniStat label="Gagal" value={latestRun.metrics.failed} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, bar }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-400">{label}</span>
        <span className="font-semibold text-white">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-navy-900/60 overflow-hidden">
        <div className="h-full bg-brand-gradient" style={{ width: `${bar * 100}%` }} />
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl bg-navy-900/40 p-3">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="text-base font-bold text-white">{value}</p>
    </div>
  );
}

function EmptyRow({ text }) {
  return (
    <div className="text-center py-8 text-sm text-slate-500">
      <Icon name="check" className="w-8 h-8 mx-auto mb-2 text-slate-600" />
      {text}
    </div>
  );
}
