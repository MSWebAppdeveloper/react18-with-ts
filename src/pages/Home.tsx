import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddUser from './AddUser';
import EditUser from './EditUser';

const idb =
    (window as any).indexedDB ||
    (window as any).mozIndexedDB ||
    (window as any).webkitIndexedDB ||
    (window as any).msIndexedDB ||
    (window as any).shimIndexedDB;

const insertDataInIndexedDb = () => {
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
    };
};

const Home: React.FC = () => {
    const [allUsers, setAllUsers] = useState<any[]>([]);

    const [isModal, setModal] = useState<boolean>(false)

    const [editUserModal, setEditUserModal] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    useEffect(() => {
        insertDataInIndexedDb();
        getAllData();
    }, [isModal]);



    const getAllData = () => {
        const dbPromise = idb.open("test-db", 1);
        dbPromise.onsuccess = () => {
            const db = dbPromise.result;

            var tx = db.transaction("userData", "readonly");
            var userData = tx.objectStore("userData");
            const users = userData.getAll()
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

        dbPromise.onsuccess = () => {
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

    const handleEditUserUpdate = () => {
        getAllData();
        setEditUserModal(false);
    };

    const openEditPopup = (user: any) => {
        setSelectedUser(user);
        setEditUserModal(true);
    };

    return (
        <>
            {isModal && <AddUser isModal={isModal} handleClose={() => setModal(false)} />}
            {editUserModal && (
                <EditUser
                    isModal={editUserModal}
                    handleClose={() => setEditUserModal(false)}
                    user={selectedUser}
                    onUpdate={handleEditUserUpdate} />
            )}
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
                                                onClick={() => openEditPopup(user)}
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