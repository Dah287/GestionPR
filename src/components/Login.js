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
      const response = await axios.post("http://192.168.1.81:8081/utilisateurs/login", { nom, password });
      let timeout;

      const setLogoutTimeout = () => {
        // Supprimer le précédent timeout (si existe)
        clearTimeout(timeout);

        // Créer un nouveau timeout pour la déconnexion après 5 minutes (300000 ms)
        console.log(timeout)
        timeout = setTimeout(() => {
          // Déconnexion de l'utilisateur
          localStorage.removeItem("id_utilisateur");
          localStorage.removeItem("role_utilisateur");

          // Rediriger l'utilisateur vers la page de connexion
          navigate("/login");
        }, 10 * 60 * 1000); // 5 minutes
      };


      if (response.data) {
        console.log("Data :", response.data);
        localStorage.setItem("id_utilisateur", response.data.id);
        localStorage.setItem("role_utilisateur", response.data.role); // Stocker le rôle



                // Déconnecter après 5 minutes
                setLogoutTimeout();


        if (response.data.role === "Chef de projet") {
            navigate("/projet"); // Rediriger vers /projet si le rôle est Chef de projet
          } else {
            navigate("/MesTaches"); // Rediriger vers /MesTaches sinon
          }

           // Ajouter des écouteurs d'événements pour réinitialiser le timeout lors des interactions de l'utilisateur
    window.addEventListener('mousemove', setLogoutTimeout);  // Détecte le mouvement de la souris
    window.addEventListener('keydown', setLogoutTimeout);   // Détecte la frappe de la touche du clavier
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
