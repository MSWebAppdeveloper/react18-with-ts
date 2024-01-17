import React from 'react';
import { UserTableProps } from './TableInterface';

const UserTableTemplate: React.FC<UserTableProps> = ({
  allUsers,
  deleteSelected,
  openEditPopup,
  setModal,
}) => (
  <div className="container mt-4">
    <div className="row justify-content-center text-center">
      <div className="col-md-10">
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
            {allUsers?.map((user) => (
              <tr key={user?.id}>
                <td>{user?.firstName}</td>
                <td>{user?.lastName}</td>
                <td>{user?.age}</td>
                <td>{user?.email}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm "
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
            ))}
          </tbody>
        </table>
        <div className="text-center">
          <button
            className="btn btn-primary float-end mb-2"
            onClick={() => setModal((prev) => !prev)}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default UserTableTemplate;
