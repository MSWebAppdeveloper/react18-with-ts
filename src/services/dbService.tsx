import { USER_DATA } from "../data";
import { idb } from "./idbInterface";

export const insertDataInIndexedDb = async () => {
  return new Promise<void>(async (resolve, reject) => {
    if (!idb) {
      console.log("This browser doesn't support IndexedDB");
      reject("IndexedDB not supported");
      return;
    }

    const request = idb.open("test-db", 1);

    request.onerror = function (event: any) {
      console.error("An error occurred with IndexedDB");
      console.error(event);
      reject("Error opening database");
    };

    request.onupgradeneeded = function (event: any) {
      console.log(event);
      const db = request.result;

      if (!db.objectStoreNames.contains("userData")) {
        const objectStore = db.createObjectStore("userData", { keyPath: "id" });
        objectStore.createIndex("age", "age", {
          unique: false,
        });
      }
    };

    request.onsuccess = async () => {
      const db = request.result;
      const tx = db.transaction("userData", "readwrite");
      const userData = tx.objectStore("userData");

      const dataRequest = userData.getAll();

      dataRequest.onsuccess = () => {
        const existingData = dataRequest.result;

        // If the object store is empty, add initial data
        if (existingData.length === 0) {
          USER_DATA.forEach((item) => userData.add(item));
        }

        tx.oncomplete = () => {
          db.close();
          resolve();
        };
      };
    };
  });
};

export const getAllUsersFromIndexedDb = async (): Promise<any[]> => {
  return new Promise(async (resolve, reject) => {
    const dbPromise = idb.open("test-db", 1);

    dbPromise.onsuccess = async () => {
      const db = dbPromise.result;
      const tx = db.transaction("userData", "readonly");
      const userData = tx.objectStore("userData");
      const usersRequest = userData.getAll();

      usersRequest.onsuccess = () => {
        resolve(usersRequest.result);
        db.close();
      };

      tx.oncomplete = () => {
        db.close();
      };

      usersRequest.onerror = (error: any) => {
        reject(error);
      };
    };

    dbPromise.onerror = (error: any) => {
      reject(error);
    };
  });
};

export const insertUserInIndexedDb = async (userDataToAdd: any) => {
  return new Promise<void>(async (resolve, reject) => {
    if (!idb) {
      console.log("This browser doesn't support IndexedDB");
      reject("IndexedDB not supported");
      return;
    }

    const request = idb.open("test-db", 1);

    request.onerror = function (event: any) {
      console.error("An error occurred with IndexedDB");
      console.error(event);
      reject("Error opening database");
    };

    request.onupgradeneeded = function (event: any) {
      console.log(event);
      const db = request.result;

      if (!db.objectStoreNames.contains("userData")) {
        const objectStore = db.createObjectStore("userData", { keyPath: "id" });
        objectStore.createIndex("age", "age", {
          unique: false,
        });
      }
    };

    request.onsuccess = async () => {
      const db = request.result;
      const tx = db.transaction("userData", "readwrite");
      const userData = tx.objectStore("userData");

      const addRequest = userData.add(userDataToAdd);

      addRequest.onsuccess = () => {
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
      };
      addRequest.onerror = (error: any) => {
        reject(error);
      };
    };
  });
};

export const updateUserInIndexedDb = async (userDataToUpdate: any) => {
  return new Promise<void>(async (resolve, reject) => {
    if (!idb) {
      console.log("This browser doesn't support IndexedDB");
      reject("IndexedDB not supported");
      return;
    }

    const request = idb.open("test-db", 1);

    request.onerror = function (event: any) {
      console.error("An error occurred with IndexedDB");
      console.error(event);
      reject("Error opening database");
    };

    request.onsuccess = async () => {
      const db = request.result;
      const tx = db.transaction("userData", "readwrite");
      const userData = tx.objectStore("userData");

      // Update the user in the database
      const updateRequest = userData.put(userDataToUpdate);

      updateRequest.onsuccess = () => {
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
      };
      updateRequest.onerror = (error: any) => {
        reject(error);
      };
    };
  });
};

export const deleteUserFromIndexedDb = async (userId: string) => {
  return new Promise<void>(async (resolve, reject) => {
    const dbPromise = idb.open("test-db", 1);
    dbPromise.onsuccess = async () => {
      const db = dbPromise.result;
      const tx = db.transaction("userData", "readwrite");
      const userData = tx.objectStore("userData");
      const deleteUser = userData.delete(userId);

      deleteUser.onsuccess = () => {
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
      };
      deleteUser.onerror = (error: any) => {
        reject(error);
      };
    };
    dbPromise.onerror = (error: any) => {
      reject(error);
    };
  });
};
