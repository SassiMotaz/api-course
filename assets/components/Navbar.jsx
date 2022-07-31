import React from 'react';

const Navbar = props => {
  return (<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    <div className="container-fluid">
      <a className="navbar-brand" href="#">SymReact ! </a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarColor01">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <a className="nav-link" href="#">Clients</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Factures</a>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" href="#">Inscrption</a>
          </li>
          <li className="nav-item">
            <a className="btn btn-success" href="#">Connexion</a>
          </li>
          <li className="nav-item">
            <a className="btn btn-danger mx-2" href="#">Déconnexion</a>
          </li>
          
        </ul>
      </div>
    </div>
  </nav>);
}

export default Navbar;