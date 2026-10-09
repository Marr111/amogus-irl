import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Users, Shield, ChevronDown, ChevronUp, Sparkles, HelpCircle } from 'lucide-react';
import CrewmateIcon from '../components/CrewmateIcon';
import { useGameStore } from '../store/useGameStore';
import { ALL_ROLES, ROLES_LIST } from '../utils/roles';
import { SoundFX } from '../utils/audio';

export default function LobbyScreen() {
  const { giocatori, avviaPartita, giocatoreCorrente, isMuted } = useGameStore();
  const [showRolesGuide, setShowRolesGuide] = useState(false);

  const handleStart = () => {
    SoundFX.playButtonPop(isMuted);
    avviaPartita();
  };

  return (
    <div className="flex flex-1 flex-col justify-between p-4 overflow-hidden bg-slate-950 select-none">
      {/* Top Banner: Persone in Attesa */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between rounded-2xl border-[3.5px] border-black bg-slate-900 p-3 shadow-[4px_4px_0_#000]">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Sala d'Attesa Unica
            </div>
            <div className="text-xl font-black tracking-wider text-yellow-300">
              Persone in Attesa
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-green-500/20 px-3 py-1.5 font-black text-sm text-green-400 shadow-[2px_2px_0_#000]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
            </span>
            <span>{giocatori.length} Connessi</span>
          </div>
        </div>

        {/* Pulsante per mostrare/nascondere la Guida a Tutti i Ruoli */}
        <button
          onClick={() => {
            setShowRolesGuide(!showRolesGuide);
            SoundFX.playButtonPop(isMuted);
          }}
          className="flex items-center justify-between rounded-xl border-2 border-black bg-slate-800 px-3 py-2 text-xs font-black uppercase text-cyan-300 shadow-[2px_2px_0_#000] active:translate-y-0.5"
        >
          <span className="flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4" />
            Guida a Tutti gli 8 Ruoli del Gioco
          </span>
          {showRolesGuide ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {/* Pannello a comparsa con tutti i ruoli e relative abilità */}
        <AnimatePresence>
          {showRolesGuide && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden rounded-xl border-2 border-black bg-slate-900 p-2.5 shadow-inner"
            >
              <div className="custom-scrollbar max-h-48 overflow-y-auto space-y-2 pr-1">
                {ROLES_LIST.map((role) => (
                  <div
                    key={role.id}
                    className="rounded-lg border border-black/80 bg-slate-800 p-2 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="rounded px-1.5 py-0.5 text-[10px] font-black uppercase"
                        style={{ backgroundColor: role.coloreBadge, color: role.coloreTesto }}
                      >
                        {role.nome}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{role.fazione}</span>
                    </div>
                    <p className="mt-1 text-[11px] font-medium text-slate-300">
                      {role.descrizione}
                    </p>
                    <div className="mt-1 text-[10px] font-bold text-yellow-300">
                      ✨ Abilità: {role.abilitaNome}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lista Giocatori in Attesa */}
      <div className="my-2 flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between pb-1.5 px-1">
          <span className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-white">
            <Users className="h-4 w-4 text-cyan-400" />
            Giocatori Pronti al Lancio ({giocatori.length})
          </span>
          <span className="text-[10px] font-black text-green-400 animate-pulse">Sincronizzati</span>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto space-y-2 pr-1">
          {giocatori.map((giocatore, idx) => {
            const isMe = giocatore.id === giocatoreCorrente.id;
            const roleInfo = ALL_ROLES[giocatore.ruolo] || ALL_ROLES.Crewmate;

            return (
              <motion.div
                key={giocatore.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: idx * 0.03 }}
                className={`flex items-center justify-between rounded-xl border-[3px] border-black p-2.5 shadow-[3px_3px_0_#000] ${
                  isMe ? 'bg-slate-800 ring-2 ring-cyan-400' : 'bg-slate-900'
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
                    {/* Badge del ruolo assegnato */}
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span
                        className="rounded px-1.5 py-0.2 text-[9px] font-black uppercase border border-black/40"
                        style={{ backgroundColor: roleInfo.coloreBadge, color: roleInfo.coloreTesto }}
                      >
                        {roleInfo.nome}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {roleInfo.fazione}
                      </span>
                    </div>
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
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-[4px] border-black bg-gradient-to-b from-green-400 via-green-500 to-green-600 py-3.5 text-base font-black uppercase tracking-wider text-black shadow-[0_5px_0_#000000] active:translate-y-1 active:shadow-none"
        >
          <Play className="h-6 w-6 fill-black" />
          Avvia Missione (Tutti Pronti)
        </motion.button>
      </div>
    </div>
  );
}
