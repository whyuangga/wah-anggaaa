import { useEffect, useState } from 'react';

/** Jam Jakarta (WIB) yang hidup. Dipakai di nav sebagai `JKT 20:32`. */
export function useJakartaTime(): string {
  const [waktu, setWaktu] = useState(format);

  useEffect(() => {
    const id = window.setInterval(() => setWaktu(format()), 1000 * 10); // cukup menit
    return () => window.clearInterval(id);
  }, []);

  return waktu;
}

function format(): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());
}
