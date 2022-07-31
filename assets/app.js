// Import th module react from 'react';
import React from 'react';
// Import th module reactDom from 'react-dom';
import ReactDOM from 'react-dom';
import Navbar from './components/Navbar';
import { HashRouter , Switch , Route} from 'react-router-dom';

/*
 * Welcome to your app's main JavaScript file!
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

// start the Stimulus application
import './bootstrap';
import HomePage from './pages/HomePage';
import CustomersPageWithPagination from './pages/CustomersPageWithPagination';
import CustomersPage from './pages/CustomersPage';
import InvoicesPage from './pages/InvoicesPage';

const App = () => {
    return (
    <HashRouter>
    <Navbar />
    <main className="container pt-5">
        <Switch>
            <Route path={'/Invoices'} component={InvoicesPage} />
            <Route path={'/Customers'} component={CustomersPage} />
            <Route path="/" component={HomePage} />
        </Switch>
    </main>
    </HashRouter>
)
}
const rootElement = document.getElementById('app');
ReactDOM.render(<App />, rootElement);