const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function parse(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return { y, m };
}

export function formatMonth(ym: string) {
  const { y, m } = parse(ym);
  return `${MONTHS[m - 1]} ${y}`;
}

export function duration(start: string, end?: string) {
  const s = parse(start);
  const now = new Date();
  const e = end ? parse(end) : { y: now.getFullYear(), m: now.getMonth() + 1 };
  const total = (e.y - s.y) * 12 + (e.m - s.m) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;
  return [years && `${years} yr${years > 1 ? "s" : ""}`, months && `${months} mo`]
    .filter(Boolean)
    .join(" ");
}

export function yearsOfExperience(firstStart: string) {
  const { y, m } = parse(firstStart);
  const now = new Date();
  // Inclusive month count, matching duration() above (Nov 2019 – Oct 2026 = 7 yrs).
  return Math.floor(((now.getFullYear() - y) * 12 + now.getMonth() + 1 - m + 1) / 12);
}
