import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';

import moment from 'moment';
import invoicesAPI from '../services/invoicesAPI';
import { Link } from 'react-router-dom';

const STATUS_CLASSES = {
    PAID: 'badge bg-success',
    SENT: 'badge bg-info',
    CANCELED: 'badge bg-danger',
}
const STATUS_LABELS = {
    PAID: 'Payée',
    SENT: 'Envoyée',
    CANCELED: 'Annulée',
}

const InvoicesPage = (props) => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const itemsPerPages = 10; // nombre d'éléments par page

    const fetchInvoices = async () => {
        try {
            const data = await invoicesAPI.findAll();
            setInvoices(data);
        }
        catch (error) {
            console.log(error.response);
        }
    }
    useEffect(() => {
        fetchInvoices();
    }
        , []);

    const formatdate = (date) => {
        return moment(date).format('DD/MM/YYYY');
    }


    const handleDelete = async (id) => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id));
        try {
            await invoicesAPI.deleteInvoice(id);
        }
        catch (error) {
            setInvoices(originalInvoices);
            console.log(error.response);
        }
    }
    const handlePageChange = (page) => {
        setCurrentPage(page);
    }


    const handleSearch = event => {
        setSearch(event.currentTarget.value);
        setCurrentPage(1);
    }
    


    const filteredInvoices = invoices.filter(i =>
        i.customer.firstName.toLowerCase().includes(search.toLowerCase())
        || i.customer.lastName.toLowerCase().includes(search.toLowerCase())
        || i.amount.toString().startsWith(search.toLowerCase())
        || STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())

    );
    const items = Pagination.getData(filteredInvoices, currentPage, itemsPerPages);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
            <h1>Liste des factures</h1> 
            <Link to="/invoice/new" className="btn btn-primary">Créer une facture</Link>
            </div>
            <div className="form-group">
                <input className="form-control me-sm-2" type="text" placeholder="Rechercher" value={search} onChange={handleSearch} ></input>
            </div>
            <table className="table table-hover">
                <thead>
                    <tr className='text-center'>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th>Date d'envoi</th>
                        <th>Statut</th>
                        <th>Montant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(invoice =>
                        <tr key={invoice.id} className='text-center'>
                            <td>{invoice.chrono}</td>
                            <td>{invoice.customer.firstName} {invoice.customer.lastName}</td>
                            <td>{formatdate(invoice.sentAt)}</td>
                            <td><span className={STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span></td>
                            <td>{invoice.amount.toLocaleString()} €</td>
                            <td>
                                <Link to={"/invoice/" + invoice.id} className="btn btn-sm btn-primary mr-1">Editer</Link>
                                <button className="btn btn-sm btn-danger mx-1" onClick={()=>handleDelete(invoice.id)}>Supprimer</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Pagination currentPage={currentPage} itemsPerPages={itemsPerPages} length={filteredInvoices.length} onPageChanged={handlePageChange} />
        </>
    );
};




export default InvoicesPage;