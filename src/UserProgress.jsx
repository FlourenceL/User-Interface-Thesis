import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, off } from "firebase/database";
import Modal from "@mui/material/Modal";
import firebaseConfig from "./firebaseConfig";
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
import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box, // Import Box component from MUI
} from "@mui/material";

const UserProgress = () => {
  const [users, setUsers] = useState([]);
  const [currentUserProgress, setCurrentUserProgress] = useState([]);
  const [modal, setModal] = useState(false);

  const openModal = (progress) => {
    setCurrentUserProgress(progress); // Set the current user's progress data
    setModal(true);
  };

  const closeModal = () => setModal(false);

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "Users");

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.keys(data).map((key) => {
          const userProgress = data[key].Progress || {};
          const progressEntries = Object.keys(userProgress).map(
            (progressKey) => ({
              createdAt: new Date(
                userProgress[progressKey].createdAt
              ).toLocaleDateString(), // Convert timestamp to readable date
              weight: userProgress[progressKey].weight,
            })
          );
          return {
            id: key,
            ...data[key],
            progress: progressEntries,
          };
        });
        setUsers(usersList);
      }
    });

    return () => {
      off(usersRef); // Cleanup listener when component unmounts
    };
  }, []);

  //------------------------------------

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>

      {/* MUI Table */}
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Age</strong>
              </TableCell>
              <TableCell>
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => openModal(user.progress)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for User Progress */}
      <Modal
        open={modal}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          className="box"
          sx={{
            padding: "20px",
            backgroundColor: "#fff",
            margin: "50px auto",
            maxWidth: "600px",
            borderRadius: "8px", // Rounded corners
            boxShadow: 3, // Box shadow for depth effect
          }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={currentUserProgress}
              margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="createdAt" />

              {/* Calculate and set the Y-axis domain */}
              <YAxis
                domain={[
                  0,
                  Math.max(...currentUserProgress.map((data) => data.weight)) +
                    20,
                ]}
              />

              <CartesianGrid />
              <Tooltip />
              <Legend />
              <Bar dataKey="weight" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <Button variant="contained" onClick={closeModal} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default UserProgress;
