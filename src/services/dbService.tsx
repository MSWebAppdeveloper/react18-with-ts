import { USER_DATA } from "../data";
import { idb } from "./idbInterface";

const DB_NAME = "test-db";
const DB_VERSION = 1;
const OBJECT_STORE_NAME = "userData";

const openDatabase = (mode: IDBTransactionMode) =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = idb.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        db.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
      }
    };

    request.onerror = (event: any) => {
      console.error("An error occurred with IndexedDB");
      console.error(event);
      reject("Error opening database");
    };

    request.onsuccess = (event: any) => {
      resolve(request.result);
    };
  });

const closeDatabase = (db: IDBDatabase) => db.close();

const transaction = (db: IDBDatabase, storeName: string, mode: IDBTransactionMode) =>
  db.transaction(storeName, mode).objectStore(storeName);

const getAllFromStore = (store: IDBObjectStore) =>
  new Promise<any[]>((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = (error: any) => reject(error);
  });

const addDataToStore = (store: IDBObjectStore, data: any) =>
  new Promise<void>((resolve, reject) => {
    const request = store.add(data);
    request.onsuccess = () => resolve();
    request.onerror = (error: any) => reject(error);
  });

const putDataToStore = (store: IDBObjectStore, data: any) =>
  new Promise<void>((resolve, reject) => {
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = (error: any) => reject(error);
  });

const deleteDataFromStore = (store: IDBObjectStore, key: string) =>
  new Promise<void>((resolve, reject) => {
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = (error: any) => reject(error);
  });

export const insertDataInIndexedDb = async () => {
  try {
    const db = await openDatabase("readwrite");
    const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
    const userData = transaction(db, OBJECT_STORE_NAME, "readwrite");

    const existingData = await getAllFromStore(userData);

    if (existingData.length === 0) {
      USER_DATA.forEach((item) => addDataToStore(userData, item));
    }

    tx.oncomplete = () => closeDatabase(db);
  } catch (error) {
    console.error(error);
  }
};

export const getAllUsersFromIndexedDb = async (): Promise<any[]> => {
  try {
    const db = await openDatabase("readonly");
    const userData = transaction(db, OBJECT_STORE_NAME, "readonly");
    const users = await getAllFromStore(userData);
    closeDatabase(db);
    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const insertUserInIndexedDb = async (userDataToAdd: any) => {
  try {
    const db = await openDatabase("readwrite");
    const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
    const userData = transaction(db, OBJECT_STORE_NAME, "readwrite");

    await addDataToStore(userData, userDataToAdd);

    tx.oncomplete = () => closeDatabase(db);
  } catch (error) {
    console.error(error);
  }
};

export const updateUserInIndexedDb = async (userDataToUpdate: any) => {
  try {
    const db = await openDatabase("readwrite");
    const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
    const userData = transaction(db, OBJECT_STORE_NAME, "readwrite");

    await putDataToStore(userData, userDataToUpdate);

    tx.oncomplete = () => closeDatabase(db);
  } catch (error) {
    console.error(error);
  }
};

export const deleteUserFromIndexedDb = async (userId: string) => {
  try {
    const db = await openDatabase("readwrite");
    const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
    const userData = transaction(db, OBJECT_STORE_NAME, "readwrite");

    await deleteDataFromStore(userData, userId);

    tx.oncomplete = () => closeDatabase(db);
  } catch (error) {
    console.error(error);
  }
};