import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import FormContentLoader from '../components/loders/FormContentLoader';
import customersAPI from '../services/customersAPI';
import { toast } from 'react-toastify';

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
    const [loading, setLoading] = useState(false);
    const fetchCustomer = async (id) => {
        try {
            const { firstName, lastName, email, company } = await customersAPI.Find(id);
            setCustomer({ firstName, lastName, email, company });
            setLoading(false);
        } catch (error) {
            console.log(error.response);
            // TODO : Notification error
            toast.error("le client n'a pas pu être chargé");
            history.replace('/customers');
        }
    }
    useEffect(() => {
        if (id !== "new") {
            setLoading(true);
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
            setErrors({});
            if (editing) {
                await customersAPI.Update(id, customer);
                toast.success("Le client a bien été modifié");
            } else {
                await customersAPI.Create(customer);
                toast.success("Le client a bien été créé");
                // Router a la liste des customers après avoir créé un customer
                porps.history.push('/customers');
            }
        } catch ({ response }) {
            const { violations } = response.data;
            if (violations) {
                const apiErrors = {};
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
                toast.error("Des erreurs dans votre formulaire");
            }
        }
    };

    return (
        <>
            {!editing && <h1>Création d'un client</h1> || <h1>Modification d'un client</h1>}
            {loading && <FormContentLoader />}
            {!loading && <form onSubmit={handleSubmit}>
                <Field name="firstName" label="Prénom" placeholder="Prénom du client" value={customer.firstName} onChange={handleChange} error={errors.firstName} />
                <Field name="lastName" label="Nom" placeholder="Nom du client" value={customer.lastName} onChange={handleChange} error={errors.lastName} />
                <Field name="email" label="Email" placeholder="Email du client" value={customer.email} onChange={handleChange} error={errors.email} />
                <Field name="company" label="Entreprise" placeholder="Entreprise du client" value={customer.company} onChange={handleChange} error={errors.company} />
                <div className="form-group mt-2">
                    <button type="submit" className="btn btn-primary">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>
            }
        </>);
}

export default CustomerPage;