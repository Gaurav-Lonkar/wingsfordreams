/**
 * Mock employee directory — login with these IDs on the private staff page.
 * The staff URL is also declared here so logout / redirects stay in sync with
 * generate.py (STAFF_DIR).
 */
window.WFD_EMPLOYEES = [
  { id: "E001", name: "Priya Sharma" },
  { id: "E002", name: "Arjun Mehta" },
  { id: "E003", name: "Neha Patil" },
];

window.WFD_STAFF_LOGIN = "staff-0ef85eac/";
window.WFD_SESSION_KEY = "wfd_employee";
window.WFD_TXN_KEY = "wfd_donations";
