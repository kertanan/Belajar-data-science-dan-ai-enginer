import { useState } from "react";
import { useStore } from "../store/StoreContext";
import Icon from "../components/Icon";

export default function Evaluations() {
  const { evalRuns, user } = useStore();
  const [selectedId, setSelectedId] = useState(evalRuns[0]?.run_id);

  const isEvaluator = user?.role === "evaluator";
  const run = evalRuns.find((r) => r.run_id === selectedId) || evalRuns[0];

  const pct = (v) => `${Math.round(v * 100)}%`;

  // Non-evaluator: tidak boleh menjalankan evaluasi (PRD: hak evaluator)
  if (!isEvaluator) {
    return (
      <div className="vui-card p-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-navy-700 flex items-center justify-center mx-auto mb-4">
          <Icon name="lock" className="w-7 h-7 text-slate-400" />
        </div>
        <h2 className="text-lg font-bold text-white">Akses evaluator diperlukan</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
          Pembuatan dataset dan menjalankan evaluasi hanya tersedia untuk peran evaluator.
          Peran diaktifkan melalui konfigurasi admin.
        </p>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="vui-card p-10 text-center">
        <Icon name="evaluations" className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white">Belum ada run evaluasi</h2>
        <p className="text-sm text-slate-400 mt-1">Jalankan evaluasi untuk melihat Hit Rate@5 dan latensi.</p>
        <button className="vui-btn-primary mt-5 mx-auto">
          <Icon name="plus" className="w-4 h-4" />
          Jalankan evaluasi
        </button>
      </div>
    );
  }

  const m = run.metrics;

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {/* Daftar run */}
      <div className="vui-card p-4 lg:col-span-1 h-fit">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Run Evaluasi</p>
          <button className="vui-btn-primary !px-2.5 !py-2" title="Run baru">
            <Icon name="plus" className="w-4 h-4" />
          </button>
        </div>
        <ul className="space-y-2">
          {evalRuns.map((r) => (
            <li key={r.run_id}>
              <button
                onClick={() => setSelectedId(r.run_id)}
                className={`w-full text-left rounded-xl px-3.5 py-3 transition-colors ${
                  r.run_id === selectedId ? "bg-brand-500/15 border border-brand-400/30" : "bg-navy-900/40 border border-transparent hover:bg-navy-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{r.run_id}</span>
                  <span className="text-xs text-accent-teal">{pct(r.metrics.hit_rate_5)}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">dataset {r.dataset_version}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Detail run */}
      <div className="lg:col-span-3 space-y-6">
        {/* Metrik utama */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <EvalStat label="Hit Rate@5" value={pct(m.hit_rate_5)} highlight />
          <EvalStat label="Abstention" value={pct(m.abstention_rate)} />
          <EvalStat label="Pertanyaan" value={`${m.answerable} + ${m.unanswerable}`} sub="answerable + unanswerable" />
          <EvalStat label="Gagal" value={m.failed} sub="ditampilkan terpisah" />
        </div>

        {/* Latensi + konfigurasi */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="vui-card p-5">
            <h3 className="text-sm font-bold text-white mb-4">Latensi (p50 / p95)</h3>
            <div className="space-y-3">
              <LatRow label="Retrieval" p50={m.retrieval_p50_ms} p95={m.retrieval_p95_ms} unit="ms" />
              <LatRow label="Jawaban penuh" p50={m.answer_p50_ms} p95={m.answer_p95_ms} unit="ms" />
              <div className="flex justify-between text-sm pt-1">
                <span className="text-slate-400">TTFT p95</span>
                <span className="font-semibold text-white">{m.ttft_p95_ms} ms</span>
              </div>
            </div>
          </div>

          <div className="vui-card p-5">
            <h3 className="text-sm font-bold text-white mb-4">Konfigurasi Run</h3>
            <div className="grid grid-cols-2 gap-y-2.5 text-sm">
              <Conf label="Embedding" value={run.config.embedding_model} full />
              <Conf label="Chunk" value={`${run.config.chunk_tokens} token`} />
              <Conf label="Overlap" value={`${run.config.overlap_tokens} token`} />
              <Conf label="top_k" value={run.config.top_k} />
              <Conf label="Ambang" value={run.config.threshold} />
              <Conf label="Concurrency" value={run.config.concurrency} />
              <Conf label="Snapshot" value={run.corpus_snapshot} full />
            </div>
          </div>
        </div>

        {/* Tabel detail per pertanyaan */}
        <div className="vui-card p-5">
          <h3 className="text-sm font-bold text-white mb-4">Hasil per Pertanyaan</h3>
          {run.details.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">Detail per pertanyaan tidak tersedia untuk run ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-white/5">
                    <th className="py-2.5 pr-4 font-semibold">Pertanyaan</th>
                    <th className="py-2.5 px-4 font-semibold">Gold Evidence</th>
                    <th className="py-2.5 px-4 font-semibold">Hasil top_k</th>
                    <th className="py-2.5 px-4 font-semibold">Hit/Miss</th>
                    <th className="py-2.5 pl-4 font-semibold text-right">Latensi</th>
                  </tr>
                </thead>
                <tbody>
                  {run.details.map((d) => (
                    <tr key={d.query_id} className="border-b border-white/5 last:border-0">
                      <td className="py-3 pr-4 text-slate-200 max-w-[220px]">
                        {d.question}
                        {d.unanswerable && (
                          <span className="ml-1.5 text-[10px] rounded bg-slate-500/20 text-slate-400 px-1.5 py-0.5">unanswerable</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{d.gold}</td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-xs">{d.top_k.join(", ")}</td>
                      <td className="py-3 px-4">
                        {d.unanswerable ? (
                          <span className="text-xs text-slate-400">—</span>
                        ) : d.hit ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-teal">
                            <Icon name="check" className="w-3.5 h-3.5" /> Hit
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-red">
                            <Icon name="close" className="w-3.5 h-3.5" /> Miss
                          </span>
                        )}
                      </td>
                      <td className="py-3 pl-4 text-right text-slate-300">{d.retrieval_ms} ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-[11px] text-slate-500 mt-4">
            Hit Rate@5 memakai denominator pertanyaan answerable; {m.unanswerable} kasus unanswerable tidak ikut dihitung.
          </p>
        </div>
      </div>
    </div>
  );
}

function EvalStat({ label, value, sub, highlight }) {
  return (
    <div className={`vui-card p-4 ${highlight ? "ring-1 ring-brand-400/40" : ""}`}>
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${highlight ? "text-brand-400" : "text-white"}`}>{value}</p>
      {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function LatRow({ label, p50, p95, unit }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-white">
        {p50}{unit} <span className="text-slate-500">/</span> {p95}{unit}
      </span>
    </div>
  );
}

function Conf({ label, value, full }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="text-slate-200 font-medium truncate">{value}</p>
    </div>
  );
}
