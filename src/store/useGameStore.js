import { create } from 'zustand';
import { SoundFX } from '../utils/audio';
import { ALL_ROLES } from '../utils/roles';

// Colori ufficiali Among Us
export const AMONGUS_COLORS = [
  { id: 'cyan', name: 'Ciano', hex: '#38fedc', text: 'black' },
  { id: 'red', name: 'Rosso', hex: '#c51111', text: 'white' },
  { id: 'blue', name: 'Blu', hex: '#132ed1', text: 'white' },
  { id: 'green', name: 'Verde', hex: '#117f2d', text: 'white' },
  { id: 'pink', name: 'Rosa', hex: '#ed54ba', text: 'white' },
  { id: 'orange', name: 'Arancione', hex: '#ef7d0d', text: 'white' },
  { id: 'yellow', name: 'Giallo', hex: '#f5f557', text: 'black' },
  { id: 'purple', name: 'Viola', hex: '#6b2fbb', text: 'white' },
  { id: 'lime', name: 'Lime', hex: '#50ef39', text: 'black' },
  { id: 'white', name: 'Bianco', hex: '#d6e0f0', text: 'black' },
];

const INITIAL_PLAYERS = [
  { id: '1', nome: 'Tu (Comandante)', colore: '#38fedc', ruolo: 'Scientist', vivo: true, protetto: false, votiRicevuti: 0, alibi: '' },
  { id: '2', nome: 'Rosso', colore: '#c51111', ruolo: 'Impostor', vivo: true, protetto: false, votiRicevuti: 0, alibi: '' },
  { id: '3', nome: 'Verde', colore: '#117f2d', ruolo: 'Engineer', vivo: true, protetto: false, votiRicevuti: 0, alibi: '' },
  { id: '4', nome: 'Viola', colore: '#6b2fbb', ruolo: 'Jester', vivo: true, protetto: false, votiRicevuti: 0, alibi: '' },
  { id: '5', nome: 'Giallo', colore: '#f5f557', ruolo: 'Sheriff', vivo: true, protetto: false, votiRicevuti: 0, alibi: '' },
  { id: '6', nome: 'Arancio', colore: '#ef7d0d', ruolo: 'Doomsayer', vivo: true, protetto: false, votiRicevuti: 0, alibi: '' },
  { id: '7', nome: 'Rosa', colore: '#ed54ba', ruolo: 'Crewmate', vivo: true, protetto: false, votiRicevuti: 0, alibi: '' },
  { id: '8', nome: 'Blu', colore: '#132ed1', ruolo: 'Crewmate', vivo: true, protetto: false, votiRicevuti: 0, alibi: '' },
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
    ruolo: 'Scientist', // Crewmate, Impostor, Scientist, Sheriff, Engineer, Jester, Doomsayer, GuardianAngel
    vitale: 'vivo',    // 'vivo' | 'morto'
    colore: '#38fedc',
    protetto: false,
  },

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
  ejectionInfo: null, // { nome, colore, wasImpostor, wasJester, impostorsRimasti, testo }

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

  // Imposta direttamente uno qualsiasi degli 8 ruoli
  setRuoloGiocatore: (ruoloKey) => {
    const roleObj = ALL_ROLES[ruoloKey];
    if (!roleObj) return;
    set((state) => ({
      giocatoreCorrente: { ...state.giocatoreCorrente, ruolo: ruoloKey },
      giocatori: state.giocatori.map((p) => (p.id === '1' ? { ...p, ruolo: ruoloKey } : p)),
    }));
  },

  // Passa alla schermata di attesa (unica per tutti)
  entraInLobby: () => {
    const nomeAttuale = get().giocatoreCorrente.nome;
    if (!nomeAttuale) get().setNomeGiocatore('Astronauta');
    SoundFX.playButtonPop(get().isMuted);
    set({ faseGioco: 'LOBBY' });
  },

  // Avvio partita
  avviaPartita: () => {
    SoundFX.playButtonPop(get().isMuted);
    set({ faseGioco: 'IN_GIOCO' });
  },

  // Task completata
  completaTask: (taskId) => {
    SoundFX.playTaskComplete(get().isMuted);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, completata: true } : t)),
    }));
  },

  // Chiama Emergency Meeting
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

  // Voto al meeting
  votaGiocatore: (targetId) => {
    const state = get();
    if (state.meetingInfo.mioVoto) return;

    SoundFX.playVoteCast(state.isMuted);

    set((s) => {
      const updatedGiocatori = s.giocatori.map((p) => {
        let voti = p.id === targetId ? 1 : 0;
        if (p.vivo && Math.random() > 0.45) {
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

  // Azione Sceriffo: spara a un sospetto
  sparoSceriffo: (targetId) => {
    const { giocatori, giocatoreCorrente, isMuted } = get();
    const bersaglio = giocatori.find((p) => p.id === targetId);
    if (!bersaglio || !bersaglio.vivo) return;

    SoundFX.playSabotageAlert(isMuted);

    if (bersaglio.ruolo === 'Impostor') {
      // Ha eliminato l'impostore! Bersaglio muore.
      alert(`🎯 Colpo a segno! ${bersaglio.nome} era un IMPOSTORE ed è stato eliminato!`);
      set((s) => ({
        giocatori: s.giocatori.map((p) => (p.id === targetId ? { ...p, vivo: false } : p)),
      }));
    } else {
      // Fuoco amico su innocente: muore lo Sceriffo stesso!
      alert(`💥 Tragico errore! ${bersaglio.nome} era innocente (${bersaglio.ruolo})! Lo Sceriffo muore per senso di colpa.`);
      set((s) => ({
        giocatoreCorrente: { ...giocatoreCorrente, vitale: 'morto' },
        giocatori: s.giocatori.map((p) => (p.id === '1' ? { ...p, vivo: false } : p)),
      }));
    }
  },

  // Azione Angelo Custode: protegge un compagno vivo
  applicaScudoAngelo: (targetId) => {
    const { giocatori, isMuted } = get();
    SoundFX.playTaskComplete(isMuted);
    const target = giocatori.find((p) => p.id === targetId);
    alert(`🛡️ Scudo applicato a ${target ? target.nome : 'un compagno'} per questo turno!`);
    set((s) => ({
      giocatori: s.giocatori.map((p) => (p.id === targetId ? { ...p, protetto: true } : p)),
    }));
  },

  // Concludi votazione ed espelli
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
    const wasJester = espulso?.ruolo === 'Jester';

    const remainingImpostors = giocatori.filter(
      (g) => g.ruolo === 'Impostor' && g.id !== espulso?.id && g.vivo
    ).length;

    let testoEspulsione = 'Nessuno è stato espulso. (Pareggio o Skip)';
    if (espulso) {
      if (wasJester) {
        testoEspulsione = `🃏 ${espulso.nome} ERA IL GIULLARE! HA VINTO DA SOLO LA PARTITA!`;
      } else if (wasImpostor) {
        testoEspulsione = `${espulso.nome} era un Impostore.`;
      } else {
        testoEspulsione = `${espulso.nome} non era un Impostore.`;
      }
    }

    set((state) => ({
      faseGioco: 'EJECTION',
      ejectionInfo: {
        nome: espulso ? espulso.nome : null,
        colore: espulso ? espulso.colore : null,
        wasImpostor,
        wasJester,
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
      giocatoreCorrente: { id: '1', nome: '', ruolo: 'Scientist', vitale: 'vivo', colore: '#38fedc', protetto: false },
      meetingInfo: { chiamaDa: null, motivo: '', tempoRimanente: 60, mioVoto: null, ultimoEspulso: null },
      ejectionInfo: null,
    });
  },
}));
