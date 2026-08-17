const DB_NAME = 'repertorio-banda';
const DB_VERSION = 1;

export const STORES = {
  songs: 'songs',
  blocks: 'blocks',
  blockSongs: 'blockSongs',
  setlists: 'setlists',
  meta: 'meta',
} as const;

let dbPromise: Promise<IDBDatabase> | null = null;

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Falha no IndexedDB'));
  });
}

export function getDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains(STORES.songs)) {
          db.createObjectStore(STORES.songs, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORES.blocks)) {
          db.createObjectStore(STORES.blocks, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORES.blockSongs)) {
          const store = db.createObjectStore(STORES.blockSongs, {
            keyPath: ['blockId', 'songId'],
          });
          store.createIndex('blockId', 'blockId', { unique: false });
          store.createIndex('songId', 'songId', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.setlists)) {
          db.createObjectStore(STORES.setlists, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORES.meta)) {
          db.createObjectStore(STORES.meta, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(request.error ?? new Error('Não foi possível abrir o repertório local.'));
    });
  }

  return dbPromise;
}

export async function idbGetAll<T>(storeName: string): Promise<T[]> {
  const db = await getDb();
  const tx = db.transaction(storeName, 'readonly');
  return requestToPromise(tx.objectStore(storeName).getAll()) as Promise<T[]>;
}

export async function idbGet<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
  const db = await getDb();
  const tx = db.transaction(storeName, 'readonly');
  return requestToPromise(tx.objectStore(storeName).get(key)) as Promise<T | undefined>;
}

export async function idbPut<T>(storeName: string, value: T): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(storeName, 'readwrite');
  await requestToPromise(tx.objectStore(storeName).put(value));
  await transactionDone(tx);
}

export async function idbPutAll<T>(storeName: string, values: T[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  for (const value of values) {
    store.put(value);
  }
  await transactionDone(tx);
}

export async function idbDelete(storeName: string, key: IDBValidKey): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(storeName, 'readwrite');
  await requestToPromise(tx.objectStore(storeName).delete(key));
  await transactionDone(tx);
}

export async function idbCount(storeName: string): Promise<number> {
  const db = await getDb();
  const tx = db.transaction(storeName, 'readonly');
  return requestToPromise(tx.objectStore(storeName).count());
}

function transactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Transação IndexedDB falhou'));
    tx.onabort = () => reject(tx.error ?? new Error('Transação IndexedDB abortada'));
  });
}

export interface MetaRecord {
  key: string;
  value: unknown;
}

export async function getMeta<T>(key: string): Promise<T | undefined> {
  const record = await idbGet<MetaRecord>(STORES.meta, key);
  return record?.value as T | undefined;
}

export async function setMeta(key: string, value: unknown): Promise<void> {
  await idbPut<MetaRecord>(STORES.meta, { key, value });
}
