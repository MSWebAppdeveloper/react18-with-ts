import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { idb } from '../services/idbInterface';
import Modal from 'react-modal'
interface EditUserProps {
    isModal: boolean;
    handleClose: () => void;
    user: any;
    onUpdate: () => void;
    selectedUser?: any; // Add this line to make selectedUser optional
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

const EditUser: React.FC<EditUserProps> = ({ isModal, handleClose, user, onUpdate }) => {
    const subtitle = useRef<HTMLHeadingElement | null>(null);
    const [editedUser, setEditedUser] = useState({
        id: user?.id || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        age: user?.age || '',
        email: user?.email || '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addToDb();
    };

    const addToDb = () => {

        if (editedUser.firstName && editedUser.lastName && editedUser.email) {
            const dbPromise = idb.open("test-db", 1);

            dbPromise.onsuccess = () => {
                const db = dbPromise.result;
                var tx = db.transaction("userData", "readwrite");
                var userData = tx.objectStore("userData");

                const updatedUser = {
                    id: user?.id,
                    firstName: editedUser.firstName,
                    lastName: editedUser.lastName,
                    email: editedUser.email,
                    age: editedUser.age,
                };
                const users = userData.put(updatedUser);
                users.onsuccess = () => {
                    tx.oncomplete = () => {
                        db.close();
                        toast.success("User Updated")
                        onUpdate();
                        handleClose();
                    };
                };
            };
        } else {
            alert("Please enter all details");
        }
    }
    useEffect(() => {
        setEditedUser({
            id: user?.id || '',
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            age: user?.age || '',
            email: user?.email || '',
        });
    }, [user]);

    function afterOpenModal() {
        if (subtitle.current) {
            subtitle.current.style.color = '#f00';
        }
    }

    return (
        <div className={`modal ${isModal ? 'is-active' : ''}`}>

            <Modal
                isOpen={isModal}
                onAfterOpen={afterOpenModal}
                onRequestClose={handleClose}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <button className='btn btn-danger m-2 end' onClick={handleClose}>close</button>
                <div className="container-fluid">
                    <div className="card" style={{ padding: "10px" }}>
                        <form onSubmit={handleFormSubmit}>
                            <h3>Edit User Deatils</h3>
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={editedUser.firstName}
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={editedUser.lastName}
                                />
                            </div>
                            <div className="form-group">
                                <label>Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={editedUser.age}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={editedUser.email}
                                />
                            </div>
                            <div className="form-group">
                                <button
                                    className="btn btn-primary mt-2"
                                    type="submit"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EditUser;
