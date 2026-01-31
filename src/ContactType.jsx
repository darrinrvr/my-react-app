import React, { useState,useEffect } from "react";
import "./Contact.css";
const SIGNATURE = "916ee52c-1d16-4eb7-aff1-247ee72fe204";
const CRM_ORIGIN = "https://sandbox.crm.com";
export default function ContactType({sendcontacttype})
{
 const ctype=['PERSON','COMPANY','DIA','SPECIAL','EMPLOYEE'];
const [contact_types,setcontact_types]=useState(ctype);
 const [selected_ct,setselected_ct]=useState();
 useEffect(() => {
  if (selected_ct) {
   
sendcontacttype(selected_ct)
  }
}, [selected_ct]);
   const handleChange = (e) =>{
    const value=e.target.value
    setselected_ct(value);
    sendcontacttype(selected_ct)
  }
 
    return(
    <div>
        <label>CONTACT TYPE</label>
        <select name="selected_ct" onChange={handleChange}>
          <option value="">Select contact type</option>

        {contact_types.map((types,i) =>(
           <option key={i} value={types}>{types}</option>
        ))}
        </select> 
      </div>
    )
}
