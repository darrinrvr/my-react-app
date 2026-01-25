import React, { useState } from "react";

const SIGNATURE = "916ee52c-1d16-4eb7-aff1-247ee72fe204";
const CRM_ORIGIN = "https://sandbox.crm.com";


export default function Attachments({ token, contactId, onCompleted }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handlePick = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
  };

  const upload = async () => {
    if (!files.length) return;

    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file_id",crypto.randomUUID)
        formData.append("file", file);
         formData.append("url", file);
        formData.append("description", file.name);
 alert(JSON.stringify(formData));
        const res = await fetch(
          `https://sandbox.crm.com/backoffice/v1/contacts/${contactId}/files`,
          {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!res.ok) throw new Error(await res.text());
      }

      onCompleted?.();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section>
      <h4>Attachments</h4>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{ border: "2px dashed #aaa", padding: 20 }}
      >
        Drag & drop files
      </div>

      <input type="file" multiple onChange={handlePick} />

      <ul>
        {files.map((f, i) => (
          <li key={i}>{f.name}</li>
        ))}
      </ul>

      <button onClick={upload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Attachments"}
      </button>
    </section>
  );
}
