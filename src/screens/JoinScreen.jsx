import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Play, Sparkles } from 'lucide-react';
import CrewmateIcon from '../components/CrewmateIcon';
import { useGameStore, AMONGUS_COLORS } from '../store/useGameStore';
import { SoundFX } from '../utils/audio';

export default function JoinScreen() {
  const {
    giocatoreCorrente,
    setNomeGiocatore,
    setColoreGiocatore,
    entraInLobby,
    codiceStanza,
    isMuted,
  } = useGameStore();

  const [nome, setNome] = useState(giocatoreCorrente.nome || '');
  const [selectedColor, setSelectedColor] = useState(giocatoreCorrente.colore || '#38fedc');
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setNomeGiocatore(nome || 'Astronauta');
    setColoreGiocatore(selectedColor);
    SoundFX.playButtonPop(isMuted);
    entraInLobby();
  };

  const handleSimulaQR = () => {
    SoundFX.playButtonPop(isMuted);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const randomName = 'Crewmate ' + Math.floor(Math.random() * 90 + 10);
      setNome(randomName);
      setNomeGiocatore(randomName);
      setColoreGiocatore(selectedColor);
      entraInLobby();
    }, 1100);
  };

  const handleColorPick = (hex) => {
    setSelectedColor(hex);
    setColoreGiocatore(hex);
    SoundFX.playButtonPop(isMuted);
  };

  return (
    <div className="relative flex flex-1 flex-col justify-between overflow-y-auto p-5 custom-scrollbar bg-slate-950">
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

      {/* Titolo & Logo Stile Among Us */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 text-center pt-2"
      >
        <h1 className="text-4xl font-black uppercase tracking-wider text-white drop-shadow-[0_4px_0_#000000]">
          AMOGUS <span className="text-red-500">IRL</span>
        </h1>
        <p className="mt-1 text-xs font-black uppercase tracking-widest text-yellow-300 drop-shadow-[0_2px_0_#000]">
          Mobile Crew Terminal
        </p>
      </motion.div>

      {/* Anteprima Personaggio Animato con selettore colori */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 flex flex-col items-center my-3"
      >
        <div className="rounded-2xl border-[3.5px] border-black bg-slate-900/90 p-4 shadow-[5px_5px_0_#000000] flex flex-col items-center">
          <motion.div
            key={selectedColor}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="my-1"
          >
            <CrewmateIcon color={selectedColor} size="xl" />
          </motion.div>

          {/* Tavolozza Colori Ufficiali Among Us */}
          <div className="mt-3 flex flex-wrap justify-center gap-2 max-w-[260px]">
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

      {/* Form di Accesso */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 w-full"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-black uppercase tracking-wider text-white drop-shadow-[0_1px_0_#000]">
              Nome Giocatore
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Es. Comandante"
              maxLength={16}
              className="w-full rounded-xl border-[3.5px] border-black bg-slate-900 px-4 py-3 text-sm font-black text-white placeholder-slate-500 shadow-[4px_4px_0_#000] focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-black uppercase tracking-wider text-slate-300">
              Stanza Assegnata
            </label>
            <div className="rounded-xl border-[3.5px] border-black bg-slate-900 py-2.5 text-center font-black text-sm tracking-widest text-yellow-300 shadow-[3px_3px_0_#000]">
              {codiceStanza}
            </div>
          </div>

          {/* Bottone Play Primario */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl border-[3.5px] border-black bg-gradient-to-b from-green-400 to-green-600 py-3.5 text-sm font-black uppercase text-black shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none"
          >
            <Play className="h-5 w-5 fill-black" />
            Entra in Partita
          </motion.button>

          {/* Tasto Scansione QR IRL */}
          <button
            type="button"
            onClick={handleSimulaQR}
            disabled={isScanning}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-[3px] border-black bg-slate-800 py-2.5 text-xs font-black uppercase text-white shadow-[3px_3px_0_#000] active:translate-y-0.5 active:shadow-none"
          >
            <QrCode className="h-4 w-4 text-cyan-400" />
            {isScanning ? 'Scansione in corso...' : 'Scansiona QR Partita IRL'}
          </button>
        </form>
      </motion.div>

      <div className="relative z-10 pt-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
        Among Us IRL Live Edition
      </div>
    </div>
  );
}
