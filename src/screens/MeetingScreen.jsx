import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Siren, Skull, CheckCircle, Ban, AlertOctagon, UserX, Clock } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export default function MeetingScreen() {
  const { 
    giocatori, 
    meetingInfo, 
    votaGiocatore, 
    concludiMeeting, 
    giocatoreCorrente 
  } = useGameStore();

  const [tempo, setTempo] = useState(45);
  const [showFlash, setShowFlash] = useState(true);

  // Flash rosso iniziale a sirena
  useEffect(() => {
    const timer = setTimeout(() => setShowFlash(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  // Timer countdown meeting
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
    <div className="relative flex flex-1 flex-col justify-between overflow-hidden bg-space-950 p-4">
      {/* Animazione Framer Motion: Flash Rosso e Allarme Visivo */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.4, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, times: [0, 0.2, 0.4, 0.7, 1] }}
            className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-red-600/90"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: [0.8, 1.2, 1], rotate: [0, 5, 0] }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <Siren className="h-24 w-24 text-white animate-bounce" />
              <h1 className="text-3xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                EMERGENCY MEETING!
              </h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header del Meeting */}
      <div className="flex flex-col gap-2 pt-1">
        {/* Banner Allarme */}
        <div className="flex items-center justify-between rounded-2xl border-2 border-neon-red/80 bg-red-950/40 p-3 shadow-glow-red">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-neon-red p-2 text-white">
              <Siren className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-red-300">
                Chiamato da: <span className="font-bold text-white">{meetingInfo.chiamaDa}</span>
              </div>
              <div className="text-xs font-bold text-red-200">
                {meetingInfo.motivo}
              </div>
            </div>
          </div>

          {/* Timer Votazione */}
          <div className="flex items-center gap-1 rounded-xl border border-red-800 bg-space-950/80 px-2.5 py-1.5 font-mono text-xs font-bold text-red-400">
            <Clock className="h-3.5 w-3.5" />
            <span>{tempo}s</span>
          </div>
        </div>

        {/* Istruzione di voto */}
        <div className="flex items-center justify-between px-1 text-xs font-mono text-slate-400">
          <span>
            {hasVoted ? '✓ Voto registrato' : isVivo ? 'Seleziona chi espellere:' : 'Sei morto: puoi solo osservare'}
          </span>
          <span className="text-[10px] text-slate-500 uppercase">Tocca per votare</span>
        </div>
      </div>

      {/* Lista Membri per Votazione */}
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
              className={`flex items-center justify-between rounded-xl border p-2.5 transition-all ${
                !giocatore.vivo
                  ? 'border-slate-800/40 bg-space-900/30 opacity-40 grayscale'
                  : isSelected
                  ? 'border-neon-red bg-red-950/40 shadow-glow-red'
                  : canVote
                  ? 'border-slate-800 bg-space-850 hover:border-slate-700 cursor-pointer active:bg-slate-800'
                  : 'border-slate-800/80 bg-space-850/60'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Colore Avatar Giocatore */}
                <div
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl font-bold shadow-md"
                  style={{ backgroundColor: giocatore.colore }}
                >
                  {giocatore.vivo ? (
                    <div className="h-3 w-5 rounded-full bg-cyan-200/90 shadow-inner" />
                  ) : (
                    <Skull className="h-5 w-5 text-black" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${giocatore.vivo ? 'text-white' : 'line-through text-slate-500'}`}>
                      {giocatore.nome}
                    </span>
                    {isMe && (
                      <span className="rounded bg-neon-cyan/20 px-1.5 py-0.2 text-[9px] font-mono text-neon-cyan">
                        Tu
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {giocatore.vivo ? 'Membro Attivo' : 'DECEDUTO'}
                  </span>
                </div>
              </div>

              {/* Voti Ricevuti e Azione Voto */}
              <div className="flex items-center gap-2">
                {hasVoted && giocatore.votiRicevuti > 0 && (
                  <span className="rounded-md bg-red-500/20 px-2 py-0.5 text-xs font-mono font-bold text-red-300 border border-red-500/30">
                    {giocatore.votiRicevuti} {giocatore.votiRicevuti === 1 ? 'voto' : 'voti'}
                  </span>
                )}

                {isSelected ? (
                  <span className="rounded-lg border border-neon-red bg-neon-red px-2 py-1 text-[10px] font-mono font-bold text-white">
                    VOTATO
                  </span>
                ) : canVote ? (
                  <button
                    type="button"
                    className="rounded-lg border border-slate-700 bg-space-950 px-2.5 py-1 text-[10px] font-mono uppercase text-slate-300 hover:border-neon-red/50 hover:text-neon-red"
                  >
                    Vota
                  </button>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Azioni Inferiori: Skip Vote & Concludi Meeting */}
      <div className="flex flex-col gap-2 pt-1">
        {/* Bottone Salta Voto */}
        {isVivo && !hasVoted && (
          <button
            onClick={() => votaGiocatore('SKIP')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-space-850 py-2.5 text-xs font-mono font-bold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <Ban className="h-4 w-4 text-slate-400" />
            Salta Votazione (Skip Vote)
          </button>
        )}

        {/* Bottone Amministratore / Chiusura Meeting */}
        <button
          onClick={concludiMeeting}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-neon-cyan/50 bg-gradient-to-r from-cyan-600 to-blue-600 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-glow-cyan transition-all active:scale-[0.98]"
        >
          <UserX className="h-4 w-4" />
          Concludi Votazione ed Espelli
        </button>
      </div>
    </div>
  );
}
