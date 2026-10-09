import React from 'react';
import { motion } from 'framer-motion';

/**
 * Pulsantone EMERGENCY MEETING fedele al design della sala mensa di The Skeld
 * - Base circolare con finitura metallica
 * - Cupola di vetro con riflessi specchiati
 * - Grande bottone rosso bombato con scritta in stampatello
 */
export default function EmergencyButton({ onTrigger }) {
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.94 }}
        onClick={onTrigger}
        className="group relative flex h-36 w-36 items-center justify-center rounded-full border-[5px] border-black bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 shadow-[0_8px_0_#000000,0_15px_20px_rgba(0,0,0,0.6)] active:translate-y-2 active:shadow-[0_2px_0_#000000]"
      >
        {/* Cerchio metallico interno con viti */}
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[4px] border-black bg-slate-900 shadow-inner">
          
          {/* Riflesso cupola di vetro superiore */}
          <div className="pointer-events-none absolute top-1 left-3 h-10 w-20 rounded-full bg-white/20 blur-[1px] -rotate-12" />

          {/* Il grosso pulsante rosso centrale Among Us */}
          <div className="flex h-22 w-22 items-center justify-center rounded-full border-[4px] border-black bg-gradient-to-b from-red-500 via-red-600 to-red-800 shadow-[0_5px_0_#450a0a,0_0_15px_rgba(239,68,68,0.7)] group-hover:from-red-400 group-hover:to-red-700">
            {/* Luce riflessa sul bottone */}
            <div className="pointer-events-none absolute top-3 left-6 h-4 w-10 rounded-full bg-white/40 -rotate-15" />
            
            <div className="text-center font-black leading-tight text-white drop-shadow-[0_2px_0_#000]">
              <span className="block text-[10px] tracking-widest text-yellow-300">CALL</span>
              <span className="block text-xs font-black tracking-wider">EMERGENCY</span>
            </div>
          </div>
        </div>
      </motion.button>
    </div>
  );
}
