import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState(params.get('search') || '');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    api.get(`/products?${params}`).then((r) => {
      setProducts(r.data.products);
      setBrands(r.data.brands);
    }).catch(() => setProducts([]));
  }, [params]);

  const filter = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next);
  };
  const clearFilters = () => setParams(new URLSearchParams());
  const genderLabels = { Men: 'Hommes', Women: 'Femmes', Unisex: 'Mixte' };

  return (
    <main className="container-luxury py-16">
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">La collection</p>
          <h1 className="mt-2 font-display text-6xl">Parfums</h1>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); filter('search', search); }} className="flex w-full max-w-sm items-center border-b border-plum/30 py-3 dark:border-cream/30">
          <Search size={18} className="mr-3 text-copper" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nom, marque, note..." className="w-full bg-transparent text-sm outline-none" />
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.55 }} className="mt-10 overflow-hidden rounded-sm border border-plum/10 bg-[#f2ece3] dark:border-cream/10 dark:bg-[#291428]">
        <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} className="flex w-full items-center justify-between px-5 py-4 text-xs uppercase tracking-[0.18em] md:hidden">
          <span className="flex items-center gap-2"><SlidersHorizontal size={16} className="text-copper" />Filtres</span>
          {filtersOpen ? <X size={16} /> : <span className="text-copper">Voir</span>}
        </button>
        <div className={`${filtersOpen ? 'grid' : 'hidden'} grid-cols-1 gap-3 p-5 md:grid md:grid-cols-4 md:p-4`}>
          <label className="text-[10px] uppercase tracking-[0.18em] text-plum/50 dark:text-cream/50">Genre
            <select aria-label="Filtrer par genre" value={params.get('gender') || ''} onChange={(event) => filter('gender', event.target.value)} className="mt-2 h-11 w-full rounded-sm border border-plum/10 bg-cream px-3 text-xs normal-case tracking-normal outline-none transition focus:border-copper dark:border-cream/10 dark:bg-[#1b0c1a]">
              <option value="">Tous les genres</option>
              {Object.entries(genderLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
          </label>
          <label className="text-[10px] uppercase tracking-[0.18em] text-plum/50 dark:text-cream/50">Marque
            <select aria-label="Filtrer par marque" value={params.get('brand') || ''} onChange={(event) => filter('brand', event.target.value)} className="mt-2 h-11 w-full rounded-sm border border-plum/10 bg-cream px-3 text-xs normal-case tracking-normal outline-none transition focus:border-copper dark:border-cream/10 dark:bg-[#1b0c1a]">
              <option value="">Toutes les marques</option>
              {brands.map((brand) => <option key={brand}>{brand}</option>)}
            </select>
          </label>
          <label className="text-[10px] uppercase tracking-[0.18em] text-plum/50 dark:text-cream/50">Format
            <select aria-label="Filtrer par format" value={params.get('size') || ''} onChange={(event) => filter('size', event.target.value)} className="mt-2 h-11 w-full rounded-sm border border-plum/10 bg-cream px-3 text-xs normal-case tracking-normal outline-none transition focus:border-copper dark:border-cream/10 dark:bg-[#1b0c1a]">
              <option value="">Tous les formats</option><option>15ml</option><option>100ml</option>
            </select>
          </label>
          <button type="button" onClick={clearFilters} className="mt-5 h-11 border border-plum/15 px-4 text-xs uppercase tracking-[0.16em] transition hover:border-copper hover:text-copper dark:border-cream/15">Effacer</button>
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } }} className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-8">
        {products.map((product) => <motion.div key={product._id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } } }}><ProductCard product={product} /></motion.div>)}
      </motion.div>
      {!products.length && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center font-display text-3xl">Aucun parfum trouvé.</motion.p>}
    </main>
  );
}
