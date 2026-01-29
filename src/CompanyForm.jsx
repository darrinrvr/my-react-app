import React, { useState } from "react";

const SIGNATURE = "916ee52c-1d16-4eb7-aff1-247ee72fe204";
const CRM_ORIGIN = "https://sandbox.crm.com";

export default function Contact({ token, onCompleted, onCancel }) {
  const identification_types=["NATIONAL ID","PASSPORT","DRIVER'S PERMIT"]
  const smodels=['RETAIL','WHOLESALE','ZERO PRICE'];
  const ctype=['PERSON','COMPANY','DIA','SPECIAL','EMPLOYEE'];
  const classi=['HFC BUNDLE','FTTH BUNDLE','CORPORATE','FTTH INTERNET','HFC INTERNET','ANALOG','TV ONLY','IP TV ONLY'];
 const pt=['NET -1','DUE IMMEDIATELY','NET 1','NET 7','NET 14','NET 30','NET 40','NET 60'];
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [contact_types,setcontact_types]=useState(ctype);
   const [classifications,setclassifications]=useState(classi);
  const [identification1_types,set_identification1_types]=useState(identification_types);
const [identification2_types,set_identification2_types]=useState(identification_types);
  const[payment_terms,set_payment_terms]=useState(pt);
  const [sales_model,set_sales_model]=useState(smodels);
  
  const [form, setForm] = useState({
    company_name: "",
    laison_first_name: "",
    liason_last_name: "",
    company_email_address: "",
    liason_email_address:"",
    company_phone: "",
    company_phone_type:"",
    laison_phone:"",
    liason_phone_type:"",
    address_line_1: "",
    address_line_2: "",
    town_city: "",
    selected_ct:"",
    selected_sm:"",
    selected_classification:"",
    identification_type_2:"",
    identification2:"",
    identification1:"",
  });

  // ✅ Raw files (not uploaded yet)
  const [files, setFiles] = useState([]);

  const ctchange= (e)=>{
 
  }

  const handleChange = (e) =>{
    setForm({ ...form, [e.target.name]: e.target.value });
  
  }
  // ----------------------------
  // FILE PICK / DROP
  // ----------------------------
  const handleFileDrop = (e) => {
    e.preventDefault();
    setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
  };

  const handleFilePick = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    e.target.value = "";
  };

  // ----------------------------
  // SUBMIT FLOW
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Waiting for CRM authorization");
    if(form.selected_ct=="")
    {
      return alert("Please Select A Contact Type")
    }
       if(form.identification_type_1=="")
    {
      return alert("Please Select An Identification Type 1")
    }
        if(form.identification_type_2=="")
    {
      return alert("Please Select An Identification Type 2")
    }
    if(form.selected_sm=="")
    {
      return alert("Please Select A Sales Model")
    }
    if(form.selected_classification=="")
    {
   return alert("Please Select A Classification")
    }

    if(form.identification_type_1==form.identification_type_2)
    {
      return alert("Please Ensure Both Identification Types Are Not The Same")
    }

       if(form.identification1==form.identification2)
    {
      return alert("Please Ensure Both Forms of Identification Values Are Not The Same")
    }
    
  


      setLoading(true);
    const body=JSON.stringify({
            contact_type: "COMPANY",
            company_name: form.company_name.toUpperCase(),
            liason_first_name: form.liason_first_name.toUpperCase(),
            company_email_address: form.company_email_address,

            phones: [
              {
                phone_type: form.company_phone_type,
                country_code: "TTO",
                number: form.company_phone_type,
                is_primary: true,
              },
              {
                phone_type: form.liason_phone_type,
                country_code: "TTO",
                number: form.liason_phone,
                is_primary: true,
              },
            ],
            addresses: [
              {
                address_type: "COMPANY",
                address_line_1: form.address_line_1.toUpperCase(),
                address_line_2: form.address_line_2.toUpperCase(),
                town_city: form.town_city,
                country_code: "TTO",
                is_primary: true,
              },
            ],
            accounts: [
    {
      name: "AR001",
      is_primary: true,
      //credit_limit: form.creditlimit,
      currency_code: "TTO",
      classification_id: form.selected_classification, //id needs to be placed here
      //payment_terms_id: form.selected_pt id needs to be placed here

    }
  ],
   custom_fields: [
    {
      "key": "contact_type",
      "value": form.selected_ct
    },
    {
      "key":"identification_type_1",
      "value":form.identification1
    },
    {
      "key":"identification_type_2",
      "value":form.identification2
    }
  ]
          });
