import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { deleteUserFromIndexedDb, getAllUsersFromIndexedDb, insertDataInIndexedDb } from '../../../services/dbService';
import UserTableTemplate from './TableTemplate';
import UserFormComponent from '../Form/FormComponent';

const initialFormValues = {
  firstName: '',
  lastName: '',
  age: '',
  email: '',
};

const UserTableComponent: React.FC = () => {
  const [formdata] = useState(initialFormValues);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModal, setModal] = useState<boolean>(false);

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
    setModal(false);
  };

  useEffect(() => {
    insertDataInIndexedDb();
    getAllData();
  }, [isModal]);

  const openEditPopup = (user: any) => {
    setSelectedUser(user);
    setModal(true);
  };

  return (
    <>
      <UserFormComponent
        isModal={isModal}
        handleClose={() => setModal(false)}
        user={selectedUser}
        onUpdate={handleEditUserUpdate}
      />
      <UserTableTemplate
        formValues={formdata}
        allUsers={allUsers}
        deleteSelected={deleteSelected}
        openEditPopup={openEditPopup}
        setModal={setModal}
      />
    </>
  );
};

export default UserTableComponent;
