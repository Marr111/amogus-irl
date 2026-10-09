import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Settings, Heart, Skull, Cpu, RefreshCw, UserCheck } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { ALL_ROLES, ROLES_LIST } from '../utils/roles';
import { OllamaService } from '../utils/ollama';

export default function HeaderBar() {
  const {
    giocatoreCorrente,
    setRuoloGiocatore,
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

  const roleObj = ALL_ROLES[giocatoreCorrente.ruolo] || ALL_ROLES.Crewmate;
  const isVivo = giocatoreCorrente.vitale === 'vivo';

  return (
    <header className="relative z-30 flex items-center justify-between border-b-[3.5px] border-black bg-slate-900 px-3 py-2 shadow-[0_3px_0_#000000]">
      {/* Badge Ruolo Attuale con colori dedicati */}
      <div className="flex items-center gap-1.5">
        <span
          className="rounded-lg border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0_#000]"
          style={{ backgroundColor: roleObj.coloreBadge, color: roleObj.coloreTesto }}
        >
          {roleObj.nome}
        </span>
      </div>

      {/* Controlli di Stato & Audio */}
      <div className="flex items-center gap-1.5">
        {/* Indicatore Vivo / Morto */}
        <div
          className={`flex items-center gap-1 rounded-lg border-2 border-black px-2 py-0.5 text-xs font-black shadow-[2px_2px_0_#000] ${
            isVivo ? 'bg-green-500 text-black' : 'bg-neutral-800 text-red-400'
          }`}
        >
          {isVivo ? <Heart className="h-3 w-3 fill-black text-black" /> : <Skull className="h-3 w-3" />}
          <span>{isVivo ? 'VIVO' : 'MORTO'}</span>
        </div>

        {/* Toggle Audio Mute */}
        <button
          onClick={toggleMute}
          title={isMuted ? 'Attiva Suoni' : 'Silenzia Suoni'}
          className="rounded-lg border-2 border-black bg-slate-800 p-1 text-white shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-all"
        >
          {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4 text-green-400" />}
        </button>

        {/* Menu Selettore Ruoli & Debug */}
        <button
          onClick={() => setShowDebug(!showDebug)}
          title="Selettore Ruoli e Opzioni"
          className="rounded-lg border-2 border-black bg-slate-800 p-1 text-yellow-300 shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-all"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* Pannello Selettore di TUTTI i Ruoli sul momento */}
      {showDebug && (
        <div className="absolute right-2 top-12 z-50 flex w-72 flex-col gap-2 rounded-2xl border-[3.5px] border-black bg-slate-900 p-3 shadow-[5px_5px_0_#000000]">
          <div className="flex items-center justify-between border-b-2 border-black pb-1.5">
            <span className="font-black text-xs uppercase text-yellow-300">Cambia Ruolo al Volo</span>
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400">
              <Cpu className="h-3 w-3 text-cyan-400" />
              Llama 3: {ollamaStatus.online ? <span className="text-green-400">Attivo</span> : <span className="text-yellow-400">Simulato</span>}
            </span>
          </div>

          {/* Griglia veloce per testare qualsiasi ruolo */}
          <div className="grid grid-cols-2 gap-1.5 py-1">
            {ROLES_LIST.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setRuoloGiocatore(r.id);
                  setShowDebug(false);
                }}
                className={`rounded-lg border-2 border-black p-1.5 text-[11px] font-black uppercase text-left transition-all ${
                  giocatoreCorrente.ruolo === r.id
                    ? 'ring-2 ring-white scale-102'
                    : 'opacity-85 hover:opacity-100'
                }`}
                style={{ backgroundColor: r.coloreBadge, color: r.coloreTesto }}
              >
                {r.nome}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800">
            <button
              onClick={toggleVitale}
              className="flex-1 rounded-lg border-2 border-black bg-slate-800 p-1.5 text-xs font-bold text-white shadow-[2px_2px_0_#000] active:translate-y-0.5"
            >
              {isVivo ? 'Uccidi' : 'Rianima'}
            </button>
            <button
              onClick={resetPartita}
              className="flex-1 rounded-lg border-2 border-black bg-red-700 p-1.5 text-xs font-black uppercase text-white shadow-[2px_2px_0_#000] active:translate-y-0.5"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
