interface AutoScrollProps {
  running: boolean;
  speed: number;
  onStart: () => void;
  onPause: () => void;
  onSlower: () => void;
  onFaster: () => void;
}

export function AutoScroll({
  running,
  speed,
  onStart,
  onPause,
  onSlower,
  onFaster,
}: AutoScrollProps) {
  return (
    <div className="rounded-2xl border border-stage-border bg-stage-raised px-4 py-3">
      <p className="mb-2 text-center text-xs font-semibold tracking-widest text-mute">
        AUTO-SCROLL
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onSlower}
          aria-label="Diminuir velocidade"
          className="min-h-12 min-w-12 rounded-xl bg-stage-elevated text-xl font-bold text-gold"
        >
          −
        </button>
        <span className="min-w-24 text-center text-sm text-mute">velocidade {speed}</span>
        <button
          type="button"
          onClick={onFaster}
          aria-label="Aumentar velocidade"
          className="min-h-12 min-w-12 rounded-xl bg-stage-elevated text-xl font-bold text-gold"
        >
          +
        </button>
        <button
          type="button"
          onClick={running ? onPause : onStart}
          className="min-h-12 min-w-24 rounded-xl bg-gold px-3 font-semibold text-stage"
        >
          {running ? '⏸ Pausar' : '▶ Iniciar'}
        </button>
      </div>
    </div>
  );
}
