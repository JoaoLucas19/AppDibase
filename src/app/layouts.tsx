import { Outlet } from 'react-router-dom';
import { BottomNavigation } from '@/components/BottomNavigation';
import { OfflineBanner } from '@/components/OfflineBanner';

export function AppLayout() {
  return (
    <div className="mx-auto min-h-dvh max-w-2xl bg-stage pb-24">
      <OfflineBanner />
      <Outlet />
      <BottomNavigation />
    </div>
  );
}

export function ShowLayout() {
  return (
    <div className="mx-auto min-h-dvh max-w-3xl bg-stage">
      <Outlet />
    </div>
  );
}
