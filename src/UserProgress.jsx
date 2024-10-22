import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import firebaseConfig from "./firebaseConfig";
import Modal from "react-modal";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";
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

  //------------------------------------------------------------------------------------

  const productSales = [
    {
      name: "Jan",
      product1: 4500,
      product2: 2400,
    },
    {
      name: "Feb",
      product1: 1500,
      product2: 3400,
    },
    {
      name: "Mar",
      product1: 7500,
      product2: 1400,
    },
    {
      name: "Apr",
      product1: 6500,
      product2: 8400,
    },
    {
      name: "May",
      product1: 9500,
      product2: 1500,
    },
    {
      name: "June",
      product1: 8000,
      product2: 3300,
    },
  ];

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
                  <div className="box">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={400}
                        data={productSales}
                        margin="30"
                      >
                        <YAxis />
                        <XAxis dataKey="name" />
                        <CartesianGrid />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="product1"
                          type="monotone"
                          stackId="1"
                        ></Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
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
