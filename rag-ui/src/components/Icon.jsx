// Kumpulan ikon inline SVG (tanpa dependency eksternal).
// Dipakai di seluruh UI: sidebar, status dokumen, aksi, dsb.

const paths = {
  dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  documents:
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
  chat: "M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM7 9h10v2H7V9zm0 4h7v2H7v-2z",
  evaluations:
    "M3 3v18h18v-2H5V3H3zm4 12h2v4H7v-4zm4-6h2v10h-2V9zm4 3h2v7h-2v-7zm4-6h2v13h-2V6z",
  profile:
    "M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z",
  upload: "M12 2 7 7h3v6h4V7h3l-5-5zM5 18v2h14v-2H5z",
  search: "M21 20l-5.6-5.6a7 7 0 1 0-1.4 1.4L20 21l1-1zM4 10a6 6 0 1 1 12 0 6 6 0 0 1-12 0z",
  retry:
    "M12 6V3L8 7l4 4V8a4 4 0 1 1-4 4H6a6 6 0 1 0 6-6z",
  trash:
    "M6 7h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7zm3-3h6l1 2H8l1-2zM4 6h16v2H4V6z",
  stop: "M6 6h12v12H6z",
  send: "M2 21l21-9L2 3v7l15 2-15 2v7z",
  check: "M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z",
  warning:
    "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
  clock: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 11h-5v-2h3V7h2v6z",
  logout:
    "M10 17v-2H3v-2h7V9l5 4-5 4zM19 3H5a2 2 0 0 0-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z",
  close: "M18.3 5.7 12 12l6.3 6.3-1.4 1.4L12 14.8l-6.3 6.3-1.4-1.4L10.6 12 4.3 5.7l1.4-1.4L12 10.6l6.3-6.3z",
  menu: "M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z",
  layers:
    "M12 2 2 7l10 5 10-5-10-5zm0 7.5L5 6l7-3.5L19 6l-7 3.5zM2 12l10 5 10-5-2-1-8 4-8-4-2 1zm0 5 10 5 10-5-2-1-8 4-8-4-2 1z",
  spark: "M12 2 9 9l-7 3 7 3 3 7 3-7 7-3-7-3-3-7z",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm3 16H7v-2h10v2zm0-4H7v-2h10v2zm-4-5V3.5L18.5 9H13z",
  lock: "M12 1a5 5 0 0 0-5 5v3H5v12h14V9h-2V6a5 5 0 0 0-5-5zm3 8H9V6a3 3 0 1 1 6 0v3z",
  plus: "M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z",
  chevronRight: "M9 6l6 6-6 6-1.4-1.4L12.2 12 7.6 7.4 9 6z",
  info: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
};

export default function Icon({ name, className = "w-5 h-5", ...rest }) {
  const d = paths[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}
