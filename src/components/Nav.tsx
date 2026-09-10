import { useLocation } from 'react-router-dom';
import { useJakartaTime } from '../hooks/useJakartaTime';
import { useGo } from '../lib/transition';

const LINKS = [
  { to: '/', label: 'index' },
  { to: '/about', label: 'about' },
  { to: '/contact', label: 'contact' },
];

export default function Nav() {
  const time = useJakartaTime(false);
  const pathname = useLocation().pathname;
  const go = useGo();

  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference text-[#EAE8E1]">
      <nav aria-label="Navigasi utama" className="flex items-center justify-between px-5 md:px-10 py-5">
        <button
          onClick={() => go('/')}
          className="font-sans font-medium tracking-tight text-[17px] leading-none cursor-pointer"
          aria-label="wah:anggaaa — ke halaman index"
        >
          wah:anggaaa<sup className="font-mono text-[9px] ml-0.5">®</sup>
        </button>

        <div className="flex items-center gap-5 md:gap-8">
          {LINKS.map((l) => {
            const active = pathname === l.to;
            return (
              <button
                key={l.to}
                onClick={() => go(l.to)}
                aria-current={active ? 'page' : undefined}
                className={`font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-100 cursor-pointer ${
                  active ? 'opacity-100' : 'opacity-55'
                }`}
              >
                {active ? `[ ${l.label} ]` : l.label}
              </button>
            );
          })}
        </div>

        <p className="hidden md:block font-mono text-[11px] tracking-[0.18em] uppercase opacity-55">
          jkt — {time}
        </p>
      </nav>
    </header>
  );
}
