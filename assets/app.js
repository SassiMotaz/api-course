// Import th module react from 'react';
import React, { useState } from 'react';
// Import th module reactDom from 'react-dom';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthContext from './Contexts/AuthContext';

/*
 * Welcome to your app's main JavaScript file!
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

// start the Stimulus application
import './bootstrap';

import PriavteRoute from './components/PriavteRoute';
import CustomersPage from './pages/CustomersPage';
import HomePage from './pages/HomePage';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/LoginPage';
import AuthAPI from './services/AuthAPI';
import CustomerPage from './pages/CustomerPage';
import InvoicePage from './pages/InvoicePage';
import RegisterPage from './pages/RegisterPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


AuthAPI.Setup();


const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());

    const NavBarWithRouter = withRouter(Navbar);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated
        }}>
        <HashRouter>
            <NavBarWithRouter/>
            <main className="container pt-5">
                <Switch>
                    <Route path={'/Login'} component={LoginPage} />
                    <Route path={'/Register'} component={RegisterPage} />
                    <PriavteRoute path={'/Invoices'}  component={InvoicesPage} />
                    <PriavteRoute path={'/Invoice/:id'} component={InvoicePage} />
                    <PriavteRoute path={'/Customers/:id'} component={CustomerPage} />
                    <PriavteRoute path={'/Customers'} component={CustomersPage} />
                    <Route path="/" component={HomePage} />
                </Switch>
            </main>
        </HashRouter> 
        <ToastContainer position='bottom-left' />
        </AuthContext.Provider>
    )
}
const rootElement = document.getElementById('app');
ReactDOM.render(<App />, rootElement);