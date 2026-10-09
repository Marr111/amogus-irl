# Nome & Descrizione del Progetto
**Amogus IRL** - Progressive Web App (PWA) mobile-first che ricrea l'esperienza originale di Among Us per partite dal vivo su smartphone, integrando interazioni fisiche (QR code, sabotaggi reali) e logiche digitali (task, meeting d'emergenza, votazioni ed espulsioni nello spazio profondo).

# Livello dell'Utente & Preferenze
- Sviluppo frontend avanzato, codice modulare e orientato alla diretta streaming.
- Stile grafico Among Us cartoon fedele (personaggi fagiolo con visore, bordi neri spessi, pulsantone rosso della cafeteria, barra verde Total Tasks).
- Audio dinamico sintetizzato via Web Audio API (zero asset MP3 esterni).
- Intelligenza Artificiale locale integrata (Ollama / Llama 3) per generare indizi, log di bordo e alibi dei bot senza dipendenze cloud.

# Visione Generale & Obiettivi Principali
- Rendere l'app giocabile da browser mobile senza installazione nativa, con layout fisso anti-scroll.
- Supportare il ciclo completo: Join -> Lobby -> In Gioco (task interattive) -> Emergency Meeting -> Votazione con alibi bot -> Espulsione cinematica nello spazio.
- Modalità 100% offline-ready e resiliente per streaming dal vivo con fallback procedurale istantaneo se l'LLM locale non risponde entro timeout.

# Stack Tecnologico & Struttura
- **Framework & Bundler**: React 18 con Vite
- **Styling**: Tailwind CSS con palette ufficiale Among Us e ombre comic thick-border
- **Audio**: Web Audio API Synthesizer nativo (`src/utils/audio.js`)
- **AI Locale**: Ollama API client (`src/utils/ollama.js` su `localhost:11434` con modello `llama3:latest`)
- **Animazioni**: Framer Motion per transizioni di fase ed espulsione cinematica nello spazio
- **State Management**: Zustand mock store reattivo (`src/store/useGameStore.js`)
