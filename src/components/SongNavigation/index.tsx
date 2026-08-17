interface SongNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  compact?: boolean;
}

export function SongNavigation({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  compact = false,
}: SongNavigationProps) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${compact ? '' : 'pt-2'}`}>
      <button
        type="button"
        onClick={onPrev}
        disabled={!hasPrev}
        className="min-h-14 rounded-2xl bg-stage-elevated text-base font-semibold disabled:opacity-35"
      >
        ◀ Anterior
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        className="min-h-14 rounded-2xl bg-gold text-base font-semibold text-stage disabled:opacity-35"
      >
        Próxima ▶
      </button>
    </div>
  );
}
