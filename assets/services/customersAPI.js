import axios from "axios";
import { async } from "regenerator-runtime";
import { CUSTOMERS_API } from "../js/config";
import cache from "./cache";


async function FindAll() {
    const cachedCustomers = await cache.get('customers');
    if (cachedCustomers) {
        return cachedCustomers;
    }
    return axios.get(CUSTOMERS_API)
    .then(response => {
        const customers = response.data["hydra:member"];
        cache.set('customers', customers);
        return customers;
    }
    );
}

async function Find(id){
    const cachedCustomers = await cache.get('customers.' + id);
    if (cachedCustomers) return cachedCustomers;
    return axios.get(CUSTOMERS_API + '/' + id)
            .then(response => {
        const customer = response.data;
        cache.set("customers." + id, customer);
        return customer;
    });

}



function deleteCustomer(id) {
    return axios.delete(CUSTOMERS_API + '/' + id).then(async response => {
        const cachedCustomers = await cache.get('customers');
        if (cachedCustomers) {
            const newCustomers = cachedCustomers.filter(customer => customer.id !== id);
            cache.set('customers', newCustomers);
            return newCustomers;
        }
        return response.data;
    }
    );
}
       

function Update (id, customer) {
    return  axios.put(CUSTOMERS_API + '/' + id, customer).then(async response => {
        const cachedCustomers = await cache.get('customers');
        const cachedCustomer = await cache.get('customers.' + id);

        if (cachedCustomer){
            cache.set('customers.' + id, response.data);
        }

        if (cachedCustomers) {
            const index = cachedCustomers.findIndex(customer => customer.id === +id);
            cachedCustomers[index] = response.data;
            //cache.set('customers', cachedCustomers);
        }
        return response.data;
    });
}

async function Create (customer) {
    const response = await axios.post(CUSTOMERS_API, customer);
    const cachedCustomers = await cache.get('customers');
    if (cachedCustomers) {
        cache.set('customers', [...cachedCustomers, response.data]);
    }
    return await response.data;
}



export default {
    FindAll , 
    Find,
    Update,
    Create,
    deleteCustomer

}