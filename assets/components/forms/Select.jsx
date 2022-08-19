import React from 'react';


const Select = ({ name, label, value, onChange, error="" , children }) => {
    return ( 
        <div className="form-group">
                    <label htmlFor={name}>{label}</label>
                    <select className={"form-control form-select " + (error && "is-invalid")} name={name} value={value} onChange={onChange}> 
                        {children}
                    </select>
                    <p className="invalid-feedback">{error}</p>
                </div>
     );
}
 
export default Select;