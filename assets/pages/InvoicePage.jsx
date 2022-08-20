import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { async } from 'regenerator-runtime';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import FormContentLoader from '../components/loders/FormContentLoader';
import customersAPI from '../services/customersAPI';
import invoicesAPI from '../services/invoicesAPI';
import { toast } from 'react-toastify';

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
    const [loading, setLoading] = useState(true);
    // Récupération des customers
    const fetchCustomers = async () => {
        try {
        const data =  await customersAPI.FindAll();
        setCustomers(data);
        setLoading(false);
        if(!invoice.customer) setInvoice({...invoice, customer: data[0].id});
        } catch (error) {
            toast.error("Les clients n'ont pas pu être chargés");
            history.replace('/invoices');
        }
    }
    // Récupération d'une facture
    const fetchInvoices = async id => {
        try {
            const { amount, status, customer }  = await invoicesAPI.find(id);
            setInvoice({ amount, status, customer: customer.id });
            setLoading(false);
        } catch (error) {
            toast.error("La facture n'a pas pu être chargée");
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
                toast.success("La facture a bien été modifiée");
            } else {
             await  invoicesAPI.create(invoice);
             //TO DO : message de confirmation
                toast.success("La facture a bien été créée");
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
            toast.error("Une erreur est survenue");
        }
    }

    return (
        <>
            {!editing && <h1>Création d'une facture</h1> || <h1>Modification d'une facture</h1>}
            {loading && <FormContentLoader />}
            {!loading && 
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
                    <option value="CANCELED">Annulée</option>
                </Select>
                <div className="form-group">
                    <button type="submit" className="btn btn-success mt-2">Enregistrer</button>
                    <Link to="/invoices" className="btn btn-link mt-2">Retour à la liste</Link>
                </div>
            </form>
            }

        </>
    );
}

export default InvoicePage;