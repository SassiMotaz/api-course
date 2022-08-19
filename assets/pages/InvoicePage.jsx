import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { async } from 'regenerator-runtime';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import customersAPI from '../services/customersAPI';
import invoicesAPI from '../services/invoicesAPI';

const InvoicePage = ({history , match}) => {
    const { id = "new" } = match.params;

    const [invoice, setInvoice] = useState({
        amount: '',
        customer: '',
        status: 'SENT'
    });
    const [customers, setCustomers] = useState([]);
    const [editing , setEditing] = useState(false);

    const [errors, setErrors] = useState({
        amount: '',
        customer: '',
        status: ''
    });

    // Récupération des customers
    const fetchCustomers = async () => {
        try {
        const data =  await customersAPI.FindAll();
        setCustomers(data);
        if(!invoice.customer) setInvoice({...invoice, customer: data[0].id});
        } catch (error) {
            console.log(error.message);
        }
    }
    // Récupération d'une facture
    const fetchInvoices = async id => {
        try {
            const { amount, status, customer }  = await invoicesAPI.find(id);
            setInvoice({ amount, status, customer: customer.id });
        } catch (error) {
            console.log(error.response);
            history.replace('/invoices');
        }
    }
    // Récupération des clients à chaque chargement du composant
    useEffect(() => {
        fetchCustomers();
        } , []);

    // Récupération de la facture en fonction de l'identifiant
    useEffect(() => {
        if(id !== 'new') {
            setEditing(true);
            fetchInvoices(id);
        }
    } , [id]);
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setInvoice({ ...invoice, [name]: value });
    }
    // gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if(editing) {
                await invoicesAPI.update(id, invoice);
                //TO DO : message de confirmation
            } else {
             await  invoicesAPI.create(invoice);
             //TO DO : message de confirmation
             history.replace('/invoices');
            }
            history.replace('/invoices');
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
    }

    return (
        <>
            {!editing && <h1>Création d'une facture</h1> || <h1>Modification d'une facture</h1>}
            <form onSubmit={handleSubmit}>
                <Field name="amount" label="Montant" type="number" value={invoice.amount} onChange={handleChange} placeholder="Montant de la facture" error={errors.amount} />
                <Select
                    name="customer"
                    label="Client"
                    value={invoice.customer}
                    onChange={handleChange}
                    error={errors.customer} >
                    {customers.map(customer => <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>)}
                </Select>
                <Select
                    name="status"
                    label="Statut"
                    value={invoice.status}
                    onChange={handleChange}
                    error={errors.status} >
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>
                <div className="form-group">
                    <button type="submit" className="btn btn-success mt-2">Enregistrer</button>
                    <Link to="/invoices" className="btn btn-link mt-2">Retour à la liste</Link>
                </div>
            </form>

        </>
    );
}

export default InvoicePage;