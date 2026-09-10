import { Link } from 'react-router-dom';
import { useJakartaTime } from '../hooks/useJakartaTime';

export default function Footer() {
  const time = useJakartaTime();

  return (
    <footer className="relative px-5 md:px-10 pt-20 md:pt-28 pb-6">
      <Link to="/" aria-label="Back to index">
        <p className="font-sans font-semibold uppercase tracking-[-0.03em] leading-[0.85] text-[clamp(3rem,12vw,12rem)] whitespace-nowrap hover:opacity-80 transition-opacity">
          wah:anggaaa
        </p>
      </Link>

      <div className="rule h-px w-full mt-10 md:mt-14" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-bone/50">
        <p>© 2026 wah:anggaaa</p>
        <div className="flex items-center gap-6">
          <Link to="/about" className="hover:text-bone transition-colors">about</Link>
          <Link to="/contact" className="hover:text-bone transition-colors">contact</Link>
        </div>
        <p>
          jakarta — {time} <span className="text-bone/30">[ just for fun ]</span>
        </p>
      </div>
    </footer>
  );
}
