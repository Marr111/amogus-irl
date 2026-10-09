// Integrazione Ollama (Llama 3 locale su questo PC) con fallback procedurale offline

const OLLAMA_DEFAULT_URL = 'http://localhost:11434';
const OLLAMA_MODEL = 'llama3:latest';

// Template di riserva istantanei se Ollama è offline o non raggiungibile da mobile
const FALLBACK_ALIBIS = [
  'Ero in Elettrico a sistemare i fili e le luci si sono spente!',
  'Stavo facendo lo scan in MedBay, qualcuno mi ha visto?',
  'Ero in Sala Macchine con Verde, possiamo confermarci a vicenda!',
  'Ho visto qualcuno scappare verso lo sfiato vicino alle comunicazioni!',
  'Stavo buttando la spazzatura in Magazzino, ho sentito solo l\'allarme.',
  'Ero al Ponte di Comando a caricare i dati della navetta!',
  'Non guardate me! Ho passato tutto il tempo a calibrare il distributore.',
  'Ho appena finito la task dei reattori, sono pulito!',
];

const FALLBACK_CLUES = [
  'Sensore di movimento: rilevato passaggio rapido nel corridoio est 20s fa.',
  'Camera di sicurezza: un membro con tuta scura è entrato nei condotti.',
  'Log di bordo: calo di tensione anomalo rilevato vicino ai reattori.',
  'Filtro O2 intasato: tracce di manomissione manuale individuate.',
  'Sensore termico: battito cardiaco anomalo registrato nei pressi della serra.',
];

/**
 * Invia prompt a Ollama locale su questo PC
 */
async function callOllama(prompt, systemPrompt = '') {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout max per non bloccare la diretta

  // Prova endpoint proxy locale di Vite oppure localhost diretto
  const endpoints = ['/api/ollama/api/generate', `${OLLAMA_DEFAULT_URL}/api/generate`];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt,
          system: systemPrompt || 'Sei un assistente per un gioco stile Among Us. Rispondi SEMPRE in italiano, in modo conciso (max 15 parole), divertente e a tema spaziale.',
          stream: false,
          options: {
            temperature: 0.8,
            num_predict: 50,
          },
        }),
      });

      if (res.ok) {
        clearTimeout(timeoutId);
        const data = await res.json();
        if (data.response && data.response.trim()) {
          return data.response.trim().replace(/^["']|["']$/g, '');
        }
      }
    } catch (e) {
      // Continua al prossimo endpoint o al fallback
    }
  }

  clearTimeout(timeoutId);
  throw new Error('Ollama non raggiungibile');
}

export const OllamaService = {
  /**
   * Verifica se il server Ollama locale è attivo e pronto
   */
  checkStatus: async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('/api/ollama/api/tags', { signal: controller.signal }).catch(() =>
        fetch(`${OLLAMA_DEFAULT_URL}/api/tags`, { signal: controller.signal })
      );
      clearTimeout(timeout);
      if (res && res.ok) {
        const data = await res.json();
        const hasLlama3 = data.models?.some((m) => m.name.includes('llama3'));
        return { online: true, models: data.models?.map((m) => m.name), hasLlama3 };
      }
    } catch {
      // offline
    }
    return { online: false, models: [], hasLlama3: false };
  },

  /**
   * Genera alibi per un compagno di equipaggio durante il meeting
   */
  generateAlibi: async (playerName, color, zone = 'Reattori') => {
    try {
      const prompt = `Sei ${playerName} (colore ${color}) in una riunione d'emergenza in Among Us. Dì dove ti trovavi (es. ${zone}) e perché non sei tu l'impostore. Massimo 12 parole in italiano.`;
      const reply = await callOllama(prompt);
      return reply;
    } catch {
      // Fallback casuale garantito per non bloccare mai la live
      const random = FALLBACK_ALIBIS[Math.floor(Math.random() * FALLBACK_ALIBIS.length)];
      return random;
    }
  },

  /**
   * Genera indizio procedurale per terminale scanner o log di bordo
   */
  generateClue: async (location = 'Navetta') => {
    try {
      const prompt = `Genera un breve indizio tecnico per l'equipaggio in Among Us su un sabotaggio o evento vicino a: ${location}. Massimo 14 parole in italiano.`;
      const reply = await callOllama(prompt);
      return reply;
    } catch {
      const random = FALLBACK_CLUES[Math.floor(Math.random() * FALLBACK_CLUES.length)];
      return random;
    }
  },
};
