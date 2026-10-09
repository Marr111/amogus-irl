import { create } from 'zustand';
import { SoundFX } from '../utils/audio';

// Colori ufficiali Among Us
export const AMONGUS_COLORS = [
  { id: 'red', name: 'Rosso', hex: '#c51111', text: 'white' },
  { id: 'blue', name: 'Blu', hex: '#132ed1', text: 'white' },
  { id: 'green', name: 'Verde', hex: '#117f2d', text: 'white' },
  { id: 'pink', name: 'Rosa', hex: '#ed54ba', text: 'white' },
  { id: 'orange', name: 'Arancione', hex: '#ef7d0d', text: 'white' },
  { id: 'yellow', name: 'Giallo', hex: '#f5f557', text: 'black' },
  { id: 'cyan', name: 'Ciano', hex: '#38fedc', text: 'black' },
  { id: 'purple', name: 'Viola', hex: '#6b2fbb', text: 'white' },
  { id: 'lime', name: 'Lime', hex: '#50ef39', text: 'black' },
  { id: 'white', name: 'Bianco', hex: '#d6e0f0', text: 'black' },
];

const INITIAL_PLAYERS = [
  { id: '1', nome: 'Tu (Comandante)', colore: '#38fedc', ruolo: 'Crewmate', vivo: true, votiRicevuti: 0, alibi: '' },
  { id: '2', nome: 'Rosso', colore: '#c51111', ruolo: 'Impostor', vivo: true, votiRicevuti: 0, alibi: '' },
  { id: '3', nome: 'Verde', colore: '#117f2d', ruolo: 'Crewmate', vivo: true, votiRicevuti: 0, alibi: '' },
  { id: '4', nome: 'Viola', colore: '#6b2fbb', ruolo: 'Crewmate', vivo: true, votiRicevuti: 0, alibi: '' },
  { id: '5', nome: 'Giallo', colore: '#f5f557', ruolo: 'Crewmate', vivo: true, votiRicevuti: 0, alibi: '' },
  { id: '6', nome: 'Arancio', colore: '#ef7d0d', ruolo: 'Crewmate', vivo: true, votiRicevuti: 0, alibi: '' },
];

const INITIAL_TASKS = [
  { id: 't-1', titolo: 'Fili Elettrici: Ricollega Circuiti', zona: 'Elettrico (Stanza 1)', tipo: 'Elettrico', completata: false, durataSec: 3 },
  { id: 't-2', titolo: 'Scansiona QR Filtro O2', zona: 'O2 (Corridoio)', tipo: 'Fisico IRL', completata: false, durataSec: 2 },
  { id: 't-3', titolo: 'Scarica Dati Terminale', zona: 'Ponte Comandi (Tavolo)', tipo: 'Download', completata: false, durataSec: 4 },
  { id: 't-4', titolo: 'Svuota Condotto Rifiuti', zona: 'Magazzino (Cestino)', tipo: 'Manuale', completata: false, durataSec: 3 },
  { id: 't-5', titolo: 'Calibra Distributore Carburante', zona: 'Motori (Ingresso)', tipo: 'Carburante', completata: false, durataSec: 4 },
];

