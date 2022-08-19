import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import customersAPI from '../services/customersAPI';


const CustomersPageWithPagination = () => {
    const [customers, setCustomers] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loding, setLoading] = useState(true);
    const itemsPerPages = 10; // nombre d'éléments par page
    
    
        useEffect(() => {
        axios.get(`/api/customers?pagination=true&count=${itemsPerPages}&currentpage=${currentPage}`)
            .then(response => {
                setCustomers(response.data['hydra:member']);
                setTotalItems(response.data['hydra:totalItems']);
                setLoading(false);
            }
            ).catch(error => { console.log(error); });
    }, [currentPage]); // <-- this is the key to the pagination
    
    const handleDelete = async id => {
        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id));
        try {
            await customersAPI.deleteCustomer(id);
        }
        catch (error) {
            setCustomers(originalCustomers);
        }
    }
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
        setLoading(true);
    }

    
    const currentCustomers = Pagination.getData(customers, currentPage, itemsPerPages);

    return (
        <>
            <h1>Liste des clients(Pagination)</h1>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center" >Factures</th>
                        <th className="text-center">Montant totale</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {currentCustomers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td> {customer.firstName} {customer.lastName} </td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className="text-center">
                                <span className="badge bg-primary">
                                    {customer.invoices.length}
                                </span>
                            </td>
                            <td className="text-center">
                                {customer.totalAmount.toLocaleString()}
                            </td>
                            <td>
                                <button
                                    onClick={() => { handleDelete(customer.id); }}
                                    disabled={customer.invoices.length > 0}
                                    className="btn btn-sm btn-danger">
                                    supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination currentPage={currentPage} itemsPerPages={itemsPerPages} length={totalItems} onPageChanged={handlePageChange} />
        </>
    );
}

export default CustomersPageWithPagination;
