import React, { useState, useEffect } from "react";
import ContactForm from "./ContactForm";

const SIGNATURE = "e34565dc-f658-4d25-ad0c-a643ef10c4df";

const CRM_ORIGIN = "https://sandbox.crm.com";

export default function App() {
  const [token, setToken] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

      {showForm && token && (
        <ContactForm
          token={token}
          onCompleted={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      )}

      {!token && showForm && (
        <div style={{ marginTop: "20px" }}>Waiting for CRM authorization...</div>
      )}
    </div>
  );
}
