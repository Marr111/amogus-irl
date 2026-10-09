import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Settings, Heart, Skull, Cpu, RefreshCw } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { OllamaService } from '../utils/ollama';

export default function HeaderBar() {
  const {
    giocatoreCorrente,
    codiceStanza,
    toggleRuolo,
    toggleVitale,
    resetPartita,
    isMuted,
    toggleMute,
  } = useGameStore();

  const [showDebug, setShowDebug] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState({ online: false });

  useEffect(() => {
    OllamaService.checkStatus().then(setOllamaStatus);
  }, []);

  const isImpostor = giocatoreCorrente.ruolo === 'Impostor';
  const isVivo = giocatoreCorrente.vitale === 'vivo';

  return (
    <header className="relative z-30 flex items-center justify-between border-b-[3.5px] border-black bg-slate-900 px-3 py-2 shadow-[0_3px_0_#000000]">
      {/* Codice Stanza */}
      <div className="flex items-center gap-1.5 rounded-lg border-2 border-black bg-slate-800 px-2 py-0.5 font-black text-xs text-yellow-300 shadow-[2px_2px_0_#000]">
        <span>🚀</span>
        <span>{codiceStanza}</span>
      </div>

      {/* Ruolo & Stato Vitale Among Us */}
      <div className="flex items-center gap-1.5">
        {/* Badge Ruolo */}
        <span
          className={`rounded-lg border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0_#000] ${
            isImpostor
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-cyan-400 text-black'
          }`}
        >
          {giocatoreCorrente.ruolo}
        </span>

        {/* Indicatore Vivo / Morto */}
        <div
          className={`flex items-center gap-1 rounded-lg border-2 border-black px-2 py-0.5 text-xs font-black shadow-[2px_2px_0_#000] ${
            isVivo
              ? 'bg-green-500 text-black'
              : 'bg-neutral-800 text-red-400'
          }`}
        >
          {isVivo ? <Heart className="h-3 w-3 fill-black text-black" /> : <Skull className="h-3 w-3" />}
          <span>{isVivo ? 'VIVO' : 'MORTO'}</span>
        </div>

        {/* Toggle Audio Mute */}
        <button
          onClick={toggleMute}
          title={isMuted ? 'Attiva Suoni' : 'Silenzia Suoni'}
          className="rounded-lg border-2 border-black bg-slate-800 p-1 text-white shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none transition-all"
        >
          {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4 text-green-400" />}
        </button>

        {/* Menu Debug Mock & Ollama */}
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="rounded-lg border-2 border-black bg-slate-800 p-1 text-slate-300 shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-all"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* Pannello Debug & Ollama Test */}
      {showDebug && (
        <div className="absolute right-2 top-12 z-50 flex w-64 flex-col gap-2 rounded-2xl border-[3.5px] border-black bg-slate-900 p-3 shadow-[5px_5px_0_#000000]">
          <div className="flex items-center justify-between border-b-2 border-black pb-1.5">
            <span className="font-black text-xs uppercase text-yellow-300">Control Panel</span>
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400">
              <Cpu className="h-3 w-3 text-cyan-400" />
              Ollama: {ollamaStatus.online ? <span className="text-green-400">ON (Llama 3)</span> : <span className="text-yellow-400">Fallback Sim</span>}
            </span>
          </div>

          <button
            onClick={toggleRuolo}
            className="flex items-center justify-between rounded-lg border-2 border-black bg-slate-800 p-2 text-xs font-bold text-white shadow-[2px_2px_0_#000] active:translate-y-0.5"
          >
            <span>Alterna Ruolo:</span>
            <span className={isImpostor ? 'text-red-400' : 'text-cyan-400'}>{isImpostor ? 'Crewmate' : 'Impostor'}</span>
          </button>

          <button
            onClick={toggleVitale}
            className="flex items-center justify-between rounded-lg border-2 border-black bg-slate-800 p-2 text-xs font-bold text-white shadow-[2px_2px_0_#000] active:translate-y-0.5"
          >
            <span>Stato:</span>
            <span className={isVivo ? 'text-green-400' : 'text-red-400'}>{isVivo ? 'Uccidi' : 'Rianima'}</span>
          </button>

          <button
            onClick={resetPartita}
            className="flex items-center justify-center gap-1.5 rounded-lg border-2 border-black bg-red-700 p-2 text-xs font-black uppercase text-white shadow-[2px_2px_0_#000] active:translate-y-0.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Partita
          </button>
        </div>
      )}
    </header>
  );
}
