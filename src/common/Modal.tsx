import React, { ReactNode, useRef } from 'react';
import Modal from 'react-modal';

export const customStyles: Modal.Styles = {
  content: {
    width: '80%', 
    maxWidth: '600px',
    margin: 'auto',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
  },
};

interface UseModalProps {
  children: ReactNode;
  isOpen: any;
  closeModal: any;
}

export const UseModal: React.FC<UseModalProps> = ({ isOpen, closeModal, children }) => {
  const subtitle = useRef<HTMLHeadingElement | null>(null);
  const afterOpenModal = () => {
    if (subtitle.current) {
      subtitle.current.style.color = '#f00';
    }
  };

  return (

    <Modal
      isOpen={isOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
      ariaHideApp={false}
    >
      <div  className="d-flex justify-content-end">
        <button className='btn btn-danger m-2' onClick={closeModal}>
          close
        </button>
      </div>
      {children}
    </Modal>

  );
};
