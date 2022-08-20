import React from 'react';
import { NavLink } from 'react-router-dom';
import AuthAPI from '../services/AuthAPI';
import AuthContext from '../Contexts/AuthContext';
import { toast } from 'react-toastify';


const Navbar = ({ history }) => {
  const { isAuthenticated, setIsAuthenticated } = React.useContext(AuthContext);
  const handleLogout = () => {
    AuthAPI.Logout();
    setIsAuthenticated(false);

    toast.success("Vous êtes désormais déconnecté");
    history.push('/login');
  }
  return (<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    <div className="container-fluid">
      <NavLink className="navbar-brand" to="/">SymReact ! </NavLink>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarColor01">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/customers">Clients</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/invoices">Factures</NavLink>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          {(!isAuthenticated && (<><li className="nav-item">
            <NavLink className="nav-link" to="/register" >Inscrption</NavLink>
          </li>
            <li className="nav-item">
              <NavLink className="btn btn-success nav-link" to="/login" >Connexion</NavLink>
            </li> </>)) || (
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-danger mx-2" >Déconnexion</button>
              </li>
            )}
        </ul>
      </div>
    </div>
  </nav>);
}

export default Navbar;