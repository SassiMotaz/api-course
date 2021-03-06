import axios from "axios";

function FindAll() {
    return axios.get("https://127.0.0.1:8000/api/customers")
        .then(response => response.data["hydra:member"]);
}

function deleteCustomer(id) {
    return axios.delete(`https://127.0.0.1:8000/api/customers/${id}`)
}
export default {
    FindAll , 
    deleteCustomer
}