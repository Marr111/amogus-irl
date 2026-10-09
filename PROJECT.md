# Nome & Descrizione del Progetto
**Amogus IRL** - Progressive Web App (PWA) mobile-first che ricrea fedelmente l'esperienza di Among Us per partite dal vivo con smartphone. Include interazioni fisiche (QR code, compiti reali), ruoli multipli con abilità attive, audio sintetizzato ed espulsioni cinematiche nello spazio profondo.

# Livello dell'Utente & Preferenze
- Sviluppo frontend moderno mobile-first con grafica comic cartoon Among Us (bordi neri spessi, pulsantone rosso d'emergenza, barra verde task).
- Architettura a singola sala d'attesa unificata: nessun codice stanza da digitare, accesso diretto alle persone in attesa.
- Suite completa di 8 ruoli: Crewmate, Impostore, Scienziato (Vitals), Sceriffo (Colpo a segno/errore), Ingegnere (Condotti), Giullare (Vittoria su espulsione), Doomsayer (Profeta) e Angelo Custode (Scudo).
- Audio dinamico Web Audio API e integrazione con Ollama locale (Llama 3) per indizi e dialoghi.

# Visione Generale & Obiettivi Principali
- Supportare streaming dal vivo fluido e senza attriti per i giocatori.
- Gestione ciclo: Selezione Nome/Colore/Ruolo -> Persone in Attesa -> Partita (Task & Abilità speciali) -> Emergency Meeting -> Espulsione stellare.

# Stack Tecnologico & Struttura
- **Framework & Bundler**: React 18 con Vite
- **Styling**: Tailwind CSS con palette e styling cartoon Among Us
- **Ruoli & Abilità**: `src/utils/roles.js` (8 ruoli dettagliati)
- **Audio & AI**: Web Audio API nativo (`src/utils/audio.js`) e Ollama client (`src/utils/ollama.js`)
- **State Management**: Zustand mock store (`src/store/useGameStore.js`)
