import { useState, useRef, useMemo } from "react";
import { useStore } from "../store/StoreContext";
import StatusBadge from "../components/StatusBadge";
import Icon from "../components/Icon";

const FILTERS = ["Semua", "Ready", "Processing", "Retrying", "Queued", "Failed"];
const PAGE_SIZE = 5;

export default function Documents() {
  const { documents, addDocument, retryDocument, deleteDocument } = useStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [page, setPage] = useState(1);
  const [dragOver, setDragOver] = useState(false);
  const [notice, setNotice] = useState("");
  const fileRef = useRef(null);

  const filtered = useMemo(() => {
    return documents.filter((d) => {
      const matchQuery = d.name.toLowerCase().includes(query.toLowerCase());
      const matchFilter = filter === "Semua" || d.status === filter;
      return matchQuery && matchFilter;
    });
  }, [documents, query, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) return;
    // Validasi dasar sesuai PRD FR03 (maks 20 MB, hanya PDF)
    if (file.type && file.type !== "application/pdf") {
      setNotice("Hanya file PDF yang didukung.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setNotice("Ukuran file melebihi batas 20 MB.");
      return;
    }
    addDocument(file);
    setNotice(`"${file.name}" diunggah. Status 202: file tersimpan, pemrosesan tercatat.`);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Zona unggah */}
      <div
        className={`vui-card p-8 border-2 border-dashed transition-colors ${
          dragOver ? "border-brand-500 bg-brand-500/5" : "border-white/10"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Icon name="upload" className="w-7 h-7 text-white" />
          </div>
          <p className="text-white font-semibold">Seret & lepas PDF di sini</p>
          <p className="text-sm text-slate-400 mt-1 mb-4">
            Maks 20 MB · 200 halaman · PDF berbasis teks (bukan hasil pindai)
          </p>
          <button className="vui-btn-primary" onClick={() => fileRef.current?.click()}>
            <Icon name="plus" className="w-4 h-4" />
            Pilih file
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-xl bg-brand-500/10 border border-brand-400/20 px-4 py-3 text-sm text-brand-400">
          <Icon name="info" className="w-4 h-4 shrink-0" />
          {notice}
        </div>
      )}

      {/* Daftar dokumen */}
      <div className="vui-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-bold text-white">Dokumen Saya</h2>
            <p className="text-sm text-slate-400">{filtered.length} dokumen</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Icon name="search" className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              className="vui-input !pl-10"
              placeholder="Cari nama dokumen..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              aria-label="Cari dokumen"
            />
          </div>
        </div>

        {/* Filter status */}
        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === f
                  ? "bg-brand-gradient text-white"
                  : "bg-navy-900/50 text-slate-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Tabel */}
        {pageItems.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="documents" className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="text-slate-400">Tidak ada dokumen yang cocok.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-white/5">
                  <th className="py-3 pr-4 font-semibold">Nama</th>
                  <th className="py-3 px-4 font-semibold">Halaman</th>
                  <th className="py-3 px-4 font-semibold">Ukuran</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 pl-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((d) => (
                  <tr key={d.document_id} className="border-b border-white/5 last:border-0 hover:bg-navy-900/30">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-navy-700 flex items-center justify-center shrink-0">
                          <Icon name="file" className="w-4 h-4 text-brand-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate max-w-[220px]">{d.name}</p>
                          {d.status === "Failed" && d.error_reason && (
                            <p className="text-[11px] text-accent-red mt-0.5 max-w-[260px]">{d.error_reason}</p>
                          )}
                          {d.status === "Ready" && (
                            <p className="text-[11px] text-slate-500 mt-0.5">{d.chunk_count} chunk</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{d.pages}</td>
                    <td className="py-4 px-4 text-slate-300">{d.sizeMB} MB</td>
                    <td className="py-4 px-4"><StatusBadge status={d.status} /></td>
                    <td className="py-4 pl-4">
                      <div className="flex items-center justify-end gap-2">
                        {(d.status === "Failed" || d.status === "Retrying") && (
                          <button
                            className="vui-btn-ghost !px-2.5 !py-2 text-xs"
                            onClick={() => retryDocument(d.document_id)}
                            title="Coba ulang"
                          >
                            <Icon name="retry" className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="vui-btn-ghost !px-2.5 !py-2 text-xs hover:!bg-accent-red/20 hover:!text-accent-red"
                          onClick={() => deleteDocument(d.document_id)}
                          title="Hapus"
                          disabled={d.status === "Deleting"}
                        >
                          <Icon name="trash" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
            <p className="text-xs text-slate-400">
              Halaman {current} dari {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                className="vui-btn-ghost text-xs"
                disabled={current <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Sebelumnya
              </button>
              <button
                className="vui-btn-ghost text-xs"
                disabled={current >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
