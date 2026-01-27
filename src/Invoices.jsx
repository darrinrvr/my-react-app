import React, { useState,useEffect } from "react";

export default function Invoices({token})
{

  const [PostData,setPostData]=useState([]);

    useEffect(()=>
    {
     const fetchPost = async () => {
        const response = await fetch(`https://sandbox.crm.com/backoffice/v2/invoices`,
            {
          method: 'GET', // Or 'POST', 'PUT', etc.
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`, // Setting the Authorization header
          },
        });

        
        const data = await response.json();
        setPostData(data);
      
      };
    fetchPost();



 }, [PostData] );

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

       
{PostData?.content?.map(invoice => (
  <div key={invoice.id}>
    {JSON.stringify(invoice)}
  </div>
))}
       
   
    </>
 );

}