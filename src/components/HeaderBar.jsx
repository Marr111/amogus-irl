import React, { useState } from 'react';
import { ShieldAlert, Heart, Skull, UserCheck, RefreshCw, Radio, Settings } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export default function HeaderBar() {
  const { giocatoreCorrente, codiceStanza, toggleRuolo, toggleVitale, resetPartita } = useGameStore();
  const [showDebug, setShowDebug] = useState(false);

  const isImpostor = giocatoreCorrente.ruolo === 'Impostor';
  const isVivo = giocatoreCorrente.vitale === 'vivo';

  return (
    <header className="relative z-30 flex items-center justify-between border-b border-slate-800 bg-space-950/90 px-4 py-2.5 backdrop-blur-md">
      {/* Indicatore Stanza e Segnale */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/80 px-2 py-0.5 text-[11px] font-mono tracking-wider text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-cyan"></span>
          </span>
          {codiceStanza}
        </div>
      </div>

      {/* Info Giocatore & Ruolo */}
      <div className="flex items-center gap-2">
        {/* Badge Ruolo */}
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase border transition-colors ${
            isImpostor
              ? 'border-neon-red/60 bg-neon-red/10 text-neon-red shadow-[0_0_10px_rgba(255,42,95,0.25)]'
              : 'border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.25)]'
          }`}
        >
          {giocatoreCorrente.ruolo}
        </span>

        {/* Indicatore Vitale */}
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-mono font-bold ${
            isVivo
              ? 'bg-neon-green/10 text-neon-green border border-neon-green/40'
              : 'bg-red-950/80 text-red-400 border border-red-800 animate-pulse'
          }`}
        >
          {isVivo ? <Heart className="h-3 w-3 fill-current" /> : <Skull className="h-3 w-3" />}
          <span>{isVivo ? 'VIVO' : 'MORTO'}</span>
        </div>

        {/* Pulsante Menu Debug Mock */}
        <button
          onClick={() => setShowDebug(!showDebug)}
          title="Opzioni simulazione"
          className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* Pannello a scomparsa per test rapido ruoli/stato */}
      {showDebug && (
        <div className="absolute right-3 top-12 z-50 flex flex-col gap-1.5 rounded-xl border border-slate-700 bg-space-850 p-3 shadow-xl backdrop-blur-lg">
          <p className="text-[10px] font-mono uppercase text-slate-400 border-b border-slate-700/60 pb-1">
            Simulatore Mock State
          </p>
          <button
            onClick={toggleRuolo}
            className="flex items-center gap-2 rounded px-2 py-1 text-xs text-left hover:bg-slate-700/60 transition-colors text-slate-200"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-neon-red" />
            Cambia Ruolo: <strong className="text-neon-cyan">{isImpostor ? 'Crewmate' : 'Impostor'}</strong>
          </button>
          <button
            onClick={toggleVitale}
            className="flex items-center gap-2 rounded px-2 py-1 text-xs text-left hover:bg-slate-700/60 transition-colors text-slate-200"
          >
            <Skull className="h-3.5 w-3.5 text-neon-yellow" />
            Alterna: <strong className="text-neon-yellow">{isVivo ? 'Uccidi' : 'Rianima'}</strong>
          </button>
          <button
            onClick={resetPartita}
            className="flex items-center gap-2 rounded px-2 py-1 text-xs text-left text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Totale Partita
          </button>
        </div>
      )}
    </header>
  );
}
