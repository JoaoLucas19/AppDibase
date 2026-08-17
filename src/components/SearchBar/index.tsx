interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar música...',
}: SearchBarProps) {
  return (
    <label className="block">
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={`🔎 ${placeholder}`}
        enterKeyHint="search"
        className="min-h-14 w-full rounded-2xl border border-stage-border bg-stage-raised px-4 text-base text-ink placeholder:text-mute focus:border-gold"
      />
    </label>
  );
}
