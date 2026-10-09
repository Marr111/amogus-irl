import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Clock, Check, Ban, Sparkles, MessageSquare } from 'lucide-react';
import CrewmateIcon from '../components/CrewmateIcon';
import { useGameStore } from '../store/useGameStore';
import { SoundFX } from '../utils/audio';
import { OllamaService } from '../utils/ollama';

export default function MeetingScreen() {
  const {
    giocatori,
    meetingInfo,
    votaGiocatore,
    concludiMeeting,
    giocatoreCorrente,
    setBotAlibi,
    isMuted,
  } = useGameStore();

  const [tempo, setTempo] = useState(60);
  const [showEmergencyFlash, setShowEmergencyFlash] = useState(true);
  const [loadingAlibis, setLoadingAlibis] = useState(false);

  // Flash iniziale a sirena
  useEffect(() => {
    const timer = setTimeout(() => setShowEmergencyFlash(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  // Generazione automatica alibi con Ollama (Llama 3) per i bot vivi
  useEffect(() => {
    let isCancelled = false;

    async function loadAlibis() {
      setLoadingAlibis(true);
      const aliveBots = giocatori.filter((p) => p.id !== giocatoreCorrente.id && p.vivo);
      
      for (const bot of aliveBots.slice(0, 3)) { // Genera alibi per i primi 3 bot per velocità
        if (isCancelled) break;
        const alibi = await OllamaService.generateAlibi(bot.nome, bot.colore);
        if (!isCancelled) {
          setBotAlibi(bot.id, alibi);
        }
      }
      if (!isCancelled) setLoadingAlibis(false);
    }

    loadAlibis();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (tempo <= 0) {
      concludiMeeting();
      return;
    }
    const interval = setInterval(() => {
      setTempo((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [tempo, concludiMeeting]);

  const hasVoted = Boolean(meetingInfo.mioVoto);
  const isVivo = giocatoreCorrente.vitale === 'vivo';

  return (
    <div className="relative flex flex-1 flex-col justify-between overflow-hidden bg-slate-950 p-3 select-none">
      {/* Animazione Flash Rosso Emergency Meeting */}
      <AnimatePresence>
        {showEmergencyFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.4, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3, times: [0, 0.2, 0.4, 0.7, 1] }}
            className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-red-600"
          >
            <motion.div
              initial={{ scale: 0.6 }}
              animate={{ scale: [0.9, 1.25, 1] }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <Megaphone className="h-24 w-24 text-white drop-shadow-[0_4px_0_#000]" />
              <h1 className="text-3xl font-black uppercase tracking-wider text-white drop-shadow-[0_4px_0_#000]">
                EMERGENCY MEETING
              </h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Tavola di Discussione stile Skeld */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between rounded-2xl border-[3.5px] border-black bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-2.5 shadow-[4px_4px_0_#000]">
          <div className="flex items-center gap-2">
            <div className="rounded-xl border-2 border-black bg-white p-1.5 shadow-[1px_1px_0_#000]">
              <Megaphone className="h-5 w-5 text-red-600 fill-red-600" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-yellow-300 drop-shadow-[0_1px_0_#000]">
                Chiamato da: {meetingInfo.chiamaDa}
              </div>
              <div className="text-xs font-black text-white drop-shadow-[0_1px_0_#000]">
                {meetingInfo.motivo}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-xl border-2 border-black bg-slate-900 px-2 py-1 font-black text-xs text-yellow-300 shadow-[2px_2px_0_#000]">
            <Clock className="h-3.5 w-3.5" />
            <span>{tempo}s</span>
          </div>
        </div>

        {/* Guida al voto */}
        <div className="flex items-center justify-between px-1 text-xs font-black uppercase text-white">
          <span>Chi è l'Impostore?</span>
          <span className="text-[10px] text-yellow-300">
            {hasVoted ? '✓ Voto inviato' : isVivo ? 'Seleziona per votare' : 'Sei morto (Solo spettatore)'}
          </span>
        </div>
      </div>

      {/* Tavolo dei Giocatori con i personaggi Among Us e fumetti Alibi */}
      <div className="custom-scrollbar my-2 flex-1 overflow-y-auto space-y-2 pr-1">
        {giocatori.map((giocatore) => {
          const isMe = giocatore.id === giocatoreCorrente.id;
          const isSelected = meetingInfo.mioVoto === giocatore.id;
          const canVote = isVivo && !hasVoted && giocatore.vivo;

          return (
            <motion.div
              key={giocatore.id}
              whileTap={canVote ? { scale: 0.98 } : {}}
              onClick={() => canVote && votaGiocatore(giocatore.id)}
              className={`relative rounded-2xl border-[3.5px] border-black p-2.5 transition-all shadow-[3px_3px_0_#000] ${
                !giocatore.vivo
                  ? 'bg-slate-900/60 opacity-60'
                  : isSelected
                  ? 'bg-red-950/70 ring-2 ring-red-500'
                  : canVote
                  ? 'bg-slate-900 hover:bg-slate-850 cursor-pointer'
                  : 'bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Icona Crewmate / Cadavere */}
                  <div className="flex items-center justify-center">
                    <CrewmateIcon
                      color={giocatore.colore}
                      size="sm"
                      isDead={!giocatore.vivo}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-black ${giocatore.vivo ? 'text-white' : 'line-through text-slate-500'}`}>
                        {giocatore.nome}
                      </span>
                      {isMe && (
                        <span className="rounded border border-black bg-cyan-400 px-1 py-0.2 text-[9px] font-black uppercase text-black">
                          Tu
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {giocatore.vivo ? 'In vita' : 'Eliminato'}
                    </span>
                  </div>
                </div>

                {/* Pulsante o badge Voto */}
                <div className="flex items-center gap-1.5">
                  {/* Mostra i voti ricevuti come mini testine Among Us */}
                  {hasVoted && giocatore.votiRicevuti > 0 && (
                    <div className="flex items-center -space-x-1.5 mr-1">
                      {[...Array(Math.min(giocatore.votiRicevuti, 5))].map((_, i) => (
                        <div
                          key={i}
                          className="h-4 w-4 rounded-full border border-black bg-slate-300 shadow"
                        />
                      ))}
                      <span className="ml-2 text-xs font-black text-red-400 font-mono">
                        +{giocatore.votiRicevuti}
                      </span>
                    </div>
                  )}

                  {isSelected ? (
                    <span className="rounded-lg border-2 border-black bg-red-600 px-2.5 py-1 text-[10px] font-black uppercase text-white shadow-[1px_1px_0_#000]">
                      VOTATO
                    </span>
                  ) : canVote ? (
                    <button
                      type="button"
                      className="rounded-lg border-2 border-black bg-slate-800 px-2.5 py-1 text-[10px] font-black uppercase text-yellow-300 shadow-[2px_2px_0_#000] active:translate-y-0.5"
                    >
                      Vota
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Fumetto Alibi generato da Ollama Llama 3 */}
              {giocatore.alibi && (
                <div className="mt-1.5 rounded-lg border border-black/60 bg-slate-800/90 px-2 py-1 text-[11px] font-bold text-slate-200 flex items-start gap-1.5 shadow-inner">
                  <MessageSquare className="h-3 w-3 mt-0.5 text-cyan-400 shrink-0" />
                  <span className="italic">"{giocatore.alibi}"</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Azioni Inferiori: Skip Vote & Concludi Meeting */}
      <div className="flex flex-col gap-2 pt-1">
        {/* Tasto Skip Vote */}
        {isVivo && !hasVoted && (
          <button
            onClick={() => votaGiocatore('SKIP')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-[3px] border-black bg-slate-800 py-2.5 text-xs font-black uppercase text-white shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none"
          >
            <Ban className="h-4 w-4 text-red-400" />
            Salta Votazione (Skip Vote)
          </button>
        )}

        {/* Tasto Concludi Meeting con Espulsione nello Spazio */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={concludiMeeting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-[3.5px] border-black bg-gradient-to-b from-yellow-400 via-amber-400 to-yellow-500 py-3 text-xs font-black uppercase tracking-wider text-black shadow-[0_4px_0_#000] active:translate-y-1 active:shadow-none"
        >
          <Check className="h-4 w-4 stroke-[3]" />
          Concludi Voti & Procedi all'Espulsione
        </motion.button>
      </div>
    </div>
  );
}
