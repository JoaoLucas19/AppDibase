import { Link } from 'react-router-dom';
import type { Song } from '@/domain';

interface SongCardProps {
  song: Song;
  href: string;
  order?: number;
  meta?: string;
}

export function SongCard({ song, href, order, meta }: SongCardProps) {
  return (
    <Link
      to={href}
      className="flex min-h-[4.25rem] items-center gap-3 rounded-2xl border border-stage-border bg-stage-raised px-4 py-3"
    >
      {order !== undefined ? (
        <span className="w-8 shrink-0 text-lg font-bold tabular-nums text-mute">
          {String(order).padStart(2, '0')}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-lg font-semibold">{song.title}</span>
          {song.favorite ? (
            <span className="text-gold" aria-label="Favoritada">
              ★
            </span>
          ) : null}
        </span>
        {meta ? <span className="block truncate text-sm text-mute">{meta}</span> : null}
      </span>
      <span className="shrink-0 rounded-full bg-gold/15 px-3 py-1 text-sm font-bold text-gold">
        {song.currentKey}
      </span>
    </Link>
  );
}
