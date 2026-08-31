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
| `donate.html` | Donate (UPI QR) — donor-only |
| `donations/<name>/` | Per-fundraiser donate page |
| `school-kit.html` | School Kit |
| `contact.html` | Contact |
| `banks.html` | Bank Details |
| `staff-0ef85eac/` | Private staff login (not linked from the site) |
| `staff-0ef85eac/admin.html` | Admin donation CSV export |
| `career.html` | Career |

## Staff login (demo)

Staff pages are unlinked and live under an unguessable path. Bookmark the URL; do not publish it.

1. Open `staff-0ef85eac/` and sign in with `E001`, `E002`, or `E003`.
2. After login, copy your **public donation link** (`donations/<name>/`) and share it with donors. The same copy box also appears on donate pages while you are signed in.
3. Donors opening that link only see the normal donate form. Records still attribute a signed-in ID silently.
4. Admins open **`staff-0ef85eac/admin.html`** and click **Download CSV**:

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

Edit [`js/upi-config.js`](js/upi-config.js) and set the NGO’s **real** UPI IDs before go-live.

`upiIds` holds every collection VPA. On each page load one is chosen round-robin
(the index is kept in `localStorage.wfd_upi_index`), so refreshing the donate page
moves the QR code and “Pay to …” label to the next account. Read `upiId` for the
VPA active on the current load.
