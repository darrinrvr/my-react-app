import React, { useState,useEffect } from "react";

export default function Invoices({token})
{

  const [PostData,setPostData]=useState([]);

    useEffect(()=>
    {
     const fetchPost = async () => {
        const response = await fetch(`https://sandbox.crm.com/backoffice/v1/invoices/{7215f112-8080-48f6-8e6e-3bfb60670e8e}`,
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



 }, [token] );

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