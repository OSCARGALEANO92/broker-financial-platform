import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Importar los estilos

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook de navegación

  const handleLogin = (e) => {
    e.preventDefault();
    
     // 🔹 Lista de usuarios con roles
     const users = [
      { email: "admin@homebridge.com", password: "123456", role: "admin" },
      { email: "banco@homebridge.com", password: "banco", role: "banco" },
      { email: "broker@homebridge.com", password: "broker", role: "broker" },
    ];

    // 🔹 Buscar el usuario en la lista
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("authToken", "token123"); // ✅ Simulación de token
      localStorage.setItem("userRole", user.role); // ✅ Guardar el rol del usuario
      setIsAuthenticated(true);

      if (user.role === "admin") {
        navigate("/dashboard");
      } else if (user.role === "banco") {
        navigate("/dashboard"); // ✅ Redirigir al Dashboard si es usuario banco
      }
       else if (user.role === "broker") {
      navigate("/dashboard"); // ✅ El broker entra a Dashboard
    }
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-container">
      <Paper elevation={3} className="login-card">
        <img
          src="/homebridge-logo.png.png" // 🔹 Asegurar que el logo esté en `public/`
          alt="HomeBridge Logo"
          className="login-logo"
        />

        <Typography variant="h6" className="login-title">
          Ingresar a la cuenta
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            label="Tu Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Tu contraseña"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" className="login-button">
            Ingresar
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default Login;











