import React, { useEffect, useRef, useState, FormEvent } from 'react';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import { idb } from '../services/idbInterface';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: string;
}

interface UserFormProps {
  isModal: boolean;
  handleClose: () => void;
  user: any;
  onUpdate: () => void;
}

const customStyles: Modal.Styles = {
  content: {
    width: '50%',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const UserForm: React.FC<UserFormProps> = ({ isModal, handleClose, user, onUpdate }) => {
  const subtitle = useRef<HTMLHeadingElement | null>(null);
  const [formData, setFormData] = useState({
    id: user?.id || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    age: user?.age || '',
    email: user?.email || '',
  });

  useEffect(() => {
    setFormData({
      id: user?.id || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      age: user?.age || '',
      email: user?.email || '',
    });
  }, [user]);

  function generateUniqueId(): string {
    const timestamp = new Date().getTime().toString(36);
    const randomString = Math.random().toString(36).substr(2, 10);
    return timestamp + randomString;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addToDb();
  };

  const addToDb = () => {
    const dbPromise = idb.open("test-db", 1);

    if (formData.firstName && formData.lastName && formData.email) {
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;
        const tx = db.transaction("userData", "readwrite");
        const userData = tx.objectStore("userData");

        const userToAdd: UserData = {
          id: formData.id || generateUniqueId(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          age: formData.age,
        };

        const users = userData.put(userToAdd);

        users.onsuccess = () => {
          tx.oncomplete = () => {
            db.close();
            toast.success(formData.id ? 'User Updated' : 'User Added');
            setFormData({
              id: '',
              firstName: '',
              lastName: '',
              age: '',
              email: '',
            });
            onUpdate();
            handleClose();
          };
        };
      };
    } else {
      alert("Please enter all details");
    }
  };

  function afterOpenModal() {
    if (subtitle.current) {
      subtitle.current.style.color = '#f00';
    }
  }

  return (
    <div>
      <Modal
        isOpen={isModal}
        onAfterOpen={afterOpenModal}
        onRequestClose={handleClose}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <button className='btn btn-danger m-2 end' onClick={handleClose}>close</button>
        <div className="container-fluid">
          <div className="card" style={{ padding: "10px" }}>
            <form onSubmit={handleSubmit}>
              <h3>{formData.id ? 'Edit User' : 'Add User'}</h3>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  value={formData.firstName}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  value={formData.lastName}
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  className="form-control"
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  value={formData.age}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  value={formData.email}
                />
              </div>
              <div className="form-group">
                <button
                  className="btn btn-primary mt-2"
                  type="submit"
                >
                  {formData.id ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserForm;
