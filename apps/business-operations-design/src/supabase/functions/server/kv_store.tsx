/* Supabase KV store disconnected — this file is intentionally empty */

const memoryStore = new Map<string, any>();

export const set = async (key: string, value: any): Promise<void> => {
  memoryStore.set(key, value);
};

export const get = async (key: string): Promise<any> => {
  return memoryStore.get(key) ?? null;
};

export const del = async (key: string): Promise<void> => {
  memoryStore.delete(key);
};

export const mset = async (keys: string[], values: any[]): Promise<void> => {
  keys.forEach((k, i) => memoryStore.set(k, values[i]));
};

export const mget = async (keys: string[]): Promise<any[]> => {
  return keys.map(k => memoryStore.get(k) ?? null);
};

export const mdel = async (keys: string[]): Promise<void> => {
  keys.forEach(k => memoryStore.delete(k));
};

export const getByPrefix = async (prefix: string): Promise<any[]> => {
  const results: any[] = [];
  for (const [key, value] of memoryStore.entries()) {
    if (key.startsWith(prefix)) {
      results.push({ key, value });
    }
  }
  return results;
};
