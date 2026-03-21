import React, { useState } from "react";
import { X, RefreshCw, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface AdminUpdateModalProps {
  onClose: () => void;
}

export const AdminUpdateModal: React.FC<AdminUpdateModalProps> = ({ onClose }) => {
  const { isDark } = useTheme();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setStatus("loading");
    setMessage("Verbindung zum Server wird hergestellt...");

    try {
      // We call the git-pull endpoint with the provided password
      const response = await fetch(`/api/admin/git-pull?secret=${encodeURIComponent(password)}`);
      const text = await response.text();

      if (response.ok) {
        setStatus("success");
        setMessage("Update erfolgreich gestartet! Der Server startet in wenigen Sekunden neu. Bitte laden Sie die Seite in 30 Sekunden neu.");
      } else {
        setStatus("error");
        setMessage(text.includes("Falsches") ? "Falsches Passwort!" : "Fehler beim Update: " + text);
      }
    } catch (err) {
      setStatus("error");
      setMessage("Netzwerkfehler oder Server nicht erreichbar.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors ${isDark ? "bg-slate-950 border border-slate-800" : "bg-white"}`}>
        <div className={`p-6 border-b flex justify-between items-center transition-colors ${isDark ? "bg-slate-900 border-slate-800" : "bg-indigo-50/50 border-gray-100"}`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-indigo-500" size={20} />
            <h2 className={`text-lg font-serif font-bold transition-colors ${isDark ? "text-white" : "text-gray-800"}`}>
              System Update
            </h2>
          </div>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-slate-800" : "hover:bg-white"}`}>
            <X size={20} className={isDark ? "text-slate-500" : "text-gray-400"} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {status === "idle" || status === "loading" ? (
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <p className={`text-sm transition-colors ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                Geben Sie das Admin-Passwort ein, um die neuesten Änderungen von GitHub abzurufen und den Server neu zu starten.
              </p>
              <div className="flex flex-col gap-1">
                <label className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isDark ? "text-slate-500" : "text-gray-400"}`}>Admin Passwort</label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 font-mono transition-colors ${isDark ? "bg-slate-900 text-slate-200" : "bg-gray-50 text-gray-800"}`}
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <RefreshCw size={18} />
                )}
                Update jetzt ausführen
              </button>
            </form>
          ) : status === "success" ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={32} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className={`font-bold transition-colors ${isDark ? "text-white" : "text-gray-800"}`}>Update gestartet</h3>
                <p className={`text-sm transition-colors ${isDark ? "text-slate-400" : "text-gray-600"}`}>{message}</p>
              </div>
              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Schließen
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <AlertCircle size={32} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className={`font-bold transition-colors ${isDark ? "text-white" : "text-gray-800"}`}>Fehler</h3>
                <p className={`text-sm transition-colors ${isDark ? "text-slate-400" : "text-gray-600"}`}>{message}</p>
              </div>
              <button
                onClick={() => setStatus("idle")}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
              >
                Nochmal versuchen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
