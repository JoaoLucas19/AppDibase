import { repertoireSeed, SEED_VERSION } from '@/data/seed';
import { getMeta, idbCount, idbPutAll, setMeta, STORES } from './db';

export async function bootstrapLocalData(): Promise<void> {
  const songCount = await idbCount(STORES.songs);
  const storedVersion = await getMeta<number>('seedVersion');

  if (songCount === 0) {
    await idbPutAll(STORES.songs, repertoireSeed.songs);
    await idbPutAll(STORES.blocks, repertoireSeed.blocks);
    await idbPutAll(STORES.blockSongs, repertoireSeed.blockSongs);
    await setMeta('seedVersion', SEED_VERSION);
    await setMeta('seededAt', new Date().toISOString());
    return;
  }

  if (storedVersion === SEED_VERSION) {
    return;
  }

  await setMeta('seedVersion', storedVersion ?? SEED_VERSION);
}
