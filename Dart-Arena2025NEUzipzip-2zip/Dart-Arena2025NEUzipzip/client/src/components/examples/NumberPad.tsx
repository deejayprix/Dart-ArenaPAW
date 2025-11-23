import NumberPad from '../NumberPad';
import { useState } from 'react';

export default function NumberPadExample() {
  const [isDoubleMode, setIsDoubleMode] = useState(false);
  const [isTripleMode, setIsTripleMode] = useState(false);

  return (
    <NumberPad
      onNumberClick={(num) => console.log('Number clicked:', num)}
      onDoubleClick={() => setIsDoubleMode(!isDoubleMode)}
      onTripleClick={() => setIsTripleMode(!isTripleMode)}
      onUndoClick={() => console.log('Undo clicked')}
      isDoubleMode={isDoubleMode}
      isTripleMode={isTripleMode}
    />
  );
}
