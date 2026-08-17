import { keysEqual } from '@/services/transpose';

interface KeySelectorProps {
  originalKey: string;
  currentKey: string;
  onUp: () => void;
  onDown: () => void;
  onRestore: () => void;
  large?: boolean;
}

export function KeySelector({
  originalKey,
  currentKey,
  onUp,
  onDown,
  onRestore,
  large = false,
}: KeySelectorProps) {
  const changed = !keysEqual(originalKey, currentKey);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={onDown}
          aria-label="Diminuir tom"
          className={`rounded-2xl bg-stage-elevated font-bold text-gold ${large ? 'min-h-16 min-w-16 text-3xl' : 'min-h-14 min-w-14 text-2xl'}`}
        >
          −
        </button>
        <div className="min-w-20 text-center">
          <p className={`font-bold text-gold ${large ? 'text-4xl' : 'text-3xl'}`}>{currentKey}</p>
          <p className="text-xs text-mute">Tom atual</p>
        </div>
        <button
          type="button"
          onClick={onUp}
          aria-label="Aumentar tom"
          className={`rounded-2xl bg-stage-elevated font-bold text-gold ${large ? 'min-h-16 min-w-16 text-3xl' : 'min-h-14 min-w-14 text-2xl'}`}
        >
          +
        </button>
      </div>
      {changed ? (
        <button
          type="button"
          onClick={onRestore}
          className="mx-auto block min-h-11 text-sm font-medium text-gold"
        >
          Restaurar tom original ({originalKey})
        </button>
      ) : (
        <p className="text-center text-sm text-mute">Tom original: {originalKey}</p>
      )}
    </div>
  );
}
