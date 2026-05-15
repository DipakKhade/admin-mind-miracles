const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function toDate(value: string): Date | null {
  if (!value) return null;

  let date: Date;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    date = new Date(value + "T00:00:00");
  } else {
    date = new Date(value);
  }

  return isNaN(date.getTime()) ? null : date;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function formatDate(value: string): string {
  const date = toDate(value);
  if (!date) return value || "—";

  return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
}

export function formatDateTime(value: string): string {
  const date = toDate(value);
  if (!date) return value || "—";

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;

  return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}, ${h}:${pad(minutes)} ${ampm}`;
}
