import React, { useState,useEffect } from "react";

export default function Invoices({token})
{

  const [PostData,setPostData]=useState([]);

    useEffect(()=>
    {
     const fetchPost = async () => {
        const response = await fetch(`https://sandbox.crm.com/backoffice/v1/invoices/130360e1-781c-41b2-9bc0-4e197e8573a0`,
            {
          method: 'GET', // Or 'POST', 'PUT', etc.
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Setting the Authorization header
          },
        });

        
        const data = await response.json();
        setPostData(data);
      
      };
    fetchPost();



 } );

     function postalert()
    {
        alert(JSON.stringify(PostData))
    }
     const handleClick = () => {
    alert('Button clicked!');
  };
          return(
    <>
       <h1>Hello</h1>
       <button onClick={handleClick}>CLICK ME</button>
       <button onClick={postalert}>CLICK ME</button>
    </>
 );

}