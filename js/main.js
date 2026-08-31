(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const progress = document.querySelector(".scroll-progress");
  const floatDonate = document.querySelector(".float-donate");

  const sessionKey = () => window.WFD_SESSION_KEY || "wfd_employee";
  const txnKey = () => window.WFD_TXN_KEY || "wfd_donations";

  function employeeList() {
    return Array.isArray(window.WFD_EMPLOYEES) ? window.WFD_EMPLOYEES : [];
  }

  function findEmployee(id) {
    const needle = String(id || "").trim().toUpperCase();
    return employeeList().find((e) => e.id.toUpperCase() === needle) || null;
  }

  function getSessionEmployee() {
    try {
      const raw = localStorage.getItem(sessionKey());
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return findEmployee(parsed?.id) ? parsed : null;
    } catch {
      return null;
    }
  }

  function setSessionEmployee(emp) {
    localStorage.setItem(sessionKey(), JSON.stringify(emp));
  }

  function clearSessionEmployee() {
    localStorage.removeItem(sessionKey());
  }

  function getActiveEmployeeId() {
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get("employeeId") || params.get("emp");
    if (fromUrl && findEmployee(fromUrl)) return findEmployee(fromUrl).id;
    const session = getSessionEmployee();
    return session?.id || "";
  }

  function withEmployeeParam(href, employeeId) {
    if (!employeeId || !href) return href;
    try {
      const url = new URL(href, location.href);
      if (!/donate\.html$/i.test(url.pathname.split("/").pop() || "")) {
        return href;
      }
      url.searchParams.set("employeeId", employeeId);
      return url.pathname.split("/").pop() + url.search + url.hash;
    } catch {
      return href;
    }
  }

  function applyEmployeeLinks(employeeId) {
    document.querySelectorAll("[data-employee-link]").forEach((a) => {
      const base = a.getAttribute("href");
      if (!base) return;
      a.setAttribute("href", withEmployeeParam(base, employeeId));
    });
  }

  function renderEmployeeChrome() {
    const session = getSessionEmployee();
    const activeId = getActiveEmployeeId();
    const active = findEmployee(activeId) || session;
    const chip = document.querySelector("[data-employee-chip]");
    const banner = document.querySelector("[data-employee-banner]");
    const loginNav = document.querySelector("[data-login-nav]");

    if (chip) {
      if (session) {
        chip.hidden = false;
        chip.classList.add("is-visible");
        chip.innerHTML = `<span>${session.id}</span><button type="button" data-logout>Log out</button>`;
        chip.querySelector("[data-logout]")?.addEventListener("click", () => {
          clearSessionEmployee();
          if (/donate\.html/i.test(location.pathname)) {
            location.href = "donate.html";
          } else {
            location.href = "login.html";
          }
        });
      } else {
        chip.hidden = true;
        chip.classList.remove("is-visible");
        chip.innerHTML = "";
      }
    }

    if (loginNav) {
      loginNav.textContent = session ? session.id : "Employee";
    }

    if (banner) {
      // Banner content is managed on donate via syncDonateModeUI (session only).
      // On other pages, show active/session tracking chip context.
      const onDonate = Boolean(document.querySelector("[data-donate-mode]"));
      if (!onDonate && active) {
        banner.hidden = false;
        banner.classList.add("is-visible");
        banner.innerHTML = `<span>Staff mode · <strong>${active.id}</strong>${
          active.name ? ` · ${active.name}` : ""
        }</span>`;
      } else if (!onDonate) {
        banner.hidden = true;
        banner.classList.remove("is-visible");
        banner.innerHTML = "";
      } else if (active || session) {
        banner.innerHTML = `<span>Staff mode · <strong>${
          (session || active).id
        }</strong>${
          (session || active).name ? ` · ${(session || active).name}` : ""
        }</span><button type="button" class="employee-banner__logout" data-logout-inline>Log out</button>`;
        banner.querySelector("[data-logout-inline]")?.addEventListener("click", () => {
          clearSessionEmployee();
          location.href = "donate.html";
        });
      }
    }

    applyEmployeeLinks(active?.id || session?.id || "");

    const hiddenEmp = document.querySelector("[data-employee-id]");
    const modeValue = document.querySelector("[data-donate-mode-value]");
    const isEmployeeMode = modeValue?.value === "employee";
    if (hiddenEmp && isEmployeeMode) {
      hiddenEmp.value = session?.id || "";
    }

    const fundraiser = document.querySelector("[data-fundraiser]");
    if (fundraiser && session?.name && isEmployeeMode) {
      if (!fundraiser.value || fundraiser.dataset.autofill === "1") {
        fundraiser.value = session.name;
        fundraiser.dataset.autofill = "1";
      }
    }

    syncDonateModeUI();
  }

  function getDonateMode() {
    return (
      document.querySelector("[data-donate-mode-value]")?.value ||
      (getSessionEmployee() || getActiveEmployeeId() ? "employee" : "donor")
    );
  }

  function setDonateMode(mode) {
    const next = mode === "employee" ? "employee" : "donor";
    const modeValue = document.querySelector("[data-donate-mode-value]");
    if (modeValue) modeValue.value = next;

    document.querySelectorAll("[data-donate-mode] [data-mode]").forEach((btn) => {
      const active = btn.dataset.mode === next;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });

    document.querySelectorAll("[data-mode-panel]").forEach((panel) => {
      const active = panel.dataset.modePanel === next;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });

    document.querySelectorAll("[data-donor-only]").forEach((el) => {
      el.hidden = next === "employee";
    });
    document.querySelectorAll("[data-employee-only]").forEach((el) => {
      el.hidden = next !== "employee";
    });

    resetPaymentDoneButton();

    syncDonateModeUI();
    const heroTitle = document.querySelector(".donate-main .page-hero h1");
    const heroLede = document.querySelector(".donate-main .page-hero p:not(.eyebrow)");
    if (heroTitle && heroLede) {
      if (next === "employee") {
        heroTitle.textContent = "Collect gifts with care";
        heroLede.textContent =
          "Sign in with your staff ID, share your link, and track every gift.";
      } else {
        heroTitle.textContent = "Give a little. Help a lot.";
        heroLede.textContent =
          "Pick a cause, choose an amount, and pay with any UPI app.";
      }
    }
  }

  function syncDonateModeUI() {
    const mode = getDonateMode();
    const session = getSessionEmployee();
    const form = document.querySelector("[data-donate-form], [data-upi-form]");
    const gate = document.querySelector("[data-employee-gate]");
    const share = document.querySelector("[data-employee-share]");
    const shareUrl = document.querySelector("[data-employee-share-url]");
    const hiddenEmp = document.querySelector("[data-employee-id]");
    const banner = document.querySelector("[data-employee-banner]");
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get("employeeId") || params.get("emp");
    const attributed = findEmployee(fromUrl)?.id || "";

    if (mode === "donor") {
      // Shared staff links still attribute gifts without forcing employee UI
      if (hiddenEmp) hiddenEmp.value = attributed;
      if (gate) gate.hidden = true;
      if (share) share.hidden = true;
      if (banner) {
        banner.hidden = true;
        banner.classList.remove("is-visible");
      }
      form?.classList.remove("is-locked");
      document.querySelector("[data-pay-sticky]")?.classList.remove("is-locked");
      return;
    }

    // Employee mode — staff session required to unlock pay + share link
    if (gate) gate.hidden = Boolean(session);
    if (banner) {
      if (session) {
        banner.hidden = false;
        banner.classList.add("is-visible");
      } else {
        banner.hidden = true;
        banner.classList.remove("is-visible");
      }
    }
    if (share) {
      share.hidden = !session;
      if (session && shareUrl) {
        const url = new URL("donate.html", location.href);
        url.searchParams.set("employeeId", session.id);
        if (session.name) url.searchParams.set("fundraiser", session.name);
        url.searchParams.delete("mode");
        shareUrl.value = url.href;
      }
    }
    if (hiddenEmp) hiddenEmp.value = session?.id || "";
    const locked = !session;
    form?.classList.toggle("is-locked", locked);
    const sticky = document.querySelector("[data-pay-sticky]");
    sticky?.classList.toggle("is-locked", locked);
  }

  function fieldValue(selector) {
    return (document.querySelector(selector)?.value || "").trim();
  }

  /** Donor name is split into first/last, mirroring the live Give form. */
  function getFormDonorName() {
    const joined = [fieldValue("[data-donor-first]"), fieldValue("[data-donor-last]")]
      .filter(Boolean)
      .join(" ")
      .trim();
    return joined || fieldValue("[data-donor-name]");
  }

  function getPaymentType() {
    return fieldValue("[data-payment-type]");
  }

  /** Each payment type carries a different reference number. */
  const PAYMENT_ID_LABELS = {
    UPI: ["Payment Id (UPI UTR)", "12-digit UTR from your UPI app"],
    Swipe: ["Payment Id (Approval Code)", "Card approval / RRN code"],
    Cash: ["Payment Id (Receipt No.)", "Cash receipt number"],
    "NEFT/RTGS": ["Payment Id (Bank UTR)", "UTR from the bank transfer"],
    Cheque: ["Payment Id (Cheque No.)", "Cheque number"],
  };

  function syncPaymentIdLabel() {
    const [label, placeholder] =
      PAYMENT_ID_LABELS[getPaymentType()] || ["Payment Id", "Payment Id"];
    const labelEl = document.querySelector("[data-payment-id-label]");
    if (labelEl) labelEl.textContent = label;
    const input = document.querySelector("[data-payment-id]");
    if (input) input.placeholder = placeholder;
  }

  /** Unset counts as UPI so the QR is ready before a payment type is picked. */
  function isUpiPayment() {
    const type = getPaymentType().toUpperCase();
    return !type || type === "UPI";
  }

  function formatIst(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(date);
    const get = (type) => parts.find((p) => p.type === type)?.value || "";
    return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get(
      "minute"
    )}:${get("second")} IST`;
  }

  function optionalField(value, empty = "null") {
    const trimmed = String(value ?? "").trim();
    return trimmed || empty;
  }

  function donorDisplayName(value) {
    return optionalField(value, "anonymous");
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function csvEscape(value) {
    const str = String(value ?? "");
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  }

  function downloadCsv(filename, rows) {
    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function makeTxnId() {
    const stamp = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `WFD-${stamp}-${rand}`;
  }

  function loadDonations() {
    try {
      const rows = JSON.parse(localStorage.getItem(txnKey()) || "[]");
      return Array.isArray(rows) ? rows : [];
    } catch {
      return [];
    }
  }

  function donationsToCsvRows(records) {
    return [
      [
        "transactionId",
        "gatewayTxnId",
        "utr",
        "paymentStatus",
        "donorName",
        "firstName",
        "lastName",
        "email",
        "phone",
        "pan",
        "aadhar",
        "city",
        "pinCode",
        "cause",
        "amount",
        "paymentType",
        "paymentId",
        "fundraiser",
        "employeeId",
        "timeIST",
      ],
      ...records.map((r) => [
        r.transactionId || "",
        optionalField(r.gatewayTxnId),
        optionalField(r.utr),
        optionalField(r.paymentStatus, "success"),
        donorDisplayName(r.donorName),
        optionalField(r.firstName),
        optionalField(r.lastName),
        optionalField(r.email),
        optionalField(r.phone),
        optionalField(r.pan),
        optionalField(r.aadhar),
        optionalField(r.city),
        optionalField(r.pinCode),
        optionalField(r.cause, "null"),
        r.amount ?? "null",
        optionalField(r.paymentType),
        optionalField(r.paymentId),
        optionalField(r.fundraiser),
        optionalField(r.employeeId),
        optionalField(r.timeIST),
      ]),
    ];
  }

  function renderAdminDonations() {
    const tbody = document.querySelector("[data-admin-rows]");
    const countEl = document.querySelector("[data-admin-count]");
    const downloadBtn = document.querySelector("[data-admin-download]");
    if (!tbody) return;

    const records = loadDonations();
    if (countEl) {
      countEl.textContent =
        records.length === 0
          ? "No donations recorded yet."
          : `${records.length} donation${records.length === 1 ? "" : "s"} recorded.`;
    }
    if (downloadBtn) downloadBtn.disabled = records.length === 0;

    if (!records.length) {
      tbody.innerHTML =
        '<tr><td colspan="17">No records yet. Record a donation on Donate first.</td></tr>';
      return;
    }

    tbody.innerHTML = records
      .map(
        (r) => `<tr>
          <td>${escapeHtml(optionalField(r.timeIST, "—"))}</td>
          <td>${escapeHtml(r.transactionId || "—")}</td>
          <td>${escapeHtml(optionalField(r.gatewayTxnId, "—"))}</td>
          <td>${escapeHtml(optionalField(r.utr, "—"))}</td>
          <td>${escapeHtml(donorDisplayName(r.donorName))}</td>
          <td>${escapeHtml(optionalField(r.email, "—"))}</td>
          <td>${escapeHtml(optionalField(r.phone, "—"))}</td>
          <td>${escapeHtml(optionalField(r.pan, "—"))}</td>
          <td>${escapeHtml(optionalField(r.aadhar, "—"))}</td>
          <td>${escapeHtml(optionalField(r.city, "—"))}</td>
          <td>${escapeHtml(optionalField(r.pinCode, "—"))}</td>
          <td>${escapeHtml(optionalField(r.cause, "—"))}</td>
          <td>₹${Number(r.amount || 0).toLocaleString("en-IN")}</td>
          <td>${escapeHtml(optionalField(r.paymentType, "—"))}</td>
          <td>${escapeHtml(optionalField(r.paymentId, "—"))}</td>
          <td>${escapeHtml(optionalField(r.fundraiser, "—"))}</td>
          <td>${escapeHtml(optionalField(r.employeeId, "—"))}</td>
        </tr>`
      )
      .join("");
  }

  renderEmployeeChrome();
  renderAdminDonations();

  const fundraiserInput = document.querySelector("[data-fundraiser]");
  if (fundraiserInput) {
    fundraiserInput.addEventListener("input", () => {
      fundraiserInput.dataset.autofill = "0";
    });
  }

  // Employee login
  const loginForm = document.querySelector("[data-employee-login]");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const idInput = loginForm.querySelector("[data-login-id]");
      const note = loginForm.querySelector("[data-login-note]");
      const emp = findEmployee(idInput?.value);
      if (!emp) {
        if (note) {
          note.textContent = "Unknown ID. Try E001, E002, or E003.";
          note.style.color = "var(--wfd-primary)";
        }
        return;
      }
      setSessionEmployee(emp);
      location.href = `donate.html?employeeId=${encodeURIComponent(
        emp.id
      )}&mode=employee`;
    });
  }

  // Donate page: donor vs employee
  if (document.querySelector("[data-donate-mode]")) {
    document.querySelectorAll("[data-donate-mode] [data-mode]").forEach((btn) => {
      btn.addEventListener("click", () => setDonateMode(btn.dataset.mode));
    });

    const inlineLogin = document.querySelector("[data-employee-login-inline]");
    if (inlineLogin) {
      inlineLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        const idInput = inlineLogin.querySelector("[data-login-id-inline]");
        const note = inlineLogin.querySelector("[data-login-note-inline]");
        const emp = findEmployee(idInput?.value);
        if (!emp) {
          if (note) {
            note.innerHTML =
              'Unknown ID. Try E001, E002, or E003 · or use <a href="login.html">Employee login</a>';
            note.style.color = "var(--wfd-primary)";
          }
          return;
        }
        setSessionEmployee(emp);
        const url = new URL(location.href);
        url.searchParams.set("employeeId", emp.id);
        url.searchParams.set("mode", "employee");
        history.replaceState({}, "", url);
        setDonateMode("employee");
        renderEmployeeChrome();
      });
    }

    const shareCopy = document.querySelector("[data-employee-share-copy]");
    if (shareCopy) {
      shareCopy.addEventListener("click", async () => {
        const input = document.querySelector("[data-employee-share-url]");
        if (!input?.value) return;
        try {
          await navigator.clipboard.writeText(input.value);
          shareCopy.textContent = "Copied";
          setTimeout(() => (shareCopy.textContent = "Copy"), 1500);
        } catch {
          input.select();
          shareCopy.textContent = "Select & copy";
        }
      });
    }

    const params = new URLSearchParams(location.search);
    const urlMode = params.get("mode");
    // Employee UI only when staff is logged in (or explicitly asked for staff mode).
    // Shared ?employeeId= links stay in donor mode and still attribute the gift.
    const startEmployee =
      urlMode === "employee" || Boolean(getSessionEmployee());
    setDonateMode(startEmployee ? "employee" : "donor");
    renderEmployeeChrome();
  }

  // Admin CSV export (anytime)
  const adminDownload = document.querySelector("[data-admin-download]");
  if (adminDownload) {
    adminDownload.addEventListener("click", () => {
      const records = loadDonations();
      if (!records.length) return;
      const stamp = new Date().toISOString().slice(0, 10);
      downloadCsv(`wfd-donations-${stamp}.csv`, donationsToCsvRows(records));
    });
  }

  const adminClear = document.querySelector("[data-admin-clear]");
  if (adminClear) {
    adminClear.addEventListener("click", () => {
      if (!loadDonations().length) return;
      if (!confirm("Clear all recorded donations on this browser?")) return;
      localStorage.removeItem(txnKey());
      renderAdminDonations();
    });
  }

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 8);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (y / max) * 100 : 0;
      progress.style.width = `${pct}%`;
    }

    if (floatDonate) {
      const onDonate = /donate\.html/i.test(location.pathname);
      floatDonate.classList.toggle(
        "is-visible",
        !onDonate && y > window.innerHeight * 0.55
      );
    }

    if (!reduced) {
      const heroSlides = document.querySelector(".hero__slides");
      if (heroSlides) {
        heroSlides.style.transform = `translateY(${Math.min(y * 0.18, 80)}px) scale(1.06)`;
      }
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("is-nav-open", open);
    });
  }

  document.querySelectorAll(".nav__item--has-sub > .nav__link").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (window.matchMedia("(max-width: 860px)").matches) {
        e.preventDefault();
        link.parentElement.classList.toggle("is-open");
      }
    });
  });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -36px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  requestAnimationFrame(() => {
    document.querySelectorAll(".hero .reveal").forEach((el) => {
      el.classList.add("is-visible");
    });
  });

  // Animated counters
  const animateCount = (el) => {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(target * eased);
      el.textContent = `${prefix}${val.toLocaleString("en-IN")}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  // Amount + cause picker
  const customAmount = document.querySelector("[data-custom-amount]");
  const amountImpact = document.querySelector("[data-amount-impact]");
  const stickyBar = document.querySelector("[data-pay-sticky]");
  const stickyAmount = document.querySelector("[data-sticky-amount]");
  const stickyCause = document.querySelector("[data-sticky-cause]");
  const stickyPay = document.querySelector("[data-sticky-pay]");

  function parseAmountDigits(value) {
    const digits = String(value || "").replace(/[^\d]/g, "");
    return digits ? Number(digits) : 0;
  }

  function formatAmountDisplay(n) {
    if (!n || Number.isNaN(n)) return "";
    return Math.round(n).toLocaleString("en-IN");
  }

  function syncAmountChips(amount) {
    document.querySelectorAll("[data-amount-group] .amount-option").forEach((btn) => {
      btn.classList.toggle("is-selected", Number(btn.dataset.amount) === Number(amount));
    });
    const selected = document.querySelector(
      `[data-amount-group] .amount-option[data-amount="${amount}"]`
    );
    if (amountImpact) {
      const impact = selected?.dataset.impact;
      amountImpact.textContent = impact
        ? `₹${formatAmountDisplay(amount)} — ${impact}`
        : amount
          ? `₹${formatAmountDisplay(amount)} · Minimum ₹1`
          : "Choose or type an amount (min ₹1).";
    }
  }

  document.querySelectorAll("[data-amount-group]").forEach((group) => {
    group.querySelectorAll(".amount-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const amount = Number(btn.dataset.amount);
        if (customAmount) {
          customAmount.value = formatAmountDisplay(amount);
          customAmount.dataset.raw = String(amount);
        }
        syncAmountChips(amount);
        updateDonateSummary();
        resetPaymentDoneButton();
        scheduleUpiRefresh();
      });
    });
  });

  document.querySelectorAll(".cause-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      document.querySelectorAll(".cause-option").forEach((o) =>
        o.classList.remove("is-selected")
      );
      opt.classList.add("is-selected");
      const input = opt.querySelector("input");
      if (input) input.checked = true;
      updateDonateSummary();
      resetPaymentDoneButton();
      scheduleUpiRefresh();
    });
  });

  if (customAmount) {
    customAmount.addEventListener("input", () => {
      const amount = parseAmountDigits(customAmount.value);
      const caretEnd = customAmount.selectionStart === customAmount.value.length;
      customAmount.value = amount ? formatAmountDisplay(amount) : "";
      customAmount.dataset.raw = amount ? String(amount) : "";
      if (caretEnd) {
        const len = customAmount.value.length;
        customAmount.setSelectionRange(len, len);
      }
      syncAmountChips(amount);
      updateDonateSummary();
      resetPaymentDoneButton();
      scheduleUpiRefresh();
    });
    customAmount.addEventListener("blur", () => {
      const amount = parseAmountDigits(customAmount.value);
      customAmount.value = amount ? formatAmountDisplay(amount) : "";
      customAmount.dataset.raw = amount ? String(amount) : "";
      syncAmountChips(amount);
      updateDonateSummary();
      scheduleUpiRefresh();
    });
  }

  function getDonateAmount() {
    const fromField = parseAmountDigits(
      customAmount?.value || customAmount?.dataset.raw || ""
    );
    if (fromField > 0) return String(fromField);
    const selected = document.querySelector(".amount-option.is-selected");
    return selected?.dataset.amount || "1";
  }

  function getDonateCause() {
    return (
      fieldValue("[data-cause-select]") ||
      document.querySelector(".cause-option input:checked")?.closest(".cause-option")
        ?.dataset.label ||
      document.querySelector(".cause-option.is-selected")?.dataset.label ||
      "Donation"
    );
  }

  function updateDonateSummary() {
    const summary = document.querySelector("[data-donate-summary]");
    const amount = getDonateAmount();
    const cause = getDonateCause();
    const label = `₹${Number(amount || 0).toLocaleString("en-IN")}`;
    if (summary) {
      summary.innerHTML = `You're giving <strong>${label}</strong> for <strong>${cause}</strong>`;
    }
    const total = document.querySelector("[data-donate-total]");
    if (total) total.textContent = label;
    if (stickyAmount) stickyAmount.textContent = label;
    if (stickyCause) stickyCause.textContent = cause;
  }
  updateDonateSummary();
  syncAmountChips(parseAmountDigits(customAmount?.value) || 1);

  function gatewayConfig() {
    return (window.WFD_DONATE || {}).gateway || {};
  }

  function gatewayReturnUrl() {
    const configured = (gatewayConfig().returnUrl || "").trim();
    if (configured) return configured;
    try {
      return new URL("donate.html", location.href).href.split("?")[0];
    } catch {
      return "donate.html";
    }
  }

  function normalizeGatewayStatus(value) {
    const s = String(value || "").trim().toLowerCase();
    if (!s) return "";
    if (["success", "successful", "captured", "authorized", "paid", "completed"].includes(s)) {
      return s === "authorized" ? "authorized" : "captured";
    }
    if (["failure", "failed", "cancelled", "canceled", "dropped"].includes(s)) {
      return "failed";
    }
    if (["pending", "created", "initiated"].includes(s)) {
      return "pending";
    }
    return s;
  }

  function readSourceValue(source, key) {
    if (!source) return "";
    if (typeof source.get === "function") {
      const v = source.get(key);
      return v == null ? "" : String(v).trim();
    }
    const parts = String(key).split(".");
    let cur = source;
    for (const part of parts) {
      if (cur == null) return "";
      cur = cur[part];
    }
    if (cur == null) return "";
    return String(cur).trim();
  }

  function firstParam(source, keys) {
    for (const key of keys) {
      const value = readSourceValue(source, key);
      if (value) return value;
    }
    return "";
  }

  /**
   * Normalize a Razorpay Payments entity (or URL/query echo of it).
   * Real fields only: https://razorpay.com/docs/api/payments/entity/
   */
  function parseGatewayPayload(source) {
    let entity = source;
    if (source?.payload?.payment?.entity) {
      entity = source.payload.payment.entity;
    } else if (source?.payment?.entity) {
      entity = source.payment.entity;
    } else if (source && source.entity === "payment") {
      entity = source;
    }

    const get = (keys) => firstParam(entity, keys);
    const notes =
      entity?.notes && typeof entity.notes === "object" && !Array.isArray(entity.notes)
        ? entity.notes
        : {};
    const acquirer =
      entity?.acquirer_data && typeof entity.acquirer_data === "object"
        ? entity.acquirer_data
        : {};

    const paymentId = get(["razorpay_payment_id", "id", "payment_id"]);
    const orderId = get(["razorpay_order_id", "order_id"]);
    const rawAmount = get(["amount"]);
    const unit = (gatewayConfig().amountUnit || "paise").toLowerCase();
    let amountRupees = "";
    if (rawAmount !== "") {
      const n = Number(rawAmount);
      if (Number.isFinite(n)) {
        amountRupees =
          unit === "paise" ? String(Math.round(n / 100)) : String(Math.round(n));
      }
    }

    const contact = get(["contact"]).replace(/\D/g, "").slice(-10);
    const email = get(["email"]);
    // Name is NOT a top-level Razorpay payment field.
    const name =
      firstParam(notes, ["name", "donor_name", "participant_name"]) ||
      get(["card.name"]);
    const cause =
      firstParam(notes, ["cause", "purpose"]) || get(["description"]);
    const utr = firstParam(acquirer, [
      "rrn",
      "bank_transaction_id",
      "upi_transaction_id",
    ]);

    return {
      name,
      email,
      phone: contact,
      amount: amountRupees,
      cause,
      txnid: paymentId,
      orderId,
      utr,
      status: normalizeGatewayStatus(get(["status"])),
      method: get(["method"]),
      vpa: get(["vpa"]),
      currency: get(["currency"]) || "INR",
    };
  }

  function setCauseByLabel(wantRaw) {
    if (!wantRaw) return false;
    let want = decodeURIComponent(String(wantRaw)).toLowerCase().trim();
    want = want.replace(/&amp;/g, "&").replace(/\+/g, " ");

    // Cause labels match the live Give form; older links still resolve here.
    const aliases = {
      women: "women empowerment",
      "women-empowerment": "women empowerment",
      hygiene: "women empowerment",
      "women empowerment and hygiene": "women empowerment",
      child: "child education",
      "child-education": "child education",
      education: "child education",
      animal: "animal care",
      "animal-care": "animal care",
      dog: "animal care",
      dogs: "animal care",
      "dog-feeding": "animal care",
      environment: "environment",
      emergency: "environment",
      camp: "environment",
      "emergency & volunteer camp support": "environment",
    };
    if (aliases[want]) want = aliases[want];

    const select = document.querySelector("[data-cause-select]");
    if (select) {
      const option = Array.from(select.options).find((opt) => {
        const label = opt.value.toLowerCase().trim();
        return Boolean(label) && (label === want || label.includes(want) || want.includes(label));
      });
      if (!option) return false;
      select.value = option.value;
      return true;
    }

    let matched = null;
    document.querySelectorAll(".cause-option").forEach((opt) => {
      const label = (opt.dataset.label || "")
        .toLowerCase()
        .replace(/&amp;/g, "&")
        .trim();
      if (
        !matched &&
        (label === want ||
          label.includes(want) ||
          want.includes(label) ||
          label.split(/\s+/).some((w) => w.length > 3 && want.includes(w)))
      ) {
        matched = opt;
      }
    });
    if (!matched) return false;
    document.querySelectorAll(".cause-option").forEach((opt) => {
      const on = opt === matched;
      opt.classList.toggle("is-selected", on);
      const input = opt.querySelector("input");
      if (input) input.checked = on;
    });
    return true;
  }

  function showGatewayBanner(message) {
    const banner = document.querySelector("[data-gateway-banner]");
    if (!banner) return;
    banner.hidden = false;
    banner.textContent = message;
  }

  function applyGatewayAutofill(payload, { openReceipt = true, source = "gateway", resetPaid = true } = {}) {
    const upiForm = document.querySelector("[data-upi-form]");
    if (!upiForm || !payload) return false;
    let filled = 0;

    const fill = (sel, value, transform) => {
      const el = upiForm.querySelector(sel);
      if (!el || value == null || value === "") return;
      el.value = transform ? transform(value) : value;
      filled += 1;
    };

    // Razorpay-available autofill only (no PAN / Aadhar / city — not on Payments API)
    if (payload.name) {
      const [first, ...rest] = String(payload.name).trim().split(/\s+/);
      fill("[data-donor-first]", first);
      if (rest.length) fill("[data-donor-last]", rest.join(" "));
      fill("[data-donor-name]", payload.name);
    }
    fill("[data-donor-email]", payload.email);
    fill("[data-donor-phone]", payload.phone);
    fill("[data-gateway-txn]", payload.txnid);
    fill("[data-gateway-utr]", payload.utr);
    // The live form's required Payment Id is the UPI reference (Razorpay RRN).
    fill("[data-payment-id]", payload.utr || payload.txnid);
    fill(
      "[data-gateway-status]",
      payload.status === "captured" || payload.status === "authorized"
        ? "success"
        : payload.status || "success"
    );

    if (payload.amount && customAmount) {
      const amount = parseAmountDigits(payload.amount);
      if (amount >= 1) {
        customAmount.value = formatAmountDisplay(amount);
        customAmount.dataset.raw = String(amount);
        syncAmountChips(amount);
        filled += 1;
      }
    }
    if (payload.cause && setCauseByLabel(payload.cause)) filled += 1;

    updateDonateSummary();

    if (filled > 0) {
      const extra = [payload.method, payload.vpa].filter(Boolean).join(" · ");
      showGatewayBanner(
        `Filled from the Razorpay payment${extra ? ` (${extra})` : ""}. PAN, Aadhar and city stay manual — Razorpay doesn’t return them.`
      );
      if (resetPaid) resetPaymentDoneButton();
      scheduleUpiRefresh();
    }
    return filled > 0;
  }

  function buildWebhookPayload(record) {
    const cfg = gatewayConfig();
    const amountPaise = Math.round(Number(record.amount || 0) * 100);
    const paymentId =
      record.gatewayTxnId && record.gatewayTxnId !== "null"
        ? record.gatewayTxnId
        : record.transactionId;
    // Shape aligned with Razorpay payment.captured → payload.payment.entity
    return {
      entity: "event",
      event: "payment.captured",
      provider: cfg.provider || "razorpay",
      created_at: Math.floor(Date.now() / 1000),
      note: "Demo browser POST — verify signatures on your backend in production",
      returnUrl: gatewayReturnUrl(),
      secret: cfg.webhookSecret || undefined,
      payload: {
        payment: {
          entity: {
            id: paymentId,
            entity: "payment",
            amount: amountPaise,
            currency: (window.WFD_DONATE || {}).currency || "INR",
            status: "captured",
            order_id:
              record.orderId && record.orderId !== "null" ? record.orderId : null,
            method: "upi",
            captured: true,
            description: record.cause !== "null" ? record.cause : null,
            email: record.email !== "null" ? record.email : null,
            contact:
              record.phone !== "null" && record.phone
                ? `+91${String(record.phone).replace(/\D/g, "").slice(-10)}`
                : null,
            vpa: null,
            notes: {
              wfd_transaction_id: record.transactionId,
              employeeId: record.employeeId !== "null" ? record.employeeId : undefined,
              fundraiser: record.fundraiser !== "null" ? record.fundraiser : undefined,
              cause: record.cause !== "null" ? record.cause : undefined,
            },
            acquirer_data: {
              rrn: record.utr !== "null" ? record.utr : null,
            },
            fee: null,
            tax: null,
            error_code: null,
            error_description: null,
            created_at: Math.floor(Date.now() / 1000),
          },
        },
      },
    };
  }

  async function postGatewayWebhook(record) {
    const url = (gatewayConfig().webhookUrl || "").trim();
    const noteEl = document.querySelector("[data-form-note]");
    if (!url) {
      try {
        localStorage.setItem(
          "wfd_last_webhook_payload",
          JSON.stringify(buildWebhookPayload(record), null, 2)
        );
      } catch {
        /* ignore */
      }
      return { ok: false, skipped: true };
    }
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(buildWebhookPayload(record)),
        mode: "cors",
        keepalive: true,
      });
      if (noteEl) {
        noteEl.textContent = res.ok
          ? "Payment saved and webhook notified."
          : `Payment saved. Webhook responded ${res.status}.`;
      }
      return { ok: res.ok, status: res.status };
    } catch (err) {
      try {
        localStorage.setItem(
          "wfd_last_webhook_payload",
          JSON.stringify(buildWebhookPayload(record), null, 2)
        );
      } catch {
        /* ignore */
      }
      if (noteEl) {
        noteEl.textContent =
          "Payment saved. Webhook URL unreachable from this browser (CORS/network) — payload kept in localStorage as wfd_last_webhook_payload.";
      }
      return { ok: false, error: String(err) };
    }
  }

  // Prefill from school-kit links + payment-gateway return URL
  const params = new URLSearchParams(location.search);
  if (params.get("amount") && customAmount) {
    const amount = parseAmountDigits(params.get("amount"));
    customAmount.value = formatAmountDisplay(amount);
    customAmount.dataset.raw = amount ? String(amount) : "";
    syncAmountChips(amount);
  }
  if (params.get("cause")) {
    setCauseByLabel(params.get("cause"));
    updateDonateSummary();
  }

  /**
   * Per-fundraiser links, like the live /donations/amir/ page: accept either
   * ?fundraiser=Amir or a /donations/<name>/ style path.
   */
  function fundraiserFromLocation() {
    const fromQuery = params.get("fundraiser") || params.get("fr");
    if (fromQuery) return decodeURIComponent(fromQuery).trim();
    const segments = location.pathname.split("/").filter(Boolean);
    const donationsAt = segments.lastIndexOf("donations");
    const slug = donationsAt >= 0 ? segments[donationsAt + 1] : "";
    if (!slug || /\.html?$/i.test(slug)) return "";
    return decodeURIComponent(slug)
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
  }

  const fundraiserFromUrl = fundraiserFromLocation();
  const fundraiserField = document.querySelector("[data-fundraiser]");
  if (fundraiserField && fundraiserFromUrl) {
    fundraiserField.value = fundraiserFromUrl;
    fundraiserField.dataset.autofill = "0";
    const heroEyebrow = document.querySelector(".page-hero--donate .eyebrow");
    if (heroEyebrow) heroEyebrow.textContent = `Donate · ${fundraiserFromUrl}`;
    const pageTitle = document.querySelector("[data-fundraiser-title]");
    if (pageTitle) pageTitle.textContent = fundraiserFromUrl;
  }
  const gatewayFromUrl = parseGatewayPayload(params);
  const hasGatewayReturn = Boolean(
    gatewayFromUrl.email ||
      gatewayFromUrl.phone ||
      gatewayFromUrl.txnid ||
      gatewayFromUrl.utr ||
      params.get("razorpay_payment_id") ||
      params.get("razorpay_order_id") ||
      (gatewayFromUrl.status && (params.has("status") || params.get("amount")))
  );
  let pendingGatewayAutofill = hasGatewayReturn ? gatewayFromUrl : null;
  if (hasGatewayReturn) {
    try {
      const clean = new URL(location.href);
      [
        "email",
        "contact",
        "razorpay_signature",
        "razorpay_payment_id",
        "razorpay_order_id",
      ].forEach((k) => clean.searchParams.delete(k));
      history.replaceState({}, "", clean.pathname + clean.search + clean.hash);
    } catch {
      /* ignore */
    }
  }
  updateDonateSummary();

  const returnHint = document.querySelector("[data-gateway-return-hint]");
  if (returnHint) {
    returnHint.remove();
  }

  function buildUpiUri({ vpa, payeeName, amount, note }) {
    const q = new URLSearchParams({
      pa: vpa,
      pn: payeeName,
      am: amount,
      cu: "INR",
      tn: note.slice(0, 80),
    });
    return `upi://pay?${q.toString()}`;
  }

  async function renderUpiQr(upiUri, mount, { label = "UPI QR code" } = {}) {
    if (!mount) return;
    mount.innerHTML = "";
    if (window.QRCode && typeof window.QRCode.toCanvas === "function") {
      const canvas = document.createElement("canvas");
      await window.QRCode.toCanvas(canvas, upiUri, {
        width: 196,
        margin: 1,
        color: { dark: "#161616", light: "#ffffff" },
      });
      canvas.setAttribute("aria-label", label);
      mount.appendChild(canvas);
      return;
    }
    const img = document.createElement("img");
    img.alt = label;
    img.width = 196;
    img.height = 196;
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=196x196&data=${encodeURIComponent(
      upiUri
    )}`;
    mount.appendChild(img);
  }

  let scrambleSeed = "";

  /** Random payload so the locked QR looks like a code but scans to nothing. */
  function scrambleQrData() {
    if (!scrambleSeed) {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let out = "";
      for (let i = 0; i < 96; i += 1) {
        out += chars[Math.floor(Math.random() * chars.length)];
      }
      scrambleSeed = out;
    }
    return scrambleSeed;
  }

  async function renderWhatsAppQr(waUrl, mount) {
    if (!mount) return;
    mount.innerHTML = "";
    const size = 132;
    if (window.QRCode && typeof window.QRCode.toCanvas === "function") {
      const canvas = document.createElement("canvas");
      await window.QRCode.toCanvas(canvas, waUrl, {
        width: size,
        margin: 1,
        color: { dark: "#161616", light: "#ffffff" },
      });
      canvas.setAttribute("aria-label", "WhatsApp QR code");
      mount.appendChild(canvas);
      return;
    }
    const img = document.createElement("img");
    img.alt = "WhatsApp QR code";
    img.width = size;
    img.height = size;
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
      waUrl
    )}`;
    mount.appendChild(img);
  }

  let upiRefreshTimer = null;
  function scheduleUpiRefresh() {
    clearTimeout(upiRefreshTimer);
    upiRefreshTimer = setTimeout(() => {
      refreshUpiPayment();
    }, 180);
  }

  function resetPaymentDoneButton() {
    const submitBtn = document.querySelector("[data-donate-submit]");
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove("is-loading");
      submitBtn.removeAttribute("aria-busy");
      submitBtn.textContent = "Donate Now";
    }
    const success = document.querySelector("[data-payment-success]");
    if (success) {
      success.hidden = true;
      success.classList.remove("is-visible");
    }
  }

  function clearFieldErrors() {
    document
      .querySelectorAll(".form-field.has-error")
      .forEach((el) => el.classList.remove("has-error"));
  }

  /** Flag a required field, focus it, and explain in the shared note line. */
  function failValidation(selector, message) {
    const noteEl = document.querySelector("[data-form-note]");
    const field = selector ? document.querySelector(selector) : null;
    field?.closest(".form-field")?.classList.add("has-error");
    if (noteEl) {
      noteEl.textContent = message;
      noteEl.style.color = "var(--wfd-primary)";
    }
    field?.scrollIntoView({ behavior: "smooth", block: "center" });
    field?.focus({ preventScroll: true });
    return false;
  }

  function setPaidButtonLoading(paidBtn, loading, label) {
    if (!paidBtn) return;
    paidBtn.disabled = loading;
    paidBtn.classList.toggle("is-loading", loading);
    paidBtn.setAttribute("aria-busy", loading ? "true" : "false");
    if (loading) {
      paidBtn.innerHTML = `<span class="btn-spinner" aria-hidden="true"></span><span>${label}</span>`;
    } else {
      paidBtn.textContent = label;
    }
  }

  function formatSuccessMeta({ transactionId, donorName, amount, employeeId, timeIST }) {
    const bits = [
      transactionId,
      donorName,
      `₹${Number(amount).toLocaleString("en-IN")}`,
    ];
    if (employeeId && employeeId !== "null") bits.push(employeeId);
    bits.push(timeIST);
    return bits.join(" · ");
  }

  function requireStaffSession() {
    if (getDonateMode() !== "employee" || getSessionEmployee()) return true;
    const noteEl = document.querySelector("[data-form-note]");
    if (noteEl) {
      noteEl.textContent = "Log in with your employee ID before recording a gift.";
      noteEl.style.color = "var(--wfd-primary)";
    }
    document.querySelector("[data-login-id-inline]")?.focus();
    document
      .querySelector("[data-employee-gate]")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }

  /**
   * Donate Now — mirrors the live Give form: required donor, cause, payment
   * type, Payment Id and fundraiser, then stores the donation record.
   */
  async function submitDonation() {
    const upiForm = document.querySelector("[data-upi-form]");
    if (!upiForm) return;
    const noteEl = upiForm.querySelector("[data-form-note]");
    const submitBtn = upiForm.querySelector("[data-donate-submit]");
    const mode = getDonateMode();
    const employeeId =
      document.querySelector("[data-employee-id]")?.value || "";

    if (submitBtn?.disabled) return;
    if (!requireStaffSession()) return;

    clearFieldErrors();

    const firstNow = fieldValue("[data-donor-first]");
    const lastNow = fieldValue("[data-donor-last]");
    const emailNow = fieldValue("[data-donor-email]");
    const phoneNow = fieldValue("[data-donor-phone]");
    const panNow = fieldValue("[data-donor-pan]").toUpperCase();
    const aadharNow = fieldValue("[data-donor-aadhar]").replace(/\s/g, "");
    const cityNow = fieldValue("[data-donor-city]");
    const pinNow = fieldValue("[data-donor-pin]");
    const paymentTypeNow = getPaymentType();
    const paymentIdNow = fieldValue("[data-payment-id]");
    const fundraiserNow = fieldValue("[data-fundraiser]");
    const causeNow = getDonateCause();
    const amountAfter = getDonateAmount();

    if (!amountAfter || Number(amountAfter) < 1) {
      failValidation("[data-custom-amount]", "Enter the donation amount.");
      return;
    }
    if (!firstNow) {
      failValidation("[data-donor-first]", "First Name is required.");
      return;
    }
    if (!emailNow) {
      failValidation("[data-donor-email]", "Email Address is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNow)) {
      failValidation("[data-donor-email]", "Enter a valid email address.");
      return;
    }
    if (!causeNow || causeNow === "Donation") {
      failValidation("[data-cause-select]", "Please select a Cause.");
      return;
    }
    if (phoneNow && !/^\d{10}$/.test(phoneNow)) {
      failValidation(
        "[data-donor-phone]",
        "Enter a valid 10-digit mobile number, or leave it blank."
      );
      return;
    }
    if (panNow && !/^[A-Z]{5}\d{4}[A-Z]$/.test(panNow)) {
      failValidation(
        "[data-donor-pan]",
        "PAN should look like ABCDE1234F, or leave it blank."
      );
      return;
    }
    if (aadharNow && !/^\d{12}$/.test(aadharNow)) {
      failValidation(
        "[data-donor-aadhar]",
        "Aadhar should be 12 digits, or leave it blank."
      );
      return;
    }
    if (pinNow && !/^\d{6}$/.test(pinNow)) {
      failValidation(
        "[data-donor-pin]",
        "Enter a valid 6-digit pin code, or leave it blank."
      );
      return;
    }
    if (!paymentTypeNow) {
      failValidation("[data-payment-type]", "Please select a Payment Type.");
      return;
    }
    if (!paymentIdNow) {
      const hint = (PAYMENT_ID_LABELS[paymentTypeNow] || [])[1];
      failValidation(
        "[data-payment-id]",
        hint
          ? `Enter the ${hint.charAt(0).toLowerCase()}${hint.slice(1)}.`
          : "Enter the Payment Id for this donation."
      );
      return;
    }
    if (!fundraiserNow) {
      failValidation("[data-fundraiser]", "Fundraiser is required.");
      return;
    }

    setPaidButtonLoading(submitBtn, true, "Saving donation…");

    const donorNow = [firstNow, lastNow].filter(Boolean).join(" ");
    const transactionId = makeTxnId();
    const timeIST = formatIst();
    const donorName = donorDisplayName(donorNow);
    const gatewayTxnId = (
      upiForm.querySelector("[data-gateway-txn]")?.value || ""
    ).trim();
    const utrNow =
      (upiForm.querySelector("[data-gateway-utr]")?.value || "").trim() ||
      paymentIdNow;
    const paymentStatus =
      normalizeGatewayStatus(
        upiForm.querySelector("[data-gateway-status]")?.value || "success"
      ) || "success";
    const record = {
      transactionId,
      gatewayTxnId: optionalField(gatewayTxnId),
      utr: optionalField(utrNow),
      paymentStatus,
      donorName,
      firstName: optionalField(firstNow),
      lastName: optionalField(lastNow),
      email: optionalField(emailNow),
      phone: optionalField(phoneNow),
      pan: optionalField(panNow),
      aadhar: optionalField(aadharNow),
      city: optionalField(cityNow),
      pinCode: optionalField(pinNow),
      cause: causeNow || "null",
      amount: Number(amountAfter),
      paymentType: optionalField(paymentTypeNow),
      paymentId: optionalField(paymentIdNow),
      fundraiser: optionalField(fundraiserNow),
      employeeId: optionalField(employeeId),
      timeIST,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem(txnKey()) || "[]");
      existing.push(record);
      localStorage.setItem(txnKey(), JSON.stringify(existing));
    } catch {
      /* ignore */
    }

    postGatewayWebhook(record);

    const success = upiForm.querySelector("[data-payment-success]");
    if (success) {
      success.hidden = false;
      success.classList.add("is-visible");
      const meta = success.querySelector("[data-payment-success-meta]");
      if (meta) {
        meta.textContent = formatSuccessMeta({
          transactionId,
          donorName,
          amount: amountAfter,
          employeeId: record.employeeId,
          timeIST,
        });
      }
      const wa = upiForm.querySelector("[data-whatsapp-utr]");
      const phone = (window.WFD_DONATE || {}).whatsapp || "918698637796";
      const msg = encodeURIComponent(
        `Hi Wings For Dreams, I donated ₹${Number(amountAfter).toLocaleString(
          "en-IN"
        )} for ${causeNow}. Transaction: ${transactionId}. UTR: ${utrNow}`
      );
      const waUrl = `https://wa.me/${phone}?text=${msg}`;
      if (wa) wa.href = waUrl;
      const waQr = success.querySelector("[data-whatsapp-qr]");
      const waMount = success.querySelector("[data-whatsapp-qr-mount]");
      if (waQr && waMount) {
        waQr.hidden = false;
        renderWhatsAppQr(waUrl, waMount);
      }
      success.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    setPaidButtonLoading(submitBtn, false, "Donation recorded");
    if (submitBtn) submitBtn.disabled = true;
    if (noteEl) {
      noteEl.textContent =
        mode === "donor"
          ? `Saved as ${transactionId}. Your 80G receipt goes to ${emailNow}.`
          : `Saved as ${transactionId} against ${fundraiserNow}.`;
      noteEl.style.color = "";
    }
  }

  /**
   * Required fields still missing before a real QR may be shown. Payment Id is
   * deliberately excluded: the donor only gets that reference from their UPI
   * app after scanning, so gating on it would deadlock the payment.
   */
  function qrBlockers() {
    const missing = [];
    if (Number(getDonateAmount() || 0) < 1) missing.push("Amount");
    if (!fieldValue("[data-donor-first]")) missing.push("First Name");
    const email = fieldValue("[data-donor-email]");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      missing.push("Email Address");
    }
    const cause = getDonateCause();
    if (!cause || cause === "Donation") missing.push("Cause");
    const phone = fieldValue("[data-donor-phone]");
    if (phone && !/^\d{10}$/.test(phone)) missing.push("Phone");
    const pan = fieldValue("[data-donor-pan]").toUpperCase();
    if (pan && !/^[A-Z]{5}\d{4}[A-Z]$/.test(pan)) missing.push("PAN No.");
    const aadhar = fieldValue("[data-donor-aadhar]").replace(/\s/g, "");
    if (aadhar && !/^\d{12}$/.test(aadhar)) missing.push("Aadhar");
    const pin = fieldValue("[data-donor-pin]");
    if (pin && !/^\d{6}$/.test(pin)) missing.push("Pin Code");
    if (!getPaymentType()) missing.push("Payment Type");
    if (!fieldValue("[data-fundraiser]")) missing.push("Fundraiser");
    return missing;
  }

  function listFields(items) {
    if (items.length === 1) return items[0];
    return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
  }

  function setUpiActionsEnabled(result, enabled, upiUri) {
    const launch = result.querySelector("[data-upi-launch]");
    if (launch) {
      launch.classList.toggle("is-disabled", !enabled);
      launch.setAttribute("aria-disabled", enabled ? "false" : "true");
      if (enabled) {
        launch.href = upiUri;
      } else {
        launch.removeAttribute("href");
      }
    }
    const copyBtn = result.querySelector("[data-upi-copy]");
    if (copyBtn) {
      copyBtn.disabled = !enabled;
      if (!enabled) {
        copyBtn.onclick = null;
        copyBtn.textContent = "Copy UPI link";
        return;
      }
      copyBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(upiUri);
          copyBtn.textContent = "Copied";
          setTimeout(() => (copyBtn.textContent = "Copy UPI link"), 1500);
        } catch {
          copyBtn.textContent = "Copy failed";
        }
      };
    }
  }

  let qrLockState = null;

  async function refreshUpiPayment() {
    const upiForm = document.querySelector("[data-upi-form]");
    if (!upiForm) return;
    const cfg = window.WFD_DONATE || {};
    const vpa = (cfg.upiId || "").trim();
    const payeeName = cfg.payeeName || "WINGS FOR DREAMS";
    const amount = getDonateAmount();
    const cause = getDonateCause();
    const donorLabel = donorDisplayName(getFormDonorName());
    const note = `WFD ${cause} - ${donorLabel}`;
    const noteEl = upiForm.querySelector("[data-form-note]");
    const result = upiForm.querySelector("[data-upi-result]");
    if (!result) return;

    updateDonateSummary();
    result.hidden = false;
    result.classList.add("is-visible");

    const qrMount = result.querySelector("[data-upi-qr]");
    const lockNote = result.querySelector("[data-upi-lock]");
    const amountLabel = result.querySelector("[data-upi-amount-label]");
    const causeLabel = result.querySelector("[data-upi-cause-label]");
    const vpaLabel = result.querySelector("[data-upi-vpa]");
    const configMissing = !vpa || vpa.includes("REPLACE");
    const paymentType = getPaymentType();
    syncPaymentIdLabel();
    // Cash, Swipe, NEFT/RTGS and Cheque are collected offline — no QR at all
    const nonUpi = Boolean(paymentType) && !isUpiPayment();
    const blockers = configMissing || nonUpi ? [] : qrBlockers();
    const locked = configMissing || blockers.length > 0;

    if (amountLabel) {
      amountLabel.textContent = `₹${Number(amount || 0).toLocaleString("en-IN")}`;
    }
    if (causeLabel) causeLabel.textContent = cause;

    const titleEl = result.querySelector("[data-upi-title]");
    if (titleEl) {
      if (!titleEl.dataset.defaultTitle) {
        titleEl.dataset.defaultTitle = titleEl.textContent;
      }
      titleEl.textContent = nonUpi
        ? `${paymentType} payment`
        : titleEl.dataset.defaultTitle;
    }

    result.classList.toggle("is-not-upi", nonUpi);
    result.classList.toggle("is-scrambled", locked && !nonUpi);
    if (lockNote) {
      lockNote.classList.toggle("is-info", nonUpi);
      lockNote.hidden = !locked && !nonUpi;
      lockNote.textContent = nonUpi
        ? `${paymentType} donations are recorded offline — no QR code needed. Enter the ${paymentType} reference as the Payment Id.`
        : configMissing
          ? "Set the official UPI ID in js/upi-config.js before taking live donations."
          : locked
            ? `Fill in ${listFields(blockers)} to unlock the payment QR code.`
            : "";
    }

    if (nonUpi) {
      if (vpaLabel) vpaLabel.textContent = "";
      setUpiActionsEnabled(result, false);
      if (stickyPay) stickyPay.removeAttribute("href");
      if (qrMount) qrMount.innerHTML = "";
      qrLockState = null;
      return;
    }

    if (locked) {
      if (vpaLabel) vpaLabel.textContent = "QR locked until the form is complete";
      setUpiActionsEnabled(result, false);
      if (stickyPay) stickyPay.removeAttribute("href");
      if (configMissing && noteEl) {
        noteEl.textContent =
          "Set the official UPI ID in js/upi-config.js before taking live donations.";
        noteEl.style.color = "var(--wfd-primary)";
      }
      // Repaint the decoy once per lock, not on every keystroke.
      if (qrLockState !== "locked") {
        qrLockState = "locked";
        await renderUpiQr(scrambleQrData(), qrMount, {
          label: "Locked QR code placeholder",
        });
      }
      return;
    }

    if (noteEl && !upiForm.querySelector("[data-donate-submit]")?.disabled) {
      noteEl.textContent = "";
      noteEl.style.color = "";
    }

    const upiUri = buildUpiUri({ vpa, payeeName, amount, note });
    if (vpaLabel) vpaLabel.textContent = `Pay to ${vpa}`;

    setUpiActionsEnabled(result, true, upiUri);
    if (stickyPay) stickyPay.href = upiUri;
    if (stickyBar) stickyBar.classList.add("is-visible");
    stickyBar?.removeAttribute("hidden");

    qrLockState = upiUri;
    await renderUpiQr(upiUri, qrMount);
  }

  const upiForm = document.querySelector("[data-upi-form]");
  if (upiForm) {
    upiForm.addEventListener("submit", (e) => {
      e.preventDefault();
      submitDonation();
    });
    // Cause and donor name ride along in the UPI note, so the QR follows them
    upiForm.querySelector("[data-cause-select]")?.addEventListener("change", () => {
      resetPaymentDoneButton();
      refreshUpiPayment();
    });
    // Payment type renames the Payment Id field and decides if a QR applies
    upiForm.querySelector("[data-payment-type]")?.addEventListener("change", () => {
      syncPaymentIdLabel();
      resetPaymentDoneButton();
      refreshUpiPayment();
    });
    // Every required field feeds the QR lock, so re-check on any edit
    upiForm.querySelectorAll("input, select").forEach((el) => {
      el.addEventListener("input", () => {
        el.closest(".form-field")?.classList.remove("has-error");
        scheduleUpiRefresh();
      });
      el.addEventListener("change", scheduleUpiRefresh);
    });
    // Auto QR on first paint + whenever amount/cause/donor changes
    refreshUpiPayment();
    ["data-donor-first", "data-donor-last", "data-fundraiser"].forEach((sel) => {
      upiForm.querySelector(`[${sel}]`)?.addEventListener("change", scheduleUpiRefresh);
    });

    if (pendingGatewayAutofill) {
      applyGatewayAutofill(pendingGatewayAutofill, { source: "return" });
      pendingGatewayAutofill = null;
    }
  }

  document.querySelectorAll("form[data-mock]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = form.querySelector("[data-form-note]");
      if (note) {
        note.textContent =
          "Thanks for trying the prototype — this form doesn’t submit yet.";
        note.style.color = "var(--wfd-primary)";
      }
    });
  });

  // Kit selection
  document.querySelectorAll("[data-kit-group] .kit-card").forEach((card) => {
    card.addEventListener("click", () => {
      card.parentElement
        .querySelectorAll(".kit-card")
        .forEach((c) => c.classList.remove("is-selected"));
      card.classList.add("is-selected");
    });
  });

  // Accordion
  document.querySelectorAll(".accordion__trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".accordion__item");
      const panel = item.querySelector(".accordion__panel");
      const open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
      if (open) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      } else {
        panel.style.maxHeight = "0px";
      }
    });
  });

  // Impact tabs
  const tabs = document.querySelectorAll("[data-impact-tabs] .impact-tab");
  const panels = document.querySelectorAll("[data-impact-panels] .impact-panel");
  const visual = document.querySelector("[data-impact-visual]");
  const setImpactVisual = (panel) => {
    if (!visual || !panel?.dataset.visual) return;
    visual.src = panel.dataset.visual;
  };
  setImpactVisual(document.querySelector(".impact-panel.is-active"));
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.tab;
      tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
      panels.forEach((p) => {
        const active = p.dataset.panel === id;
        p.classList.toggle("is-active", active);
        if (active) setImpactVisual(p);
      });
    });
  });

  // Copy bank details
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add("is-copied");
        btn.textContent = "Copied";
        setTimeout(() => {
          btn.classList.remove("is-copied");
          btn.textContent = "Copy";
        }, 1600);
      } catch {
        btn.textContent = "Select manually";
      }
    });
  });

  // Photo carousels — random start on each refresh + auto-rotate
  function startCarousel({ items, dotsWrap, intervalMs, setActive, root }) {
    if (!items.length) return null;
    const state = { index: Math.floor(Math.random() * items.length), timer: null };
    const paint = () => {
      setActive(state.index);
      if (dotsWrap) {
        dotsWrap.querySelectorAll(".media-carousel__dot").forEach((dot, i) => {
          dot.classList.toggle("is-active", i === state.index);
        });
      }
    };
    const go = (i) => {
      state.index = ((i % items.length) + items.length) % items.length;
      paint();
    };
    const next = () => go(state.index + 1);
    const stop = () => {
      if (state.timer) clearInterval(state.timer);
      state.timer = null;
    };
    const play = () => {
      stop();
      if (items.length < 2 || reduced) return;
      state.timer = setInterval(next, intervalMs);
    };
    paint();
    play();
    if (root && items.length > 1 && !reduced) {
      root.addEventListener("mouseenter", stop);
      root.addEventListener("mouseleave", play);
      root.addEventListener("focusin", stop);
      root.addEventListener("focusout", play);
    }
    return { go, play, stop };
  }

  document.querySelectorAll("[data-hero-carousel]").forEach((hero) => {
    const slides = [...hero.querySelectorAll(".hero__slide")];
    startCarousel({
      items: slides,
      intervalMs: Number(hero.dataset.interval) || 5500,
      root: hero,
      setActive: (i) => {
        slides.forEach((slide, n) => slide.classList.toggle("is-active", n === i));
      },
    });
  });

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const slides = [...carousel.querySelectorAll(".media-carousel__slides img")];
    const dotsWrap = carousel.querySelector("[data-carousel-dots]");
    if (dotsWrap) {
      dotsWrap.innerHTML = slides
        .map(
          (_, i) =>
            `<button type="button" class="media-carousel__dot" aria-label="Show photo ${
              i + 1
            }" data-carousel-goto="${i}"></button>`
        )
        .join("");
    }
    const api = startCarousel({
      items: slides,
      dotsWrap,
      intervalMs: Number(carousel.dataset.interval) || 4500,
      root: carousel,
      setActive: (i) => {
        slides.forEach((slide, n) => slide.classList.toggle("is-active", n === i));
      },
    });
    dotsWrap?.querySelectorAll("[data-carousel-goto]").forEach((dot) => {
      dot.addEventListener("click", () => api?.go(Number(dot.dataset.carouselGoto)));
    });
  });

  document.querySelectorAll("[data-carousel-bg]").forEach((hero) => {
    const images = String(hero.dataset.images || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
      if (!images.length) return;
      startCarousel({
        items: images,
        intervalMs: Number(hero.dataset.interval) || 5000,
        root: hero,
        setActive: (i) => {
          hero.style.setProperty("--page-hero-image", `url('${images[i]}')`);
        },
      });
  });

  // Festival greeting bar — only on real festival dates from js/festivals.js
  const festiveBar = document.querySelector("[data-festive-bar]");
  const festiveLabel = document.querySelector("[data-festive-label]");
  const activeFestival = window.WFD_getActiveFestival
    ? window.WFD_getActiveFestival()
    : null;

  if (festiveBar && activeFestival) {
    festiveBar.hidden = false;
    festiveBar.classList.add("is-visible");
    document.body.classList.add("has-festive-bar");
    if (festiveLabel) {
      festiveLabel.textContent = `${activeFestival.emojis[0] || "🎉"} ${
        activeFestival.name
      }`;
    }
  }
})();
