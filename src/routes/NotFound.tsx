import { motion } from 'motion/react';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { TLink } from '../lib/transition';
import { EASE } from '../components/ui';

export default function NotFound() {
  return (
    <>
      <Seo title="404" noindex path="/404" />
      <section className="px-5 md:px-10 pt-32 md:pt-44 min-h-[72vh]">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [...EASE] }}
          className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-bone"
        >
          [ 404 ]
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.15, ease: [...EASE] }}
          className="mt-8 font-sans font-semibold uppercase tracking-[-0.03em] leading-[0.88] text-[clamp(3.5rem,14vw,12rem)]"
        >
          nyasar<span className="text-bone/40">.</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.4, ease: [...EASE] }}
          className="mt-10 md:ml-[40vw]"
        >
          <p className="text-[15px] leading-relaxed text-bone/85 max-w-[34ch]">
            Halaman yang kamu cari nggak ada — mungkin belum dibuat, atau sudah
            dihapus karena keisengan.
          </p>
          <TLink
            to="/"
            className="group inline-block mt-8 font-sans font-medium text-lg underline underline-offset-8 decoration-bone/30 hover:decoration-bone transition-all"
          >
            ← balik ke index
          </TLink>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
