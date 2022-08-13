import axios from 'axios';
import React, { useContext, useState } from 'react';
import AuthContext from '../Contexts/AuthContext';
import AuthAPI from '../services/AuthAPI';
import customersAPI from '../services/customersAPI';

const LoginPage = ({history}) => {
    const { setIsAuthenticated } = useContext(AuthContext);
    const [creditentials, setCreditentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setCreditentials({
            ...creditentials,
            [name]: value
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await AuthAPI.authenticate(creditentials);
            setError("");
            setIsAuthenticated(true);
            history.replace('/customers');
        } catch (error) {
            setError("Aucun Compte ne poséde cette adresse email ou alors les informations saisies sont incorrectes");
        }
    }


    return (
        <>
            <h1>Connexion a l'application</h1>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Adresse Email</label>
                        <input type="text" className={"form-control" + (error && " is-invalid")} name="username" placeholder="Adresse Email" id='username' value={creditentials.username} onChange={handleChange} />
                        {error && <div className="invalid-feedback">{error}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mot de Passe</label>
                        <input type="password" className="form-control" name="password" placeholder="Mot de Passe" id='password' value={creditentials.password} onChange={handleChange} />
                    </div>
                    <div className="form-group mt-2">
                        <button type="submit" className="btn btn-success">je me connecte</button>
                    </div>
                </form>
            </div>

        </>
    );
}

export default LoginPage;