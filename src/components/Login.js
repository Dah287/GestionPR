import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [nom, setnom] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Réinitialise le message d'erreur à chaque tentative

    try {
      const response = await axios.post("http://localhost:8081/utilisateurs/login", { nom, password });
      
      if (response.data) {
        console.log("Data :", response.data);
        localStorage.setItem("id_utilisateur", response.data.id);
        localStorage.setItem("role_utilisateur", response.data.role); // Stocker le rôle
        if (response.data.role === "Chef de projet") {
            navigate("/projet"); // Rediriger vers /projet si le rôle est Chef de projet
          } else {
            navigate("/MesTaches"); // Rediriger vers /MesTaches sinon
          }
      }
    } catch (error) {
      setError("Identifiants incorrects !"); // Affiche le message d'erreur en cas d'échec
      console.error("Erreur de connexion", error);
    } finally {
      setLoading(false);
    }
  };

  return ( 
    <div className="login-container">
      <div className="login-box">
        {/* Image avant le formulaire */}
        <img src="/logo.jpg" alt="Connexion" className="login-image" />
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="UserName"
              value={nom}
              onChange={(e) => setnom(e.target.value)}
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

          {/* Message d'erreur affiché sous le bouton */}
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
