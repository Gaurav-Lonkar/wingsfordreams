/**
 * Festival calendar for the greeting bar.
 *
 * The bar appears at midnight WFD_FESTIVAL_LEAD_DAYS before the festival and
 * disappears at midnight once the festival day is over.
 *
 * Fixed-date festivals use `month` / `day`. Lunar festivals move every year, so
 * they list one "MM-DD" per year and MUST be topped up before the last listed
 * year passes — an unlisted year simply shows no bar. Dates below follow the
 * DoPT central gazetted holiday list; Islamic dates are subject to moon
 * sighting and may shift by a day.
 */
window.WFD_FESTIVAL_LEAD_DAYS = 3;

window.WFD_FESTIVALS = [
  {
    id: "newyear",
    name: "Happy New Year",
    emojis: ["🎉", "🥳", "✨", "🥂", "🌟"],
    month: 1,
    day: 1,
  },
  {
    id: "sankranti",
    name: "Happy Makar Sankranti",
    emojis: ["🪁", "☀️", "🌾", "💛", "✨"],
    month: 1,
    day: 14,
  },
  {
    id: "republic",
    name: "Happy Republic Day",
    emojis: ["🇮🇳", "🎖️", "✨", "💚", "🧡"],
    month: 1,
    day: 26,
  },
  {
    id: "holi",
    name: "Happy Holi",
    emojis: ["🎨", "🌈", "💗", "💛", "💚", "✨"],
    dates: { 2026: "03-04", 2027: "03-23", 2028: "03-11" },
  },
  {
    id: "eid",
    name: "Eid Mubarak",
    emojis: ["🌙", "⭐", "🕌", "💚", "✨"],
    dates: { 2026: "03-21", 2027: "03-10", 2028: "02-27" },
  },
  {
    id: "independence",
    name: "Happy Independence Day",
    emojis: ["🇮🇳", "🧡", "🤍", "💚", "🎆", "✨"],
    month: 8,
    day: 15,
  },
  {
    id: "ganesh",
    name: "Ganesh Chaturthi",
    emojis: ["🙏", "🌺", "🧡", "✨", "🥁"],
    dates: { 2026: "09-14", 2027: "09-04", 2028: "08-23" },
  },
  {
    id: "navratri",
    name: "Happy Navratri",
    emojis: ["💃", "🪔", "🌸", "🧡", "✨"],
    dates: { 2026: "10-11", 2027: "09-30", 2028: "09-19" },
  },
  {
    id: "diwali",
    name: "Happy Diwali",
    emojis: ["🪔", "✨", "🎆", "💛", "🧡", "💫"],
    dates: { 2026: "11-08", 2027: "10-29", 2028: "10-17" },
  },
  {
    id: "christmas",
    name: "Merry Christmas",
    emojis: ["🎄", "⭐", "🎁", "❄️", "❤️", "✨"],
    month: 12,
    day: 25,
  },
];

/** Local-midnight Date for a festival in a given year, or null if unlisted. */
window.WFD_getFestivalDate = function getFestivalDate(festival, year) {
  if (festival.month) return new Date(year, festival.month - 1, festival.day);
  const md = (festival.dates || {})[year];
  if (!md) return null;
  const [month, day] = md.split("-").map(Number);
  if (!month || !day) return null;
  return new Date(year, month - 1, day);
};

/**
 * The festival whose greeting window covers `now`, or null. Neighbouring years
 * are checked too so a window that opens in late December (New Year) or spans a
 * year boundary still resolves.
 */
window.WFD_getActiveFestival = function getActiveFestival(now = new Date()) {
  const lead = Number(window.WFD_FESTIVAL_LEAD_DAYS);
  const leadDays = Number.isFinite(lead) && lead >= 0 ? lead : 3;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const festivals = window.WFD_FESTIVALS || [];
  const years = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

  for (const year of years) {
    for (const festival of festivals) {
      const date = window.WFD_getFestivalDate(festival, year);
      if (!date) continue;
      const start = new Date(date);
      start.setDate(start.getDate() - leadDays);
      // Midnight after the festival day: the bar is gone once the day ends.
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      if (today >= start && now < end) return { ...festival, date };
    }
  }
  return null;
};
