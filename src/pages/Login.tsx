import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    navigate(from, { replace: true });
    setLoading(false);
  }

  return (
    <div className="min-h-[calc(100vh-0px)] grid place-items-center px-4 py-12">
      {/* fundo bonitão */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 -z-10 opacity-60 [background:radial-gradient(900px_circle_at_50%_0%,rgba(56,189,248,.22),transparent_60%),radial-gradient(700px_circle_at_100%_60%,rgba(168,85,247,.16),transparent_55%),radial-gradient(700px_circle_at_0%_70%,rgba(236,72,153,.12),transparent_55%)]" />

      <div className="w-full max-w-[420px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl p-6">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-white">Login</h1>
          <p className="text-sm text-white/70">Entre com seu email e senha pra acessar.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="grid gap-1">
            <label className="text-sm text-white/80">Email</label>
            <input
              className="h-11 rounded-xl border border-white/10 bg-black/30 px-3 text-white placeholder:text-white/40 outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="seuemail@dominio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              inputMode="email"
              required
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm text-white/80">Senha</label>
            <input
              className="h-11 rounded-xl border border-white/10 bg-black/30 px-3 text-white placeholder:text-white/40 outline-none focus:border-fuchsia-400/60 focus:ring-2 focus:ring-fuchsia-400/20"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="mt-2 h-11 rounded-xl font-medium text-slate-950 bg-gradient-to-r from-cyan-300 to-fuchsia-300 hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Aguarde..." : "Entrar"}
          </button>
        </form>

        {msg && (
          <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
