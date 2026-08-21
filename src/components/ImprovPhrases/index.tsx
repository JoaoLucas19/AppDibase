import { useState } from 'react';
import { getImprovGuide, getSongImprovCue, type ImprovPhrase } from '@/services/improv';

interface ImprovPhrasesProps {
  musicalKey: string;
  songTitle: string;
  customCue?: string | null;
  compact?: boolean;
}

function PhraseCard({ phrase, compact = false }: { phrase: ImprovPhrase; compact?: boolean }) {
  return (
    <article className={compact ? 'space-y-1' : 'space-y-2 rounded-2xl bg-stage-elevated px-4 py-3'}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className={`font-bold text-gold ${compact ? 'text-sm' : 'text-base'}`}>{phrase.title}</h3>
        <span className="text-xs font-semibold text-mute">{phrase.backing}</span>
      </div>
      <p className={`font-semibold tracking-wide text-ink ${compact ? 'text-lg' : 'text-xl'}`}>
        {phrase.notes}
      </p>
      {compact ? null : (
        <>
          <p className="text-sm text-mute">{phrase.when}</p>
          <p className="text-sm text-mute">{phrase.tip}</p>
        </>
      )}
    </article>
  );
}

export function ImprovPhrases({
  musicalKey,
  songTitle,
  customCue,
  compact = false,
}: ImprovPhrasesProps) {
  const guide = getImprovGuide(musicalKey);
  const cue = getSongImprovCue(songTitle, customCue);
  const [index, setIndex] = useState(0);

  if (!guide) return null;

  const phrase = guide.phrases[index % guide.phrases.length];
  if (!phrase) return null;

  if (compact) {
    return (
      <section className="rounded-2xl border border-gold/40 bg-stage-raised px-4 py-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-mute">GRACINHA</p>
          <button
            type="button"
            onClick={() => setIndex((value) => value + 1)}
            className="min-h-9 rounded-lg px-2 text-xs font-semibold text-gold"
          >
            Outra frase
          </button>
        </div>
        {cue ? <p className="mb-2 text-sm text-mute">{cue}</p> : null}
        <PhraseCard phrase={phrase} compact />
      </section>
    );
  }

  return (
    <section className="space-y-3 rounded-2xl border border-stage-border bg-stage-raised px-4 py-4">
      <p className="text-center text-[0.65rem] font-semibold tracking-[0.18em] text-mute">
        GRACINHA · IMPROVISO
      </p>
      <p className="text-center text-sm text-mute">
        {guide.scaleLabel} de {guide.keyLabel}
      </p>
      <p className="text-center text-lg font-semibold tracking-wide">{guide.scaleNotes}</p>
      <p className="text-center text-sm text-gold">{guide.cadence}</p>
      <p className="text-center text-xs tracking-widest text-mute">{guide.cadenceDegrees}</p>

      {cue ? (
        <p className="rounded-xl bg-stage-elevated px-3 py-3 text-sm leading-relaxed text-ink">
          {cue}
        </p>
      ) : (
        <p className="text-center text-sm text-mute">
          Na pausa da banda, use uma destas frases e feche no I.
        </p>
      )}

      <div className="space-y-3">
        {guide.phrases.map((item) => (
          <PhraseCard key={item.id} phrase={item} />
        ))}
      </div>
    </section>
  );
}
