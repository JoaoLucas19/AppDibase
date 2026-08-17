import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { ErrorState, LoadingState } from '@/components/States';
import { RepositoriesContext } from '@/hooks/useRepositories';
import { createRepositories } from '@/repositories';
import { bootstrapLocalData } from '@/storage/indexeddb';

const repositories = createRepositories();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void bootstrapLocalData()
      .then(() => setReady(true))
      .catch((cause: unknown) => {
        setError(
          cause instanceof Error
            ? cause.message
            : 'Falha ao preparar o repertório local.',
        );
      });
  }, []);

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  if (!ready) {
    return <LoadingState message="Preparando repertório..." />;
  }

  return (
    <RepositoriesContext.Provider value={repositories}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RepositoriesContext.Provider>
  );
}
