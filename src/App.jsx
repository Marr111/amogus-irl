import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from './store/useGameStore';
import MobileFrame from './components/MobileFrame';
import HeaderBar from './components/HeaderBar';
import JoinScreen from './screens/JoinScreen';
import LobbyScreen from './screens/LobbyScreen';
import GameScreen from './screens/GameScreen';
import MeetingScreen from './screens/MeetingScreen';

export default function App() {
  const { faseGioco } = useGameStore();

  return (
    <MobileFrame>
      {/* Header visibile a partire dalla Lobby */}
      {faseGioco !== 'JOIN' && <HeaderBar />}

      {/* Switch delle schermate con animazioni Framer Motion */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {faseGioco === 'JOIN' && (
            <motion.div
              key="join"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.25 }}
              className="flex h-full flex-col"
            >
              <JoinScreen />
            </motion.div>
          )}

          {faseGioco === 'LOBBY' && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex h-full flex-col"
            >
              <LobbyScreen />
            </motion.div>
          )}

          {faseGioco === 'IN_GIOCO' && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex h-full flex-col"
            >
              <GameScreen />
            </motion.div>
          )}

          {faseGioco === 'MEETING' && (
            <motion.div
              key="meeting"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex h-full flex-col"
            >
              <MeetingScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileFrame>
  );
}
