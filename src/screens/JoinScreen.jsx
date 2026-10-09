import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, User, Shield } from 'lucide-react';
import CrewmateIcon from '../components/CrewmateIcon';
import { useGameStore, AMONGUS_COLORS } from '../store/useGameStore';
import { ALL_ROLES, ROLES_LIST } from '../utils/roles';
import { SoundFX } from '../utils/audio';

export default function JoinScreen() {
  const {
    giocatoreCorrente,
    setNomeGiocatore,
    setColoreGiocatore,
    setRuoloGiocatore,
    entraInLobby,
    isMuted,
  } = useGameStore();

  const [nome, setNome] = useState(giocatoreCorrente.nome || '');
  const [selectedColor, setSelectedColor] = useState(giocatoreCorrente.colore || '#38fedc');
  const [selectedRole, setSelectedRole] = useState(giocatoreCorrente.ruolo || 'Scientist');

  const handleSubmit = (e) => {
    e.preventDefault();
    setNomeGiocatore(nome || 'Astronauta');
    setColoreGiocatore(selectedColor);
    setRuoloGiocatore(selectedRole);
    SoundFX.playButtonPop(isMuted);
    entraInLobby();
  };

  const handleColorPick = (hex) => {
    setSelectedColor(hex);
    setColoreGiocatore(hex);
    SoundFX.playButtonPop(isMuted);
  };

  const roleObj = ALL_ROLES[selectedRole] || ALL_ROLES.Crewmate;

  return (
    <div className="relative flex flex-1 flex-col justify-between overflow-y-auto p-4 custom-scrollbar bg-slate-950">
      {/* Stelle di sfondo */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${(i % 3) + 1}px`,
              height: `${(i % 3) + 1}px`,
              top: `${(i * 41) % 100}%`,
              left: `${(i * 67) % 100}%`,
            }}
          />
        ))}
      </div>

      {/* Titolo Principale */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 text-center pt-2"
      >
        <h1 className="text-4xl font-black uppercase tracking-wider text-white drop-shadow-[0_4px_0_#000000]">
          AMOGUS <span className="text-red-500">IRL</span>
        </h1>
        <p className="mt-1 text-xs font-black uppercase tracking-widest text-yellow-300 drop-shadow-[0_2px_0_#000]">
          Unica Partita Live • Sala d'Imbarco
        </p>
      </motion.div>

      {/* Avatar e Scelta Colore Tuta */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 flex flex-col items-center my-2"
      >
        <div className="w-full rounded-2xl border-[3.5px] border-black bg-slate-900/95 p-3.5 shadow-[5px_5px_0_#000000] flex flex-col items-center">
          <motion.div
            key={selectedColor}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="my-1"
          >
            <CrewmateIcon color={selectedColor} size="xl" />
          </motion.div>

          {/* Palette Colori Among Us */}
          <div className="mt-2.5 flex flex-wrap justify-center gap-2 max-w-[270px]">
            {AMONGUS_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleColorPick(c.hex)}
                className={`h-7 w-7 rounded-full border-2 border-black transition-transform shadow-[1px_2px_0_#000] ${
                  selectedColor === c.hex ? 'scale-125 ring-2 ring-white z-10' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Form Ingresso con Scelta Ruolo */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 w-full"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          {/* Input Nome */}
          <div>
            <label className="mb-1 block text-xs font-black uppercase tracking-wider text-white drop-shadow-[0_1px_0_#000]">
              Il Tuo Nome
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Es. Matteo / Comandante"
                maxLength={16}
                className="w-full rounded-xl border-[3.5px] border-black bg-slate-900 py-2.5 pl-10 pr-3 text-sm font-black text-white placeholder-slate-500 shadow-[4px_4px_0_#000] focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Selettore Ruolo di Partenza */}
          <div>
            <label className="mb-1 flex items-center justify-between text-xs font-black uppercase tracking-wider text-white drop-shadow-[0_1px_0_#000]">
              <span>Scegli il Tuo Ruolo</span>
              <span className="text-[10px] text-yellow-300">Tutti gli 8 ruoli attivi</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setRuoloGiocatore(e.target.value);
                SoundFX.playButtonPop(isMuted);
              }}
              className="w-full rounded-xl border-[3.5px] border-black bg-slate-900 px-3 py-2 text-xs font-black text-yellow-300 shadow-[3px_3px_0_#000] focus:outline-none"
            >
              {ROLES_LIST.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nome} ({r.fazione})
                </option>
              ))}
            </select>

            <p className="mt-1 text-[11px] font-bold text-slate-300 italic px-1">
              💡 {roleObj.descrizione}
            </p>
          </div>

          {/* Tasto Diretto: Unisciti all'attesa */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border-[3.5px] border-black bg-gradient-to-b from-green-400 to-green-600 py-3.5 text-sm font-black uppercase text-black shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none"
          >
            <Play className="h-5 w-5 fill-black" />
            Unisciti alle Persone in Attesa
          </motion.button>
        </form>
      </motion.div>

      <div className="relative z-10 pt-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
        Nessuna stanza da digitare • Server Unico Diretto
      </div>
    </div>
  );
}
