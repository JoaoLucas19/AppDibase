export function songHref(
  songId: string,
  context?: { type: 'block' | 'setlist' | 'favorites' | 'all'; id?: string },
): string {
  if (!context) return `/songs/${songId}`;

  if (context.type === 'block' && context.id) {
    return `/blocks/${context.id}/songs/${songId}`;
  }

  if (context.type === 'setlist' && context.id) {
    return `/setlists/${context.id}/songs/${songId}`;
  }

  if (context.type === 'favorites') {
    return `/favorites/songs/${songId}`;
  }

  return `/songs/${songId}`;
}

export function showHref(
  songId: string,
  context: { type: 'block' | 'setlist' | 'favorites' | 'all'; id?: string },
): string {
  const contextId = context.id ?? '_';
  return `/show/${context.type}/${contextId}/${songId}`;
}
