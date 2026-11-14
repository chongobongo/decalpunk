"use client";

export default function CheckoutButton({ priceId }: { priceId: string }) {
  async function handleClick() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  return <button onClick={handleClick}>Buy now</button>;
}