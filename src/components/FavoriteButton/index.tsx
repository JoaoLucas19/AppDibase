import type { Song } from '@/domain';

interface FavoriteButtonProps {
  song: Song;
  onToggle: () => void;
}

export function FavoriteButton({ song, onToggle }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={song.favorite}
      className="min-h-12 rounded-xl px-3 text-sm font-semibold text-gold"
    >
      {song.favorite ? '★ Favoritado' : '☆ Favoritar'}
    </button>
  );
}
