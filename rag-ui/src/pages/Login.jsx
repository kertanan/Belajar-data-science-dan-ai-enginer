import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Icon from "../components/Icon";
import { useStore } from "../store/StoreContext";

export default function Login() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("rangga@example.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }
    login(email);
    navigate("/dashboard");
  };

  return (
    <AuthShell title="Masuk" subtitle="Masuk untuk mengakses dokumen dan percakapan Anda.">
      <form onSubmit={submit} className="space-y-5" noValidate>
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/15 border border-red-400/20 px-4 py-3 text-sm text-accent-red">
            <Icon name="warning" className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
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
            placeholder="Masukkan kata sandi"
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="vui-btn-primary w-full">
          Masuk
          <Icon name="chevronRight" className="w-4 h-4" />
        </button>
      </form>

      <p className="text-sm text-slate-400 mt-6 text-center">
        Belum punya akun?{" "}
        <Link to="/register" className="text-brand-400 font-semibold hover:underline">
          Daftar sekarang
        </Link>
      </p>
      <p className="text-[11px] text-slate-500 mt-4 text-center">
        Prototipe UI dengan data mock. Autentikasi dan isolasi data sesungguhnya ditangani backend Go (JWT).
      </p>
    </AuthShell>
  );
}
