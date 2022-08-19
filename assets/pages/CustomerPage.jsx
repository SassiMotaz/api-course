import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import customersAPI from '../services/customersAPI';

const CustomerPage = ({ match, history }) => {
    const { id = "new" } = match.params;


    const [customer, setCustomer] = useState({
        firstName: '',
        lastName: '',
        email: '',
        company: ''

    });
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        company: ''
    });
    const [editing, setEditing] = useState(false);
    const fetchCustomer = async (id) => {
        try {
            const { firstName, lastName, email, company } = await customersAPI.Find(id);
            setCustomer({ firstName, lastName, email, company });
        } catch (error) {
            console.log(error.response);
            // TODO : Notification error
            history.replace('/customers');
        }
    }
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);


    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setCustomer({ ...customer, [name]: value });
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (editing) {
            await customersAPI.Update(id, customer);
            } else {
                await customersAPI.Create(customer);
                // Router a la liste des customers après avoir créé un customer
                porps.history.push('/customers');
            }
            setErrors({});
        } catch ({ response }) {
            const { violations } = response.data;
            if (violations) {
                const apiErrors = {};
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
                });
            setErrors(apiErrors);
            }
        }
    };

    return (
        <>
            {!editing && <h1>Création d'un client</h1> || <h1>Modification d'un client</h1>}
            <form onSubmit={handleSubmit}>
                <Field name="firstName" label="Prénom" placeholder="Prénom du client" value={customer.firstName} onChange={handleChange} error={errors.firstName} />
                <Field name="lastName" label="Nom" placeholder="Nom du client" value={customer.lastName} onChange={handleChange} error={errors.lastName} />
                <Field name="email" label="Email" placeholder="Email du client" value={customer.email} onChange={handleChange} error={errors.email} />
                <Field name="company" label="Entreprise" placeholder="Entreprise du client" value={customer.company} onChange={handleChange} error={errors.company} />
                <div className="form-group mt-2">
                    <button type="submit" className="btn btn-primary">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>
        </>);
}

export default CustomerPage;