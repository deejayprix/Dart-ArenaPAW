import PlayerSetup from '../PlayerSetup';
import { useState } from 'react';

export default function PlayerSetupExample() {
  const [players, setPlayers] = useState([
    { id: '1', name: 'Spieler 1' },
    { id: '2', name: 'Spieler 2' },
  ]);

  return <PlayerSetup players={players} onPlayersChange={setPlayers} />;
}
