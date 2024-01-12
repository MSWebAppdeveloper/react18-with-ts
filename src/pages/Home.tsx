import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddUser from './AddUser';

const idb =
    (window as any).indexedDB ||
    (window as any).mozIndexedDB ||
    (window as any).webkitIndexedDB ||
    (window as any).msIndexedDB ||
    (window as any).shimIndexedDB;

const insertDataInIndexedDb = () => {
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

        // const db = request.result;

        // var tx = db.transaction("userData", "readwrite");
        // var userData = tx.objectStore("userData");

        //   USER_DATA.forEach((item) => userData.add(item));

        // return tx.complete;
    };
};

const Home: React.FC = () => {
    const [allUsers, setAllUsers] = useState<any[]>([]);

    const [minAge, setMinAge] = useState<string>("");
    const [maxAge, setMaxAge] = useState<string>("");
    const [isModal, setModal] = useState<boolean>(false)

    useEffect(() => {
        insertDataInIndexedDb();
        getAllData();
        // getAgeWiseData();
    }, [isModal]);

    const getAgeWiseData = () => {
        try {
            const dbPromise = idb.open("test-db", 1);
            const filteredRecords: any[] = [];

            const keyRangeValue = IDBKeyRange.bound(
                parseInt(minAge),
                parseInt(maxAge),
                false,
                false
            );

            dbPromise.onsuccess = function () {
                const db = dbPromise.result;

                if (db.objectStoreNames.contains("userData")) {
                    const transaction = db.transaction("userData", "readonly");
                    const objectStore = transaction.objectStore("userData");

                    const dataIdIndex = objectStore.index("age");
                    dataIdIndex.openCursor(keyRangeValue).onsuccess = function (event: { target: { result: any; }; }) {
                        const cursor = event.target.result;
                        if (cursor) {
                            if (cursor.value) {
                                if (parseInt(cursor.value.age) > 0) {
                                    console.log(cursor.value);
                                    filteredRecords.push(cursor.value);
                                }
                            }

                            cursor.continue();
                        }
                    };

                    transaction.oncomplete = function (event: any) {
                        setAllUsers(filteredRecords);
                        db.close();
                    };
                }
            };
        } catch (error) {
            console.log(error);
        }
    };

    const getAllData = () => {
        const dbPromise = idb.open("test-db", 1);
        dbPromise.onsuccess = () => {
            const db = dbPromise.result;

            var tx = db.transaction("userData", "readonly");
            var userData = tx.objectStore("userData");
            const users = userData.getAll();

            users.onsuccess = (query: any) => {
                setAllUsers(query.srcElement.result);
            };

            tx.oncomplete = function () {
                db.close();
            };
        };
    };



    const deleteSelected = (user: any) => {
        const dbPromise = idb.open("test-db", 1);

        dbPromise.onsuccess = function () {
            const db = dbPromise.result;
            var tx = db.transaction("userData", "readwrite");
            var userData = tx.objectStore("userData");
            const deleteUser = userData.delete(user.id);

            deleteUser.onsuccess = (query: any) => {
                tx.oncomplete = function () {
                    db.close();
                };
                toast.success("User Deleted!")
                getAllData();
            };
        };
    };

    function closeModal() {
        setModal(false);
    }



    return (
        <>
            {isModal && <AddUser isModal={isModal} handleClose={() => setModal(false)} />}
            <div className="row" style={{ padding: 100 }}>
                <div className="col-md-6">

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Age</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers?.map((user) => {
                                return (
                                    <tr key={user?.id}>
                                        <td>{user?.firstName}</td>
                                        <td>{user?.lastName}</td>
                                        <td>{user?.age}</td>
                                        <td>{user?.email}</td>
                                        <td>
                                            <button
                                                className="btn btn-success"
                                                onClick={() => setModal(!isModal)}
                                            // onClick={() => {
                                            //     setAddUser(false);
                                            //     setEditUser(true);
                                            //     setSelectedUser(user);
                                            //     setEmail(user?.email);
                                            //     setAge(user?.age);
                                            //     setFirstName(user?.firstName);
                                            //     setLastName(user?.lastName);
                                            // }}
                                            >
                                                Edit
                                            </button>{" "}
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => deleteSelected(user)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div>

                        <button
                            className="btn btn-primary float-end mb-2"
                            onClick={() => setModal(!isModal)}
                        // onClick={() => {
                        //     setFirstName("");
                        //     setLastName("");
                        //     setEmail("");
                        //     setAge("");
                        //     setEditUser(false);
                        //     setAddUser(true);
                        // }}
                        >
                            Add
                        </button>
                    </div>
                </div>

            </div>

        </>
    );
}

export default Home