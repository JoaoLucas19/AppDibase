import type { Song } from '@/domain';
import { isChordToken, transposeChart } from '@/services/transpose';

interface SongContentProps {
  song: Song;
  large?: boolean;
  fontSize?: number;
}

function renderChordLine(line: string, highlight: boolean) {
  if (!highlight) return line;

  return line.split(/(\s+)/).map((part, index) => {
    if (/^\s+$/.test(part) || !part) return part;
    if (!isChordToken(part.replace(/[.,;:!?()[\]]+$/g, ''))) return part;
    return (
      <span key={`${part}-${String(index)}`} className="font-bold text-gold">
        {part}
      </span>
    );
  });
}

export function SongContent({ song, large = false, fontSize }: SongContentProps) {
  const chords = song.chords?.trim()
    ? transposeChart(song.chords, song.originalKey, song.currentKey)
    : '';
  const lyrics = song.lyrics?.trim() ?? '';
  const notes = song.notes?.trim() ?? '';

  if (!chords && !lyrics) {
    return (
      <div className="rounded-2xl border border-dashed border-stage-border px-4 py-10 text-center text-mute">
        Nenhuma cifra cadastrada.
      </div>
    );
  }

  const sizeClass = fontSize
    ? undefined
    : large
      ? 'text-2xl leading-loose'
      : 'text-lg';

  return (
    <div className="space-y-4">
      {chords ? (
        <pre
          style={fontSize ? { fontSize: `${String(fontSize)}px`, lineHeight: 1.55 } : undefined}
          className={`overflow-x-auto whitespace-pre-wrap rounded-2xl bg-stage-raised p-4 font-sans leading-relaxed ${sizeClass ?? ''}`}
        >
          {chords.split('\n').map((line, index, lines) => (
            <span key={`ch-${String(index)}`}>
              {renderChordLine(line, true)}
              {index < lines.length - 1 ? '\n' : null}
            </span>
          ))}
        </pre>
      ) : null}

      {lyrics ? (
        <pre
          style={fontSize ? { fontSize: `${String(Math.max(fontSize - 2, 16))}px`, lineHeight: 1.5 } : undefined}
          className={`overflow-x-auto whitespace-pre-wrap rounded-2xl bg-stage-raised p-4 font-sans leading-relaxed text-ink ${sizeClass ?? ''}`}
        >
          {lyrics}
        </pre>
      ) : null}

      {notes ? (
        <p className="rounded-2xl border border-stage-border px-4 py-3 text-sm text-mute">
          {notes}
        </p>
      ) : null}
    </div>
  );
}
