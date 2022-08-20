
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TableLoader from '../components/loders/TableLoader';
import Pagination from '../components/Pagination';
import customersAPI from '../services/customersAPI';
import { toast } from 'react-toastify';


const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const itemsPerPages = 10;


    const fetchCustomers = async () => {
        try {
            const data = await customersAPI.FindAll();
            setCustomers(data);
            setLoading(false);
        }
        catch (error) {
            toast.error("impossible de charger les clients");
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
            toast.success("Le client a bien été supprimé");
        }
        catch (error) {
            toast.error("impossible de supprimer le client");
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
            <div className=" mb-3 d-flex justify-content-between align-items-center">
                <h1>Liste des clients</h1>
                <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>
            </div>
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
                { !loading &&<tbody>
                    {currentCustomers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td> 
                                <Link to={"/customers/" + customer.id}>  {customer.firstName} {customer.lastName} </Link></td>
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
                </tbody>}
            </table>
            {loading && <TableLoader />}
            {itemsPerPages < filteredCustomers.length &&
                <Pagination currentPage={currentPage} itemsPerPages={itemsPerPages} onPageChanged={handlePageChange}  length={filteredCustomers.length}  />
            }
        </>
    );
}

export default CustomersPage;
