import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("All fields required");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0A0A14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.15, 1], y: [0, -20, 0] }}
          transition={{ duration: 12 + i * 3, repeat: Infinity, delay: i * 3 }}
          style={{
            position: "absolute",
            width: 380 - i * 50,
            height: 380 - i * 50,
            borderRadius: "50%",
            background:
              i === 0
                ? "radial-gradient(circle,rgba(255,101,132,0.12),transparent 70%)"
                : "radial-gradient(circle,rgba(108,99,255,0.12),transparent 70%)",
            top: i === 0 ? "5%" : "60%",
            left: i === 0 ? "70%" : "5%",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
      ))}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: 430, zIndex: 1 }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "18px",
                background: "linear-gradient(135deg,#6C63FF,#FF6584)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
                boxShadow: "0 8px 30px rgba(108,99,255,0.45)",
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: "2rem",
                  lineHeight: 1,
                }}
              >
                V
              </Typography>
            </Box>
          </motion.div>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              background: "linear-gradient(135deg,#6C63FF,#FF6584)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 0.5,
            }}
          >
            VbaseD
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Project management, simplified.
          </Typography>
        </Box>
        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: "20px",
            background: "rgba(19,19,42,0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(108,99,255,0.2)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={0.5}>
            Create account
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Join VbaseD today
          </Typography>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: "10px" }}>
                {error}
              </Alert>
            </motion.div>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person
                      sx={{ color: "text.secondary", fontSize: "1.1rem" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email
                      sx={{ color: "text.secondary", fontSize: "1.1rem" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              fullWidth
              helperText="Min. 6 characters"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock
                      sx={{ color: "text.secondary", fontSize: "1.1rem" }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPass(!showPass)}
                      size="small"
                      sx={{ color: "text.secondary" }}
                    >
                      {showPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5, fontSize: "1rem", mt: 0.5 }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : (
                "Create Account"
              )}
            </Button>
          </Box>
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to="/"
                sx={{
                  color: "primary.light",
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
