import { KeySelector } from '@/components/KeySelector';
import { SongNavigation } from '@/components/SongNavigation';
import { AutoScroll } from '@/components/AutoScroll';

interface ShowControlsProps {
  originalKey: string;
  currentKey: string;
  onUp: () => void;
  onDown: () => void;
  onRestore: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  autoScroll: {
    running: boolean;
    speed: number;
    onStart: () => void;
    onPause: () => void;
    onSlower: () => void;
    onFaster: () => void;
  };
}

export function ShowControls({
  originalKey,
  currentKey,
  onUp,
  onDown,
  onRestore,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  autoScroll,
}: ShowControlsProps) {
  return (
    <div className="space-y-3">
      <KeySelector
        originalKey={originalKey}
        currentKey={currentKey}
        onUp={onUp}
        onDown={onDown}
        onRestore={onRestore}
        large
      />
      <AutoScroll {...autoScroll} />
      <SongNavigation onPrev={onPrev} onNext={onNext} hasPrev={hasPrev} hasNext={hasNext} />
    </div>
  );
}
