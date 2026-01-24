import React, { useState,useEffect } from "react";

const SIGNATURE = "916ee52c-1d16-4eb7-aff1-247ee72fe204";
const CRM_ORIGIN = "https://sandbox.crm.com";

export default function Contact() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email_address: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    town_city: "",
  });

  const [attachments, setAttachments] = useState([]);

  /* -------------------- CRM HANDSHAKE -------------------- */
  useEffect(() => {
    const handler = (event) => {
      if (event.origin !== CRM_ORIGIN) return;
      if (typeof event.data !== "string") return;

      try {
        const data = JSON.parse(event.data);
        if (data.access_token) {
          setToken(data.access_token);
        }
      } catch {}
    };

    window.addEventListener("message", handler);

    window.top?.postMessage(
      JSON.stringify({ signature: SIGNATURE, message: "AUTH" }),
      CRM_ORIGIN
    );

    return () => window.removeEventListener("message", handler);
  }, []);

  /* -------------------- FORM -------------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* -------------------- FILE DROP -------------------- */
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    // NOTE: these files MUST already be accessible via URL
    // For now we fake URLs (replace with real upload later)
    const mapped = files.map((file) => ({
      file_id: crypto.randomUUID(),
      url: URL.createObjectURL(file), // ⚠️ replace with real hosted URL
      description: file.name,
    }));

    setAttachments((prev) => [...prev, ...mapped]);
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Waiting for CRM authorization");

    setLoading(true);

    try {
      /* ---------- CREATE CONTACT ---------- */
      const contactPayload = {
        contact_type: "PERSON",
        first_name: form.first_name,
        middle_name: form.middle_name,
        last_name: form.last_name,
        email_address: form.email_address,
        phones: [
          {
            is_primary: true,
            country_code: "USA",
            number: form.phone,
            phone_type: "MOBILE",
          },
        ],
        addresses: [
          {
            address_type: "HOME",
            is_primary: true,
            address_line_1: form.address_line_1,
            address_line_2: form.address_line_2,
            town_city: form.town_city,
            country_code: "USA",
          },
        ],
      };

      const contactRes = await fetch(
        `${CRM_ORIGIN}/backoffice/v1/contacts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(contactPayload),
        }
      );

      if (!contactRes.ok) {
        const err = await contactRes.text();
        throw new Error(err);
      }

      const contact = await contactRes.json();
      const contactId = contact.id;

      /* ---------- ATTACH FILES ---------- */
      for (const file of attachments) {
        await fetch(
          `${CRM_ORIGIN}/backoffice/v1/contacts/${contactId}/files`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              file_id: file.file_id,
              url: file.url,
              description: file.description,
            }),
          }
        );
      }

      /* ---------- DONE ---------- */
      window.top.postMessage(
        JSON.stringify({ signature: SIGNATURE, message: "COMPLETED" }),
        CRM_ORIGIN
      );
    } catch (err) {
      console.error(err);
      alert("Failed to create contact or attach files");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Contact</h3>

      <input name="first_name" placeholder="First Name" onChange={handleChange} required />
      <input name="middle_name" placeholder="Middle Name" onChange={handleChange} />
      <input name="last_name" placeholder="Last Name" onChange={handleChange} required />
      <input name="email_address" placeholder="Email" onChange={handleChange} required />
      <input name="phone" placeholder="Phone" onChange={handleChange} required />
      <input name="address_line_1" placeholder="Address Line 1" onChange={handleChange} required />
      <input name="address_line_2" placeholder="Address Line 2" onChange={handleChange} />
      <input name="town_city" placeholder="City" onChange={handleChange} required />

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          marginTop: 20,
          padding: 20,
          border: "2px dashed #aaa",
        }}
      >
        Drag & drop attachments here
      </div>

      <ul>
        {attachments.map((f) => (
          <li key={f.file_id}>{f.description}</li>
        ))}
      </ul>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Submit"}
      </button>
    </form>
  );
}