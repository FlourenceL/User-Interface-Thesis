import Modal from "react-modal";
import { useEffect, useState } from "react";

function ModalModel() {
  const [modal, setModal] = useState(false);

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  return (
    <>
      <button onClick={openModal}>Open modal</button>
      <h1>Modal state: {modal}</h1>
      <Modal isOpen={modal} ariaHideApp={false}>
        <h2>Hello from Modal</h2>
        <button onClick={closeModal}>Close modal</button>
      </Modal>
    </>
  );
}

export default ModalModel;
