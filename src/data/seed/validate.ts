import type { RepertoireSeed } from './build';
import { EXPECTED_BLOCK_COUNT, INTENTIONAL_DUPLICATE_TITLES } from './build';
import type { SeedBlockEntry } from './raw';

export class SeedValidationError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(`Seed inválido:\n- ${issues.join('\n- ')}`);
    this.name = 'SeedValidationError';
    this.issues = issues;
  }
}

export function validateSeed(
  seed: RepertoireSeed,
  rawBlocks: SeedBlockEntry[],
): void {
  const issues: string[] = [];

  if (rawBlocks.length !== EXPECTED_BLOCK_COUNT) {
    issues.push(
      `Esperados ${String(EXPECTED_BLOCK_COUNT)} blocos brutos, encontrados ${String(rawBlocks.length)}.`,
    );
  }

  if (seed.blocks.length !== EXPECTED_BLOCK_COUNT) {
    issues.push(
      `Esperados ${String(EXPECTED_BLOCK_COUNT)} blocos, encontrados ${String(seed.blocks.length)}.`,
    );
  }

  const blockIds = new Set<string>();
  for (const block of seed.blocks) {
    if (blockIds.has(block.id)) {
      issues.push(`ID de bloco duplicado: ${block.id}`);
    }
    blockIds.add(block.id);
  }

  const songIds = new Set<string>();
  for (const song of seed.songs) {
    if (songIds.has(song.id)) {
      issues.push(`ID de música duplicado: ${song.id}`);
    }
    songIds.add(song.id);
    if (!song.originalKey.trim()) {
      issues.push(`Tom original vazio na música ${song.id} (${song.title}).`);
    }
    if (song.id === song.title) {
      issues.push(`A música "${song.title}" está usando o título como ID.`);
    }
  }

  const relationsByBlock = new Map<string, number[]>();
  const relationKeys = new Set<string>();

  for (const relation of seed.blockSongs) {
    if (!blockIds.has(relation.blockId)) {
      issues.push(`Relação aponta para bloco inexistente: ${relation.blockId}`);
    }
    if (!songIds.has(relation.songId)) {
      issues.push(`Relação aponta para música inexistente: ${relation.songId}`);
    }

    const key = `${relation.blockId}:${relation.songId}:${String(relation.order)}`;
    if (relationKeys.has(key)) {
      issues.push(`Relação duplicada acidental: ${key}`);
    }
    relationKeys.add(key);

    const orders = relationsByBlock.get(relation.blockId) ?? [];
    orders.push(relation.order);
    relationsByBlock.set(relation.blockId, orders);
  }

  for (const block of seed.blocks) {
    const orders = (relationsByBlock.get(block.id) ?? []).sort((a, b) => a - b);
    if (orders.length === 0) {
      issues.push(`Bloco vazio por erro de importação: ${block.name}`);
      continue;
    }

    for (let index = 0; index < orders.length; index += 1) {
      if (orders[index] !== index + 1) {
        issues.push(
          `Ordem inválida em ${block.name}: esperado ${String(index + 1)}, encontrado ${String(orders[index])}.`,
        );
        break;
      }
    }
  }

  const usedSongIds = new Set(seed.blockSongs.map((item) => item.songId));
  for (const song of seed.songs) {
    if (!usedSongIds.has(song.id)) {
      issues.push(`Música perdida, sem bloco: ${song.title} (${song.id})`);
    }
  }

  const rawCount = rawBlocks.reduce((total, block) => total + block.songs.length, 0);
  if (seed.blockSongs.length !== rawCount) {
    issues.push(
      `Quantidade de relações (${String(seed.blockSongs.length)}) diferente do repertório bruto (${String(rawCount)}).`,
    );
  }

  const titles = new Map<string, string[]>();
  for (const song of seed.songs) {
    const ids = titles.get(song.title) ?? [];
    ids.push(song.id);
    titles.set(song.title, ids);
  }

  for (const title of INTENTIONAL_DUPLICATE_TITLES) {
    const song = seed.songs.find((item) => item.title === title);
    if (!song) {
      issues.push(`Duplicação intencional ausente: ${title}`);
      continue;
    }

    const appearances = seed.blockSongs.filter((item) => item.songId === song.id);
    if (appearances.length < 2) {
      issues.push(
        `A música "${title}" deveria aparecer em mais de um bloco, mas aparece ${String(appearances.length)} vez(es).`,
      );
    }

    const idsForTitle = titles.get(title) ?? [];
    if (idsForTitle.length !== 1) {
      issues.push(
        `A duplicação intencional de "${title}" deveria reutilizar o mesmo ID. IDs: ${idsForTitle.join(', ')}`,
      );
    }
  }

  const expectedOrders = rawBlocks.map((block) => block.number);
  const actualOrders = seed.blocks.map((block) => block.order);
  if (expectedOrders.join(',') !== actualOrders.join(',')) {
    issues.push('A numeração/ordem dos blocos não foi preservada.');
  }

  if (issues.length > 0) {
    throw new SeedValidationError(issues);
  }
}
