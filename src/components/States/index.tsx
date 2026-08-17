export function LoadingState({ message = 'Carregando repertório...' }: { message?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 text-mute">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-stage-border border-t-gold"
        aria-hidden="true"
      />
      <p>{message}</p>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-danger">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="min-h-12 rounded-xl bg-gold px-5 font-semibold text-stage"
        >
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-stage-border bg-stage-raised px-5 py-8 text-center">
      <p className="text-lg font-semibold">{title}</p>
      <p className="mt-2 text-mute">{description}</p>
    </div>
  );
}
