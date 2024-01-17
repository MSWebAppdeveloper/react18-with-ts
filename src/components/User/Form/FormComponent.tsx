import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { insertUserInIndexedDb, updateUserInIndexedDb } from '../../../services/dbService';
import UserFormTemplate from './FormTemplate';

const initialFormValues = {
  id: '',
  firstName: '',
  lastName: '',
  age: '',
  email: '',
};

interface UserFormComponentProps {
  isModal: boolean;
  handleClose: () => void;
  user: any;
  onUpdate: () => void;
}

const UserFormComponent: React.FC<UserFormComponentProps> = ({ isModal, handleClose, user, onUpdate }) => {
  const [formData, setFormData] = useState(initialFormValues);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  };

  const generateUniqueId = () => {
    const timestamp = new Date().getTime().toString(36);
    const randomString = Math.random().toString(36).substr(2, 10);
    return timestamp + randomString;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (formData.firstName && formData.lastName && formData.email) {
      const userData = {
        id: formData.id || generateUniqueId(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        age: formData.age,
      };

      const dbOperation = formData.id ? updateUserInIndexedDb : insertUserInIndexedDb;

      try {
        await dbOperation(userData);
        toast.success(`User ${formData.id ? 'Updated' : 'Added'}`);
        resetForm();
        onUpdate();
        handleClose();
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please enter all details');
    }
  };
  const handleClosePopup = () => {
    resetForm()
    handleClose();
  };
  const resetForm = () => {
    setFormData(initialFormValues);
  };

  useEffect(() => {
    setFormData({
      id: user?.id || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      age: user?.age || '',
      email: user?.email || '',
    });
  }, [user]);

  return (
    <UserFormTemplate
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isModal={isModal}
      handleClose={handleClosePopup}
    />
  )
};

export default UserFormComponent;