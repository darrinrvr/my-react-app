export async function createContact(token, payload) {
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
    throw new Error(await res.text());
  }

  return res.json();
}
