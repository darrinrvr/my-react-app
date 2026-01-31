import React, { useState } from "react";
import "./Contact.css";
import ContactType from "./ContactType";
const SIGNATURE = "916ee52c-1d16-4eb7-aff1-247ee72fe204";
const CRM_ORIGIN = "https://sandbox.crm.com";

export default function Contact({ token, onCompleted, onCancel,ContactType }) {
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
  const [authorityswitch,setauthorityswitch]=useState(false)
  const [form, setForm] = useState({
    department:"",
    position:"",
    first_name: "",
    middle_name: "",
    last_name: "",
    email_address: "",
    phone: "",
    phone_type:"",
    address_line_1: "",
    address_line_2: "",
    town_city: "",
    selected_ct:"",
    selected_pt:"",
    selected_sm:"",
    selected_classification:"",
    creditlimit:"",
    second_phone:"",
    second_phone_type:"",
    identification_type_1:"",
    identification_type_2:"",
    identification1:"",
    identification2:"",
    authorized_personnel:"",
    authorized_personnel_phone:"",
  });

  // ✅ Raw files (not uploaded yet)
  const [files, setFiles] = useState([]);

   const aswitch=()=>{
    setauthorityswitch(!authorityswitch)
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
            contact_type: ContactType,
          
            first_name: form.first_name.toUpperCase(),
            middle_name: form.middle_name.toUpperCase(),
            last_name: form.last_name.toUpperCase(),
            email_address: form.email_address,
            phones: [
              {
                phone_type: form.phone_type,
                country_code: "TTO",
                number: form.phone,
                is_primary: true,
              },
              {
                phone_type: form.phone_type,
                country_code: "TTO",
                number: form.phone,
                is_primary: true,
              },
            ],
            addresses: [
              {
                address_type: "HOME",
                address_line_1: form.address_line_1.toUpperCase(),
                address_line_2: form.address_line_2.toUpperCase(),
                town_city: form.town_city.toUpperCase(),
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
      "value":form.identification_type_1
    },
    {
      "key":"identification_type_2",
      "value":form.identification_type_2
    },
     {
      "key":"identification1",
      "value":form.identification1.toUpperCase()
    },
    {
      "key":"identification2",
      "value":form.identification2.toUpperCase()
    },
    {
      "key":"department",
      "value":form.department.toUpperCase()
    },
    {
      "key":"position",
      "value":form.position.toUpperCase()
    },
   {
      "key":"authorized_personnel",
      "value":form.authorized_personnel
    },
     {
      "key":"authorized_personnel_phone",
      "value":form.authorized_personnel_phone
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
      <h3>CREATE {ContactType}</h3>
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
       <label>DEPARTMENT</label>
      <input name="department" placeholder="Department" onChange={handleChange} required />
      </div>
       <div>
       <label>POSITION</label>
      <input name="position" placeholder="Position" onChange={handleChange} required />
      </div>
      <div>
       <label>FIRST NAME</label>
      <input name="first_name" placeholder="First Name" onChange={handleChange} required />
      </div>
      <div>
        <label>MIDDLE NAME</label>
      <input name="middle_name" placeholder="Middle Name" onChange={handleChange} />
      </div>
      <div>
        <label>LAST NAME</label>
      <input name="last_name" placeholder="Last Name" onChange={handleChange} required />
      </div>
      <div>
      <label>EMAIL</label>
      <input name="email_address" type="email" placeholder="Email" onChange={handleChange} required />
      </div>
      <div>
       <label>PRIMARY PHONE NUMBER</label> 
      <input type="tel" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" name="phone" placeholder="Phone" onChange={handleChange} required />
      </div>
        <div>
        <label>ALTERNATE PHONE NUMBER</label> 
      <input type="tel" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" name="phone" placeholder="Phone" onChange={handleChange} required />
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
     <input name="bill" placeholder="Bill" onChange={handleChange} required />
     <div></div>
     <input name="attachbill" type="file" required/>
     </div>
     
      <div>
      <label>
        <input
          type="checkbox"
          checked={authorityswitch}
          onChange={aswitch}
        />
        
      </label>
    {authorityswitch && (
       <div>
        <input
        type="text"
        name="authorized_personnel"
        placeholder="NAME OF AUTHORIZED PERSONNEL"
        // Conditionally apply the required attribute
        // If isRequired is true, the attribute "required" is present.
        // If isRequired is false, the attribute is not present.
        {...(authorityswitch ? { required: true } : {})}
      />
          <input
        type="tel"
        name="authorized_personnel_phone"
        placeholder="NUMBER OF AUTHORIZED PERSONNEL"
        // Conditionally apply the required attribute
        // If isRequired is true, the attribute "required" is present.
        // If isRequired is false, the attribute is not present.
        {...(authorityswitch ? { required: true } : {})}
      />
        </div>
    )}

     </div>


{/* IDENTIFICATION */}
     <div>
        <label>IDENTIFICATION 1</label>
        <select name="identification_type_1" onChange={handleChange}>
         <option value="">Select Identification Type 1</option>
         {identification1_types.map((types,i) =>(
                <option key={i} value={types}>{types}</option>
         ))}
        </select>
      
      <input name="identification1" placeholder="Identification 1" onChange={handleChange} required />
       <input name="attachmentid1" type="file"/>
      </div>
       <div>
        <label>IDENTIFICATION 2</label>
        <select name="identification_type_2" onChange={handleChange}>
         <option value="">Select Identification Type 2</option>
         {identification1_types.map((types,i) =>(
                <option key={i} value={types}>{types}</option>
         ))}
        </select>
        <div></div>
      <input name="identification2" placeholder="Identification 2" onChange={handleChange} required />
     
     <input name="attachmentid2" type="file"/>
      </div>

<div>
  <h3>ACCOUNT</h3>
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
