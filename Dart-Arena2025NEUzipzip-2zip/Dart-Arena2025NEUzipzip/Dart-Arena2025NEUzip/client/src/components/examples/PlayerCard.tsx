import PlayerCard from '../PlayerCard';

export default function PlayerCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PlayerCard
        name="Spieler 1"
        score={301}
        throws={[60, 45, 80]}
        currentThrowScores={[20, 20]}
        legs={1}
        sets={0}
        average={61.67}
        isActive={true}
        hasStarted={true}
      />
      <PlayerCard
        name="Spieler 2"
        score={501}
        throws={[]}
        currentThrowScores={[]}
        legs={0}
        sets={0}
        average={0}
        isActive={false}
        hasStarted={false}
      />
    </div>
  );
}
