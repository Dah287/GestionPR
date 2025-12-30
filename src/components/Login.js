import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login1.css";

const Login = () => {
  const [email, setEmail] = useState(""); // ⚠️ reste "email" pour la logique
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
        "http://192.168.1.80:8081/api/utilisateurs/login",
        null,
        {
          params: { email, password }, // ✅ inchangé : toujours "email"
        }
      );

      if (response.data) {
        const { token, role, id, nom } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role_utilisateur", role);
        localStorage.setItem("id_utilisateur", id);
        localStorage.setItem("nom_utilisateur", nom);

        navigate(role === "admin" ? "/projet" : "/MesTaches");
      }
    } catch (error) {
      if (error.response?.status === 401) setError("Matricule ou mot de passe incorrect !");
      else if (error.response?.status === 403) setError("Compte désactivé !");
      else setError("Erreur serveur !");
      console.error("Erreur de connexion", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page"> {/* ← Classe racine */}
      <div className="login-card large-form">
        <div className="logo-section">
          <img src="/logo.jpg" alt="Logo" className="logo" />
          <h2>Connexion à votre espace</h2>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {/* ✅ Visuellement : "Matricule" — mais envoie toujours `email` */}
          <div className="input-wrapper">
            <div className="input-icon">
              <FaUser />
            </div>
            <input
              type="text"         
              placeholder="Matricule"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-wrapper">
            <div className="input-icon">
              <FaLock />
            </div>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              "Se connecter"
            )}
          </button>

          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;