import React, { useState } from "react";

const SIGNATURE = "916ee52c-1d16-4eb7-aff1-247ee72fe204";
const CRM_ORIGIN = "https://sandbox.crm.com";

export default function Contact({ token, onCompleted, onCancel }) {

  const smodels=['RETAIL','WHOLESALE','ZERO PRICE']
  const ctype=['PERSON','COMPANY','DIA','SPECIAL','EMPLOYEE']
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [contact_types,setcontact_types]=useState(ctype)
   const [classifications,setclassifications]=useState(['HFC BUNDLE','FTTH BUNDLE','CORPORATE','FTTH INTERNET','HFC INTERNET','ANALOG','TV ONLY','IP TV ONLY'])

  const[payment_terms,set_payment_terms]=useState(['NET -1','DUE IMMEDIATELY','NET 1','NET 7','NET 14','NET 30','NET 40','NET 60'])
  const [sales_model,set_sales_model]=useState(smodels[0])
  
  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email_address: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    town_city: "",
    selected_ct:"",
    selected_pt:"",
    selected_sm:"",
    selected_classification:"",
    creditlimit:""
  });

  // ✅ Raw files (not uploaded yet)
  const [files, setFiles] = useState([]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
    alert(JSON.stringify(form))
    setLoading(true);

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
    //       body: JSON.stringify({
    //         contact_type: "PERSON",
    //         first_name: form.first_name.toUpperCase(),
    //         middle_name: form.middle_name.toUpperCase(),
    //         last_name: form.last_name.toUpperCase(),
    //         email_address: form.email_address,
    //         phones: [
    //           {
    //             phone_type: "MOBILE",
    //             country_code: "TTO",
    //             number: form.phone,
    //             is_primary: true,
    //           },
    //         ],
    //         addresses: [
    //           {
    //             address_type: "HOME",
    //             address_line_1: form.address_line_1.toUpperCase(),
    //             address_line_2: form.address_line_2.toUpperCase(),
    //             town_city: form.town_city,
    //             country_code: "TTO",
    //             is_primary: true,
    //           },
    //         ],
    //       }),
    //     }
    //   );

    //   if (!contactRes.ok) throw new Error(await contactRes.text());
    //   const contact = await contactRes.json();

    //   // 2️⃣ Upload files directly to CRM (FormData)
    //   if (files.length > 0) {
    //     setUploading(true);

    //     for (const file of files) {
    //       const formData = new FormData();
    //       formData.append("file_id",crypto.randomUUID())
    //       formData.append("url", file); // 👈 most CRMs expect "file"
    //       formData.append("description", file.name);
    //       alert(JSON.stringify())
    //       const fileRes = await fetch(
    //         `https://sandbox.crm.com/backoffice/v1/contacts/${contact.id}/files`,
    //         {
    //           method: "POST",
    //           headers: {
    //              "Content-Type": "application/json",
    //             Authorization: `Bearer ${token}`, 
    //           },
    //           body: formData,
    //         }
    //       );

    //       if (!fileRes.ok) {
    //         throw new Error(await fileRes.text());
    //       }
    //     }

    //     setUploading(false);
    //   }

    //   // 3️⃣ Notify CRM
    //   window.top.postMessage(
    //     JSON.stringify({ signature: SIGNATURE, message: "COMPLETED" }),
    //     CRM_ORIGIN
    //   );

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
      <div>
        <label>CONTACT TYPE</label>
        <select name="selected_ct" value={form.selected_ct} onChange={handleChange}>
        {contact_types.map((types,i) =>(
           <option key={i} value={types}>{types}</option>
        ))}
        </select> 
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
        <div>PHONE NUMBER</div>
      <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="phone" placeholder="Phone" onChange={handleChange} required />
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
    {/* {classifications.map(classification=>{
      <option  value={classification}>{classification}</option>
    })
     } */}
  </select>
  </div>
  <div>
    <label>CREDIT LIMIT</label>
    <input type="" name="creditlimit" placeholder="TTD 0.00" onChange={handleChange} required/>
  </div>
  <div>
   <label>PAYMENT TERMS</label>
   <select name="selected_pt" onChange={handleChange}>
        {/* {payment_terms?.map(pt=>{
          <option key={index} value={pt}>{pt}</option>
        })
        } */}
  </select>
  </div>
    <div>
   <label>SALES MODEL</label>
   <select name="selected_sm" onChange={handleChange}>
        {/* {sales_model?.map(sm=>{
          <option value={sm}>{sm}</option>
        })
        } */}
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
