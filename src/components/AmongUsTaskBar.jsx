import React from 'react';
import { motion } from 'framer-motion';

/**
 * Tipica barra Total Tasks Completed stile Among Us
 * - Bordo nero spesso e smussato
 * - Sfondo grigio metallico con vite
 * - Barra verde fluorescente ad alto contrasto
 */
export default function AmongUsTaskBar({ completed, total }) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-1 pb-1">
        <span className="font-black text-[12px] uppercase tracking-wider text-green-400 drop-shadow-[0_2px_0_#000]">
          Total Tasks Completed
        </span>
        <span className="font-black text-xs text-white drop-shadow-[0_2px_0_#000]">
          {completed}/{total}
        </span>
      </div>

      {/* Telaio metallico della barra con spessi bordi neri */}
      <div className="relative h-6 w-full rounded-md border-[3.5px] border-black bg-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Riempimento verde lime stile Among Us */}
        <motion.div
          className="h-full bg-gradient-to-r from-lime-400 to-green-500 border-r-[2.5px] border-black"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />

        {/* Tacche di suddivisione stile gioco originale */}
        <div className="pointer-events-none absolute inset-0 flex">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex-1 border-r border-black/40 last:border-r-0 h-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
