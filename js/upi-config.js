/**
 * Official UPI / Razorpay-style payment details for Wings For Dreams.
 * Replace the entries in `upiIds` with the NGO’s real UPI / VPAs before go-live.
 *
 * `upiId` is picked from `upiIds` on every page load (round-robin, so a refresh
 * always moves to the next collection account) — keep it read-only downstream.
 *
 * Gateway autofill uses ONLY fields Razorpay actually returns on the
 * Payments entity / payment.captured webhook (and Fetch Payment API):
 *   id, order_id, amount (paise), currency, status, method, email, contact,
 *   description, vpa, acquirer_data.rrn | bank_transaction_id,
 *   notes.* (only if YOU passed them at Checkout / Order create)
 *
 * Not available from Razorpay payment APIs (do not expect autofill):
 *   PAN, pin code, full legal name as a first-class field
 *   (name may appear only via notes you set, or card.name for card method)
 *
 * Live note: payment secrets / Fetch Payment must run on a backend.
 * This prototype only simulates the public-shaped payload in the browser.
 */
window.WFD_DONATE = (function () {
  const upiIds = [
    "eazypay.c1swjqxxxqdbvua@icici",
    "vyapar.173351353307@hdfcbank",
  ];

  // Round-robin across loads; falls back to a random pick when storage is
  // unavailable (private mode, file:// in some browsers).
  function nextUpiId() {
    if (upiIds.length < 2) return upiIds[0] || "";
    const key = "wfd_upi_index";
    try {
      const prev = Number.parseInt(localStorage.getItem(key) ?? "-1", 10);
      const index = (Number.isNaN(prev) ? -1 : prev) + 1;
      const wrapped = ((index % upiIds.length) + upiIds.length) % upiIds.length;
      localStorage.setItem(key, String(wrapped));
      return upiIds[wrapped];
    } catch {
      return upiIds[Math.floor(Math.random() * upiIds.length)];
    }
  }

  return {
    upiIds,
    upiId: nextUpiId(),
    payeeName: "WINGS FOR DREAMS",
    currency: "INR",
    whatsapp: "918698637796",
    supportEmail: "info@wingsfordreams.org",

    gateway: {
      provider: "razorpay",
      // Amounts in Razorpay payloads are always in the smallest currency unit
      amountUnit: "paise",

      // Configure this as Checkout callback / Payment Link callback URL
      returnUrl: "",

      // Backend webhook endpoint (Razorpay Dashboard → Webhooks).
      // Demo “I’ve paid” waits up to 5s, then fires a Razorpay-shaped
      // payment.captured callback (autofill + open tax receipt).
      webhookUrl: "",

      // Optional; real Razorpay webhooks are verified with the webhook secret on the server
      webhookSecret: "",

      /**
       * Sample shaped like payload.payment.entity from payment.captured
       * https://razorpay.com/docs/webhooks/payments/
       * amount is overridden from the selected donation (paise) on “I’ve paid”.
       */
      demoPayment: {
        id: "pay_DemoWfd00000001",
        order_id: "order_DemoWfd00000001",
        amount: 100000,
        currency: "INR",
        status: "captured",
        method: "upi",
        email: "ananya.rao@example.com",
        contact: "+919876543210",
        description: "Child Education",
        vpa: "ananya@okaxis",
        acquirer_data: { rrn: "123456789012" },
        // Only present if your Checkout/Order notes included them
        notes: {
          cause: "Child Education",
        },
      },
    },
  };
})();
