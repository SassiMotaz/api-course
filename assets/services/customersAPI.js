import axios from "axios";

async function FindAll() {
    const response = await axios.get("https://127.0.0.1:8000/api/customers");
    return response.data["hydra:member"];
}

function Find(id) {
    return  axios.get(`/api/customers/${id}`)
    .then(response =>  response.data);
}


function deleteCustomer(id) {
    return axios.delete(`https://127.0.0.1:8000/api/customers/${id}`)
}

function Update (id, customer) {
    return  axios.put(`/api/customers/${id}`, customer);
}

function Create (customer) {
    return  axios.post('/api/customers', customer);
}



export default {
    FindAll , 
    Find,
    Update,
    Create,
    deleteCustomer

}