import { useEffect, useState } from 'react';
import type { Song } from '@/domain';
import { describeKey, KEY_CHOICES } from '@/services/harmony';
import { keysEqual } from '@/services/transpose';

interface SongEditorProps {
  song: Song;
  pending?: boolean;
  onCancel: () => void;
  onSave: (patch: Partial<Omit<Song, 'id' | 'favorite'>>) => void;
}

export function SongEditor({ song, pending = false, onCancel, onSave }: SongEditorProps) {
  const [title, setTitle] = useState(song.title);
  const [artist, setArtist] = useState(song.artist ?? '');
  const [originalKey, setOriginalKey] = useState(song.originalKey);
  const [chords, setChords] = useState(song.chords ?? '');
  const [lyrics, setLyrics] = useState(song.lyrics ?? '');
  const [notes, setNotes] = useState(song.notes ?? '');

  useEffect(() => {
    setTitle(song.title);
    setArtist(song.artist ?? '');
    setOriginalKey(song.originalKey);
    setChords(song.chords ?? '');
    setLyrics(song.lyrics ?? '');
    setNotes(song.notes ?? '');
  }, [song]);

  return (
    <form
      className="space-y-4 rounded-2xl border border-stage-border bg-stage-raised px-4 py-4"
      onSubmit={(event) => {
        event.preventDefault();
        const name = title.trim();
        if (!name) return;

        const sameKey = keysEqual(song.originalKey, song.currentKey);
        onSave({
          title: name,
          artist: artist.trim() || null,
          originalKey,
          currentKey: sameKey ? originalKey : song.currentKey,
          chords: chords.trim() || null,
          lyrics: lyrics.trim() || null,
          notes: notes.trim() || null,
        });
      }}
    >
      <h2 className="text-lg font-bold">Editar música</h2>
      <label className="block">
        <span className="mb-1 block text-sm text-mute">Nome</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          className="min-h-12 w-full rounded-xl border border-stage-border bg-stage px-3"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm text-mute">Artista</span>
        <input
          value={artist}
          onChange={(event) => setArtist(event.target.value)}
          placeholder="Opcional"
          className="min-h-12 w-full rounded-xl border border-stage-border bg-stage px-3"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm text-mute">Tom original</span>
        <select
          value={originalKey}
          onChange={(event) => setOriginalKey(event.target.value)}
          className="min-h-12 w-full rounded-xl border border-stage-border bg-stage px-3"
        >
          {KEY_CHOICES.map((key) => (
            <option key={key} value={key}>
              {key} — {describeKey(key)}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm text-mute">Cifra</span>
        <textarea
          value={chords}
          onChange={(event) => setChords(event.target.value)}
          rows={8}
          placeholder={'G          D          Em\nLetra na linha de baixo, se quiser.'}
          className="w-full rounded-xl border border-stage-border bg-stage px-3 py-3 font-mono text-sm leading-relaxed"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm text-mute">Letra</span>
        <textarea
          value={lyrics}
          onChange={(event) => setLyrics(event.target.value)}
          rows={6}
          placeholder="Opcional, se a letra estiver separada da cifra."
          className="w-full rounded-xl border border-stage-border bg-stage px-3 py-3 text-sm leading-relaxed"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm text-mute">Observações</span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          placeholder="Entrada, ponte, quem puxa o coro..."
          className="w-full rounded-xl border border-stage-border bg-stage px-3 py-3 text-sm"
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-12 rounded-xl bg-stage-elevated font-semibold"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={pending || !title.trim()}
          className="min-h-12 rounded-xl bg-gold font-bold text-stage disabled:opacity-40"
        >
          {pending ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}
