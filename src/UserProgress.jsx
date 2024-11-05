import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, off } from "firebase/database";
import Modal from "@mui/material/Modal";
import firebaseConfig from "./firebaseConfig";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
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
  Typography,
  Paper,
  Box,
  IconButton,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const UserProgress = () => {
  const [users, setUsers] = useState([]);
  const [currentUserProgress, setCurrentUserProgress] = useState([]);
  const [modal, setModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const openModal = (progress) => {
    setCurrentUserProgress(progress);
    setModal(true);
  };

  const closeModal = () => setModal(false);

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "Users");

    const mapFatToInteger = (fatRange) => {
      switch (fatRange) {
        case "6%-8%":
          return 1;
        case "10%-14%":
          return 2;
        case "15%-19%":
          return 3;
        case "20%-24%":
          return 4;
        case "25%-29%":
          return 5;
        case "30%-34%":
          return 6;
        case "35%-40%":
          return 7;
        default:
          return 0; // Return 0 or some default value if the range doesn't match
      }
    };

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.keys(data).map((key) => {
          const userProgress = data[key].Progress || {};
          const progressEntries = Object.keys(userProgress).map(
            (progressKey) => ({
              createdAt: new Date(
                userProgress[progressKey].createdAt
              ).toLocaleDateString(),
              weight: userProgress[progressKey].weight, // Fetch weight
              height: userProgress[progressKey].height, // Fetch height
              bmi: userProgress[progressKey].bmi, // Fetch bmi
              bmiCategory: userProgress[progressKey].bmiCategory, // Fetch category
              fatPercentage: userProgress[progressKey].fat, // Fetch category
              fat: mapFatToInteger(userProgress[progressKey].fat),
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
      off(usersRef);
    };
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 2, marginTop: 4 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4" gutterBottom>
              Users
            </Typography>
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>

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
        </Paper>

        {/* Modal for User Progress */}
        <Modal
          open={modal}
          onClose={closeModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Paper
            elevation={3}
            sx={{
              padding: "20px",
              backgroundColor: "#fff",
              margin: "50px auto",
              maxWidth: "600px",
              maxHeight: "80vh", // Limit height to 80% of viewport height
              overflowY: "auto", // Enable vertical scrolling
              borderRadius: "8px",
              boxShadow: 3,
            }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={currentUserProgress}
                margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="createdAt" />
                <YAxis
                  domain={[
                    0,
                    Math.max(
                      ...currentUserProgress.map((data) => data.weight)
                    ) + 20,
                  ]}
                />
                <CartesianGrid />
                <Tooltip />
                <Legend />
                <Bar dataKey="weight" fill="#0000FF" />
              </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={currentUserProgress}
                margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="createdAt" />
                <YAxis
                  domain={[
                    0,
                    Math.max(
                      ...currentUserProgress.map(
                        (data) => parseFloat(data.height) || 0
                      )
                    ) + 20,
                  ]}
                />
                <CartesianGrid />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="height" stroke="#FF0000" />
              </LineChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={currentUserProgress}
                margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="createdAt" />
                <YAxis
                  domain={[
                    0,
                    Math.max(
                      ...currentUserProgress.map(
                        (data) => parseFloat(data.fat) || 0
                      )
                    ) + 5,
                  ]}
                />
                <CartesianGrid />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const { fatPercentage } = payload[0].payload;
                      return (
                        <div
                          style={{
                            backgroundColor: "#fff",
                            padding: "5px",
                            border: "1px solid #ccc",
                          }}
                        >
                          <p>
                            <strong>Category:</strong> {fatPercentage}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="fat" stroke="#008000" />
              </LineChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={currentUserProgress}
                margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="createdAt" />
                <YAxis
                  domain={[
                    0,
                    Math.max(
                      ...currentUserProgress.map(
                        (data) => parseFloat(data.bmi) || 0
                      )
                    ) + 5,
                  ]}
                />
                <CartesianGrid />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const { bmi, bmiCategory } = payload[0].payload;
                      return (
                        <div
                          style={{
                            backgroundColor: "#fff",
                            padding: "5px",
                            border: "1px solid #ccc",
                          }}
                        >
                          <p>
                            <strong>BMI:</strong> {bmi}
                          </p>
                          <p>
                            <strong>Category:</strong> {bmiCategory}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="bmi" stroke="#FFFF00" />
              </LineChart>
            </ResponsiveContainer>

            <Button variant="contained" onClick={closeModal} sx={{ mt: 2 }}>
              Close
            </Button>
          </Paper>
        </Modal>
      </Container>
    </ThemeProvider>
  );
};

export default UserProgress;