export const useGameStore = create((set, get) => ({
  // Fasi: 'JOIN' | 'LOBBY' | 'IN_GIOCO' | 'MEETING' | 'EJECTION'
  faseGioco: 'JOIN',

  // Audio sintetizzato
  isMuted: false,
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),

  // Giocatore corrente
  giocatoreCorrente: {
    id: '1',
    nome: '',
    ruolo: 'Crewmate', // 'Crewmate' | 'Impostor'
    vitale: 'vivo',    // 'vivo' | 'morto'
    colore: '#38fedc',
  },

  codiceStanza: 'SKELD-99',
  giocatori: INITIAL_PLAYERS,
  tasks: INITIAL_TASKS,

  // Info Meeting
  meetingInfo: {
    chiamaDa: null,
    motivo: 'Pulsante d\'emergenza',
    tempoRimanente: 60,
    mioVoto: null,
    ultimoEspulso: null,
  },

  // Dati schermata espulsione stellare
  ejectionInfo: null, // { nome, colore, wasImpostor, impostorsRimasti, testo }

  // Cambia colore giocatore
  setColoreGiocatore: (hex) => {
    set((state) => ({
      giocatoreCorrente: { ...state.giocatoreCorrente, colore: hex },
      giocatori: state.giocatori.map((p) => (p.id === '1' ? { ...p, colore: hex } : p)),
    }));
  },

  // Imposta nome
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

  entraInLobby: () => {
    const nomeAttuale = get().giocatoreCorrente.nome;
    if (!nomeAttuale) get().setNomeGiocatore('Astronauta');
    SoundFX.playButtonPop(get().isMuted);
    set({ faseGioco: 'LOBBY' });
  },

  avviaPartita: () => {
    SoundFX.playButtonPop(get().isMuted);
    set({ faseGioco: 'IN_GIOCO' });
  },

  completaTask: (taskId) => {
    SoundFX.playTaskComplete(get().isMuted);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, completata: true } : t)),
    }));
  },

  chiamaMeeting: (chiamaDa = 'Tu', motivo = 'Pulsante d\'emergenza premuto!') => {
    SoundFX.playEmergencyAlarm(get().isMuted);
    set((state) => ({
      faseGioco: 'MEETING',
      meetingInfo: {
        chiamaDa,
        motivo,
        tempoRimanente: 60,
        mioVoto: null,
        ultimoEspulso: null,
      },
      giocatori: state.giocatori.map((p) => ({ ...p, votiRicevuti: 0, alibi: '' })),
    }));
  },

  setBotAlibi: (playerId, alibiText) => {
    set((state) => ({
      giocatori: state.giocatori.map((p) =>
        p.id === playerId ? { ...p, alibi: alibiText } : p
      ),
    }));
  },

  votaGiocatore: (targetId) => {
    const state = get();
    if (state.meetingInfo.mioVoto) return;

    SoundFX.playVoteCast(state.isMuted);

    set((s) => {
      const updatedGiocatori = s.giocatori.map((p) => {
        let voti = p.id === targetId ? 1 : 0;
        // Bot random votes
        if (p.vivo && Math.random() > 0.5) {
          voti += Math.floor(Math.random() * 2) + 1;
        }
        return { ...p, votiRicevuti: p.votiRicevuti + voti };
      });

      return {
        giocatori: updatedGiocatori,
        meetingInfo: { ...s.meetingInfo, mioVoto: targetId || 'SKIP' },
      };
    });
  },

  concludiMeeting: () => {
    const { giocatori, giocatoreCorrente, isMuted } = get();
    SoundFX.playEjectionSound(isMuted);

    let piuVotato = null;
    let maxVoti = 0;

    giocatori.forEach((g) => {
      if (g.votiRicevuti > maxVoti) {
        maxVoti = g.votiRicevuti;
        piuVotato = g;
      }
    });

    const espulso = piuVotato && maxVoti > 1 ? piuVotato : null;
    const wasImpostor = espulso?.ruolo === 'Impostor';
    const remainingImpostors = giocatori.filter(
      (g) => g.ruolo === 'Impostor' && g.id !== espulso?.id && g.vivo
    ).length;

    let testoEspulsione = 'Nessuno è stato espulso. (Pareggio o Voto Saltato)';
    if (espulso) {
      testoEspulsione = wasImpostor
        ? `${espulso.nome} era un Impostore.`
        : `${espulso.nome} non era un Impostore.`;
    }

    set((state) => ({
      faseGioco: 'EJECTION',
      ejectionInfo: {
        nome: espulso ? espulso.nome : null,
        colore: espulso ? espulso.colore : null,
        wasImpostor,
        impostorsRimasti: remainingImpostors,
        testo: testoEspulsione,
      },
      giocatori: state.giocatori.map((p) =>
        espulso && p.id === espulso.id ? { ...p, vivo: false } : p
      ),
      giocatoreCorrente:
        espulso && espulso.id === giocatoreCorrente.id
          ? { ...giocatoreCorrente, vitale: 'morto' }
          : giocatoreCorrente,
    }));
  },

  fineEspulsione: () => {
    set({ faseGioco: 'IN_GIOCO', ejectionInfo: null });
  },

  toggleRuolo: () => {
    set((state) => {
      const nuovoRuolo = state.giocatoreCorrente.ruolo === 'Crewmate' ? 'Impostor' : 'Crewmate';
      return {
        giocatoreCorrente: { ...state.giocatoreCorrente, ruolo: nuovoRuolo },
        giocatori: state.giocatori.map((p) => (p.id === '1' ? { ...p, ruolo: nuovoRuolo } : p)),
      };
    });
  },

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

  resetPartita: () => {
    set({
      faseGioco: 'JOIN',
      giocatori: INITIAL_PLAYERS,
      tasks: INITIAL_TASKS,
      giocatoreCorrente: { id: '1', nome: '', ruolo: 'Crewmate', vitale: 'vivo', colore: '#38fedc' },
      meetingInfo: { chiamaDa: null, motivo: '', tempoRimanente: 60, mioVoto: null, ultimoEspulso: null },
      ejectionInfo: null,
    });
  },
}));
