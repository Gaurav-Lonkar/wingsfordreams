/**
 * Indian + major festival calendar for festive emoji celebrations.
 * Windows are approximate (lunar festivals vary by year).
 */
window.WFD_FESTIVALS = [
  {
    id: "republic",
    name: "Happy Republic Day",
    emojis: ["🇮🇳", "🎖️", "✨", "💚", "🧡"],
    match: (d) => d.getMonth() === 0 && d.getDate() >= 24 && d.getDate() <= 28,
  },
  {
    id: "sankranti",
    name: "Happy Makar Sankranti",
    emojis: ["🪁", "☀️", "🌾", "💛", "✨"],
    match: (d) => d.getMonth() === 0 && d.getDate() >= 13 && d.getDate() <= 16,
  },
  {
    id: "holi",
    name: "Happy Holi",
    emojis: ["🎨", "🌈", "💗", "💛", "💚", "✨"],
    // ~early March window
    match: (d) => d.getMonth() === 2 && d.getDate() >= 1 && d.getDate() <= 15,
  },
  {
    id: "eid",
    name: "Eid Mubarak",
    emojis: ["🌙", "⭐", "🕌", "💚", "✨"],
    // loose spring window for demo coverage
    match: (d) => d.getMonth() === 2 && d.getDate() >= 16 && d.getDate() <= 31,
  },
  {
    id: "independence",
    name: "Happy Independence Day",
    emojis: ["🇮🇳", "🧡", "🤍", "💚", "🎆", "✨"],
    match: (d) => d.getMonth() === 7 && d.getDate() >= 12 && d.getDate() <= 17,
  },
  {
    id: "ganesh",
    name: "Ganesh Chaturthi",
    emojis: ["🙏", "🌺", "🧡", "✨", "🥁"],
    match: (d) =>
      (d.getMonth() === 7 && d.getDate() >= 25) ||
      (d.getMonth() === 8 && d.getDate() <= 10),
  },
  {
    id: "navratri",
    name: "Happy Navratri",
    emojis: ["💃", "🪔", "🌸", "🧡", "✨"],
    match: (d) =>
      (d.getMonth() === 8 && d.getDate() >= 20) ||
      (d.getMonth() === 9 && d.getDate() <= 5),
  },
  {
    id: "diwali",
    name: "Happy Diwali",
    emojis: ["🪔", "✨", "🎆", "💛", "🧡", "💫"],
    match: (d) =>
      (d.getMonth() === 9 && d.getDate() >= 20) ||
      (d.getMonth() === 10 && d.getDate() <= 15),
  },
  {
    id: "christmas",
    name: "Merry Christmas",
    emojis: ["🎄", "⭐", "🎁", "❄️", "❤️", "✨"],
    match: (d) => d.getMonth() === 11 && d.getDate() >= 20 && d.getDate() <= 31,
  },
  {
    id: "newyear",
    name: "Happy New Year",
    emojis: ["🎉", "🥳", "✨", "🥂", "🌟"],
    match: (d) => d.getMonth() === 0 && d.getDate() === 1,
  },
];

window.WFD_getActiveFestival = function getActiveFestival(date = new Date()) {
  return (window.WFD_FESTIVALS || []).find((f) => f.match(date)) || null;
};
