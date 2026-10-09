import { create } from 'zustand';

const INITIAL_PLAYERS = [
  { id: '1', nome: 'Tu (Comandante)', colore: '#00f0ff', ruolo: 'Crewmate', vivo: true, votiRicevuti: 0 },
  { id: '2', nome: 'Rosso Sospetto', colore: '#ff2a5f', ruolo: 'Impostor', vivo: true, votiRicevuti: 0 },
  { id: '3', nome: 'Verde Botanico', colore: '#00ff88', ruolo: 'Crewmate', vivo: true, votiRicevuti: 0 },
  { id: '4', nome: 'Viola Scienziato', colore: '#b026ff', ruolo: 'Crewmate', vivo: true, votiRicevuti: 0 },
  { id: '5', nome: 'Giallo Elettrico', colore: '#ffe600', ruolo: 'Crewmate', vivo: true, votiRicevuti: 0 },
  { id: '6', nome: 'Arancio Meccanico', colore: '#fb923c', ruolo: 'Crewmate', vivo: true, votiRicevuti: 0 },
];

const INITIAL_TASKS = [
  {
    id: 't-1',
    titolo: 'Calibra Flusso Energetico',
    zona: 'Sala Motori (Stanza 1)',
    tipo: 'Elettrico',
    completata: false,
    durataSec: 3,
  },
  {
    id: 't-2',
    titolo: 'Scansiona QR Filtro O2',
    zona: 'Serra Botanica (Corridoio)',
    tipo: 'Fisica IRL',
    completata: false,
    durataSec: 2,
  },
  {
    id: 't-3',
    titolo: 'Scarica Dati Terminale',
    zona: 'Ponte di Comando (Tavolo)',
    tipo: 'Dati',
    completata: false,
    durataSec: 4,
  },
  {
    id: 't-4',
    titolo: 'Svuota Condotto Rifiuti',
    zona: 'Magazzino (Cestino)',
    tipo: 'Manuale',
    completata: false,
    durataSec: 3,
  },
  {
    id: 't-5',
    titolo: 'Allinea Antenna di Comunicazione',
    zona: 'Torretta Esterna (Finestra)',
    tipo: 'Segnale',
    completata: false,
    durataSec: 5,
  },
];