alert(body)
    // try {
    //   // 1️⃣ Create contact (JSON)
    //   const contactRes = await fetch(
    //     "https://sandbox.crm.com/backoffice/v1/contacts",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //       body: body,
    //     }
    //   );

    //   if (!contactRes.ok) throw new Error(await contactRes.text());
    //   const contact = await contactRes.json();

      // // 2️⃣ Upload files directly to CRM (FormData)
      // if (files.length > 0) {
      //   setUploading(true);

      //   for (const file of files) {
      //     const formData = new FormData();
      //     formData.append("file_id",crypto.randomUUID())
      //     formData.append("url", file); // 👈 most CRMs expect "file"
      //     formData.append("description", file.name);
      //     alert(JSON.stringify())
      //     const fileRes = await fetch(
      //       `https://sandbox.crm.com/backoffice/v1/contacts/${contact.id}/files`,
      //       {
      //         method: "POST",
      //         headers: {
      //            "Content-Type": "application/json",
      //           Authorization: `Bearer ${token}`, 
      //         },
      //         body: formData,
      //       }
      //     );

      //     if (!fileRes.ok) {
      //       throw new Error(await fileRes.text());
      //     }
      //   }

      //   setUploading(false);
      // }

      // 3️⃣ Notify CRM
      window.top.postMessage(
        JSON.stringify({ signature: SIGNATURE, message: "COMPLETED" }),
        CRM_ORIGIN
      );

    //   onCompleted?.();
    // } catch (err) {
    //   console.error(err);
    //   alert("Submission failed:\n" + err.message);
    // } finally {
    //   setUploading(false);
    //   setLoading(false);
    // }
  };

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Contact</h3>
      {/* <div>
        <label>CONTACT TYPE</label>
        <select name="selected_ct" onChange={handleChange}>
          <option value="">Select contact type</option>

        {contact_types.map((types,i) =>(
           <option key={i} value={types}>{types}</option>
        ))}
        </select> 
      </div> */}
      <div>
       <label>COMPANY NAME</label>
      <input name="company_name" placeholder="Company Name" onChange={handleChange} required />
      </div>
     
      <div>
        <label>LIASON FIRST NAME</label>
      <input name="liason_first_name" placeholder="Liason First Name" onChange={handleChange} required />
      </div>
      <div>
      <label>LIASON LAST NAME</label>
      <input name="liason_last_name" placeholder="Liason Last Name" onChange={handleChange} required />
      </div>
      <div>
      <label>COMPANY EMAIL</label>
      <input name="company_email_address" type="email" placeholder="Company Email" onChange={handleChange} required />
      </div>
      <div>
      <label>LIASON EMAIL</label>
      <input name="liason_email_address" type="email" placeholder="Liason Email" onChange={handleChange} required />
      </div>
      <div>
       <label>COMPANY PHONE NUMBER</label> 
      <input type="tel" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" name="company_phone" placeholder="Company Phone" onChange={handleChange} required />
      </div>
        <div>
        <label>LIASON PHONE NUMBER</label> 
      <input type="tel" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" name="liason_phone" placeholder="Liason Phone" onChange={handleChange} required />
      </div>
      <div>
      <label>ADDRESS LINE 1</label>
      <input name="address_line_1" placeholder="Address Line 1" onChange={handleChange} required />
      </div>
      <div>
      <label>ADDRESS LINE 2</label>
      <input name="address_line_2" placeholder="Address Line 2" onChange={handleChange} />
      </div>
      <div>
        <label>TOWN/CITY</label>
      <input name="town_city" placeholder="City" onChange={handleChange} required />
      </div>

      <div>
        <label>LIASON IDENTIFICATION</label>
      <input name="identification1" placeholder="Identification 1" onChange={handleChange} required />
      </div>

       <div>
        <label>IDENTIFICATION 2</label>
        <select name="identification_type_2" onChange={handleChange}>
         <option value="">Select Identification </option>
         {identification1_types.map((types,i) =>(
                <option key={i} value={types}>{types}</option>
         ))}
        </select>
      <input name="identification2" placeholder="Identification 2" onChange={handleChange} required />
      </div>

<div>
  <h3> ACCOUNT</h3>
  <div>
  <label>CURRENCY</label>
  <select>
    <option value="TTO">TTO</option>
  </select>
  </div>
  <div>
    <label>CLASSIFICATION</label>
  <select name="selected_classification" onChange={handleChange}>
    <option value="">Select Classification</option>

    {classifications.map((types,i) =>(
           <option key={i} value={types}>{types}</option>
        ))}
  </select>
  </div>
  {/* <div>
    <label>CREDIT LIMIT</label>
    <input type="" name="creditlimit" placeholder="TTD 0.00" onChange={handleChange} required/>
  </div>
  <div>
   <label>PAYMENT TERMS</label>
   <select name="selected_pt" onChange={handleChange}>
    <option value="">Select Payment Terms</option>

         {payment_terms.map((types,i) =>(
           <option key={i} value={types}>{types}</option>
        ))}
  </select>
  </div> */}
    <div>
   <label>SALES MODEL</label>
   <select name="selected_sm" onChange={handleChange}>
    <option value="">Select Sales Model</option>

       {sales_model.map((types,i) =>(
           <option key={i} value={types}>{types}</option>
        ))}
  </select>
  </div>
</div>

{/* <h4>Attachments</h4>

      <div
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: "2px dashed #aaa",
          padding: 20,
          marginBottom: 10,
        }}
      >
        Drag & drop files here
      </div>

      <input type="file" multiple onChange={handleFilePick} />

      <ul>
        {files.map((f, i) => (
          <li key={i}>{f.name}</li>
        ))}
      </ul>

      {(loading || uploading) && <p>Processing...</p>}
*/}
      <button type="submit" disabled={loading || uploading}>
        {loading ? "Submitting..." : "Submit"}
      </button> 

      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}
