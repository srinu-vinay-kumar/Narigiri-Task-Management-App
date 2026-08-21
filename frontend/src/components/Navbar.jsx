import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import Logo from "../assets/task management favicon.png";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.error(err);
    } finally {
      logout();
      navigate("/auth/login");
    }
  };

  return (
    <nav className="navbar">
      <Link className="navbar__brand" to="/">
        <img src={Logo} alt="Logo" className="navbar__brand-icon" />
        <span className="navbar__brand-text">Narigiri</span>
      </Link>
      <div className="navbar__actions">
        <button type="button" className="navbar__logout" onClick={handleLogout}>
          <LogOut className="navbar__logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
