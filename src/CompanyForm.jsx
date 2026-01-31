import React, { useState } from "react";

const SIGNATURE = "916ee52c-1d16-4eb7-aff1-247ee72fe204";
const CRM_ORIGIN = "https://sandbox.crm.com";

export default function CompanyForm({ token, onCompleted, onCancel,ContactType }) {
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
    selected_ct:"",
    company_name: "",
    laison_first_name: "",
    liason_last_name: "",
    company_email_address: "",
    liason_email_address:"",
    company_phone: "",
    ext_phone:"",
    company_phone_type:"",
    laison_phone:"",
    liason_phone_type:"",
    address_line_1: "",
    address_line_2: "",
    town_city: "",
   
    selected_sm:"",
    selected_classification:"",
    identification_type_2:"",
    liason_employment_identification:"",
    liason_personal_identification:""
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
    // if (!token) return alert("Waiting for CRM authorization");
    // if(form.selected_ct=="")
    // {
    //   return alert("Please Select A Contact Type")
    // }
       if(form.identification_type_1=="")
    {
      return alert("Please Select An Identification Type 1")
    }
        if(form.identification_type_2=="")
    {
      return alert("Please Select An Identification Type")
    }
    if(form.selected_sm=="")
    {
      return alert("Please Select A Sales Model")
    }
    if(form.selected_classification=="")
    {
   return alert("Please Select A Classification")
    }

  

    if(form.liason_employment_identification==form.liason_personal_identification)
    {
      return alert("Please Ensure Both Forms of Identification Values Are Not The Same")
    }
    
  


      setLoading(true);
    const body=JSON.stringify({
            contact_type: ContactType,
            company_name: form.company_name.toUpperCase(),
            liason_first_name: form.liason_first_name.toUpperCase(),
            company_email_address: form.company_email_address,

            phones: [
              {
                phone_type: "LANDLINE",
                country_code: "TTO",
                number: form.company_phone,
                is_primary: true,
              },
              {
                phone_type: "MOBILE",
                country_code: "TTO",
                number: form.liason_phone,
                is_primary: true,
              },
            ],
            addresses: [
              {
                address_type: "BUSINESS",
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
      "key":"identification1",
      "value":form.liason_employment_identification
    },
  
    {
      "key":"identification_type_2",
      "value":form.liason_personal_identification_type
    },
 
    {
      "key":"identification2",
      "value":form.liason_personal_identification
    },
    {
      "key":"ext_phone",
      "value":form.ext_phone
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
      <div style={{display: "flex"}}>
        <input type="tel" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" name="company_phone" placeholder="Company Phone" onChange={handleChange} required />
        <input type="tel" pattern="^([0-9]{3}|[0-9]{4}|[0-9]{5})$" name="ext_phone" placeholder="Extension" onChange={handleChange} required />
      </div> 
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
      <label>LIASON EMPLOYMENT IDENTIFICATION</label>
      <div>
         <input name="liason_employment_identification" placeholder="Liason Employment Identification" onChange={handleChange} required />
         <input name="attach_emp_id" type="file" />
      </div>
     
      </div>

       <div>
        <label>LIASON PERSONAL IDENTIFICATION</label>
        <select name="liason_personal_identification_type" onChange={handleChange}>
         <option value="">Select Identification </option>
         {identification1_types.map((types,i) =>(
                <option key={i} value={types}>{types}</option>
         ))}
        </select>
        <div></div>
      <div>
        <input name="liason_personal_identification" placeholder="Liason Personal Identification" onChange={handleChange} required />
        <input name="attach_person_id" type="file"/>
      </div>
      
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
