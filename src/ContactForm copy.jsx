import React, { useState } from "react";

const SIGNATURE = "916ee52c-1d16-4eb7-aff1-247ee72fe204";
const CRM_ORIGIN = "https://sandbox.crm.com";

export default function Contact({ token, onCompleted, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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

    setLoading(true);

    try {
      // 1️⃣ Create contact (JSON)
      const contactRes = await fetch(
        "https://sandbox.crm.com/backoffice/v1/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            contact_type: "PERSON",
            first_name: form.first_name,
            middle_name: form.middle_name,
            last_name: form.last_name,
            email_address: form.email_address,
            phones: [
              {
                phone_type: "MOBILE",
                country_code: "TTO",
                number: form.phone,
                is_primary: true,
              },
            ],
            addresses: [
              {
                address_type: "HOME",
                address_line_1: form.address_line_1,
                address_line_2: form.address_line_2,
                town_city: form.town_city,
                country_code: "TTO",
                is_primary: true,
              },
            ],
          }),
        }
      );

      if (!contactRes.ok) throw new Error(await contactRes.text());
      const contact = await contactRes.json();

      // 2️⃣ Upload files directly to CRM (FormData)
      if (files.length > 0) {
        setUploading(true);

        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file); // 👈 most CRMs expect "file"
          formData.append("description", file.name);

          const fileRes = await fetch(
            `https://sandbox.crm.com/backoffice/v1/contacts/${contact.id}/files`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`, // ❗ NO Content-Type
              },
              body: formData,
            }
          );

          if (!fileRes.ok) {
            throw new Error(await fileRes.text());
          }
        }

        setUploading(false);
      }

      // 3️⃣ Notify CRM
      window.top.postMessage(
        JSON.stringify({ signature: SIGNATURE, message: "COMPLETED" }),
        CRM_ORIGIN
      );

      onCompleted?.();
    } catch (err) {
      console.error(err);
      alert("Submission failed:\n" + err.message);
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  // ----------------------------
  // RENDER
  // ----------------------------
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

      <h4>Attachments</h4>

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

      <button type="submit" disabled={loading || uploading}>
        {loading ? "Submitting..." : "Submit"}
      </button>

      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}
