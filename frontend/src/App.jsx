import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/slices/authSlice";

// Simple Dashboard for verification
const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      {user ? <p>Welcome, {user.name}!</p> : <p>Please login to see your profile.</p>}
      <button
        onClick={() => {
          dispatch(logout());
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
