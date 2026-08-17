import { createContext, useContext } from 'react';
import type { Repositories } from '@/repositories';

export const RepositoriesContext = createContext<Repositories | null>(null);

export function useRepositories(): Repositories {
  const value = useContext(RepositoriesContext);
  if (!value) {
    throw new Error('useRepositories deve ser usado dentro do Providers.');
  }
  return value;
}
