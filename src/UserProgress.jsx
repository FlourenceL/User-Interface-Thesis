import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import firebaseConfig from "./firebaseConfig";
import Modal from "react-modal";
// Your Firebase configuration

const UserProgress = () => {
  const [users, setUsers] = useState([]);

  const [modal, setModal] = useState(false);
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);
  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "Users");

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const usersList = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setUsers(usersList);
    });
  }, []);

  return (
    <div className="container">
      <h1>Users</h1> <br />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Height</th>
            <th>Weight</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                {user.firstName} {user.lastName}
              </td>

              <td>{user.age}</td>
              <td>{user.height}</td>
              <td>{user.weight}</td>
              <td>
                <button className="viewBtn" onClick={openModal}>
                  View
                </button>
                <Modal
                  isOpen={modal}
                  onRequestClose={closeModal}
                  ariaHideApp={false}
                >
                  <h1>Helloworld</h1>
                  <button onClick={closeModal}>Close</button>
                </Modal>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserProgress;
