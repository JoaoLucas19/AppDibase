import { Link } from 'react-router-dom';
import { pluralize } from '@/utils/ids';

interface BlockCardProps {
  number: number;
  name: string;
  songCount: number;
  href: string;
}

export function BlockCard({ number, name, songCount, href }: BlockCardProps) {
  return (
    <Link
      to={href}
      className="flex min-h-[4.5rem] items-center gap-4 rounded-2xl border border-stage-border bg-stage-raised px-4 py-3"
    >
      <span className="w-10 shrink-0 text-center text-xl font-bold tabular-nums text-gold">
        {String(number).padStart(2, '0')}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-lg font-semibold">{name}</span>
        <span className="text-sm text-mute">{pluralize(songCount, 'música', 'músicas')}</span>
      </span>
    </Link>
  );
}
