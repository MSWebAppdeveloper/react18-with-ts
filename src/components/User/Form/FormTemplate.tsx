import React from 'react';
import { UserFormProps } from './FormInterface';
import { UseModal } from '../../../common/Modal';

const UserFormTemplate: React.FC<UserFormProps> = ({ formData, handleChange, handleSubmit, isModal, handleClose }) => (
  <div>
     <UseModal isOpen={isModal} closeModal={handleClose}>
    <div className="container">
      <div className="card p-4">
        <form onSubmit={handleSubmit}>
          <h3 className="mb-4">{formData.id ? 'Edit User' : 'Add User'}</h3>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="form-control"
              onChange={handleChange}
              value={formData.firstName}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="form-control"
              onChange={handleChange}
              value={formData.lastName}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="age" className="form-label">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              className="form-control"
              onChange={handleChange}
              value={formData.age}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>
          <div className="mb-3">
            <button
              className="btn btn-primary"
              type="submit"
            >
              {formData.id ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </UseModal>
  </div>
);

export default UserFormTemplate;
