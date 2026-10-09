import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Siren, 
  AlertTriangle, 
  MapPin, 
  QrCode, 
  Clock, 
  Skull,
  Radio,
  Zap,
  Flame
} from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export default function GameScreen() {
  const { 
    tasks, 
    completaTask, 
    chiamaMeeting, 
    giocatoreCorrente, 
    meetingInfo 
  } = useGameStore();

  const [activeTaskProcessing, setActiveTaskProcessing] = useState(null);
  const [taskProgress, setTaskProgress] = useState(0);

  const completedCount = tasks.filter((t) => t.completata).length;
  const totalTasks = tasks.length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const isImpostor = giocatoreCorrente.ruolo === 'Impostor';
  const isMorto = giocatoreCorrente.vitale === 'morto';

  // Simula il completamento interattivo di una task
  const handleStartTask = (task) => {
    if (task.completata || activeTaskProcessing) return;

    setActiveTaskProcessing(task.id);
    setTaskProgress(0);

    const stepMs = (task.durataSec * 1000) / 20;
    let current = 0;

    const interval = setInterval(() => {
      current += 5;
      setTaskProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        completaTask(task.id);
        setActiveTaskProcessing(null);
        setTaskProgress(0);
      }
    }, stepMs);
  };

  return (
    <div className={`flex flex-1 flex-col justify-between p-4 overflow-hidden ${isMorto ? 'opacity-85' : ''}`}>
      {/* Ghost Banner se il giocatore è morto */}
      {isMorto && (
        <div className="mb-2 flex items-center justify-center gap-2 rounded-xl border border-purple-500/50 bg-purple-950/40 py-1.5 text-xs font-mono text-purple-300">
          <Skull className="h-4 w-4" />
          MODALITÀ FANTASMA // PUOI ANCORA COMPLETARE LE TASK
        </div>
      )}

      {/* Notifica Ultimo Espulso (se presente) */}
      {meetingInfo.ultimoEspulso && (
        <div className="mb-2 rounded-xl border border-slate-700 bg-space-850 p-2 text-center text-xs font-mono text-slate-300 shadow">
          📢 {meetingInfo.ultimoEspulso}
        </div>
      )}

      {/* Top Section: Barra di Avanzamento Task Stile Among Us */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-neon-green">
            <Zap className="h-4 w-4" />
            Progresso Task Equipaggio
          </span>
          <span className="font-bold text-white">{completedCount}/{totalTasks} ({progressPercent}%)</span>
        </div>

        {/* Progress Bar Container */}
        <div className="h-3.5 w-full overflow-hidden rounded-full border border-slate-700 bg-space-950 p-0.5 shadow-inner">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-neon-green shadow-glow-green"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ ease: 'easeOut', duration: 0.4 }}
          />
        </div>

        {/* Obiettivo Ruolo */}
        <div className={`mt-1 rounded-xl border px-3 py-1.5 text-[11px] font-mono flex items-center justify-between ${
          isImpostor 
            ? 'border-neon-red/40 bg-neon-red/10 text-red-200' 
            : 'border-neon-cyan/40 bg-neon-cyan/10 text-cyan-200'
        }`}>
          <span>
            {isImpostor 
              ? 'OBIETTIVO: Elimina l\'equipaggio senza farti scoprire!' 
              : 'OBIETTIVO: Completa tutte le task fisiche e digitali!'}
          </span>
          <span className="font-bold text-white uppercase">{giocatoreCorrente.ruolo}</span>
        </div>
      </div>

      {/* Middle Section: Lista Task */}
      <div className="my-2.5 flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between pb-1.5 px-1">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
            I Tuoi Compiti ({tasks.length})
          </span>
          <span className="text-[10px] font-mono text-slate-400">Tocca per eseguire</span>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto space-y-2 pr-1">
          {tasks.map((task) => {
            const isProcessing = activeTaskProcessing === task.id;

            return (
              <motion.div
                key={task.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStartTask(task)}
                className={`relative overflow-hidden rounded-2xl border p-3.5 transition-all cursor-pointer ${
                  task.completata
                    ? 'border-emerald-900/60 bg-emerald-950/20 opacity-80'
                    : isProcessing
                    ? 'border-neon-cyan bg-cyan-950/30 shadow-glow-cyan'
                    : 'border-slate-800 bg-space-850 hover:border-slate-700 active:bg-slate-800'
                }`}
              >
                {/* Indicatore Progresso Live interno alla card se in corso */}
                {isProcessing && (
                  <div
                    className="absolute bottom-0 left-0 top-0 bg-neon-cyan/15 transition-all"
                    style={{ width: `${taskProgress}%` }}
                  />
                )}

                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {task.completata ? (
                        <CheckCircle2 className="h-5 w-5 text-neon-green" />
                      ) : isProcessing ? (
                        <Clock className="h-5 w-5 text-neon-cyan animate-spin" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-500" />
                      )}
                    </div>

                    <div>
                      <h4 className={`text-sm font-bold ${task.completata ? 'line-through text-slate-400' : 'text-white'}`}>
                        {task.titolo}
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-neon-yellow" />
                          {task.zona}
                        </span>
                        <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] text-slate-300">
                          {task.tipo}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {task.completata ? (
                      <span className="rounded-lg border border-neon-green/40 bg-neon-green/10 px-2 py-1 text-[10px] font-mono font-bold text-neon-green">
                        FATTO
                      </span>
                    ) : isProcessing ? (
                      <span className="rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 px-2 py-1 text-[10px] font-mono font-bold text-neon-cyan">
                        {taskProgress}%
                      </span>
                    ) : (
                      <span className="rounded-lg border border-slate-700 bg-space-950 px-2 py-1 text-[10px] font-mono text-slate-400">
                        ESEGUI
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Bottoni di Emergenza */}
      <div className="flex flex-col gap-2 pt-1">
        {/* Grande Pulsante Emergency Meeting */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => chiamaMeeting(giocatoreCorrente.nome || 'Tu', 'Pulsante d\'Emergenza Premuto')}
          className="relative group flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-neon-red bg-gradient-to-r from-red-600 via-rose-600 to-red-700 py-3.5 text-white shadow-glow-red font-black tracking-wider uppercase transition-all"
        >
          {/* Sfondo Hazard Stripes animato */}
          <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#fff_10px,#fff_20px)]" />
          
          <Siren className="h-6 w-6 text-white animate-bounce" />
          <span className="text-base font-extrabold tracking-widest drop-shadow">
            EMERGENCY MEETING
          </span>
          <Siren className="h-6 w-6 text-white animate-bounce" />
        </motion.button>

        {/* Pulsante Secondario: Segnala Cadavere (Report Body) */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => chiamaMeeting(giocatoreCorrente.nome || 'Tu', 'Cadavere Trovato!')}
            className="flex items-center justify-center gap-2 rounded-xl border border-amber-600/60 bg-amber-950/40 py-2.5 text-xs font-mono font-bold text-amber-300 hover:bg-amber-900/40 active:scale-95 transition-all"
          >
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            Segnala Cadavere
          </button>

          {/* Azione Speciale Ruolo (Sabotaggio per Impostore / Scanner per Crewmate) */}
          {isImpostor ? (
            <button
              onClick={() => alert('Sabotaggio Luci/O2 attivato! Gli astronauti hanno 60 secondi per ripararlo IRL.')}
              className="flex items-center justify-center gap-2 rounded-xl border border-neon-red/60 bg-red-950/40 py-2.5 text-xs font-mono font-bold text-neon-red hover:bg-red-900/40 active:scale-95 transition-all"
            >
              <Flame className="h-4 w-4" />
              Sabotaggio Luci
            </button>
          ) : (
            <button
              onClick={() => alert('Sensore di prossimità attivo: nessun impostore nelle vicinanze immediate.')}
              className="flex items-center justify-center gap-2 rounded-xl border border-cyan-800 bg-space-850 py-2.5 text-xs font-mono font-bold text-neon-cyan hover:bg-slate-800 active:scale-95 transition-all"
            >
              <Radio className="h-4 w-4" />
              Radar Scansione
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
