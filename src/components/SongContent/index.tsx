import type { Song } from '@/domain';

export function SongContent({ song, large = false }: { song: Song; large?: boolean }) {
  const content = [song.chords, song.lyrics].filter(Boolean).join('\n\n');

  if (!content) {
    return (
      <div className="rounded-2xl border border-dashed border-stage-border px-4 py-10 text-center text-mute">
        Nenhuma cifra cadastrada.
      </div>
    );
  }

  return (
    <pre
      className={`overflow-x-auto whitespace-pre-wrap rounded-2xl bg-stage-raised p-4 font-sans leading-relaxed ${
        large ? 'text-2xl leading-loose' : 'text-lg'
      }`}
    >
      {content}
    </pre>
  );
}
