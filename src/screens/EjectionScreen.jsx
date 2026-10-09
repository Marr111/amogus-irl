import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CrewmateIcon from '../components/CrewmateIcon';
import { useGameStore } from '../store/useGameStore';

export default function EjectionScreen() {
  const { ejectionInfo, fineEspulsione } = useGameStore();
  const [displayedText, setDisplayedText] = useState('');

  const fullText = ejectionInfo?.testo || 'Nessuno è stato espulso.';

  // Effetto macchina da scrivere retrò stile Among Us
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      index++;
      setDisplayedText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 65);

    // Auto-ritorno al gioco dopo 6 secondi o al tap
    const autoReturn = setTimeout(() => {
      fineEspulsione();
    }, 6500);

    return () => {
      clearInterval(interval);
      clearTimeout(autoReturn);
    };
  }, [fullText, fineEspulsione]);

  return (
    <div
      onClick={fineEspulsione}
      className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-black p-6 cursor-pointer select-none"
    >
      {/* Campo di stelle fluttuanti nello spazio profondo */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-80"
            style={{
              width: `${(i % 3) + 1}px`,
              height: `${(i % 3) + 1}px`,
              top: `${(i * 37) % 100}%`,
              left: `${(i * 73) % 100}%`,
              animation: `pulse ${(i % 3) + 2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Personaggio espulso che fluttua e ruota attraverso lo schermo */}
      {ejectionInfo?.nome && (
        <motion.div
          className="absolute z-20"
          initial={{ x: '-160%', y: '10%', rotate: 0 }}
          animate={{ x: '160%', y: '-10%', rotate: 720 }}
          transition={{ duration: 5.5, ease: 'linear' }}
        >
          <CrewmateIcon color={ejectionInfo.colore || '#c51111'} size="lg" />
        </motion.div>
      )}

      {/* Messaggio Drammatico Typewriter al centro */}
      <div className="relative z-30 max-w-xs text-center">
        <h2 className="min-h-[70px] text-lg font-black tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] font-mono">
          {displayedText}
          <span className="inline-block w-2 animate-pulse bg-white">_</span>
        </h2>

        {ejectionInfo?.impostorsRimasti !== undefined && (
          <p className="mt-4 text-xs font-mono font-bold tracking-wider text-slate-400">
            {ejectionInfo.impostorsRimasti === 1
              ? '1 Impostore rimasto.'
              : `${ejectionInfo.impostorsRimasti} Impostori rimasti.`}
          </p>
        )}
      </div>

      <div className="absolute bottom-6 text-[10px] font-mono uppercase tracking-widest text-slate-500 animate-pulse">
        Tocca lo schermo per proseguire
      </div>
    </div>
  );
}
