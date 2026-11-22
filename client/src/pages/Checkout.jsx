import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function Checkout() {
  const { items, subtotal } = useCart();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const fr = language === 'fr';
  const [form, setForm] = useState({ customerName: '', phone: '', wilaya: 'Alger', commune: '', address: '' });
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post('/orders', { ...form, items: items.map((item) => ({ product: item.product._id, size: item.size, quantity: item.quantity })) });
      localStorage.removeItem('zp-cart');
      navigate(`/order-confirmed/${data.orderNumber}`);
    } catch (requestError) { setError(requestError.response?.data?.message || (fr ? 'Impossible de confirmer la commande.' : 'Unable to place order.')); }
  };
  if (!items.length) return <main className="container-luxury py-24 text-center"><p>{fr ? 'Votre panier est vide.' : 'Your bag is empty.'}</p></main>;
  return (
    <main className="container-luxury py-16">
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}><p className="eyebrow">{fr ? 'Presque à vous' : 'Almost yours'}</p><h1 className="mt-2 font-display text-6xl">{fr ? 'Informations de livraison' : 'Delivery details'}</h1></motion.div>
      <form onSubmit={submit} className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="grid gap-5 sm:grid-cols-2">
          {[
            ['customerName', fr ? 'Nom complet' : 'Full name'],
            ['phone', fr ? 'Numéro de téléphone' : 'Phone number'],
            ['wilaya', 'Wilaya'],
            ['commune', fr ? 'Commune' : 'Municipality']
          ].map(([key, label]) => <label key={key} className="text-xs uppercase tracking-widest">{label}<input required value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="mt-2 w-full border-b bg-transparent py-3 text-sm normal-case tracking-normal outline-none focus:border-copper" /></label>)}
          <label className="text-xs uppercase tracking-widest sm:col-span-2">{fr ? 'Adresse' : 'Address'}<textarea required rows="3" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} className="mt-2 w-full border-b bg-transparent py-3 text-sm normal-case tracking-normal outline-none focus:border-copper" /></label>
          {error && <p className="text-sm text-red-700 sm:col-span-2">{error}</p>}
        </motion.div>
        <aside className="h-fit bg-[#eee8df] p-7 dark:bg-[#291428]"><p className="eyebrow">{fr ? 'Votre commande' : 'Your order'}</p><div className="mt-5 space-y-3 text-sm">{items.map((item) => <div className="flex justify-between" key={item.key}><span>{item.product.name} × {item.quantity}</span><span>{Math.round(item.product.price * (1 - item.product.discount / 100) * item.quantity).toLocaleString()} DA</span></div>)}</div><div className="mt-5 border-t pt-5 font-semibold">{fr ? 'Total' : 'Total'} <span className="float-right">{Math.round(subtotal).toLocaleString()} DA</span></div><button className="btn-primary mt-7 w-full">{fr ? 'Confirmer la commande' : 'Place order'}</button></aside>
      </form>
    </main>
  );
}
