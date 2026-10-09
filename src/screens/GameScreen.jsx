import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  MapPin, 
  AlertTriangle, 
  Flame, 
  Radio, 
  Skull,
  Megaphone,
  Loader2
} from 'lucide-react';
import CrewmateIcon from '../components/CrewmateIcon';
import AmongUsTaskBar from '../components/AmongUsTaskBar';
import EmergencyButton from '../components/EmergencyButton';
import { useGameStore } from '../store/useGameStore';
import { SoundFX } from '../utils/audio';
import { OllamaService } from '../utils/ollama';

export default function GameScreen() {
  const {
    tasks,
    completaTask,
    chiamaMeeting,
    giocatoreCorrente,
    isMuted,
  } = useGameStore();

  const [activeTaskProcessing, setActiveTaskProcessing] = useState(null);
  const [taskProgress, setTaskProgress] = useState(0);
  const [clueNotice, setClueNotice] = useState(null);
  const [loadingClue, setLoadingClue] = useState(false);

  const completedCount = tasks.filter((t) => t.completata).length;
  const isImpostor = giocatoreCorrente.ruolo === 'Impostor';
  const isMorto = giocatoreCorrente.vitale === 'morto';

  // Simula esecuzione task
  const handleStartTask = (task) => {
    if (task.completata || activeTaskProcessing) return;

    SoundFX.playButtonPop(isMuted);
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

  // Sabotaggio per Impostore con allarme audio
  const handleSabotage = () => {
    SoundFX.playSabotageAlert(isMuted);
    alert('🚨 ALLARME SABOTAGGIO! Luci manomesse: i Crewmate hanno 60 secondi per ripararle IRL.');
  };

  // Generazione indizio tramite Ollama (Llama 3 locale)
  const handleRadarScan = async () => {
    SoundFX.playButtonPop(isMuted);
    setLoadingClue(true);
    setClueNotice('Analisi sensori con Llama 3...');
    const clue = await OllamaService.generateClue('Corridoio Skeld');
    setClueNotice(clue);
    setLoadingClue(false);
  };

  return (
    <div className={`flex flex-1 flex-col justify-between p-3.5 overflow-hidden bg-slate-950 ${isMorto ? 'opacity-90' : ''}`}>
      {/* Top Banner: Barra Ufficiale Among Us */}
      <div className="flex flex-col gap-2">
        <AmongUsTaskBar completed={completedCount} total={tasks.length} />

        {/* Modalità Fantasma se il giocatore è morto */}
        {isMorto && (
          <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-purple-900/60 py-1 text-xs font-black text-purple-200 shadow-[2px_2px_0_#000]">
            <CrewmateIcon color={giocatoreCorrente.colore} size="xs" isGhost={true} />
            <span>SEI UN FANTASMA: COMPLETA LE TUE TASK!</span>
          </div>
        )}

        {/* Notifica Indizio LLM */}
        {clueNotice && (
          <div className="flex items-center justify-between rounded-xl border-2 border-black bg-slate-900 p-2 text-xs font-black text-cyan-300 shadow-[2px_2px_0_#000]">
            <span>📡 {clueNotice}</span>
            <button
              onClick={() => setClueNotice(null)}
              className="ml-2 rounded bg-slate-800 px-1 text-[10px] text-white"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Sezione Centrale: Lista Task stile Among Us con evidenziazioni gialle */}
      <div className="my-2 flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between pb-1 px-1">
          <span className="text-xs font-black uppercase tracking-wider text-yellow-300 drop-shadow-[0_1px_0_#000]">
            {isImpostor ? 'Compiti Falsi (Fake Tasks)' : 'I Tuoi Compiti (Tasks)'}
          </span>
          <span className="text-[10px] font-bold text-slate-400">Tocca per svolgere</span>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto space-y-2 pr-1">
          {tasks.map((task) => {
            const isProcessing = activeTaskProcessing === task.id;

            return (
              <motion.div
                key={task.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStartTask(task)}
                className={`relative overflow-hidden rounded-xl border-[3px] border-black p-2.5 transition-all cursor-pointer shadow-[3px_3px_0_#000] ${
                  task.completata
                    ? 'bg-slate-900 opacity-60'
                    : isProcessing
                    ? 'bg-slate-800 ring-2 ring-yellow-400'
                    : 'bg-slate-900 hover:bg-slate-850'
                }`}
              >
                {/* Avanzamento della barra interna alla card durante l'azione */}
                {isProcessing && (
                  <div
                    className="absolute bottom-0 left-0 top-0 bg-yellow-400/20 transition-all"
                    style={{ width: `${taskProgress}%` }}
                  />
                )}

                <div className="relative flex items-center justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    {/* Indicatore Giallo stile freccia Among Us */}
                    <div className="mt-0.5">
                      {task.completata ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-black bg-green-500 text-black">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-black bg-yellow-400 text-black font-black text-xs">
                          !
                        </div>
                      )}
                    </div>

                    <div>
                      <h4
                        className={`text-xs font-black ${
                          task.completata ? 'line-through text-slate-500' : 'text-white'
                        }`}
                      >
                        {task.titolo}
                      </h4>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-black text-yellow-300">
                        <MapPin className="h-3 w-3" />
                        <span>{task.zona}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badge Stato */}
                  <div>
                    {task.completata ? (
                      <span className="rounded-md border border-black bg-green-500/20 px-2 py-0.5 text-[10px] font-black text-green-400">
                        FATTO
                      </span>
                    ) : isProcessing ? (
                      <span className="rounded-md border border-black bg-yellow-400 px-2 py-0.5 text-[10px] font-black text-black">
                        {taskProgress}%
                      </span>
                    ) : (
                      <span className="rounded-md border border-black bg-slate-800 px-2 py-0.5 text-[10px] font-black text-slate-300">
                        INIZIA
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Sezione Inferiore: Il Tipico Pulsante Rosso d'Emergenza Among Us */}
      <div className="flex flex-col items-center">
        <EmergencyButton
          onTrigger={() => chiamaMeeting(giocatoreCorrente.nome || 'Tu', 'Pulsante d\'Emergenza!')}
        />

        {/* Azioni Ausiliarie: Segnala Cadavere & Azione Speciale */}
        <div className="mt-1 grid w-full grid-cols-2 gap-2">
          {/* Tasto Report Body */}
          <button
            onClick={() => chiamaMeeting(giocatoreCorrente.nome || 'Tu', 'Cadavere Trovato!')}
            className="flex items-center justify-center gap-1.5 rounded-xl border-[3px] border-black bg-gradient-to-b from-blue-500 to-blue-700 py-2.5 text-xs font-black uppercase text-white shadow-[2px_2px_0_#000] active:translate-y-0.5"
          >
            <Megaphone className="h-4 w-4 fill-white" />
            Report Body
          </button>

          {/* Azione Ruolo */}
          {isImpostor ? (
            <button
              onClick={handleSabotage}
              className="flex items-center justify-center gap-1.5 rounded-xl border-[3px] border-black bg-gradient-to-b from-red-600 to-red-800 py-2.5 text-xs font-black uppercase text-white shadow-[2px_2px_0_#000] active:translate-y-0.5"
            >
              <Flame className="h-4 w-4" />
              Sabotaggio
            </button>
          ) : (
            <button
              onClick={handleRadarScan}
              disabled={loadingClue}
              className="flex items-center justify-center gap-1.5 rounded-xl border-[3px] border-black bg-gradient-to-b from-slate-700 to-slate-800 py-2.5 text-xs font-black uppercase text-cyan-300 shadow-[2px_2px_0_#000] active:translate-y-0.5"
            >
              {loadingClue ? <Loader2 className="h-4 w-4 animate-spin" /> : <Radio className="h-4 w-4" />}
              Indizio IA
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
