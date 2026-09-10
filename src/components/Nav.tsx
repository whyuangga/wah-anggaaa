import { NavLink } from 'react-router-dom';
import { useJakartaTime } from '../hooks/useJakartaTime';

const LINKS = [
  { to: '/', label: 'index', end: true },
  { to: '/about', label: 'about', end: false },
  { to: '/contact', label: 'contact', end: false },
];

export default function Nav() {
  const time = useJakartaTime(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference text-[#EAE8E1]">
      <nav className="flex items-center justify-between px-5 md:px-10 py-5">
        <NavLink
          to="/"
          className="font-sans font-medium tracking-tight text-[17px] leading-none"
        >
          wah:anggaaa<sup className="font-mono text-[9px] ml-0.5">®</sup>
        </NavLink>

        <div className="flex items-center gap-5 md:gap-8">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-100 ${
                  isActive ? 'opacity-100' : 'opacity-55'
                }`
              }
            >
              {({ isActive }) => (isActive ? `[ ${l.label} ]` : l.label)}
            </NavLink>
          ))}
        </div>

        <p className="hidden md:block font-mono text-[11px] tracking-[0.18em] uppercase opacity-55">
          jkt — {time}
        </p>
      </nav>
    </header>
  );
}
