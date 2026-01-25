import React, { useState, useEffect } from "react";
import ContactForm from "./ContactForm";
import Attachments from "./Attachments"
const SIGNATURE = "916ee52c-1d16-4eb7-aff1-247ee72fe204";

const CRM_ORIGIN = "https://sandbox.crm.com";

export default function App() {
  const [token, setToken] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAttachment,setAttachment]=useState(false)

  // === 1️⃣ Listen for CRM messages (access_token) ===
  useEffect(() => {
    const handler = (event) => {
      if (event.origin !== CRM_ORIGIN) return; // must match exactly
      if (typeof event.data !== "string") return;

      const data = JSON.parse(event.data);
      if (data.access_token) {
        setToken(data.access_token);
      }
    };

    window.addEventListener("message", handler);

    return () => window.removeEventListener("message", handler);
  }, []);

  // === 2️⃣ Send AUTH handshake immediately ===
  useEffect(() => {
    // Try to send immediately after load
    window.top?.postMessage(
      JSON.stringify({ signature: SIGNATURE, message: "AUTH" }),
      CRM_ORIGIN
    );
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      {!showForm && (
        <button onClick={() => setShowForm(true)}>
          Create Contact
        </button>
      )}

  {!showAttachment && (
        <button onClick={() => setAttachment(true)}>
          Add Attachment
        </button>
      )}
      {showForm && token && (
        <ContactForm
          token={token}
          onCompleted={() => setShowForm(true)}
          onCancel={() => setShowForm(false)}
        />
      )}
         {showAttachment && token && (
        <Attachments
          token={token}
          contactId={'cdf338e6-814e-40d4-8c83-6465dc672b75'}
          onCompleted={() => setShowForm(false)}
          
        />
      )}

      {!token && showForm && (
        <div style={{ marginTop: "20px" }}>Waiting for CRM authorization...</div>
      )}
    </div>
  );
}
