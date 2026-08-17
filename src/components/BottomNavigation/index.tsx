import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Início', icon: '🏠', end: true },
  { to: '/songs', label: 'Músicas', icon: '🎵', end: false },
  { to: '/favorites', label: 'Favoritos', icon: '⭐', end: false },
  { to: '/setlists', label: 'Setlists', icon: '🎤', end: false },
];

export function BottomNavigation() {
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-stage-border bg-stage/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <div className="mx-auto grid max-w-2xl grid-cols-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-medium ${
                isActive ? 'text-gold' : 'text-mute'
              }`
            }
          >
            <span aria-hidden="true" className="text-lg">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
