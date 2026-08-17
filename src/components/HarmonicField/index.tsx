import { getHarmonicField } from '@/services/harmony';

interface HarmonicFieldViewProps {
  musicalKey: string;
  compact?: boolean;
}

export function HarmonicFieldView({ musicalKey, compact = false }: HarmonicFieldViewProps) {
  let field;
  try {
    field = getHarmonicField(musicalKey);
  } catch {
    return null;
  }

  return (
    <div aria-label={`Campo harmônico de ${field.label}`}>
      <p className="mb-2 text-center text-[0.65rem] font-semibold tracking-[0.18em] text-mute">
        CAMPO HARMÔNICO · {field.minor ? 'MENOR' : 'MAIOR'}
      </p>
      <div className="grid grid-cols-7 gap-1">
        {field.chords.map((chord) => (
          <div
            key={chord.degree}
            className={`flex min-h-12 flex-col items-center justify-center rounded-lg px-0.5 text-center ${
              chord.primary
                ? 'bg-field text-ink'
                : 'bg-stage-elevated text-ink'
            }`}
          >
            <span className={`font-medium text-mute ${compact ? 'text-[0.55rem]' : 'text-[0.6rem]'}`}>
              {chord.degree}
            </span>
            <span
              className={`font-bold leading-tight ${compact ? 'text-[0.7rem]' : 'text-[0.8rem]'}`}
            >
              {chord.symbol}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
