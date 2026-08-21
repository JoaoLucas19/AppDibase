import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout, ShowLayout } from '@/app/layouts';
import { BlockDetailsPage } from '@/pages/BlockDetails';
import { BlocksPage } from '@/pages/Blocks';
import { FavoritesPage } from '@/pages/Favorites';
import { HomePage } from '@/pages/Home';
import { SetlistDetailsPage } from '@/pages/SetlistDetails';
import { SetlistEditPage } from '@/pages/SetlistEdit';
import { SetlistsPage } from '@/pages/Setlists';
import { SettingsPage } from '@/pages/Settings';
import { ShowPage } from '@/pages/Show';
import { SongDetailsPage } from '@/pages/SongDetails';
import { SongsPage } from '@/pages/Songs';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/songs', element: <SongsPage /> },
      { path: '/songs/:songId', element: <SongDetailsPage /> },
      { path: '/blocks', element: <BlocksPage /> },
      { path: '/blocks/:blockId', element: <BlockDetailsPage /> },
      { path: '/blocks/:blockId/songs/:songId', element: <SongDetailsPage /> },
      { path: '/favorites', element: <FavoritesPage /> },
      { path: '/favorites/songs/:songId', element: <SongDetailsPage /> },
      { path: '/setlists', element: <SetlistsPage /> },
      { path: '/setlists/:setlistId', element: <SetlistDetailsPage /> },
      { path: '/setlists/:setlistId/edit', element: <SetlistEditPage /> },
      { path: '/setlists/:setlistId/songs/:songId', element: <SongDetailsPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
  {
    element: <ShowLayout />,
    children: [
      { path: '/show/:contextType/:contextId/:songId', element: <ShowPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
