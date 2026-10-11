import Icon from "./Icon";

// Kerangka dua panel untuk halaman Login & Register
export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-page-gradient flex">
      {/* Panel brand (desktop) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient opacity-90" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
              <Icon name="layers" className="w-6 h-6" />
            </div>
            <span className="text-lg font-bold">RAG Docs</span>
          </div>
          <div>
            <h2 className="text-4xl font-extrabold leading-tight">
              Tanya dokumen Anda,
              <br /> dapatkan jawaban bersumber.
            </h2>
            <p className="mt-4 text-white/80 max-w-md">
              Unggah PDF, pantau pemrosesan, lalu ajukan pertanyaan. Jawaban muncul
              bertahap dengan sitasi yang membuka halaman sumber.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-white/80">
            <div>
              <p className="text-2xl font-bold text-white">RAG</p>
              <p>Retrieval Augmented</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">JWT</p>
              <p>Isolasi per pengguna</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Hit@5</p>
              <p>Evaluasi terukur</p>
            </div>
          </div>
        </div>
      </div>

      {/* Panel form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-11 h-11 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow">
              <Icon name="layers" className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-bold text-white">RAG Docs</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-slate-400 mt-1 mb-7">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
