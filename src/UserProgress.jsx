// src/components/UserProgress.js
import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import firebaseConfig from "./firebaseConfig";

// Your Firebase configuration

const UserProgress = () => {
  const [users, setUsers] = useState([]);

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
    <div>
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
                <button className="viewBtn">View</button>
                <button className="deleteBtn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserProgress;
