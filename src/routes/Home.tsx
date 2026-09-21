import Footer from '../components/Footer';
import Seo from '../components/Seo';
import HomeHero from '../sections/HomeHero';
import HomeWorks from '../sections/HomeWorks';
import HomeManifesto from '../sections/HomeManifesto';

/** Landing: tiga babak + footer. Tiap babak punya file sendiri di `sections/`. */
export default function Home() {
  return (
    <>
      <Seo />
      <HomeHero />
      <HomeWorks />
      <HomeManifesto />
      <Footer giant={false} />
    </>
  );
}
