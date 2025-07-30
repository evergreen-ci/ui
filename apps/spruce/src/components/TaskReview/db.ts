import { IDBPDatabase, openDB, DBSchema } from "idb";

const DB_NAME = "spruce-db";
const STORE_NAME = "task_reviews";
const DB_VERSION = 1;

interface ReviewsDB extends DBSchema {
  task_reviews: {
    key: [taskId: string, execution: number];
    value: boolean;
  };
}

type DB = IDBPDatabase<ReviewsDB>;

const getDb = async () =>
  await openDB<ReviewsDB>(DB_NAME, DB_VERSION, {
    upgrade(d) {
      d.createObjectStore(STORE_NAME);
    },
  });

export const getItem = async (
  key: Parameters<DB["get"]>[1],
): ReturnType<DB["get"]> => {
  const db = await getDb();
  return db.get(STORE_NAME, key);
};

export const setItem = async (
  key: Parameters<DB["put"]>[2],
  value: Parameters<DB["put"]>[1],
): Promise<ReturnType<DB["put"]>> => {
  const db = await getDb();
  return db.put(STORE_NAME, value, key);
};

export const setItems = async (
  updates: Array<{
    key: Parameters<DB["put"]>[2];
    value: Parameters<DB["put"]>[1];
  }>,
): Promise<ReturnType<DB["put"]>> => {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  return Promise.all([
    ...updates.map(({ key, value }) => tx.store.put(value, key)),
    tx.done,
  ]);
};
