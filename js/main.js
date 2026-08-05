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

  function getFormDonorName() {
    const mode = getDonateMode();
    if (mode === "employee") {
      return (
        document.querySelector("[data-emp-donor-name]")?.value ||
        document.querySelector("[data-donor-name]")?.value ||
        ""
      ).trim();
    }
    return (document.querySelector("[data-donor-name]")?.value || "").trim();
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
        "email",
        "phone",
        "pan",
        "pinCode",
        "cause",
        "amount",
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
        optionalField(r.email),
        optionalField(r.phone),
        optionalField(r.pan),
        optionalField(r.pinCode),
        optionalField(r.cause, "null"),
        r.amount ?? "null",
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
        '<tr><td colspan="13">No records yet. Mark a payment done on Donate first.</td></tr>';
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
          <td>${escapeHtml(optionalField(r.pinCode, "—"))}</td>
          <td>${escapeHtml(optionalField(r.cause, "—"))}</td>
          <td>₹${Number(r.amount || 0).toLocaleString("en-IN")}</td>
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
          ? `₹${formatAmountDisplay(amount)} · Minimum ₹100`
          : "Choose or type an amount (min ₹100).";
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
    return selected?.dataset.amount || "500";
  }

  function getDonateCause() {
    return (
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
    if (stickyAmount) stickyAmount.textContent = label;
    if (stickyCause) stickyCause.textContent = cause;
  }
  updateDonateSummary();
  syncAmountChips(parseAmountDigits(customAmount?.value) || 500);

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

    const aliases = {
      women: "women empowerment and hygiene",
      "women-empowerment": "women empowerment and hygiene",
      hygiene: "women empowerment and hygiene",
      child: "child education",
      "child-education": "child education",
      education: "child education",
      animal: "animal care",
      "animal-care": "animal care",
      dog: "animal care",
      dogs: "animal care",
      "dog-feeding": "animal care",
      emergency: "emergency & volunteer camp support",
      environment: "emergency & volunteer camp support",
      camp: "emergency & volunteer camp support",
    };
    if (aliases[want]) want = aliases[want];

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

    // Razorpay-available autofill only (no PAN / pin — not on Payments API)
    fill("[data-donor-name]", payload.name);
    fill("[data-emp-donor-name]", payload.name);
    fill("[data-donor-email]", payload.email);
    fill("[data-donor-phone]", payload.phone);
    fill("[data-gateway-txn]", payload.txnid);
    fill("[data-gateway-utr]", payload.utr);
    fill(
      "[data-gateway-status]",
      payload.status === "captured" || payload.status === "authorized"
        ? "success"
        : payload.status || "success"
    );

    if (payload.amount && customAmount) {
      const amount = parseAmountDigits(payload.amount);
      if (amount >= 100) {
        customAmount.value = formatAmountDisplay(amount);
        customAmount.dataset.raw = String(amount);
        syncAmountChips(amount);
        filled += 1;
      }
    }
    if (payload.cause && setCauseByLabel(payload.cause)) filled += 1;

    if (openReceipt) {
      const details = document.querySelector(".receipt-details");
      if (details) details.open = true;
    }

    updateDonateSummary();

    if (filled > 0) {
      const extra = [payload.method, payload.vpa].filter(Boolean).join(" · ");
      showGatewayBanner(
        source === "demo"
          ? `Razorpay demo payment loaded${extra ? ` (${extra})` : ""}. PAN & pin stay manual — Razorpay doesn’t return them.`
          : source === "callback"
            ? `Razorpay callback received${extra ? ` (${extra})` : ""}. Receipt details opened — add PAN/pin if you need 80G.`
            : `Filled from Razorpay payment fields${extra ? ` (${extra})` : ""}. Add PAN/pin yourself if you need 80G.`
      );
      if (resetPaid) resetPaymentDoneButton();
      scheduleUpiRefresh();
    }
    return filled > 0;
  }

  /** Demo payment.captured shaped like Razorpay, using the amount/cause on screen. */
  function buildDemoCallbackPayload() {
    const demo = { ...(gatewayConfig().demoPayment || {}) };
    const amount = Number(getDonateAmount() || 0);
    if (amount >= 100) demo.amount = Math.round(amount * 100);
    const cause = getDonateCause();
    if (cause) {
      demo.description = cause;
      demo.notes = { ...(demo.notes || {}), cause };
    }
    const stamp = Date.now().toString(36).toUpperCase();
    demo.id = `pay_Demo${stamp}`;
    demo.order_id = `order_Demo${stamp}`;
    if (!demo.acquirer_data?.rrn) {
      demo.acquirer_data = {
        ...(demo.acquirer_data || {}),
        rrn: String(Math.floor(1e11 + Math.random() * 9e11)),
      };
    }
    return parseGatewayPayload(demo);
  }

  function openTaxReceiptDetails() {
    const details = document.querySelector(".receipt-details");
    if (!details) return;
    details.open = true;
    details.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

  async function renderUpiQr(upiUri, mount) {
    if (!mount) return;
    mount.innerHTML = "";
    if (window.QRCode && typeof window.QRCode.toCanvas === "function") {
      const canvas = document.createElement("canvas");
      await window.QRCode.toCanvas(canvas, upiUri, {
        width: 196,
        margin: 1,
        color: { dark: "#161616", light: "#ffffff" },
      });
      mount.appendChild(canvas);
      return;
    }
    const img = document.createElement("img");
    img.alt = "UPI QR code";
    img.width = 196;
    img.height = 196;
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=196x196&data=${encodeURIComponent(
      upiUri
    )}`;
    mount.appendChild(img);
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
    const paidBtn = document.querySelector("[data-payment-done]");
    if (!paidBtn) return;
    paidBtn.disabled = false;
    paidBtn.classList.remove("is-loading");
    paidBtn.removeAttribute("aria-busy");
    paidBtn.textContent = "I’ve paid (demo)";
    const success = document.querySelector("[data-payment-success]");
    if (success) {
      success.hidden = true;
      success.classList.remove("is-visible");
    }
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

  /**
   * Demo flow: wait up to 5s for a Razorpay-shaped callback, autofill + open
   * tax-receipt details, then save the donation record.
   */
  async function recordDemoPayment() {
    const upiForm = document.querySelector("[data-upi-form]");
    if (!upiForm) return;
    const noteEl = upiForm.querySelector("[data-form-note]");
    const paidBtn = upiForm.querySelector("[data-payment-done]");
    const mode = getDonateMode();
    const employeeId =
      document.querySelector("[data-employee-id]")?.value || "";

    if (paidBtn?.disabled && paidBtn.classList.contains("is-loading")) return;
    if (paidBtn?.disabled && paidBtn.textContent === "Payment recorded") return;

    if (mode === "employee" && !getSessionEmployee()) {
      if (noteEl) {
        noteEl.textContent =
          "Log in with your employee ID before recording a payment.";
        noteEl.style.color = "var(--wfd-primary)";
      }
      document.querySelector("[data-login-id-inline]")?.focus();
      document
        .querySelector("[data-employee-gate]")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const amountNow = getDonateAmount();
    if (!amountNow || Number(amountNow) < 100) {
      if (noteEl) {
        noteEl.textContent = "Minimum donation amount is ₹100.";
        noteEl.style.color = "var(--wfd-primary)";
      }
      return;
    }

    const CALLBACK_WAIT_MS = 5000;
    setPaidButtonLoading(paidBtn, true, "Waiting for Razorpay…");
    if (noteEl) {
      noteEl.textContent =
        "Confirming with Razorpay (demo callback, up to 5 seconds)…";
      noteEl.style.color = "";
    }
    showGatewayBanner("Waiting for Razorpay payment.captured callback…");

    await new Promise((resolve) => setTimeout(resolve, CALLBACK_WAIT_MS));

    // Auto-fire Razorpay-shaped callback → fill receipt fields + open details
    applyGatewayAutofill(buildDemoCallbackPayload(), {
      openReceipt: mode === "donor",
      source: "callback",
      resetPaid: false,
    });
    if (mode === "donor") openTaxReceiptDetails();

    // Re-read form after autofill
    const donorNow = getFormDonorName();
    const emailNow =
      mode === "donor"
        ? (upiForm.querySelector("[data-donor-email]")?.value || "").trim()
        : "";
    const phoneNow =
      mode === "donor"
        ? (upiForm.querySelector("[data-donor-phone]")?.value || "").trim()
        : "";
    const panNow =
      mode === "donor"
        ? (upiForm.querySelector("[data-donor-pan]")?.value || "")
            .trim()
            .toUpperCase()
        : "";
    const pinNow =
      mode === "donor"
        ? (upiForm.querySelector("[data-donor-pin]")?.value || "").trim()
        : "";
    const fundraiserNow =
      mode === "employee"
        ? (upiForm.querySelector("[data-fundraiser]")?.value || "").trim()
        : "";
    const causeNow = getDonateCause();
    const amountAfter = getDonateAmount() || amountNow;

    if (emailNow && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNow)) {
      setPaidButtonLoading(paidBtn, false, "I’ve paid (demo)");
      if (noteEl) {
        noteEl.textContent = "Enter a valid email address, or leave it blank.";
        noteEl.style.color = "var(--wfd-primary)";
      }
      return;
    }
    if (phoneNow && !/^\d{10}$/.test(phoneNow)) {
      setPaidButtonLoading(paidBtn, false, "I’ve paid (demo)");
      if (noteEl) {
        noteEl.textContent =
          "Enter a valid 10-digit mobile number, or leave it blank.";
        noteEl.style.color = "var(--wfd-primary)";
      }
      return;
    }
    if (pinNow && !/^\d{6}$/.test(pinNow)) {
      setPaidButtonLoading(paidBtn, false, "I’ve paid (demo)");
      if (noteEl) {
        noteEl.textContent =
          "Enter a valid 6-digit pin code, or leave it blank.";
        noteEl.style.color = "var(--wfd-primary)";
      }
      return;
    }

    const transactionId = makeTxnId();
    const timeIST = formatIst();
    const donorName = donorDisplayName(donorNow);
    const gatewayTxnId = (
      upiForm.querySelector("[data-gateway-txn]")?.value || ""
    ).trim();
    const utrNow = (upiForm.querySelector("[data-gateway-utr]")?.value || "").trim();
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
      email: optionalField(emailNow),
      phone: optionalField(phoneNow),
      pan: optionalField(panNow),
      pinCode: optionalField(pinNow),
      cause: causeNow || "null",
      amount: Number(amountAfter),
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
    setPaidButtonLoading(paidBtn, false, "Payment recorded");
    if (paidBtn) paidBtn.disabled = true;
    if (noteEl) {
      noteEl.textContent =
        mode === "donor"
          ? "Razorpay fields filled. Add PAN/pin for 80G if needed, then share UTR on WhatsApp."
          : "Saved with your staff ID. Share the UTR on WhatsApp if you like.";
      noteEl.style.color = "";
    }
  }

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

    if (!vpa || vpa.includes("REPLACE")) {
      if (noteEl) {
        noteEl.textContent =
          "Set the official UPI ID in js/upi-config.js before taking live donations.";
        noteEl.style.color = "var(--wfd-primary)";
      }
      return;
    }

    if (!amount || Number(amount) < 100) {
      if (noteEl) {
        noteEl.textContent = "Minimum donation amount is ₹100.";
        noteEl.style.color = "var(--wfd-primary)";
      }
      return;
    }

    if (noteEl && !upiForm.querySelector("[data-payment-done]")?.disabled) {
      noteEl.textContent = "";
      noteEl.style.color = "";
    }

    const upiUri = buildUpiUri({ vpa, payeeName, amount, note });
    result.querySelector("[data-upi-amount-label]").textContent = `₹${Number(
      amount
    ).toLocaleString("en-IN")}`;
    result.querySelector("[data-upi-cause-label]").textContent = cause;
    result.querySelector("[data-upi-vpa]").textContent = `Pay to ${vpa}`;

    const launch = result.querySelector("[data-upi-launch]");
    if (launch) launch.href = upiUri;
    if (stickyPay) stickyPay.href = upiUri;
    if (stickyBar) stickyBar.classList.add("is-visible");
    stickyBar?.removeAttribute("hidden");

    const copyBtn = result.querySelector("[data-upi-copy]");
    if (copyBtn) {
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

    await renderUpiQr(upiUri, result.querySelector("[data-upi-qr]"));
  }

  const upiForm = document.querySelector("[data-upi-form]");
  if (upiForm) {
    upiForm.addEventListener("submit", (e) => e.preventDefault());
    upiForm.querySelector("[data-payment-done]")?.addEventListener("click", () => {
      recordDemoPayment();
    });
    // Live QR on first paint + whenever amount/cause changes
    refreshUpiPayment();
    ["data-donor-name", "data-emp-donor-name", "data-fundraiser"].forEach((sel) => {
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

  // Festival status bar + emoji bomb
  const festiveBar = document.querySelector("[data-festive-bar]");
  const festiveLabel = document.querySelector("[data-festive-label]");
  const DEMO_FESTIVAL = {
    id: "demo",
    name: "Festival vibes",
    emojis: ["🪔", "🎄", "🇮🇳", "🎨", "✨", "🎆", "🎁", "💛", "🧡", "💚"],
  };

  function showFestiveBar(festival) {
    if (!festiveBar || !festival) return;
    festiveBar.hidden = false;
    festiveBar.classList.add("is-visible");
    document.body.classList.add("has-festive-bar");
    if (festiveLabel) festiveLabel.textContent = `${festival.emojis[0] || "🎉"} ${festival.name}`;
  }

  function fireEmojiBomb(festival = DEMO_FESTIVAL) {
    showFestiveBar(festival);
    const layer = document.createElement("div");
    layer.className = "emoji-bomb";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    const emojis = festival.emojis?.length ? festival.emojis : DEMO_FESTIVAL.emojis;
    const count = reduced ? 12 : 42;
    for (let i = 0; i < count; i += 1) {
      const bit = document.createElement("span");
      bit.className = "emoji-bomb__bit";
      bit.textContent = emojis[i % emojis.length];
      const startX = 8 + Math.random() * 84;
      bit.style.left = `${startX}vw`;
      bit.style.setProperty("--dx", `${(Math.random() - 0.5) * 160}px`);
      bit.style.setProperty("--rot", `${(Math.random() - 0.5) * 540}deg`);
      bit.style.setProperty("--delay", `${Math.random() * 0.35}s`);
      bit.style.setProperty("--dur", `${1.4 + Math.random() * 1.1}s`);
      bit.style.fontSize = `${1.1 + Math.random() * 1.3}rem`;
      layer.appendChild(bit);
    }

    festiveBar?.classList.add("is-bombing");
    setTimeout(() => {
      layer.remove();
      festiveBar?.classList.remove("is-bombing");
    }, reduced ? 1600 : 2800);
  }

  const activeFestival = window.WFD_getActiveFestival
    ? window.WFD_getActiveFestival()
    : null;
  const launchFestival = activeFestival || DEMO_FESTIVAL;
  showFestiveBar({
    ...launchFestival,
    name: activeFestival ? activeFestival.name : "Festival mode · tap Demo",
  });
  // Once per page refresh (demo): emoji bomb from the status bar
  requestAnimationFrame(() => fireEmojiBomb(launchFestival));

  document.querySelectorAll("[data-festive-demo]").forEach((btn) => {
    btn.addEventListener("click", () => {
      fireEmojiBomb({
        ...launchFestival,
        name: activeFestival ? activeFestival.name : "Demo festival blast",
      });
    });
  });
})();
