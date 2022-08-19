import React from 'react';


// -nom du composant : Field
// -label
// -value
// -OnChange
// -type 
// -placeholder
// -error

const Field = ({ name, label, value, onChange, placeholder, type ="text", error=""}) =>

    (<div className="form-group">
        <label htmlFor={name}>{label}</label>
        <input type={type} className={"form-control mt-2 mb-2" + (error && " is-invalid")} 
        name={name} placeholder={placeholder} id={name} value={value}
        onChange={onChange} />
        {error && <div className="invalid-feedback">{error}</div>}
    </div>);

export default Field;