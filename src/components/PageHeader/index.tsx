import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  backTo?: string;
  backLabel?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, backTo, backLabel, actions }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-stage-border/80 bg-stage/95 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur">
      {backTo ? (
        <Link
          to={backTo}
          className="mb-2 inline-flex min-h-11 items-center text-sm font-medium text-gold"
        >
          ← {backLabel ?? 'Voltar'}
        </Link>
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-[1.65rem] font-bold leading-tight tracking-tight">{title}</h1>
        {actions}
      </div>
    </header>
  );
}
