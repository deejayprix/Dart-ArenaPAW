import GameConfig from '../GameConfig';
import { useState } from 'react';

export default function GameConfigExample() {
  const [config, setConfig] = useState({
    gameMode: "501" as "501" | "301" | "701" | "around_the_clock",
    startingScore: "501" as "501" | "301" | "701",
    numberOfLegs: 2,
    numberOfSets: 1,
    inMode: "standard" as "standard" | "double" | "master",
    outMode: "standard" as "standard" | "double" | "master",
  });

  return (
    <GameConfig
      gameMode={config.gameMode}
      startingScore={config.startingScore}
      numberOfLegs={config.numberOfLegs}
      numberOfSets={config.numberOfSets}
      inMode={config.inMode}
      outMode={config.outMode}
      onGameModeChange={(mode) => setConfig({ ...config, gameMode: mode, startingScore: mode !== "around_the_clock" ? mode : "501" })}
      onStartingScoreChange={(score) => setConfig({ ...config, startingScore: score })}
      onNumberOfLegsChange={(legs) => setConfig({ ...config, numberOfLegs: legs })}
      onNumberOfSetsChange={(sets) => setConfig({ ...config, numberOfSets: sets })}
      onInModeChange={(mode) => setConfig({ ...config, inMode: mode })}
      onOutModeChange={(mode) => setConfig({ ...config, outMode: mode })}
    />
  );
}
