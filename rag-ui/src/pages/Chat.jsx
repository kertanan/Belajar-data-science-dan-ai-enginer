import { useState, useRef, useEffect } from "react";
import { useStore } from "../store/StoreContext";
import Icon from "../components/Icon";

const uid = (p) => `${p}_${Math.random().toString(36).slice(2, 8)}`;

export default function Chat() {
  const { documents, chunks } = useStore();
  const readyDocs = documents.filter((d) => d.status === "Ready");

  const [scope, setScope] = useState(readyDocs.slice(0, 1).map((d) => d.document_id));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [preview, setPreview] = useState(null); // sitasi yang sedang dilihat
  const stopRef = useRef(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const toggleDoc = (id) => {
    setScope((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id);
      if (s.length >= 5) return s; // PRD FR06: maksimal 5 dokumen
      return [...s, id];
    });
  };

  // Simulasi streaming jawaban RAG (menggantikan SSE dari backend)
  const send = async () => {
    const q = input.trim();
    if (!q || streaming || scope.length === 0) return;

    const userMsg = { message_id: uid("msg"), role: "user", text: q, status: "Completed" };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    // Siapkan sitasi dari chunk dokumen pada scope
    const pool = scope.flatMap((id) =>
      (chunks[id] || []).map((c) => ({ ...c, document_id: id, doc_name: docName(id) }))
    );
    const picked = pool.slice(0, 2).map((c, i) => ({ id: i + 1, ...c, quote: c.text }));

    const hasEvidence = picked.length > 0;
    const answerText = hasEvidence
      ? `Berdasarkan dokumen terpilih, ${q.toLowerCase().includes("tidak") ? "berikut ringkasannya" : "berikut jawabannya"}: ${picked[0].text} ${picked[1] ? `Selain itu, ${picked[1].text} [2]` : ""}`.replace(picked[0].text, picked[0].text + " [1]")
      : "Maaf, informasi tersebut belum ditemukan pada dokumen yang Anda pilih. Coba pilih dokumen lain atau ajukan pertanyaan yang lebih spesifik.";

    const assistantId = uid("msg");
    const assistantMsg = {
      message_id: assistantId,
      role: "assistant",
      text: "",
      status: "Streaming",
      citations: hasEvidence ? picked : [],
      metrics: {},
    };
    setMessages((m) => [...m, assistantMsg]);

    setStreaming(true);
    stopRef.current = false;
    const t0 = performance.now();
    let ttft = null;

    // Streaming token per kata
    const words = answerText.split(" ");
    for (let i = 0; i < words.length; i++) {
      if (stopRef.current) {
        setMessages((m) =>
          m.map((msg) => (msg.message_id === assistantId ? { ...msg, status: "Cancelled" } : msg))
        );
        setStreaming(false);
        return;
      }
      await delay(45 + Math.random() * 40);
      if (ttft === null) ttft = Math.round(performance.now() - t0);
      setMessages((m) =>
        m.map((msg) =>
          msg.message_id === assistantId
            ? { ...msg, text: words.slice(0, i + 1).join(" ") }
            : msg
        )
      );
    }

    // done
    const total = Math.round(performance.now() - t0);
    setMessages((m) =>
      m.map((msg) =>
        msg.message_id === assistantId
          ? { ...msg, status: "Completed", metrics: { ttft_ms: ttft, total_ms: total } }
          : msg
      )
    );
    setStreaming(false);
  };

  const stop = () => {
    stopRef.current = true;
  };

  function docName(id) {
    return documents.find((d) => d.document_id === id)?.name || "Dokumen";
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3 h-[calc(100vh-9rem)]">
      {/* Kolom chat */}
      <div className="lg:col-span-2 flex flex-col vui-card overflow-hidden">
        {/* Pemilih dokumen */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-sm font-semibold text-white">
              Dokumen aktif <span className="text-slate-400 font-normal">({scope.length}/5)</span>
            </p>
            <span className="text-[11px] text-slate-500">Maksimal 5 dokumen siap</span>
          </div>
          {readyDocs.length === 0 ? (
            <p className="text-sm text-slate-400">Belum ada dokumen berstatus Ready. Unggah dulu di menu Documents.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {readyDocs.map((d) => {
                const active = scope.includes(d.document_id);
                const disabled = !active && scope.length >= 5;
                return (
                  <button
                    key={d.document_id}
                    onClick={() => toggleDoc(d.document_id)}
                    disabled={disabled}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                      active
                        ? "bg-brand-500/20 border-brand-400/40 text-brand-400"
                        : "bg-navy-900/40 border-white/5 text-slate-400 hover:text-white disabled:opacity-40"
                    }`}
                  >
                    <Icon name={active ? "check" : "file"} className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[160px]">{d.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Pesan */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center mb-4 shadow-glow">
                <Icon name="chat" className="w-8 h-8 text-white" />
              </div>
              <p className="text-white font-semibold">Mulai bertanya</p>
              <p className="text-sm text-slate-400 mt-1 max-w-sm">
                Ajukan pertanyaan tentang dokumen terpilih. Jawaban akan muncul bertahap dengan sitasi sumber.
              </p>
            </div>
          ) : (
            messages.map((m) => <Bubble key={m.message_id} msg={m} onCite={setPreview} />)
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-end gap-3">
            <textarea
              rows={1}
              className="vui-input resize-none"
              placeholder={scope.length === 0 ? "Pilih dokumen dulu..." : "Tulis pertanyaan..."}
              value={input}
              disabled={scope.length === 0}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              aria-label="Pertanyaan"
            />
            {streaming ? (
              <button className="vui-btn-danger shrink-0" onClick={stop}>
                <Icon name="stop" className="w-4 h-4" />
                Hentikan
              </button>
            ) : (
              <button className="vui-btn-primary shrink-0" onClick={send} disabled={!input.trim() || scope.length === 0}>
                <Icon name="send" className="w-4 h-4" />
                Kirim
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Panel sitasi / pratinjau PDF */}
      <div className="vui-card overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">
            {preview ? "Pratinjau Sumber" : "Panel Sumber"}
          </p>
          {preview && (
            <button className="text-slate-400 hover:text-white" onClick={() => setPreview(null)} aria-label="Tutup pratinjau">
              <Icon name="close" className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!preview ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Icon name="documents" className="w-10 h-10 text-slate-600 mb-3" />
              <p className="text-sm text-slate-400">Klik sitasi [n] pada jawaban untuk membuka halaman sumber.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Simulasi tampilan PDF viewer */}
              <div className="rounded-xl bg-white/95 text-slate-800 p-5 shadow-lg aspect-[3/4] overflow-hidden relative">
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-200 pb-2 mb-3">
                  <span className="truncate font-semibold">{preview.doc_name}</span>
                  <span>Hal. {preview.page}</span>
                </div>
                <p className="text-xs leading-relaxed">
                  <span className="bg-yellow-200 rounded px-0.5 py-0.5 box-decoration-clone">
                    {preview.quote}
                  </span>
                </p>
                <div className="absolute bottom-3 left-5 right-5 text-[10px] text-slate-400 text-center border-t border-slate-200 pt-2">
                  Pratinjau PDF (simulasi) · halaman fisik {preview.page}
                </div>
              </div>

              <div className="rounded-xl bg-navy-900/40 p-4 text-xs space-y-1.5">
                <Row label="Dokumen" value={preview.doc_name} />
                <Row label="Halaman" value={preview.page} />
                <Row label="chunk_id" value={preview.chunk_id} />
                <Row label="ID sitasi" value={`[${preview.id}]`} />
              </div>
              <p className="text-[11px] text-slate-500">
                Kutipan diambil dari chunk tersimpan, bukan teks yang dibuat model. Akses PDF melalui backend dengan pemeriksaan kepemilikan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Bubble({ msg, onCite }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div className={`max-w-[85%] ${isUser ? "order-2" : ""}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser ? "bg-brand-gradient text-white" : "bg-navy-900/50 text-slate-200 border border-white/5"
          }`}
        >
          {renderWithCitations(msg.text, msg.citations, onCite)}
          {msg.status === "Streaming" && (
            <span className="inline-block w-2 h-4 ml-0.5 align-middle bg-brand-400 animate-pulse-dot" />
          )}
        </div>

        {/* Status & metrik pesan asisten */}
        {!isUser && msg.status !== "Streaming" && (
          <div className="flex items-center gap-3 mt-1.5 px-1">
            <MsgStatus status={msg.status} />
            {msg.metrics?.ttft_ms != null && (
              <span className="text-[11px] text-slate-500">
                TTFT {msg.metrics.ttft_ms} ms · total {(msg.metrics.total_ms / 1000).toFixed(1)} dtk
              </span>
            )}
          </div>
        )}

        {/* Daftar sitasi */}
        {!isUser && msg.citations?.length > 0 && msg.status === "Completed" && (
          <div className="mt-2 space-y-1.5">
            {msg.citations.map((c) => (
              <button
                key={c.id}
                onClick={() => onCite(c)}
                className="flex items-start gap-2 w-full text-left rounded-lg bg-navy-900/40 hover:bg-navy-700 border border-white/5 px-3 py-2 transition-colors"
              >
                <span className="shrink-0 w-5 h-5 rounded bg-brand-500/20 text-brand-400 text-[11px] font-bold flex items-center justify-center">
                  {c.id}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-white truncate">{c.doc_name}</span>
                  <span className="block text-[11px] text-slate-400">Halaman {c.page} · {c.chunk_id}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Render teks dengan menandai [n] sebagai tombol sitasi
function renderWithCitations(text, citations, onCite) {
  if (!citations?.length) return text;
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[(\d+)\]$/);
    if (m) {
      const cite = citations.find((c) => c.id === +m[1]);
      if (cite) {
        return (
          <button
            key={i}
            onClick={() => onCite(cite)}
            className="inline-flex items-center justify-center align-middle w-5 h-5 mx-0.5 rounded bg-brand-500/30 text-brand-400 text-[10px] font-bold hover:bg-brand-500/50"
            title={`${cite.doc_name} hal. ${cite.page}`}
          >
            {m[1]}
          </button>
        );
      }
    }
    return <span key={i}>{part}</span>;
  });
}

function MsgStatus({ status }) {
  const map = {
    Completed: "text-accent-teal",
    Cancelled: "text-accent-amber",
    Failed: "text-accent-red",
  };
  return <span className={`text-[11px] font-semibold ${map[status] || "text-slate-400"}`}>{status}</span>;
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-medium truncate">{value}</span>
    </div>
  );
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
