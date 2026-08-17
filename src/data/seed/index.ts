import { buildSeed, SEED_VERSION } from './build';
import { rawBlocks } from './raw';
import { validateSeed } from './validate';

export const repertoireSeed = buildSeed(rawBlocks);

validateSeed(repertoireSeed, rawBlocks);

export { SEED_VERSION, rawBlocks };
export type { RepertoireSeed } from './build';
