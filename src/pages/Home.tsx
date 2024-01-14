import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddUser from './AddUser';
import EditUser from './EditUser';
import { deleteUserFromIndexedDb, getAllUsersFromIndexedDb, insertDataInIndexedDb } from '../services/dbService';

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
        getAllUsersFromIndexedDb()
            .then((users) => {
                setAllUsers(users);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    };

    const deleteSelected = (user: any) => {
        deleteUserFromIndexedDb(user.id)
            .then(() => {
                toast.success('User Deleted!');
                getAllData();
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
            });
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
            <div className="row justify-content-center text-center" style={{ padding: 50 }}>
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
                                                className="btn btn-success btn-sm mr-2"
                                                onClick={() => openEditPopup(user)}
                                            >
                                                Edit
                                            </button>{" "}
                                            <button
                                                className="btn btn-danger btn-sm"
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