export const useGameStore = create((set, get) => ({
  // Fasi: 'JOIN' | 'LOBBY' | 'IN_GIOCO' | 'MEETING' | 'FINE_GIOCO'
  faseGioco: 'JOIN',

  // Giocatore corrente
  giocatoreCorrente: {
    id: '1',
    nome: '',
    ruolo: 'Crewmate', // 'Crewmate' | 'Impostor'
    vitale: 'vivo', // 'vivo' | 'morto'
    colore: '#00f0ff',
  },

  // Codice stanza fittizio
  codiceStanza: 'AMOGUS-77',

  // Lista giocatori fittizi
  giocatori: INITIAL_PLAYERS,

  // Tasks della partita
  tasks: INITIAL_TASKS,

  // Stato Meeting
  meetingInfo: {
    chiamaDa: null,
    motivo: 'Pulsante d\'emergenza',
    tempoRimanente: 60,
    mioVoto: null,
    ultimoEspulso: null,
  },

  // Imposta nome giocatore
  setNomeGiocatore: (nome) => {
    set((state) => ({
      giocatoreCorrente: {
        ...state.giocatoreCorrente,
        nome: nome.trim() || 'Crewmate-42',
      },
      giocatori: state.giocatori.map((p) =>
        p.id === '1' ? { ...p, nome: nome.trim() || 'Crewmate-42' } : p
      ),
    }));
  },

  // Entra nella Lobby
  entraInLobby: () => {
    const nomeAttuale = get().giocatoreCorrente.nome;
    if (!nomeAttuale) {
      get().setNomeGiocatore('Astronauta');
    }
    set({ faseGioco: 'LOBBY' });
  },

  // Avvia partita (da Lobby a In Gioco)
  avviaPartita: () => {
    set({ faseGioco: 'IN_GIOCO' });
  },

  // Completa una task
  completaTask: (taskId) => {
    set((state) => {
      const updatedTasks = state.tasks.map((t) =>
        t.id === taskId ? { ...t, completata: true } : t
      );
      return { tasks: updatedTasks };
    });
  },

  // Chiama Emergency Meeting
  chiamaMeeting: (chiamaDa = 'Tu', motivo = 'Pulsante d\'emergenza premuto!') => {
    set((state) => ({
      faseGioco: 'MEETING',
      meetingInfo: {
        chiamaDa,
        motivo,
        tempoRimanente: 60,
        mioVoto: null,
        ultimoEspulso: null,
      },
      // Resetta i voti per il nuovo meeting
      giocatori: state.giocatori.map((p) => ({ ...p, votiRicevuti: 0 })),
    }));
  },

  // Vota un giocatore durante il meeting
  votaGiocatore: (targetId) => {
    const state = get();
    if (state.meetingInfo.mioVoto) return; // Ha già votato

    set((s) => {
      // Simula anche qualche voto random dagli altri bot per realismo
      const updatedGiocatori = s.giocatori.map((p) => {
        let voti = p.id === targetId ? 1 : 0;
        // Assegna voti simulati casuali da altri giocatori
        if (p.vivo && Math.random() > 0.6) {
          voti += Math.floor(Math.random() * 2) + 1;
        }
        return { ...p, votiRicevuti: p.votiRicevuti + voti };
      });

      return {
        giocatori: updatedGiocatori,
        meetingInfo: {
          ...s.meetingInfo,
          mioVoto: targetId || 'SKIP',
        },
      };
    });
  },

  // Concludi votazione ed espelli
  concludiMeeting: () => {
    const { giocatori, giocatoreCorrente } = get();
    // Trova il più votato (diverso da skip)
    let piuVotato = null;
    let maxVoti = 0;

    giocatori.forEach((g) => {
      if (g.votiRicevuti > maxVoti) {
        maxVoti = g.votiRicevuti;
        piuVotato = g;
      }
    });

    let espulso = null;
    if (piuVotato && maxVoti > 1) {
      espulso = piuVotato;
    }

    set((state) => ({
      faseGioco: 'IN_GIOCO',
      giocatori: state.giocatori.map((p) =>
        espulso && p.id === espulso.id ? { ...p, vivo: false } : p
      ),
      giocatoreCorrente:
        espulso && espulso.id === giocatoreCorrente.id
          ? { ...giocatoreCorrente, vitale: 'morto' }
          : giocatoreCorrente,
      meetingInfo: {
        ...state.meetingInfo,
        ultimoEspulso: espulso ? `${espulso.nome} è stato espulso nello spazio!` : 'Nessuno è stato espulso (Pareggio/Skip).',
      },
    }));
  },

  // Switch Ruolo per testing (Crewmate / Impostor)
  toggleRuolo: () => {
    set((state) => {
      const nuovoRuolo = state.giocatoreCorrente.ruolo === 'Crewmate' ? 'Impostor' : 'Crewmate';
      return {
        giocatoreCorrente: { ...state.giocatoreCorrente, ruolo: nuovoRuolo },
        giocatori: state.giocatori.map((p) =>
          p.id === '1' ? { ...p, ruolo: nuovoRuolo } : p
        ),
      };
    });
  },

  // Switch Vitale per testing (Vivo / Morto)
  toggleVitale: () => {
    set((state) => {
      const nuovoStato = state.giocatoreCorrente.vitale === 'vivo' ? 'morto' : 'vivo';
      return {
        giocatoreCorrente: { ...state.giocatoreCorrente, vitale: nuovoStato },
        giocatori: state.giocatori.map((p) =>
          p.id === '1' ? { ...p, vivo: nuovoStato === 'vivo' } : p
        ),
      };
    });
  },

  // Reset completo partita
  resetPartita: () => {
    set({
      faseGioco: 'JOIN',
      giocatori: INITIAL_PLAYERS,
      tasks: INITIAL_TASKS,
      giocatoreCorrente: {
        id: '1',
        nome: '',
        ruolo: 'Crewmate',
        vitale: 'vivo',
        colore: '#00f0ff',
      },
      meetingInfo: {
        chiamaDa: null,
        motivo: 'Pulsante d\'emergenza',
        tempoRimanente: 60,
        mioVoto: null,
        ultimoEspulso: null,
      },
    });
  },
}));
