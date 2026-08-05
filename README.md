# Wings For Dreams — HTML Prototype

Clickable static redesign of [wingsfordreams.org](https://wingsfordreams.org/) using the scraped brand system (magenta `#AE0D36`, Poppins, pill CTAs).

## Assets

Photos in `assets/photos/` are pulled from [wingsfordreams.org](https://wingsfordreams.org/) and used on home, about, impact, CSR, school kit, and cause pages.

```bash
cd /opt/code/wingsfordreams-prototype
python3 -m http.server 8765
```

Open http://localhost:8765/

## Penpot wireframes

Importable UI wireframes for all screens:

- File: [`penpot/wings-for-dreams-wireframes.penpot`](penpot/wings-for-dreams-wireframes.penpot)
- Guide: [`penpot/README.md`](penpot/README.md)

Import at [penpot.app](https://penpot.app/) → project menu → **Import**, then share with your account/team.

## Pages

| File | Route |
|------|-------|
| `index.html` | Home |
| `about.html` | About Us |
| `impact.html` | Impact hub |
| `women-empowerment.html` | Women Empowerment |
| `child-education.html` | Child Education |
| `environment.html` | Environment |
| `dog-feeding.html` | Dog Feeding |
| `csr.html` | CSR |
| `donate.html` | Donate (UPI QR) |
| `school-kit.html` | School Kit |
| `contact.html` | Contact |
| `banks.html` | Bank Details |
| `login.html` | Employee login |
| `admin.html` | Admin donation CSV export |
| `career.html` | Career |

## Employee login (demo)

1. Open **Employee** → `login.html` and sign in with `E001`, `E002`, or `E003`.
2. Donate links include `?employeeId=E00X`.
3. On Donate, fill the same fields as the live form (name, email, phone, PAN, pin, cause, amount, fundraiser). Fundraiser prefills with the logged-in employee name.
4. Click **Mark payment done (demo)** — the record is saved (no instant download).
5. Admins open **`admin.html`** anytime and click **Download CSV**:

```csv
transactionId,gatewayTxnId,utr,paymentStatus,donorName,email,phone,pan,pinCode,cause,amount,fundraiser,employeeId,timeIST
```

`timeIST` is Asia/Kolkata (`YYYY-MM-DD HH:mm:ss IST`).

## Payment gateway (Razorpay-shaped)

Autofill uses **only fields Razorpay actually returns** on the [Payments entity](https://razorpay.com/docs/api/payments/entity/) / `payment.captured` webhook:

`id`, `order_id`, `amount` (paise), `status`, `method`, `email`, `contact`, `description`, `vpa`, `acquirer_data.rrn`, plus `notes.*` if you set them at Checkout.

**Not returned by Razorpay:** PAN, pin code, donor full name (unless you put name in `notes` or it appears as `card.name` for cards).

Configure in [`js/upi-config.js`](js/upi-config.js):

```js
gateway: {
  provider: "razorpay",
  amountUnit: "paise",
  returnUrl: "https://yoursite.org/donate.html",
  webhookUrl: "https://api.yoursite.org/webhooks/razorpay",
}
```

- **I’ve paid** waits up to 5s (demo callback), autofills Razorpay fields, opens tax-receipt details, then saves the record and POSTs `payment.captured` JSON to `webhookUrl` (or `localStorage.wfd_last_webhook_payload`).
- Live Fetch Payment / webhook signature verification must run on your **backend** (never put the key secret in this static page).

## UPI donations

Edit [`js/upi-config.js`](js/upi-config.js) and set the NGO’s **real** UPI ID before go-live.
