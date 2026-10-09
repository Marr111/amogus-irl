# Nome & Descrizione del Progetto
**Amogus IRL** - Progressive Web App (PWA) mobile-first per un gioco dal vivo in stile Among Us. Combina interazioni fisiche (QR code, compiti reali) e digitali su smartphone (task interattive, meeting d'emergenza, votazioni e ruoli segreti).

# Livello dell'Utente & Preferenze
- Sviluppo frontend moderno, codice modulare e pulito.
- Approccio mobile-first: simulazione viewport smartphone su desktop, nessun scroll indesiderato, estetica sci-fi/spaziale nativa.
- Simulazione completa via mock state reattivo (Zustand), senza dipendenze immediate da database esterni.

# Visione Generale & Obiettivi Principali
- Creare un'esperienza PWA fluida, responsive e d'impatto visivo con animazioni neon e suoni/effetti visivi.
- Permettere la gestione completa del ciclo di gioco: Lobby -> In Gioco (task e sabotaggi) -> Meeting d'emergenza -> Votazione ed espulsione.
- Predisposizione per l'integrazione di intelligenza artificiale locale (Ollama / LLM) per compiti procedurali, indizi e narrazione dell'equipaggio offline.

# Stack Tecnologico & Struttura
- **Framework & Bundler**: React 18/19 con Vite
- **Styling**: Tailwind CSS con palette neon sci-fi (ciano, rosso allarme, verde terminale, sfondo `#0f172a`)
- **Animazioni & UI**: Framer Motion per transizioni di fase e allarmi meeting, Lucide React per la componentistica iconografica
- **State Management**: Zustand con mock store centrale (`useGameStore`)
- **Organizzazione**:
  - `src/components/`: Layout fisso mobile e componenti riutilizzabili
  - `src/screens/`: `JoinScreen`, `LobbyScreen`, `GameScreen`, `MeetingScreen`
  - `src/store/`: `useGameStore.js` con stato di giocatori, ruoli, task e meeting
