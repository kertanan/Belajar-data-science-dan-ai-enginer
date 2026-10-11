import { useNavigate } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import Icon from "../components/Icon";

export default function Profile() {
  const { user, logout, documents, conversations } = useStore();
  const navigate = useNavigate();

  const ready = documents.filter((d) => d.status === "Ready").length;

  const roleInfo = {
    pengguna: "Mengelola PDF, chat, sitasi, dan riwayat sendiri.",
    evaluator: "Hak pengguna ditambah membuat dataset dan menjalankan evaluasi.",
    admin: "Mengelola status akun dan kesehatan layanan; tanpa akses isi PDF.",
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Kartu profil */}
      <div className="vui-card p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-brand-gradient flex items-center justify-center text-3xl font-bold text-white shadow-glow">
            {user.name?.charAt(0) || "U"}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-white truncate">{user.name}</h2>
            <p className="text-sm text-slate-400 truncate">{user.email}</p>
            <span className="inline-flex items-center gap-1.5 mt-2 rounded-lg bg-brand-500/15 border border-brand-400/20 px-2.5 py-1 text-xs font-semibold text-brand-400 capitalize">
              <Icon name="profile" className="w-3.5 h-3.5" />
              {user.role}
            </span>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-4 pt-4 border-t border-white/5">
          {roleInfo[user.role] || roleInfo.pengguna}
        </p>
      </div>

      {/* Ringkasan */}
      <div className="grid gap-5 sm:grid-cols-3">
        <SummaryCard label="Dokumen Siap" value={ready} icon="documents" />
        <SummaryCard label="Total Dokumen" value={documents.length} icon="file" />
        <SummaryCard label="Percakapan" value={conversations.length} icon="chat" />
      </div>

      {/* Detail akun */}
      <div className="vui-card p-6">
        <h3 className="text-sm font-bold text-white mb-4">Detail Akun</h3>
        <div className="space-y-3 text-sm">
          <Field label="User ID" value={user.user_id} />
          <Field label="Nama" value={user.name} />
          <Field label="Email" value={user.email} />
          <Field label="Peran" value={user.role} />
        </div>
        <p className="text-[11px] text-slate-500 mt-4">
          Peran ditetapkan server dan tidak dapat dinaikkan dari klien (PRD FR01).
        </p>
      </div>

      {/* Aksi */}
      <div className="vui-card p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Keluar dari sesi</p>
          <p className="text-xs text-slate-400 mt-0.5">Logout mencabut sesi dan refresh token di server.</p>
        </div>
        <button
          className="vui-btn-danger"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <Icon name="logout" className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon }) {
  return (
    <div className="vui-card p-5 text-center">
      <div className="w-11 h-11 rounded-xl bg-navy-700 flex items-center justify-center mx-auto mb-3">
        <Icon name={icon} className="w-5 h-5 text-brand-400" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-medium capitalize">{value}</span>
    </div>
  );
}
