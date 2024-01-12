import { useEffect, useRef, useState, FormEvent } from 'react';
import Modal from 'react-modal';
import { idb } from '../services/idbInterface';
import toast from 'react-hot-toast';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: string;
}

const insertDataInIndexedDb = () => {
  // check for support
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

interface AddUserProps {
  isModal: boolean;
  handleClose: () => void;
}

const AddUser: React.FC<AddUserProps> = ({ isModal, handleClose }) => {
  const subtitle = useRef<HTMLHeadingElement | null>(null);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [age, setAge] = useState<string>("");

  useEffect(() => {
    insertDataInIndexedDb();
  }, []);

  function generateUniqueId(): string {
    const timestamp = new Date().getTime().toString(36);
    const randomString = Math.random().toString(36).substr(2, 10);
    return timestamp + randomString;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(event.target, "sdsds");

    addToDb();
  };

  const addToDb = () => {
    const dbPromise = idb.open("test-db", 1);

    if (firstName && lastName && email) {
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;
        const tx = db.transaction("userData", "readwrite");
        const userData = tx.objectStore("userData");

        const users = userData.put({
          id: generateUniqueId(),
          firstName,
          lastName,
          email,
          age,
        } as UserData);

        users.onsuccess = () => {
          tx.oncomplete = () => {
            db.close();
          };
          toast.success("User Added");
          setFirstName("");
          setLastName("");
          setEmail("");
          setAge("");
          handleClose();
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
      >
        <button className='btn btn-danger m-2 end' onClick={handleClose}>close</button>
        <div className="container-fluid">
          <div className="card" style={{ padding: "10px" }}>
            <form onSubmit={handleSubmit}>
              <h3>Edit User</h3>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  className="form-control"
                  onChange={(e) => setAge(e.target.value)}
                  value={age}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div className="form-group">
                <button
                  className="btn btn-primary mt-2"
                  type="submit"
                >
               Edit
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddUser;
