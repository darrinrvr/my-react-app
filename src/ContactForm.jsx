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

  // ✅ Files AFTER upload
  const [uploadedFiles, setUploadedFiles] = useState([]);

 const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFilePick = async (e) => {
    const files = Array.from(e.target.files);
    await uploadFiles(files);
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    for (const file of files) {
      try {
        // ✅ Upload file to file.io to get a public URL
        const publicUrl = await uploadToFileIO(file);
        setUploadedFiles((prev) => [
          ...prev,
          { file_id: crypto.randomUUID(), url: publicUrl, description: file.name },
        ]);
      } catch (err) {
        console.error("File upload failed:", err);
      }
    }
    setUploading(false);
  };

  const uploadToFileIO = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://file.io", { method: "POST", body: formData });
    const data = await res.json();
    if (!data.success) throw new Error("File upload failed");
    return data.link; // public URL
  };
  // ----------------------------
  // SUBMIT FLOW
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Waiting for CRM authorization");

    setLoading(true);

    try {
      // 1️⃣ Create contact
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
      alert(JSON.stringify(contact))

      // 2️⃣ Attach uploaded files
      for (const file of uploadedFiles) {
        await fetch(
          `https://sandbox.crm.com/backoffice/v1/contacts/${contact.id}/files`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({file_id:crypto.randomUUID(),
              url: file,
              description: file.description}),
          }
        );
         alert(JSON.stringify(file))
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

      {uploading && <p>Uploading files...</p>}

      <ul>
        {uploadedFiles.map((f, i) => (
          <li key={i}>{f.description}</li>
        ))}
      </ul>

      <button type="submit" disabled={loading || uploading}>
        {loading ? "Submitting..." : "Submit"}
      </button>

      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}
