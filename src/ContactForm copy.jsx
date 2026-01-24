import React, { useState } from "react";

const SIGNATURE = "aa812974-bdf7-440e-86b5-85f0cbf8ee27";
const CRM_ORIGIN = "https://sandbox.crm.com";

export default function ContactForm({ token, onCompleted, onCancel }) {
  const [loading, setLoading] = useState(false);
  const options=["EMPLOYEE","PERSON","COMPANY","DIA","SPECIAL"];
  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email_address: "",
    phone: "",
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
      <input
        name="first_name"
        placeholder="First Name"
        value={form.first_name}
        onChange={handleChange}
        required
      />
      <input
        name="middle_name"
        placeholder="Middle Name"
        value={form.middle_name}
        onChange={handleChange}
      />
      <input
        name="last_name"
        placeholder="Last Name"
        value={form.last_name}
        onChange={handleChange}
        required
      />
      <input
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
      <select value={form.contact_type} onChange={handleChange}>
        {options.map((ctype,index) => (
          <option key={index} value={ctype}>
            {ctype}
          </option>
        ))}
      </select>
        <label htmlFor="fruit-select">Choose a Contact Type:</label>
      <select id="fruit-select" value={form.contact_type} onChange={handleChange}>
        <option value="">-- Select an option --</option>
      {options.map((ctype,index) => (
          <option key={index} value={ctype}>
            {ctype}
          </option>
        ))}
      </select>
      <p>Selected index: {form.contact_type}</p>

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
