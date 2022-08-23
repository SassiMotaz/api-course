import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from "../js/config";
import customersAPI from "./customersAPI";

/*
*   Déconnexion de l'utilisateur (suppression du token)
*/
function Logout() {
    window.localStorage.removeItem('authToken');
    delete axios.defaults.headers['Authorization'];
}


/*
*   Requête HTTP d'authentification et stockage du token dans le localStorage
*   @param {object} credentials
*/
function authenticate(creditentials) {
    //get the token from the response
    return axios
        .post(LOGIN_API, creditentials)
        .then(Response => Response.data.token)
        .then(token => {
            //save the token in the local storage
            window.localStorage.setItem('authToken', token);
            //set the token in the axios header
            setAxiosToken(token);
        })
}


/*
*  Positionne le token dans l'header de la requête HTTP
*  @param {string} token le JWT token
*/
function setAxiosToken(token) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + token;
}

/*
*   Mise En Place lors de chargement de la page
*/
function Setup() {
    const token = window.localStorage.getItem('authToken');
    if (token) {
        const { exp: expiration } = jwtDecode(token);
        if (expiration * 1000 > Date.now()) {
            setAxiosToken(token);
        }
    }
}

/**
 * Permet savoir si l'utilisateur est authentifié ou pas
 * @returns {boolean} true si l'utilisateur est authentifié
 */
function isAuthenticated() {
    const token = window.localStorage.getItem('authToken');
    if (token) {
        const { exp: expiration } = jwtDecode(token);
        if (expiration * 1000 > Date.now()) {
            return true;
        }
        return false;
    }
    return false;
}

export default {
    authenticate,
    Logout,
    Setup,
    isAuthenticated
}