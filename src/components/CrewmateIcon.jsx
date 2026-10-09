import React from 'react';

/**
 * Componente grafico vettoriale SVG del Crewmate in perfetto stile Among Us
 * - Bordi neri spessi da fumetto
 * - Visore celeste specchiato con riflesso bianco
 * - Zainetto coordinato e ombreggiatura inferiore
 * - Modalità Fantasma con coda ondulata
 */
export default function CrewmateIcon({
  color = '#c51111',
  size = 'md',
  isGhost = false,
  isDead = false,
  className = '',
}) {
  const sizeMap = {
    xs: 'w-6 h-7',
    sm: 'w-8 h-10',
    md: 'w-11 h-14',
    lg: 'w-16 h-20',
    xl: 'w-24 h-28',
    xxl: 'w-32 h-38',
  };

  const dim = sizeMap[size] || sizeMap.md;

  // Se è un cadavere (tronco tagliato con osso sporgente classico Among Us)
  if (isDead && !isGhost) {
    return (
      <div className={`relative inline-block ${dim} ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[2px_3px_0px_rgba(0,0,0,0.8)]">
          {/* Base corpo tagliata */}
          <path
            d="M 22 55 C 22 75, 30 85, 36 90 L 36 94 C 36 96, 46 96, 46 94 L 46 90 C 50 90, 54 90, 58 90 L 58 94 C 58 96, 68 96, 68 94 L 68 88 C 76 82, 82 70, 82 55 Z"
            fill={color}
            stroke="#000"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Ombra interna fondo corpo */}
          <path
            d="M 25 72 C 35 88, 68 88, 79 72 C 81 78, 75 86, 68 88 L 68 94 C 68 96, 58 96, 58 94 L 58 90 C 54 90, 50 90, 46 90 L 46 94 C 46 96, 36 96, 36 94 L 36 90 C 30 85, 22 75, 25 72 Z"
            fill="rgba(0,0,0,0.25)"
          />
          {/* Taglio netto superiore */}
          <ellipse cx="52" cy="55" rx="30" ry="10" fill="#991b1b" stroke="#000" strokeWidth="5" />
          <ellipse cx="52" cy="55" rx="26" ry="7" fill="#dc2626" />
          {/* Osso bianco Among Us che spunta */}
          <path
            d="M 50 35 L 50 54 M 46 32 C 43 28, 43 24, 47 24 C 50 24, 50 28, 50 28 C 50 28, 50 24, 53 24 C 57 24, 57 28, 54 32 L 54 54"
            fill="#ffffff"
            stroke="#000"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <circle cx="47" cy="26" r="3" fill="#ffffff" />
          <circle cx="53" cy="26" r="3" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  // Se è un Fantasma
  if (isGhost) {
    return (
      <div className={`relative inline-block ${dim} opacity-75 animate-bounce ${className}`}>
        <svg viewBox="0 0 100 120" className="h-full w-full drop-shadow-[2px_3px_0px_rgba(0,0,0,0.5)]">
          {/* Zainetto fantasma */}
          <path
            d="M 20 40 C 12 40, 10 50, 10 65 C 10 80, 12 85, 20 85"
            fill={color}
            stroke="#000"
            strokeWidth="5"
            strokeLinejoin="round"
            fillOpacity="0.7"
          />
          {/* Corpo fantasma con coda fluttuante */}
          <path
            d="M 50 14 C 28 14, 20 32, 20 60 C 20 85, 25 100, 35 105 C 45 110, 50 95, 60 105 C 70 115, 80 95, 82 75 C 84 55, 80 14, 50 14 Z"
            fill={color}
            stroke="#000"
            strokeWidth="5"
            strokeLinejoin="round"
            fillOpacity="0.75"
          />
          {/* Visore */}
          <path
            d="M 55 30 C 72 30, 88 34, 88 45 C 88 56, 72 60, 55 60 C 44 60, 42 56, 42 45 C 42 34, 44 30, 55 30 Z"
            fill="#a5f3fc"
            stroke="#000"
            strokeWidth="4.5"
          />
          {/* Riflesso visore */}
          <ellipse cx="64" cy="38" rx="14" ry="4" fill="#ffffff" fillOpacity="0.9" />
        </svg>
      </div>
    );
  }

  // Crewmate Classico Vivo
  return (
    <div className={`relative inline-block ${dim} ${className}`}>
      <svg viewBox="0 0 100 120" className="h-full w-full drop-shadow-[2px_3px_0px_rgba(0,0,0,0.9)]">
        {/* Zainetto (Backpack) sul retro a sinistra */}
        <path
          d="M 22 36 C 10 36, 10 52, 10 72 C 10 90, 12 94, 24 94 Z"
          fill={color}
          stroke="#000"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />
        <path
          d="M 12 70 C 12 90, 14 94, 24 94 L 24 78 Z"
          fill="rgba(0,0,0,0.25)"
        />

        {/* Corpo Principale a fagiolo/capsula */}
        <path
          d="M 54 12 C 30 12, 22 28, 22 60 C 22 84, 22 96, 22 108 C 22 114, 38 114, 38 108 L 38 98 C 44 98, 54 98, 60 98 L 60 108 C 60 114, 76 114, 76 108 C 76 96, 82 82, 82 60 C 82 28, 76 12, 54 12 Z"
          fill={color}
          stroke="#000"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />

        {/* Ombreggiatura inferiore del corpo per volume 3D cartoon */}
        <path
          d="M 25 78 C 30 96, 68 96, 80 78 C 82 88, 76 102, 76 108 C 76 114, 60 114, 60 108 L 60 98 C 54 98, 44 98, 38 98 L 38 108 C 38 114, 22 114, 22 108 C 22 98, 24 88, 25 78 Z"
          fill="rgba(0,0,0,0.28)"
        />

        {/* Spazio tra le gambe con bordo nero */}
        <path
          d="M 38 98 L 60 98"
          stroke="#000"
          strokeWidth="5"
        />

        {/* Visore Ovale a capsula orizzontale */}
        <path
          d="M 52 28 C 76 28, 92 34, 92 46 C 92 58, 76 64, 52 64 C 40 64, 38 58, 38 46 C 38 34, 40 28, 52 28 Z"
          fill="#38bdf8"
          stroke="#000"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />

        {/* Gradiente azzurro chiaro / bianco visore */}
        <path
          d="M 50 32 C 72 32, 86 36, 88 44 C 88 47, 80 50, 60 50 C 44 50, 42 44, 42 40 C 42 34, 44 32, 50 32 Z"
          fill="#e0f2fe"
        />

        {/* Pillola bianca di riflesso luce specchiata (iconica Among Us) */}
        <ellipse cx="64" cy="37" rx="15" ry="4" fill="#ffffff" />
      </svg>
    </div>
  );
}
