import React from 'react';
import { motion } from 'framer-motion';
import { Users, Play, Copy, Check, ShieldAlert, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export default function LobbyScreen() {
  const { giocatori, codiceStanza, avviaPartita, giocatoreCorrente } = useGameStore();
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(codiceStanza);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-1 flex-col justify-between p-4 overflow-hidden">
      {/* Top Section: Stanza & Regole */}
      <div className="flex flex-col gap-3">
        {/* Banner Stanza */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-space-850 p-3.5 shadow-md">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Codice Missione Navetta
            </div>
            <div className="text-xl font-mono font-black tracking-widest text-neon-cyan">
              {codiceStanza}
            </div>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-mono text-slate-200 transition-colors hover:border-neon-cyan/50 hover:bg-slate-700"
          >
            {copied ? <Check className="h-4 w-4 text-neon-green" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copiato' : 'Condividi'}</span>
          </button>
        </div>

        {/* Parametri di Partita */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border border-slate-800/80 bg-space-950/70 p-2">
            <span className="block text-[10px] font-mono uppercase text-slate-400">Membri</span>
            <span className="text-sm font-bold text-white font-mono">{giocatori.length}/10</span>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-space-950/70 p-2">
            <span className="block text-[10px] font-mono uppercase text-neon-red">Impostori</span>
            <span className="text-sm font-bold text-neon-red font-mono">1</span>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-space-950/70 p-2">
            <span className="block text-[10px] font-mono uppercase text-neon-green">Tasks</span>
            <span className="text-sm font-bold text-neon-green font-mono">5 Totali</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Lista Giocatori */}
      <div className="my-3 flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between pb-2 px-1">
          <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-300">
            <Users className="h-4 w-4 text-neon-cyan" />
            Equipaggio a Bordo ({giocatori.length})
          </span>
          <span className="text-[11px] font-mono text-slate-500 animate-pulse">In attesa...</span>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto space-y-2 pr-1">
          {giocatori.map((giocatore, idx) => {
            const isMe = giocatore.id === giocatoreCorrente.id;
            return (
              <motion.div
                key={giocatore.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`flex items-center justify-between rounded-xl border p-2.5 transition-all ${
                  isMe
                    ? 'border-neon-cyan/50 bg-cyan-950/20 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                    : 'border-slate-800/80 bg-space-850/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar Spaziale Colorato */}
                  <div
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl font-bold shadow-md"
                    style={{ backgroundColor: giocatore.colore }}
                  >
                    {/* Visore stile astronauta */}
                    <div className="h-3 w-5 rounded-full bg-cyan-200/90 shadow-inner" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{giocatore.nome}</span>
                      {isMe && (
                        <span className="rounded bg-neon-cyan/20 px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase text-neon-cyan border border-neon-cyan/40">
                          Tu
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      Tuta #{idx + 1} // Pronto
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-neon-green" />
                  <span className="text-[10px] font-mono text-slate-400">ONLINE</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Start Game */}
      <div className="pt-2">
        <button
          onClick={avviaPartita}
          className="group relative flex w-full items-center justify-center gap-2 rounded-2xl border border-neon-green/60 bg-gradient-to-r from-emerald-500 to-green-600 py-4 text-base font-black uppercase tracking-wider text-black shadow-glow-green transition-all active:scale-[0.98]"
        >
          <Play className="h-5 w-5 fill-current" />
          Avvia Missione Spaziale
        </button>
        <p className="mt-1.5 text-center text-[10px] font-mono text-slate-500">
          I RUOLI VERRANNO ASSEGNATI ALL'AVVIO
        </p>
      </div>
    </div>
  );
}
