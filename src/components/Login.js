import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.css";

const Login = () => {
const [email, setEmail] = useState(""); // remplacer nom
const [password, setPassword] = useState("");


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await axios.post(
      "http://localhost:8081/utilisateurs/login", // endpoint de login
      null,
      {
        params: { email, password }, // ⚡ utiliser email
      }
    );

    if (response.data) {
      const { token, role, id, nom } = response.data;

      // Stockage
      localStorage.setItem("token", token);
      localStorage.setItem("role_utilisateur", role);
      localStorage.setItem("id_utilisateur", id);
      localStorage.setItem("nom_utilisateur", nom);

      // Redirection
      if (role === "admin") navigate("/projet");
      else navigate("/MesTaches");
    }
  } catch (error) {
    if (error.response?.status === 401) setError("Email ou mot de passe incorrect !");
    else if (error.response?.status === 403) setError("Compte désactivé !");
    else setError("Erreur serveur !");
    console.error("Erreur de connexion", error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/logo.jpg" alt="Connexion" className="login-image" />

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaUser className="icon" />
<input
  type="text"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>

          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="n" type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
