import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { async } from 'regenerator-runtime';
import Field from '../components/forms/Field';
import usersAPI from '../services/usersAPI';
import { toast } from 'react-toastify';

const RegisterPage = ({history}) => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setUser({...user, [name]: value});
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiErrors = {};
        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm = "Votre mot de passe n'est pas identique";
            setErrors(apiErrors);
            toast.error("des erreurs dans votre formulaire ! ");
            return;
        }
        try {
             await usersAPI.Register(user);
            setErrors({});
            toast.success("Vous êtes désormais inscrit , vous pouvez vous connecter");
            history.replace('/login');
        } catch (error) {
            const { violations } = error.response.data;
            if (violations) {
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
            }
            toast.error("des erreurs dans votre formulaire ! ");
        }
    }


    return ( 
        <>
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit}>
        <Field  name="firstName" label="Prénom" placeholder="Votre prénom" error={errors.firstName} value={user.firstName} onChange={handleChange} />
        <Field  name="lastName" label="Nom" placeholder="Votre nom" error={errors.lastName} value={user.lastName} onChange={handleChange} />
        <Field  name="email" label="Email" placeholder="Votre email" error={errors.email} value={user.email} onChange={handleChange} />
        <Field  name="password" label="Mot de passe" type="password" placeholder="Votre mot de passe" error={errors.password} value={user.password} onChange={handleChange} />
        <Field  name="passwordConfirm" label="Confirmation du mot de passe" type="password" placeholder="Confirmez votre mot de passe" error={errors.passwordConfirm} value={user.passwordConfirm} onChange={handleChange} />
        <div className="form-group">
            <button type="submit" className="btn btn-success">Confirmer</button>
            <Link to="/login" className="btn btn-link">J'ai déjà un compte</Link>
        </div>

        </form>
        </>
     );
}
 
export default RegisterPage;