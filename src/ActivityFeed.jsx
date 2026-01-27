import React, { useState,useEffect } from "react";

export default ActivityFeed({contactid,token})
{
const [PostData,setPostData]=useState([]);

    useEffect(()=>
    {
     const fetchPost = async () => {
        const response = await fetch(`https://sandbox.crm.com/backoffice/v2/contacts/${contactid}/activity_feed?activity_type=INVOICE`,
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

 return(
    <>
       {PostData?.content?.map(()=>{
         <div key={contact.number}>
    INVOICE
    <button>{contact.number}</button>
  </div>
       })}
    </>
 )
}