import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function Cart() {
  const { items, change, remove, subtotal } = useCart();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const fr = language === 'fr';
  return (
    <motion.main initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="container-luxury py-16">
      <p className="eyebrow">{fr ? 'Votre sélection' : 'Your selection'}</p><h1 className="mt-2 font-display text-6xl">{fr ? 'Panier' : 'Shopping bag'}</h1>
      {!items.length ? <div className="py-24 text-center"><p className="font-display text-3xl">{fr ? 'Votre panier est vide.' : 'Your bag is waiting.'}</p><Link to="/perfumes" className="btn-primary mt-7">{fr ? 'Découvrir les parfums' : 'Discover perfumes'}</Link></div> :
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="divide-y border-y">{items.map((item) => <motion.div layout initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} key={item.key} className="flex gap-5 py-6">
            <img src={item.product.images[0]} alt={item.product.name} className="h-28 w-24 object-cover" />
            <div className="flex flex-1 justify-between"><div><p className="font-display text-2xl">{item.product.name}</p><p className="mt-1 text-xs uppercase tracking-widest text-copper">{item.size}</p><div className="mt-4 flex items-center gap-3"><button onClick={() => change(item.key, item.quantity - 1)} aria-label="Diminuer la quantité"><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => change(item.key, item.quantity + 1)} aria-label="Augmenter la quantité"><Plus size={14} /></button></div></div>
            <div className="text-right"><p>{Math.round(item.product.price * (1 - item.product.discount / 100)).toLocaleString()} DA</p><button aria-label="Retirer le produit" onClick={() => remove(item.key)} className="mt-4 text-plum/40 transition hover:text-copper dark:text-cream/40"><Trash2 size={16} /></button></div></div>
          </motion.div>)}</div>
          <aside className="h-fit bg-[#eee8df] p-7 dark:bg-[#291428]"><p className="eyebrow">{fr ? 'Résumé' : 'Summary'}</p><div className="mt-6 flex justify-between border-b pb-5 text-sm"><span>{fr ? 'Sous-total' : 'Subtotal'}</span><strong>{Math.round(subtotal).toLocaleString()} DA</strong></div><button onClick={() => navigate('/checkout')} className="btn-primary mt-7 w-full">{fr ? 'Commander' : 'Checkout'}</button><p className="mt-4 text-center text-xs opacity-60">{fr ? 'Paiement à la livraison' : 'Cash on Delivery'}</p></aside>
        </div>
      }
    </motion.main>
  );
}
