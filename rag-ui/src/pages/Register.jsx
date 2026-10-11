import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Icon from "../components/Icon";
import { useStore } from "../store/StoreContext";

export default function Register() {
  const { register } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    // PRD FR01: kata sandi minimal 12 karakter
    if (password.length < 12) {
      setError("Kata sandi minimal 12 karakter.");
      return;
    }
    register(name, email);
    navigate("/dashboard");
  };

  // Indikator kekuatan sederhana berdasarkan panjang
  const strength = Math.min(100, Math.round((password.length / 16) * 100));

  return (
    <AuthShell title="Daftar" subtitle="Buat akun untuk mulai mengunggah dan bertanya ke dokumen Anda.">
      <form onSubmit={submit} className="space-y-5" noValidate>
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/15 border border-red-400/20 px-4 py-3 text-sm text-accent-red">
            <Icon name="warning" className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        <div>
          <label className="vui-label" htmlFor="name">Nama</label>
          <input
            id="name"
            className="vui-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama lengkap"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="vui-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="vui-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@contoh.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="vui-label" htmlFor="password">Kata sandi</label>
          <input
            id="password"
            type="password"
            className="vui-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 12 karakter"
            autoComplete="new-password"
            aria-describedby="pw-hint"
          />
          {/* Bar kekuatan */}
          <div className="mt-2 h-1.5 rounded-full bg-navy-900/60 overflow-hidden">
            <div
              className={`h-full transition-all ${
                password.length >= 12 ? "bg-accent-teal" : "bg-accent-amber"
              }`}
              style={{ width: `${strength}%` }}
            />
          </div>
          <p id="pw-hint" className="text-[11px] text-slate-500 mt-1.5">
            {password.length >= 12
              ? "Panjang kata sandi memadai."
              : `Kurang ${Math.max(0, 12 - password.length)} karakter lagi (minimal 12).`}
          </p>
        </div>
        <button type="submit" className="vui-btn-primary w-full">
          Daftar
          <Icon name="chevronRight" className="w-4 h-4" />
        </button>
      </form>

      <p className="text-sm text-slate-400 mt-6 text-center">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-brand-400 font-semibold hover:underline">
          Masuk
        </Link>
      </p>
      <p className="text-[11px] text-slate-500 mt-4 text-center">
        Akun baru selalu mendapat peran pengguna. Peran evaluator diaktifkan server.
      </p>
    </AuthShell>
  );
}
