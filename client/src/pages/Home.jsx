import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/products?featured=true&limit=4').then((response) => setFeatured(response.data.products)).catch(() => {});
  }, []);

  const genderCards = [
    { gender: 'Men', label: 'Hommes', image: '/images/products/bois-dazur.jpg' },
    { gender: 'Women', label: 'Femmes', image: '/images/products/rose-majeste.jpg' },
    { gender: 'Unisex', label: 'Mixte', image: '/images/products/ambre-atlas.jpg' }
  ];

  return (
    <>
      <section className="overflow-hidden bg-plum text-cream">
        <div className="container-luxury grid min-h-[620px] items-center gap-10 py-20 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <p className="eyebrow text-gold">L'art de la présence</p>
            <h1 className="mt-5 max-w-xl font-display text-6xl leading-[.9] sm:text-8xl">Un parfum qui devient entièrement <i>vôtre.</i></h1>
            <p className="mt-7 max-w-md text-cream/65">Découvrez des Eau de Parfum composées avec soin pour chaque instant, humeur et souvenir.</p>
            <Link to="/perfumes" className="btn-primary mt-9">Découvrir les parfums <ArrowRight size={16} className="ml-3" /></Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12, duration: 0.75, ease: 'easeOut' }} className="relative mx-auto max-w-md">
            <img src="/images/products/noir-sillage.jpg" alt="Flacon de parfum élégant" className="aspect-[4/5] w-full object-cover" />
          </motion.div>
        </div>
      </section>

      <section className="container-luxury py-24">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Sélection soignée</p>
            <h2 className="mt-2 font-display text-5xl">Les signatures</h2>
          </div>
          <Link to="/perfumes" className="hidden text-xs uppercase tracking-widest text-copper transition hover:text-plum sm:block">Tout voir →</Link>
        </div>
        <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } }} className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-8">
          {featured.map((product) => (
            <motion.div key={product._id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } } }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="bg-[#eee8df] py-24 dark:bg-[#291428]">
        <div className="container-luxury">
          <p className="eyebrow">Trouvez votre accord</p>
          <h2 className="mt-2 font-display text-5xl">Acheter par univers</h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } }} className="mt-10 grid gap-4 sm:grid-cols-3">
            {genderCards.map((item) => (
              <motion.div key={item.gender} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } } }}>
                <Link to={`/perfumes?gender=${item.gender}`} className="group relative block min-h-72 overflow-hidden bg-plum p-8 text-cream">
                  <img src={item.image} alt={`Collection ${item.label}`} className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-105 group-hover:opacity-70" />
                  <span className="relative block pt-44 font-display text-4xl">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="container-luxury py-24 text-center">
        <p className="eyebrow">Notre philosophie</p>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-5xl">La chose la plus personnelle que vous portez est invisible.</h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-plum/60 dark:text-cream/60">Ze9zou9 Parfum réunit des compositions modernes et des matières intemporelles, pour créer une signature unique.</p>
        <Link to="/about" className="btn-primary mt-8">Découvrir notre histoire</Link>
      </section>
    </>
  );
}
