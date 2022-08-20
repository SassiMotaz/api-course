import React, { useContext, useState } from 'react';
import Field from '../components/forms/Field';
import AuthContext from '../Contexts/AuthContext';
import AuthAPI from '../services/AuthAPI';
import {toast} from 'react-toastify';

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
            toast.success("Vous êtes désormais connecté");
            history.replace('/customers');
        } catch (error) {
            setError("Aucun Compte ne poséde cette adresse email ou alors les informations saisies sont incorrectes");
            toast.error("Une erreur est survenue");
        }
    }


    return (
        <>
            <h1>Connexion a l'application</h1>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <Field name="username" label="Adresse email" value={creditentials.username} onChange={handleChange} placeholder="Adresse email" />
                    <Field name="password" label="Mot de passe" value={creditentials.password} onChange={handleChange} placeholder="Mot de passe" type="password" />
                   
                    <div className="form-group mt-2">
                        <button type="submit" className="btn btn-success">je me connecte</button>
                    </div>
                </form>
            </div>

        </>
    );
}

export default LoginPage;