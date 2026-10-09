import React from 'react';

export default function MobileFrame({ children }) {
  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-space-950 p-0 sm:p-4 select-none">
      {/* Contenitore stile Smartphone fisso */}
      <div className="relative flex h-full w-full max-w-md flex-col overflow-hidden bg-space-900 shadow-2xl sm:h-[92vh] sm:max-h-[880px] sm:rounded-3xl sm:border sm:border-slate-800/80 sm:shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* Glow corner e dettagli sci-fi sul bordo */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-neon-cyan/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-neon-red/10 blur-3xl" />
        
        {/* Dettaglio notch / speaker per realismo mobile su desktop */}
        <div className="hidden sm:flex absolute top-2 left-1/2 -translate-x-1/2 items-center justify-center gap-1.5 z-40">
          <div className="h-1.5 w-12 rounded-full bg-slate-800/80 border border-slate-700/50" />
          <div className="h-2 w-2 rounded-full bg-slate-800 border border-slate-700/50" />
        </div>

        {/* Contenuto dell'applicazione */}
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
