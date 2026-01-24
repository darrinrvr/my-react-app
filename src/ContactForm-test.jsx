import React, { useState } from "react";

const SIGNATURE = "9df5b0c8-5375-47e4-8e50-87e426132c9a";
const CRM_ORIGIN = "https://sandbox.crm.com";

export default function ContactForm({ token, onCompleted, onCancel }) {
  const [loading, setLoading] = useState(false);
  const options=["EMPLOYEE","PERSON","COMPANY","DIA","SPECIAL"];
  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email_address: "",
    phone: "868",
    address_line_1: "",
    address_line_2: "",
    town_city: "",
    dp_number:"",
    contact_type:""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!token) {
    //   alert("Waiting for CRM authorization...");
    //   return;
    // }

    // setLoading(true);

    // === Fixed payload for CRM ===
    const payload = {
      contact_type: "PERSON",
      
      first_name: form.first_name.toUpperCase(),
      middle_name: form.middle_name.toUpperCase() || "",
      last_name: form.last_name.toUpperCase(),
      
      email_address: form.email_address,
      phones:[
        {
           is_primary: true,
          country_code: "TTO",
          number: form.phone,
         
          phone_type: "MOBILE",
        }],
      
      addresses: 
        [{
          address_type: "HOME",          // REQUIRED
          name:"",
          is_primary: true,
          address_line_1: form.address_line_1.toUpperCase(),
          address_line_2: form.address_line_2.toUpperCase() || "",
           state_province_county:"",
          town_city: form.town_city.toUpperCase(),
          postal_code:"",
          country_code: "TTO",           // REQUIRED
          lat:"",
          lon:"",
          google_place_id:""

// "type": "ALTERNATIVE",
//         "name": "Engomi office",
//         "is_primary": true,
//         "address_line_1": "21 Elia Papakyriakou",
//         "address_line_2": "7 Stars Tower",
//         "state_province_county": "Egkomi",
//         "town_city": "Nicosia",
//         "postal_code": "2415",
//         "country_code": "CYP",
//         "lat": 35.157115,
//         "lon": 33.313719,
//         "google_place_id": "ChIJrTLr-GyuE

        }],
         custom_fields:[
        {
          key:"dp_number",
          value:form.dp_number
        },
        {
          key:"contact_type",
          value:form.contact_type
        }
      ], 
      
    };
    alert(JSON.stringify(payload));
    console.log("Submitting payload to CRM:", payload);
    console.log("Token:", token);

    try {
      const res = await fetch(
        "https://sandbox.crm.com/backoffice/v1/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("CRM API error:", text);
        alert("Failed to create contact: " + text);
        return;
      }

      const data = await res.json();
      console.log("CRM contact created:", data);

      

      // Notify CRM iframe that we're done
      window.top.postMessage(
        JSON.stringify({ signature: SIGNATURE, message: "COMPLETED" }),
        CRM_ORIGIN
      );

      onCompleted();
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to create contact: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
     <div>
        <label>FIRST NAME</label>
      <input
        name="first_name"
        placeholder="First Name"
        value={form.first_name}
        onChange={handleChange}
        required
      />
      </div>
      <div>
      <label>MIDDLE NAME</label>
      <input
        name="middle_name"
        placeholder="Middle Name"
        value={form.middle_name}
        onChange={handleChange}
      />
      </div>
      <input
        name="last_name"
        placeholder="Last Name"
        value={form.last_name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email_address"
        placeholder="Email"
        value={form.email_address}
        onChange={handleChange}
        required
      />
      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        required
      />
      <input
        name="address_line_1"
        placeholder="Address Line 1"
        value={form.address_line_1}
        onChange={handleChange}
        required
      />


      <input
        name="address_line_2"
        placeholder="Address Line 2"
        value={form.address_line_2}
        onChange={handleChange}
      />
      <input
        name="town_city"
        placeholder="City"
        value={form.town_city}
        onChange={handleChange}
        required
      />
        <input
        name="dp_number"
        placeholder="DP / ID / PASSPORT"
        value={form.dp_number}
        onChange={handleChange}
        required
      />
      <select id="contact_type" name="contact_type" value={form.contact_type} onChange={handleChange}>
        <option value="select">Select</option>
        {options.map((fruit,index) => (
          <option key={index} value={fruit}>
            {fruit}
          </option>
        ))}
      </select>
       <h1> chose {form.contact_type}</h1>
      <div style={{ marginTop: "10px" }}>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Submit"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{ marginLeft: "10px" }}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
