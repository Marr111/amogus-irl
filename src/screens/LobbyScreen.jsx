import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Play, Users } from 'lucide-react';
import CrewmateIcon from '../components/CrewmateIcon';
import { useGameStore } from '../store/useGameStore';
import { SoundFX } from '../utils/audio';

export default function LobbyScreen() {
  const { giocatori, codiceStanza, avviaPartita, giocatoreCorrente, isMuted } = useGameStore();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    SoundFX.playButtonPop(isMuted);
    navigator.clipboard?.writeText(codiceStanza);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = () => {
    avviaPartita();
  };

  return (
    <div className="flex flex-1 flex-col justify-between p-4 overflow-hidden bg-slate-950">
      {/* Top Banner Stanza */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between rounded-2xl border-[3.5px] border-black bg-slate-900 p-3 shadow-[4px_4px_0_#000]">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Codice Stanza Skeld
            </div>
            <div className="text-xl font-black tracking-widest text-yellow-300">
              {codiceStanza}
            </div>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-slate-800 px-3 py-2 text-xs font-black uppercase text-white shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none"
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copiato' : 'Copia'}</span>
          </button>
        </div>

        {/* Info Statistiche Among Us */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border-[3px] border-black bg-slate-900 p-2 shadow-[2px_2px_0_#000]">
            <span className="block text-[10px] font-black uppercase text-slate-400">Equipaggio</span>
            <span className="text-sm font-black text-white">{giocatori.length}/10</span>
          </div>
          <div className="rounded-xl border-[3px] border-black bg-slate-900 p-2 shadow-[2px_2px_0_#000]">
            <span className="block text-[10px] font-black uppercase text-red-400">Impostori</span>
            <span className="text-sm font-black text-red-500">1</span>
          </div>
          <div className="rounded-xl border-[3px] border-black bg-slate-900 p-2 shadow-[2px_2px_0_#000]">
            <span className="block text-[10px] font-black uppercase text-green-400">Compiti</span>
            <span className="text-sm font-black text-green-400">5 Totali</span>
          </div>
        </div>
      </div>

      {/* Griglia Equipaggio con le tipiche figure Among Us */}
      <div className="my-2 flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between pb-1.5 px-1">
          <span className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-white">
            <Users className="h-4 w-4 text-cyan-400" />
            Giocatori Connessi ({giocatori.length})
          </span>
          <span className="text-[10px] font-black text-yellow-300 animate-pulse">In attesa...</span>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto space-y-2 pr-1">
          {giocatori.map((giocatore, idx) => {
            const isMe = giocatore.id === giocatoreCorrente.id;

            return (
              <motion.div
                key={giocatore.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                className={`flex items-center justify-between rounded-xl border-[3px] border-black p-2.5 shadow-[3px_3px_0_#000] ${
                  isMe
                    ? 'bg-slate-800 ring-2 ring-cyan-400'
                    : 'bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center">
                    <CrewmateIcon color={giocatore.colore} size="sm" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-white">{giocatore.nome}</span>
                      {isMe && (
                        <span className="rounded border border-black bg-cyan-400 px-1 py-0.2 text-[9px] font-black uppercase text-black">
                          Tu
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      Tuta Pronta
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 rounded-md border border-black bg-green-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  PRONTO
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tasto Start Primario Verde stile Among Us */}
      <div className="pt-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleStart}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-[4px] border-black bg-gradient-to-b from-green-400 via-green-500 to-green-600 py-4 text-base font-black uppercase tracking-wider text-black shadow-[0_5px_0_#000000] active:translate-y-1 active:shadow-none"
        >
          <Play className="h-6 w-6 fill-black" />
          Avvia Partita
        </motion.button>
      </div>
    </div>
  );
}
