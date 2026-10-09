import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Rocket, User, Shield, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export default function JoinScreen() {
  const { giocatoreCorrente, setNomeGiocatore, entraInLobby, codiceStanza } = useGameStore();
  const [nome, setNome] = useState(giocatoreCorrente.nome || '');
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setNomeGiocatore(nome || 'Astronauta');
    entraInLobby();
  };

  const handleSimulaQR = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setNome(nome || 'Ufficiale ' + Math.floor(Math.random() * 900 + 100));
      setNomeGiocatore(nome || 'Ufficiale ' + Math.floor(Math.random() * 900 + 100));
      entraInLobby();
    }, 1200);
  };

  return (
    <div className="relative flex flex-1 flex-col justify-between p-6">
      {/* Background Decorativo Cyber/Spaziale */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
        <div className="h-72 w-72 rounded-full border border-neon-cyan animate-ping" />
        <div className="absolute h-96 w-96 rounded-full border border-dashed border-slate-600" />
      </div>

      {/* Header & Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center pt-6"
      >
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl border border-neon-cyan/40 bg-space-850 shadow-glow-cyan">
          <Rocket className="h-10 w-10 text-neon-cyan animate-pulse" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-wider text-white">
          AMOGUS <span className="text-neon-cyan">IRL</span>
        </h1>
        <p className="mt-1 text-xs font-mono tracking-widest text-slate-400 uppercase">
          Terminal di Bordo Mobile // V1.0
        </p>
      </motion.div>

      {/* Form di Connessione */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="my-auto w-full"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-mono uppercase tracking-wider text-slate-300">
              Nome Membro Equipaggio
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Es. Comandante Alex"
                maxLength={18}
                className="w-full rounded-xl border border-slate-700 bg-space-850 py-3.5 pl-11 pr-4 text-sm font-semibold text-white placeholder-slate-500 shadow-inner focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-mono uppercase tracking-wider text-slate-300">
              Codice Stanza Assegnato
            </label>
            <div className="rounded-xl border border-dashed border-slate-700 bg-space-950/60 p-3 text-center font-mono text-base font-bold tracking-widest text-neon-cyan">
              {codiceStanza}
            </div>
          </div>

          <button
            type="submit"
            className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-neon-cyan/70 bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-bold uppercase tracking-wider text-white shadow-glow-cyan transition-all active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Accedi alla Navetta
            </span>
          </button>

          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-space-900 px-3 text-[11px] font-mono uppercase text-slate-500">oppure</span>
            <div className="border-t border-slate-800 w-full" />
          </div>

          <button
            type="button"
            onClick={handleSimulaQR}
            disabled={isScanning}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-space-850 py-3 text-xs font-mono uppercase tracking-wider text-slate-300 transition-colors hover:border-neon-cyan/40 hover:bg-slate-800 active:scale-[0.98]"
          >
            <QrCode className="h-4 w-4 text-neon-cyan" />
            {isScanning ? 'Scansione Sensore...' : 'Scansiona QR Partita IRL'}
          </button>
        </form>
      </motion.div>

      {/* Footer Info */}
      <div className="text-center text-[11px] font-mono text-slate-500">
        <p>CONNETTITI AL TUO EQUIPAGGIO LOCALE</p>
        <p className="text-[10px] text-slate-600 mt-0.5">MODALITÀ MOCK SENZA SERVER ATTIVA</p>
      </div>
    </div>
  );
}
