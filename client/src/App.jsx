import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import CalendarPage from "./pages/CalendarPage";
import Loader from "./components/Loader";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/" replace />;
}
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/project/:id" element={<PrivateRoute><ProjectPage /></PrivateRoute>} />
        <Route path="/calendar" element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
