
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import customersAPI from '../services/customersAPI';

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const itemsPerPages = 10;


    const fetchCustomers = async () => {
        try {
            const data = await customersAPI.FindAll();
            setCustomers(data);
        }
        catch (error) {
            console.log(error.response);
        }
    }
    useEffect(() => {
        fetchCustomers();}
        , []);

    const handleDelete = async (id) => {
        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id));
        try {
            await customersAPI.deleteCustomer(id);
        }
        catch (error) {
            console.log(error.response);
            setCustomers(originalCustomers);
        }
    }
    

    const handlePageChange = (page) => {setCurrentPage(page);}

    const handleSearch = event => {
        setSearch(event.currentTarget.value);
        setCurrentPage(1);
    }
    const filteredCustomers = customers.filter(c =>
        c.firstName.toLowerCase().includes(search.toLowerCase())
        || c.lastName.toLowerCase().includes(search.toLowerCase())
        || c.email.toLowerCase().includes(search.toLowerCase())
        || c.company.toLowerCase().includes(search.toLowerCase()));

    const currentCustomers = Pagination.getData(filteredCustomers, currentPage, itemsPerPages);

    return (
        <>
            <h1>Liste des clients</h1>
            <div className="form-group">
                <input className="form-control me-sm-2" type="text" placeholder="Rechercher" value={search} onChange={handleSearch} ></input>
            </div>
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
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(customer.id)} disabled={customer.invoices.length > 0}>Supprimer</button>   
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {itemsPerPages < filteredCustomers.length &&
                <Pagination currentPage={currentPage} itemsPerPages={itemsPerPages} onPageChanged={handlePageChange}  length={filteredCustomers.length}  />
            }
        </>
    );
}

export default CustomersPage;
