import { FileSystem } from '../shared/FileSystem';
import { openDB } from 'idb';

const createFileSystem = (): FileSystem => {
  const db = openDB('keyval-store', 1, {
    upgrade(db) {
      db.createObjectStore('keyval');
    },
  });

  const get = async (key: string) => {
    return (await db).get('keyval', key);
  };
  const set = async (key: string, val: string) => {
    (await db).put('keyval', val, key);
  };
  const remove = async (key: string) => {
    (await db).delete('keyval', key);
  };

  return { get, set, remove };
};

export default createFileSystem;
