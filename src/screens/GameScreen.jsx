import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  MapPin, 
  Flame, 
  Radio, 
  Skull,
  Megaphone,
  Loader2,
  Activity,
  Crosshair,
  ShieldCheck,
  Eye,
  Wrench,
  Sparkles,
  X
} from 'lucide-react';
import CrewmateIcon from '../components/CrewmateIcon';
import AmongUsTaskBar from '../components/AmongUsTaskBar';
import EmergencyButton from '../components/EmergencyButton';
import { useGameStore } from '../store/useGameStore';
import { ALL_ROLES } from '../utils/roles';
import { SoundFX } from '../utils/audio';
import { OllamaService } from '../utils/ollama';

export default function GameScreen() {
  const {
    tasks,
    giocatori,
    completaTask,
    chiamaMeeting,
    giocatoreCorrente,
    sparoSceriffo,
    applicaScudoAngelo,
    isMuted,
  } = useGameStore();

  const [activeTaskProcessing, setActiveTaskProcessing] = useState(null);
  const [taskProgress, setTaskProgress] = useState(0);
  const [clueNotice, setClueNotice] = useState(null);
  const [loadingClue, setLoadingClue] = useState(false);

  // Modali interattive per abilità di ruolo
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showSheriffModal, setShowSheriffModal] = useState(false);
  const [showDoomsayerModal, setShowDoomsayerModal] = useState(false);
  const [selectedGuessRole, setSelectedGuessRole] = useState('Impostor');

  const completedCount = tasks.filter((t) => t.completata).length;
  const isMorto = giocatoreCorrente.vitale === 'morto';
  const roleObj = ALL_ROLES[giocatoreCorrente.ruolo] || ALL_ROLES.Crewmate;

  // Esecuzione task
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

  // Sabotaggio per Impostore
  const handleSabotage = () => {
    SoundFX.playSabotageAlert(isMuted);
    alert('🚨 ALLARME SABOTAGGIO! Luci manomesse: i Crewmate hanno 60 secondi per ripristinarle IRL.');
  };

  // Indizio IA (Llama 3)
  const handleRadarScan = async () => {
    SoundFX.playButtonPop(isMuted);
    setLoadingClue(true);
    setClueNotice('Interrogazione sensori con Llama 3...');
    const clue = await OllamaService.generateClue('Navetta Skeld');
    setClueNotice(clue);
    setLoadingClue(false);
  };

  // Esecuzione Sceriffo
  const handleShootPlayer = (targetId) => {
    setShowSheriffModal(false);
    sparoSceriffo(targetId);
  };

  // Indovinello Doomsayer
  const handleDoomsayerGuess = (targetPlayer) => {
    setShowDoomsayerModal(false);
    SoundFX.playButtonPop(isMuted);
    if (targetPlayer.ruolo === selectedGuessRole) {
      alert(`🔮 PROFEZIA CORRETTA! ${targetPlayer.nome} è davvero un ${ALL_ROLES[targetPlayer.ruolo].nome}! Sei vicino alla vittoria!`);
    } else {
      alert(`❌ Profezia errata! ${targetPlayer.nome} non è un ${ALL_ROLES[selectedGuessRole].nome}. Fai attenzione!`);
    }
  };

  return (
    <div className={`flex flex-1 flex-col justify-between p-3.5 overflow-hidden bg-slate-950 ${isMorto ? 'opacity-90' : ''}`}>
      {/* Top Banner: Barra Task Ufficiale Among Us */}
      <div className="flex flex-col gap-1.5">
        <AmongUsTaskBar completed={completedCount} total={tasks.length} />

        {/* Banner informativo specifico del ruolo */}
        <div
          className="flex items-center justify-between rounded-xl border-2 border-black px-2.5 py-1 text-xs font-black shadow-[2px_2px_0_#000]"
          style={{ backgroundColor: roleObj.coloreBadge, color: roleObj.coloreTesto }}
        >
          <span className="truncate pr-2">
            ⭐ {roleObj.nome}: {roleObj.vittoria}
          </span>
          <span className="uppercase text-[10px] shrink-0 border border-black/50 px-1 rounded bg-black/20">
            {roleObj.fazione}
          </span>
        </div>

        {/* Modalità Fantasma se il giocatore è morto */}
        {isMorto && (
          <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-purple-900/60 py-1 text-xs font-black text-purple-200 shadow-[2px_2px_0_#000]">
            <CrewmateIcon color={giocatoreCorrente.colore} size="xs" isGhost={true} />
            <span>MODALITÀ SPIRITO // CONTINUA LE TASK!</span>
          </div>
        )}

        {/* Notifica Indizio LLM */}
        {clueNotice && (
          <div className="flex items-center justify-between rounded-xl border-2 border-black bg-slate-900 p-2 text-xs font-black text-cyan-300 shadow-[2px_2px_0_#000]">
            <span>📡 {clueNotice}</span>
            <button
              onClick={() => setClueNotice(null)}
              className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-white"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Lista Task stile Among Us */}
      <div className="my-1.5 flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between pb-1 px-1">
          <span className="text-xs font-black uppercase tracking-wider text-yellow-300 drop-shadow-[0_1px_0_#000]">
            {giocatoreCorrente.ruolo === 'Impostor' ? 'Compiti Falsi (Fake Tasks)' : 'I Tuoi Compiti (Tasks)'}
          </span>
          <span className="text-[10px] font-bold text-slate-400">Tocca per svolgere</span>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto space-y-1.5 pr-1">
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
                {isProcessing && (
                  <div
                    className="absolute bottom-0 left-0 top-0 bg-yellow-400/20 transition-all"
                    style={{ width: `${taskProgress}%` }}
                  />
                )}

                <div className="relative flex items-center justify-between gap-2">
                  <div className="flex items-start gap-2.5">
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
                      <h4 className={`text-xs font-black ${task.completata ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.titolo}
                      </h4>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-black text-yellow-300">
                        <MapPin className="h-3 w-3" />
                        <span>{task.zona}</span>
                      </div>
                    </div>
                  </div>

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

      {/* Sezione Inferiore: Emergency Button & Abilità Speciali del Ruolo */}
      <div className="flex flex-col items-center gap-1">
        <EmergencyButton
          onTrigger={() => chiamaMeeting(giocatoreCorrente.nome || 'Tu', 'Pulsante d\'Emergenza!')}
        />

        {/* Griglia Azioni Dinamiche basate sul RUOLO ATTUALE */}
        <div className="grid w-full grid-cols-2 gap-2">
          {/* Tasto Comune: Report Body */}
          <button
            onClick={() => chiamaMeeting(giocatoreCorrente.nome || 'Tu', 'Cadavere Trovato!')}
            className="flex items-center justify-center gap-1.5 rounded-xl border-[3px] border-black bg-gradient-to-b from-blue-500 to-blue-700 py-2.5 text-xs font-black uppercase text-white shadow-[2px_2px_0_#000] active:translate-y-0.5"
          >
            <Megaphone className="h-4 w-4 fill-white" />
            Report Body
          </button>

          {/* Abilità 1: SCIENZIATO -> Vitals */}
          {giocatoreCorrente.ruolo === 'Scientist' && (
            <button
              onClick={() => {
                SoundFX.playButtonPop(isMuted);
                setShowVitalsModal(true);
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border-[3px] border-black bg-gradient-to-b from-cyan-500 to-blue-600 py-2.5 text-xs font-black uppercase text-white shadow-[2px_2px_0_#000] active:translate-y-0.5"
            >
              <Activity className="h-4 w-4 text-white" />
              Monitor Vitals
            </button>
          )}

          {/* Abilità 2: SCERIFFO -> Spara */}
          {giocatoreCorrente.ruolo === 'Sheriff' && (
            <button
              onClick={() => {
                SoundFX.playButtonPop(isMuted);
                setShowSheriffModal(true);
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border-[3px] border-black bg-gradient-to-b from-yellow-400 to-amber-600 py-2.5 text-xs font-black uppercase text-black shadow-[2px_2px_0_#000] active:translate-y-0.5"
            >
              <Crosshair className="h-4 w-4" />
              Colpo Sceriffo
            </button>
          )}

          {/* Abilità 3: IMPOSTORE -> Sabotaggio */}
          {giocatoreCorrente.ruolo === 'Impostor' && (
            <button
              onClick={handleSabotage}
              className="flex items-center justify-center gap-1.5 rounded-xl border-[3px] border-black bg-gradient-to-b from-red-600 to-red-800 py-2.5 text-xs font-black uppercase text-white shadow-[2px_2px_0_#000] active:translate-y-0.5"
            >
              <Flame className="h-4 w-4" />
              Sabotaggio
            </button>
          )}

          {/* Abilità 4: INGEGNERE -> Vent / Ripara */}
          {giocatoreCorrente.ruolo === 'Engineer' && (
            <button
              onClick={() => alert('🔧 Ingegnere: Accesso ai condotti verificato e riparazione rapida pronta!')}
              className="flex items-center justify-center gap-1.5 rounded-xl border-[3px] border-black bg-gradient-to-b from-orange-500 to-amber-600 py-2.5 text-xs font-black uppercase text-black shadow-[2px_2px_0_#000] active:translate-y-0.5"
            >
              <Wrench className="h-4 w-4" />
              Riparazione
            </button>
          )}

          {/* Abilità 5: GIULLARE -> Posa Sospetta */}
          {giocatoreCorrente.ruolo === 'Jester' && (
            <button
              onClick={() => alert('🃏 Giullare: Hai finto di correre lontano dalla stanza del crimine! Fatti votare al meeting per vincere!')}
              className="flex items-center justify-center gap-1.5 rounded-xl border-[3px] border-black bg-gradient-to-b from-fuchsia-500 to-pink-600 py-2.5 text-xs font-black uppercase text-white shadow-[2px_2px_0_#000] active:translate-y-0.5"
            >
              <Sparkles className="h-4 w-4" />
              Posa Sospetta
            </button>
          )}

          {/* Abilità 6: DOOMSAYER -> Profetizza */}
          {giocatoreCorrente.ruolo === 'Doomsayer' && (
            <button
              onClick={() => {
                SoundFX.playButtonPop(isMuted);
                setShowDoomsayerModal(true);
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border-[3px] border-black bg-gradient-to-b from-purple-600 to-indigo-700 py-2.5 text-xs font-black uppercase text-white shadow-[2px_2px_0_#000] active:translate-y-0.5"
            >
              <Eye className="h-4 w-4" />
              Profetizza
            </button>
          )}

          {/* Abilità 7: ANGELO CUSTODE -> Scudo */}
          {giocatoreCorrente.ruolo === 'GuardianAngel' && (
            <button
              onClick={() => {
                const alive = giocatori.find((p) => p.id !== '1' && p.vivo);
                if (alive) applicaScudoAngelo(alive.id);
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border-[3px] border-black bg-gradient-to-b from-purple-400 to-indigo-500 py-2.5 text-xs font-black uppercase text-white shadow-[2px_2px_0_#000] active:translate-y-0.5"
            >
              <ShieldCheck className="h-4 w-4" />
              Applica Scudo
            </button>
          )}

          {/* Abilità 8: CREWMATE -> Radar Llama 3 */}
          {giocatoreCorrente.ruolo === 'Crewmate' && (
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

      {/* MODALE VITALS (Abilità dello Scienziato) */}
      {showVitalsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm rounded-2xl border-[4px] border-black bg-slate-900 p-4 shadow-[5px_5px_0_#000]">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <span className="flex items-center gap-2 font-black text-sm uppercase text-cyan-400">
                <Activity className="h-4 w-4 text-green-400 animate-pulse" />
                Vitals Monitor (Scienziato)
              </span>
              <button
                onClick={() => setShowVitalsModal(false)}
                className="rounded-lg bg-slate-800 p-1 text-white hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="my-3 space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
              {giocatori.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border-2 border-black bg-slate-800 p-2"
                >
                  <div className="flex items-center gap-2">
                    <CrewmateIcon color={p.colore} size="xs" isDead={!p.vivo} />
                    <span className="font-black text-xs text-white">{p.nome}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {p.vivo ? (
                      <span className="rounded bg-green-500/20 px-2 py-0.5 text-[10px] font-black text-green-400 border border-green-500/40">
                        BATTITO OK
                      </span>
                    ) : (
                      <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-black text-red-500 border border-red-500/40">
                        DECEDUTO
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowVitalsModal(false)}
              className="w-full rounded-xl border-2 border-black bg-cyan-400 py-2 text-xs font-black uppercase text-black"
            >
              Chiudi Vitals
            </button>
          </div>
        </div>
      )}

      {/* MODALE SCERIFFO (Scegli chi giustiziare) */}
      {showSheriffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm rounded-2xl border-[4px] border-black bg-slate-900 p-4 shadow-[5px_5px_0_#000]">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <span className="font-black text-sm uppercase text-yellow-300">
                🎯 Scegli chi Giustiziare
              </span>
              <button
                onClick={() => setShowSheriffModal(false)}
                className="rounded-lg bg-slate-800 p-1 text-white hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="my-2 text-[11px] font-bold text-red-400 italic">
              ⚠️ Se colpisci un Impostore lo elimini! Se è innocente, muori anche tu!
            </p>

            <div className="my-2 space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar pr-1">
              {giocatori
                .filter((p) => p.id !== '1' && p.vivo)
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleShootPlayer(p.id)}
                    className="flex w-full items-center justify-between rounded-xl border-2 border-black bg-slate-800 p-2 hover:bg-red-950/60 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <CrewmateIcon color={p.colore} size="xs" />
                      <span className="font-black text-xs text-white">{p.nome}</span>
                    </div>
                    <span className="rounded bg-yellow-400 px-2 py-0.5 text-[10px] font-black text-black">
                      SPARA
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* MODALE DOOMSAYER (Profetizza Ruolo) */}
      {showDoomsayerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm rounded-2xl border-[4px] border-black bg-slate-900 p-4 shadow-[5px_5px_0_#000]">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <span className="font-black text-sm uppercase text-purple-400">
                🔮 Profetizza il Ruolo
              </span>
              <button
                onClick={() => setShowDoomsayerModal(false)}
                className="rounded-lg bg-slate-800 p-1 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="my-2">
              <label className="block text-[11px] font-black uppercase text-slate-300 mb-1">
                Indovina che sia un:
              </label>
              <select
                value={selectedGuessRole}
                onChange={(e) => setSelectedGuessRole(e.target.value)}
                className="w-full rounded-xl border-2 border-black bg-slate-800 p-2 text-xs font-black text-yellow-300"
              >
                {Object.values(ALL_ROLES).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="my-2 space-y-1.5 max-h-52 overflow-y-auto custom-scrollbar pr-1">
              {giocatori
                .filter((p) => p.id !== '1' && p.vivo)
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleDoomsayerGuess(p)}
                    className="flex w-full items-center justify-between rounded-xl border-2 border-black bg-slate-800 p-2 hover:bg-purple-950/60"
                  >
                    <div className="flex items-center gap-2">
                      <CrewmateIcon color={p.colore} size="xs" />
                      <span className="font-black text-xs text-white">{p.nome}</span>
                    </div>
                    <span className="rounded bg-purple-500 px-2 py-0.5 text-[10px] font-black text-white">
                      INDICA
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
