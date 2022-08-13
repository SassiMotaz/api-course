import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from '../Contexts/AuthContext';


const PriavteRoute = ({ path, component }) => {

    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? (<Route path={path} component={component} />) : (<Redirect to="/Login" />);
}

export default PriavteRoute;