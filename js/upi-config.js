/**
 * Official UPI / Razorpay-style payment details for Wings For Dreams.
 * Replace `upiId` with the NGO’s real UPI / VPA before go-live.
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
window.WFD_DONATE = {
  upiId: "wingsfordreams@icici",
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
