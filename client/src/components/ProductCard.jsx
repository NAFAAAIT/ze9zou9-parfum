import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProductCard({ product }) {
  const { add } = useCart();
  const { language } = useLanguage();
  const fr = language === 'fr';
  const price = Math.round(product.price * (1 - product.discount / 100));
  const gender = fr
    ? ({ Men: 'Hommes', Women: 'Femmes', Unisex: 'Mixte' }[product.gender] || product.gender)
    : ({ Men: 'Men', Women: 'Women', Unisex: 'Unisex' }[product.gender] || product.gender);
  return (
    <motion.article whileHover={{ y: -6 }} transition={{ duration: 0.25, ease: 'easeOut' }} className="group">
      <Link to={`/perfumes/${product._id}`} className="relative block overflow-hidden bg-[#eee8df]">
        <img src={product.images[0]} alt={product.name} className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105" />
        {product.isNew && <span className="absolute left-3 top-3 bg-cream px-3 py-1 text-[10px] uppercase tracking-widest text-plum">{fr ? 'Nouveau' : 'New'}</span>}
      </Link>
      <div className="pt-4">
        <p className="text-[10px] uppercase tracking-[.2em] text-copper">{product.brand} · {gender}</p>
        <Link to={`/perfumes/${product._id}`} className="mt-1 block font-display text-2xl transition hover:text-copper">{product.name}</Link>
        <div className="mt-2 flex items-center justify-between">
          <div>{product.discount > 0 && <span className="mr-2 text-sm text-plum/40 line-through dark:text-cream/40">{product.price.toLocaleString()} DA</span>}<span className="font-medium">{price.toLocaleString()} DA</span></div>
          <motion.button whileTap={{ scale: 0.85 }} aria-label={`Ajouter ${product.name} au panier`} onClick={() => add(product)} disabled={!product.stock} className="text-copper disabled:opacity-30"><ShoppingBag size={18} /></motion.button>
        </div>
      </div>
    </motion.article>
  );
}
