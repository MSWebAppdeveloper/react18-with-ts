import { USER_DATA } from "../data";
const idb =
    (window as any).indexedDB ||
    (window as any).mozIndexedDB ||
    (window as any).webkitIndexedDB ||
    (window as any).msIndexedDB ||
    (window as any).shimIndexedDB;

export const  insertDataInIndexedDb = () => {
    //check for support
    if (!idb) {
        console.log("This browser doesn't support IndexedDB");
        return;
    }

    const request = idb.open("test-db", 1);

    request.onerror = function (event: any) {
        console.error("An error occurred with IndexedDB");
        console.error(event);
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

    request.onsuccess = function () {
        console.log("Database opened successfully");

        const db = request.result;

        var tx = db.transaction("userData", "readwrite");
        var userData = tx.objectStore("userData");

        USER_DATA.forEach((item) => userData.add(item));

        return tx.complete;
    };
};


  
  